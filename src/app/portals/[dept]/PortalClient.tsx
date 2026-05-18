"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Shield, TerminalSquare, Settings, LogOut } from "lucide-react";
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
    if (code.trim()) {
      if (portal.isSecurity) {
        router.push("/portals/security/terminal");
      }
      return;
    }
    setStatus("denied");
    setTimeout(() => setStatus("idle"), 1800);
  }

  /* ── SECURITY variant ── */
  if (portal.isSecurity) {
    return (
      <main className="min-h-screen overflow-hidden bg-[#101010] text-[#f2f0ec]">
        <header className="grid h-[74px] grid-cols-[1fr_auto] items-center border-b border-[#2b2b2b] bg-[#151515] px-8">
          <h1 className="text-[26px] font-black tracking-[-0.02em]">
            EG COMPANY - {portal.name.toUpperCase()}
          </h1>
          <div className="flex items-center gap-5">
            <Bell className="h-7 w-7 text-slate-500" />
            <TerminalSquare className="h-7 w-7 text-slate-500" />
          </div>
        </header>

        <div className="flex h-[calc(100vh-74px)] flex-col items-center justify-center">
          <GridOverlay />
          
          <div className="relative z-10 max-w-md space-y-8">
            <div className="text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center bg-[#a30000] mx-auto">
                <Shield className="h-10 w-10 fill-white text-white" />
              </div>
              <div>
                <h2 className="text-[28px] font-black tracking-[0.16em] text-white">
                  SECURITY ACCESS
                </h2>
                <p className="text-sm text-slate-400 tracking-widest font-mono mt-2">
                  AUTHORIZATION REQUIRED
                </p>
              </div>
            </div>

            <div className="border border-[#2b2b2b] bg-[#151515] p-8 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-xs tracking-[0.25em] text-slate-500 uppercase font-mono">
                  {portal.clearanceLabel}
                </p>
                <p className="text-lg font-semibold text-white tracking-wide">
                  관리자 코드를 입력하세요
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <TerminalInput value={code} onChange={setCode} placeholder="CODE_XXXX" />
              </form>

              <p className="text-xs tracking-[0.2em] text-[#b00000] uppercase flex items-center justify-center gap-2 font-mono">
                🔒 {portal.sessionLabel}
              </p>

              {status === "denied" && (
                <p className="text-xs tracking-widest text-red-400 uppercase animate-pulse text-center">
                  ACCESS DENIED
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── Standard department variant ── */
  return (
    <main className="min-h-screen overflow-hidden bg-[#101010] text-[#f2f0ec]">
      <header className="grid h-[74px] grid-cols-[1fr_auto] items-center border-b border-[#2b2b2b] bg-[#151515] px-8">
        <h1 className="text-[26px] font-black tracking-[-0.02em]">
          EG COMPANY - {portal.name.toUpperCase()}
        </h1>
        <div className="flex items-center gap-5">
          <Bell className="h-7 w-7 text-slate-500" />
          <TerminalSquare className="h-7 w-7 text-slate-500" />
        </div>
      </header>

      <div className="grid h-[calc(100vh-74px)] grid-cols-[350px_1fr]">
        {/* Sidebar */}
        <aside className="flex min-h-0 flex-col border-r border-[#2b2b2b] bg-[#101111]">
          <section className="flex items-center gap-4 border-b border-[#2b2b2b] px-8 py-9">
            <div className="flex h-14 w-14 items-center justify-center bg-[#a30000]">
              <Shield className="h-8 w-8 fill-white text-white" />
            </div>
            <div>
              <p className="font-mono text-xs tracking-[0.42em] text-slate-500">
                DEPARTMENT
              </p>
              <p className="mt-2 font-mono text-sm tracking-[0.16em]">{portal.name}</p>
            </div>
          </section>

          <nav className="py-8 font-mono tracking-[0.26em] text-slate-500">
            <a className="flex items-center gap-5 px-8 py-5 text-base hover:bg-[#1a1a1a] transition-colors cursor-pointer">
              <span className="text-xl">i</span>
              INFORMATION
            </a>
            <a className="flex items-center gap-5 px-8 py-5 text-base hover:bg-[#1a1a1a] transition-colors cursor-pointer">
              <Shield className="h-5 w-5" />
              SECURITY
            </a>
            <a className="flex items-center gap-5 px-8 py-5 text-base hover:bg-[#1a1a1a] transition-colors cursor-pointer">
              <TerminalSquare className="h-5 w-5" />
              RESOURCES
            </a>
          </nav>

          <div className="mt-auto border-t border-[#2b2b2b] p-6 space-y-4">
            <button className="w-full bg-white px-5 py-4 font-mono text-xs font-black text-black hover:bg-gray-200 transition-colors">
              REQUEST_ACCESS
            </button>
            <div className="space-y-3 text-xs tracking-[0.2em] text-slate-500 font-mono">
              <p className="flex items-center gap-2 cursor-pointer hover:text-slate-400">
                <Settings className="h-4 w-4" />
                SETTINGS
              </p>
              <p className="flex items-center gap-2 cursor-pointer hover:text-slate-400">
                <LogOut className="h-4 w-4" />
                LOGOUT
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="min-h-0 overflow-y-auto bg-[#151515] flex flex-col items-center justify-center">
          <GridOverlay />
          
          <div className="relative z-10 max-w-lg space-y-8 w-full p-8">
            <div className="text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center bg-white mx-auto">
                <EGShieldLogo className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-[28px] font-black tracking-[0.16em] text-white">
                  {portal.name.toUpperCase()}
                </h2>
                <p className="text-sm text-slate-400 tracking-widest font-mono mt-2">
                  DEPARTMENT ACCESS
                </p>
              </div>
            </div>

            <div className="border border-[#2b2b2b] bg-[#0d0e0e] p-8 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-xs tracking-[0.25em] text-slate-500 uppercase font-mono">
                  {portal.clearanceLabel}
                </p>
                <p className="text-lg font-semibold text-white tracking-wide">
                  관리자 코드를 입력하세요
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <TerminalInput
                  value={code}
                  onChange={setCode}
                  placeholder="ACCESS_CODE"
                />
              </form>

              <p className="text-xs tracking-[0.2em] text-[#b00000] uppercase flex items-center justify-center gap-2 font-mono">
                🔒 {portal.sessionLabel}
              </p>

              {status === "denied" && (
                <p className="text-xs tracking-widest text-red-400 uppercase animate-pulse text-center">
                  ACCESS DENIED
                </p>
              )}
            </div>

            {portal.nodeId && (
              <div className="text-center space-y-2 border-t border-[#2b2b2b] pt-6">
                <p className="text-[10px] tracking-widest text-slate-600 uppercase font-mono">
                  NODE_ID: {portal.nodeId}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
