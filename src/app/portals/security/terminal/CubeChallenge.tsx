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
    <section className="border border-terminal-border bg-black/40">
      <div className="grid gap-5 p-5 lg:grid-cols-[1fr_230px]">
        <div className="h-[360px] min-h-[320px] border border-terminal-border bg-[#020202] sm:h-[430px]">
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

        <aside className="flex flex-col justify-between gap-5 border border-terminal-border bg-terminal-panel-deep p-5 font-mono">
          <div>
            <p className="text-xs font-black tracking-[0.32em] text-terminal-accent-muted">
              CUBE_PROTOCOL
            </p>
            <h4 className="mt-4 text-xl font-black text-terminal-text">반대면을 유지하십시오</h4>
            <p className="mt-4 text-sm leading-6 text-terminal-text-muted">
              진실은 관찰의 반대편에 있습니다. 큐브를 회전해 OBSERVE의 반대면을 찾고 4초간
              누르고 있으십시오.
            </p>
          </div>

          <div>
            <div className="mb-3 flex justify-between text-xs text-terminal-text-dim">
              <span>TRACE HOLD</span>
              <span>{Math.round(holdProgress * 100)}%</span>
            </div>
            <div className="h-3 overflow-hidden bg-terminal-border">
              <div
                className="h-full bg-terminal-accent-strong transition-[width]"
                style={{ width: `${holdProgress * 100}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-terminal-text-dim">
              {heldFace && heldFace !== "TRACE"
                ? `${heldFace}는 반대면이 아닙니다.`
                : "포인터를 떼면 진행률이 초기화됩니다."}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
