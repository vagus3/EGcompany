"use client";

import { pinChallengeAnswer, terminalObjects, type TerminalObjectEntry } from "@/lib/terminal-data";
import { useLanguage } from "@/hooks/useLanguage";
import { ObjectSymbolIcon } from "../sections/ArchiveSection";
import { CompletedPanel } from "../ui/TerminalPanels";
import { cx } from "@/theme/classes";

const challengeObjectOrder = [
  "WESEN-106",
  "WESEN-392",
  "WESEN-783",
  "WESEN-0491",
  "WESEN-1744",
  "WESEN-096",
  "WESEN-9428",
  "WESEN-0101",
] as const;

function ChallengeObjectIcon({ symbol, className }: { symbol: string; className?: string }) {
  return <ObjectSymbolIcon symbol={symbol} className={className} />;
}

function getChallengeObjects() {
  return challengeObjectOrder
    .map((id) => terminalObjects.find((entry) => entry.id === id))
    .filter(Boolean) as TerminalObjectEntry[];
}

export function PinSelectChallenge({
  completed,
  selectedObjectIds,
  pinError,
  onToggleObject,
  onSubmitPin,
}: {
  completed: Set<string>;
  selectedObjectIds: string[];
  pinError: string;
  onToggleObject: (entry: TerminalObjectEntry) => void;
  onSubmitPin: () => void;
}) {
  const lang = useLanguage();

  return (
    <section className="border-terminal-border border bg-[#101010] p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-terminal-text-muted font-mono text-[11px] font-black tracking-[0.28em]">
            SECURITY_CHALLENGE
          </p>
          <p className="text-terminal-text-dim mt-1 text-xs">
            {lang === "en"
              ? "Select the security authorization code for safe transport."
              : "안전한 수송을 위한 보안 승인 코드를 선택하십시오."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {getChallengeObjects().map((entry) => {
          const selected = selectedObjectIds.includes(entry.id);
          const disabled = !selected && selectedObjectIds.length >= pinChallengeAnswer.length;

          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onToggleObject(entry)}
              disabled={disabled}
              title={`${entry.label} / ${entry.symbol}`}
              className={cx(
                "grid aspect-[1.45] place-items-center border transition-colors",
                selected
                  ? "border-terminal-accent bg-terminal-accent-soft text-terminal-accent-text"
                  : "text-terminal-text-dim hover:border-terminal-accent-muted border-[#202020] bg-[#2a2a2a] hover:text-white",
                disabled &&
                  "hover:text-terminal-text-dim cursor-not-allowed opacity-35 hover:border-[#202020]"
              )}
              aria-label={`${selected ? "Deselect" : "Select"} ${entry.label} ${entry.symbol}`}
              aria-pressed={selected}
            >
              <ChallengeObjectIcon symbol={entry.symbol} className="h-5 w-5" />
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-terminal-text-dim font-mono text-[10px] tracking-[0.16em]">
          SELECTED: {selectedObjectIds.length}/4
        </p>
        <button
          type="button"
          onClick={onSubmitPin}
          className="bg-terminal-accent-strong hover:bg-terminal-accent-active px-5 py-3 font-mono text-[10px] font-black tracking-[0.2em] text-white transition-colors"
        >
          VERIFY
        </button>
      </div>
      {pinError && <p className="text-terminal-accent-text mt-4 font-mono text-xs">{pinError}</p>}
      {completed.has("pin-select") && <CompletedPanel label="PIN_SEQUENCE_CONFIRMED" />}
    </section>
  );
}
