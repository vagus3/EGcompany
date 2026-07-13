"use client";

import { OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { BoxGeometry, DoubleSide, EdgesGeometry, type LineBasicMaterial } from "three";

type CubeFace = {
  label: string;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
};

const HOLD_DURATION_MS = 4000;
// 카메라를 회전시키려는 드래그 도중 큐브가 살짝만 돌아가도 레이가 면에서
// 벗어나 홀드가 즉시 취소된다. 화면상에서 이 픽셀 수 이상 실제로 움직였을
// 때만 "드래그로 이탈했다"고 보고 취소한다 — 그래야 홀드 중에도 자유롭게
// 카메라를 돌려볼 수 있다.
const DRAG_CANCEL_THRESHOLD_PX = 8;

const cubeFaces: CubeFace[] = [
  { label: "OBSERVATION", position: [0, 0, 1.01], rotation: [0, 0, 0], color: "#181818" },
  { label: "TRACE", position: [0, 0, -1.01], rotation: [0, Math.PI, 0], color: "#3b0b0b" },
  { label: "KEY", position: [0, 1.01, 0], rotation: [-Math.PI / 2, 0, 0], color: "#151515" },
  { label: "LOCK", position: [0, -1.01, 0], rotation: [Math.PI / 2, 0, 0], color: "#151515" },
  { label: "OPEN", position: [-1.01, 0, 0], rotation: [0, -Math.PI / 2, 0], color: "#101010" },
  { label: "FALSE", position: [1.01, 0, 0], rotation: [0, Math.PI / 2, 0], color: "#101010" },
];

const CORNER_POSITIONS: [number, number, number][] = [
  [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
  [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
];

function CubeWireframe({ active }: { active: boolean }) {
  const coreRef = useRef<LineBasicMaterial>(null);
  const glow1Ref = useRef<LineBasicMaterial>(null);
  const glow2Ref = useRef<LineBasicMaterial>(null);

  const edges = useMemo(() => new EdgesGeometry(new BoxGeometry(2, 2, 2)), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.6);
    const boost = active ? 0.35 : 0;

    if (coreRef.current) coreRef.current.opacity = 0.72 + pulse * 0.25 + boost;
    if (glow1Ref.current) glow1Ref.current.opacity = 0.22 + pulse * 0.14 + boost * 0.5;
    if (glow2Ref.current) glow2Ref.current.opacity = 0.07 + pulse * 0.06;
  });

  const coreColor = active ? "#ff3333" : "#c0392b";
  const glowColor = active ? "#cc0000" : "#7a0000";

  return (
    <>
      {/* 코어 엣지 */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial ref={coreRef} color={coreColor} transparent opacity={0.85} />
      </lineSegments>
      {/* 글로우 레이어 1 */}
      <lineSegments geometry={edges} scale={1.014}>
        <lineBasicMaterial ref={glow1Ref} color={glowColor} transparent opacity={0.3} />
      </lineSegments>
      {/* 글로우 레이어 2 (넓게 퍼짐) */}
      <lineSegments geometry={edges} scale={1.032}>
        <lineBasicMaterial ref={glow2Ref} color={glowColor} transparent opacity={0.1} />
      </lineSegments>
      {/* 코너 마커 */}
      {CORNER_POSITIONS.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.06, 0.06, 0.06]} />
          <meshBasicMaterial color={active ? "#ff4444" : "#cc2222"} />
        </mesh>
      ))}
    </>
  );
}

function CubeFacePanel({
  face,
  active,
  onHoldStart,
  onHoldCancel,
}: {
  face: CubeFace;
  active: boolean;
  onHoldStart: (label: string) => void;
  onHoldCancel: () => void;
}) {
  const holdStartClientPosRef = useRef<{ x: number; y: number } | null>(null);

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    holdStartClientPosRef.current = {
      x: event.nativeEvent.clientX,
      y: event.nativeEvent.clientY,
    };
    onHoldStart(face.label);
  }

  function handlePointerUp(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    holdStartClientPosRef.current = null;
    onHoldCancel();
  }

  function handlePointerLeave(event: ThreeEvent<PointerEvent>) {
    const start = holdStartClientPosRef.current;
    const movedPx = start
      ? Math.hypot(event.nativeEvent.clientX - start.x, event.nativeEvent.clientY - start.y)
      : Infinity;

    if (movedPx < DRAG_CANCEL_THRESHOLD_PX) return;

    holdStartClientPosRef.current = null;
    onHoldCancel();
  }

  return (
    <group position={face.position} rotation={face.rotation}>
      <mesh
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[1.92, 1.92]} />
        <meshStandardMaterial
          color={active ? "#8b0000" : face.color}
          emissive={active ? "#5a0000" : "#0a0202"}
          emissiveIntensity={active ? 0.9 : 0.35}
          roughness={0.55}
          metalness={0.28}
          side={DoubleSide}
        />
      </mesh>
      <Text
        position={[0, 0, 0.03]}
        fontSize={0.27}
        letterSpacing={0.08}
        anchorX="center"
        anchorY="middle"
        color={active ? "#ffffff" : "#e8e0dc"}
        outlineWidth={0.012}
        outlineColor="#000000"
      >
        {face.label}
      </Text>
    </group>
  );
}

export default function CubeChallenge({ onComplete }: { onComplete: (faceLabel: string) => void }) {
  const [heldFace, setHeldFace] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function cancelHold() {
    if (completedRef.current) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    startedAtRef.current = null;
    setHeldFace(null);
    setHoldProgress(0);
  }

  function startHold(label: string) {
    if (completedRef.current) return;
    cancelHold();

    startedAtRef.current = Date.now();
    setHeldFace(label);
    setHoldProgress(0);
    timerRef.current = setInterval(() => {
      if (!startedAtRef.current) return;
      const nextProgress = Math.min((Date.now() - startedAtRef.current) / HOLD_DURATION_MS, 1);
      setHoldProgress(nextProgress);

      if (nextProgress >= 1) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;

        // TRACE 면만 정답으로 인정한다. 다른 면은 100%까지 눌러도 완료되지 않는다.
        // (실제 정답 판정은 서버가 다시 하지만, 어느 면에서든 굳이 서버를 호출할
        // 필요 없이 여기서 먼저 걸러 UX를 그대로 유지한다.)
        if (label === "TRACE") {
          completedRef.current = true;
          onComplete(label);
        }
      }
    }, 80);
  }

  return (
    <section className="border-terminal-border border bg-black/40">
      <div className="grid gap-5 p-5">
        <div className="border-terminal-border h-100 border bg-[#020202]">
          <Canvas camera={{ position: [3.2, 2.7, 4.2], fov: 43 }} gl={{ antialias: true }}>
            <color attach="background" args={["#020202"]} />
            <ambientLight intensity={1.2} />
            <directionalLight position={[4, 5, 4]} intensity={1.8} />
            <pointLight position={[-3, -2, -2]} color="#b00000" intensity={1.4} />
            <group rotation={[0.08, -0.65, 0]}>
              {cubeFaces.map((face) => (
                <CubeFacePanel
                  key={face.label}
                  face={face}
                  active={heldFace === face.label}
                  onHoldStart={startHold}
                  onHoldCancel={cancelHold}
                />
              ))}
              <CubeWireframe active={heldFace !== null} />
            </group>
            <OrbitControls enablePan={false} minDistance={3.2} maxDistance={7} />
          </Canvas>
        </div>

        <aside className="border-terminal-border bg-terminal-panel-deep grid gap-5 border p-5 sm:grid-cols-[1fr_220px] sm:items-center">
          <div>
            <p className="text-terminal-accent-muted font-mono text-xs font-black tracking-[0.32em]">
              INCIDENT_ECHO
            </p>
            <div className="text-terminal-text-muted mt-3 space-y-4 text-sm leading-6">
              <p>
                DIRECTOR E.G.
              </p>
            </div>
          </div>

          <div>
            <div className="text-terminal-text-dim mb-3 flex justify-between font-mono text-xs">
              <span>PROGRESS</span>
              <span>{Math.round(holdProgress * 100)}%</span>
            </div>
            <div className="bg-terminal-border h-3 overflow-hidden">
              <div
                className="bg-terminal-accent-strong h-full transition-[width]"
                style={{ width: `${holdProgress * 100}%` }}
              />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
