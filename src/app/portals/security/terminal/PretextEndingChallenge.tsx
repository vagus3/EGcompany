"use client";

import { layoutWithLines, prepareWithSegments } from "@chenglou/pretext";
import { useEffect, useMemo, useRef, useState } from "react";

const incidentText = [
  "SECURITY_15 VISUAL INCIDENT REPORT / WESEN-0101 RETURN CHANNEL.",
  "This document is not a recording. It is a live layout recovered from the courier terminal after the transport breach near route 7G.",
  "The text was stable until the operator moved the pointer. Every paragraph then avoided the cursor as if the page were making room for a witness.",
  "The witness did not appear in the image layer. It appeared in the absence left behind by the moving letters.",
  "Attempts to print the file produced only black bars, duplicated margins, and one repeated Korean warning that no team member admitted typing.",
  "If the final sentence stabilizes, do not inspect the room behind you. Close the file and wait for the terminal to finish the transfer.",
  "The archive has already attached your access code to the return channel. The file is reading the operator at the same time the operator reads the file.",
].join(" ");

const breachFragments = [
  { id: "never", label: "절대", xRatio: 0.31, yRatio: 0.3 },
  { id: "turn", label: "뒤돌아", xRatio: 0.66, yRatio: 0.42 },
  { id: "look", label: "보지", xRatio: 0.38, yRatio: 0.62 },
  { id: "dont", label: "마", xRatio: 0.72, yRatio: 0.7 },
] as const;

type CanvasSize = {
  height: number;
  width: number;
};

type PointerField = {
  active: boolean;
  targetX: number;
  targetY: number;
  x: number;
  y: number;
};

type TextLine = {
  text: string;
  x: number;
  y: number;
};

type BreachFragment = (typeof breachFragments)[number];

function createInitialFragmentProgress() {
  return Object.fromEntries(breachFragments.map((fragment) => [fragment.id, 0])) as Record<
    BreachFragment["id"],
    number
  >;
}

function getIndexForWidth(ctx: CanvasRenderingContext2D, text: string, width: number) {
  if (width <= 0) return 0;

  for (let index = 1; index <= text.length; index += 1) {
    if (ctx.measureText(text.slice(0, index)).width > width) return Math.max(0, index - 1);
  }

  return text.length;
}

function drawLivingLine({
  breach,
  ctx,
  field,
  line,
  radius,
  time,
}: {
  breach: number;
  ctx: CanvasRenderingContext2D;
  field: PointerField;
  line: TextLine;
  radius: number;
  time: number;
}) {
  const distanceY = Math.abs(field.y - line.y);
  const force = field.active ? Math.max(0, 1 - distanceY / radius) : 0;

  if (force <= 0.02 && breach <= 0.04) {
    ctx.fillText(line.text, line.x, line.y);
    return;
  }

  const gap = radius * (0.34 + force * 0.72);
  const gapStart = field.x - gap;
  const gapEnd = field.x + gap;
  const leftIndex = getIndexForWidth(ctx, line.text, gapStart - line.x);
  const rightIndex = getIndexForWidth(ctx, line.text, gapEnd - line.x);
  const leftText = line.text.slice(0, leftIndex);
  const rightText = line.text.slice(rightIndex);
  const wave = Math.sin(time * 0.004 + line.y * 0.05) * (force * 7 + breach * 4);
  const skew = Math.cos(time * 0.003 + line.y * 0.03) * force * 0.08;

  ctx.save();
  ctx.globalAlpha = 0.58 + force * 0.28;
  ctx.transform(1, skew, 0, 1, 0, 0);
  ctx.fillText(leftText, line.x - force * 34 - breach * 6, line.y - wave);
  ctx.fillText(rightText, gapEnd + force * 34 + breach * 6, line.y + wave);
  ctx.restore();

  if (force > 0.08) {
    ctx.save();
    ctx.globalAlpha = force * 0.38;
    ctx.fillStyle = "#ffb1a8";
    ctx.fillText(
      "".padStart(Math.max(1, Math.floor(force * 10)), "█"),
      field.x - gap * 0.16,
      line.y
    );
    ctx.restore();
  }
}

function drawFragment({
  ctx,
  field,
  fragment,
  progress,
  radius,
  size,
  time,
}: {
  ctx: CanvasRenderingContext2D;
  field: PointerField;
  fragment: BreachFragment;
  progress: number;
  radius: number;
  size: CanvasSize;
  time: number;
}) {
  const x = size.width * fragment.xRatio;
  const y = size.height * fragment.yRatio;
  const distance = field.active ? Math.hypot(field.x - x, field.y - y) : Number.POSITIVE_INFINITY;
  const proximity = Math.max(0, 1 - distance / (radius * 0.75));
  const alpha = Math.max(progress, proximity * 0.75);
  const jitter = (1 - progress) * Math.sin(time * 0.016 + x) * 6;

  ctx.save();
  ctx.textBaseline = "middle";
  ctx.font = `900 ${size.width < 760 ? 20 : 30}px "Geist Mono", monospace`;
  ctx.globalAlpha = 0.12 + alpha * 0.88;
  ctx.fillStyle = progress > 0.98 ? "#fff0ec" : "#ffb1a8";
  ctx.shadowColor = "rgba(176,0,0,0.9)";
  ctx.shadowBlur = 18 * alpha;
  ctx.fillText(progress > 0.16 ? fragment.label : "████", x + jitter, y);

  ctx.globalAlpha = proximity * 0.34;
  ctx.strokeStyle = "#b00000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x + jitter + 22, y, radius * 0.22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export default function PretextEndingChallenge({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const completionTimerRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const fragmentProgressRef = useRef(createInitialFragmentProgress());
  const stabilizedCountRef = useRef(0);
  const fieldRef = useRef<PointerField>({
    active: false,
    targetX: 640,
    targetY: 360,
    x: 640,
    y: 360,
  });
  const [phase, setPhase] = useState<"reading" | "breach">("reading");
  const [size, setSize] = useState<CanvasSize>({ height: 720, width: 1280 });
  const [stabilizedCount, setStabilizedCount] = useState(0);

  const lines = useMemo<TextLine[]>(() => {
    if (typeof window === "undefined") return [];

    const fontSize = size.width < 760 ? 14 : 18;
    const lineHeight = size.width < 760 ? 25 : 31;
    const prepared = prepareWithSegments(incidentText, `600 ${fontSize}px "Geist Mono"`, {
      wordBreak: "keep-all",
    });
    const layout = layoutWithLines(prepared, Math.max(300, size.width * 0.76), lineHeight);
    const startY = Math.max(128, size.height * 0.16);

    return layout.lines
      .slice(0, Math.floor((size.height - startY - 112) / lineHeight))
      .map((line, index) => ({
        text: line.text.trimEnd(),
        x: Math.max(24, size.width * 0.075),
        y: startY + index * lineHeight,
      }));
  }, [size.height, size.width]);

  useEffect(() => {
    if (!rootRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setSize({
        height: Math.max(540, entry.contentRect.height),
        width: Math.max(360, entry.contentRect.width),
      });
    });
    observer.observe(rootRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (completionTimerRef.current) window.clearTimeout(completionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasElement = canvas;
    const context = ctx;
    let frameId = 0;
    let previousTime = window.performance.now();

    function completeChallenge() {
      if (completedRef.current) return;
      completedRef.current = true;
      setPhase("breach");
      completionTimerRef.current = window.setTimeout(onComplete, 1550);
    }

    function draw(time: number) {
      const delta = Math.min(0.05, (time - previousTime) / 1000);
      previousTime = time;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvasElement.width !== Math.floor(size.width * dpr)) {
        canvasElement.width = Math.floor(size.width * dpr);
      }
      if (canvasElement.height !== Math.floor(size.height * dpr)) {
        canvasElement.height = Math.floor(size.height * dpr);
      }
      canvasElement.style.width = `${size.width}px`;
      canvasElement.style.height = `${size.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const field = fieldRef.current;
      field.x += (field.targetX - field.x) * Math.min(1, delta * 8);
      field.y += (field.targetY - field.y) * Math.min(1, delta * 8);

      const radius = Math.max(100, Math.min(170, size.width * 0.12));
      const progress = fragmentProgressRef.current;
      let nextStabilizedCount = 0;

      breachFragments.forEach((fragment) => {
        const x = size.width * fragment.xRatio;
        const y = size.height * fragment.yRatio;
        const distance = field.active
          ? Math.hypot(field.x - x, field.y - y)
          : Number.POSITIVE_INFINITY;
        const close = distance < radius * 0.72;
        const nextProgress = Math.max(
          0,
          Math.min(1, progress[fragment.id] + (close ? delta * 0.72 : delta * 0.025))
        );
        progress[fragment.id] = nextProgress;
        if (nextProgress >= 0.98) nextStabilizedCount += 1;
      });

      if (nextStabilizedCount !== stabilizedCountRef.current) {
        stabilizedCountRef.current = nextStabilizedCount;
        setStabilizedCount(nextStabilizedCount);
      }

      const breach = breachFragments.reduce((sum, fragment) => sum + progress[fragment.id], 0) / 4;

      context.clearRect(0, 0, size.width, size.height);
      context.fillStyle = "#030303";
      context.fillRect(0, 0, size.width, size.height);

      const wash = context.createRadialGradient(
        field.x,
        field.y,
        8,
        field.x,
        field.y,
        size.width * 0.72
      );
      wash.addColorStop(0, `rgba(176,0,0,${field.active ? 0.22 : 0.1})`);
      wash.addColorStop(0.36, `rgba(176,0,0,${0.08 + breach * 0.11})`);
      wash.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = wash;
      context.fillRect(0, 0, size.width, size.height);

      context.save();
      context.globalAlpha = 0.06 + breach * 0.07;
      context.strokeStyle = "#ffffff";
      for (let y = 0; y < size.height; y += 6) {
        const offset = Math.sin(time * 0.003 + y * 0.04) * (0.8 + breach * 2.4);
        context.beginPath();
        context.moveTo(0, y + offset);
        context.lineTo(size.width, y - offset);
        context.stroke();
      }
      context.restore();

      context.save();
      context.font = `${size.width < 760 ? 14 : 18}px "Geist Mono", monospace`;
      context.textBaseline = "middle";
      context.fillStyle = `rgba(232,224,220,${0.7 - breach * 0.12})`;
      lines.forEach((line) => drawLivingLine({ breach, ctx: context, field, line, radius, time }));
      context.restore();

      context.save();
      context.globalAlpha = 0.12 + breach * 0.3;
      context.font = `900 ${size.width < 760 ? 36 : 64}px "Geist Mono", monospace`;
      context.textBaseline = "middle";
      context.fillStyle = "#3b0000";
      context.fillText("절대 뒤돌아 보지마", size.width * 0.12, size.height * 0.52);
      context.restore();

      breachFragments.forEach((fragment) =>
        drawFragment({
          ctx: context,
          field,
          fragment,
          progress: progress[fragment.id],
          radius,
          size,
          time,
        })
      );

      if (field.active) {
        context.save();
        context.globalCompositeOperation = "lighter";
        const halo = context.createRadialGradient(field.x, field.y, 0, field.x, field.y, radius);
        halo.addColorStop(0, "rgba(255,177,168,0.2)");
        halo.addColorStop(0.38, "rgba(176,0,0,0.16)");
        halo.addColorStop(1, "rgba(176,0,0,0)");
        context.fillStyle = halo;
        context.beginPath();
        context.arc(field.x, field.y, radius, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "rgba(255,177,168,0.42)";
        context.lineWidth = 1;
        context.stroke();
        context.restore();
      }

      if (nextStabilizedCount === breachFragments.length) completeChallenge();
      if (!completedRef.current) frameId = window.requestAnimationFrame(draw);
    }

    frameId = window.requestAnimationFrame(draw);

    return () => window.cancelAnimationFrame(frameId);
  }, [lines, onComplete, size]);

  function updatePointer(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    fieldRef.current.active = true;
    fieldRef.current.targetX = event.clientX - rect.left;
    fieldRef.current.targetY = event.clientY - rect.top;
  }

  return (
    <main
      ref={rootRef}
      onPointerDown={updatePointer}
      onPointerMove={updatePointer}
      onPointerLeave={() => {
        fieldRef.current.active = false;
      }}
      className="relative min-h-screen cursor-crosshair overflow-hidden bg-black text-white"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 px-5 py-4 font-mono text-[10px] font-black tracking-[0.24em] text-white/50">
        <span>PRETEXT INCIDENT FILE</span>
        <span className="text-terminal-accent-text">
          {stabilizedCount}/{breachFragments.length} WARNING FRAGMENTS STABILIZED
        </span>
      </div>
      <div className="pointer-events-none absolute right-5 bottom-5 left-5 z-10 font-mono text-[10px] font-black tracking-[0.18em] text-white/35">
        <span>OPERATOR FIELD DETECTED / EMPTY SPACE CONTAINS RETURN CHANNEL</span>
      </div>
      {phase === "breach" && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-black font-mono">
          <div className="terminal-noise absolute inset-0 opacity-35" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(176,0,0,0.24),transparent_48%)]" />
          <p className="text-terminal-accent-text relative px-6 text-center text-[clamp(2rem,6vw,5rem)] font-black tracking-[0.34em]">
            절대 뒤돌아 보지마
          </p>
        </div>
      )}
    </main>
  );
}
