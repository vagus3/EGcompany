"use client";

import { useCallback, useMemo } from "react";
import { prepare, layout } from "@chenglou/pretext";

interface TextLayoutOptions {
  font: string;       // e.g. '16px "Inter"'
  containerWidth: number;
  lineHeight: number;
}

interface TextLayoutResult {
  height: number;
  lineCount: number;
}

/**
 * PreText.js 훅 — DOM 리플로우 없이 텍스트 높이/줄 수를 Canvas로 계산.
 * Three.js 씬 오버레이나 퍼즐 힌트 박스처럼 렌더 전에 크기를 알아야 할 때 사용.
 */
export function useTextLayout(text: string, options: TextLayoutOptions): TextLayoutResult {
  const handle = useMemo(() => prepare(text, options.font), [text, options.font]);

  const result = useMemo(
    () => layout(handle, options.containerWidth, options.lineHeight),
    [handle, options.containerWidth, options.lineHeight]
  );

  return {
    height: result.height,
    lineCount: result.lineCount,
  };
}

/**
 * 여러 텍스트를 한 번에 계산할 때 사용 (퍼즐 목록, 힌트 목록 등)
 */
export function measureTextBatch(
  texts: string[],
  font: string,
  containerWidth: number,
  lineHeight: number
): TextLayoutResult[] {
  return texts.map((text) => {
    const handle = prepare(text, font);
    const result = layout(handle, containerWidth, lineHeight);
    return { height: result.height, lineCount: result.lineCount };
  });
}
