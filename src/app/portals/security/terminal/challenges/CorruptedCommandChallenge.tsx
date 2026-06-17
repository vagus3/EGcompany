"use client";

import Image from "next/image";
import { CompletedPanel } from "../ui/TerminalPanels";

export function CorruptedCommandChallenge({
  completed,
  command,
  commandError,
  onCommandChange,
  onSubmitCommand,
}: {
  completed: Set<string>;
  command: string;
  commandError: string;
  onCommandChange: (value: string) => void;
  onSubmitCommand: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  if (completed.has("corrupted-command")) {
    return <CompletedPanel label="UNKNOWN_LANGUAGE_ACCEPTED" />;
  }

  return (
    <section className="mx-auto max-w-760px">
      <div className="mx-auto max-w-520px bg-[#2c2c2c] p-3">
        <div className="relative aspect-635/411 overflow-hidden bg-black">
          <Image
            src="/eg_png/egcompany_picture/P/P04.png"
            alt="Visual log image 13"
            fill
            sizes="(max-width: 768px) 90vw, 520px"
            className="object-cover opacity-75"
            priority
          />
          <div className="absolute top-0 left-7 flex gap-1.5">
            <span className="bg-terminal-accent h-2 w-2" />
            <span className="bg-terminal-accent/60 h-2 w-2" />
            <span className="bg-terminal-accent/35 h-2 w-2" />
          </div>
          <p className="absolute bottom-7 left-7 font-mono text-[10px] tracking-[0.42em] text-white/45">
            VISUAL LOG: IMAGE 13
          </p>
        </div>
      </div>

      <form
        onSubmit={onSubmitCommand}
        className="border-terminal-accent/50 mt-12 border bg-[#2d2d2d] px-6 py-7 shadow-[0_24px_80px_rgb(0_0_0_/0.38)] sm:px-9"
      >
        <label
          htmlFor="corrupted-command-input"
          className="text-terminal-accent-muted font-mono text-[11px] font-black tracking-[0.42em]"
        >
          ENTER
        </label>
        <div className="border-b-terminal-accent mt-5 flex min-h-16 items-center gap-4 border-b bg-[#090909] px-5">
          <span className="text-terminal-accent font-mono text-xl font-black">&gt;</span>
          <input
            id="corrupted-command-input"
            value={command}
            onChange={(event) => onCommandChange(event.target.value.toUpperCase())}
            className="text-terminal-accent-text h-14 min-w-0 flex-1 bg-transparent font-mono text-xl font-black tracking-[0.32em] outline-none"
            aria-label="Corrupted command answer"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <button className="text-terminal-accent-muted hover:bg-terminal-accent-strong mt-5 bg-[#3a3a3a] px-14 py-4 font-mono text-xs font-black tracking-[0.22em] transition-colors hover:text-white">
          ENTER
        </button>
      </form>
      {commandError && (
        <p className="text-terminal-accent-text mt-4 font-mono text-xs">{commandError}</p>
      )}
    </section>
  );
}
