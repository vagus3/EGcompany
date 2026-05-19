"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PortalConfig } from "@/lib/portal-data";
import EGShieldLogo from "@/components/ui/EGShieldLogo";

/* ── Corner-marker input ── */
function TerminalInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const sq = "absolute w-[7px] h-[7px] bg-white";
  return (
    <div className="relative mt-1">
      {/* Corner squares */}
      <span className={`${sq} -top-[3px] -left-[3px]`} />
      <span className={`${sq} -top-[3px] -right-[3px]`} />
      <span className={`${sq} -bottom-[3px] -left-[3px]`} />
      <span className={`${sq} -right-[3px] -bottom-[3px]`} />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="w-full border border-white/25 bg-white/5 px-4 py-4 text-center font-mono text-xs tracking-[0.18em] text-white/50 uppercase transition-colors placeholder:text-white/20 focus:border-white/50 focus:bg-white/8 focus:text-white/80 focus:outline-none sm:px-6 sm:text-sm sm:tracking-[0.28em]"
      />
    </div>
  );
}

/* ── Background grid overlay (subtle) ── */
function GridOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
  );
}

export default function PortalClient({ portal }: { portal: PortalConfig }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "denied">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (portal.isSecurity && code.trim()) {
      router.push("/portals/security/terminal");
      return;
    }

    // 정답 처리는 추후 연결
    setStatus("denied");
    setTimeout(() => setStatus("idle"), 1800);
  }

  /* ── SECURITY variant ── */
  if (portal.isSecurity) {
    return (
      <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-black px-4 py-12 select-none">
        <GridOverlay />

        <div className="mb-12 space-y-1 text-center sm:mb-16">
          <h1 className="text-[clamp(1.35rem,8vw,2.6rem)] font-black tracking-[0.28em] text-white uppercase sm:tracking-[0.55em]">
            EG&nbsp;&nbsp;COMPANY
          </h1>
          <p className="text-xs tracking-[0.45em] text-red-500 uppercase">{portal.name}</p>
        </div>

        <div className="w-full max-w-sm space-y-5 text-center">
          <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">
            {portal.clearanceLabel}
          </p>
          <p className="text-xl font-semibold tracking-wide text-white">관리자 코드를 입력하세요</p>

          <form onSubmit={handleSubmit}>
            <TerminalInput value={code} onChange={setCode} placeholder="X" />
          </form>

          <p className="flex items-center justify-center gap-1.5 text-[10px] tracking-[0.2em] text-red-500 uppercase">
            <span>🔒</span> {portal.sessionLabel}
          </p>

          {status === "denied" && (
            <p className="animate-pulse text-xs tracking-widest text-red-400 uppercase">
              ACCESS DENIED
            </p>
          )}

          {portal.codes && (
            <div className="space-y-1 pt-2">
              {portal.codes.map((c) => (
                <p key={c} className="font-mono text-sm tracking-widest text-white/60">
                  {c}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Standard department variant ── */
  return (
    <div
      className={`relative flex min-h-dvh w-full items-center justify-center overflow-hidden px-4 py-12 select-none ${portal.bgStyle}`}
    >
      <GridOverlay />

      {/* Card */}
      <div className="relative z-10 mx-4 w-full max-w-md border border-white/10 bg-black/55 px-6 py-8 text-center backdrop-blur-sm sm:px-10 sm:py-10">
        {/* EG Logo badge */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-white">
          <EGShieldLogo className="h-10 w-10" />
        </div>

        {/* Title */}
        <h1 className="mb-1 text-[clamp(1.2rem,7vw,2rem)] font-black tracking-[0.28em] text-white uppercase sm:tracking-[0.55em]">
          EG&nbsp;&nbsp;COMPANY
        </h1>
        <p className="mb-10 text-[11px] tracking-[0.28em] text-red-500 uppercase sm:tracking-[0.45em]">
          {portal.name}
        </p>

        {/* Form */}
        <div className="space-y-4">
          <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">
            {portal.clearanceLabel}
          </p>
          <p className="text-lg font-semibold tracking-wide text-white">관리자 코드를 입력하세요</p>

          <form onSubmit={handleSubmit} className="mt-2">
            <TerminalInput value={code} onChange={setCode} placeholder="TERMINAL_CODE_XXXX" />
          </form>

          <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] tracking-[0.18em] text-red-500 uppercase">
            <span>🔒</span> {portal.sessionLabel}
          </p>

          {status === "denied" && (
            <p className="animate-pulse text-xs tracking-widest text-red-400 uppercase">
              ACCESS DENIED
            </p>
          )}
        </div>
      </div>

      {/* Bottom metadata */}
      {portal.nodeId && (
        <div className="pointer-events-none absolute right-0 bottom-4 left-0 flex flex-col gap-2 px-4 sm:flex-row sm:justify-between sm:px-6">
          <p className="font-mono text-[10px] tracking-widest text-white/25 uppercase">
            NODE_ID: {portal.nodeId}
          </p>
          <p className="font-mono text-[10px] tracking-widest text-white/25 uppercase">
            ESTABLISHED: 19XX-XXXX
          </p>
        </div>
      )}
    </div>
  );
}
