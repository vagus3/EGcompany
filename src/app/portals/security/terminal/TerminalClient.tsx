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
  TriangleAlert,
  User,
} from "lucide-react";
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
import PretextEndingChallenge from "./PretextEndingChallenge";

type OverlayState = "found" | "command-warning" | null;
type Section = "messenger" | "archive" | "containment" | "person";
type TerminalEndFlow = "idle" | "mock-video" | "survey-qr";
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

const corruptedFragments = [
  { raw: "TR@CE", restored: "TRACE", answer: "A" },
  { raw: "OB$ERVE", restored: "OBSERVE", answer: "S" },
  { raw: "LO?K", restored: "LOCK", answer: "C" },
  { raw: "KE!", restored: "KEY", answer: "Y" },
  { raw: "OP#N", restored: "OPEN", answer: "E" },
  { raw: "FAL%E", restored: "FALSE", answer: "S" },
];

const endingFlowMock = {
  durationMs: 6500,
  surveyUrl: "https://forms.gle/eg-play-survey-mock",
};

const containmentLogs = [
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

const personnel = {
  leader: { name: "DANIEL K. WEBER", callNum: "09-459273", role: "LEADER", icon: Shield },
  senior: [
    { name: "LEE SO-YEON", callNum: "09-905316", role: "SENIOR STAFF", icon: IdCard },
    { name: "MARCUS HALE", callNum: "09-274859", role: "SENIOR STAFF", icon: Shield },
    { name: "PARK MIN-HO", callNum: "09-618042", role: "SENIOR STAFF", icon: Lock },
  ],
  junior: [
    { name: "KIM DO-YUN", callNum: "09-483721", role: "JUNIOR STAFF" },
    { name: "HAN JI-WOO", callNum: "09-739165", role: "JUNIOR STAFF" },
    { name: "(PLAYER)", callNum: "09-152984", role: "JUNIOR STAFF", highlighted: true },
    { name: "ELENA KOVAC", callNum: "09-867203", role: "JUNIOR STAFF" },
  ],
};

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

export default function TerminalClient() {
  const [progress, setProgress] = useState<TerminalProgress>(() => getInitialProgress());
  const [activeSection, setActiveSection] = useState<Section>("messenger");
  const [selectedArchiveId, setSelectedArchiveId] = useState("WESEN-1744");
  const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);
  const [pinError, setPinError] = useState("");
  const [command, setCommand] = useState("");
  const [commandError, setCommandError] = useState("");
  const [overlay, setOverlay] = useState<OverlayState>(null);
  const [endFlow, setEndFlow] = useState<TerminalEndFlow>("idle");
  const [employeeCardDelivery, setEmployeeCardDelivery] = useState<EmployeeCardDelivery>({
    status: "idle",
  });
  const timersRef = useRef<number[]>([]);
  const deliveryRequestedRef = useRef(false);

  const selectedMail = useMemo(
    () => terminalMails.find((mail) => mail.id === progress.selectedMailId) ?? terminalMails[0],
    [progress.selectedMailId]
  );

  const selectedArchive =
    terminalObjects.find((entry) => entry.id === selectedArchiveId) ?? terminalObjects[2];

  const completed = useMemo(
    () => new Set(progress.completedChallengeIds),
    [progress.completedChallengeIds]
  );

  useEffect(() => {
    window.localStorage.setItem(TERMINAL_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

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

  function completeEndingFlow() {
    const nextMail = getMailForStage("completed");
    setActiveSection("messenger");
    setProgress((current) => ({
      currentStage: "completed",
      unlockedMailIds: mergeUnlocked(current, nextMail.id),
      selectedMailId: nextMail.id,
      completedChallengeIds: current.completedChallengeIds.includes(challengeIds.pretext)
        ? current.completedChallengeIds
        : [...current.completedChallengeIds, challengeIds.pretext],
    }));
    setEndFlow("mock-video");
    queueTimer(() => {
      void finishEndingVideo();
    }, endingFlowMock.durationMs);
  }

  const visibleEndFlow =
    endFlow === "idle" &&
    progress.currentStage === "completed" &&
    completed.has(challengeIds.pretext)
      ? "survey-qr"
      : endFlow;

  if (visibleEndFlow === "mock-video") {
    return (
      <MockEndingVideo
        durationMs={endingFlowMock.durationMs}
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
          <ContainmentLogsPage />
        ) : activeSection === "person" ? (
          <PersonnelPage />
        ) : (
          <>
            <MessengerList
              selectedMail={selectedMail}
              progress={progress}
              onSelectMail={(mailId) =>
                setProgress((current) => ({ ...current, selectedMailId: mailId }))
              }
            />
            <MessengerDetail
              mail={selectedMail}
              completed={completed}
              selectedObjectIds={selectedObjectIds}
              pinError={pinError}
              command={command}
              commandError={commandError}
              onToggleObject={toggleObjectSelection}
              onSubmitPin={submitPinChallenge}
              onCommandChange={setCommand}
              onSubmitCommand={submitCommand}
              onCubeComplete={() => unlockStage("corrupted-command", challengeIds.cube)}
              onEndingComplete={completeEndingFlow}
            />
          </>
        )}
      </div>

      {overlay && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black font-mono">
          <div className="terminal-noise absolute inset-0 opacity-30" />
          <p className="text-terminal-accent-text relative text-center text-3xl font-black tracking-[0.42em] sm:text-5xl">
            {overlay === "found" ? "FoUnd." : "UNKNOWN LANGUAGE DETECTED"}
          </p>
          {overlay === "command-warning" && (
            <p className="text-terminal-text-muted absolute bottom-[30%] px-6 text-center text-sm tracking-[0.18em]">
              해당 명령어는 해석 불가능한 형식으로 기록되어 있습니다.
            </p>
          )}
        </div>
      )}
    </main>
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

function ContainmentLogsPage() {
  return (
    <section className="min-h-0 overflow-y-auto bg-[#080808] px-5 py-12 sm:px-10 lg:px-18 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-[clamp(2.2rem,5vw,4.4rem)] leading-none font-black tracking-[-0.06em] text-white uppercase">
          Secure Containment Logs
        </h2>
        <div className="bg-terminal-border mt-10 h-px" />

        <div className="mt-12 space-y-5">
          {containmentLogs.map((log) => (
            <article
              key={log.title}
              className="border-terminal-border grid gap-5 border border-l-4 bg-[#111] px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-7 sm:py-6"
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
                  {log.locked ? (
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
                  className="border-terminal-border text-terminal-text-dim grid h-11 w-11 place-items-center border bg-[#151515]"
                  aria-label={`${log.locked ? "Locked" : "View"} ${log.title}`}
                >
                  {log.locked ? <Lock className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PersonnelPage() {
  return (
    <section className="min-h-0 overflow-y-auto bg-[#080808] px-4 py-12 sm:px-8 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="border-terminal-border grid gap-6 border-b pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-[clamp(2rem,4.5vw,4rem)] leading-none font-black tracking-[-0.06em] text-white uppercase">
              Personnel Security Part
            </h2>
            <p className="text-terminal-text-dim mt-5 font-mono text-sm font-black tracking-[0.22em] uppercase">
              Sector-01 / Response Unit Alpha
            </p>
          </div>
          <div className="font-mono text-sm tracking-[0.12em] lg:text-right">
            <p className="text-terminal-accent font-black">ACCESS: GRANTED</p>
            <p className="text-terminal-text-dim mt-3">TS: 2024.11.23_14:22:09</p>
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-6xl pb-8">
          <div className="mx-auto max-w-lg">
            <PersonnelCard person={personnel.leader} leader />
          </div>

          <div className="bg-terminal-border mx-auto hidden h-20 w-px md:block" />
          <div className="bg-terminal-border mx-auto hidden h-px max-w-4xl md:block" />
          <div className="mx-auto hidden max-w-4xl grid-cols-3 md:grid">
            <span className="bg-terminal-border mx-auto h-10 w-px" />
            <span className="bg-terminal-border mx-auto h-10 w-px" />
            <span className="bg-terminal-border mx-auto h-10 w-px" />
          </div>

          <div className="mt-6 grid gap-5 md:mt-0 md:grid-cols-3">
            {personnel.senior.map((person) => (
              <PersonnelCard key={person.name} person={person} />
            ))}
          </div>

          <div className="bg-terminal-border mx-auto hidden h-16 w-px md:block" />
          <div className="mt-6 grid gap-5 md:mt-0 md:grid-cols-4">
            {personnel.junior.map((person) => (
              <PersonnelCard key={person.name} person={person} muted />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Redaction({ width }: { width: string }) {
  return <span className={cx("bg-terminal-text-dim mx-1 inline-block h-4 align-middle", width)} />;
}

function PersonnelCard({
  person,
  leader = false,
  muted = false,
}: {
  person: {
    name: string;
    callNum: string;
    role: string;
    highlighted?: boolean;
    icon?: typeof Shield;
  };
  leader?: boolean;
  muted?: boolean;
}) {
  const Icon = person.icon;

  return (
    <article
      className={cx(
        "relative border bg-[#121212] px-6 py-6",
        leader && "border-t-terminal-accent border-t-4",
        person.highlighted
          ? "border-terminal-accent bg-[#151515]"
          : muted
            ? "border-[#2a2a2a] bg-[#050505]"
            : "border-terminal-border"
      )}
    >
      <div className="mb-8 flex items-center justify-between gap-4">
        <p className="text-terminal-text-dim font-mono text-[10px] font-black tracking-[0.18em] uppercase">
          {person.role}
        </p>
        {Icon && <Icon className="text-terminal-text-dim h-4 w-4" />}
      </div>
      <h3 className="text-[clamp(1.25rem,2vw,1.85rem)] leading-none font-black tracking-[-0.04em] text-white">
        {person.name}
      </h3>
      <p className="text-terminal-text-dim mt-5 font-mono text-sm font-black tracking-[0.18em]">
        CALL NUM: {person.callNum}
      </p>
    </article>
  );
}

function MockEndingVideo({ durationMs, onEnded }: { durationMs: number; onEnded: () => void }) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const progress = Math.min(100, (elapsedMs / durationMs) * 100);

  useEffect(() => {
    const startedAt = window.performance.now();
    const interval = window.setInterval(() => {
      setElapsedMs(window.performance.now() - startedAt);
    }, 120);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black font-mono text-white">
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0_48%,rgb(255_255_255_/_0.055)_50%,transparent_52%),repeating-linear-gradient(0deg,rgb(255_255_255_/_0.045)_0_1px,transparent_1px_5px)] bg-[length:100%_7px,100%_5px] opacity-50" />
      <div className="terminal-noise absolute inset-0 opacity-35" />
      <div className="absolute inset-x-0 top-[6%] h-px bg-cyan-300/60 shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
      <div className="absolute inset-x-0 bottom-[6%] h-px bg-red-400/50 shadow-[0_0_16px_rgba(248,113,113,0.8)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0_42%,rgb(0_0_0_/_0.72)_78%)]" />

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

      <div className="absolute right-6 bottom-6 left-6 z-20 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/20">
          <div className="bg-terminal-accent-text h-px" style={{ width: `${progress}%` }} />
        </div>
        <button
          type="button"
          onClick={onEnded}
          className="hover:border-terminal-accent border border-white/20 px-3 py-2 text-[10px] font-black tracking-[0.24em] text-white/50 transition hover:text-white"
        >
          SKIP MOCK
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
  const deliveryMessage =
    delivery.status === "failed"
      ? delivery.message
      : delivery.status === "sent"
        ? `${delivery.email ?? "등록된 이메일"}로 ${delivery.rank ?? "?"} 등급 사원증이 발송 되었습니다.`
        : delivery.status === "sending"
          ? "등록된 이메일로 사원증을 발송하는 중입니다."
          : "영상 종료 후 사원증 발송이 예약됩니다.";

  return (
    <main className="min-h-screen bg-[#111] px-4 py-14 text-white sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
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
  progress,
  onSelectMail,
}: {
  selectedMail: TerminalMail;
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
        {terminalMails.map((mail) => {
          const unlocked = progress.unlockedMailIds.includes(mail.id);
          const active = selectedMail.id === mail.id;

          return (
            <button
              key={mail.id}
              type="button"
              disabled={!unlocked}
              onClick={() => onSelectMail(mail.id)}
              className={cx(
                "border-terminal-border block min-h-[96px] w-full border-b px-5 py-4 text-left transition",
                active && unlocked
                  ? "bg-terminal-accent-strong text-white"
                  : unlocked
                    ? "text-terminal-text bg-[#101010] hover:bg-[#181818]"
                    : "text-terminal-text-dim bg-[#0a0a0a] opacity-45"
              )}
            >
              <div className="mb-2 flex justify-between gap-3 font-mono text-[10px]">
                <span>{unlocked ? mail.time : "LOCKED"}</span>
                {active && <span className="text-terminal-accent-muted">ACTIVE</span>}
              </div>
              <h3 className="mb-2 text-sm font-black">{mail.title}</h3>
              <p className="text-terminal-text-muted line-clamp-2 text-xs leading-5">
                {unlocked ? mail.preview : "상위 단계 완료 후 열람 가능"}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MessengerDetail({
  mail,
  completed,
  selectedObjectIds,
  pinError,
  command,
  commandError,
  onToggleObject,
  onSubmitPin,
  onCommandChange,
  onSubmitCommand,
  onCubeComplete,
  onEndingComplete,
}: {
  mail: TerminalMail;
  completed: Set<string>;
  selectedObjectIds: string[];
  pinError: string;
  command: string;
  commandError: string;
  onToggleObject: (entry: TerminalObjectEntry) => void;
  onSubmitPin: () => void;
  onCommandChange: (value: string) => void;
  onSubmitCommand: (event: React.FormEvent<HTMLFormElement>) => void;
  onCubeComplete: () => void;
  onEndingComplete: () => void;
}) {
  return (
    <section className="min-h-0 overflow-y-auto bg-[#101010]">
      <div className="border-terminal-border border-b px-6 py-7 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-[clamp(1.6rem,3.2vw,2.35rem)] font-black tracking-[-0.04em] text-white">
            {mail.title}
          </h2>
          <div className="flex shrink-0 gap-2">
            <button className="border-terminal-border bg-terminal-tile grid h-8 w-8 place-items-center border">
              <Printer className="h-4 w-4" />
            </button>
            <button className="border-terminal-border bg-terminal-tile grid h-8 w-8 place-items-center border">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="text-terminal-text-dim grid gap-4 font-mono text-[10px] sm:grid-cols-2">
          <p className="border-terminal-accent border-l-2 pl-4">
            FROM: <span className="text-terminal-copy-strong ml-4">{mail.sender}</span>
          </p>
          <p className="border-terminal-accent border-l-2 pl-4">
            TO: <span className="text-terminal-copy-strong ml-4">{mail.to}</span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[920px] px-6 py-7 lg:px-8">
        <MailBody mail={mail} />
        <SecurityAlert />
        <div className="bg-terminal-border my-6 h-px" />
        {renderMailChallenge({
          mail,
          completed,
          selectedObjectIds,
          pinError,
          command,
          commandError,
          onToggleObject,
          onSubmitPin,
          onCommandChange,
          onSubmitCommand,
          onCubeComplete,
          onEndingComplete,
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
  completed,
  selectedObjectIds,
  pinError,
  command,
  commandError,
  onToggleObject,
  onSubmitPin,
  onCommandChange,
  onSubmitCommand,
  onCubeComplete,
  onEndingComplete,
}: {
  mail: TerminalMail;
  completed: Set<string>;
  selectedObjectIds: string[];
  pinError: string;
  command: string;
  commandError: string;
  onToggleObject: (entry: TerminalObjectEntry) => void;
  onSubmitPin: () => void;
  onCommandChange: (value: string) => void;
  onSubmitCommand: (event: React.FormEvent<HTMLFormElement>) => void;
  onCubeComplete: () => void;
  onEndingComplete: () => void;
}) {
  if (mail.challengeType === "pin-select") {
    return (
      <section className="border-terminal-border border bg-[#101010] p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-terminal-text-muted font-mono text-[11px] font-black tracking-[0.28em]">
              SECURITY_CHALLENGE
            </p>
            <p className="text-terminal-text-dim mt-1 text-xs">
              안전한 수송을 위한 보안 승인 아이콘 4개를 선택하십시오.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {terminalObjects.map((entry) => {
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
                <ObjectSymbolIcon symbol={entry.symbol} className="h-5 w-5" />
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
    ) : (
      <CubeChallenge onComplete={onCubeComplete} />
    );
  }

  if (mail.challengeType === "corrupted-command") {
    return completed.has(challengeIds.corrupted) ? (
      <CompletedPanel label="UNKNOWN_LANGUAGE_ACCEPTED" />
    ) : (
      <section className="border-terminal-border border bg-[#101010] p-6">
        <p className="text-terminal-accent-muted font-mono text-xs font-black tracking-[0.28em]">
          CORRUPTED_COMMAND
        </p>
        <div className="mt-5 grid gap-2">
          {corruptedFragments.map((fragment) => (
            <div
              key={fragment.raw}
              className="border-terminal-border grid grid-cols-[1fr_auto_auto] items-center gap-4 border bg-black/30 px-4 py-3 font-mono text-sm"
            >
              <span className="text-terminal-accent-text">{fragment.raw}</span>
              <span className="text-terminal-text-dim">{fragment.restored}</span>
              <span className="text-terminal-text">{fragment.answer}</span>
            </div>
          ))}
        </div>
        <form onSubmit={onSubmitCommand} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={command}
            onChange={(event) => onCommandChange(event.target.value.toUpperCase())}
            className="border-terminal-border text-terminal-text focus:border-terminal-accent min-h-12 flex-1 border bg-black px-4 font-mono text-sm tracking-[0.32em] outline-none"
            placeholder="COMMAND"
            spellCheck={false}
          />
          <button className="bg-terminal-accent-strong px-5 py-3 font-mono text-xs font-black tracking-[0.2em] text-white">
            EXECUTE
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
      <PretextEndingChallenge onComplete={onEndingComplete} />
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
              "text-terminal-text-dim grid aspect-square w-full place-items-center bg-[#222] transition",
              isPinSelectionEnabled &&
                "hover:bg-terminal-tile hover:text-terminal-accent-text cursor-pointer",
              selected && "bg-terminal-accent-soft text-terminal-accent-text"
            )}
            aria-label={`${selected ? "Deselect" : "Select"} ${entry.label} ${entry.symbol}`}
            aria-pressed={selected}
          >
            <ObjectSymbolIcon symbol={entry.symbol} className="h-28 w-28 stroke-1" />
          </button>
          {isPinSelectionEnabled && (
            <p className="text-terminal-accent mt-3 font-mono text-[9px] font-black tracking-[0.12em]">
              {selected ? "SELECTED_FOR_TRANSPORT" : "CLICK_ICON_TO_SELECT"}
            </p>
          )}
          <p className="mt-3 font-mono text-[9px] font-black text-white">{entry.label}.JPG</p>
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
