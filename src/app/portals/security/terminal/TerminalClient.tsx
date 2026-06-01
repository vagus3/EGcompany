"use client";

import {
  Archive,
  Camera,
  Check,
  Eye,
  FileBox,
  IdCard,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Printer,
  Send,
  Settings,
  Shield,
  Skull,
  TerminalSquare,
  TriangleAlert,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { HINT_PROMPT_COUNT_STORAGE_KEY } from "@/lib/employee-card";
import {
  initialTerminalProgress,
  pinChallengeAnswer,
  terminalMails,
  terminalObjects,
  TERMINAL_PROGRESS_STORAGE_KEY,
  type TerminalMail,
  type TerminalObjectEntry,
  type TerminalProgress,
  type TerminalStage,
} from "@/lib/terminal-data";
import { cx, terminalTheme } from "@/theme/classes";
import CubeChallenge from "./CubeChallenge";

type OverlayState = "found" | "command-warning" | null;
type Section = "messenger" | "archive" | "containment" | "person";
type TerminalEndFlow = "idle" | "ending-video" | "survey-qr";
type EmployeeCardDelivery =
  | { status: "idle" }
  | { status: "sending" }
  | { email?: string; rank?: string; status: "sent" }
  | { message: string; status: "failed" };

const challengeIds = {
  pin: "pin-select",
  cube: "cube-hold",
  corrupted: "corrupted-command",
  pretext: "pretext-ending",
} as const;

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

const endingFlowMock = {
  posterSrc: "/eg_png/egcompany_picture/P/ending/ending.png",
  surveyUrl: "https://forms.gle/eg-play-survey-mock",
  videoSrc: "/eg_png/egcompany_picture/P/ending/ending_v.mp4",
};

const employeeCardRewardImages = [
  "/eg_png/egcompany_picture/card/card_a.png",
  "/eg_png/egcompany_picture/card/card_b.png",
] as const;

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
  summary: "“추적” 행동이 시작되었습니다.",
  author: "AUTO-SYS ALARM",
  locked: false,
  critical: true,
};

function getMailForStage(stage: TerminalStage) {
  return terminalMails.find((mail) => mail.unlockedStage === stage) ?? terminalMails[0];
}

function getVisibleMails(progress: TerminalProgress) {
  const completed = new Set(progress.completedChallengeIds);
  const byId = new Map(terminalMails.map((mail) => [mail.id, mail]));
  const visibleIds = ["transport-request", "cube-warning"];

  if (completed.has(challengeIds.pin)) visibleIds.unshift("urgent-containment");
  if (completed.has(challengeIds.cube)) visibleIds.unshift("corrupted-command");
  if (completed.has(challengeIds.corrupted)) visibleIds.push("empty-face");
  if (completed.has(challengeIds.pretext) || progress.currentStage === "completed") {
    visibleIds.push("completed");
  }

  return visibleIds.map((id) => byId.get(id)).filter(Boolean) as TerminalMail[];
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

function hasPretextCompletionParam() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("pretextComplete") === "1";
}

function withPretextCompletion(progress: TerminalProgress): TerminalProgress {
  const nextMail = getMailForStage("completed");

  return {
    currentStage: "completed",
    unlockedMailIds: mergeUnlocked(progress, nextMail.id),
    selectedMailId: nextMail.id,
    completedChallengeIds: progress.completedChallengeIds.includes(challengeIds.pretext)
      ? progress.completedChallengeIds
      : [...progress.completedChallengeIds, challengeIds.pretext],
  };
}

function getInitialProgress() {
  if (typeof window === "undefined") return initialTerminalProgress;
  const raw = window.localStorage.getItem(TERMINAL_PROGRESS_STORAGE_KEY);
  if (!raw) {
    return hasPretextCompletionParam()
      ? withPretextCompletion(initialTerminalProgress)
      : initialTerminalProgress;
  }

  try {
    const parsed = JSON.parse(raw);
    const progress = isProgress(parsed) ? parsed : initialTerminalProgress;
    return hasPretextCompletionParam() ? withPretextCompletion(progress) : progress;
  } catch {
    return hasPretextCompletionParam()
      ? withPretextCompletion(initialTerminalProgress)
      : initialTerminalProgress;
  }
}

function mergeUnlocked(progress: TerminalProgress, mailId: string) {
  return progress.unlockedMailIds.includes(mailId)
    ? progress.unlockedMailIds
    : [...progress.unlockedMailIds, mailId];
}

function getSelectedSymbols(selectedIds: string[]) {
  return selectedIds
    .map((id) => terminalObjects.find((entry) => entry.id === id)?.symbol)
    .filter(Boolean) as string[];
}

function ObjectSymbolIcon({ symbol, className }: { symbol: string; className?: string }) {
  switch (symbol) {
    case "OBSERVE":
      return <Eye className={className} />;
    case "TRACE":
      return <Camera className={className} />;
    case "KEY":
      return <KeyRound className={className} />;
    case "LOCK":
      return <Lock className={className} />;
    case "OPEN":
      return <FileBox className={className} />;
    case "FALSE":
      return <Skull className={className} />;
    case "ARCHIVE":
      return <TriangleAlert className={className} />;
    case "CHANNEL":
      return <IdCard className={className} />;
    default:
      return <Archive className={className} />;
  }
}

function ChallengeObjectIcon({ symbol, className }: { symbol: string; className?: string }) {
  if (symbol === "OPEN") return <Shield className={className} />;
  if (symbol === "CHANNEL") return <TerminalSquare className={className} />;
  return <ObjectSymbolIcon symbol={symbol} className={className} />;
}

function getChallengeObjects() {
  return challengeObjectOrder
    .map((id) => terminalObjects.find((entry) => entry.id === id))
    .filter(Boolean) as TerminalObjectEntry[];
}

function getWesenImageSrc(entry: TerminalObjectEntry) {
  return `/eg_png/security_picture/${entry.id.toLowerCase().replace("-", "_")}.png`;
}

export default function TerminalClient() {
  const [progress, setProgress] = useState<TerminalProgress>(initialTerminalProgress);
  const [activeSection, setActiveSection] = useState<Section>("messenger");
  const [selectedArchiveId, setSelectedArchiveId] = useState("WESEN-1744");
  const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);
  const [pinError, setPinError] = useState("");
  const [command, setCommand] = useState("");
  const [commandError, setCommandError] = useState("");
  const [overlay, setOverlay] = useState<OverlayState>(null);
  const [cubeModalOpen, setCubeModalOpen] = useState(false);
  const [endFlow, setEndFlow] = useState<TerminalEndFlow>("idle");
  const [employeeCardDelivery, setEmployeeCardDelivery] = useState<EmployeeCardDelivery>({
    status: "idle",
  });
  const timersRef = useRef<number[]>([]);
  const progressHydratedRef = useRef(false);
  const cubeModalTimerRef = useRef<number | null>(null);
  const deliveryRequestedRef = useRef(false);

  const visibleMails = useMemo(() => getVisibleMails(progress), [progress]);

  const selectedMail = useMemo(
    () => visibleMails.find((mail) => mail.id === progress.selectedMailId) ?? visibleMails[0],
    [progress.selectedMailId, visibleMails]
  );

  const selectedArchive =
    terminalObjects.find((entry) => entry.id === selectedArchiveId) ?? terminalObjects[2];

  const completed = useMemo(
    () => new Set(progress.completedChallengeIds),
    [progress.completedChallengeIds]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const hasCompletedPretext = hasPretextCompletionParam();
      progressHydratedRef.current = true;
      setProgress(getInitialProgress());
      if (hasCompletedPretext) {
        setEndFlow("ending-video");
        window.history.replaceState(null, "", "/portals/security/terminal");
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!progressHydratedRef.current) return;
    window.localStorage.setItem(TERMINAL_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      if (cubeModalTimerRef.current) window.clearTimeout(cubeModalTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (cubeModalTimerRef.current) {
      window.clearTimeout(cubeModalTimerRef.current);
      cubeModalTimerRef.current = null;
    }

    const shouldArmCubeModal =
      activeSection === "messenger" &&
      selectedMail.challengeType === "cube-hold" &&
      progress.currentStage === "cube-hold" &&
      !completed.has(challengeIds.cube);

    if (!shouldArmCubeModal) return;

    cubeModalTimerRef.current = window.setTimeout(() => {
      setCubeModalOpen(true);
      cubeModalTimerRef.current = null;
    }, 10000);

    return () => {
      if (cubeModalTimerRef.current) {
        window.clearTimeout(cubeModalTimerRef.current);
        cubeModalTimerRef.current = null;
      }
    };
  }, [
    activeSection,
    completed,
    progress.currentStage,
    selectedMail.challengeType,
    selectedMail.id,
  ]);

  function queueTimer(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  }

  function unlockStage(nextStage: TerminalStage, challengeId: string) {
    const nextMail = getMailForStage(nextStage);
    setActiveSection("messenger");
    setProgress((current) => ({
      currentStage: nextStage,
      unlockedMailIds: mergeUnlocked(current, nextMail.id),
      selectedMailId: nextMail.id,
      completedChallengeIds: current.completedChallengeIds.includes(challengeId)
        ? current.completedChallengeIds
        : [...current.completedChallengeIds, challengeId],
    }));
  }

  function selectArchiveEntry(entry: TerminalObjectEntry) {
    setSelectedArchiveId(entry.id);
  }

  function toggleObjectSelection(entry: TerminalObjectEntry) {
    if (progress.currentStage !== "pin-select" || completed.has(challengeIds.pin)) return;

    setPinError("");
    setSelectedObjectIds((current) => {
      if (current.includes(entry.id)) return current.filter((id) => id !== entry.id);
      if (current.length >= 4) return current;
      return [...current, entry.id];
    });
  }

  function submitPinChallenge() {
    const answer = new Set(pinChallengeAnswer);
    const symbols = getSelectedSymbols(selectedObjectIds);
    const isCorrect =
      symbols.length === pinChallengeAnswer.length &&
      symbols.every((symbol) => answer.has(symbol as (typeof pinChallengeAnswer)[number]));

    if (!isCorrect) {
      setPinError("아이콘 모양에 맞는 4개 WESEN 개체를 다시 선택하십시오.");
      setSelectedObjectIds([]);
      return;
    }

    setOverlay("found");
    queueTimer(() => {
      unlockStage("cube-hold", challengeIds.pin);
      setSelectedObjectIds([]);
      setPinError("");
    }, 1250);
    queueTimer(() => setOverlay(null), 2300);
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

  function resetProgress() {
    setProgress(initialTerminalProgress);
    setActiveSection("messenger");
    setSelectedArchiveId("WESEN-1744");
    setSelectedObjectIds([]);
    setPinError("");
    setCommand("");
    setCommandError("");
    setOverlay(null);
    setCubeModalOpen(false);
    setEndFlow("idle");
    setEmployeeCardDelivery({ status: "idle" });
    deliveryRequestedRef.current = false;
    window.localStorage.removeItem(TERMINAL_PROGRESS_STORAGE_KEY);
  }

  function getHintPromptCount() {
    const storedCount = window.localStorage.getItem(HINT_PROMPT_COUNT_STORAGE_KEY);
    const count = Number(storedCount);
    return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
  }

  async function sendEmployeeCard() {
    if (deliveryRequestedRef.current) return;

    deliveryRequestedRef.current = true;
    setEmployeeCardDelivery({ status: "sending" });

    try {
      const response = await fetch("/api/terminal/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hintPromptCount: getHintPromptCount() }),
      });
      const result = (await response.json()) as {
        email?: string;
        error?: string;
        rank?: string;
        success?: boolean;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "사원증 발송 요청에 실패했습니다.");
      }

      setEmployeeCardDelivery({ email: result.email, rank: result.rank, status: "sent" });
    } catch (error) {
      setEmployeeCardDelivery({
        message: error instanceof Error ? error.message : "사원증 발송 요청에 실패했습니다.",
        status: "failed",
      });
    }
  }

  async function finishEndingVideo() {
    setEndFlow("survey-qr");
    await sendEmployeeCard();
  }

  function completeCubeChallenge() {
    setCubeModalOpen(false);
    unlockStage("corrupted-command", challengeIds.cube);
  }

  const visibleEndFlow =
    endFlow === "idle" &&
    progress.currentStage === "completed" &&
    completed.has(challengeIds.pretext)
      ? "survey-qr"
      : endFlow;
  const shouldShowCubeModal =
    cubeModalOpen &&
    activeSection === "messenger" &&
    selectedMail.challengeType === "cube-hold" &&
    progress.currentStage === "cube-hold" &&
    !completed.has(challengeIds.cube);

  if (visibleEndFlow === "ending-video") {
    return (
      <FullscreenEndingVideo
        posterSrc={endingFlowMock.posterSrc}
        videoSrc={endingFlowMock.videoSrc}
        onEnded={() => {
          void finishEndingVideo();
        }}
      />
    );
  }

  if (visibleEndFlow === "survey-qr") {
    return (
      <SurveyQrPage
        delivery={employeeCardDelivery}
        surveyUrl={endingFlowMock.surveyUrl}
        onReset={resetProgress}
      />
    );
  }

  return (
    <main
      className={cx(
        "text-terminal-text min-h-screen overflow-x-hidden bg-[#080808] text-[13px]",
        terminalTheme.page
      )}
    >
      <header className="border-terminal-border flex min-h-[52px] items-center justify-between border-b bg-[#151515] px-5">
        <h1 className="font-mono text-xl font-black tracking-[-0.03em] text-white">SECURITY_15</h1>
        <button
          type="button"
          onClick={resetProgress}
          className="text-terminal-accent font-mono text-[10px] font-black tracking-[0.42em]"
        >
          DIVISION ACCESS AUTHORIZED
        </button>
      </header>

      <div
        className={cx(
          "grid min-h-[calc(100vh-52px)]",
          activeSection === "archive"
            ? "lg:grid-cols-[230px_154px_minmax(0,1fr)]"
            : activeSection === "messenger"
              ? "lg:grid-cols-[230px_330px_minmax(0,1fr)]"
              : "lg:grid-cols-[230px_minmax(0,1fr)]"
        )}
      >
        <TerminalSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        {activeSection === "archive" ? (
          <>
            <ArchiveList
              selectedArchiveId={selectedArchiveId}
              selectedObjectIds={selectedObjectIds}
              isPinSelectionEnabled={
                progress.currentStage === "pin-select" && !completed.has(challengeIds.pin)
              }
              onSelect={selectArchiveEntry}
              onToggleObject={toggleObjectSelection}
            />
            <ArchiveDetail
              entry={selectedArchive}
              selected={selectedObjectIds.includes(selectedArchive.id)}
              isPinSelectionEnabled={
                progress.currentStage === "pin-select" && !completed.has(challengeIds.pin)
              }
              onToggleObject={toggleObjectSelection}
            />
          </>
        ) : activeSection === "containment" ? (
          <ContainmentLogsPage showCriticalLog={completed.has(challengeIds.pin)} />
        ) : activeSection === "person" ? (
          <ContainmentLogsPage showCriticalLog={completed.has(challengeIds.pin)} />
        ) : (
          <>
            <MessengerList
              selectedMail={selectedMail}
              visibleMails={visibleMails}
              progress={progress}
              onSelectMail={(mailId) =>
                setProgress((current) => ({ ...current, selectedMailId: mailId }))
              }
            />
            <MessengerDetail
              mail={selectedMail}
              currentStage={progress.currentStage}
              completed={completed}
              selectedObjectIds={selectedObjectIds}
              pinError={pinError}
              command={command}
              commandError={commandError}
              onToggleObject={toggleObjectSelection}
              onSubmitPin={submitPinChallenge}
              onCommandChange={setCommand}
              onSubmitCommand={submitCommand}
            />
          </>
        )}
      </div>

      {overlay && (
        <div
          className={cx(
            "fixed inset-0 z-50 grid place-items-center overflow-hidden bg-black font-mono",
            overlay === "found" && "terminal-found-overlay"
          )}
        >
          <div
            className={cx(
              "terminal-noise absolute inset-0",
              overlay === "found" ? "opacity-80 mix-blend-screen" : "opacity-30"
            )}
          />
          {overlay === "found" && (
            <>
              <div className="terminal-scanline absolute inset-0 opacity-70" />
              <div className="terminal-found-bars absolute inset-0" />
              <div className="terminal-found-tear absolute inset-0" />
            </>
          )}
          <p
            data-text={overlay === "found" ? "FoUnd." : "UNKNOWN LANGUAGE DETECTED"}
            className={cx(
              "text-terminal-accent-text relative text-center text-3xl font-black tracking-[0.42em] sm:text-5xl",
              overlay === "found" && "terminal-found-title text-[clamp(3.6rem,10vw,8.5rem)]"
            )}
          >
            {overlay === "found" ? "FoUnd." : "UNKNOWN LANGUAGE DETECTED"}
          </p>
          {overlay === "command-warning" && (
            <p className="text-terminal-text-muted absolute bottom-[30%] px-6 text-center text-sm tracking-[0.18em]">
              해당 명령어는 해석 불가능한 형식으로 기록되어 있습니다.
            </p>
          )}
        </div>
      )}

      {shouldShowCubeModal && <CubeChallengeModal onComplete={completeCubeChallenge} />}
    </main>
  );
}

function CubeChallengeModal({ onComplete }: { onComplete: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/82 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Cube protocol challenge"
    >
      <div className="terminal-noise absolute inset-0 opacity-25" />
      <section className="border-terminal-accent relative w-full max-w-5xl border bg-[#090909] shadow-[0_0_80px_rgb(170_0_0_/_0.32)]">
        <div className="border-terminal-accent/50 border-b bg-[#190303] px-5 py-4 font-mono">
          <p className="text-terminal-accent-text text-xs font-black tracking-[0.34em]">
            SYSTEM ALERT: ACTIVE
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">
            CUBE_PROTOCOL INTERRUPT
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          <CubeChallenge onComplete={onComplete} />
        </div>
      </section>
    </div>
  );
}

function TerminalSidebar({
  activeSection,
  onSectionChange,
}: {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}) {
  const navItems = [
    { id: "messenger" as const, label: "MESSENGER", icon: Mail },
    { id: "archive" as const, label: "ARCHIVE", icon: Archive },
    { id: "containment" as const, label: "CONTAINMENT LOGS", icon: Shield },
    { id: "person" as const, label: "PERSON", icon: User },
  ];

  return (
    <aside className="border-terminal-border flex min-h-0 flex-col border-b bg-[#0b0b0b] lg:border-r lg:border-b-0">
      <section className="border-terminal-border flex min-h-[96px] items-center gap-4 border-b px-5">
        <div className="bg-terminal-accent-strong grid h-10 w-10 place-items-center">
          <Shield className="h-5 w-5 fill-white text-white" />
        </div>
        <div>
          <p className="text-terminal-text-dim font-mono text-[10px] tracking-[0.22em]">
            환영합니다, 클리어아이
          </p>
          <p className="mt-1 font-mono text-xs font-black tracking-[0.12em] text-white">
            SITE-15 SECTOR-01
          </p>
        </div>
      </section>

      <nav className="py-4 font-mono text-[11px] font-black tracking-[0.18em]">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSectionChange(id)}
            className={cx(
              "flex h-46 w-full items-center gap-4 px-5 py-4 text-left transition",
              activeSection === id
                ? "bg-terminal-accent-strong text-white"
                : "text-terminal-text-dim hover:bg-terminal-tile hover:text-terminal-text"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="border-terminal-border text-terminal-text-dim mt-auto border-t px-4 py-5 font-mono text-[10px] font-black tracking-[0.18em]">
        <p className="mb-3 flex items-center gap-2">
          <Settings className="h-3.5 w-3.5" />
          SYSTEM SETTINGS
        </p>
        <p className="flex items-center gap-2">
          <LogOut className="h-3.5 w-3.5" />
          LOGOUT
        </p>
      </div>
    </aside>
  );
}

function ContainmentLogsPage({ showCriticalLog }: { showCriticalLog: boolean }) {
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

function Redaction({ width }: { width: string }) {
  return <span className={cx("bg-terminal-text-dim mx-1 inline-block h-4 align-middle", width)} />;
}

function FullscreenEndingVideo({
  posterSrc,
  videoSrc,
  onEnded,
}: {
  posterSrc: string;
  videoSrc: string;
  onEnded: () => void;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black font-mono text-white">
      <video
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        onEnded={onEnded}
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0_45%,rgb(0_0_0_/_0.72)_82%)]" />
      <div className="terminal-noise absolute inset-0 opacity-25" />

      <div className="relative z-10 grid min-h-screen place-items-center px-6">
        <div className="flex items-center gap-8 text-center text-[clamp(2rem,4vw,4.2rem)] font-black tracking-[0.32em] text-white/90">
          <span
            className="text-terminal-accent-text"
            style={{ textShadow: "2px 0 #4dd9ff, -2px 0 #ff2b2b" }}
          >
            &gt;_
          </span>
          <span style={{ textShadow: "2px 0 #4dd9ff, -2px 0 #ff2b2b" }}>
            절대 뒤를 돌아보지 마.
          </span>
        </div>
      </div>

      <div className="absolute right-6 bottom-6 z-20">
        <button
          type="button"
          onClick={onEnded}
          className="hover:border-terminal-accent border border-white/20 px-3 py-2 text-[10px] font-black tracking-[0.24em] text-white/50 transition hover:text-white"
        >
          SKIP
        </button>
      </div>
    </main>
  );
}

function SurveyQrPage({
  delivery,
  surveyUrl,
  onReset,
}: {
  delivery: EmployeeCardDelivery;
  surveyUrl: string;
  onReset: () => void;
}) {
  const [rewardCardSrc, setRewardCardSrc] = useState<(typeof employeeCardRewardImages)[number]>();
  const deliveryMessage =
    delivery.status === "failed"
      ? delivery.message
      : delivery.status === "sent"
        ? `${delivery.email ?? "등록된 이메일"}로 ${delivery.rank ?? "?"} 등급 사원증이 발송 되었습니다.`
        : delivery.status === "sending"
          ? "등록된 이메일로 사원증을 발송하는 중입니다."
          : "영상 종료 후 사원증 발송이 예약됩니다.";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setRewardCardSrc(
        employeeCardRewardImages[Math.floor(Math.random() * employeeCardRewardImages.length)]
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#111] px-4 py-14 text-white sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <section className="mb-12 w-full max-w-[320px] sm:mb-14 sm:max-w-[380px]">
          <div className="border-terminal-accent/45 relative aspect-[638/1016] overflow-hidden border bg-black shadow-[0_0_60px_rgba(176,0,0,0.22)]">
            {rewardCardSrc ? (
              <Image
                src={rewardCardSrc}
                alt="발급된 EG 사원증"
                fill
                sizes="(max-width: 640px) 320px, 380px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="terminal-noise absolute inset-0 opacity-30" />
            )}
          </div>
          <p className="text-terminal-text-dim mt-4 text-center font-mono text-[10px] font-black tracking-[0.18em]">
            EMPLOYEE ID CARD ISSUED
          </p>
        </section>

        <section className="border-terminal-accent/55 w-full max-w-3xl border bg-black px-6 py-10 text-center shadow-[0_0_40px_rgba(176,0,0,0.18)] sm:px-12 sm:py-14">
          <p className="text-terminal-accent-text font-mono text-[clamp(1.1rem,2vw,1.65rem)] tracking-[0.18em]">
            UNKNOWN SYSTEM
          </p>
          <p className="mt-8 text-[clamp(1.7rem,4vw,3.15rem)] leading-[1.45] font-semibold tracking-normal text-neutral-400">
            회원가입 시에 입력한 이메일로
            <br />
            사원증이 발송 되었습니다.
          </p>
          <p
            className={cx(
              "mt-6 font-mono text-xs font-black tracking-[0.16em]",
              delivery.status === "failed" ? "text-terminal-accent-text" : "text-terminal-text-dim"
            )}
          >
            {deliveryMessage}
          </p>
        </section>

        <section className="mt-20 w-full max-w-[520px] bg-white p-10 text-center text-black shadow-[0_0_60px_rgba(255,255,255,0.12)] sm:p-14">
          <MockQrCode value={surveyUrl} />
          <p className="mt-9 text-[clamp(1.45rem,3vw,2.3rem)] font-black tracking-normal">
            &gt;_ 플레이 후기 설문조사 폼
          </p>
          <p className="mt-5 font-mono text-[10px] font-bold tracking-[0.12em] break-all text-neutral-400">
            {surveyUrl}
          </p>
        </section>

        <button
          type="button"
          onClick={onReset}
          className="hover:border-terminal-accent mt-10 border border-white/15 px-5 py-3 font-mono text-[10px] font-black tracking-[0.22em] text-white/35 transition hover:text-white"
        >
          RESET TERMINAL
        </button>
      </div>
    </main>
  );
}

function MockQrCode({ value }: { value: string }) {
  const size = 29;
  const cells = Array.from({ length: size * size }, (_, index) => {
    const x = index % size;
    const y = Math.floor(index / size);
    const inTopLeft = x < 7 && y < 7;
    const inTopRight = x >= size - 7 && y < 7;
    const inBottomLeft = x < 7 && y >= size - 7;
    const inFinder = inTopLeft || inTopRight || inBottomLeft;

    if (inFinder) {
      const localX = inTopRight ? x - (size - 7) : x;
      const localY = inBottomLeft ? y - (size - 7) : y;
      const border = localX === 0 || localX === 6 || localY === 0 || localY === 6;
      const center = localX >= 2 && localX <= 4 && localY >= 2 && localY <= 4;
      return border || center;
    }

    const code = value.charCodeAt((x * 7 + y * 11) % value.length);
    return (x * 3 + y * 5 + code) % 7 < 3;
  });

  return (
    <div
      className="mx-auto grid aspect-square w-full max-w-[270px] gap-[2px] bg-white p-2"
      style={{ gridTemplateColumns: "repeat(29, minmax(0, 1fr))" }}
      aria-label="Mock survey QR code"
    >
      {cells.map((active, index) => (
        <span key={index} className={active ? "bg-black" : "bg-white"} />
      ))}
    </div>
  );
}

function MessengerList({
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
      <div className="border-terminal-border flex h-[54px] items-center justify-between border-b px-5">
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
                "border-terminal-border block min-h-[96px] w-full border-b px-5 py-4 text-left transition",
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

function MessengerDetail({
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

      <div className="mx-auto max-w-[920px] px-6 py-7 lg:px-8">
        {isUrgentCubeMail ? (
          <UrgentAlertBody />
        ) : !isCorruptedCommandMail ? (
          <>
            <MailBody mail={mail} />
            <SecurityAlert />
            <div className="bg-terminal-border my-6 h-px" />
          </>
        ) : null}
        {renderMailChallenge({
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

function UrgentAlertBody() {
  return (
    <article className="text-terminal-copy bg-[#202020] px-6 py-8 shadow-[0_22px_80px_rgb(0_0_0_/_0.28)] lg:px-10">
      <h3 className="text-terminal-accent-muted text-[clamp(1.2rem,2.4vw,1.65rem)] font-medium">
        보안팀 열람 요망_기밀 사항
      </h3>

      <div className="mx-auto mt-8 w-full max-w-[250px]">
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

function MailBody({ mail }: { mail: TerminalMail }) {
  return (
    <article className="text-terminal-copy border border-[#211414] bg-[#171111] p-7 text-sm leading-7 lg:p-9">
      {mail.body.map((line, index) => (
        <p
          key={line}
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

function renderMailChallenge({
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
  if (mail.challengeType === "none") {
    return null;
  }

  if (!isCurrentChallenge && !isCompletedChallenge) {
    return <QueuedPanel label="NEXT_SECTION_LOCKED" />;
  }

  if (mail.challengeType === "pin-select") {
    return (
      <section className="border-terminal-border border bg-[#101010] p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-terminal-text-muted font-mono text-[11px] font-black tracking-[0.28em]">
              SECURITY_CHALLENGE
            </p>
            <p className="text-terminal-text-dim mt-1 text-xs">
              안전한 수송을 위한 보안 승인 코드를 선택하십시오.
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
        {completed.has(challengeIds.pin) && <CompletedPanel label="PIN_SEQUENCE_CONFIRMED" />}
      </section>
    );
  }

  if (mail.challengeType === "cube-hold") {
    return completed.has(challengeIds.cube) ? (
      <CompletedPanel label="CUBE_PROTOCOL_RESOLVED" />
    ) : null;
  }

  if (mail.challengeType === "corrupted-command") {
    return completed.has(challengeIds.corrupted) ? (
      <CompletedPanel label="UNKNOWN_LANGUAGE_ACCEPTED" />
    ) : (
      <section className="mx-auto max-w-[760px]">
        <div className="mx-auto max-w-[520px] bg-[#2c2c2c] p-3">
          <div className="relative aspect-[635/411] overflow-hidden bg-black">
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
          className="border-terminal-accent/50 mt-12 border bg-[#2d2d2d] px-6 py-7 shadow-[0_24px_80px_rgb(0_0_0_/_0.38)] sm:px-9"
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

  if (mail.challengeType === "pretext-ending") {
    return completed.has(challengeIds.pretext) ? (
      <CompletedPanel label="EMPTY_FACE_CONFIRMED" />
    ) : (
      <section className="border-terminal-border border bg-[#101010] p-6">
        <p className="text-terminal-accent-muted font-mono text-xs font-black tracking-[0.28em]">
          PRETEXT_FIELD_READY
        </p>
        <p className="text-terminal-text-muted mt-4 text-sm leading-6">
          이 파일은 터미널 내부 프레임에서 안정적으로 열람할 수 없습니다. 전체 화면 격리 환경에서
          Pretext 충돌 필드를 시작하십시오.
        </p>
        <Link
          href="/portals/security/terminal/pretext"
          className="bg-terminal-accent-strong hover:bg-terminal-accent-active mt-6 inline-flex px-5 py-3 font-mono text-xs font-black tracking-[0.22em] text-white transition"
        >
          OPEN FULLSCREEN
        </Link>
      </section>
    );
  }

  return <CompletedPanel label="ID_CARD_DELIVERY_RESERVED" />;
}

function ArchiveList({
  selectedArchiveId,
  selectedObjectIds,
  isPinSelectionEnabled,
  onSelect,
  onToggleObject,
}: {
  selectedArchiveId: string;
  selectedObjectIds: string[];
  isPinSelectionEnabled: boolean;
  onSelect: (entry: TerminalObjectEntry) => void;
  onToggleObject: (entry: TerminalObjectEntry) => void;
}) {
  return (
    <section className="border-terminal-border min-h-0 border-b bg-[#111] lg:border-r lg:border-b-0">
      {isPinSelectionEnabled && (
        <div className="border-terminal-border text-terminal-text-dim border-b px-3 py-3 font-mono text-[9px] font-black tracking-[0.16em]">
          SELECTED: {selectedObjectIds.length}/4
        </div>
      )}
      <div className="py-2">
        {terminalObjects.map((entry) => {
          const active = selectedArchiveId === entry.id;
          const selected = selectedObjectIds.includes(entry.id);

          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => {
                onSelect(entry);
                if (isPinSelectionEnabled) onToggleObject(entry);
              }}
              className={cx(
                "flex w-full items-center gap-2 border-l-2 border-l-transparent px-3 py-3 text-left font-mono text-[11px] font-black transition",
                active
                  ? "border-l-terminal-accent bg-terminal-accent-strong text-white"
                  : "text-terminal-text-muted hover:bg-terminal-tile hover:text-white",
                selected && "border-l-terminal-accent text-terminal-accent-text"
              )}
              aria-pressed={selected}
            >
              <ObjectSymbolIcon symbol={entry.symbol} className="h-4 w-4 shrink-0" />
              <span>{entry.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ArchiveDetail({
  entry,
  selected,
  isPinSelectionEnabled,
  onToggleObject,
}: {
  entry: TerminalObjectEntry;
  selected: boolean;
  isPinSelectionEnabled: boolean;
  onToggleObject: (entry: TerminalObjectEntry) => void;
}) {
  return (
    <section className="min-h-0 overflow-y-auto bg-[#0f0f0f] px-6 py-7 lg:px-8">
      <div className="border-terminal-border border-l-terminal-accent border border-l-4 bg-[#151515] px-8 py-7">
        <h2 className="font-mono text-[clamp(2rem,4vw,3rem)] font-black tracking-[0.08em] text-white">
          {entry.label}
        </h2>
        <p className="text-terminal-accent mt-2 font-mono text-lg font-black">
          SAFETY LEVEL: {entry.safetyLevel}
        </p>
      </div>

      <div className="mt-8 grid gap-7 xl:grid-cols-[minmax(0,1fr)_240px]">
        <div className="space-y-7">
          <ArchiveCard title={entry.title}>
            {entry.description.map((line) => (
              <p key={line} className="mt-4 first:mt-0">
                {line}
              </p>
            ))}
          </ArchiveCard>

          <ArchiveCard title="SPECIAL CONTAINMENT PROCEDURES">
            {entry.containment.map((line) => (
              <p
                key={line}
                className="before:text-terminal-accent mt-3 before:mr-4 before:content-['▪']"
              >
                {line}
              </p>
            ))}
          </ArchiveCard>

          <ArchiveCard title="Containment Status">
            <p>{entry.status}</p>
          </ArchiveCard>
        </div>

        <aside className="bg-[#1b1b1b] p-5">
          <button
            type="button"
            onClick={() => isPinSelectionEnabled && onToggleObject(entry)}
            disabled={!isPinSelectionEnabled}
            className={cx(
              "text-terminal-text-dim relative block aspect-square w-full overflow-hidden bg-[#222] transition",
              isPinSelectionEnabled && "hover:bg-terminal-tile cursor-pointer",
              selected && "ring-terminal-accent ring-2"
            )}
            aria-label={`${selected ? "Deselect" : "Select"} ${entry.label} ${entry.symbol}`}
            aria-pressed={selected}
          >
            <Image
              src={getWesenImageSrc(entry)}
              alt={`${entry.label} visual archive`}
              fill
              sizes="240px"
              className="object-cover grayscale transition duration-300 hover:grayscale-0"
            />
            <span className="pointer-events-none absolute inset-0 border border-white/5" />
          </button>
          {isPinSelectionEnabled && (
            <p className="text-terminal-accent mt-3 font-mono text-[9px] font-black tracking-[0.12em]">
              {selected ? "SELECTED_FOR_TRANSPORT" : "CLICK_ICON_TO_SELECT"}
            </p>
          )}
          <p className="mt-3 font-mono text-[9px] font-black text-white">
            {entry.id.toLowerCase().replace("-", "_")}.png
          </p>
          <div className="mt-8 font-mono text-[9px] tracking-[0.12em]">
            <p className="text-terminal-accent mb-5 text-center font-black">SECURITY_READOUT</p>
            <MetaRow label="LAST KNOWN LOCATION" value="SEOUL, KR" />
            <MetaRow label="BEHAVIOR_PROFILE" value={entry.symbol} />
            <MetaRow label="COGNITIVE_THREAT" value="NONE_DETECTED" />
            <MetaRow label="ACCESS_ANOMALY" value="CONFIRMED" danger />
            <div className="bg-terminal-accent mt-6 h-1" />
          </div>
        </aside>
      </div>
    </section>
  );
}

function ArchiveCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="text-terminal-copy bg-[#1d1d1d] p-7 text-sm leading-7">
      <h3 className="text-terminal-accent border-b border-[#604844] pb-3 text-xl font-black">
        {title}
      </h3>
      <div className="pt-4">{children}</div>
    </article>
  );
}

function MetaRow({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <p className="text-terminal-text-dim mb-4 flex items-center justify-between gap-3">
      <span>{label}</span>
      <span className={danger ? "text-terminal-accent" : "text-white"}>{value}</span>
    </p>
  );
}

function CompletedPanel({ label }: { label: string }) {
  return (
    <section className="border-terminal-border bg-terminal-panel-deep mt-5 border p-5">
      <p className="text-terminal-accent-muted flex items-center gap-3 font-mono text-xs font-black tracking-[0.2em]">
        <Check className="h-4 w-4" />
        {label}
      </p>
    </section>
  );
}

function QueuedPanel({ label }: { label: string }) {
  return (
    <section className="border-terminal-border bg-terminal-panel-deep mt-5 border p-5 opacity-70">
      <p className="text-terminal-text-dim flex items-center gap-3 font-mono text-xs font-black tracking-[0.2em]">
        <Lock className="h-4 w-4" />
        {label}
      </p>
      <p className="text-terminal-text-muted mt-3 text-xs leading-6">
        이전 보안 절차가 완료되면 이 섹션의 상호작용이 활성화됩니다.
      </p>
    </section>
  );
}
