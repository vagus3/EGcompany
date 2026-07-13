"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { HINT_PROMPT_COUNT_STORAGE_KEY } from "@/lib/employee-card";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import {
  challengeIds,
  getMailForStage,
  PIN_SELECT_REQUIRED_COUNT,
  PRETEXT_FOUND_LETTERS_STORAGE_KEY,
  stageOrder,
  terminalMails,
  terminalObjects,
  type TerminalObjectEntry,
  type TerminalProgress,
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

const endingFlowAssets = {
  monsterVideoSrc: "/eg_png/egcompany_picture/P/ending/monsterending.mp4",
  posterSrc: "/eg_png/egcompany_picture/P/ending/ending.png",
  videoSrc: "/eg_png/egcompany_picture/P/ending/ending_v.mp4",
};

function getVisibleMails(progress: TerminalProgress) {
  const currentStageIndex = Math.max(stageOrder.indexOf(progress.currentStage), 0);
  const visibleCount = Math.min(terminalMails.length, currentStageIndex + 2);
  const visibleMailIds = new Set([
    ...terminalMails.slice(0, visibleCount).map((mail) => mail.id),
    ...progress.unlockedMailIds,
  ]);

  return terminalMails.filter((mail) => visibleMailIds.has(mail.id));
}

function getSelectedSymbols(selectedIds: string[]) {
  return selectedIds
    .map((id) => terminalObjects.find((entry) => entry.id === id)?.symbol)
    .filter(Boolean) as string[];
}

type LoadState = "loading" | "ready" | "error";

export default function TerminalClient() {
  const router = useRouter();
  const lang = useLanguage();
  const [progress, setProgress] = useState<TerminalProgress | null>(null);
  const [selectedMailId, setSelectedMailId] = useState<string>(() => getMailForStage("pin-select").id);
  const [loadState, setLoadState] = useState<LoadState>("loading");
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
  const timersRef = useRef<number[]>([]);
  const deliveryRequestedRef = useRef(false);
  const pretextCompletionHandledRef = useRef(false);
  // 정답 검증이 서버 왕복을 거치게 되면서, 응답이 오기 전에 같은 제출을 중복
  // 발사하지 않도록 막아둔다(더블클릭/빠른 재제출 방지).
  const pinSubmittingRef = useRef(false);
  const commandSubmittingRef = useRef(false);

  const visibleMails = useMemo(() => (progress ? getVisibleMails(progress) : []), [progress]);

  const selectedMail = useMemo(
    () => visibleMails.find((mail) => mail.id === selectedMailId) ?? visibleMails[0],
    [selectedMailId, visibleMails]
  );

  const selectedArchive =
    terminalObjects.find((entry) => entry.id === selectedArchiveId) ?? terminalObjects[2];

  const completed = useMemo(
    () => new Set(progress?.completedChallengeIds ?? []),
    [progress]
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

  const loadTerminalState = useCallback(async () => {
    setLoadState("loading");
    try {
      const response = await fetch("/api/terminal/state", { cache: "no-store" });

      if (response.status === 401) {
        router.replace("/login");
        return;
      }
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data = (await response.json()) as TerminalProgress;
      setProgress(data);
      setSelectedMailId(getMailForStage(data.currentStage).id);
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, [router]);

  useEffect(() => {
    queueMicrotask(() => void loadTerminalState());
  }, [loadTerminalState]);

  // Next.js는 브라우저 뒤로/앞으로가기 시 이 페이지의 이전 컴포넌트 인스턴스를
  // 재마운트 없이 재사용한다. mount effect가 다시 실행되지 않으므로, popstate가
  // 발생할 때마다 서버 기준으로 진행도를 다시 불러와 오래된 값이 화면에 남지 않게 한다.
  useEffect(() => {
    function handlePopState() {
      if (window.location.pathname !== "/portals/security/terminal") return;
      void loadTerminalState();
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [loadTerminalState]);

  // pretext 화면(별도 라우트)을 풀고 돌아오면 ?pretextComplete=1 이 붙는다.
  // 계정 데이터가 아니라 "방금 막 pretext를 풀고 왔다"는 1회성 네비게이션 신호이므로
  // 그대로 유지하되, 실제 완료 기록은 서버에 PATCH로 남긴다.
  useEffect(() => {
    if (loadState !== "ready") return;
    if (pretextCompletionHandledRef.current) return;
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("pretextComplete") !== "1") return;

    pretextCompletionHandledRef.current = true;
    window.history.replaceState(null, "", "/portals/security/terminal");

    let letters: string[] = [];
    try {
      const stored = window.sessionStorage.getItem(PRETEXT_FOUND_LETTERS_STORAGE_KEY);
      window.sessionStorage.removeItem(PRETEXT_FOUND_LETTERS_STORAGE_KEY);
      if (stored) letters = JSON.parse(stored) as string[];
    } catch {}

    fetch("/api/terminal/state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "completeChallenge", challengeId: challengeIds.pretext, letters }),
    })
      .then((response) => {
        if (response.ok) return response.json();

        // 정상 플레이라면 letters는 항상 정답과 일치해 여기서 실패할 일이 없다
        // (순서 검증은 이미 pretext 페이지에서 클라이언트가 강제했다). 유일한
        // 예외는 세션스토리지 저장/전달이 실패해 letters가 비거나 어긋난 경우인데
        // (422: 정답 불일치, 400: 빈 배열이라 스키마 자체를 통과 못함 등), 이건
        // "오답"이 아니라 "이미 푼 걸 서버에 증명하는 데 실패한 것"이므로 전체
        // 에러 화면 대신 pretext 페이지로 돌려보내 다시 확인시키는 게 맞다.
        pretextCompletionHandledRef.current = false;
        router.replace("/portals/security/terminal/pretext");
        return Promise.reject(new Error("retry"));
      })
      .then((data: TerminalProgress) => {
        setProgress(data);
        setSelectedMailId(getMailForStage(data.currentStage).id);
        setEndFlow("ending-video");
      })
      .catch((error) => {
        if (error instanceof Error && error.message === "retry") return;
        setLoadState("error");
      });
  }, [loadState, router]);

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
    const displacement = displacementRef.current;

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
      displacement?.setAttribute("scale", "0");
      setGlitching(false);
    };
  }, [pinCompleted]);

  function queueTimer(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  }

  // 정답 자체는 서버(server-only 모듈)만 알고 있다. 클라이언트는 "이렇게 풀었다"는
  // 제출값만 보내고, 서버가 직접 비교해 맞을 때만 다음 스테이지로 진행시킨다.
  type ChallengeCompletionPayload =
    | { challengeId: "pin-select"; symbols: string[] }
    | { challengeId: "cube-hold"; faceLabel: string }
    | { challengeId: "corrupted-command"; command: string };

  async function completeChallengeOnServer(
    payload: ChallengeCompletionPayload
  ): Promise<{ ok: true } | { ok: false; incorrect: boolean }> {
    try {
      const response = await fetch("/api/terminal/state", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "completeChallenge", ...payload }),
      });

      if (response.status === 422) return { ok: false, incorrect: true };
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data = (await response.json()) as TerminalProgress;
      setActiveSection("messenger");
      setProgress(data);
      setSelectedMailId(getMailForStage(data.currentStage).id);
      return { ok: true };
    } catch {
      setLoadState("error");
      return { ok: false, incorrect: false };
    }
  }

  function selectArchiveEntry(entry: TerminalObjectEntry) {
    setSelectedArchiveId(entry.id);
  }

  function toggleObjectSelection(entry: TerminalObjectEntry) {
    if (!progress || progress.currentStage !== "pin-select" || completed.has(challengeIds.pin)) return;

    setPinError("");
    setSelectedObjectIds((current) => {
      if (current.includes(entry.id)) return current.filter((id) => id !== entry.id);
      if (current.length >= 4) return current;
      return [...current, entry.id];
    });
  }

  async function submitPinChallenge() {
    if (pinSubmittingRef.current) return;
    const symbols = getSelectedSymbols(selectedObjectIds);
    if (symbols.length !== PIN_SELECT_REQUIRED_COUNT) return;

    pinSubmittingRef.current = true;
    setPinError("");
    const result = await completeChallengeOnServer({ challengeId: "pin-select", symbols });
    pinSubmittingRef.current = false;

    if (!result.ok) {
      if (result.incorrect) {
        setPinError("아이콘 모양에 맞는 4개 WESEN 개체를 다시 선택하십시오.");
        setSelectedObjectIds([]);
      }
      return;
    }

    setOverlay("found");
    playSound("/2phase_sount.mp3");
    queueTimer(() => {
      setSelectedObjectIds([]);
      setPinError("");
    }, 1250);
    queueTimer(() => setOverlay(null), 2300);
  }

  function submitCommand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (commandSubmittingRef.current) return;
    const trimmed = command.trim();
    if (!trimmed) return;

    commandSubmittingRef.current = true;
    setCommandError("");
    void (async () => {
      const result = await completeChallengeOnServer({
        challengeId: "corrupted-command",
        command: trimmed,
      });
      commandSubmittingRef.current = false;

      if (!result.ok) {
        if (result.incorrect) setCommandError("명령어가 일치하지 않습니다.");
        return;
      }

      setOverlay("command-warning");
      queueTimer(() => {
        setOverlay(null);
        setCommand("");
        router.push("/portals/security/terminal/pretext");
      }, 1750);
    })();
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

  function completeCubeChallenge(faceLabel: string) {
    setCubeModalOpen(false);
    void completeChallengeOnServer({ challengeId: "cube-hold", faceLabel });
  }

  if (loadState === "loading" || !progress) {
    return <TerminalLoadingScreen />;
  }

  if (loadState === "error") {
    return <TerminalErrorScreen onRetry={() => void loadTerminalState()} />;
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
        posterSrc={endingFlowAssets.posterSrc}
        videoSrc={endingFlowAssets.videoSrc}
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
        videoSrc={endingFlowAssets.monsterVideoSrc}
        soundSrc="/ending_sound.mp3"
        onEnded={() => {
          void finishMonsterVideo();
        }}
      />
    );
  }

  if (visibleEndFlow === "survey-qr") {
    return (
      <SurveyQrPage delivery={employeeCardDelivery} />
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
          onClick={() => router.push("/")}
          className={cx(
            "bg-terminal-accent-strong hover:bg-terminal-accent-active border border-terminal-border-alert px-4 py-2 font-mono text-[10px] font-black text-white transition-colors",
            lang === "ko" ? "tracking-[0.08em]" : "tracking-[0.42em]"
          )}
        >
          {t("terminal_return_home", lang)}
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
              onSelectMail={setSelectedMailId}
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
  onComplete: (faceLabel: string) => void;
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
      <section className="border-terminal-accent relative max-h-[92vh] w-full max-w-680px overflow-y-auto border bg-[#090909] shadow-[0_0_80px_rgb(170_0_0_/0.32)]">
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

function TerminalLoadingScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#080808] text-terminal-text">
      <p className="font-mono text-xs tracking-[0.32em] text-terminal-text-dim uppercase">
        LOADING TERMINAL STATE...
      </p>
    </main>
  );
}

function TerminalErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#080808] px-4 text-center text-terminal-text">
      <div>
        <p className="font-mono text-xs tracking-[0.24em] text-terminal-accent-text uppercase">
          진행도를 불러오지 못했습니다.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 border border-terminal-border px-5 py-2 font-mono text-xs tracking-[0.18em] text-terminal-text uppercase hover:border-white"
        >
          다시 시도
        </button>
      </div>
    </main>
  );
}
