export type EmployeeCardRank = "S" | "A" | "B";

export type EmployeeCardPayload = {
  email: string;
  employeeCode: string;
  hintPromptCount: number;
  name: string;
  rank: EmployeeCardRank;
};

export const HINT_PROMPT_COUNT_STORAGE_KEY = "eg-hint-prompt-count";
export const HINT_PROMPT_COUNT_COOKIE_NAME = "eg-hint-prompt-count";

export function getEmployeeCardRank(hintPromptCount: number): EmployeeCardRank {
  if (hintPromptCount <= 0) return "S";
  if (hintPromptCount <= 3) return "A";
  return "B";
}

export function normalizeHintPromptCount(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.floor(parsed);
}

export function createEmployeeCardHtml(payload: EmployeeCardPayload) {
  return `
    <div style="font-family:Arial,sans-serif;background:#111;padding:32px;color:#111">
      <div style="max-width:560px;margin:0 auto;background:#f7f7f7;border-radius:18px;overflow:hidden">
        <div style="background:#7b0712;color:white;padding:24px 28px">
          <h1 style="margin:0;font-size:28px;letter-spacing:1px">EG COMPANY</h1>
          <p style="margin:6px 0 0;letter-spacing:3px">ANOMALY CONTROL</p>
        </div>
        <div style="padding:32px">
          <p style="margin:0 0 8px;color:#666">SECURITY_15</p>
          <h2 style="margin:0 0 20px;font-size:40px">${payload.name}</h2>
          <p style="margin:0;color:#7b0712;font-weight:700">SITE ADMINISTRATOR</p>
          <p style="margin:28px 0 0;color:#666">ID NUM</p>
          <p style="margin:4px 0 28px;font-size:32px;letter-spacing:2px">${payload.employeeCode}</p>
          <div style="display:inline-block;border:4px solid #111;border-radius:999px;padding:18px 26px;font-size:56px;font-weight:900">
            ${payload.rank}
          </div>
          <p style="margin:28px 0 0;font-size:13px;letter-spacing:3px">AUTHORIZED PERSONNEL ONLY</p>
        </div>
        <div style="padding:28px 32px;border-top:1px solid #ddd;color:#333;line-height:1.8">
          <p>본 사원증은 본인이 소지해야 합니다.</p>
          <p>타인의 사원증을 습득했을 시에 인사팀에게 <strong style="color:#7b0712">검열</strong> 요청 하십시오.</p>
          <p>절대 소지자에게 그대로 돌려주지 마십시오.</p>
        </div>
      </div>
    </div>
  `;
}
