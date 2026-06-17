"use client";

import Image from "next/image";
import { Printer, Send, TriangleAlert } from "lucide-react";
import { type TerminalMail, type TerminalObjectEntry, type TerminalProgress, type TerminalStage } from "@/lib/terminal-data";
import { PinSelectChallenge } from "../challenges/PinSelectChallenge";
import { CorruptedCommandChallenge } from "../challenges/CorruptedCommandChallenge";
import { PretextChallenge } from "../challenges/PretextChallenge";
import { CompletedPanel, QueuedPanel } from "../ui/TerminalPanels";
import { cx } from "@/theme/classes";

function Redaction({ width }: { width: string }) {
  return <span className={cx("bg-terminal-text-dim mx-1 inline-block h-4 align-middle", width)} />;
}

function SquareTitle({ count, compact = false }: { count: number; compact?: boolean }) {
  return (
    <span
      className={cx("inline-flex items-center", compact ? "gap-1.5" : "gap-3")}
      aria-label="redacted title"
    >
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className={cx("block bg-[#cfd2d7]", compact ? "h-3.5 w-3.5" : "h-8 w-8 sm:h-10 sm:w-10")}
        />
      ))}
    </span>
  );
}

function MailBody({ mail }: { mail: TerminalMail }) {
  return (
    <article className="text-terminal-copy border border-[#211414] bg-[#171111] p-7 text-sm leading-7 lg:p-9">
      {mail.body.map((line, index) => (
        <p
          key={index}
          className={index === 3 ? "mt-5 font-mono text-xs leading-7" : "mt-5 first:mt-0"}
        >
          {index === 3 ? (
            <>
              {line.split(", ").map((item) => (
                <span
                  key={item}
                  className="before:text-terminal-accent mb-2 block before:mr-3 before:content-['▪']"
                >
                  {item}
                </span>
              ))}
            </>
          ) : (
            line
          )}
        </p>
      ))}
    </article>
  );
}

function SecurityAlert() {
  return (
    <aside className="border-terminal-accent mt-5 border-l-4 bg-[#1d1d1d] p-6">
      <h3 className="text-terminal-accent-text font-mono text-sm font-black">
        SECURITY ALERT: INTERNAL SYSTEM ANOMALY
      </h3>
      <p className="text-terminal-copy mt-3 text-xs leading-6">
        추가로, 최근 내부 시스템에서 일부 관련 문서 접근 로그가 비정상적으로 기록되는 사례가
        보고되었습니다. 단순 오류로 판단되고 있으나, 관련 문서 열람 시 이상 징후가 발생할 경우 즉시
        관리자에게 보고해 주시기 바랍니다.
      </p>
    </aside>
  );
}

function UrgentAlertBody() {
  return (
    <article className="text-terminal-copy bg-[#202020] px-6 py-8 shadow-[0_22px_80px_rgb(0_0_0_/0.28)] lg:px-10">
      <h3 className="text-terminal-accent-muted text-[clamp(1.2rem,2.4vw,1.65rem)] font-medium">
        보안팀 열람 요망_기밀 사항
      </h3>

      <div className="mx-auto mt-8 w-full max-w-250px">
        <div className="relative aspect-square overflow-hidden bg-[#333]">
          <Image
            src="/eg_png/egcompany_picture/P/P03.png"
            alt="Last known location map"
            fill
            sizes="250px"
            className="object-cover opacity-55 grayscale"
            priority
          />
          <div className="bg-terminal-accent-strong absolute top-6 left-7 px-4 py-3 font-mono text-[11px] font-black text-white">
            LAST KNOWN LOC
          </div>
          <div className="border-terminal-accent absolute right-6 bottom-6 left-6 border-l-2 bg-black/70 px-4 py-4 font-mono text-[10px] text-white">
            SECTOR 7G: 37.7749° N, 122.4194° W
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-7 text-[clamp(1rem,1.8vw,1.35rem)] leading-[1.85] text-[#d7d0cc]">
        <p>
          운송 팀장 제이크입니다. 캐나다 지부에서 샌프란시스코 격리 시설로의 개체 운송 도중 심각한
          격리 실패 사고가 발생했습니다.
        </p>
        <p>
          운송 도중 개체가 차량을 탈출했으며, 현재 이동 경로상의 통신 지연 및 시스템 로그 누락
          현상이 관찰되고 있습니다. GPS 위치 데이터가 간헐적으로 소실되고 있어 정밀 추적이 불가능한
          상태입니다.
        </p>
      </div>

      <aside className="bg-terminal-accent-strong text-terminal-accent-text mt-8 flex items-center gap-4 px-6 py-5">
        <TriangleAlert className="h-6 w-6 shrink-0" />
        <p className="text-lg font-black tracking-[-0.02em]">SECURITY ALERT</p>
      </aside>

      <p className="mt-8 text-[clamp(1rem,1.8vw,1.35rem)] leading-[1.85] text-[#d7d0cc]">
        해당 개체의 문서를{" "}
        <span className="text-terminal-accent-text">연구팀의 도움 없이 열람</span> 하셨나요? 이미
        WESEN-0101 이 관리자님을 추적하기 시작한 것 같습니다.
      </p>

      <div className="border-terminal-accent/30 mt-10 border-t pt-8">
        <p className="text-[clamp(1rem,1.8vw,1.25rem)] leading-[1.85] text-[#d7d0cc]">
          상황 종료 시까지 해당 구역을 봉쇄하며, 관리자님께서는 즉시 상급자에게 상황 보고
          부탁드립니다. 또한, 조치가 있을 때까지 자리에서 대기 바랍니다.{" "}
          <span className="text-[#172fa5]">어떠한 추가 행동도 하지 마십시오.</span>
        </p>
      </div>

      <div className="mt-5 flex justify-end">
        <div className="flex items-center gap-3 bg-[#1c2484] px-6 py-3 font-mono text-sm font-black text-white">
          <TriangleAlert className="h-5 w-5" />
          SYSTEM ALERT: ACTIVE?
        </div>
      </div>
    </article>
  );
}

export function MessengerList({
  selectedMail,
  visibleMails,
  progress,
  onSelectMail,
}: {
  selectedMail: TerminalMail;
  visibleMails: TerminalMail[];
  progress: TerminalProgress;
  onSelectMail: (mailId: string) => void;
}) {
  return (
    <section className="border-terminal-border min-h-0 border-b bg-[#0d0d0d] lg:border-r lg:border-b-0">
      <div className="border-terminal-border flex h-54px items-center justify-between border-b px-5">
        <h2 className="font-mono text-sm font-black text-white">받은 메일함</h2>
        <p className="text-terminal-accent-muted font-mono text-[9px] tracking-[0.18em]">
          LIVE_FEED
        </p>
      </div>
      <div>
        {visibleMails.map((mail) => {
          const activeChallenge = mail.unlockedStage === progress.currentStage;
          const completedChallenge =
            mail.challengeType === "none" ||
            progress.completedChallengeIds.includes(mail.challengeType);
          const active = selectedMail.id === mail.id;
          const isCorruptedCommandMail = mail.challengeType === "corrupted-command";

          return (
            <button
              key={mail.id}
              type="button"
              onClick={() => onSelectMail(mail.id)}
              className={cx(
                "border-terminal-border block min-h-96px w-full border-b px-5 py-4 text-left transition",
                active
                  ? "bg-terminal-accent-strong text-white"
                  : "text-terminal-text bg-[#101010] hover:bg-[#181818]"
              )}
            >
              <div className="mb-2 flex justify-between gap-3 font-mono text-[10px]">
                <span>{mail.time}</span>
                {active ? (
                  <span className="text-terminal-accent-muted">VIEWING</span>
                ) : completedChallenge ? (
                  <span className="text-terminal-accent-muted">CLEARED</span>
                ) : activeChallenge ? (
                  <span className="text-terminal-accent-muted">ACTIVE</span>
                ) : (
                  <span className="text-terminal-text-dim">QUEUED</span>
                )}
              </div>
              <h3 className="mb-2 text-sm font-black">
                {isCorruptedCommandMail ? <SquareTitle count={8} compact /> : mail.title}
              </h3>
              <p className="text-terminal-text-muted line-clamp-2 text-xs leading-5">
                {mail.preview}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function MessengerDetail({
  mail,
  currentStage,
  completed,
  selectedObjectIds,
  pinError,
  command,
  commandError,
  onToggleObject,
  onSubmitPin,
  onCommandChange,
  onSubmitCommand,
}: {
  mail: TerminalMail;
  currentStage: TerminalStage;
  completed: Set<string>;
  selectedObjectIds: string[];
  pinError: string;
  command: string;
  commandError: string;
  onToggleObject: (entry: TerminalObjectEntry) => void;
  onSubmitPin: () => void;
  onCommandChange: (value: string) => void;
  onSubmitCommand: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const isCurrentChallenge = mail.unlockedStage === currentStage;
  const isCompletedChallenge =
    mail.challengeType === "none" ||
    mail.challengeType === "completed" ||
    completed.has(mail.challengeType);
  const isUrgentCubeMail = mail.challengeType === "cube-hold";
  const isCorruptedCommandMail = mail.challengeType === "corrupted-command";

  return (
    <section className="min-h-0 overflow-y-auto bg-[#101010]">
      <div className="border-terminal-border border-b px-6 py-7 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-[clamp(1.6rem,3.2vw,2.35rem)] font-black tracking-[-0.04em] text-white">
            {isCorruptedCommandMail ? <SquareTitle count={8} /> : mail.title}
          </h2>
          {!isCorruptedCommandMail && (
            <div className="flex shrink-0 gap-2">
              <button className="border-terminal-border bg-terminal-tile grid h-8 w-8 place-items-center border">
                <Printer className="h-4 w-4" />
              </button>
              <button className="border-terminal-border bg-terminal-tile grid h-8 w-8 place-items-center border">
                <Send className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="text-terminal-text-dim grid gap-4 font-mono text-[10px] sm:grid-cols-2">
          <p className="border-terminal-accent border-l-2 pl-4">
            FROM:{" "}
            {isCorruptedCommandMail ? (
              <Redaction width="w-36" />
            ) : (
              <span className="text-terminal-copy-strong ml-4">{mail.sender}</span>
            )}
          </p>
          <p className="border-terminal-accent border-l-2 pl-4">
            TO: <span className="text-terminal-copy-strong ml-4">{mail.to}</span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-920px px-6 py-7 lg:px-8">
        {isUrgentCubeMail ? (
          <UrgentAlertBody />
        ) : !isCorruptedCommandMail ? (
          <>
            <MailBody mail={mail} />
            <SecurityAlert />
            <div className="bg-terminal-border my-6 h-px" />
          </>
        ) : null}

        {renderChallenge({
          mail,
          isCurrentChallenge,
          isCompletedChallenge,
          completed,
          selectedObjectIds,
          pinError,
          command,
          commandError,
          onToggleObject,
          onSubmitPin,
          onCommandChange,
          onSubmitCommand,
        })}
      </div>

      <footer className="border-terminal-border text-terminal-text-dim mt-auto grid gap-3 border-t px-6 py-3 font-mono text-[9px] tracking-[0.16em] sm:grid-cols-3 lg:px-8">
        <span>ENCRYPTION: AES-256-WES</span>
        <span>SIGNAL: SECURE_CHANNEL_STABLE</span>
        <span>TERMINAL_ID: S15-ADM-001-L5</span>
      </footer>
    </section>
  );
}

function renderChallenge({
  mail,
  isCurrentChallenge,
  isCompletedChallenge,
  completed,
  selectedObjectIds,
  pinError,
  command,
  commandError,
  onToggleObject,
  onSubmitPin,
  onCommandChange,
  onSubmitCommand,
}: {
  mail: TerminalMail;
  isCurrentChallenge: boolean;
  isCompletedChallenge: boolean;
  completed: Set<string>;
  selectedObjectIds: string[];
  pinError: string;
  command: string;
  commandError: string;
  onToggleObject: (entry: TerminalObjectEntry) => void;
  onSubmitPin: () => void;
  onCommandChange: (value: string) => void;
  onSubmitCommand: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  if (mail.challengeType === "none") return null;
  if (!isCurrentChallenge && !isCompletedChallenge) return <QueuedPanel label="NEXT_SECTION_LOCKED" />;

  switch (mail.challengeType) {
    case "pin-select":
      return (
        <PinSelectChallenge
          completed={completed}
          selectedObjectIds={selectedObjectIds}
          pinError={pinError}
          onToggleObject={onToggleObject}
          onSubmitPin={onSubmitPin}
        />
      );
    case "cube-hold":
      return completed.has("cube-hold") ? <CompletedPanel label="CUBE_PROTOCOL_RESOLVED" /> : null;
    case "corrupted-command":
      return (
        <CorruptedCommandChallenge
          completed={completed}
          command={command}
          commandError={commandError}
          onCommandChange={onCommandChange}
          onSubmitCommand={onSubmitCommand}
        />
      );
    case "pretext-ending":
      return <PretextChallenge completed={completed} />;
    default:
      return <CompletedPanel label="ID_CARD_DELIVERY_RESERVED" />;
  }
}
