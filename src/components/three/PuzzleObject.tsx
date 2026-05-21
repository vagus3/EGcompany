"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { gsap } from "gsap";
import type { PuzzleWithConfig } from "@/types";
import { useGameStore } from "@/store/gameStore";

interface PuzzleObjectProps {
  puzzle: PuzzleWithConfig;
  solved: boolean;
}

export default function PuzzleObject({ puzzle, solved }: PuzzleObjectProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const setCurrentPuzzle = useGameStore((s) => s.setCurrentPuzzle);
  const { position, rotation, scale, color } = puzzle.objectConfig;

  // 미해결 퍼즐: 부유 회전 애니메이션
  useFrame((_, delta) => {
    if (!meshRef.current || solved) return;
    meshRef.current.rotation.y += delta * 0.5;
  });

  function handleClick() {
    if (solved || !meshRef.current) return;
    // GSAP으로 클릭 피드백 애니메이션
    gsap.to(meshRef.current.scale, {
      x: 1.3,
      y: 1.3,
      z: 1.3,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
    });
    setCurrentPuzzle(puzzle);
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={hovered && !solved ? [scale[0] * 1.1, scale[1] * 1.1, scale[2] * 1.1] : scale}
      onClick={handleClick}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      castShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={solved ? "#22c55e" : hovered ? "#60a5fa" : (color ?? "#6366f1")}
        emissive={solved ? "#166534" : hovered ? "#1d4ed8" : "#000000"}
        emissiveIntensity={0.2}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}
