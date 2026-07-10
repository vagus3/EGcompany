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
        <h2 style="color:#fff;margin:0 0 12px">EG COMPANY — AI 힌트폰 시스템</h2>
        <p style="line-height:1.8;color:#ccc">
          ${name}님의 입사를 환영합니다.<br /><br />
          본 링크는 사내에서 사용하는 AI어플입니다. 업무 중 모르는 것이 있다면 활용하시길 바랍니다.<br />
          스마트폰으로 보시는 것을 권장드리며, 타인에게 절대 공유하지 마십시오.<br />
          공유 행적 적발 시 인사팀에 의해 징계가 진행될 수 있습니다.<br />
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
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "GMAIL_USER/GMAIL_APP_PASSWORD가 설정되지 않아 힌트폰 안내 메일을 발송할 수 없습니다."
      );
    }

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
    subject: "[EG COMPANY] AI 힌트폰 시스템",
    html:    buildMailHtml(name, hintPhoneUrl),
  });

  return {
    id:   info.messageId ?? `gmail-${Date.now()}`,
    mode: "gmail" as const,
  } satisfies HintPhoneEmailResult;
}
