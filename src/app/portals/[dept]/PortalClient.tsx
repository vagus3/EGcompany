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
      <span className={`${sq} -bottom-[3px] -right-[3px]`} />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="w-full border border-white/25 bg-white/5 px-6 py-4 text-white/50 tracking-[0.28em] text-center font-mono text-sm uppercase placeholder:text-white/20 focus:outline-none focus:border-white/50 focus:bg-white/8 focus:text-white/80 transition-colors"
      />
    </div>
  );
}

/* ── Background grid overlay (subtle) ── */
function GridOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.04]"
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
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center relative select-none">
        <GridOverlay />

        <div className="text-center space-y-1 mb-16">
          <h1 className="text-[clamp(1.6rem,4vw,2.6rem)] font-black tracking-[0.55em] text-white uppercase">
            EG&nbsp;&nbsp;COMPANY
          </h1>
          <p className="text-xs tracking-[0.45em] text-red-500 uppercase">
            {portal.name}
          </p>
        </div>

        <div className="w-full max-w-sm space-y-5 text-center">
          <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">
            {portal.clearanceLabel}
          </p>
          <p className="text-xl font-semibold text-white tracking-wide">
            관리자 코드를 입력하세요
          </p>

          <form onSubmit={handleSubmit}>
            <TerminalInput value={code} onChange={setCode} placeholder="X" />
          </form>

          <p className="text-[10px] tracking-[0.2em] text-red-500 uppercase flex items-center justify-center gap-1.5">
            <span>🔒</span> {portal.sessionLabel}
          </p>

          {status === "denied" && (
            <p className="text-xs tracking-widest text-red-400 uppercase animate-pulse">
              ACCESS DENIED
            </p>
          )}

          {portal.codes && (
            <div className="pt-2 space-y-1">
              {portal.codes.map((c) => (
                <p key={c} className="text-sm font-mono text-white/60 tracking-widest">
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
    <div className={`w-screen h-screen ${portal.bgStyle} flex items-center justify-center relative overflow-hidden select-none`}>
      <GridOverlay />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-6 bg-black/55 border border-white/10 backdrop-blur-sm px-10 py-10 text-center">
        {/* EG Logo badge */}
        <div className="w-14 h-14 bg-white mx-auto mb-5 flex items-center justify-center">
          <EGShieldLogo className="w-10 h-10" />
        </div>

        {/* Title */}
        <h1 className="text-[clamp(1.4rem,3.5vw,2rem)] font-black tracking-[0.55em] text-white uppercase mb-1">
          EG&nbsp;&nbsp;COMPANY
        </h1>
        <p className="text-[11px] tracking-[0.45em] text-red-500 uppercase mb-10">
          {portal.name}
        </p>

        {/* Form */}
        <div className="space-y-4">
          <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">
            {portal.clearanceLabel}
          </p>
          <p className="text-lg font-semibold text-white tracking-wide">
            관리자 코드를 입력하세요
          </p>

          <form onSubmit={handleSubmit} className="mt-2">
            <TerminalInput
              value={code}
              onChange={setCode}
              placeholder="TERMINAL_CODE_XXXX"
            />
          </form>

          <p className="text-[10px] tracking-[0.18em] text-red-500 uppercase flex items-center justify-center gap-1.5 mt-2">
            <span>🔒</span> {portal.sessionLabel}
          </p>

          {status === "denied" && (
            <p className="text-xs tracking-widest text-red-400 uppercase animate-pulse">
              ACCESS DENIED
            </p>
          )}
        </div>
      </div>

      {/* Bottom metadata */}
      {portal.nodeId && (
        <div className="absolute bottom-4 left-0 right-0 px-6 flex justify-between pointer-events-none">
          <p className="text-[10px] tracking-widest text-white/25 uppercase font-mono">
            NODE_ID: {portal.nodeId}
          </p>
          <p className="text-[10px] tracking-widest text-white/25 uppercase font-mono">
            ESTABLISHED: 19XX-XXXX
          </p>
        </div>
      )}
    </div>
  );
}
