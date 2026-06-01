import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

import {
  HINT_PROMPT_COUNT_COOKIE_NAME,
  getEmployeeCardRank,
  normalizeHintPromptCount,
  type EmployeeCardPayload,
} from "@/lib/employee-card";
import { getCurrentUser } from "@/lib/auth/session";
import { sendEmployeeCardEmail } from "@/lib/email/employee-card-mailer";

const completionSchema = z.object({
  hintPromptCount: z.coerce.number().min(0).default(0),
});

function getEmployeeCode(user: { employeeCode: string | null; id: string }) {
  if (user.employeeCode) return user.employeeCode.replace(/^EG-/i, "").slice(-6);
  return user.id.replace(/\D/g, "").padStart(6, "0").slice(-6) || "020117";
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = completionSchema.safeParse(body);
  const cookieStore = await cookies();
  const fallbackHintPromptCount = normalizeHintPromptCount(
    cookieStore.get(HINT_PROMPT_COUNT_COOKIE_NAME)?.value
  );
  const hasRequestHintPromptCount = body && typeof body === "object" && "hintPromptCount" in body;
  const hintPromptCount = normalizeHintPromptCount(
    parsed.success && hasRequestHintPromptCount
      ? parsed.data.hintPromptCount
      : fallbackHintPromptCount
  );
  const email = user.notificationEmail ?? user.email;
  const payload: EmployeeCardPayload = {
    email,
    employeeCode: getEmployeeCode(user),
    hintPromptCount,
    name: user.name ?? "UNKNOWN",
    rank: getEmployeeCardRank(hintPromptCount),
  };

  try {
    const result = await sendEmployeeCardEmail(payload);

    return NextResponse.json({
      success: true,
      deliveryId: result.id,
      deliveryMode: result.mode,
      email,
      employeeCode: payload.employeeCode,
      hintPromptCount,
      rank: payload.rank,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "사원증 이메일 발송에 실패했습니다.",
      },
      { status: 502 }
    );
  }
}
