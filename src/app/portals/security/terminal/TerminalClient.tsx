"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HINT_PROMPT_COUNT_STORAGE_KEY } from "@/lib/employee-card";
import {
  initialTerminalProgress,
  pinChallengeAnswer,
  terminalMails,
  terminalObjects,
  type TerminalObjectEntry,
  type TerminalProgress,
  type TerminalStage,
} from "@/lib/terminal-data";
import { cx, terminalTheme } from "@/theme/classes";
import CubeChallenge from "./CubeChallenge";
import TerminalSidebar, { type Section } from "./TerminalSidebar";
import { FullscreenEndingVideo, SurveyQrPage, type EmployeeCardDelivery } from "./EndingFlow";
import { ContainmentLogsPage } from "./sections/ContainmentSection";
import { ArchiveList, ArchiveDetail } from "./sections/ArchiveSection";
import { MessengerList, MessengerDetail } from "./sections/MessengerSection";

const TERMINAL_PROGRESS_STORAGE_KEY = "terminal-progress-v1";

type OverlayState = "found" | "command-warning" | null;
type TerminalEndFlow = "idle" | "ending-video" | "monster-video" | "survey-qr";

const challengeIds = {
  pin: "pin-select",
  cube: "cube-hold",
  corrupted: "corrupted-command",
  pretext: "pretext-ending",
} as const;

const stageOrder: TerminalStage[] = [
  "pin-select",
  "cube-hold",
  "corrupted-command",
  "pretext-ending",
  "completed",
];

const endingFlowMock = {
  monsterVideoSrc: "/eg_png/egcompany_picture/P/ending/monsterending.mp4",
  posterSrc: "/eg_png/egcompany_picture/P/ending/ending.png",
  surveyUrl: "https://forms.gle/eg-play-survey-mock",
  videoSrc: "/eg_png/egcompany_picture/P/ending/ending_v.mp4",
};

function getMailForStage(stage: TerminalStage) {
  return terminalMails.find((mail) => mail.unlockedStage === stage) ?? terminalMails[0];
}

function getVisibleMails(progress: TerminalProgress) {
  const currentStageIndex = Math.max(stageOrder.indexOf(progress.currentStage), 0);
  const visibleCount = Math.min(terminalMails.length, currentStageIndex + 2);
  const visibleMailIds = new Set([
    ...terminalMails.slice(0, visibleCount).map((mail) => mail.id),
    ...progress.unlockedMailIds,
  ]);

  return terminalMails.filter((mail) => visibleMailIds.has(mail.id));
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

function mergeUnlocked(progress: TerminalProgress, mailId: string) {
  return progress.unlockedMailIds.includes(mailId)
    ? progress.unlockedMailIds
    : [...progress.unlockedMailIds, mailId];
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

function getSelectedSymbols(selectedIds: string[]) {
  return selectedIds
    .map((id) => terminalObjects.find((entry) => entry.id === id)?.symbol)
    .filter(Boolean) as string[];
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
  const progressHydratedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
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
    if (command.trim().toUpperCase() !== "RAOMTNI") {
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
    setEndFlow("monster-video");
  }

  async function finishMonsterVideo() {
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

  if (visibleEndFlow === "monster-video") {
    return (
      <FullscreenEndingVideo
        videoSrc={endingFlowMock.monsterVideoSrc}
        onEnded={() => {
          void finishMonsterVideo();
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
      <header className="border-terminal-border flex min-h-52px items-center justify-between border-b bg-[#151515] px-5">
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
            <ArchiveList selectedArchiveId={selectedArchiveId} onSelect={selectArchiveEntry} />
            <ArchiveDetail entry={selectedArchive} />
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
      <section className="border-terminal-accent relative w-full max-w-5xl border bg-[#090909] shadow-[0_0_80px_rgb(170_0_0_/0.32)]">
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
