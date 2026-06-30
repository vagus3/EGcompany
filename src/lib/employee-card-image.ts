import "server-only";

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

import type { EmployeeCardPayload, EmployeeCardRank } from "@/lib/employee-card";

const RANK_TEMPLATE_FILE: Record<EmployeeCardRank, string> = {
  S: "1_N.png",
  A: "2_N.png",
  B: "3_N.png",
};

const CARD_WIDTH = 638;
const CARD_HEIGHT = 1016;
const NAME_AREA_X = 330;
const NAME_AREA_MAX_WIDTH = 260;
const NAME_BASELINE_Y = 455;
const CODE_AREA_X = 335;
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
  const nameFontSize = fitFontSize(rawName, NAME_AREA_MAX_WIDTH, 55, 28);
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
      <text x="${CODE_AREA_X}" y="${CODE_BASELINE_Y}" font-family="NotoKR" font-size="22" font-weight="700" letter-spacing="1" fill="#1a1a1a">${safeCode}</text>
    </svg>`;

  return sharp(templatePath)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();
}
