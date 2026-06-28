"use client";

import { CompletedPanel } from "../ui/TerminalPanels";

export function PretextChallenge({ completed }: { completed: Set<string> }) {
  if (completed.has("pretext-ending")) {
    return <CompletedPanel label="EMPTY_FACE_CONFIRMED" />;
  }
  // corrupted-command 완료 시 자동으로 pretext 페이지로 이동하므로 별도 UI 불필요
  return null;
}
