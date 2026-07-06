import { getGmailTransporter } from "@/lib/email/transporter";

const HINT_PHONE_BASE_URL = "https://escape-hint-pwa.vercel.app/";

type HintPhoneEmailResult =
  | { id: string; mode: "mock" }
  | { id: string; mode: "gmail" };

function buildHintPhoneUrl(email: string) {
  const url = new URL(HINT_PHONE_BASE_URL);
  url.searchParams.set("email", email);
  return url.toString();
}

function buildMailHtml(name: string, hintPhoneUrl: string) {
  return `
    <div style="font-family:Arial,sans-serif;background:#111;padding:32px;color:#eee">
      <div style="max-width:480px;margin:0 auto">
        <h2 style="color:#fff;margin:0 0 12px">EG COMPANY — AI 힌트폰 지급</h2>
        <p style="line-height:1.8;color:#ccc">
          ${name}님, 가입을 환영합니다.<br />
          현장 진입 전, 아래 링크로 개인 지급된 AI 힌트폰에 접속해 주세요.
        </p>
        <p style="margin:28px 0">
          <a href="${hintPhoneUrl}" style="display:inline-block;background:#7b0712;color:#fff;padding:14px 28px;text-decoration:none;font-weight:700">
            AI 힌트폰 바로가기
          </a>
        </p>
        <p style="line-height:1.8;color:#999;font-size:13px;margin-top:24px;word-break:break-all">
          버튼이 동작하지 않으면 아래 주소를 브라우저에 직접 입력해 주세요.<br />
          ${hintPhoneUrl}
        </p>
      </div>
    </div>
  `;
}

export async function sendHintPhoneEmail({ email, name }: { email: string; name: string }) {
  const hintPhoneUrl = buildHintPhoneUrl(email);
  const transporter = getGmailTransporter();

  if (!transporter) {
    console.info("[mock-email] hint phone link queued (no GMAIL_USER/GMAIL_APP_PASSWORD)", {
      to: email,
      hintPhoneUrl,
    });
    return { id: `mock-${Date.now()}`, mode: "mock" as const };
  }

  const gmailUser = process.env.GMAIL_USER!;

  const info = await transporter.sendMail({
    from:    `"EG Company" <${gmailUser}>`,
    to:      email,
    subject: "[EG COMPANY] AI 힌트폰이 지급되었습니다",
    html:    buildMailHtml(name, hintPhoneUrl),
  });

  return {
    id:   info.messageId ?? `gmail-${Date.now()}`,
    mode: "gmail" as const,
  } satisfies HintPhoneEmailResult;
}
