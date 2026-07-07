"use client";

import { layoutWithLines, prepareWithSegments } from "@chenglou/pretext";
import { useEffect, useMemo, useRef, useState } from "react";
import { PRETEXT_LETTER_POSITIONS_STORAGE_KEY } from "@/lib/terminal-data";

// ── 상수 ────────────────────────────────────────────────────────────────────
const GARBLED_POOL = Array.from(
  "★▲△▼◆◇□■│─┤┬├┴┼╔╗╚╝╠╣╦╩╬▓░▒＄＆％＃＠！Ψψ∂∫∑⌀⌂⌬뷁뭵뺑뽥뿡쀄쁭웳쀘뻥뻘뺙뼁뽁"
);

const PATH_TEXT =
  "BREACH SIGNAL DETECTED IN SECTOR 7G THE PASSAGE IS NARROW DO NOT STOP MOVING " +
  "THE ENTITY DOES NOT HAVE EYES IT NAVIGATES BY THE SOUND OF BREATHING " +
  "EXIT PROTOCOL ENGAGED RETURN CHANNEL OPEN FOLLOW THE DISPLACEMENT " +
  "언어가 무너지고 있습니다 텍스트는 당신을 통해 흐릅니다 " +
  "THE ARCHIVE CANNOT HOLD THIS FILE THE LETTERS KNOW YOU ARE HERE " +
  "DO NOT LOOK BACK THE EXIT IS WATCHING YOU REACH IT BEFORE IT REACHES YOU " +
  "SECTOR BREACH CONFIRMED OPERATOR FIELD DETECTED PROCEED TO RETURN CHANNEL ";


const DEFAULT_POSITIONS = [
  { letter: "S", top: "29%", left: "16%" },
  { letter: "T", top: "54%", left: "71%" },
  { letter: "O", top: "74%", left: "42%" },
  { letter: "P", top: "21%", left: "82%" },
];

type LetterPos = { letter: string; top: string; left: string };

function generateRandomPositions(): LetterPos[] {
  return DEFAULT_POSITIONS.map((h) => ({
    letter: h.letter,
    top:  `${15 + Math.random() * 65}%`,
    left: `${5  + Math.random() * 82}%`,
  }));
}

function loadPositions(): LetterPos[] {
  if (typeof window === "undefined") return DEFAULT_POSITIONS;
  try {
    const stored = window.sessionStorage.getItem(PRETEXT_LETTER_POSITIONS_STORAGE_KEY);
    if (stored) {
      window.sessionStorage.removeItem(PRETEXT_LETTER_POSITIONS_STORAGE_KEY);
      return JSON.parse(stored) as LetterPos[];
    }
  } catch {}
  return DEFAULT_POSITIONS;
}

// ── pretext drawLine ─────────────────────────────────────────────────────────
type TextLine = { text: string; x: number; y: number };
type Field    = { active: boolean; x: number; y: number; targetX: number; targetY: number };

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
  if (force <= 0.03) { ctx.fillText(line.text, line.x, line.y); return; }
  const gap      = radius * (0.28 + force * 0.82);
  const gapStart = field.x - gap;
  const gapEnd   = field.x + gap;
  const leftIdx  = getIndexForWidth(ctx, line.text, gapStart - line.x);
  const rightIdx = getIndexForWidth(ctx, line.text, gapEnd   - line.x);
  const leftText  = line.text.slice(0, leftIdx);
  const rightText = line.text.slice(rightIdx);
  const wave = Math.sin(time * 0.004 + line.y * 0.05) * (force * 8);
  const skew = Math.cos(time * 0.003 + line.y * 0.03) * force * 0.06;
  ctx.save();
  ctx.globalAlpha = 0.55 + force * 0.3;
  ctx.transform(1, skew, 0, 1, 0, 0);
  ctx.fillText(leftText,  line.x - force * 38, line.y - wave);
  ctx.fillText(rightText, gapEnd  + force * 38, line.y + wave);
  ctx.restore();
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function PretextEndingChallenge({ onComplete }: { onComplete: () => void }) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRef     = useRef<Field>({ active: false, x: 0, y: 0, targetX: 0, targetY: 0 });
  const frameRef     = useRef(0);
  const completedRef = useRef(false);
  const charPhaseRef = useRef<number[]>([]);

  // 컴포넌트 마운트 시 sessionStorage에서 위치 로드 (새로고침 후 랜덤 위치 적용)
  const [positions] = useState<LetterPos[]>(() => loadPositions());
  const [foundCount, setFoundCount] = useState(0);
  const [size, setSize] = useState({ width: 1280, height: 720 });
  const [fakeChars, setFakeChars] = useState<string[]>(positions.map(() => "★"));

  // 화면 크기 감지
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => {
      if (!e) return;
      setSize({ width: Math.max(360, e.contentRect.width), height: Math.max(300, e.contentRect.height) });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // 가짜 글자 교체
  useEffect(() => {
    const id = setInterval(() => {
      setFakeChars(positions.map(() => GARBLED_POOL[Math.floor(Math.random() * GARBLED_POOL.length)]));
    }, 200);
    return () => clearInterval(id);
  }, [positions]);

  // pretext 텍스트 레이아웃
  const lines = useMemo<TextLine[]>(() => {
    if (typeof window === "undefined") return [];
    const fontSize   = size.width < 760 ? 13 : 16;
    const lineHeight = size.width < 760 ? 26 : 32;
    const repeated   = PATH_TEXT.repeat(20);
    const prepared   = prepareWithSegments(
      repeated,
      `500 ${fontSize}px "Geist Mono", monospace`,
      { wordBreak: "keep-all" }
    );
    const layout = layoutWithLines(prepared, size.width, lineHeight);
    const total  = Math.ceil(size.height / lineHeight) + 2;
    return layout.lines.slice(0, total).map((line, i) => ({
      text: line.text.trimEnd(),
      x: 0,
      y: lineHeight / 2 + i * lineHeight,
    }));
  }, [size.width, size.height]);

  // 캔버스 렌더링
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId = 0;
    let prevTime = performance.now();
    const CELL_SIZE = 18;

    function draw(now: number) {
      const dt = Math.min(0.05, (now - prevTime) / 1000);
      prevTime = now;

      const W   = size.width;
      const H   = size.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas!.width  !== Math.floor(W * dpr)) canvas!.width  = Math.floor(W * dpr);
      if (canvas!.height !== Math.floor(H * dpr)) canvas!.height = Math.floor(H * dpr);
      canvas!.style.width  = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const field = fieldRef.current;
      field.x += (field.targetX - field.x) * Math.min(1, dt * 10);
      field.y += (field.targetY - field.y) * Math.min(1, dt * 10);

      ctx!.fillStyle = "#030303";
      ctx!.fillRect(0, 0, W, H);

      // 레이어 1: 특수문자 그리드
      const cols = Math.ceil(W / CELL_SIZE) + 1;
      const rows = Math.ceil(H / CELL_SIZE) + 1;
      const totalCells = rows * cols;
      if (charPhaseRef.current.length !== totalCells) {
        charPhaseRef.current = Array.from({ length: totalCells }, (_, i) => i * 0.41 % GARBLED_POOL.length);
      }
      const phases = charPhaseRef.current;

      ctx!.textAlign    = "center";
      ctx!.textBaseline = "middle";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = c * CELL_SIZE + CELL_SIZE / 2;
          const cy = r * CELL_SIZE + CELL_SIZE / 2;
          const idx = r * cols + c;

          phases[idx] = (phases[idx] + dt * (1.7 + Math.sin(now * 0.001 + c * 0.9 + r * 1.3) * 1.0)) % GARBLED_POOL.length;
          const char  = GARBLED_POOL[Math.floor(phases[idx])];

          const distM = Math.hypot(field.x - cx, field.y - cy);
          const prox  = Math.max(0, 1 - distM / (CELL_SIZE * 6));
          const flicker = 0.55 + 0.2 * Math.sin(now * 0.005 + c * 0.7 + r * 1.1);

          ctx!.globalAlpha = 0.65 + prox * 0.3 + flicker * 0.04;
          ctx!.fillStyle   = `rgb(${Math.floor(85 + prox * 105)},${Math.floor(18 + prox * 14)},${Math.floor(22 + prox * 12)})`;
          ctx!.font        = `bold ${CELL_SIZE - 4}px "Geist Mono", monospace`;
          ctx!.fillText(char, cx, cy);
          ctx!.globalAlpha = 1;
        }
      }

      // 레이어 2: PATH_TEXT pretext 어보이던스
      const fontSize = W < 760 ? 13 : 16;
      const radius   = Math.max(90, Math.min(180, W * 0.12));
      ctx!.font         = `500 ${fontSize}px "Geist Mono", monospace`;
      ctx!.textAlign    = "left";
      ctx!.textBaseline = "middle";
      ctx!.fillStyle    = "rgba(210,192,188,0.18)";
      lines.forEach((line) => drawLine(ctx!, line, field, radius, now));

      frameId = requestAnimationFrame(draw);
      frameRef.current = frameId;
    }

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [lines, size]);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    fieldRef.current.active  = true;
    fieldRef.current.targetX = e.clientX - rect.left;
    fieldRef.current.targetY = e.clientY - rect.top;
  }

  function handlePointerLeave() {
    fieldRef.current.active = false;
  }

  function handleLetterClick(idx: number) {
    if (completedRef.current) return;

    // 올바른 순서가 아닌 글자를 클릭하면 위치를 랜덤으로 바꾸고 새로고침
    if (idx !== foundCount) {
      const newPositions = generateRandomPositions();
      try {
        window.sessionStorage.setItem(PRETEXT_LETTER_POSITIONS_STORAGE_KEY, JSON.stringify(newPositions));
      } catch {}
      window.location.reload();
      return;
    }

    setFoundCount((prev) => {
      const next = prev + 1;
      if (next >= 4) {
        completedRef.current = true;
        setTimeout(() => onComplete(), 900);
      }
      return next;
    });
  }

  return (
    <main
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative min-h-screen cursor-crosshair overflow-hidden bg-black text-white"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* 숨겨진 글자 스팬 — 호버 시 실제 글자 표시, 클릭으로 순서 확인 */}
      {positions.map((h, i) => {
        const isFound = i < foundCount;
        return (
          <span
            key={h.letter}
            onClick={() => handleLetterClick(i)}
            style={{
              position:   "absolute",
              top:        h.top,
              left:       h.left,
              fontSize:   "32px",
              fontFamily: '"Geist Mono", monospace',
              fontWeight: "bold",
              lineHeight: 1,
              cursor:     "crosshair",
              userSelect: "none",
              color: isFound ? "rgba(60,0,0,0.5)" : "rgba(130,20,20,0.8)",
              transition: "color 0.1s",
            }}
            className="group"
          >
            <span className="group-hover:hidden">{isFound ? h.letter : fakeChars[i]}</span>
            <span
              className="hidden group-hover:inline"
              style={{ color: "#ff2020", fontWeight: 900, fontSize: "40px" }}
            >
              {h.letter}
            </span>
          </span>
        );
      })}

      {/* 하단 가이드 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-4 font-mono text-[10px] font-black tracking-[0.18em] text-white/20">
        <span>FIND THE HIDDEN SEQUENCE — CLICK TO CONFIRM</span>
      </div>
    </main>
  );
}
