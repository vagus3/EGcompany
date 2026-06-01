import { Resend } from "resend";

import { createEmployeeCardHtml, type EmployeeCardPayload } from "@/lib/employee-card";

type EmployeeCardEmailResult =
  | { html: string; id: string; mode: "mock" }
  | { html: string; id: string; mode: "resend" };

let resendClient: Resend | null = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }

  return resendClient;
}

function getFromAddress() {
  return (
    process.env.RESEND_FROM_EMAIL ?? process.env.EMAIL_FROM ?? "EG Company <onboarding@resend.dev>"
  );
}

export async function sendEmployeeCardEmail(payload: EmployeeCardPayload) {
  const html = createEmployeeCardHtml(payload);
  const resend = getResendClient();

  if (!resend) {
    console.info("[mock-email] employee card queued", {
      to: payload.email,
      employeeCode: payload.employeeCode,
      hintPromptCount: payload.hintPromptCount,
      rank: payload.rank,
    });

    return {
      id: `mock-${Date.now()}`,
      mode: "mock" as const,
      html,
    } satisfies EmployeeCardEmailResult;
  }

  const { data, error } = await resend.emails.send({
    from: getFromAddress(),
    to: [payload.email],
    subject: `[EG COMPANY] ${payload.rank} 등급 클리어 사원증이 발급되었습니다`,
    html,
  });

  if (error) {
    const message =
      typeof error === "object" && error && "message" in error
        ? String(error.message)
        : "Employee card email delivery failed.";
    throw new Error(message);
  }

  return {
    id: data?.id ?? `resend-${Date.now()}`,
    mode: "resend" as const,
    html,
  } satisfies EmployeeCardEmailResult;
}
