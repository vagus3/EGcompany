"use client";

import { layoutWithLines, prepareWithSegments } from "@chenglou/pretext";
import { useEffect, useMemo, useRef, useState } from "react";

const endingText = [
  "SCP-███ 관찰 기록은 정상적인 문장 구조를 유지하지 못한다.",
  "보고자는 화면 가장자리에서 비어 있는 얼굴을 보았다고 진술했다.",
  "파일을 닫으려는 순간 커서 주변의 문자가 밀려났고 모든 행이 같은 방향으로 기울었다.",
  "절차상 접근자는 절대 뒤돌아보지 않아야 한다.",
  "빈 얼굴은 표정이 없고, 이름이 없고, 그러나 접근자의 이름을 알고 있다.",
  "다시 말한다. 절대 뒤돌아 보지마.",
].join(" ");

type EndingPhase = "search" | "blackout" | "found";

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

    window.setTimeout(() => setPhase("found"), 1900);
    window.setTimeout(() => onComplete(), 4200);
  }

  if (phase !== "search") {
    return (
      <section className="relative min-h-[430px] overflow-hidden border border-terminal-border bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#180000,transparent_48%)] opacity-50" />
        <div className="absolute inset-0 terminal-noise opacity-30" />
        <div className="relative flex min-h-[430px] items-center justify-center p-8 text-center font-mono">
          <p
            className={
              phase === "blackout"
                ? "text-2xl font-black tracking-[0.28em] text-terminal-text"
                : "text-4xl font-black tracking-[0.38em] text-terminal-accent-text"
            }
          >
            {phase === "blackout" ? "절대 뒤돌아 보지마" : "찾았다"}
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

      <div
        className="pointer-events-none absolute z-20 grid h-14 w-14 place-items-center border border-terminal-accent bg-black/80 font-mono text-[10px] font-black text-terminal-accent-text shadow-[0_0_22px_rgba(176,0,0,0.45)]"
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
            const distance = Math.hypot(cursor.x - width / 2, cursor.y - y);
            const force = Math.max(0, 1 - distance / 220);
            const direction = cursor.x < width / 2 ? 1 : -1;
            const translate = direction * force * (18 + index * 2);
            const blur = force > 0.5 ? 1.2 : 0;

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
        className="absolute right-[14%] bottom-[18%] z-30 h-24 w-20 rounded-[48%] border border-terminal-border bg-black/70 text-[0px] outline-none transition hover:border-terminal-accent hover:shadow-[0_0_30px_rgba(176,0,0,0.5)] focus-visible:border-terminal-accent"
        aria-label="빈 얼굴"
      >
        <span className="absolute left-5 top-8 h-2 w-2 bg-terminal-text-dim" />
        <span className="absolute right-5 top-8 h-2 w-2 bg-terminal-text-dim" />
        <span className="absolute bottom-7 left-1/2 h-px w-8 -translate-x-1/2 bg-terminal-border" />
      </button>

      <p className="absolute bottom-5 left-6 z-10 font-mono text-[10px] tracking-[0.24em] text-terminal-text-dim sm:left-8">
        CURSOR_FIELD_ACTIVE / EMPTY_FACE_SIGNATURE_UNSTABLE
      </p>
    </section>
  );
}
