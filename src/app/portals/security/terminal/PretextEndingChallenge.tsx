"use client";

import { layoutWithLines, prepareWithSegments } from "@chenglou/pretext";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PRETEXT_LETTER_POSITIONS_STORAGE_KEY } from "@/lib/terminal-data";
import { playSound } from "@/lib/sound";

// ── 상수 ────────────────────────────────────────────────────────────────────
const GARBLED_POOL = Array.from(
  "★▲△▼◆◇□■│─┤┬├┴┼╔╗╚╝╠╣╦╩╬▓░▒＄＆％＃＠！Ψψ∂∫∑⌀⌂⌬¤†‡•※¬±×÷∞∆∇√≈≠"
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

// sessionStorage 읽기 + 소비(삭제)는 부수효과가 있어 useState의 lazy initializer로 쓰면 안 된다.
// initializer는 SSR(서버, window 없음 → 항상 DEFAULT_POSITIONS)과 클라이언트에서 반환값이
// 달라 하이드레이션 불일치를 유발하고, React가 불일치를 복구하며 initializer를 다시 호출하면
// 이미 삭제된 sessionStorage를 만나 항상 DEFAULT_POSITIONS로 되돌아가는 문제가 있었다.
// 그래서 초기 렌더는 서버/클라이언트 동일하게 DEFAULT_POSITIONS로 시작하고, 마운트 후
// useEffect에서 한 번만 sessionStorage를 읽어 실제 위치로 교체한다.
function readStoredPositions(): LetterPos[] | null {
  try {
    const stored = window.sessionStorage.getItem(PRETEXT_LETTER_POSITIONS_STORAGE_KEY);
    if (!stored) return null;
    window.sessionStorage.removeItem(PRETEXT_LETTER_POSITIONS_STORAGE_KEY);
    return JSON.parse(stored) as LetterPos[];
  } catch {
    return null;
  }
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
export default function PretextEndingChallenge({
  onComplete,
}: {
  onComplete: (letters: string[]) => void;
}) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRef     = useRef<Field>({ active: false, x: 0, y: 0, targetX: 0, targetY: 0 });
  const frameRef     = useRef(0);
  const completedRef = useRef(false);
  const charPhaseRef = useRef<number[]>([]);
  const positionsHydratedRef = useRef(false);
  const failTimerRef = useRef<number | null>(null);
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);

  const [positions, setPositions] = useState<LetterPos[]>(DEFAULT_POSITIONS);
  const [foundCount, setFoundCount] = useState(0);
  const [size, setSize] = useState({ width: 1280, height: 720 });
  const [fakeChars, setFakeChars] = useState<string[]>(positions.map(() => "★"));
  const [showFailVideo, setShowFailVideo] = useState(false);
  // 포인터(마우스/손가락)가 지금 가까이 있어서 실체가 드러난 글자의 인덱스.
  // CSS :hover 로는 안 되는 이유: 터치는 pointerdown한 요소에 암시적 포인터 캡처가
  // 걸려 드래그 중 손가락 아래 요소의 hover 상태가 갱신되지 않는다. 그래서 모바일에서는
  // 글자가 영영 드러나지 않았다. 포인터 좌표와 글자 중심의 거리를 직접 계산해 공개한다.
  const [revealedIdx, setRevealedIdx] = useState<number | null>(null);

  // 페이지 진입(혹은 오답 클릭으로 인한 새로고침) 후 20초 동안 못 풀면 fail 영상을
  // 순간적으로 띄운다. 이후에는 30초마다 반복해서 다시 보여준다.
  useEffect(() => {
    failTimerRef.current = window.setTimeout(() => {
      if (completedRef.current) return;
      setShowFailVideo(true);
    }, 20000);

    return () => {
      if (failTimerRef.current) window.clearTimeout(failTimerRef.current);
    };
  }, []);

  function handleFailVideoEnded() {
    setShowFailVideo(false);
    if (completedRef.current) return;
    failTimerRef.current = window.setTimeout(() => {
      if (completedRef.current) return;
      setShowFailVideo(true);
    }, 30000);
  }

  // 워치독: autoplay 차단 등으로 영상이 ended도 error도 못 내는 경우, 영상 길이보다
  // 넉넉한 시간이 지나면 강제로 닫고 다음 재생을 예약한다(위 onEnded와 동일 흐름).
  useEffect(() => {
    if (!showFailVideo) return;
    const watchdog = window.setTimeout(() => {
      setShowFailVideo(false);
      if (completedRef.current) return;
      failTimerRef.current = window.setTimeout(() => {
        if (completedRef.current) return;
        setShowFailVideo(true);
      }, 30000);
    }, 15000);
    return () => window.clearTimeout(watchdog);
  }, [showFailVideo]);

  // 새로고침(오답 클릭) 이후 랜덤 위치가 sessionStorage에 있으면 마운트 후 1회만 적용
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (positionsHydratedRef.current) return;
      positionsHydratedRef.current = true;
      const stored = readStoredPositions();
      if (stored) setPositions(stored);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // 화면 표시되는 동안 배경음 무한 재생
  useEffect(() => {
    const audio = playSound("/pretext_sound.mp3", { loop: true });
    return () => {
      audio?.pause();
    };
  }, []);

  // 화면 크기 감지
  // useEffect(브라우저가 이미 한 번 그린 뒤 실행)를 쓰면, 초기값(1280x720, 데스크탑
  // 기준)으로 그려진 화면이 실제 모바일 폭으로 보정되기 전까지 잠깐 그대로
  // 페인트된다. 데스크탑은 1280이 실제 화면과 비슷해 눈에 안 띄지만, 모바일은
  // 차이가 커서 글자가 화면 밖에 그려진 채로 순간 노출된다. useLayoutEffect로
  // 브라우저 페인트 전에 크기를 먼저 측정해 보정한다.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setSize({ width: Math.max(360, rect.width), height: Math.max(300, rect.height) });
    }

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

  // 이 거리(px) 안으로 포인터가 접근하면 가짜 문자 대신 실제 글자를 보여준다.
  const REVEAL_RADIUS_PX = 48;
  // 글자 스팬은 32x32px, style.top/left는 스팬의 좌상단 기준이므로 중심은 +16px.
  const LETTER_HALF_PX = 16;

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    fieldRef.current.active  = true;
    fieldRef.current.targetX = px;
    fieldRef.current.targetY = py;

    let nearest: number | null = null;
    let best = REVEAL_RADIUS_PX;
    for (let i = 0; i < positions.length; i++) {
      const cx = (parseFloat(positions[i].left) / 100) * rect.width + LETTER_HALF_PX;
      const cy = (parseFloat(positions[i].top) / 100) * rect.height + LETTER_HALF_PX;
      const d = Math.hypot(px - cx, py - cy);
      if (d < best) {
        best = d;
        nearest = i;
      }
    }
    setRevealedIdx(nearest);
  }

  function handlePointerLeave(e: React.PointerEvent<HTMLDivElement>) {
    fieldRef.current.active = false;
    // 터치는 손가락을 떼는 순간 pointerleave가 함께 오므로, 여기서 공개 상태를 지우면
    // 방금 드래그로 찾은 글자가 탭하기도 전에 다시 숨어버린다. 마우스가 화면을
    // 벗어난 경우에만 숨긴다.
    if (e.pointerType !== "touch") setRevealedIdx(null);
  }

  // 모바일은 호버가 없어 "글자를 찾으려 화면을 훑는 드래그"와 "글자를 선택하는 탭"이
  // 물리적으로 같은 터치 동작이 된다. 누른 지점을 기록해뒀다가, 뗀 지점이 그로부터
  // 이 값 이상 떨어져 있으면(=훑어보다가 우연히 글자 위에서 손을 뗀 것) 선택으로
  // 치지 않는다. 거의 제자리에서 눌렀다 뗐을 때만 의도적 탭/클릭으로 인정한다.
  const TAP_MOVE_THRESHOLD_PX = 14;

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    handlePointerMove(e);
  }

  function handleLetterClick(idx: number, event: React.MouseEvent) {
    if (completedRef.current) return;

    const start = pointerDownPosRef.current;
    const movedPx = start ? Math.hypot(event.clientX - start.x, event.clientY - start.y) : 0;
    if (movedPx > TAP_MOVE_THRESHOLD_PX) return;

    // 이미 찾은 글자를 다시 클릭한 경우는 무시한다(오답으로 취급해 새로고침하면 안 됨)
    if (idx < foundCount) return;

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
        if (failTimerRef.current) window.clearTimeout(failTimerRef.current);
        const letters = positions.map((p) => p.letter);
        setTimeout(() => onComplete(letters), 900);
      }
      return next;
    });
  }

  return (
    <main
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="touch-none relative min-h-screen cursor-crosshair overflow-hidden bg-black text-white"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* 숨겨진 글자 스팬 — 포인터가 가까이 오면 실제 글자 표시, 클릭/탭으로 순서 확인 */}
      {positions.map((h, i) => {
        const isFound = i < foundCount;
        // 찾은 글자는 계속 밝게 유지, 못 찾은 글자는 포인터가 근접한 동안만 실체 공개
        const isRevealed = isFound || revealedIdx === i;
        return (
          <span
            key={h.letter}
            onClick={(event) => handleLetterClick(i, event)}
            style={{
              position:   "absolute",
              top:        h.top,
              left:       h.left,
              width:      "32px",
              height:     "32px",
              display:    "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize:   "24px",
              fontFamily: '"Geist Mono", monospace',
              fontWeight: "bold",
              lineHeight: 1,
              cursor:     isFound ? "default" : "crosshair",
              userSelect: "none",
              color: "rgba(95,20,24,0.75)",
              transition: "color 0.1s",
            }}
          >
            {isRevealed ? (
              <span style={{ color: "#ff2020", fontWeight: 900, fontSize: "40px" }}>{h.letter}</span>
            ) : (
              <span>{fakeChars[i]}</span>
            )}
          </span>
        );
      })}

      {/* 하단 가이드 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-4 font-mono text-[10px] font-black tracking-[0.18em] text-white/20">
        <span>FIND THE HIDDEN SEQUENCE — CLICK TO CONFIRM</span>
      </div>

      {/* 20초(이후 30초마다 반복) 미해결 시 화면을 꽉 채우는 fail 영상.
          pointer-events-none 필수: 모바일에서 autoplay가 차단되면(iOS 저전력 모드 등)
          ended가 영영 오지 않는데, 이때 이 오버레이가 입력을 가로채면 보이지 않는
          전면 차단막이 되어 게임 전체가 멈춘 것처럼 보인다. 시각 효과일 뿐이므로
          입력은 항상 아래 게임 화면으로 통과시킨다. */}
      {showFailVideo && (
        <video
          src="/pretext_fail.mp4"
          autoPlay
          muted
          playsInline
          className="pointer-events-none fixed inset-0 z-50 h-full w-full object-cover"
          onEnded={handleFailVideoEnded}
          onError={handleFailVideoEnded}
        />
      )}
    </main>
  );
}
