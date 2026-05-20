"use client";

import {
  Archive,
  Bell,
  Box,
  Check,
  Eye,
  FileLock2,
  KeyRound,
  Lock,
  Printer,
  Radio,
  Send,
  Settings,
  Shield,
  TerminalSquare,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  initialTerminalProgress,
  pinChallengeAnswer,
  terminalMails,
  terminalObjects,
  TERMINAL_PROGRESS_STORAGE_KEY,
  type TerminalMail,
  type TerminalProgress,
  type TerminalStage,
} from "@/lib/terminal-data";
import { cx, terminalTheme } from "@/theme/classes";
import CubeChallenge from "./CubeChallenge";
import PretextEndingChallenge from "./PretextEndingChallenge";

type OverlayState = "found" | "command-warning" | null;

const objectIcons = {
  OBSERVE: Eye,
  TRACE: Archive,
  KEY: KeyRound,
  LOCK: Lock,
  OPEN: Box,
  FALSE: X,
  ARCHIVE: FileLock2,
  CHANNEL: Radio,
} as const;

const challengeIds = {
  pin: "pin-select",
  cube: "cube-hold",
  corrupted: "corrupted-command",
  pretext: "pretext-ending",
} as const;

const corruptedFragments = [
  { raw: "TR@CE", restored: "TRACE", answer: "A" },
  { raw: "OB$ERVE", restored: "OBSERVE", answer: "S" },
  { raw: "LO?K", restored: "LOCK", answer: "C" },
  { raw: "KE!", restored: "KEY", answer: "Y" },
  { raw: "OP#N", restored: "OPEN", answer: "E" },
  { raw: "FAL%E", restored: "FALSE", answer: "S" },
];

function getMailForStage(stage: TerminalStage) {
  return terminalMails.find((mail) => mail.unlockedStage === stage) ?? terminalMails[0];
}

function isProgress(value: unknown): value is TerminalProgress {
  if (!value || typeof value !== "object") return false;
  const progress = value as TerminalProgress;
  return (
    typeof progress.currentStage === "string" &&
    Array.isArray(progress.unlockedMailIds) &&
    typeof progress.selectedMailId === "string" &&
    Array.isArray(progress.completedChallengeIds)
  );
}

function mergeUnlocked(progress: TerminalProgress, mailId: string) {
  return progress.unlockedMailIds.includes(mailId)
    ? progress.unlockedMailIds
    : [...progress.unlockedMailIds, mailId];
}

function getInitialProgress() {
  if (typeof window === "undefined") return initialTerminalProgress;

  const raw = window.localStorage.getItem(TERMINAL_PROGRESS_STORAGE_KEY);
  if (!raw) return initialTerminalProgress;

  try {
    const parsed = JSON.parse(raw);
    return isProgress(parsed) ? parsed : initialTerminalProgress;
  } catch {
    return initialTerminalProgress;
  }
}

function MailBody({ mail }: { mail: TerminalMail }) {
  return (
    <article
      className={cx(
        "border p-6 text-base leading-8 sm:p-8 sm:text-[19px]",
        terminalTheme.borderAlert,
        terminalTheme.accentSoftBg,
        terminalTheme.copy
      )}
    >
      {mail.body.map((line) => (
        <p key={line} className="mt-5 first:mt-0">
          {line}
        </p>
      ))}
    </article>
  );
}

export default function TerminalClient() {
  const [progress, setProgress] = useState<TerminalProgress>(() => getInitialProgress());
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [pinError, setPinError] = useState("");
  const [command, setCommand] = useState("");
  const [commandError, setCommandError] = useState("");
  const [overlay, setOverlay] = useState<OverlayState>(null);
  const timersRef = useRef<number[]>([]);

  const selectedMail = useMemo(
    () => terminalMails.find((mail) => mail.id === progress.selectedMailId) ?? terminalMails[0],
    [progress.selectedMailId]
  );

  const completed = useMemo(
    () => new Set(progress.completedChallengeIds),
    [progress.completedChallengeIds]
  );

  useEffect(() => {
    window.localStorage.setItem(TERMINAL_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function queueTimer(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  }

  function unlockStage(nextStage: TerminalStage, challengeId: string) {
    const nextMail = getMailForStage(nextStage);
    setProgress((current) => ({
      currentStage: nextStage,
      unlockedMailIds: mergeUnlocked(current, nextMail.id),
      selectedMailId: nextMail.id,
      completedChallengeIds: current.completedChallengeIds.includes(challengeId)
        ? current.completedChallengeIds
        : [...current.completedChallengeIds, challengeId],
    }));
  }

  function runFoundTransition() {
    setOverlay("found");
    queueTimer(() => {
      unlockStage("cube-hold", challengeIds.pin);
      setSelectedObjects([]);
      setPinError("");
    }, 1250);
    queueTimer(() => setOverlay(null), 2300);
  }

  function handleObjectToggle(objectId: string) {
    if (progress.currentStage !== "pin-select" || completed.has(challengeIds.pin)) return;
    setPinError("");
    setSelectedObjects((current) => {
      if (current.includes(objectId)) return current.filter((id) => id !== objectId);
      if (current.length >= 4) return current;
      return [...current, objectId];
    });
  }

  function submitPinChallenge() {
    const answer = new Set(pinChallengeAnswer);
    const isCorrect =
      selectedObjects.length === pinChallengeAnswer.length &&
      selectedObjects.every((objectId) => answer.has(objectId as (typeof pinChallengeAnswer)[number]));

    if (!isCorrect) {
      setPinError("아이콘 모양과 맞는 4개 개체를 다시 선택하십시오.");
      setSelectedObjects([]);
      return;
    }

    runFoundTransition();
  }

  function handleCubeComplete() {
    unlockStage("corrupted-command", challengeIds.cube);
  }

  function submitCommand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (command.trim().toUpperCase() !== "ASCYES") {
      setCommandError("명령어가 일치하지 않습니다.");
      return;
    }

    setCommandError("");
    setOverlay("command-warning");
    queueTimer(() => {
      setOverlay(null);
      setCommand("");
      unlockStage("pretext-ending", challengeIds.corrupted);
    }, 1750);
  }

  function handleEndingComplete() {
    unlockStage("completed", challengeIds.pretext);
  }

  function resetProgress() {
    setProgress(initialTerminalProgress);
    setSelectedObjects([]);
    setPinError("");
    setCommand("");
    setCommandError("");
    setOverlay(null);
    window.localStorage.removeItem(TERMINAL_PROGRESS_STORAGE_KEY);
  }

  function renderChallenge(mail: TerminalMail) {
    if (mail.challengeType === "pin-select") {
      return (
        <section className={cx("border p-5 sm:p-7", terminalTheme.border, terminalTheme.panelDeep)}>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs font-black tracking-[0.42em] text-terminal-accent-muted">
                SECURITY_CHALLENGE
              </p>
              <h3 className="mt-3 text-xl font-black text-terminal-text">8핀 보안 승인</h3>
            </div>
            <p className="font-mono text-sm text-terminal-text-dim">
              {selectedObjects.length} / 4 SELECTED
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className={cx(
                  "aspect-square border",
                  selectedObjects[index]
                    ? "border-terminal-accent bg-terminal-accent-soft"
                    : "border-terminal-border bg-black/30"
                )}
              >
                <span className="grid h-full place-items-center font-mono text-xs text-terminal-text-muted">
                  {selectedObjects[index] ?? "PIN"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-terminal-text-muted">
              왼쪽 열람 탭에서 아이콘 모양에 맞는 4개의 개체를 선택하십시오.
            </p>
            <button
              type="button"
              onClick={submitPinChallenge}
              className={cx(
                "px-5 py-3 font-mono text-xs font-black tracking-[0.22em]",
                terminalTheme.inverseButton
              )}
            >
              VERIFY_PINS
            </button>
          </div>

          {pinError && <p className="mt-4 font-mono text-xs text-terminal-accent-text">{pinError}</p>}
          {completed.has(challengeIds.pin) && (
            <p className="mt-4 flex items-center gap-2 font-mono text-xs text-terminal-accent-muted">
              <Check className="h-4 w-4" />
              승인 완료
            </p>
          )}
        </section>
      );
    }

    if (mail.challengeType === "cube-hold") {
      if (completed.has(challengeIds.cube)) {
        return <CompletedPanel label="CUBE_PROTOCOL_RESOLVED" />;
      }
      return <CubeChallenge onComplete={handleCubeComplete} />;
    }

    if (mail.challengeType === "corrupted-command") {
      if (completed.has(challengeIds.corrupted)) {
        return <CompletedPanel label="UNKNOWN_LANGUAGE_ACCEPTED" />;
      }
      return (
        <section className={cx("border p-5 sm:p-7", terminalTheme.border, terminalTheme.panelDeep)}>
          <p className="font-mono text-xs font-black tracking-[0.36em] text-terminal-accent-muted">
            CORRUPTED_COMMAND
          </p>
          <div className="mt-6 grid gap-3">
            {corruptedFragments.map((fragment) => (
              <div
                key={fragment.raw}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border border-terminal-border bg-black/30 px-4 py-3 font-mono text-sm"
              >
                <span className="text-terminal-accent-text">{fragment.raw}</span>
                <span className="text-terminal-text-dim">{fragment.restored}</span>
                <span className="text-terminal-text">{fragment.answer}</span>
              </div>
            ))}
          </div>

          <form onSubmit={submitCommand} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              value={command}
              onChange={(event) => setCommand(event.target.value.toUpperCase())}
              className="min-h-12 flex-1 border border-terminal-border bg-black px-4 font-mono text-sm tracking-[0.32em] text-terminal-text outline-none focus:border-terminal-accent"
              placeholder="COMMAND"
              spellCheck={false}
            />
            <button
              type="submit"
              className={cx(
                "px-5 py-3 font-mono text-xs font-black tracking-[0.22em]",
                terminalTheme.accentBg
              )}
            >
              EXECUTE
            </button>
          </form>
          {commandError && (
            <p className="mt-4 font-mono text-xs text-terminal-accent-text">{commandError}</p>
          )}
        </section>
      );
    }

    if (mail.challengeType === "pretext-ending") {
      if (completed.has(challengeIds.pretext)) {
        return <CompletedPanel label="EMPTY_FACE_CONFIRMED" />;
      }
      return <PretextEndingChallenge onComplete={handleEndingComplete} />;
    }

    return <CompletedPanel label="ID_CARD_DELIVERY_RESERVED" />;
  }

  return (
    <main
      className={cx(
        "min-h-screen overflow-x-hidden",
        terminalTheme.page,
        terminalTheme.fixedScheme
      )}
    >
      <header
        className={cx(
          "grid gap-4 border-b px-4 py-4 sm:px-6 lg:grid-cols-[minmax(250px,350px)_1fr_auto] lg:items-center lg:px-8",
          terminalTheme.border,
          terminalTheme.panel
        )}
      >
        <h1 className="text-xl font-black tracking-[-0.02em] sm:text-[26px]">
          SITE-19 ADMINISTRATIVE TERMINAL
        </h1>
        <p className={cx("font-mono text-sm sm:text-lg", terminalTheme.accent)}>
          SYSTEM_STATUS:{progress.currentStage === "completed" ? "SEALED" : "NOMINAL"}
        </p>
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <Bell className={cx("h-6 w-6", terminalTheme.textDim)} />
          <TerminalSquare className={cx("h-6 w-6", terminalTheme.textDim)} />
          <button
            type="button"
            onClick={resetProgress}
            className={cx(
              "px-4 py-3 font-mono text-xs font-black tracking-widest text-white sm:px-6",
              terminalTheme.accentBg
            )}
          >
            RESET
          </button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-74px)] lg:grid-cols-[320px_420px_minmax(0,1fr)] xl:grid-cols-[350px_500px_minmax(0,1fr)]">
        <aside
          className={cx(
            "flex min-h-0 flex-col border-b lg:border-b-0 lg:border-r",
            terminalTheme.border,
            terminalTheme.panelDeep
          )}
        >
          <section className={cx("flex items-center gap-4 border-b px-6 py-6", terminalTheme.border)}>
            <div
              className={cx("flex h-14 w-14 items-center justify-center", terminalTheme.accentBg)}
            >
              <Shield className="h-8 w-8 fill-white text-white" />
            </div>
            <div>
              <p className={cx("font-mono text-xs tracking-[0.32em]", terminalTheme.textDim)}>
                ADM. CLEARANCE L5
              </p>
              <p className="mt-2 font-mono text-sm tracking-[0.16em]">SITE-19 SECTOR-01</p>
            </div>
          </section>

          <section className="p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono text-xs font-black tracking-[0.32em] text-terminal-accent-muted">
                OBJECT_READER
              </p>
              <p className="font-mono text-[10px] text-terminal-text-dim">8 ENTRIES</p>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              {terminalObjects.map((entry) => {
                const Icon = objectIcons[entry.id as keyof typeof objectIcons] ?? Archive;
                const selected = selectedObjects.includes(entry.id);

                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => handleObjectToggle(entry.id)}
                    className={cx(
                      "border p-4 text-left transition",
                      selected
                        ? "border-terminal-accent bg-terminal-accent-soft text-terminal-text"
                        : "border-terminal-border bg-terminal-tile text-terminal-text-dim hover:border-terminal-border-warm hover:bg-terminal-tile-hover"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="font-mono text-sm font-black tracking-[0.18em]">
                        {entry.label}
                      </span>
                    </div>
                    <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-terminal-text-dim">
                      {entry.classCode}
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-terminal-text-muted">
                      {entry.note}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <div className={cx("mt-auto border-t p-5", terminalTheme.border)}>
            <p
              className={cx(
                "mb-3 flex items-center gap-2 font-mono text-xs tracking-[0.2em]",
                terminalTheme.textDim
              )}
            >
              <Settings className="h-4 w-4" />
              SYSTEM SETTINGS
            </p>
            <p className={cx("font-mono text-xs tracking-[0.2em]", terminalTheme.textDim)}>
              LOCAL_PROGRESS:READY
            </p>
          </div>
        </aside>

        <section
          className={cx(
            "min-h-0 border-b lg:border-b-0 lg:border-r",
            terminalTheme.border,
            terminalTheme.panelDeep
          )}
        >
          <div
            className={cx(
              "flex items-center justify-between border-b px-5 py-5",
              terminalTheme.border,
              terminalTheme.panelMuted
            )}
          >
            <h2 className="font-mono text-lg font-black tracking-[0.16em] sm:text-xl">
              INCOMING_TRANSMISSIONS
            </h2>
            <p className={cx("font-mono text-xs font-bold", terminalTheme.accentMuted)}>LIVE_FEED</p>
          </div>
          <div className="max-h-[520px] overflow-y-auto lg:max-h-none">
            {terminalMails.map((mail) => {
              const unlocked = progress.unlockedMailIds.includes(mail.id);
              const active = selectedMail.id === mail.id;

              return (
                <button
                  type="button"
                  key={mail.id}
                  disabled={!unlocked}
                  onClick={() =>
                    setProgress((current) => ({ ...current, selectedMailId: mail.id }))
                  }
                  className={cx(
                    "block w-full border-b px-5 py-6 text-left transition",
                    terminalTheme.border,
                    active && unlocked
                      ? "border-l-4 border-l-white bg-terminal-accent-active text-white"
                      : unlocked
                        ? "bg-terminal-panel-deep text-terminal-text hover:bg-terminal-tile"
                        : "bg-black/40 text-terminal-text-dim opacity-45"
                  )}
                >
                  <div className="mb-4 flex justify-between gap-4 font-mono text-xs">
                    <p className={active ? "text-terminal-accent-muted" : terminalTheme.textDim}>
                      {mail.level}
                    </p>
                    <p className={terminalTheme.textDim}>{unlocked ? mail.time : "LOCKED"}</p>
                  </div>
                  <h3 className="mb-2 text-lg font-black">{mail.title}</h3>
                  <p className={cx("line-clamp-2 font-mono text-sm", terminalTheme.textDim)}>
                    {unlocked ? mail.preview : "상위 단계 완료 후 열람 가능"}
                  </p>
                  {unlocked && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {mail.tags.map((tag) => (
                        <span key={tag} className="bg-white/15 px-3 py-2 font-mono text-[10px] font-black">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className={cx("min-h-0 overflow-y-auto", terminalTheme.panel)}>
          <div className={cx("border-b px-5 py-8 sm:px-8 lg:px-10", terminalTheme.border)}>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className={cx("font-mono text-xs font-black tracking-[0.36em]", terminalTheme.accent)}>
                {selectedMail.level}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className={cx("bg-terminal-tile-hover border p-3", terminalTheme.borderWarm)}
                  aria-label="print"
                >
                  <Printer className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className={cx("bg-terminal-tile-hover border p-3", terminalTheme.borderWarm)}
                  aria-label="send"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
            <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-light tracking-[-0.03em]">
              {selectedMail.title}
            </h2>
            <div className="mt-6 grid gap-4 font-mono text-sm xl:grid-cols-2">
              <p className={cx("border-terminal-accent border-l-2 pl-4", terminalTheme.textDim)}>
                FROM: <span className={cx("ml-3 font-sans", terminalTheme.copyStrong)}>{selectedMail.sender}</span>
              </p>
              <p className={cx("border-terminal-accent border-l-2 pl-4", terminalTheme.textDim)}>
                TO: <span className={cx("ml-3", terminalTheme.copyStrong)}>{selectedMail.to}</span>
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
            <MailBody mail={selectedMail} />

            <aside
              className={cx("border-terminal-accent mt-8 border-l-4 p-6", terminalTheme.panelSoft)}
            >
              <h3 className={cx("font-mono text-lg font-black", terminalTheme.accentText)}>
                *** SECURITY ALERT: INTERNAL SYSTEM ANOMALY ***
              </h3>
              <p className={cx("mt-4 text-sm leading-7", terminalTheme.copy)}>
                관련 문서 열람 시 이상 징후가 발생할 경우 즉시 관리자에게 보고하십시오. 개인이
                승인되지 않은 문서를 열람할 경우 접근 로그가 추적될 수 있습니다.
              </p>
            </aside>

            <div className="bg-terminal-border my-8 h-px" />
            {renderChallenge(selectedMail)}
          </div>
        </section>
      </div>

      {overlay && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black font-mono">
          <div className="absolute inset-0 terminal-noise opacity-30" />
          <p className="relative text-center text-3xl font-black tracking-[0.42em] text-terminal-accent-text sm:text-5xl">
            {overlay === "found" ? "FoUnd." : "UNKNOWN LANGUAGE DETECTED"}
          </p>
          {overlay === "command-warning" && (
            <p className="absolute bottom-[30%] px-6 text-center text-sm tracking-[0.18em] text-terminal-text-muted">
              해당 명령어는 해석 불가능한 형식으로 기록되어 있습니다.
            </p>
          )}
        </div>
      )}
    </main>
  );
}

function CompletedPanel({ label }: { label: string }) {
  return (
    <section className="border border-terminal-border bg-terminal-panel-deep p-7">
      <p className="flex items-center gap-3 font-mono text-sm font-black tracking-[0.24em] text-terminal-accent-muted">
        <Check className="h-5 w-5" />
        {label}
      </p>
      <p className="mt-4 text-sm leading-6 text-terminal-text-muted">
        단계 처리가 완료되었습니다. 다음 수신 메일을 확인하십시오.
      </p>
    </section>
  );
}
