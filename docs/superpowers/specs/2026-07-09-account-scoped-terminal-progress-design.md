# 계정 기반 터미널 진행도 저장 — 설계

## 배경 / 문제

`/portals/security/terminal`(EG Company ARG 터미널) 게임의 진행 상태가 전부 브라우저 `localStorage`에만 저장되고 있다:

- `terminal-progress-v1` — `currentStage`, `unlockedMailIds`, `selectedMailId`, `completedChallengeIds`
- `eg-new-admin-test-required` / `eg-new-admin-test-passed` — phase1(서명 테스트) 통과 여부

이 데이터는 **로그인 계정(DB)이 아니라 브라우저(디바이스) 단위**로 저장되기 때문에, 같은 브라우저에서 계정을 바꿔 로그인/회원가입하면 이전 계정의 진행도·phase1 통과 이력이 새 계정에 그대로 노출되는 버그가 반복적으로 발생했다(최근에 `adminTestPassedKey`가 초기화 로직에서 누락되어 실제로 재현됨).

`clearClientGameProgress()`가 로그인/가입마다 관련 localStorage 키를 수동으로 지워주는 방식으로 땜질해왔지만, 새 키가 추가될 때마다 사람이 빠뜨리지 않고 챙겨야 하는 구조라 같은 유형의 버그가 계속 재발할 수 있다.

## 목표

터미널 진행도(스테이지 진행 + phase1 통과 여부)를 **계정(User)에 묶어 DB에 저장**하고, 로그인 시 서버가 해당 계정의 진행도를 확실히 초기화하도록 만든다. 클라이언트 상호작용은 표준적인 요청-응답 패턴(액션 → API 호출 → 서버가 처리 후 최신 상태 반환 → 클라이언트는 그 응답을 그대로 반영)을 따른다.

## 범위

**포함**
- 터미널 스테이지 진행도 (`currentStage`, `unlockedMailIds`, `completedChallengeIds`)
- phase1 서명 테스트 통과 여부 (`adminTestRequired`, `adminTestPassed`)
- 로그인/회원가입 시 위 데이터의 서버 측 초기화

**제외 (그대로 클라이언트/기존 방식 유지)**
- pretext 글자 위치(`sessionStorage`) — 순수 세션 내 랜덤화용, 계정과 무관
- 힌트 사용 횟수(현재 httpOnly 쿠키 + 외부 `hint_logs` 테이블) — 이미 서버가 관리 중, 이번 작업과 무관한 별개 이슈
- 언어/테마 설정 — 계정과 섞여도 무해한 순수 UI 취향
- pretext 완료 후 엔딩 영상을 트리거하는 `?pretextComplete=1` 쿼리 파라미터 — 계정 데이터가 아니라 "방금 pretext를 풀고 왔다"는 1회성 네비게이션 신호이므로 그대로 유지
- 기존 `Room`/`Puzzle`/`Progress` 모델 — 터미널 ARG와 무관한 별개의(미사용) 범용 방탈출 템플릿 잔재로 보임, 손대지 않음

## 데이터 모델

```prisma
model TerminalState {
  id                    String   @id @default(cuid())
  userId                String   @unique
  currentStage          String   @default("pin-select")
  unlockedMailIds       Json     // string[]
  completedChallengeIds Json     // string[]
  adminTestRequired     Boolean  @default(true)
  adminTestPassed       Boolean  @default(false)
  updatedAt             DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

`User` 모델에 `terminalState TerminalState?` 관계를 추가한다. `Json` 필드는 기존 `Room.sceneConfig`/`Puzzle.data`/`Puzzle.objectConfig`와 동일한 기존 관례를 따른다.

**`selectedMailId`는 서버에 저장하지 않는다** (자기검토 중 발견한 단순화). 이건 "지금 읽고 있는 메일함" 같은 순수 열람 상태라 로그인 초기화 대상인 "진행도"와 성격이 다르다. 클라이언트가 `currentStage`/`unlockedMailIds`로부터 "가장 최근에 열린 메일"을 매번 계산해서 기본 선택값으로 쓰고, 사용자가 이전 메일을 클릭해서 보는 건 그 세션 동안만 유지되는 로컬 state로 남긴다(새로고침하면 최신 메일로 돌아가도 무방 — "진행도 유실"이 아님).

## API

### `GET /api/auth/me` (기존 확장)

응답에 `adminTestRequired`/`adminTestPassed`를 추가한다:

```jsonc
{ "user": { "email": "...", "name": "..." } | null, "adminTestRequired": boolean, "adminTestPassed": boolean }
```

비로그인 시 두 값 모두 `false`. 기존 소비처(Navbar, 홈페이지, rules 페이지)가 이미 이 엔드포인트를 호출하고 있으므로 요청 추가 없이 자연스럽게 서버 값으로 전환된다. 응답 형태는 하위 호환(필드 추가만).

### `GET /api/terminal/state` (신규)

로그인 필요(401 if not logged in). 현재 유저의 `TerminalState`를 반환. 행이 없으면(과거 계정 등) 기본값으로 생성 후 반환.

### `PATCH /api/terminal/state` (신규)

로그인 필요. **클라이언트가 배열을 통째로 계산해서 보내지 않고, "의도"만 보낸다** — 동시성 문제(두 탭/재사용된 옛 인스턴스가 서로 다른 시점 기준으로 덮어쓰는 것) 방지를 위해 배열 병합과 스테이지 전이는 서버가 계산한다.

지원하는 액션은 딱 두 가지뿐이다:

- `{ action: "completeChallenge", challengeId: "pin-select" | "cube-hold" | "corrupted-command" | "pretext-ending" }` → 서버가 `completedChallengeIds`에 없으면 추가하고, `terminal-data.ts`의 `stageOrder`/`challengeIds` 기준으로 `currentStage`를 다음 단계로 전이, 해당 단계 메일을 `unlockedMailIds`에 병합. `pretext-ending`이면 다음 단계가 `completed`.
- `{ action: "passAdminTest" }` → `adminTestRequired: false, adminTestPassed: true`

(`terminal-data.ts`는 `"use client"`가 없는 순수 데이터 파일이라 API 라우트에서도 그대로 import해서 클라이언트와 동일한 `stageOrder` 상수를 재사용한다 — 로직 중복 없음.)

각 액션은 서버에서 현재 저장된 행을 읽어 병합 후 저장하고, **갱신된 전체 상태를 응답으로 반환**한다. 클라이언트는 이 응답으로 로컬 state를 교체한다(낙관적 업데이트 없음 — 이전 대화에서 합의한 "표준 요청-응답" 원칙).

**범위 밖(의도적으로 다루지 않음)**: 퍼즐 정답 검증(PIN 조합, corrupted-command 문자열, 큐브 홀드, pretext 글자 순서)은 여전히 클라이언트에서만 이루어진다. `completeChallenge` 액션은 "클라이언트가 이미 정답을 확인했다"는 걸 그대로 신뢰하며, API를 직접 호출해 스테이지를 건너뛰는 것까지 막지는 않는다. 이건 "계정별로 진행도를 올바르게 저장/초기화한다"는 이번 작업의 목표와는 다른 종류의 문제(부정 방지)라 별도 스코프로 남겨둔다.

## 로그인/회원가입 시 초기화

공용 헬퍼 `resetTerminalState(userId)` (upsert, 기본값으로 리셋)를 만들어 아래 두 곳에서 호출:

- **회원가입** (`signup/actions.ts`): 유저 생성 직후 `resetTerminalState(user.id)` 호출 → `TerminalState` 행이 기본값(`adminTestRequired: true` 포함)으로 생성됨.
- **로그인** (`login/actions.ts`): 기존 `prisma.progress.deleteMany(...)` 옆에 `resetTerminalState(user.id)` 추가 → 이전 플레이 기록이 있어도 로그인 시 항상 새 플레이로 초기화.

## 클라이언트 변경

- **`TerminalClient.tsx`**: `useState(initialTerminalProgress)` + `setTimeout` 하이드레이션 + localStorage read/write를 전부 제거하고 `/api/terminal/state` GET/PATCH 호출로 교체.
  - 마운트 시 GET, 응답 오기 전엔 로딩 상태만 표시(로컬 캐시로 먼저 그리지 않음).
  - **기존 `popstate` 리스너는 그대로 유지**하되 호출 대상만 localStorage → GET으로 변경. (Next.js가 뒤로/앞으로가기 시 페이지 인스턴스를 재사용해 mount effect가 재실행되지 않는 문제의 안전장치 — 이번 리팩터링에서 빠뜨리면 지난번 고친 버그가 재발한다.)
  - GET/PATCH 실패 시 에러 + 재시도 UI를 보여주고, **절대 기본값(`initialTerminalProgress`)으로 조용히 폴백하지 않는다** — 잘못된 진행도가 보이는 것보다 명시적 실패가 낫다.
  - `unlockStage`, `submitCommand`(pretext 이동 직전), pin-select 정답 처리 등 진행도를 바꾸는 지점을 전부 PATCH 호출로 교체.
- **`rules/page.tsx`**: `handleAdminTestPassed`에서 localStorage 대신 `PATCH { action: "passAdminTest" }` 호출.
- **`Navbar.tsx`, 홈페이지(`page.tsx`)**: `useSyncExternalStore` 기반 localStorage 구독 제거, `/api/auth/me` 응답의 `adminTestRequired`/`adminTestPassed` 필드 사용.
- **`SignUpForm.tsx`/`LoginForm.tsx`**: admin 플래그 관련 localStorage 조작 코드 제거(서버가 처리하므로 불필요).
- **`/portals/security/terminal` 익명 접근 차단(부수 효과)**: `/api/terminal/state`가 로그인을 요구하므로, 로그인하지 않고 URL을 직접 입력해 터미널에 접근하는 경로가 자연스럽게 막힌다. 의도된 방향으로 포함.

## 마이그레이션 참고

- `DATABASE_URL`이 로컬 환경에서도 운영 Turso DB를 가리키고 있음(이전 세션에서 확인됨). 이번 마이그레이션은 테이블 추가만 하는 순수 추가(additive) 변경이라 기존 데이터에 영향 없음. 다만 실제 적용 전 생성된 마이그레이션 SQL을 한 번 검토할 것.
- 현재 운영 DB의 `User` 테이블은 이전 세션에서 전체 초기화되어 비어 있는 상태라, 기존 유저 데이터에 대한 별도 백필은 필요 없음.

## 테스트 계획 (구현 단계에서 상세화)

- 회원가입 직후 `TerminalState`가 `adminTestRequired: true`로 생성되는지
- phase1 통과 후 `adminTestPassed: true`, `adminTestRequired: false`로 바뀌는지
- 같은 브라우저에서 계정 A로 phase1 통과 → 로그아웃 후 계정 B로 로그인/가입 시 Admin 탭이 보이지 않는지 (이번 리팩터링의 핵심 동기)
- 뒤로가기/앞으로가기 시 진행도가 stale하게 보이지 않는지(popstate 안전장치 유지 확인)
- GET/PATCH 네트워크 실패 시 기본값으로 폴백하지 않고 에러 UI가 뜨는지
