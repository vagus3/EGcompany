"use client";

import { Check, Lock } from "lucide-react";
import { cx } from "@/theme/classes";

export function CompletedPanel({ label }: { label: string }) {
  return (
    <section className="border-terminal-border bg-terminal-panel-deep mt-5 border p-5">
      <p className="text-terminal-accent-muted flex items-center gap-3 font-mono text-xs font-black tracking-[0.2em]">
        <Check className="h-4 w-4" />
        {label}
      </p>
    </section>
  );
}

export function QueuedPanel({ label }: { label: string }) {
  return (
    <section className="border-terminal-border bg-terminal-panel-deep mt-5 border p-5 opacity-70">
      <p className="text-terminal-text-dim flex items-center gap-3 font-mono text-xs font-black tracking-[0.2em]">
        <Lock className="h-4 w-4" />
        {label}
      </p>
      <p className="text-terminal-text-muted mt-3 text-xs leading-6">
        이전 보안 절차가 완료되면 이 섹션의 상호작용이 활성화됩니다.
      </p>
    </section>
  );
}
