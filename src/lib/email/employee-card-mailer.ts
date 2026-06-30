import nodemailer from "nodemailer";

import type { EmployeeCardPayload } from "@/lib/employee-card";
import { createEmployeeCardImage } from "@/lib/employee-card-image";

type EmployeeCardEmailResult =
  | { id: string; mode: "mock" }
  | { id: string; mode: "gmail" };

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

function buildMailHtml(payload: EmployeeCardPayload) {
  return `
    <div style="font-family:Arial,sans-serif;background:#111;padding:32px;color:#eee">
      <div style="max-width:480px;margin:0 auto">
        <h2 style="color:#fff;margin:0 0 12px">EG COMPANY — 사원증 발급 완료</h2>
        <p style="line-height:1.8;color:#ccc">
          ${payload.name}님, 클리어를 축하합니다.<br />
          첨부된 ${payload.rank} 등급 사원증을 확인해 주세요.
        </p>
        <p style="line-height:1.8;color:#999;font-size:13px;margin-top:24px">
          본 사원증은 본인이 소지해야 합니다. 타인의 사원증을 습득했을 시에는<br />
          인사팀에게 검열 요청 하십시오. 절대 소지자에게 그대로 돌려주지 마십시오.
        </p>
      </div>
    </div>
  `;
}

export async function sendEmployeeCardEmail(payload: EmployeeCardPayload) {
  const transporter = getTransporter();

  if (!transporter) {
    console.info("[mock-email] employee card queued (no GMAIL_USER/GMAIL_APP_PASSWORD)", {
      to: payload.email,
      rank: payload.rank,
      name: payload.name,
    });
    return { id: `mock-${Date.now()}`, mode: "mock" as const };
  }

  const cardImage = await createEmployeeCardImage(payload);
  const gmailUser = process.env.GMAIL_USER!;

  const info = await transporter.sendMail({
    from:    `"EG Company" <${gmailUser}>`,
    to:      payload.email,
    subject: `[EG COMPANY] ${payload.rank} 등급 클리어 사원증이 발급되었습니다`,
    html:    buildMailHtml(payload),
    attachments: [
      {
        filename: `EG_사원증_${payload.employeeCode}.png`,
        content: cardImage,
        contentType: "image/png",
      },
    ],
  });

  return {
    id:   info.messageId ?? `gmail-${Date.now()}`,
    mode: "gmail" as const,
  } satisfies EmployeeCardEmailResult;
}
