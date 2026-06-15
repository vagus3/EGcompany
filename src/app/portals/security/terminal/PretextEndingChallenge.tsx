"use client";

import { layoutWithLines, prepareWithSegments } from "@chenglou/pretext";
import { useEffect, useMemo, useRef, useState } from "react";

const COLS = 21;
const ROWS = 13;

const GARBLED_POOL = Array.from(
  "뷁뭵뺑뽥뿡쀄쁭웳쀘뻥뻘뺙뼁뽁뿜뾰뻒뾹뿩뽑뼙뺼★▲△▼◆◇□■│─┤┬├┴┼╔╗╚╝╠╣╦╩╬▓░▒＄＆％＃＠！Ψψ∂∫∑⌀⌂⌬"
);

const PATH_TEXT =
  "BREACH SIGNAL DETECTED IN SECTOR 7G THE PASSAGE IS NARROW DO NOT STOP MOVING THE ENTITY DOES NOT HAVE EYES IT NAVIGATES BY THE SOUND OF BREATHING EXIT PROTOCOL ENGAGED RETURN CHANNEL OPEN FOLLOW THE DISPLACEMENT 언어가 무너지고 있습니다 텍스트는 당신을 통해 흐릅니다 THE ARCHIVE CANNOT HOLD THIS FILE THE LETTERS KNOW YOU ARE HERE DO NOT LOOK BACK THE EXIT IS WATCHING YOU REACH IT BEFORE IT REACHES YOU SECTOR BREACH CONFIRMED OPERATOR FIELD DETECTED PROCEED TO RETURN CHANNEL ".repeat(
    5
  );

function makeLCG(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = ((s * 1664525 + 1013904223) & 0xffffffff) >>> 0;
    return s / 4294967296;
  };
}

function buildMaze(): number[][] {
  const rng = makeLCG(42);
  const grid: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(1));
  function carve(c: number, r: number) {
    const dirs = [
      [0, -2],
      [0, 2],
      [-2, 0],
      [2, 0],
    ];
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }
    for (const [dc, dr] of dirs) {
      const nc = c + dc,
        nr = r + dr;
      if (nr > 0 && nr < ROWS - 1 && nc > 0 && nc < COLS - 1 && grid[nr][nc] === 1) {
        grid[r + dr / 2][c + dc / 2] = 0;
        grid[nr][nc] = 0;
        carve(nc, nr);
      }
    }
  }
  grid[1][1] = 0;
  carve(1, 1);
  grid[1][0] = 0;
  grid[ROWS - 2][COLS - 1] = 0;
  return grid;
}

const MAZE = buildMaze();
const EXIT_COL = COLS - 1;
const EXIT_ROW = ROWS - 2;

type TextLine = { text: string; x: number; y: number };
type Field = { active: boolean; x: number; y: number; targetX: number; targetY: number };

function getIndexForWidth(ctx: CanvasRenderingContext2D, text: string, width: number) {
  if (width <= 0) return 0;
  for (let i = 1; i <= text.length; i++) {
    if (ctx.measureText(text.slice(0, i)).width > width) return Math.max(0, i - 1);
  }
  return text.length;
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  line: TextLine,
  field: Field,
  radius: number,
  time: number
) {
  const distY = Math.abs(field.y - line.y);
  const force = field.active ? Math.max(0, 1 - distY / radius) : 0;
  if (force <= 0.03) {
    ctx.fillText(line.text, line.x, line.y);
    return;
  }
  const gap = radius * (0.28 + force * 0.82);
  const gapStart = field.x - gap;
  const gapEnd = field.x + gap;
  const leftIdx = getIndexForWidth(ctx, line.text, gapStart - line.x);
  const rightIdx = getIndexForWidth(ctx, line.text, gapEnd - line.x);
  const leftText = line.text.slice(0, leftIdx);
  const rightText = line.text.slice(rightIdx);
  const wave = Math.sin(time * 0.004 + line.y * 0.05) * (force * 8);
  const skew = Math.cos(time * 0.003 + line.y * 0.03) * force * 0.06;
  ctx.save();
  ctx.globalAlpha = 0.55 + force * 0.3;
  ctx.transform(1, skew, 0, 1, 0, 0);
  ctx.fillText(leftText, line.x - force * 38, line.y - wave);
  ctx.fillText(rightText, gapEnd + force * 38, line.y + wave);
  ctx.restore();
}

export default function PretextEndingChallenge({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const fieldRef = useRef<Field>({ active: false, x: 0, y: 0, targetX: 0, targetY: 0 });
  const playerCellRef = useRef({ col: 0, row: 1 });
  const prevCellRef = useRef<{ col: number; row: number } | null>(null);
  const collisionRef = useRef(0);
  const flashRef = useRef(0);
  const charPhaseRef = useRef<number[][]>(
    Array.from({ length: ROWS }, (_, r) =>
      Array.from({ length: COLS }, (_, c) => (r * COLS + c) * 0.41)
    )
  );
  const [collisions, setCollisions] = useState(0);
  const [phase, setPhase] = useState<"playing" | "complete">("playing");
  const [size, setSize] = useState({ width: 1280, height: 720 });

  const lines = useMemo<TextLine[]>(() => {
    if (typeof window === "undefined") return [];
    const fontSize = size.width < 760 ? 13 : 16;
    const lineHeight = size.width < 760 ? 26 : 32;
    const prepared = prepareWithSegments(
      PATH_TEXT,
      `500 ${fontSize}px "Geist Mono", monospace`,
      { wordBreak: "keep-all" }
    );
    const layout = layoutWithLines(prepared, size.width, lineHeight);
    const total = Math.ceil(size.height / lineHeight) + 2;
    return layout.lines.slice(0, total).map((line, i) => ({
      text: line.text.trimEnd(),
      x: 0,
      y: lineHeight / 2 + i * lineHeight,
    }));
  }, [size.width, size.height]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setSize({
        width: Math.max(360, entry.contentRect.width),
        height: Math.max(300, entry.contentRect.height),
      });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    fieldRef.current.active = true;
    fieldRef.current.targetX = mx;
    fieldRef.current.targetY = my;

    if (completedRef.current) return;

    const cellSize = Math.min(Math.floor(size.width / COLS), Math.floor(size.height / ROWS));
    const ox = (size.width - cellSize * COLS) / 2;
    const oy = (size.height - cellSize * ROWS) / 2;
    const col = Math.floor((mx - ox) / cellSize);
    const row = Math.floor((my - oy) / cellSize);

    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;

    const prev = prevCellRef.current;
    if (prev && prev.col === col && prev.row === row) return;
    prevCellRef.current = { col, row };

    if (MAZE[row][col] === 1) {
      const wasInPath = prev !== null && MAZE[prev.row][prev.col] === 0;
      if (wasInPath) {
        const next = collisionRef.current + 1;
        collisionRef.current = next;
        flashRef.current = 1.0;
        setCollisions(next);
        if (next >= 3) {
          collisionRef.current = 0;
          setCollisions(0);
          playerCellRef.current = { col: 0, row: 1 };
          prevCellRef.current = null;
        }
      }
    } else {
      playerCellRef.current = { col, row };
      if (col === EXIT_COL && row === EXIT_ROW && !completedRef.current) {
        completedRef.current = true;
        setPhase("complete");
        setTimeout(onComplete, 1800);
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId = 0;
    let prevTime = performance.now();

    function draw(now: number) {
      const dt = Math.min(0.05, (now - prevTime) / 1000);
      prevTime = now;

      const W = size.width;
      const H = size.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas!.width !== Math.floor(W * dpr)) canvas!.width = Math.floor(W * dpr);
      if (canvas!.height !== Math.floor(H * dpr)) canvas!.height = Math.floor(H * dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cellSize = Math.min(Math.floor(W / COLS), Math.floor(H / ROWS));
      const ox = (W - cellSize * COLS) / 2;
      const oy = (H - cellSize * ROWS) / 2;

      const field = fieldRef.current;
      field.x += (field.targetX - field.x) * Math.min(1, dt * 10);
      field.y += (field.targetY - field.y) * Math.min(1, dt * 10);
      if (flashRef.current > 0) flashRef.current = Math.max(0, flashRef.current - dt * 2.5);

      // Background
      ctx!.fillStyle = "#030303";
      ctx!.fillRect(0, 0, W, H);

      if (field.active) {
        const glow = ctx!.createRadialGradient(field.x, field.y, 0, field.x, field.y, W * 0.45);
        glow.addColorStop(0, "rgba(110,0,0,0.22)");
        glow.addColorStop(0.5, "rgba(50,0,0,0.08)");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = glow;
        ctx!.fillRect(0, 0, W, H);
      }

      // Scanlines
      ctx!.save();
      ctx!.globalAlpha = 0.06;
      ctx!.strokeStyle = "#ffffff";
      ctx!.lineWidth = 0.5;
      for (let y = 0; y < H; y += 4) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(W, y);
        ctx!.stroke();
      }
      ctx!.restore();

      // PATH cells — clip to path cells, draw pretext avoidance text inside
      const radius = Math.max(90, Math.min(180, W * 0.12));
      const fontSize = size.width < 760 ? 13 : 16;

      ctx!.save();
      ctx!.beginPath();
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (MAZE[r][c] === 0) {
            ctx!.rect(
              Math.floor(ox + c * cellSize),
              Math.floor(oy + r * cellSize),
              cellSize,
              cellSize
            );
          }
        }
      }
      ctx!.clip();
      ctx!.font = `500 ${fontSize}px "Geist Mono", monospace`;
      ctx!.textAlign = "left";
      ctx!.textBaseline = "middle";
      ctx!.fillStyle = "rgba(210,192,188,0.72)";
      lines.forEach((line) => drawLine(ctx!, line, field, radius, now));
      ctx!.restore();

      // WALL cells — dense garbled chars, no avoidance
      const wallFontSize = Math.max(10, cellSize - 4);
      const phases = charPhaseRef.current;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (MAZE[r][c] !== 1) continue;
          const cx = ox + c * cellSize + cellSize / 2;
          const cy = oy + r * cellSize + cellSize / 2;
          phases[r][c] =
            (phases[r][c] +
              dt * (1.7 + Math.sin(now * 0.001 + c * 0.9 + r * 1.3) * 1.0)) %
            GARBLED_POOL.length;
          const char = GARBLED_POOL[Math.floor(phases[r][c])];
          const distM = Math.hypot(field.x - cx, field.y - cy);
          const prox = Math.max(0, 1 - distM / (cellSize * 5));
          const flicker = 0.55 + 0.2 * Math.sin(now * 0.005 + c * 0.7 + r * 1.1);
          ctx!.globalAlpha = 0.7 + prox * 0.25 + flicker * 0.04;
          ctx!.fillStyle = `rgb(${Math.floor(85 + prox * 105)},${Math.floor(22 + prox * 18)},${Math.floor(28 + prox * 14)})`;
          ctx!.font = `bold ${wallFontSize}px "Geist Mono", monospace`;
          ctx!.fillText(char, cx, cy);
          ctx!.globalAlpha = 1;
        }
      }

      // Exit marker
      const exitX = ox + EXIT_COL * cellSize + cellSize / 2;
      const exitY = oy + EXIT_ROW * cellSize + cellSize / 2;
      ctx!.save();
      ctx!.globalAlpha = 0.65 + 0.35 * Math.sin(now * 0.005);
      ctx!.fillStyle = "#00ff88";
      ctx!.shadowColor = "#00ff88";
      ctx!.shadowBlur = 18;
      ctx!.font = `bold ${wallFontSize}px "Geist Mono", monospace`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.fillText("▶", exitX, exitY);
      ctx!.restore();

      // Player last-valid-cell indicator
      const player = playerCellRef.current;
      const plrX = ox + player.col * cellSize + cellSize / 2;
      const plrY = oy + player.row * cellSize + cellSize / 2;
      ctx!.save();
      ctx!.globalAlpha = 0.28 + 0.12 * Math.sin(now * 0.006);
      ctx!.strokeStyle = "#ff6644";
      ctx!.lineWidth = 1.5;
      ctx!.shadowColor = "#ff4422";
      ctx!.shadowBlur = 8;
      const hs = cellSize * 0.38;
      ctx!.strokeRect(plrX - hs, plrY - hs, hs * 2, hs * 2);
      ctx!.restore();

      // Collision flash
      if (flashRef.current > 0) {
        ctx!.save();
        ctx!.globalAlpha = flashRef.current * 0.38;
        ctx!.fillStyle = "#cc0000";
        ctx!.fillRect(0, 0, W, H);
        ctx!.restore();
      }

      // Random glitch line
      if (Math.random() < 0.01) {
        ctx!.save();
        ctx!.globalAlpha = 0.16;
        ctx!.fillStyle = "#ff0000";
        ctx!.fillRect(0, Math.random() * H, W, 1 + Math.random() * 2);
        ctx!.restore();
      }

      frameId = requestAnimationFrame(draw);
    }

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [lines, size]);

  return (
    <main
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerMove}
      onPointerLeave={() => {
        fieldRef.current.active = false;
      }}
      className="relative min-h-screen cursor-crosshair overflow-hidden bg-black text-white"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 px-5 py-4 font-mono text-[10px] font-black tracking-[0.24em] text-white/40">
        <span>PRETEXT INCIDENT FILE / MAZE PROTOCOL</span>
        <span className={collisions >= 2 ? "text-red-400/90" : "text-white/30"}>
          {collisions > 0 ? `⚠ WALL COLLISION ${collisions}/3` : "NAVIGATE THE MAZE"}
        </span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-4 font-mono text-[10px] font-black tracking-[0.18em] text-white/20">
        <span>MOVE THROUGH THE PATH — 3 COLLISIONS RESETS POSITION</span>
      </div>
      {phase === "complete" && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-black font-mono">
          <div className="terminal-noise absolute inset-0 opacity-35" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.14),transparent_50%)]" />
          <p className="relative px-6 text-center text-[clamp(2rem,6vw,5rem)] font-black tracking-[0.34em] text-green-400">
            탈출 성공
          </p>
        </div>
      )}
    </main>
  );
}
