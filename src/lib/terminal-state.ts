import "server-only";

import { prisma } from "@/lib/db/prisma";
import {
  getMailForStage,
  initialTerminalProgress,
  stageOrder,
  type TerminalStage,
} from "@/lib/terminal-data";
import {
  CORRUPTED_COMMAND_ANSWER,
  CUBE_CHALLENGE_ANSWER_FACE,
  PIN_CHALLENGE_ANSWER,
  PRETEXT_CHALLENGE_ANSWER,
} from "@/lib/terminal-answers";

export type ChallengeSubmission =
  | { challengeId: "pin-select"; symbols: string[] }
  | { challengeId: "cube-hold"; faceLabel: string }
  | { challengeId: "corrupted-command"; command: string }
  | { challengeId: "pretext-ending"; letters: string[] };

/** 클라이언트가 completeChallenge로 제출한 답이 오답일 때 던진다. */
export class IncorrectAnswerError extends Error {
  constructor() {
    super("제출한 답이 정답과 일치하지 않습니다.");
    this.name = "IncorrectAnswerError";
  }
}

function isSubmissionCorrect(submission: ChallengeSubmission): boolean {
  switch (submission.challengeId) {
    case "pin-select": {
      const answer = new Set<string>(PIN_CHALLENGE_ANSWER);
      return (
        submission.symbols.length === PIN_CHALLENGE_ANSWER.length &&
        submission.symbols.every((symbol) => answer.has(symbol))
      );
    }
    case "cube-hold":
      return submission.faceLabel === CUBE_CHALLENGE_ANSWER_FACE;
    case "corrupted-command":
      return submission.command.trim().toUpperCase() === CORRUPTED_COMMAND_ANSWER;
    case "pretext-ending":
      return (
        submission.letters.length === PRETEXT_CHALLENGE_ANSWER.length &&
        submission.letters.every((letter, i) => letter === PRETEXT_CHALLENGE_ANSWER[i])
      );
  }
}

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
 * 이미 완료된 챌린지를 다시 보내면 제출값을 재검증하지 않고 그대로 현재 상태를 반환한다
 * (idempotent, 재시도 안전). 아직 완료되지 않은 챌린지는 제출값이 정답과 일치할 때만
 * 진행시키고, 그렇지 않으면 IncorrectAnswerError를 던진다 — 클라이언트가 정답을 안다고
 * "주장"하는 것만으로 스테이지를 건너뛸 수 없게 하기 위함이다.
 */
export async function completeChallenge(
  userId: string,
  submission: ChallengeSubmission
): Promise<TerminalStateRecord> {
  const state = await getOrCreateTerminalState(userId);
  const { challengeId } = submission;

  if (state.completedChallengeIds.includes(challengeId)) {
    return state;
  }

  if (!isSubmissionCorrect(submission)) {
    throw new IncorrectAnswerError();
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
