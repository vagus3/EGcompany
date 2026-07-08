import "server-only";

import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
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
const FONT_FAMILY = "NotoKR";
const TEXT_FONT_WEIGHT = 700;
// resvg가 로드한 폰트 페이스 자체는 두께가 약하게 렌더링되어, 얇은 stroke를 덧그려
// 시각적으로 bold하게 보정한다. 값이 크면 글자가 뭉개져 보이므로 과하지 않게 유지.
const TEXT_STROKE_WIDTH = 0.35;

function getFontPath() {
  return path.join(process.cwd(), "src", "lib", "fonts", "NotoSansKR-Bold.ttf");
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

/**
 * 텍스트 레이어를 투명 배경 PNG로 렌더링한다.
 * sharp(libvips) 내부 SVG 렌더러(librsvg)는 @font-face data URI 임베드 폰트를
 * 안정적으로 지원하지 못해 프로덕션에서 텍스트가 비어 보이는 문제가 있었음.
 * resvg는 폰트 파일을 직접 지정(fontFiles)해 fontconfig/시스템 폰트 없이도
 * 안정적으로 렌더링된다.
 */
function renderTextLayer(svg: string): Buffer {
  const resvg = new Resvg(svg, {
    font: {
      fontFiles: [getFontPath()],
      loadSystemFonts: false,
      defaultFontFamily: FONT_FAMILY,
    },
    fitTo: { mode: "width", value: CARD_WIDTH },
  });
  return resvg.render().asPng();
}

/** 사원증 템플릿 PNG에 이름·사번을 합성한 이미지를 Buffer로 반환합니다. */
export async function createEmployeeCardImage(payload: EmployeeCardPayload): Promise<Buffer> {
  const templateFile = RANK_TEMPLATE_FILE[payload.rank];
  const templatePath = path.join(process.cwd(), "public", "employee_card", templateFile);

  const rawName = payload.name?.trim() || "UNKNOWN";
  const nameFontSize = fitFontSize(rawName, NAME_AREA_MAX_WIDTH, 55, 28);
  const safeName = escapeSvgText(rawName);
  const safeCode = escapeSvgText(payload.employeeCode);

  const svg = `
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <text x="${NAME_AREA_X}" y="${NAME_BASELINE_Y}" font-family="${FONT_FAMILY}" font-size="${nameFontSize}" font-weight="${TEXT_FONT_WEIGHT}" fill="#1a1a1a" stroke="#1a1a1a" stroke-width="${TEXT_STROKE_WIDTH}" paint-order="stroke fill">${safeName}</text>
      <text x="${CODE_AREA_X}" y="${CODE_BASELINE_Y}" font-family="${FONT_FAMILY}" font-size="22" font-weight="${TEXT_FONT_WEIGHT}" letter-spacing="1" fill="#1a1a1a" stroke="#1a1a1a" stroke-width="${TEXT_STROKE_WIDTH}" paint-order="stroke fill">${safeCode}</text>
    </svg>`;

  const textLayer = renderTextLayer(svg);

  return sharp(templatePath)
    .composite([{ input: textLayer, top: 0, left: 0 }])
    .png()
    .toBuffer();
}
