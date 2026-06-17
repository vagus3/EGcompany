"use client";

import { Eye, Lock, TriangleAlert } from "lucide-react";
import { cx } from "@/theme/classes";

type ContainmentLog = {
  badge: string;
  badgeClassName: string;
  timestamp: string;
  title: string;
  summary: string;
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
    author: "RESEARCH",
    locked: false,
  },
  {
    badge: "ENCRYPTED",
    badgeClassName: "border-[#ff4056] text-[#ff4056]",
    timestamp: "1988-03-01T09:05:44Z",
    title: "[LOG-4541] Access Granted",
    summary: "보안팀 타 부서 지원 허가. 연구실로 이동. 보호 처리 완료.",
    author: "SECURITY",
    locked: true,
  },
];

const criticalPersonnelLog: ContainmentLog = {
  badge: "CRITICAL",
  badgeClassName: "border-terminal-accent text-terminal-accent",
  timestamp: "1988-04-15T00:00:01Z",
  title: "[LOG-????] ???????????",
  summary: '“추적” 행동이 시작되었습니다.',
  author: "AUTO-SYS ALARM",
  locked: false,
  critical: true,
};

function Redaction({ width }: { width: string }) {
  return <span className={cx("bg-terminal-text-dim mx-1 inline-block h-4 align-middle", width)} />;
}

export function ContainmentLogsPage({ showCriticalLog }: { showCriticalLog: boolean }) {
  const visibleLogs = showCriticalLog
    ? [...containmentLogs, criticalPersonnelLog]
    : containmentLogs;

  return (
    <section className="min-h-0 overflow-y-auto bg-[#080808] px-5 py-12 sm:px-10 lg:px-18 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-[clamp(2.2rem,5vw,4.4rem)] leading-none font-black tracking-[-0.06em] text-white uppercase">
          Secure Containment Logs
        </h2>
        <div className="bg-terminal-border mt-10 h-px" />

        <div className="mt-12 space-y-5">
          {visibleLogs.map((log) => (
            <article
              key={log.title}
              className={cx(
                "grid gap-5 border border-l-4 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-7 sm:py-6",
                log.critical
                  ? "border-terminal-accent bg-[#260406]"
                  : "border-terminal-border bg-[#111]"
              )}
            >
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
                      {log.summary} <Redaction width="w-44" /> <Redaction width="w-24" />{" "}
                      <Redaction width="w-16" /> 및 <Redaction width="w-20" /> 요망.
                    </>
                  ) : log.locked ? (
                    <>
                      보안팀 타 부서 지원 허가. <Redaction width="w-24" /> 연구실로 이동.{" "}
                      <Redaction width="w-44" /> <Redaction width="w-12" />{" "}
                      <Redaction width="w-36" /> 및 보호 처리 완료.
                    </>
                  ) : (
                    log.summary
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
                  className={cx(
                    "grid h-11 w-11 place-items-center border bg-[#151515]",
                    log.critical
                      ? "border-terminal-accent text-terminal-accent-text"
                      : "border-terminal-border text-terminal-text-dim"
                  )}
                  aria-label={`${log.locked ? "Locked" : "View"} ${log.title}`}
                >
                  {log.critical ? (
                    <TriangleAlert className="h-5 w-5" />
                  ) : log.locked ? (
                    <Lock className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
