import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  HINT_PROMPT_COUNT_COOKIE_NAME,
  getEmployeeCardRank,
  normalizeHintPromptCount,
} from "@/lib/employee-card";
import { getCurrentUser } from "@/lib/auth/session";

const hintUsageSchema = z.object({
  hintPromptCount: z.coerce.number().min(0),
});

export async function GET() {
  const cookieStore = await cookies();
  const hintPromptCount = normalizeHintPromptCount(
    cookieStore.get(HINT_PROMPT_COUNT_COOKIE_NAME)?.value
  );

  return NextResponse.json({
    hintPromptCount,
    rank: getEmployeeCardRank(hintPromptCount),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = hintUsageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "hintPromptCount 값이 필요합니다." },
      { status: 400 }
    );
  }

  const hintPromptCount = normalizeHintPromptCount(parsed.data.hintPromptCount);
  const cookieStore = await cookies();
  cookieStore.set(HINT_PROMPT_COUNT_COOKIE_NAME, String(hintPromptCount), {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({
    success: true,
    hintPromptCount,
    rank: getEmployeeCardRank(hintPromptCount),
  });
}
