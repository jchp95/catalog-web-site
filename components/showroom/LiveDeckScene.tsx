"use client";

import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";
import { Float, Image as ImagePlane, PresentationControls } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import type { DemoCard } from "@/lib/demos";

type LiveDeckSceneProps = {
  demos: DemoCard[];
  active: number;
  onSelect: (index: number) => void;
};

const CARD_ASPECT = 3 / 2; // matches the source photography crop (drei's Image auto-covers, mirroring the grid cards elsewhere in the catalog)

function Deck({ demos, active, onSelect }: LiveDeckSceneProps) {
  const { viewport } = useThree();
  const height = Math.min(viewport.height * 0.72, 4.4);
  const width = height * CARD_ASPECT;
  const spread = Math.min(viewport.width * 0.32, width * 0.85);

  const layout = useMemo(
    () =>
      demos.map((demo, index) => {
        const offset = index - active;
        const wrapped = ((offset + demos.length / 2 + demos.length) % demos.length) - demos.length / 2;
        return { demo, index, wrapped };
      }),
    [demos, active],
  );

  return (
    <PresentationControls global cursor snap polar={[-0.16, 0.16]} azimuth={[-0.42, 0.42]}>
      <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.35} floatingRange={[-0.06, 0.06]}>
        <group>
          {layout.map(({ demo, index, wrapped }) => {
            const isActive = index === active;
            const depth = Math.abs(wrapped);
            return (
              <group
                key={demo.slug}
                position={[wrapped * spread, isActive ? 0 : -0.12, isActive ? 0.4 : -depth * 0.9]}
                rotation={[0, wrapped * -0.22, 0]}
              >
                <ImagePlane
                  url={demo.image}
                  scale={[width, height]}
                  radius={0.06}
                  transparent
                  opacity={isActive ? 1 : Math.max(0.32, 0.6 - depth * 0.16)}
                  grayscale={isActive ? 0 : 0.35}
                  onClick={(event: ThreeEvent<MouseEvent>) => {
                    event.stopPropagation();
                    onSelect(index);
                  }}
                  onPointerOver={(event: ThreeEvent<PointerEvent>) => {
                    event.stopPropagation();
                    document.body.style.cursor = "pointer";
                  }}
                  onPointerOut={() => {
                    document.body.style.cursor = "auto";
                  }}
                />
              </group>
            );
          })}
        </group>
      </Float>
    </PresentationControls>
  );
}

/** The showroom hero's 3D photo gallery — a drag-to-explore stack of every vertical. */
export default function LiveDeckScene({ demos, active, onSelect }: LiveDeckSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 6.4], fov: 32 }}
      style={{ touchAction: "none" }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} />
      <directionalLight position={[-4, -2, 3]} intensity={0.4} />
      <Suspense fallback={null}>
        <Deck demos={demos} active={active} onSelect={onSelect} />
      </Suspense>
    </Canvas>
  );
}
