"use client";

import { layoutWithLines, prepareWithSegments } from "@chenglou/pretext";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

const endingText = [
  "SCP-███ 관찰 기록은 정상적인 문장 구조를 유지하지 못한다.",
  "보고자는 화면 가장자리에서 비어 있는 얼굴을 보았다고 진술했다.",
  "파일을 닫으려는 순간 커서 주변의 문자가 밀려났고 모든 행이 같은 방향으로 기울었다.",
  "절차상 접근자는 절대 뒤돌아보지 않아야 한다.",
  "빈 얼굴은 표정이 없고, 이름이 없고, 그러나 접근자의 이름을 알고 있다.",
  "다시 말한다. 절대 뒤돌아 보지마.",
].join(" ");

type EndingPhase = "search" | "blackout" | "hit" | "found";

export default function PretextEndingChallenge({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(620);
  const [cursor, setCursor] = useState({ x: 320, y: 210 });
  const [phase, setPhase] = useState<EndingPhase>("search");

  const lines = useMemo(() => {
    const prepared = prepareWithSegments(endingText, '700 16px "Geist Mono"', {
      wordBreak: "keep-all",
    });
    return layoutWithLines(prepared, Math.max(240, width - 80), 30).lines;
  }, [width]);

  useEffect(() => {
    if (!rootRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setWidth(entry.contentRect.width);
    });
    observer.observe(rootRef.current);

    return () => observer.disconnect();
  }, []);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setCursor({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  function triggerEnding() {
    if (phase !== "search") return;
    setPhase("blackout");

    window.setTimeout(() => setPhase("hit"), 1100);
  }

  if (phase !== "search") {
    return (
      <section className="relative min-h-[430px] overflow-hidden border border-terminal-border bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#250000,transparent_48%)] opacity-60" />
        <div className="absolute inset-0 terminal-noise opacity-40" />
        {phase === "hit" ? (
          <video
            src="/monsterhit.mp4"
            autoPlay
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            onEnded={() => {
              setPhase("found");
              window.setTimeout(() => onComplete(), 1200);
            }}
          />
        ) : (
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 opacity-35 blur-md">
            <MonsterFace intensity={phase === "found" ? 1 : 0.45} compact />
          </div>
        )}
        <div className="relative flex min-h-[430px] items-center justify-center p-8 text-center font-mono">
          <p
            className={
              phase === "blackout"
                ? "text-2xl font-black tracking-[0.28em] text-terminal-text"
                : phase === "hit"
                  ? "sr-only"
                  : "text-4xl font-black tracking-[0.38em] text-terminal-accent-text"
            }
          >
            {phase === "blackout" ? "절대 뒤돌아 보지마" : phase === "hit" ? "영상 재생 중" : "찾았다"}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      onPointerMove={handlePointerMove}
      className="relative min-h-[520px] cursor-none overflow-hidden border border-terminal-border bg-[#030303] p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 terminal-scanline opacity-40" />
      <div className="pointer-events-none absolute inset-0 terminal-noise opacity-10" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_66%,rgba(176,0,0,0.18),transparent_22%),radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),transparent_38%)]" />

      <div
        className="pointer-events-none absolute z-30 grid h-16 w-16 place-items-center bg-[url('/eg_png/egcompany_picture/P/P05_cursor.png')] bg-cover bg-center font-mono text-[0px] font-black text-terminal-accent-text drop-shadow-[0_0_18px_rgba(255,0,0,0.65)]"
        style={{
          left: cursor.x,
          top: cursor.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <span className="h-7 w-7 border-2 border-current p-1 leading-[18px]">CPU</span>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl pt-5 font-mono">
        <p className="mb-5 text-xs font-black tracking-[0.38em] text-terminal-accent-muted">
          SCP_FILE_VISUAL_ANOMALY
        </p>
        <div className="space-y-2">
          {lines.map((line, index) => {
            const y = 92 + index * 34;
            const distance = Math.hypot(cursor.x - width * 0.68, cursor.y - y);
            const force = Math.max(0, 1 - distance / 220);
            const direction = cursor.x < width / 2 ? 1 : -1;
            const translate = direction * force * (24 + index * 3);
            const blur = force > 0.5 ? 1.8 : 0;

            return (
              <p
                key={`${line.text}-${index}`}
                className="text-base font-bold leading-8 text-terminal-copy transition-transform duration-100"
                style={{
                  transform: `translateX(${translate}px) skewX(${force * direction * -4}deg)`,
                  filter: `blur(${blur}px)`,
                  opacity: 0.46 + Math.min(force, 0.32),
                }}
              >
                {line.text}
              </p>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={triggerEnding}
        className="group absolute right-[6%] bottom-[6%] z-20 h-[360px] w-[260px] max-w-[42vw] text-[0px] outline-none transition duration-300 hover:scale-[1.03] focus-visible:scale-[1.03] sm:right-[10%] sm:bottom-[8%]"
        aria-label="빈 얼굴"
      >
        <MonsterFace
          intensity={Math.max(0.15, 1 - Math.hypot(cursor.x - width * 0.74, cursor.y - 360) / 420)}
        />
      </button>

      <p className="absolute bottom-5 left-6 z-10 font-mono text-[10px] tracking-[0.24em] text-terminal-text-dim sm:left-8">
        CURSOR_FIELD_ACTIVE / EMPTY_FACE_SIGNATURE_UNSTABLE
      </p>
    </section>
  );
}

function MonsterFace({ intensity, compact = false }: { intensity: number; compact?: boolean }) {
  const glow = Math.min(1, Math.max(0, intensity));
  const style = {
    "--eye-glow": `${0.35 + glow * 0.65}`,
    "--monster-jitter": `${glow * 7}px`,
    "--monster-tilt": `${(glow - 0.5) * 3}deg`,
  } as CSSProperties;

  return (
    <div
      className={`monster-shell ${compact ? "scale-75" : ""} relative h-full w-full`}
      style={style}
      aria-hidden
    >
      <div className="absolute left-1/2 top-[4%] h-[28%] w-[58%] -translate-x-1/2 rounded-[38%_38%_24%_24%] border border-white/15 bg-[linear-gradient(145deg,#171717,#050505_55%,#262626)] shadow-[inset_0_0_26px_rgba(255,255,255,0.08),0_0_34px_rgba(0,0,0,0.9)]">
        <img
          src="/monsterhead.png"
          alt=""
          className="absolute left-1/2 top-1/2 h-[230%] w-[230%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-95"
        />
        <div className="absolute left-[16%] top-[35%] h-[18%] w-[20%] rounded-sm bg-red-600 shadow-[0_0_12px_rgba(255,0,0,var(--eye-glow)),0_0_32px_rgba(255,0,0,var(--eye-glow))]" />
        <div className="absolute right-[16%] top-[35%] h-[18%] w-[20%] rounded-sm bg-red-600 shadow-[0_0_12px_rgba(255,0,0,var(--eye-glow)),0_0_32px_rgba(255,0,0,var(--eye-glow))]" />
        <div className="absolute left-1/2 top-[66%] h-[14%] w-[42%] -translate-x-1/2 border-t border-red-900/70 bg-black/50" />
        <div className="absolute left-[14%] top-[12%] h-px w-[68%] bg-white/15" />
        <div className="absolute left-[27%] top-0 h-full w-px bg-white/10" />
        <div className="absolute right-[27%] top-0 h-full w-px bg-white/10" />
      </div>

      <div className="absolute left-1/2 top-[28%] h-[38%] w-[44%] -translate-x-1/2 bg-[linear-gradient(180deg,#121212,#020202)] shadow-[inset_0_0_24px_rgba(255,255,255,0.08)]">
        <div className="absolute left-1/2 top-[12%] h-3 w-3 -translate-x-1/2 rounded-full bg-red-500 shadow-[0_0_18px_rgba(255,0,0,var(--eye-glow))]" />
        <div className="absolute left-[23%] top-[34%] h-[36%] w-px bg-yellow-200/60 shadow-[0_0_10px_rgba(250,204,21,0.55)]" />
        <div className="absolute right-[23%] top-[34%] h-[36%] w-px bg-yellow-200/60 shadow-[0_0_10px_rgba(250,204,21,0.55)]" />
        <div className="absolute bottom-[10%] left-1/2 h-1.5 w-20 -translate-x-1/2 bg-red-600/80 shadow-[0_0_18px_rgba(255,0,0,var(--eye-glow))]" />
      </div>

      <div className="absolute left-[18%] top-[35%] h-[42%] w-[9%] rotate-12 bg-[linear-gradient(180deg,#161616,#030303)]">
        <span className="absolute top-[46%] h-[18%] w-full bg-yellow-200/70 shadow-[0_0_12px_rgba(250,204,21,0.5)]" />
      </div>
      <div className="absolute right-[18%] top-[35%] h-[42%] w-[9%] -rotate-12 bg-[linear-gradient(180deg,#161616,#030303)]">
        <span className="absolute top-[46%] h-[18%] w-full bg-yellow-200/70 shadow-[0_0_12px_rgba(250,204,21,0.5)]" />
      </div>

      {Array.from({ length: 12 }, (_, index) => (
        <span
          key={index}
          className="monster-wire absolute top-[11%] h-[48%] w-px origin-top bg-white/15"
          style={{
            left: `${20 + index * 5}%`,
            transform: `rotate(${(index - 6) * 7}deg) translateY(${index % 2 ? 7 : -4}px)`,
            animationDelay: `${index * -0.17}s`,
          }}
        />
      ))}

      <div className="absolute left-1/2 top-[18%] h-[58%] w-[78%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.14),transparent_58%)] blur-2xl" />
    </div>
  );
}
