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
