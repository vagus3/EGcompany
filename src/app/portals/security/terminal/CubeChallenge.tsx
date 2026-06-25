"use client";

import { OrbitControls, Text } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { DoubleSide } from "three";

type CubeFace = {
  label: string;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
};

const HOLD_DURATION_MS = 4000;

const cubeFaces: CubeFace[] = [
  { label: "OBSERVE", position: [0, 0, 1.01], rotation: [0, 0, 0], color: "#181818" },
  { label: "TRACE", position: [0, 0, -1.01], rotation: [0, Math.PI, 0], color: "#3b0b0b" },
  { label: "KEY", position: [0, 1.01, 0], rotation: [-Math.PI / 2, 0, 0], color: "#151515" },
  { label: "LOCK", position: [0, -1.01, 0], rotation: [Math.PI / 2, 0, 0], color: "#151515" },
  { label: "OPEN", position: [-1.01, 0, 0], rotation: [0, -Math.PI / 2, 0], color: "#101010" },
  { label: "FALSE", position: [1.01, 0, 0], rotation: [0, Math.PI / 2, 0], color: "#101010" },
];

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
  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    onHoldStart(face.label);
  }

  function handlePointerUp(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    onHoldCancel();
  }

  return (
    <group position={face.position} rotation={face.rotation}>
      <mesh
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={onHoldCancel}
      >
        <planeGeometry args={[1.92, 1.92]} />
        <meshStandardMaterial
          color={active ? "#8b0000" : face.color}
          emissive={active ? "#5a0000" : "#050505"}
          emissiveIntensity={active ? 0.7 : 0.2}
          roughness={0.82}
          metalness={0.08}
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

export default function CubeChallenge({ onComplete }: { onComplete: () => void }) {
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

    if (label !== "TRACE") {
      setHeldFace(label);
      window.setTimeout(() => {
        setHeldFace((current) => (current === label ? null : current));
      }, 360);
      return;
    }

    startedAtRef.current = Date.now();
    setHeldFace(label);
    setHoldProgress(0);
    timerRef.current = setInterval(() => {
      if (!startedAtRef.current) return;
      const nextProgress = Math.min((Date.now() - startedAtRef.current) / HOLD_DURATION_MS, 1);
      setHoldProgress(nextProgress);

      if (nextProgress >= 1) {
        completedRef.current = true;
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        onComplete();
      }
    }, 80);
  }

  return (
    <section className="border-terminal-border border bg-black/40">
      <div className="grid gap-5 p-5 lg:grid-cols-[1fr_230px]">
        <div className="border-terminal-border h-[360px] min-h-[320px] border bg-[#020202] sm:h-[430px]">
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
            </group>
            <OrbitControls enablePan={false} minDistance={3.2} maxDistance={7} />
          </Canvas>
        </div>

        <aside className="border-terminal-border bg-terminal-panel-deep flex flex-col justify-between gap-6 border p-5">
          <div>
            <p className="text-terminal-accent-muted font-mono text-xs font-black tracking-[0.32em]">
              INCIDENT_ECHO
            </p>
            <div className="text-terminal-text-muted mt-5 space-y-4 text-sm leading-6">
              <p>
                격리 실패 직후 회수된 기록 장치에서 정육면체 형태의 시각 신호가 반복적으로 출력되고
                있습니다.
              </p>
              <p>
                각 면은 서로 다른 접근 로그를 보관하고 있으며, 하나의 면이 활성화되는 동안 시스템
                추적 신호가 안정화됩니다.
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
