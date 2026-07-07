"use server";

import { cookies } from "next/headers";
import { z } from "zod";

import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { HINT_PROMPT_COUNT_COOKIE_NAME } from "@/lib/employee-card";
import { sendHintPhoneEmail } from "@/lib/email/hint-phone-mailer";

export type LoginState = {
  ok: boolean;
  message: string;
};

const loginSchema = z.object({
  email: z.string().trim().email("Use a valid corporate email.").toLowerCase(),
  password: z.string().min(1, "Password is required."),
});

export async function loginAction(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Check the submitted information.",
    };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      passwordHash: true,
    },
  });

  if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    return { ok: false, message: "Invalid email or password." };
  }

  // 동일 계정으로 다시 로그인하면 서버에 남아 있던 방/퍼즐 진행 상태도 새로 시작한다.
  await prisma.progress.deleteMany({ where: { userId: user.id } });

  await createSession(user.id);

  // 로그인할 때마다 이전 게임의 힌트 기록과 쿠키를 모두 초기화
  // (외부 AI 힌트 시스템이 이 이메일로 새 플레이의 힌트를 다시 기록함)
  // hint_logs는 외부 시스템 소유 테이블이라 스키마 변동 가능성이 있으므로,
  // 실패해도 로그인 자체는 절대 막지 않도록 방어적으로 처리한다.
  try {
    await prisma.hintLog.deleteMany({ where: { userEmail: email } });
  } catch (error) {
    console.error("[login] hint_logs 초기화 실패 (무시하고 진행)", error);
  }
  (await cookies()).delete(HINT_PROMPT_COUNT_COOKIE_NAME);

  // 로그인할 때마다 AI 힌트폰 PWA 링크를 재발송 (새 플레이 시작 안내).
  // 메일 발송 실패가 로그인 자체를 막지 않도록 방어적으로 처리.
  try {
    await sendHintPhoneEmail({ email, name: user.name ?? "플레이어" });
  } catch (error) {
    console.error("[login] 힌트폰 안내 메일 발송 실패 (무시하고 진행)", error);
  }

  return { ok: true, message: "Signed in." };
}
