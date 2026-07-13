import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import {
  completeChallenge,
  getOrCreateTerminalState,
  IncorrectAnswerError,
  passAdminTest,
} from "@/lib/terminal-state";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const state = await getOrCreateTerminalState(user.id);
  return NextResponse.json(state);
}

// 챌린지별로 제출해야 하는 "답"의 형태가 다르다 — 서버가 실제 정답과 비교하려면
// 클라이언트가 무엇을 풀었다고 주장하는지 구체적으로 받아야 하기 때문이다.
const patchSchema = z.union([
  z.object({
    action: z.literal("completeChallenge"),
    challengeId: z.literal("pin-select"),
    symbols: z.array(z.string()).min(1).max(8),
  }),
  z.object({
    action: z.literal("completeChallenge"),
    challengeId: z.literal("cube-hold"),
    faceLabel: z.string().min(1).max(32),
  }),
  z.object({
    action: z.literal("completeChallenge"),
    challengeId: z.literal("corrupted-command"),
    command: z.string().min(1).max(64),
  }),
  z.object({
    action: z.literal("completeChallenge"),
    challengeId: z.literal("pretext-ending"),
    letters: z.array(z.string()).min(1).max(8),
  }),
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

  try {
    const state =
      parsed.data.action === "completeChallenge"
        ? await completeChallenge(user.id, parsed.data)
        : await passAdminTest(user.id);

    return NextResponse.json(state);
  } catch (error) {
    if (error instanceof IncorrectAnswerError) {
      return NextResponse.json({ error: "정답이 아닙니다." }, { status: 422 });
    }
    throw error;
  }
}
