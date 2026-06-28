"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { CompletedPanel } from "../ui/TerminalPanels";

export function PretextChallenge({ completed }: { completed: Set<string> }) {
  const lang = useLanguage();

  if (completed.has("pretext-ending")) {
    return <CompletedPanel label="EMPTY_FACE_CONFIRMED" />;
  }

  return (
    <section className="border-terminal-border border bg-[#101010] p-6">
      <p className="text-terminal-accent-muted font-mono text-xs font-black tracking-[0.28em]">
        PRETEXT_FIELD_READY
      </p>
      <p className="text-terminal-text-muted mt-4 text-sm leading-6">
        {lang === "en"
          ? "This file cannot be reliably viewed within the terminal's internal frame. Initiate the Pretext conflict field in a fullscreen isolation environment."
          : "이 파일은 터미널 내부 프레임에서 안정적으로 열람할 수 없습니다. 전체 화면 격리 환경에서 Pretext 충돌 필드를 시작하십시오."}
      </p>
      <Link
        href="/portals/security/terminal/pretext"
        className="bg-terminal-accent-strong hover:bg-terminal-accent-active mt-6 inline-flex px-5 py-3 font-mono text-xs font-black tracking-[0.22em] text-white transition"
      >
        OPEN FULLSCREEN
      </Link>
    </section>
  );
}
