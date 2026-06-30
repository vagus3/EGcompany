import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

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

const RANK_TEMPLATE_FILE: Record<EmployeeCardRank, string> = {
  S: "1_N.png",
  A: "2_N.png",
  B: "3_N.png",
};

const CARD_WIDTH = 638;
const CARD_HEIGHT = 1016;
const NAME_AREA_X = 343;
const NAME_AREA_MAX_WIDTH = 200;
const NAME_BASELINE_Y = 445;
const CODE_BASELINE_Y = 615;

let cachedFontBase64: string | null = null;

function getFontBase64() {
  if (cachedFontBase64) return cachedFontBase64;
  const fontPath = path.join(process.cwd(), "src", "lib", "fonts", "NotoSansKR-Bold.ttf");
  cachedFontBase64 = fs.readFileSync(fontPath).toString("base64");
  return cachedFontBase64;
}

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function fitFontSize(text: string, maxWidth: number, baseSize: number, minSize: number) {
  // 한글 기준 글자당 평균 폭 ≈ fontSize * 0.95 로 추정해 자동 축소
  for (let size = baseSize; size >= minSize; size -= 1) {
    if (text.length * size * 0.95 <= maxWidth) return size;
  }
  return minSize;
}

/** 사원증 템플릿 PNG에 이름·사번을 합성한 이미지를 Buffer로 반환합니다. */
export async function createEmployeeCardImage(payload: EmployeeCardPayload): Promise<Buffer> {
  const templateFile = RANK_TEMPLATE_FILE[payload.rank];
  const templatePath = path.join(process.cwd(), "public", "employee_card", templateFile);

  const rawName = payload.name?.trim() || "UNKNOWN";
  const nameFontSize = fitFontSize(rawName, NAME_AREA_MAX_WIDTH, 30, 14);
  const safeName = escapeSvgText(rawName);
  const safeCode = escapeSvgText(payload.employeeCode);
  const fontBase64 = getFontBase64();

  const svg = `
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @font-face {
            font-family: 'NotoKR';
            src: url(data:font/ttf;base64,${fontBase64}) format('truetype');
          }
        </style>
      </defs>
      <text x="${NAME_AREA_X}" y="${NAME_BASELINE_Y}" font-family="NotoKR" font-size="${nameFontSize}" font-weight="700" fill="#1a1a1a">${safeName}</text>
      <text x="${NAME_AREA_X}" y="${CODE_BASELINE_Y}" font-family="NotoKR" font-size="22" font-weight="700" letter-spacing="1" fill="#1a1a1a">${safeCode}</text>
    </svg>`;

  return sharp(templatePath)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();
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
