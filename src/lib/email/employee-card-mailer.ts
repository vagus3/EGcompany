import nodemailer from "nodemailer";

import { createEmployeeCardHtml, type EmployeeCardPayload } from "@/lib/employee-card";

type EmployeeCardEmailResult =
  | { html: string; id: string; mode: "mock" }
  | { html: string; id: string; mode: "gmail" };

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendEmployeeCardEmail(payload: EmployeeCardPayload) {
  const html       = createEmployeeCardHtml(payload);
  const transporter = getTransporter();

  if (!transporter) {
    console.info("[mock-email] employee card queued (no GMAIL_USER/GMAIL_APP_PASSWORD)", {
      to: payload.email,
      rank: payload.rank,
    });
    return { id: `mock-${Date.now()}`, mode: "mock" as const, html };
  }

  const gmailUser = process.env.GMAIL_USER!;
  const info = await transporter.sendMail({
    from:    `"EG Company" <${gmailUser}>`,
    to:      payload.email,
    subject: `[EG COMPANY] ${payload.rank} 등급 클리어 사원증이 발급되었습니다`,
    html,
  });

  return {
    id:   info.messageId ?? `gmail-${Date.now()}`,
    mode: "gmail" as const,
    html,
  } satisfies EmployeeCardEmailResult;
}
