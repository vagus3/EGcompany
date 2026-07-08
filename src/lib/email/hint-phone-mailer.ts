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
          ${name}님, 가입을 환영합니다.<br /><br />
          본 링크는 EGCompany 방탈출 게임에 관한 힌트를 챗봇 형식으로 제공하는 웹앱입니다.<br />
          스마트폰으로 보시는 것을 권장드립니다.<br />
          힌트는 총 1~3단계로, 비슷한 질문을 할 경우 단계별로 좀 더 정답에 가까운 힌트를 제공하는 방식입니다.
          가급적 어디서부터 해야하는지 모르겠다 시간이 늘어질 것 같을 때 사용해주시면 플레이 환경이 원활해집니다.
          웹사이트 방탈출 게임 특성상 웹사이트 내부에 게임 진행에 관한 설명은 별도로 제공되지 않기에
          플레이 시 웹사이트의 내용과 상호작용을 잘 파악해서 풀어나가시면 되겠습니다.
          해당 방탈출 웹사이트는 공포 테마이며 중간중간 소리가 발생하기에 이어폰/헤드폰 착용을 권장드립니다.
          감사합니다.<br /><br />
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
