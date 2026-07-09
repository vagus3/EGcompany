# 계정 기반 터미널 진행도 저장 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 터미널 ARG 게임의 진행도(스테이지 진행 + phase1 서명 테스트 통과 여부)를 브라우저 `localStorage`가 아니라 로그인 계정(DB)에 묶어 저장하고, 로그인 시 서버가 확실히 초기화하도록 만든다.

**Architecture:** Prisma에 `TerminalState` 모델(계정당 1행)을 추가하고, `GET/PATCH /api/terminal/state`(전용)와 `GET /api/auth/me`(확장)로 노출한다. 클라이언트는 표준 요청-응답 패턴을 따른다 — 액션 발생 시 PATCH를 보내고, 응답으로 온 최신 상태로 로컬 state를 교체한다(낙관적 업데이트 없음). 배열 병합/스테이지 전이 계산은 전부 서버가 수행해 동시성 문제를 방지한다.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, Prisma 7 + `@prisma/adapter-libsql`(Turso), Zod, TypeScript. 테스트 프레임워크가 프로젝트에 없으므로(package.json에 test 스크립트 없음) 검증은 `tsc --noEmit` + `eslint` + Playwright(스크래치 디렉터리에 임시 설치, 이번 세션에서 검증된 방식) + Prisma Client를 직접 호출하는 1회성 Node 스크립트로 진행한다.

## Global Constraints

- `selectedMailId`는 서버에 저장하지 않는다 — 순수 열람 상태로 클라이언트 로컬에만 둔다.
- PATCH는 클라이언트가 배열을 통째로 계산해서 보내지 않는다 — `completeChallenge`/`passAdminTest` 두 액션만 존재하며, 배열 병합과 스테이지 전이는 서버가 계산한다.
- `TerminalClient.tsx`의 `popstate` 리스너(뒤로/앞으로가기 시 페이지 인스턴스 재사용 문제의 안전장치)는 반드시 유지하고, 호출 대상만 서버 GET으로 바꾼다.
- GET/PATCH 실패 시 기본값으로 조용히 폴백하지 않는다 — 에러 상태를 명시적으로 보여준다.
- 퍼즐 정답 검증(부정 방지)은 이번 스코프에 포함하지 않는다.
- 기존 `Room`/`Puzzle`/`Progress`(범용 템플릿 잔재) 모델은 건드리지 않는다.
- `DATABASE_URL`은 로컬 환경에서도 운영 Turso DB를 가리킨다 — 마이그레이션은 순수 추가(additive)만 하고, 적용 전 생성된 SQL을 검토한다.

참고 스펙: `docs/superpowers/specs/2026-07-09-account-scoped-terminal-progress-design.md`

---

## Task 1: Prisma 스키마 — `TerminalState` 모델 추가 + 마이그레이션

**Files:**
- Modify: `prisma/schema.prisma`

**Interfaces:**
- Produces: `TerminalState` 모델(필드: `id`, `userId`, `currentStage`, `unlockedMailIds`, `completedChallengeIds`, `adminTestRequired`, `adminTestPassed`, `updatedAt`), `User.terminalState` 관계. 이후 모든 태스크가 이 모델을 사용한다.

- [ ] **Step 1: `User` 모델에 관계 필드 추가**

`prisma/schema.prisma`에서 `model User { ... }` 블록의 `sessions Session[]` 줄 바로 아래에 한 줄 추가:

```prisma
  progresses     Progress[]
  sessions       Session[]
  terminalState  TerminalState?
```

- [ ] **Step 2: `TerminalState` 모델 추가**

`model Session { ... }` 블록 바로 다음에 새 모델을 추가한다:

```prisma
model TerminalState {
  id                    String   @id @default(cuid())
  userId                String   @unique
  currentStage          String   @default("pin-select")
  unlockedMailIds       Json
  completedChallengeIds Json
  adminTestRequired     Boolean  @default(true)
  adminTestPassed       Boolean  @default(false)
  updatedAt             DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

- [ ] **Step 3: 마이그레이션 생성 및 적용**

Run: `cd c:\Users\hyeonggyu\escapeWeb && npx prisma migrate dev --name add_terminal_state`

Expected: `prisma/migrations/<timestamp>_add_terminal_state/migration.sql` 파일이 생성되고 "Your database is now in sync with your schema" 메시지가 뜬다.

만약 Turso(libSQL) 원격 DB 특성상 shadow database 관련 에러가 나면(`Error: P3014` 등), 대신 아래로 진행:
```
npx prisma db push
```
이 경우 `prisma/migrations` 폴더가 생기지 않으니, Step 4에서 실제 반영된 스키마를 직접 확인한다.

- [ ] **Step 4: 생성된 SQL이 순수 추가(additive)인지 확인**

`migrate dev`를 썼다면 생성된 `migration.sql` 파일을 읽어서 `CREATE TABLE "TerminalState"`와 `CREATE UNIQUE INDEX`만 있고 기존 테이블에 대한 `ALTER`/`DROP`이 없는지 확인한다.

Run (둘 중 방식에 안 맞는 경우가 있으면 생략):
```bash
cat "c:\Users\hyeonggyu\escapeWeb\prisma\migrations\"*add_terminal_state*"\migration.sql"
```

Expected: `CREATE TABLE`/`CREATE UNIQUE INDEX` 구문만 존재.

- [ ] **Step 5: Prisma Client 재생성 및 타입 확인**

Run: `npx prisma generate`
Run: `npx tsc --noEmit -p tsconfig.json`

Expected: 둘 다 에러 없이 완료.

- [ ] **Step 6: 실제 테이블 생성 여부를 Node 스크립트로 직접 확인**

`C:\Users\HYEONG~1\AppData\Local\Temp\claude\...\scratchpad\verify-schema.mjs` 같은 임시 파일(프로젝트 바깥, 스크래치 디렉터리)에 작성:

```js
require("dotenv").config({ path: "c:/Users/hyeonggyu/escapeWeb/.env.local" });
const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

(async () => {
  const count = await prisma.terminalState.count();
  console.log(JSON.stringify({ terminalStateCount: count }));
  await prisma.$disconnect();
})();
```

Run (프로젝트의 `node_modules`를 쓰도록 프로젝트 디렉터리에서 실행하거나, 해당 스크립트를 `c:\Users\hyeonggyu\escapeWeb`에 임시로 복사해서 실행):
```bash
cd c:\Users\hyeonggyu\escapeWeb && node verify-schema.mjs
```

Expected: `{"terminalStateCount":0}` (테이블은 생겼지만 아직 행이 없음). 확인 후 `verify-schema.mjs` 삭제.

- [ ] **Step 7: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: TerminalState 모델 추가 — 계정별 터미널 진행도 저장용"
```

---

## Task 2: 터미널 스테이지 상수를 `terminal-data.ts`로 이전, `selectedMailId` 제거

**Files:**
- Modify: `src/lib/terminal-data.ts`
- Modify: `src/app/portals/security/terminal/TerminalClient.tsx:1-53` (이 태스크에서는 import만 정리, 나머지는 Task 6/7에서)

**Interfaces:**
- Consumes: 없음 (순수 데이터 파일 리팩터링)
- Produces: `terminal-data.ts`에서 새로 export되는 `challengeIds`, `stageOrder`, `getMailForStage(stage: TerminalStage): TerminalMail` — Task 3(서버 헬퍼)과 Task 6/7(클라이언트)이 그대로 import해서 쓴다. `TerminalProgress` 인터페이스에서 `selectedMailId` 필드 제거.

- [ ] **Step 1: `TerminalProgress`에서 `selectedMailId` 제거**

`src/lib/terminal-data.ts:38-43`을 다음으로 교체:

```ts
export interface TerminalProgress {
  currentStage: TerminalStage;
  unlockedMailIds: string[];
  completedChallengeIds: string[];
}
```

- [ ] **Step 2: `TERMINAL_PROGRESS_STORAGE_KEY` export 제거**

`src/lib/terminal-data.ts:1`의 다음 줄을 삭제:
```ts
export const TERMINAL_PROGRESS_STORAGE_KEY = "terminal-progress-v1";
```
(같은 줄에 있던 `PRETEXT_LETTER_POSITIONS_STORAGE_KEY`는 그대로 둔다 — 계속 사용됨.)

- [ ] **Step 3: `challengeIds`/`stageOrder`/`getMailForStage` 추가**

`src/lib/terminal-data.ts` 파일 맨 끝(`export const initialTerminalProgress` 앞)에 추가:

```ts
export const challengeIds = {
  pin: "pin-select",
  cube: "cube-hold",
  corrupted: "corrupted-command",
  pretext: "pretext-ending",
} as const;

export const stageOrder: TerminalStage[] = [
  "pin-select",
  "cube-hold",
  "corrupted-command",
  "pretext-ending",
  "completed",
];

export function getMailForStage(stage: TerminalStage): TerminalMail {
  return terminalMails.find((mail) => mail.unlockedStage === stage) ?? terminalMails[0];
}
```

- [ ] **Step 4: `initialTerminalProgress`에서 `selectedMailId` 제거**

파일 맨 끝의 `initialTerminalProgress` 정의를 다음으로 교체:

```ts
export const initialTerminalProgress: TerminalProgress = {
  currentStage: "pin-select",
  unlockedMailIds: ["transport-request"],
  completedChallengeIds: [],
};
```

- [ ] **Step 5: `TerminalClient.tsx`의 중복 정의 제거 + import로 교체**

`src/app/portals/security/terminal/TerminalClient.tsx:1-53`을 다음으로 교체(로컬에 있던 `challengeIds`/`stageOrder`/`getMailForStage`/`endingFlowAssets`/`getVisibleMails`/`isProgress`/`hasPretextCompletionParam`/`mergeUnlocked`/`withPretextCompletion`/`getInitialProgress`/`getSelectedSymbols` 중 이번 스텝에서는 import 정리만 하고 함수 본문들은 Task 6/7에서 손댄다 — 지금은 아래처럼 import만 바꾸고 로컬 `challengeIds`/`stageOrder`/`getMailForStage` 정의(30-53줄의 해당 부분)만 삭제한다):

```ts
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { HINT_PROMPT_COUNT_STORAGE_KEY } from "@/lib/employee-card";
import {
  challengeIds,
  getMailForStage,
  initialTerminalProgress,
  pinChallengeAnswer,
  stageOrder,
  terminalMails,
  terminalObjects,
  type TerminalObjectEntry,
  type TerminalProgress,
  type TerminalStage,
} from "@/lib/terminal-data";
import { cx, terminalTheme } from "@/theme/classes";
import { playSound } from "@/lib/sound";
import CubeChallenge from "./CubeChallenge";
import TerminalSidebar, { type Section } from "./TerminalSidebar";
import { FullscreenEndingVideo, SurveyQrPage, type EmployeeCardDelivery } from "./EndingFlow";
import { ContainmentLogsPage } from "./sections/ContainmentSection";
import { PersonSection } from "./sections/PersonSection";
import { ArchiveList, ArchiveDetail } from "./sections/ArchiveSection";
import { MessengerList, MessengerDetail } from "./sections/MessengerSection";

type OverlayState = "found" | "command-warning" | null;
type TerminalEndFlow = "idle" | "ending-video" | "monster-video" | "survey-qr";

const endingFlowAssets = {
  monsterVideoSrc: "/eg_png/egcompany_picture/P/ending/monsterending.mp4",
  posterSrc: "/eg_png/egcompany_picture/P/ending/ending.png",
  videoSrc: "/eg_png/egcompany_picture/P/ending/ending_v.mp4",
};

function getVisibleMails(progress: TerminalProgress) {
  const currentStageIndex = Math.max(stageOrder.indexOf(progress.currentStage), 0);
  const visibleCount = Math.min(terminalMails.length, currentStageIndex + 2);
  const visibleMailIds = new Set([
    ...terminalMails.slice(0, visibleCount).map((mail) => mail.id),
    ...progress.unlockedMailIds,
  ]);

  return terminalMails.filter((mail) => visibleMailIds.has(mail.id));
}

function getSelectedSymbols(selectedIds: string[]) {
  return selectedIds
    .map((id) => terminalObjects.find((entry) => entry.id === id)?.symbol)
    .filter(Boolean) as string[];
}
```

(`isProgress`, `hasPretextCompletionParam`, `mergeUnlocked`, `withPretextCompletion`, `getInitialProgress` 함수들은 이 스텝에서 완전히 삭제한다 — 전부 localStorage 기반이라 더 이상 필요 없다. Task 6에서 이들을 대체하는 fetch 기반 로직을 추가한다.)

이 시점에서 `TerminalClient.tsx`는 아직 컴파일 에러가 남아있다(`progressHydratedRef`, `getInitialProgress` 등을 참조하는 아래쪽 코드가 남아있음) — 정상이다, Task 6/7에서 마저 고친다. 지금은 여기까지만 하고 다음 스텝으로.

- [ ] **Step 6: `MessengerSection.tsx` 타입 호환 확인**

`src/app/portals/security/terminal/sections/MessengerSection.tsx`는 `TerminalProgress`를 import해서 `MessengerList`의 `progress` prop 타입으로 쓰는데, `currentStage`/`completedChallengeIds`만 읽고 `selectedMailId`는 안 쓰므로 코드 변경 불필요. 아래로 확인만 한다:

Run: `grep -n "selectedMailId" "c:\Users\hyeonggyu\escapeWeb\src\app\portals\security\terminal\sections\MessengerSection.tsx"`
Expected: 매치 없음(빈 출력).

- [ ] **Step 7: `game-progress-reset.ts`의 깨진 import 즉시 수정**

`TERMINAL_PROGRESS_STORAGE_KEY`를 Step 2에서 삭제했기 때문에, 이걸 import하던 `src/lib/game-progress-reset.ts`가 지금 당장 컴파일 에러가 난다. 다른 정리(admin-test 키 제거 등)는 Task 9에서 마저 하고, 여기서는 깨진 import만 즉시 고친다.

`src/lib/game-progress-reset.ts`에서 다음 줄:
```ts
import {
  PRETEXT_LETTER_POSITIONS_STORAGE_KEY,
  TERMINAL_PROGRESS_STORAGE_KEY,
} from "@/lib/terminal-data";
```
을 다음으로 교체:
```ts
import { PRETEXT_LETTER_POSITIONS_STORAGE_KEY } from "@/lib/terminal-data";
```

그리고 함수 본문에서 다음 줄을 삭제:
```ts
  window.localStorage.removeItem(TERMINAL_PROGRESS_STORAGE_KEY);
```

(`adminTestRequiredKey`/`adminTestPassedKey` 관련 줄들은 지금은 그대로 둔다 — 아직 `admin-test.ts`가 그 export를 갖고 있고, 로직상 무해하다. Task 9에서 정리한다.)

- [ ] **Step 8: 타입 체크**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: `TerminalClient.tsx` 관련 에러만 남고 `game-progress-reset.ts`/`terminal-data.ts` 관련 에러는 없어야 한다.

- [ ] **Step 9: Commit**

`TerminalClient.tsx`는 아직 컴파일이 안 되는 상태라 이 태스크만으로 커밋하지 않는다. Task 7 완료 후 `terminal-data.ts` + `TerminalClient.tsx`를 묶어서 커밋할 때, `game-progress-reset.ts`도 같이 포함시킨다(아래 Task 7 Step 9 참고). 지금은 커밋 없이 Task 3으로 진행한다.

---

## Task 3: 서버 헬퍼 `src/lib/terminal-state.ts`

**Files:**
- Create: `src/lib/terminal-state.ts`

**Interfaces:**
- Consumes: `prisma`(from `@/lib/db/prisma`), `challengeIds`/`stageOrder`/`getMailForStage`/`initialTerminalProgress`(from `@/lib/terminal-data`, Task 2에서 생성됨)
- Produces: `TerminalStateRecord` 타입, `resetTerminalState(userId): Promise<TerminalStateRecord>`, `getOrCreateTerminalState(userId): Promise<TerminalStateRecord>`, `completeChallenge(userId, challengeId): Promise<TerminalStateRecord>`, `passAdminTest(userId): Promise<TerminalStateRecord>`. Task 4(API 라우트), Task 5(로그인/가입)가 이 함수들을 그대로 import한다.

- [ ] **Step 1: 파일 작성**

`src/lib/terminal-state.ts`:

```ts
import "server-only";

import { prisma } from "@/lib/db/prisma";
import {
  getMailForStage,
  initialTerminalProgress,
  stageOrder,
  type TerminalStage,
} from "@/lib/terminal-data";

export type TerminalStateRecord = {
  currentStage: TerminalStage;
  unlockedMailIds: string[];
  completedChallengeIds: string[];
  adminTestRequired: boolean;
  adminTestPassed: boolean;
};

type TerminalStateRow = {
  currentStage: string;
  unlockedMailIds: unknown;
  completedChallengeIds: unknown;
  adminTestRequired: boolean;
  adminTestPassed: boolean;
};

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function toRecord(row: TerminalStateRow): TerminalStateRecord {
  return {
    currentStage: row.currentStage as TerminalStage,
    unlockedMailIds: toStringArray(row.unlockedMailIds),
    completedChallengeIds: toStringArray(row.completedChallengeIds),
    adminTestRequired: row.adminTestRequired,
    adminTestPassed: row.adminTestPassed,
  };
}

function mergeUnlocked(unlockedMailIds: string[], mailId: string): string[] {
  return unlockedMailIds.includes(mailId) ? unlockedMailIds : [...unlockedMailIds, mailId];
}

/** 로그인/회원가입 시 호출 — 해당 계정의 터미널 진행도를 완전히 기본값으로 되돌린다. */
export async function resetTerminalState(userId: string): Promise<TerminalStateRecord> {
  const row = await prisma.terminalState.upsert({
    where: { userId },
    create: {
      userId,
      currentStage: initialTerminalProgress.currentStage,
      unlockedMailIds: initialTerminalProgress.unlockedMailIds,
      completedChallengeIds: initialTerminalProgress.completedChallengeIds,
      adminTestRequired: true,
      adminTestPassed: false,
    },
    update: {
      currentStage: initialTerminalProgress.currentStage,
      unlockedMailIds: initialTerminalProgress.unlockedMailIds,
      completedChallengeIds: initialTerminalProgress.completedChallengeIds,
      adminTestRequired: true,
      adminTestPassed: false,
    },
  });

  return toRecord(row);
}

/** 행이 없으면(과거 계정 등) 기본값으로 생성한 뒤 반환한다. */
export async function getOrCreateTerminalState(userId: string): Promise<TerminalStateRecord> {
  const existing = await prisma.terminalState.findUnique({ where: { userId } });
  if (existing) return toRecord(existing);
  return resetTerminalState(userId);
}

/**
 * 챌린지 완료를 기록한다. challengeId는 stageOrder에 속한 스테이지 이름과 동일한 값을 쓴다
 * (예: "pin-select" 챌린지를 깨면 다음 스테이지 "cube-hold"로 전이).
 * 이미 완료된 챌린지를 다시 보내면 그대로 현재 상태를 반환한다(idempotent, 재시도 안전).
 */
export async function completeChallenge(
  userId: string,
  challengeId: string
): Promise<TerminalStateRecord> {
  const state = await getOrCreateTerminalState(userId);

  if (state.completedChallengeIds.includes(challengeId)) {
    return state;
  }

  const idx = stageOrder.indexOf(challengeId as TerminalStage);
  const nextStage = idx >= 0 ? stageOrder[idx + 1] : undefined;

  const nextCompleted = [...state.completedChallengeIds, challengeId];
  const nextUnlocked = nextStage
    ? mergeUnlocked(state.unlockedMailIds, getMailForStage(nextStage).id)
    : state.unlockedMailIds;

  const row = await prisma.terminalState.update({
    where: { userId },
    data: {
      currentStage: nextStage ?? state.currentStage,
      unlockedMailIds: nextUnlocked,
      completedChallengeIds: nextCompleted,
    },
  });

  return toRecord(row);
}

/** phase1(서명 테스트) 통과 처리. */
export async function passAdminTest(userId: string): Promise<TerminalStateRecord> {
  const row = await prisma.terminalState.upsert({
    where: { userId },
    create: {
      userId,
      currentStage: initialTerminalProgress.currentStage,
      unlockedMailIds: initialTerminalProgress.unlockedMailIds,
      completedChallengeIds: initialTerminalProgress.completedChallengeIds,
      adminTestRequired: false,
      adminTestPassed: true,
    },
    update: {
      adminTestRequired: false,
      adminTestPassed: true,
    },
  });

  return toRecord(row);
}
```

- [ ] **Step 2: 타입 체크**

Run: `cd c:\Users\hyeonggyu\escapeWeb && npx tsc --noEmit -p tsconfig.json`
Expected: `src/lib/terminal-state.ts` 관련 에러 없음. (TerminalClient.tsx는 Task 2에서 만든 미완성 상태라 여전히 에러가 남아있는 게 정상 — 그 에러들만 나와야 한다.)

- [ ] **Step 3: 린트**

Run: `npx eslint "src/lib/terminal-state.ts"`
Expected: 에러 없음.

- [ ] **Step 4: 실제 DB에 대고 동작 검증 (임시 Node 스크립트)**

스크래치 디렉터리에 `verify-terminal-state.mjs` 작성 (테스트용 더미 유저를 만들고 지워서 실제 계정을 오염시키지 않는다):

```js
require("dotenv").config({ path: "c:/Users/hyeonggyu/escapeWeb/.env.local" });
const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.create({
    data: { email: `verify_${Date.now()}@example.com`, name: "검증용" },
  });

  // resetTerminalState 로직을 인라인으로 재현 (ts 파일을 직접 require 못 하므로)
  const created = await prisma.terminalState.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      currentStage: "pin-select",
      unlockedMailIds: ["transport-request"],
      completedChallengeIds: [],
      adminTestRequired: true,
      adminTestPassed: false,
    },
    update: {},
  });
  console.log("after reset:", JSON.stringify(created));

  // completeChallenge("pin-select") 재현: pin-select 완료 -> cube-hold로 전이
  const updated = await prisma.terminalState.update({
    where: { userId: user.id },
    data: {
      currentStage: "cube-hold",
      unlockedMailIds: ["transport-request", "urgent-containment"],
      completedChallengeIds: ["pin-select"],
    },
  });
  console.log("after completeChallenge:", JSON.stringify(updated));

  await prisma.terminalState.delete({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });
  console.log("cleanup done");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

Run: `node verify-terminal-state.mjs` (스크래치 디렉터리에서, 또는 프로젝트 루트에 복사 후 실행하고 바로 삭제)

Expected: `after reset`에 `adminTestRequired:true`, `after completeChallenge`에 `currentStage:"cube-hold"`, `unlockedMailIds`에 2개 항목, 마지막에 `cleanup done` 출력. 스크립트/생성한 더미 유저 모두 정리됐는지 확인.

- [ ] **Step 5: Commit**

```bash
git add src/lib/terminal-state.ts
git commit -m "feat: 계정별 터미널 진행도 서버 헬퍼 추가"
```

---

## Task 4: API 라우트 — `/api/terminal/state`, `/api/auth/me` 확장

**Files:**
- Create: `src/app/api/terminal/state/route.ts`
- Modify: `src/app/api/auth/me/route.ts`

**Interfaces:**
- Consumes: `getCurrentUser()`(from `@/lib/auth/session`), `getOrCreateTerminalState`/`completeChallenge`/`passAdminTest`(from `@/lib/terminal-state`, Task 3)
- Produces: `GET /api/terminal/state` → `TerminalStateRecord` JSON (401 if not logged in). `PATCH /api/terminal/state` body `{action:"completeChallenge",challengeId}` 또는 `{action:"passAdminTest"}` → 갱신된 `TerminalStateRecord` JSON. `GET /api/auth/me` 응답에 `adminTestRequired`/`adminTestPassed` 필드 추가(기존 `user` 필드는 그대로) — Task 8(Navbar/homepage/rules)이 이 필드들을 그대로 소비한다.

- [ ] **Step 1: `/api/terminal/state/route.ts` 작성**

```ts
import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { completeChallenge, getOrCreateTerminalState, passAdminTest } from "@/lib/terminal-state";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const state = await getOrCreateTerminalState(user.id);
  return NextResponse.json(state);
}

const challengeIdSchema = z.enum(["pin-select", "cube-hold", "corrupted-command", "pretext-ending"]);

const patchSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("completeChallenge"), challengeId: challengeIdSchema }),
  z.object({ action: z.literal("passAdminTest") }),
]);

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const state =
    parsed.data.action === "completeChallenge"
      ? await completeChallenge(user.id, parsed.data.challengeId)
      : await passAdminTest(user.id);

  return NextResponse.json(state);
}
```

- [ ] **Step 2: `/api/auth/me/route.ts` 확장**

`src/app/api/auth/me/route.ts` 전체를 다음으로 교체:

```ts
import { getCurrentUser } from "@/lib/auth/session";
import { getOrCreateTerminalState } from "@/lib/terminal-state";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ user: null, adminTestRequired: false, adminTestPassed: false });
  }

  const terminalState = await getOrCreateTerminalState(user.id);

  return Response.json({
    user: {
      email: user.email,
      name: user.name,
    },
    adminTestRequired: terminalState.adminTestRequired,
    adminTestPassed: terminalState.adminTestPassed,
  });
}
```

- [ ] **Step 3: 타입/린트 체크**

Run: `npx tsc --noEmit -p tsconfig.json` (TerminalClient.tsx 관련 기존 에러 외에 새 에러 없어야 함)
Run: `npx eslint "src/app/api/terminal/state/route.ts" "src/app/api/auth/me/route.ts"`
Expected: 둘 다 통과.

- [ ] **Step 4: 개발 서버로 401 응답 확인 (비로그인)**

Run: `cd c:\Users\hyeonggyu\escapeWeb && (nohup npm run dev > /tmp/dev-verify.log 2>&1 &) ; timeout 60 bash -c 'until curl -sf http://localhost:3000 >/dev/null 2>&1; do sleep 1; done'`
Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/terminal/state`
Expected: `401`

Run: `curl -s http://localhost:3000/api/auth/me`
Expected: `{"user":null,"adminTestRequired":false,"adminTestPassed":false}`

- [ ] **Step 5: Commit**

```bash
git add src/app/api/terminal/state/route.ts src/app/api/auth/me/route.ts
git commit -m "feat: 터미널 진행도 API 라우트 추가, /api/auth/me에 admin 플래그 포함"
```

(개발 서버는 켜둔 채로 다음 태스크 진행 가능. `pkill -f "next dev"`로 나중에 정리.)

---

## Task 5: 로그인/회원가입 시 `TerminalState` 초기화

**Files:**
- Modify: `src/app/(auth)/signup/actions.ts`
- Modify: `src/app/(auth)/login/actions.ts`

**Interfaces:**
- Consumes: `resetTerminalState(userId)`(from `@/lib/terminal-state`, Task 3)

- [ ] **Step 1: `signup/actions.ts`에 초기화 추가**

`src/app/(auth)/signup/actions.ts` 상단 import에 추가:
```ts
import { resetTerminalState } from "@/lib/terminal-state";
```

`const user = await createUserWithEmployeeCode({ email, language, name, password, theme });` 바로 다음 줄에 추가:
```ts
    await resetTerminalState(user.id);
```

(이 호출은 try/catch로 감싸지 않는다 — 계정 생성의 핵심 단계이므로 실패 시 회원가입 자체가 실패하는 게 맞다. 외부 시스템 연동인 `hintLog.deleteMany`/`sendHintPhoneEmail`과는 성격이 다르다.)

- [ ] **Step 2: `login/actions.ts`에 초기화 추가**

`src/app/(auth)/login/actions.ts` 상단 import에 추가:
```ts
import { resetTerminalState } from "@/lib/terminal-state";
```

기존 줄:
```ts
  // 동일 계정으로 다시 로그인하면 서버에 남아 있던 방/퍼즐 진행 상태도 새로 시작한다.
  await prisma.progress.deleteMany({ where: { userId: user.id } });
```
바로 다음 줄에 추가:
```ts
  await resetTerminalState(user.id);
```

- [ ] **Step 3: 타입 체크**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: 새 에러 없음(TerminalClient.tsx의 기존 미완성 에러 제외).

- [ ] **Step 4: Playwright로 실제 동작 검증**

스크래치 디렉터리(`pw` 폴더, 이번 세션에서 이미 `playwright` 설치돼 있음)에 `verify-reset-on-auth.mjs` 작성:

```js
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

async function meFlags() {
  const res = await page.evaluate(() => fetch("/api/auth/me", { cache: "no-store" }).then((r) => r.json()));
  return res;
}

const email = `verify_reset_${Date.now()}@example.com`;
await page.goto("http://localhost:3000/signup", { waitUntil: "networkidle" });
await page.fill('input[name="name"]', "검증");
await page.fill('input[name="email"]', email);
await page.fill('input[name="password"]', "testpass1234");
await page.check('input[name="conduct"]');
await page.click('button[type="submit"]');
await page.waitForSelector("text=REGISTRATION COMPLETE", { timeout: 15000 });

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
console.log("flags right after signup:", JSON.stringify(await meFlags()));

// terminal state가 실제로 생성됐는지 GET으로 확인
const state = await page.evaluate(() => fetch("/api/terminal/state", { cache: "no-store" }).then((r) => r.json()));
console.log("terminal state after signup:", JSON.stringify(state));

await browser.close();
```

Run (스크래치 `pw` 디렉터리에서, 프로젝트 dev 서버가 떠 있는 상태로): `node verify-reset-on-auth.mjs`

Expected: `flags right after signup`에 `"adminTestRequired":true,"adminTestPassed":false`, `terminal state after signup`에 `"currentStage":"pin-select","unlockedMailIds":["transport-request"],"completedChallengeIds":[]`.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(auth)/signup/actions.ts" "src/app/(auth)/login/actions.ts"
git commit -m "feat: 로그인/회원가입 시 계정별 터미널 진행도 초기화"
```

---

## Task 6: `TerminalClient.tsx` — 서버 기반 하이드레이션(GET) + 로딩/에러 UI

**Files:**
- Modify: `src/app/portals/security/terminal/TerminalClient.tsx`

**Interfaces:**
- Consumes: `GET /api/terminal/state`(Task 4), `TerminalProgress`/`getMailForStage`(Task 2)
- Produces: 컴포넌트 내부 `progress: TerminalProgress | null`, `selectedMailId: string`, `loadState: "loading"|"ready"|"error"`, `loadTerminalState()` 함수 — Task 7이 `loadTerminalState`가 반환하는 최신 상태를 그대로 `setProgress`에 반영하는 방식을 그대로 따라간다.

Task 2에서 `TerminalClient.tsx` 상단(1-53줄)은 이미 정리했다. 이제 컴포넌트 본문의 state 선언부와 하이드레이션 관련 effect들을 교체한다.

- [ ] **Step 1: state 선언부 교체**

현재 (Task 2 이후) 파일에서 아래 블록을 찾는다:

```ts
export default function TerminalClient() {
  const router = useRouter();
  const [progress, setProgress] = useState<TerminalProgress>(initialTerminalProgress);
  const [activeSection, setActiveSection] = useState<Section>("messenger");
  const [selectedArchiveId, setSelectedArchiveId] = useState("WESEN-1744");
  const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);
  const [pinError, setPinError] = useState("");
  const [command, setCommand] = useState("");
  const [commandError, setCommandError] = useState("");
  const [overlay, setOverlay] = useState<OverlayState>(null);
  const [cubeModalOpen, setCubeModalOpen] = useState(false);
  const [endFlow, setEndFlow] = useState<TerminalEndFlow>("idle");
  const [employeeCardDelivery, setEmployeeCardDelivery] = useState<EmployeeCardDelivery>({
    status: "idle",
  });
  const [userName, setUserName] = useState("(플레이어)");
  const [glitching, setGlitching] = useState(false);
  const [heavyGlitching, setHeavyGlitching] = useState(false);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const glitchRafRef = useRef<number>(0);
  const progressHydratedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const deliveryRequestedRef = useRef(false);
```

다음으로 교체:

```ts
type LoadState = "loading" | "ready" | "error";

export default function TerminalClient() {
  const router = useRouter();
  const [progress, setProgress] = useState<TerminalProgress | null>(null);
  const [selectedMailId, setSelectedMailId] = useState<string>(() => getMailForStage("pin-select").id);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [activeSection, setActiveSection] = useState<Section>("messenger");
  const [selectedArchiveId, setSelectedArchiveId] = useState("WESEN-1744");
  const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);
  const [pinError, setPinError] = useState("");
  const [command, setCommand] = useState("");
  const [commandError, setCommandError] = useState("");
  const [overlay, setOverlay] = useState<OverlayState>(null);
  const [cubeModalOpen, setCubeModalOpen] = useState(false);
  const [endFlow, setEndFlow] = useState<TerminalEndFlow>("idle");
  const [employeeCardDelivery, setEmployeeCardDelivery] = useState<EmployeeCardDelivery>({
    status: "idle",
  });
  const [userName, setUserName] = useState("(플레이어)");
  const [glitching, setGlitching] = useState(false);
  const [heavyGlitching, setHeavyGlitching] = useState(false);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const glitchRafRef = useRef<number>(0);
  const timersRef = useRef<number[]>([]);
  const deliveryRequestedRef = useRef(false);
  const pretextCompletionHandledRef = useRef(false);
```

(`progressHydratedRef`는 완전히 제거됐다 — 서버 GET이 항상 진실이므로 "하이드레이션 전엔 저장 안 함" 가드가 더 이상 필요 없다. 대신 pretext 완료 신호를 한 번만 처리하기 위한 `pretextCompletionHandledRef`를 추가했다.)

- [ ] **Step 2: 파생 값들을 null-safe하게 교체**

현재 블록:
```ts
  const visibleMails = useMemo(() => getVisibleMails(progress), [progress]);

  const selectedMail = useMemo(
    () => visibleMails.find((mail) => mail.id === progress.selectedMailId) ?? visibleMails[0],
    [progress.selectedMailId, visibleMails]
  );

  const selectedArchive =
    terminalObjects.find((entry) => entry.id === selectedArchiveId) ?? terminalObjects[2];

  const completed = useMemo(
    () => new Set(progress.completedChallengeIds),
    [progress.completedChallengeIds]
  );
```

다음으로 교체:
```ts
  const visibleMails = useMemo(() => (progress ? getVisibleMails(progress) : []), [progress]);

  const selectedMail = useMemo(
    () => visibleMails.find((mail) => mail.id === selectedMailId) ?? visibleMails[0],
    [selectedMailId, visibleMails]
  );

  const selectedArchive =
    terminalObjects.find((entry) => entry.id === selectedArchiveId) ?? terminalObjects[2];

  const completed = useMemo(
    () => new Set(progress?.completedChallengeIds ?? []),
    [progress]
  );
```

- [ ] **Step 3: 마운트/popstate 하이드레이션 effect 교체**

현재 블록(유저 이름 fetch effect 바로 다음, `progressHydratedRef`를 쓰던 3개의 useEffect):
```ts
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const hasCompletedPretext = hasPretextCompletionParam();
      progressHydratedRef.current = true;
      setProgress(getInitialProgress());
      if (hasCompletedPretext) {
        setEndFlow("ending-video");
        window.history.replaceState(null, "", "/portals/security/terminal");
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // Next.js는 브라우저 뒤로/앞으로가기 시 이 페이지의 이전 컴포넌트 인스턴스를
  // 재마운트 없이 재사용한다. 그 사이 다른 탭/경로에서 localStorage의 진행도가
  // 바뀌었어도 이 인스턴스는 알 수 없으므로, popstate가 발생할 때마다 진행도를
  // localStorage 기준으로 다시 동기화해 오래된 값이 화면에 남지 않게 한다.
  useEffect(() => {
    function handlePopState() {
      if (window.location.pathname !== "/portals/security/terminal") return;
      progressHydratedRef.current = true;
      setProgress(getInitialProgress());
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!progressHydratedRef.current) return;
    window.localStorage.setItem(TERMINAL_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);
```

다음으로 교체:
```ts
  const loadTerminalState = useCallback(async () => {
    setLoadState("loading");
    try {
      const response = await fetch("/api/terminal/state", { cache: "no-store" });

      if (response.status === 401) {
        router.replace("/login");
        return;
      }
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data = (await response.json()) as TerminalProgress;
      setProgress(data);
      setSelectedMailId(getMailForStage(data.currentStage).id);
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, [router]);

  useEffect(() => {
    void loadTerminalState();
  }, [loadTerminalState]);

  // Next.js는 브라우저 뒤로/앞으로가기 시 이 페이지의 이전 컴포넌트 인스턴스를
  // 재마운트 없이 재사용한다. mount effect가 다시 실행되지 않으므로, popstate가
  // 발생할 때마다 서버 기준으로 진행도를 다시 불러와 오래된 값이 화면에 남지 않게 한다.
  useEffect(() => {
    function handlePopState() {
      if (window.location.pathname !== "/portals/security/terminal") return;
      void loadTerminalState();
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [loadTerminalState]);

  // pretext 화면(별도 라우트)을 풀고 돌아오면 ?pretextComplete=1 이 붙는다.
  // 계정 데이터가 아니라 "방금 막 pretext를 풀고 왔다"는 1회성 네비게이션 신호이므로
  // 그대로 유지하되, 실제 완료 기록은 서버에 PATCH로 남긴다.
  useEffect(() => {
    if (loadState !== "ready") return;
    if (pretextCompletionHandledRef.current) return;
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("pretextComplete") !== "1") return;

    pretextCompletionHandledRef.current = true;
    window.history.replaceState(null, "", "/portals/security/terminal");

    fetch("/api/terminal/state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "completeChallenge", challengeId: challengeIds.pretext }),
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("failed"))))
      .then((data: TerminalProgress) => {
        setProgress(data);
        setSelectedMailId(getMailForStage(data.currentStage).id);
        setEndFlow("ending-video");
      })
      .catch(() => setLoadState("error"));
  }, [loadState]);
```

`useCallback`을 쓰므로 import 줄도 수정한다. 파일 맨 위:
```ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
```

- [ ] **Step 4: 나머지 3개 useEffect(타이머 정리, pin-select 글리치)는 그대로 둔다**

`useEffect(() => { const timers = timersRef.current; return () => {...}; }, []);` 와 pin-select 글리치 effect(`const pinCompleted = completed.has(challengeIds.pin);` 이하)는 이미 `completed`가 null-safe해졌으므로 수정 없이 그대로 둔다.

- [ ] **Step 5: 로딩/에러 렌더 분기 추가**

`function queueTimer(...)` 정의 바로 앞, 즉 마지막 useEffect(pin-select 글리치) 다음에 아래 헬퍼 컴포넌트 2개를 파일 맨 아래(`CubeChallengeModal` 함수 옆)에 추가한다:

```ts
function TerminalLoadingScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#080808] text-terminal-text">
      <p className="font-mono text-xs tracking-[0.32em] text-terminal-text-dim uppercase">
        LOADING TERMINAL STATE...
      </p>
    </main>
  );
}

function TerminalErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#080808] px-4 text-center text-terminal-text">
      <div>
        <p className="font-mono text-xs tracking-[0.24em] text-terminal-accent-text uppercase">
          진행도를 불러오지 못했습니다.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 border border-terminal-border px-5 py-2 font-mono text-xs tracking-[0.18em] text-terminal-text uppercase hover:border-white"
        >
          다시 시도
        </button>
      </div>
    </main>
  );
}
```

그리고 컴포넌트 본문에서 `const visibleEndFlow = ...` 줄 바로 앞에 다음을 추가:

```ts
  if (loadState === "loading" || !progress) {
    return <TerminalLoadingScreen />;
  }

  if (loadState === "error") {
    return <TerminalErrorScreen onRetry={() => void loadTerminalState()} />;
  }
```

(이 두 `if`는 기존의 `if (visibleEndFlow === "ending-video") {...}` 등보다 먼저 와야 한다 — `progress`가 null이면 그 아래 로직들이 전부 깨진다.)

- [ ] **Step 6: 타입 체크 (아직 Task 7 전이라 일부 에러 남아있을 수 있음)**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: `unlockStage`, `submitCommand`, `MessengerList`의 `onSelectMail` 관련 에러만 남아있어야 한다(Task 7에서 고침). `progress`가 `null`일 수 있다는 에러가 새로 발견되면 Step 2/5에서 놓친 곳이 있다는 뜻이니 해당 라인을 찾아 null 체크를 추가한다.

커밋은 Task 7 완료 후 한 번에 한다(같은 파일이라 중간에 컴파일이 깨진 상태로 커밋하지 않는다).

---

## Task 7: `TerminalClient.tsx` — 챌린지 완료 지점을 PATCH로 교체

**Files:**
- Modify: `src/app/portals/security/terminal/TerminalClient.tsx`

**Interfaces:**
- Consumes: `PATCH /api/terminal/state`(Task 4), Task 6에서 만든 `progress`/`selectedMailId`/`setLoadState`
- Produces: `completeChallengeOnServer(challengeId: string): Promise<void>` — pin-select/cube-hold/corrupted-command 완료 지점에서 공용으로 사용.

- [ ] **Step 1: `unlockStage` 함수를 `completeChallengeOnServer`로 교체**

기존 함수:
```ts
  function unlockStage(nextStage: TerminalStage, challengeId: string) {
    const nextMail = getMailForStage(nextStage);
    setActiveSection("messenger");
    setProgress((current) => ({
      currentStage: nextStage,
      unlockedMailIds: mergeUnlocked(current, nextMail.id),
      selectedMailId: nextMail.id,
      completedChallengeIds: current.completedChallengeIds.includes(challengeId)
        ? current.completedChallengeIds
        : [...current.completedChallengeIds, challengeId],
    }));
  }
```

다음으로 교체:
```ts
  async function completeChallengeOnServer(challengeId: string) {
    setActiveSection("messenger");
    try {
      const response = await fetch("/api/terminal/state", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "completeChallenge", challengeId }),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data = (await response.json()) as TerminalProgress;
      setProgress(data);
      setSelectedMailId(getMailForStage(data.currentStage).id);
    } catch {
      setLoadState("error");
    }
  }
```

- [ ] **Step 2: `submitPinChallenge`에서 호출부 교체**

기존:
```ts
    setOverlay("found");
    playSound("/2phase_sount.mp3");
    queueTimer(() => {
      unlockStage("cube-hold", challengeIds.pin);
      setSelectedObjectIds([]);
      setPinError("");
    }, 1250);
    queueTimer(() => setOverlay(null), 2300);
```

다음으로 교체:
```ts
    setOverlay("found");
    playSound("/2phase_sount.mp3");
    queueTimer(() => {
      void completeChallengeOnServer(challengeIds.pin);
      setSelectedObjectIds([]);
      setPinError("");
    }, 1250);
    queueTimer(() => setOverlay(null), 2300);
```

- [ ] **Step 3: `submitCommand` 전체 교체**

기존:
```ts
  function submitCommand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (command.trim().toUpperCase() !== "RAOMTNI") {
      setCommandError("명령어가 일치하지 않습니다.");
      return;
    }

    setCommandError("");
    setOverlay("command-warning");
    queueTimer(() => {
      setOverlay(null);
      setCommand("");
      // corrupted-command 완료 상태를 localStorage에 직접 저장 후 pretext 이동
      const nextMail = getMailForStage("pretext-ending");
      const updatedProgress: TerminalProgress = {
        currentStage: "pretext-ending",
        unlockedMailIds: mergeUnlocked(progress, nextMail.id),
        selectedMailId: nextMail.id,
        completedChallengeIds: progress.completedChallengeIds.includes(challengeIds.corrupted)
          ? progress.completedChallengeIds
          : [...progress.completedChallengeIds, challengeIds.corrupted],
      };
      window.localStorage.setItem(TERMINAL_PROGRESS_STORAGE_KEY, JSON.stringify(updatedProgress));
      router.push("/portals/security/terminal/pretext");
    }, 1750);
  }
```

다음으로 교체:
```ts
  function submitCommand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (command.trim().toUpperCase() !== "RAOMTNI") {
      setCommandError("명령어가 일치하지 않습니다.");
      return;
    }

    setCommandError("");
    setOverlay("command-warning");
    queueTimer(() => {
      setOverlay(null);
      setCommand("");
      void (async () => {
        await completeChallengeOnServer(challengeIds.corrupted);
        router.push("/portals/security/terminal/pretext");
      })();
    }, 1750);
  }
```

- [ ] **Step 4: `completeCubeChallenge` 교체**

기존:
```ts
  function completeCubeChallenge() {
    setCubeModalOpen(false);
    unlockStage("corrupted-command", challengeIds.cube);
  }
```

다음으로 교체:
```ts
  function completeCubeChallenge() {
    setCubeModalOpen(false);
    void completeChallengeOnServer(challengeIds.cube);
  }
```

- [ ] **Step 5: 메일 수동 선택 핸들러 교체**

기존(JSX 렌더 부분):
```tsx
            <MessengerList
              selectedMail={selectedMail}
              visibleMails={visibleMails}
              progress={progress}
              onSelectMail={(mailId) =>
                setProgress((current) => ({ ...current, selectedMailId: mailId }))
              }
            />
```

다음으로 교체:
```tsx
            <MessengerList
              selectedMail={selectedMail}
              visibleMails={visibleMails}
              progress={progress}
              onSelectMail={setSelectedMailId}
            />
```

- [ ] **Step 6: 타입 체크**

Run: `cd c:\Users\hyeonggyu\escapeWeb && npx tsc --noEmit -p tsconfig.json`
Expected: 에러 없음. 남아있는 에러가 있다면 `mergeUnlocked`/`withPretextCompletion`/`getInitialProgress`/`isProgress`/`hasPretextCompletionParam` 중 하나를 Task 2에서 안 지웠거나 어딘가에서 여전히 참조 중이라는 뜻이니 `grep -n "mergeUnlocked\|withPretextCompletion\|getInitialProgress\|isProgress(\|hasPretextCompletionParam" src/app/portals/security/terminal/TerminalClient.tsx`로 잔재를 찾아 제거한다.

- [ ] **Step 7: 린트**

Run: `npx eslint "src/app/portals/security/terminal/TerminalClient.tsx"`
Expected: 에러 없음(기존에 있던 `displacementRef.current` 관련 무관한 warning 1개는 그대로 있어도 됨 — 이 리팩터링 이전부터 있던 것).

- [ ] **Step 8: 개발 서버로 실제 플레이 확인 (Playwright)**

dev 서버가 안 떠 있으면 새로 띄운다:
```bash
cd c:\Users\hyeonggyu\escapeWeb && (nohup npm run dev > /tmp/dev-verify2.log 2>&1 &) ; timeout 60 bash -c 'until curl -sf http://localhost:3000 >/dev/null 2>&1; do sleep 1; done'
```

스크래치 `pw` 디렉터리에 `verify-full-playthrough.mjs` 작성 — 회원가입부터 pin-select 챌린지 완료까지 실제로 눌러보고, 새로고침 후에도 진행도가 유지되는지 확인:

```js
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on("pageerror", (e) => console.log("[pageerror]", String(e)));

const email = `verify_play_${Date.now()}@example.com`;
await page.goto("http://localhost:3000/signup", { waitUntil: "networkidle" });
await page.fill('input[name="name"]', "플레이검증");
await page.fill('input[name="email"]', email);
await page.fill('input[name="password"]', "testpass1234");
await page.check('input[name="conduct"]');
await page.click('button[type="submit"]');
await page.waitForSelector("text=REGISTRATION COMPLETE", { timeout: 15000 });

await page.goto("http://localhost:3000/portals/security/terminal", { waitUntil: "networkidle" });
await page.waitForSelector("text=SECURITY_15", { timeout: 10000 });

const stateBefore = await page.evaluate(() =>
  fetch("/api/terminal/state", { cache: "no-store" }).then((r) => r.json())
);
console.log("state on terminal mount:", JSON.stringify(stateBefore));

// 새로고침 후에도 로딩 화면을 거쳐 정상적으로 같은 상태가 뜨는지 확인
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector("text=SECURITY_15", { timeout: 10000 });
const stateAfterReload = await page.evaluate(() =>
  fetch("/api/terminal/state", { cache: "no-store" }).then((r) => r.json())
);
console.log("state after reload:", JSON.stringify(stateAfterReload));
console.log("stage unchanged across reload:", stateBefore.currentStage === stateAfterReload.currentStage);

await browser.close();
```

Run: `node verify-full-playthrough.mjs`

Expected: `state on terminal mount`에 `"currentStage":"pin-select"`, 콘솔 에러(`[pageerror]`) 없음, `stage unchanged across reload: true`.

- [ ] **Step 9: Commit (Task 2, 6, 7을 묶어서)**

```bash
git add src/lib/terminal-data.ts src/lib/game-progress-reset.ts src/app/portals/security/terminal/TerminalClient.tsx
git commit -m "feat: TerminalClient가 localStorage 대신 /api/terminal/state로 진행도를 읽고 쓰도록 변경"
```

---

## Task 8: rules 페이지 / Navbar / 홈페이지 — admin 플래그를 `/api/auth/me`에서 읽도록 교체

**Files:**
- Modify: `src/app/(corporate)/rules/page.tsx`
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/app/(corporate)/page.tsx`

**Interfaces:**
- Consumes: `GET /api/auth/me`(Task 4에서 확장됨, `adminTestRequired`/`adminTestPassed` 필드 포함), `PATCH /api/terminal/state`(Task 4)

- [ ] **Step 1: `rules/page.tsx` — 서명 테스트 통과 시 서버에 기록**

`src/app/(corporate)/rules/page.tsx`에서 import 줄:
```ts
import { adminTestPassedKey, adminTestRequiredKey } from "@/lib/admin-test";
```
을 삭제한다(더 이상 이 파일에서 안 씀).

`handleAdminTestPassed` 함수:
```ts
  const handleAdminTestPassed = () => {
    window.localStorage.removeItem(adminTestRequiredKey);
    window.localStorage.setItem(adminTestPassedKey, "true");
    setIsModalOpen(false);
    setTransitioning(true);
    // 리다이렉트는 AccessTerminal 컴포넌트의 onComplete에서 처리
  };
```
를 다음으로 교체:
```ts
  const handleAdminTestPassed = () => {
    setIsModalOpen(false);
    setTransitioning(true);
    // 리다이렉트는 AccessTerminal 컴포넌트의 onComplete에서 처리.
    // 서버 기록 실패해도(네트워크 문제 등) 방금 통과한 연출 자체는 막지 않는다 —
    // 실패 시 다음에 홈페이지 웰컴 모달이 한 번 더 뜨는 정도의 부작용만 있음.
    void fetch("/api/terminal/state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "passAdminTest" }),
    }).catch((error) => {
      console.error("[rules] admin test 통과 기록 실패 (무시하고 진행)", error);
    });
  };
```

- [ ] **Step 2: `Navbar.tsx` — Admin 탭 소스를 `/api/auth/me` 응답으로 교체**

`src/components/layout/Navbar.tsx`에서 import 줄:
```ts
import { adminTestPassedKey, adminTestStorageEvent } from "@/lib/admin-test";
```
삭제.

다음 3개 함수를 통째로 삭제:
```ts
function getAdminUnlockedSnapshot() {
  return window.localStorage.getItem(adminTestPassedKey) === "true";
}

function getServerAdminUnlockedSnapshot() {
  return false;
}

function subscribeToAdminUnlocked(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(adminTestStorageEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(adminTestStorageEvent, onStoreChange);
  };
}
```

컴포넌트 본문에서:
```ts
  const adminUnlocked = useSyncExternalStore(
    subscribeToAdminUnlocked,
    getAdminUnlockedSnapshot,
    getServerAdminUnlockedSnapshot
  );
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
```
를 다음으로 교체:
```ts
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
```

`loadCurrentUser` effect:
```ts
  useEffect(() => {
    let ignore = false;

    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to load current user.");
        }

        const data = (await response.json()) as { user: CurrentUser | null };

        if (!ignore) {
          setCurrentUser(data.user);
        }
      } catch {
        if (!ignore) {
          setCurrentUser(null);
        }
      }
    }

    void loadCurrentUser();

    return () => {
      ignore = true;
    };
  }, [pathname]);
```
를 다음으로 교체:
```ts
  useEffect(() => {
    let ignore = false;

    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to load current user.");
        }

        const data = (await response.json()) as {
          user: CurrentUser | null;
          adminTestPassed: boolean;
        };

        if (!ignore) {
          setCurrentUser(data.user);
          setAdminUnlocked(data.adminTestPassed);
        }
      } catch {
        if (!ignore) {
          setCurrentUser(null);
          setAdminUnlocked(false);
        }
      }
    }

    void loadCurrentUser();

    return () => {
      ignore = true;
    };
  }, [pathname]);
```

(`{adminUnlocked && (...Admin 탭...)}` JSX 부분은 변수명이 그대로라 수정 불필요.)

- [ ] **Step 3: 홈페이지 `page.tsx` — 웰컴 모달 조건을 `/api/auth/me` 응답으로 교체**

`src/app/(corporate)/page.tsx`에서 import 줄:
```ts
import { adminTestRequiredKey, adminTestStorageEvent } from "@/lib/admin-test";
```
삭제.

다음 3개 함수를 통째로 삭제:
```ts
function getAdminTestRequiredSnapshot() {
  return window.localStorage.getItem(adminTestRequiredKey) === "true";
}

function getServerAdminTestRequiredSnapshot() {
  return false;
}

function subscribeToAdminTest(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(adminTestStorageEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(adminTestStorageEvent, onStoreChange);
  };
}
```

컴포넌트 본문 시작 부분:
```ts
export default function Page() {
  const adminTestRequired = useSyncExternalStore(
    subscribeToAdminTest,
    getAdminTestRequiredSnapshot,
    getServerAdminTestRequiredSnapshot
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const [testDismissed, setTestDismissed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
```
를 다음으로 교체:
```ts
export default function Page() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [testDismissed, setTestDismissed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminTestRequired, setAdminTestRequired] = useState(false);
```

로그인 상태 fetch effect:
```ts
  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : null)
      .then((data: { user: { email: string } | null } | null) => {
        setIsLoggedIn(!!data?.user);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);
```
를 다음으로 교체:
```ts
  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (
          data: { user: { email: string } | null; adminTestRequired: boolean } | null
        ) => {
          setIsLoggedIn(!!data?.user);
          setAdminTestRequired(!!data?.adminTestRequired);
        }
      )
      .catch(() => {
        setIsLoggedIn(false);
        setAdminTestRequired(false);
      });
  }, []);
```

마지막으로 이 파일 맨 위 React import에서 `useSyncExternalStore`가 이제 안 쓰이므로 제거한다:
```ts
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
```
→
```ts
import { useEffect, useRef, useState } from "react";
```

- [ ] **Step 4: 타입/린트 체크**

Run: `npx tsc --noEmit -p tsconfig.json`
Run: `npx eslint "src/app/(corporate)/rules/page.tsx" "src/components/layout/Navbar.tsx" "src/app/(corporate)/page.tsx"`
Expected: 둘 다 에러 없음.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(corporate)/rules/page.tsx" src/components/layout/Navbar.tsx "src/app/(corporate)/page.tsx"
git commit -m "feat: Admin 탭/웰컴 모달이 서버의 admin 플래그를 사용하도록 변경"
```

---

## Task 9: 정리 — 더 이상 안 쓰는 localStorage 코드 제거

**Files:**
- Modify: `src/app/(auth)/signup/SignUpForm.tsx`
- Modify: `src/lib/game-progress-reset.ts`
- Modify: `src/lib/admin-test.ts`

- [ ] **Step 1: `SignUpForm.tsx`에서 admin 플래그 localStorage 조작 제거**

`src/app/(auth)/signup/SignUpForm.tsx`의 다음 effect:
```ts
  useEffect(() => {
    if (!state.ok) {
      return;
    }

    // 같은 브라우저에 남아있던 이전 진행 상태를 지우고 항상 처음부터 시작하게 한다
    clearClientGameProgress();
    window.localStorage.setItem("eg-new-admin-test-required", "true");
  }, [state.ok]);
```
를 다음으로 교체(회원가입 시 `adminTestRequired: true`는 이제 서버(`resetTerminalState`, Task 5)가 보장한다):
```ts
  useEffect(() => {
    if (!state.ok) {
      return;
    }

    // 같은 브라우저에 남아있던 이전 진행 상태를 지우고 항상 처음부터 시작하게 한다
    clearClientGameProgress();
  }, [state.ok]);
```

- [ ] **Step 2: `game-progress-reset.ts`에서 admin 플래그 관련 줄 제거**

`src/lib/game-progress-reset.ts` 전체를 다음으로 교체:

```ts
import { HINT_PROMPT_COUNT_STORAGE_KEY } from "@/lib/employee-card";
import { PRETEXT_LETTER_POSITIONS_STORAGE_KEY } from "@/lib/terminal-data";

export function clearClientGameProgress() {
  window.localStorage.removeItem(HINT_PROMPT_COUNT_STORAGE_KEY);
  window.sessionStorage.removeItem(PRETEXT_LETTER_POSITIONS_STORAGE_KEY);
}
```

- [ ] **Step 3: `admin-test.ts`에서 안 쓰는 export 제거**

먼저 정말 안 쓰는지 확인:

Run: `grep -rn "adminTestRequiredKey\|adminTestPassedKey\|adminTestStorageEvent" c:\Users\hyeonggyu\escapeWeb\src`

Expected: `src/lib/admin-test.ts`의 정의 줄 3개만 나와야 한다(다른 파일에서의 참조는 전부 Task 8/9 Step 1에서 제거됐어야 함). 만약 다른 파일이 더 걸리면 그 파일을 먼저 고친다.

`src/lib/admin-test.ts`의 맨 위 3줄:
```ts
export const adminTestStorageEvent = "eg-new-admin-test-change";
export const adminTestRequiredKey = "eg-new-admin-test-required";
export const adminTestPassedKey = "eg-new-admin-test-passed";
```
을 삭제한다(`adminTestQuestions`는 그대로 둔다 — 퀴즈 문항 데이터라 여전히 `AdminAccessTestModal.tsx`가 사용).

- [ ] **Step 4: 타입/린트 체크**

Run: `npx tsc --noEmit -p tsconfig.json`
Run: `npx eslint "src/app/(auth)/signup/SignUpForm.tsx" "src/lib/game-progress-reset.ts" "src/lib/admin-test.ts"`
Expected: 전부 에러 없음.

- [ ] **Step 5: 전체 프로젝트 기준 최종 타입 체크**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | head -n 50`
Expected: 출력 없음(전체 프로젝트 통틀어 에러 0).

- [ ] **Step 6: Commit**

```bash
git add "src/app/(auth)/signup/SignUpForm.tsx" src/lib/game-progress-reset.ts src/lib/admin-test.ts
git commit -m "chore: 계정 기반 진행도 전환 이후 안 쓰는 localStorage 코드 정리"
```

---

## Task 10: 종단 검증 (Playwright) — 원래 버그가 실제로 고쳐졌는지 확인

**Files:** 없음(코드 변경 없이 검증만).

**Interfaces:**
- Consumes: 지금까지 만든 전체 시스템.

이 태스크는 이번 리팩터링의 핵심 동기 — "같은 브라우저에서 계정을 바꿔도 이전 계정의 진행도/phase1 통과 이력이 새 계정에 안 새어나가는지" — 를 실제 회원가입→서명→퀴즈 통과→터미널 도달 플로우로 재현해서 확인한다. 이번 세션에서 이미 이 방식으로 검증에 성공한 적이 있다(`verify_two_people2.mjs` 패턴 재사용).

- [ ] **Step 1: dev 서버 기동**

```bash
cd c:\Users\hyeonggyu\escapeWeb && (nohup npm run dev > /tmp/dev-final-verify.log 2>&1 &) ; timeout 60 bash -c 'until curl -sf http://localhost:3000 >/dev/null 2>&1; do sleep 1; done'
```

- [ ] **Step 2: 스크립트 작성**

스크래치 `pw` 디렉터리에 `verify-final.mjs`:

```js
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on("pageerror", (e) => console.log("[pageerror]", String(e)));

async function signup(name, email) {
  await page.goto("http://localhost:3000/signup", { waitUntil: "networkidle" });
  await page.fill('input[name="name"]', name);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "testpass1234");
  await page.check('input[name="conduct"]');
  await page.click('button[type="submit"]');
  await page.waitForSelector("text=REGISTRATION COMPLETE", { timeout: 15000 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
}

async function adminTabCount() {
  return page.locator("nav >> text=Admin").count();
}

async function meFlags() {
  return page.evaluate(() => fetch("/api/auth/me", { cache: "no-store" }).then((r) => r.json()));
}

// Person A: 회원가입 -> rules 퀴즈 통과 -> 터미널 도달
const personAEmail = `finalA_${Date.now()}@example.com`;
await signup("사람A", personAEmail);
console.log("Person A - admin tab right after signup (expect 0):", await adminTabCount());

await page.goto("http://localhost:3000/rules", { waitUntil: "networkidle" });
await page.click("text=서명");
await page.waitForSelector("text=Administrator Access Protocol");

const correctOptionIndex = [1, 0, 0, 1, 0]; // Q1=X,Q2=O,Q3=O,Q4=X,Q5=O
const rows = page.locator("div.grid.gap-3.py-4");
for (let i = 0; i < (await rows.count()); i++) {
  await rows.nth(i).locator('input[type="radio"]').nth(correctOptionIndex[i]).check();
}
await page.locator("button", { hasText: /제출|SUBMIT/i }).click();
await page.waitForURL("http://localhost:3000/portals/security/terminal", { timeout: 15000 });

console.log("Person A flags after passing phase1:", JSON.stringify(await meFlags()));

await page.click('button:has-text("Return to Homepage")');
await page.waitForURL("http://localhost:3000/", { timeout: 10000 });
console.log("Person A - admin tab after Return to Homepage (expect 1):", await adminTabCount());

// Person B: 같은 브라우저에서 새로 회원가입
const personBEmail = `finalB_${Date.now()}@example.com`;
await signup("사람B", personBEmail);
console.log("Person B flags right after signup:", JSON.stringify(await meFlags()));
console.log("Person B - admin tab visible right after signup (expect 0):", await adminTabCount());

await browser.close();
```

- [ ] **Step 3: 실행**

Run: `node verify-final.mjs` (스크래치 `pw` 디렉터리에서)

Expected:
- `Person A - admin tab right after signup (expect 0): 0`
- `Person A flags after passing phase1`에 `"adminTestRequired":false,"adminTestPassed":true`
- `Person A - admin tab after Return to Homepage (expect 1): 1`
- `Person B flags right after signup`에 `"adminTestRequired":true,"adminTestPassed":false`
- `Person B - admin tab visible right after signup (expect 0): 0`
- `[pageerror]` 로그 없음

- [ ] **Step 4: 서버 정리**

```bash
pkill -f "next dev" 2>/dev/null; pkill -f "npm run dev" 2>/dev/null
```

- [ ] **Step 5: 최종 git 상태 확인**

Run: `cd c:\Users\hyeonggyu\escapeWeb && git status --short`
Expected: 스크래치 디렉터리 밖에서 작업했다면 추적되지 않은 임시 파일이 없어야 한다(전부 커밋됐거나, `.env.local`처럼 원래도 무시되는 파일뿐).

이 태스크는 커밋할 코드 변경이 없다(순수 검증) — Step 5에서 확인만 하고 종료.

---

## Self-Review

**1. 스펙 커버리지 확인**
- 데이터 모델(`TerminalState`) → Task 1 ✅
- `GET /api/auth/me` 확장 → Task 4 ✅
- `GET/PATCH /api/terminal/state` → Task 4 ✅
- 서버가 배열 병합/스테이지 전이 계산(동시성 방지) → Task 3의 `completeChallenge` ✅
- 로그인/회원가입 시 초기화 → Task 5 ✅
- `TerminalClient.tsx` GET 하이드레이션 + `popstate` 안전장치 유지 → Task 6 ✅
- `TerminalClient.tsx` PATCH 기반 챌린지 완료 → Task 7 ✅
- `selectedMailId` 서버 미저장, 클라이언트 로컬 처리 → Task 2(타입에서 제거) + Task 6(로컬 state) + Task 7(핸들러) ✅
- pretext 완료 `?pretextComplete=1` 쿼리 신호 유지 → Task 6 Step 3 ✅
- GET/PATCH 실패 시 에러 UI, 기본값 폴백 금지 → Task 6 Step 5(`TerminalErrorScreen`) ✅
- Navbar/홈페이지/rules 페이지 전환 → Task 8 ✅
- 익명 접근 차단(부수 효과) → Task 6 Step 3의 401 → `/login` 리다이렉트 ✅
- 안 쓰는 코드 정리 → Task 9 ✅
- 핵심 동기(계정 간 진행도 유출) 재현 검증 → Task 10 ✅

**2. 플레이스홀더 스캔**: "TBD", "나중에 구현" 등 없음. 모든 스텝에 실제 코드/명령어 포함.

**3. 타입/이름 일관성 확인**: `TerminalStateRecord`(Task 3) = `GET /api/terminal/state` 응답 형태(Task 4) = `TerminalClient.tsx`가 `TerminalProgress`로 캐스팅해서 받는 형태(Task 6/7) — 필드명(`currentStage`, `unlockedMailIds`, `completedChallengeIds`, `adminTestRequired`, `adminTestPassed`) 전부 일치함을 재확인. `completeChallengeOnServer`(Task 7에서 정의) 호출부가 Task 7 Step 2·3·4에서 동일한 이름으로 쓰임을 확인. `challengeIds`/`stageOrder`/`getMailForStage`(Task 2에서 정의) 이름이 Task 3(서버)과 Task 6/7(클라이언트) 양쪽에서 동일하게 import됨을 확인.

**4. 스코프 체크**: 이 계획은 단일 서브시스템(터미널 진행도의 저장 위치 전환)에 집중돼 있다. 힌트 횟수, 사원증 발송, 퍼즐 정답 검증 등은 명시적으로 범위 밖으로 남겨뒀다.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-09-account-scoped-terminal-progress.md`. Two execution options:

**1. Subagent-Driven (recommended)** - 태스크마다 새 subagent를 띄워서 구현시키고, 태스크 사이마다 리뷰. 빠른 반복.

**2. Inline Execution** - 이 세션에서 executing-plans로 배치 실행하고, 체크포인트마다 검토.

**Which approach?**
