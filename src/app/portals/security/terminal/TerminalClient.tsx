"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { HINT_PROMPT_COUNT_STORAGE_KEY } from "@/lib/employee-card";
import {
  TERMINAL_PROGRESS_STORAGE_KEY,
  initialTerminalProgress,
  pinChallengeAnswer,
  terminalMails,
  terminalObjects,
  type TerminalObjectEntry,
  type TerminalProgress,
  type TerminalStage,
} from "@/lib/terminal-data";
import { cx, terminalTheme } from "@/theme/classes";
import { playSound } from "@/lib/sound";
import CubeChallenge from "./CubeChallenge";
import TerminalSidebar, { type Section } from "./TerminalSidebar";
import { FullscreenEndingVideo, SurveyQrPage, type EmployeeCardDelivery } from "./EndingFlow";
import { ContainmentLogsPage } from "./sections/ContainmentSection";
import { PersonSection } from "./sections/PersonSection";
import { ArchiveList, ArchiveDetail } from "./sections/ArchiveSection";
import { MessengerList, MessengerDetail } from "./sections/MessengerSection";

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
  const router = useRouter();
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
  const [userName, setUserName] = useState("(플레이어)");
  const [glitching, setGlitching] = useState(false);
  const [heavyGlitching, setHeavyGlitching] = useState(false);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const glitchRafRef = useRef<number>(0);
  const progressHydratedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
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
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : null)
      .then((data: { user: { name: string | null; email: string } | null } | null) => {
        const name = data?.user?.name ?? data?.user?.email ?? null;
        if (name) setUserName(name);
      })
      .catch(() => {});
  }, []);

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
    };
  }, []);

  // pin-select 클리어 후 → 불규칙 micro-burst 글리치
  const pinCompleted = completed.has(challengeIds.pin);
  useEffect(() => {
    if (!pinCompleted) return;

    const timers: number[] = [];

    function triggerBurstCycle() {
      cancelAnimationFrame(glitchRafRef.current);

      // 한 사이클당 3~6개의 micro-burst를 불규칙 간격으로 발생
      const numBursts = 3 + Math.floor(Math.random() * 4);
      let offset = 0;

      for (let i = 0; i < numBursts; i++) {
        const burstDelay    = offset + Math.random() * 120;
        const burstDuration = 35 + Math.random() * 90; // burst 지속: 35~125ms

        // burst 시작
        timers.push(window.setTimeout(() => {
          const scale = 12 + Math.random() * 40;
          const seed  = Math.floor(Math.random() * 200);
          // 수평 노이즈 빈도를 랜덤하게 → 넓은 슬라이스 vs 좁은 슬라이스
          const freq  = Math.random() < 0.5 ? "0.05 0.85" : "0.1 0.75";
          turbulenceRef.current?.setAttribute("seed", String(seed));
          turbulenceRef.current?.setAttribute("baseFrequency", freq);
          displacementRef.current?.setAttribute("scale", String(scale));
          setGlitching(true);
        }, burstDelay));

        // burst 종료
        timers.push(window.setTimeout(() => {
          displacementRef.current?.setAttribute("scale", "0");
          setGlitching(false);
        }, burstDelay + burstDuration));

        offset = burstDelay + burstDuration + 30 + Math.random() * 80;
      }
    }

    // 10초 heavy glitch: SVG displacement + 색상 효과 동시 적용
    function triggerHeavyGlitch() {
      cancelAnimationFrame(glitchRafRef.current);
      setHeavyGlitching(true);
      const start = performance.now();
      const duration = 500;

      function animate(now: number) {
        const elapsed = now - start;
        if (elapsed >= duration) {
          displacementRef.current?.setAttribute("scale", "0");
          setGlitching(false);
          setHeavyGlitching(false);
          return;
        }
        const scale = 20 + Math.random() * 35;
        const seed  = Math.floor(Math.random() * 200);
        const freq  = Math.random() < 0.5 ? "0.05 0.85" : "0.09 0.75";
        turbulenceRef.current?.setAttribute("seed", String(seed));
        turbulenceRef.current?.setAttribute("baseFrequency", freq);
        displacementRef.current?.setAttribute("scale", String(scale));
        setGlitching(true);
        glitchRafRef.current = requestAnimationFrame(animate);
      }
      glitchRafRef.current = requestAnimationFrame(animate);
    }

    // 첫 발동: 5초 후 micro-burst
    timers.push(window.setTimeout(triggerBurstCycle, 5000));

    // 이후 30초마다 micro-burst 반복
    const burstInterval = window.setInterval(triggerBurstCycle, 30000);
    timers.push(burstInterval as unknown as number);

    // 20초 후 첫 heavy glitch, 이후 40초마다 반복
    timers.push(window.setTimeout(triggerHeavyGlitch, 20000));
    const heavyInterval = window.setInterval(triggerHeavyGlitch, 40000);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.clearInterval(burstInterval);
      window.clearInterval(heavyInterval);
      cancelAnimationFrame(glitchRafRef.current);
      displacementRef.current?.setAttribute("scale", "0");
      setGlitching(false);
    };
  }, [pinCompleted]);

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
    playSound("/2phase_sount.mp3");
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
      // corrupted-command 완료 상태를 localStorage에 직접 저장 후 pretext 이동
      const nextMail = getMailForStage("pretext-ending");
      const updatedProgress: TerminalProgress = {
        currentStage: "pretext-ending",
        unlockedMailIds: mergeUnlocked(progress, nextMail.id),
        selectedMailId: nextMail.id,
        completedChallengeIds: progress.completedChallengeIds.includes(challengeIds.corrupted)
          ? progress.completedChallengeIds
          : [...progress.completedChallengeIds, challengeIds.corrupted],
      };
      window.localStorage.setItem(TERMINAL_PROGRESS_STORAGE_KEY, JSON.stringify(updatedProgress));
      router.push("/portals/security/terminal/pretext");
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
  const shouldShowCubeModal = cubeModalOpen && !completed.has(challengeIds.cube);

  if (visibleEndFlow === "ending-video") {
    return (
      <FullscreenEndingVideo
        posterSrc={endingFlowMock.posterSrc}
        videoSrc={endingFlowMock.videoSrc}
        soundSrc="/ending_sound.mp3"
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
        soundSrc="/ending_sound.mp3"
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
      />
    );
  }

  return (
    <>
      {/* SVG displacement 필터 — 항상 DOM에 존재, glitch 시 scale 변경 */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="terminal-glitch-svg" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.08 0.8"
              numOctaves="1"
              seed="1"
              result="noise"
            />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <main
        className={cx(
          "text-terminal-text min-h-screen overflow-x-hidden bg-[#080808] text-[13px]",
          terminalTheme.page
        )}
        style={glitching ? { filter: "url(#terminal-glitch-svg)" } : undefined}
      >
      {heavyGlitching && (
        <div
          className="pointer-events-none fixed inset-0 z-40"
          style={{ background: "rgba(180, 0, 0, 0.45)", mixBlendMode: "screen" }}
        />
      )}
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
          <PersonSection userName={userName} />
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
              userName={userName}
              onToggleObject={toggleObjectSelection}
              onSubmitPin={submitPinChallenge}
              onCommandChange={setCommand}
              onSubmitCommand={submitCommand}
              onOpenCubeModal={() => setCubeModalOpen(true)}
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

      {shouldShowCubeModal && (
        <CubeChallengeModal
          onComplete={completeCubeChallenge}
          onClose={() => setCubeModalOpen(false)}
        />
      )}
    </main>
    </>
  );
}

function CubeChallengeModal({
  onComplete,
  onClose,
}: {
  onComplete: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/82 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Cube protocol challenge"
    >
      <div className="terminal-noise absolute inset-0 opacity-25" />
      <section className="border-terminal-accent relative max-h-[92vh] w-full max-w-[680px] overflow-y-auto border bg-[#090909] shadow-[0_0_80px_rgb(170_0_0_/0.32)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 grid h-8 w-8 place-items-center border border-white/20 text-white/60 transition hover:border-white hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
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
