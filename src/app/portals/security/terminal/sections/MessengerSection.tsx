"use client";

import Image from "next/image";
import { FileText, Printer, Send, TriangleAlert } from "lucide-react";
import { type TerminalMail, type TerminalObjectEntry, type TerminalProgress, type TerminalStage } from "@/lib/terminal-data";
import { useLanguage } from "@/hooks/useLanguage";
import { PinSelectChallenge } from "../challenges/PinSelectChallenge";
import { CorruptedCommandChallenge } from "../challenges/CorruptedCommandChallenge";
import { PretextChallenge } from "../challenges/PretextChallenge";
import { CompletedPanel, QueuedPanel } from "../ui/TerminalPanels";
import { cx } from "@/theme/classes";

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

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
  const lang = useLanguage();
  const body = (lang === "en" && mail.body_en) ? mail.body_en : mail.body;

  return (
    <article className="text-terminal-copy border border-[#211414] bg-[#171111] p-7 text-sm leading-7 lg:p-9">
      {body.map((line, index) => (
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

function ResearchReportBody() {
  const lang = useLanguage();
  const isEn = lang === "en";
  const bullets = isEn
    ? [
        "Logistics and transport division revenue +18% growth",
        "Improved transport stability with the introduction of biometric response analysis systems",
        "Abnormal data patterns detected in some transport segments",
        'The phenomenon is currently assessed as a "controllable level"',
        "Need to review high risk entity classification criteria and strengthen management procedures",
        "Proceed with further analysis of recurring abnormal behavior patterns for specific objects",
      ]
    : [
        "물류 및 운송 부문 매출 +18% 성장",
        "생체 반응 분석 시스템 도입으로 운송 안정성 향상",
        "일부 운송 구간에서 비정상적인 데이터 패턴 감지",
        "해당 현상은 현재 “통제 가능한 수준”으로 평가됨",
        "고위험 개체 분류 기준 재검토 및 관리 절차 강화 필요",
        "특정 개체의 반복적 이상 행동 패턴에 대한 추가 분석 진행"
      ];

  return (
    <>
      <article className="text-terminal-copy border border-[#211414] bg-[#171111] p-7 text-sm leading-7 lg:p-9">
        <p>
          {isEn
            ? "Attaching the Q2 performance report PDF. Please review it and attend the upcoming all-hands meeting fully briefed."
            : "2분기 실적 보고서 pdf 첨부 드립니다. 확인하시고 추후 사내 전체 회의에 숙지 하셔서 참석 부탁드립니다."}
        </p>

        <p className="mt-7">{isEn ? "Key Points" : "주요 내용"}</p>
        <ul className="mt-4 space-y-2">
          {bullets.map((item, index) => (
            <li key={item} className="flex gap-3">
              <span className="text-terminal-accent shrink-0">{ROMAN_NUMERALS[index]}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>

      <aside className="border-terminal-accent mt-5 border-l-4 bg-[#1d1d1d] p-6">
        <p className="text-terminal-accent-text text-base">
          {isEn
            ? "This document has been reviewed by WESEN-783."
            : "해당 문서는 WESEN-783 에 의해 검토 되었습니다."}
        </p>
        <div className="mt-5 flex items-center justify-between gap-4 bg-[#101010] px-5 py-4">
          <span className="flex items-center gap-3 text-sm text-white">
            <FileText className="text-terminal-text-muted h-4 w-4 shrink-0" />
            Q2_EG COMPANY Operational Report.pdf
          </span>
          <span className="text-terminal-text-dim shrink-0 font-mono text-xs">1.2MB</span>
        </div>
      </aside>
      <div className="bg-terminal-border my-6 h-px" />
    </>
  );
}

function SecurityAlert() {
  const lang = useLanguage();
  return (
    <aside className="border-terminal-accent mt-5 border-l-4 bg-[#1d1d1d] p-6">
      <h3 className="text-terminal-accent-text font-mono text-sm font-black">
        SECURITY ALERT: INTERNAL SYSTEM ANOMALY
      </h3>
      <p className="text-terminal-copy mt-3 text-xs leading-6">
        {lang === "en"
          ? "Additionally, cases of abnormal access log recording for some related documents have been reported in the internal system recently. This is currently assessed as a simple error, but if any anomalous signs occur when viewing related documents, please report to the administrator immediately."
          : "추가로, 최근 내부 시스템에서 일부 관련 문서 접근 로그가 비정상적으로 기록되는 사례가 보고되었습니다. 단순 오류로 판단되고 있으나, 관련 문서 열람 시 이상 징후가 발생할 경우 즉시 관리자에게 보고해 주시기 바랍니다."}
      </p>
    </aside>
  );
}

function UrgentAlertBody() {
  const lang = useLanguage();
  const isEn = lang === "en";
  return (
    <article className="text-terminal-copy bg-[#202020] px-6 py-8 shadow-[0_22px_80px_rgb(0_0_0_/0.28)] lg:px-10">
      <h3 className="text-terminal-accent-muted text-[clamp(1.2rem,2.4vw,1.65rem)] font-medium">
        {isEn ? "SECURITY TEAM ACCESS REQUIRED_CLASSIFIED" : "보안팀 열람 요망_기밀 사항"}
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
        {isEn ? (
          <>
            <p>This is Transport Team Lead Jake. A serious containment failure occurred during the transfer of an object from the Canada branch to the San Francisco containment facility.</p>
            <p>The object escaped the vehicle during transport. Communication delays and missing system logs are currently being observed along the travel route. GPS location data is intermittently lost, making precise tracking impossible.</p>
          </>
        ) : (
          <>
            <p>운송 팀장 제이크입니다. 캐나다 지부에서 샌프란시스코 격리 시설로의 개체 운송 도중 심각한 격리 실패 사고가 발생했습니다.</p>
            <p>운송 도중 개체가 차량을 탈출했으며, 현재 이동 경로상의 통신 지연 및 시스템 로그 누락 현상이 관찰되고 있습니다. GPS 위치 데이터가 간헐적으로 소실되고 있어 정밀 추적이 불가능한 상태입니다.</p>
          </>
        )}
      </div>

      <aside className="bg-terminal-accent-strong text-terminal-accent-text mt-8 flex items-center gap-4 px-6 py-5">
        <TriangleAlert className="h-6 w-6 shrink-0" />
        <p className="text-lg font-black tracking-[-0.02em]">SECURITY ALERT</p>
      </aside>

      <p className="mt-8 text-[clamp(1rem,1.8vw,1.35rem)] leading-[1.85] text-[#d7d0cc]">
        {isEn ? (
          <>Did you view this object&apos;s documents{" "}<span className="text-terminal-accent-text">without the assistance of the research team</span>? It appears that WESEN-0101 has already begun tracking you.</>
        ) : (
          <>해당 개체의 문서를{" "}<span className="text-terminal-accent-text">연구팀의 도움 없이 열람</span> 하셨나요? 이미 WESEN-0101 이 관리자님을 추적하기 시작한 것 같습니다.</>
        )}
      </p>

      <div className="border-terminal-accent/30 mt-10 border-t pt-8">
        <p className="text-[clamp(1rem,1.8vw,1.25rem)] leading-[1.85] text-[#d7d0cc]">
          {isEn ? (
            <>The area will remain sealed until the situation is resolved. Please report the situation to your superior immediately and remain at your post until further notice.{" "}<span className="text-[#172fa5]">Take no additional action whatsoever.</span></>
          ) : (
            <>상황 종료 시까지 해당 구역을 봉쇄하며, 관리자님께서는 즉시 상급자에게 상황 보고 부탁드립니다. 또한, 조치가 있을 때까지 자리에서 대기 바랍니다.{" "}<span className="text-[#172fa5]">어떠한 추가 행동도 하지 마십시오.</span></>
          )}
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
  const lang = useLanguage();

  return (
    <section className="border-terminal-border min-h-0 border-b bg-[#0d0d0d] lg:border-r lg:border-b-0">
      <div className="border-terminal-border flex h-54px items-center justify-between border-b px-5">
        <h2 className="font-mono text-sm font-black text-white">
          {lang === "en" ? "INBOX" : "받은 메일함"}
        </h2>
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
          const title = (lang === "en" && mail.title_en) ? mail.title_en : mail.title;
          const preview = (lang === "en" && mail.preview_en) ? mail.preview_en : mail.preview;

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
                {isCorruptedCommandMail ? <SquareTitle count={8} compact /> : title}
              </h3>
              <p className="text-terminal-text-muted line-clamp-2 text-xs leading-5">
                {preview}
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
  userName,
  onToggleObject,
  onSubmitPin,
  onCommandChange,
  onSubmitCommand,
  onOpenCubeModal,
}: {
  mail: TerminalMail;
  currentStage: TerminalStage;
  completed: Set<string>;
  selectedObjectIds: string[];
  pinError: string;
  command: string;
  commandError: string;
  userName: string;
  onToggleObject: (entry: TerminalObjectEntry) => void;
  onSubmitPin: () => void;
  onCommandChange: (value: string) => void;
  onSubmitCommand: (event: React.FormEvent<HTMLFormElement>) => void;
  onOpenCubeModal: () => void;
}) {
  const lang = useLanguage();
  const isCurrentChallenge = mail.unlockedStage === currentStage;
  const isCompletedChallenge =
    mail.challengeType === "none" ||
    mail.challengeType === "completed" ||
    completed.has(mail.challengeType);
  const isUrgentCubeMail = mail.challengeType === "cube-hold";
  const isCorruptedCommandMail = mail.challengeType === "corrupted-command";
  const mailTitle = (lang === "en" && mail.title_en) ? mail.title_en : mail.title;
  const mailSender = (lang === "en" && mail.sender_en) ? mail.sender_en : mail.sender;

  return (
    <section className="min-h-0 overflow-y-auto bg-[#101010]">
      <div className="border-terminal-border border-b px-6 py-7 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-[clamp(1.6rem,3.2vw,2.35rem)] font-black tracking-[-0.04em] text-white">
            {isCorruptedCommandMail ? <SquareTitle count={8} /> : mailTitle}
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
              <span className="text-terminal-copy-strong ml-4">{mailSender}</span>
            )}
          </p>
          <p className="border-terminal-accent border-l-2 pl-4">
            TO:{" "}
            <span className="text-terminal-copy-strong ml-4">
              {mail.to === "(플레이어)" ? userName : mail.to}
            </span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-920px px-6 py-7 lg:px-8">
        {isUrgentCubeMail ? (
          <UrgentAlertBody />
        ) : mail.id === "cube-warning" ? (
          <ResearchReportBody />
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
          onOpenCubeModal,
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
  onOpenCubeModal,
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
  onOpenCubeModal: () => void;
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
      return completed.has("cube-hold") ? (
        <CompletedPanel label="CUBE_PROTOCOL_RESOLVED" />
      ) : (
        <section className="border-terminal-border border bg-[#101010] p-6">
          <p className="text-terminal-text-muted mb-4 text-sm leading-6">
            보안 프로토콜이 활성화되었습니다. 아래 버튼을 눌러 큐브 인터럽트 절차를 시작하십시오.
          </p>
          <button
            type="button"
            onClick={onOpenCubeModal}
            className="bg-blue-600 px-6 py-3 font-mono text-xs font-black tracking-[0.22em] text-white uppercase transition hover:bg-blue-700"
          >
            OPEN CUBE_PROTOCOL
          </button>
        </section>
      );
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
