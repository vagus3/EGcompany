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
