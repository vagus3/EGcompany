"use client";

import { useState } from "react";
import { Eye, Lock, TriangleAlert } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cx } from "@/theme/classes";

type ContainmentLog = {
  badge: string;
  badgeClassName: string;
  timestamp: string;
  title: string;
  summary: string;
  summary_en?: string;
  author: string;
  locked: boolean;
  critical?: boolean;
};

const containmentLogs: ContainmentLog[] = [
  {
    badge: "DECLASSIFIED",
    badgeClassName: "border-terminal-accent text-terminal-accent",
    timestamp: "1987-11-04T03:14:00Z",
    title: "[LOG-1341] Access Granted",
    summary: "WESEN-1744 사용. 안치실 열람 및 수용 목적. 연구팀 동원.",
    summary_en: "WESEN-1744 utilized. Purpose: containment room access and intake. Research team mobilized.",
    author: "HR",
    locked: false,
  },
  {
    badge: "RESTRICTED",
    badgeClassName: "border-[#d09a00] text-[#d09a00]",
    timestamp: "1987-12-12T14:22:10Z",
    title: "[LOG-5682] ANOMALY",
    summary:
      "이상 행동 편차가 최초로 기록됨. 주 격리 용기의 구조적 무결성이 일시적으로 손상됨. 보안팀 증원 요청.",
    summary_en: "Anomalous behavioral deviation recorded for the first time. Structural integrity of primary containment vessel temporarily compromised. Security team reinforcement requested.",
    author: "RESEARCH",
    locked: false,
  },
  {
    badge: "ENCRYPTED",
    badgeClassName: "border-[#ff4056] text-[#ff4056]",
    timestamp: "1988-03-01T09:05:44Z",
    title: "[LOG-4541] Access Granted",
    summary: "보안팀 타 부서 지원 허가. 연구실로 이동. 보호 처리 완료.",
    summary_en: "Security team authorized to support other departments. Transferred to laboratory. Protective processing completed.",
    author: "SECURITY",
    locked: true,
  },
];

const criticalPersonnelLog: ContainmentLog = {
  badge: "CRITICAL",
  badgeClassName: "border-terminal-accent text-terminal-accent",
  timestamp: "1988-04-15T00:00:01Z",
  title: "[LOG-????] ???????????",
  summary: '"추적" 행동이 시작되었습니다.',
  summary_en: '"Tracking" behavior has commenced.',
  author: "AUTO-SYS ALARM",
  locked: false,
  critical: true,
};

function Redaction({ width }: { width: string }) {
  return <span className={cx("bg-terminal-text-dim mx-1 inline-block h-4 align-middle", width)} />;
}

export function ContainmentLogsPage({ showCriticalLog }: { showCriticalLog: boolean }) {
  const lang = useLanguage();
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [deniedLog, setDeniedLog] = useState<string | null>(null);

  const visibleLogs = showCriticalLog
    ? [...containmentLogs, criticalPersonnelLog]
    : containmentLogs;

  function toggleExpand(title: string) {
    setExpandedLog((prev) => (prev === title ? null : title));
  }

  function handleLocked(title: string) {
    setDeniedLog(title);
    setTimeout(() => setDeniedLog(null), 1200);
  }

  return (
    <section className="min-h-0 overflow-y-auto bg-[#080808] px-5 py-12 sm:px-10 lg:px-18 lg:py-16">
      <div className="mx-auto max-w-6xl">

        {/* 상태 바 */}
        <div className="mb-6 flex items-center justify-between border border-terminal-border bg-[#0d0d0d] px-4 py-2 font-mono text-[9px] tracking-[0.2em]">
          <span className="text-terminal-text-dim">SYSTEM // SECURE_LOG_VIEWER_v2.4</span>
          <span
            className={cx(
              "font-black",
              showCriticalLog
                ? "text-terminal-accent-text animate-pulse"
                : "text-terminal-text-dim"
            )}
          >
            {showCriticalLog ? "⚠ BREACH DETECTED" : "STATUS: NOMINAL"}
          </span>
        </div>

        <h2 className="text-[clamp(2.2rem,5vw,4.4rem)] leading-none font-black tracking-[-0.06em] text-white uppercase">
          Secure Containment Logs
        </h2>
        <div className="bg-terminal-border mt-10 h-px" />

        <div className="mt-12 space-y-5">
          {visibleLogs.map((log) => {
            const isExpanded = expandedLog === log.title;
            const isDenied = deniedLog === log.title;

            return (
              <article
                key={log.title}
                className={cx(
                  "border border-l-4 transition-all duration-300",
                  log.critical
                    ? "border-terminal-accent bg-[#260406] shadow-[0_0_18px_rgba(176,0,0,0.18)]"
                    : "border-terminal-border bg-[#111] hover:bg-[#141414]",
                  log.critical && "animate-[critical-pulse_2.2s_ease-in-out_infinite]"
                )}
              >
                <div className="grid gap-5 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-7 sm:py-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-4 font-mono">
                      <span
                        className={cx(
                          "border px-3 py-1 text-[10px] font-black tracking-[0.12em]",
                          log.badgeClassName
                        )}
                      >
                        {log.badge}
                      </span>
                      <span className="text-terminal-text-dim text-xs font-black tracking-[0.12em]">
                        TS: {log.timestamp}
                      </span>
                    </div>
                    <h3 className="mt-5 text-[clamp(1.35rem,3vw,2.2rem)] leading-none font-black tracking-[-0.04em] text-white">
                      {log.title}
                    </h3>
                    <p className="text-terminal-text-muted mt-4 max-w-4xl text-sm leading-7 sm:text-base">
                      {log.critical ? (
                        <>
                          {lang === "en" ? (log.summary_en ?? log.summary) : log.summary}{" "}
                          <Redaction width="w-44" /> <Redaction width="w-24" />{" "}
                          <Redaction width="w-16" />{lang === "en" ? " and" : " 및"}{" "}
                          <Redaction width="w-20" />{lang === "en" ? " required." : " 요망."}
                        </>
                      ) : log.locked ? (
                        lang === "en" ? (
                          <>
                            Security team authorized to support other departments.{" "}
                            <Redaction width="w-24" /> Transferred to laboratory.{" "}
                            <Redaction width="w-44" /> <Redaction width="w-12" />{" "}
                            <Redaction width="w-36" /> and protective processing completed.
                          </>
                        ) : (
                          <>
                            보안팀 타 부서 지원 허가. <Redaction width="w-24" /> 연구실로 이동.{" "}
                            <Redaction width="w-44" /> <Redaction width="w-12" />{" "}
                            <Redaction width="w-36" /> 및 보호 처리 완료.
                          </>
                        )
                      ) : (
                        lang === "en" ? (log.summary_en ?? log.summary) : log.summary
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] items-center gap-4 sm:min-w-38">
                    <div className="text-right font-mono">
                      <p className="text-terminal-text-dim text-xs font-black">AUTHOR</p>
                      <p className="mt-2 text-sm font-black text-white">{log.author}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        log.locked ? handleLocked(log.title) : toggleExpand(log.title)
                      }
                      className={cx(
                        "grid h-11 w-11 place-items-center border bg-[#151515] transition-all duration-200",
                        isDenied
                          ? "border-terminal-accent bg-[#1a0000] text-terminal-accent-text"
                          : log.critical
                            ? "border-terminal-accent text-terminal-accent-text"
                            : log.locked
                              ? "border-terminal-border text-terminal-text-dim hover:border-[#ff4056] hover:text-[#ff4056]"
                              : isExpanded
                                ? "border-terminal-accent-muted bg-[#1a1010] text-terminal-accent-muted"
                                : "border-terminal-border text-terminal-text-dim hover:border-terminal-accent-muted hover:text-terminal-accent-muted"
                      )}
                      aria-label={`${log.locked ? "Locked" : "View"} ${log.title}`}
                    >
                      {isDenied ? (
                        <span className="font-mono text-[7px] font-black leading-none tracking-[0.05em]">
                          DENY
                        </span>
                      ) : log.critical ? (
                        <TriangleAlert className="h-5 w-5" />
                      ) : log.locked ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <Eye className={cx("h-5 w-5 transition-transform duration-200", isExpanded && "opacity-50")} />
                      )}
                    </button>
                  </div>
                </div>

                {/* 확장 패널 */}
                {isExpanded && !log.locked && !log.critical && (
                  <div className="border-terminal-border border-t bg-[#0d0d0d] px-7 py-5">
                    <p className="text-terminal-text-dim mb-4 font-mono text-[9px] tracking-[0.28em]">
                      FULL_RECORD // DECRYPTED
                    </p>
                    <div className="grid gap-4 font-mono text-[10px] sm:grid-cols-3">
                      <div>
                        <p className="text-terminal-text-dim mb-1 tracking-[0.18em]">TIMESTAMP</p>
                        <p className="text-terminal-copy-strong">{log.timestamp}</p>
                      </div>
                      <div>
                        <p className="text-terminal-text-dim mb-1 tracking-[0.18em]">AUTHOR</p>
                        <p className="text-terminal-copy-strong">{log.author}</p>
                      </div>
                      <div>
                        <p className="text-terminal-text-dim mb-1 tracking-[0.18em]">CLEARANCE</p>
                        <p className={cx("font-black", log.badgeClassName.split(" ")[1])}>{log.badge}</p>
                      </div>
                    </div>
                    <div className="border-terminal-border mt-4 border-t pt-4">
                      <p className="text-terminal-text-dim mb-2 font-mono text-[9px] tracking-[0.18em]">
                        LOG_BODY
                      </p>
                      <p className="text-terminal-text-muted text-sm leading-6">{log.summary}</p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
