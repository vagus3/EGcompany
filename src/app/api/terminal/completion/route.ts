import { NextResponse } from "next/server";

import {
  getEmployeeCardRank,
  type EmployeeCardPayload,
} from "@/lib/employee-card";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { sendEmployeeCardEmail } from "@/lib/email/employee-card-mailer";

function getEmployeeCode(user: { employeeCode: string | null; id: string }) {
  if (user.employeeCode) return user.employeeCode.replace(/^EG-/i, "").slice(-6);
  return user.id.replace(/\D/g, "").padStart(6, "0").slice(-6) || "020117";
}

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다." }, { status: 401 });
  }

  // 외부 AI 힌트 시스템이 로그인 이메일로 기록한 hint_logs 수를 신뢰 소스로 사용.
  // 외부 소유 테이블이라 조회 실패 시에도 사원증 발급은 막지 않고 0회(=S)로 처리.
  let hintPromptCount = 0;
  try {
    hintPromptCount = await prisma.hintLog.count({
      where: { userEmail: user.email },
    });
  } catch (error) {
    console.error("[completion] hint_logs 조회 실패, 0회로 처리", error);
  }

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
