"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import type { SceneConfig } from "@/types";

interface GameSceneProps {
  config: SceneConfig;
  children?: React.ReactNode;
}

function SceneLights({ config }: { config: SceneConfig }) {
  const { lighting } = config;
  return (
    <>
      <ambientLight color={lighting.ambient.color} intensity={lighting.ambient.intensity} />
      <directionalLight
        color={lighting.directional.color}
        intensity={lighting.directional.intensity}
        position={lighting.directional.position}
        castShadow
      />
    </>
  );
}

export default function GameScene({ config, children }: GameSceneProps) {
  return (
    <Canvas
      shadows
      className="w-full h-full"
      gl={{ antialias: true }}
    >
      <PerspectiveCamera
        makeDefault
        position={config.camera.position}
        fov={config.camera.fov}
      />
      <color attach="background" args={[config.background]} />
      <SceneLights config={config} />
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} />
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  );
}
