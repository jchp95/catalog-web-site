"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import type { Group } from "three";
import * as THREE from "three";

type ProductScene3DProps = {
  progress: MotionValue<number>;
};

const MODEL_URL = "/models/pulso-sneaker.glb";

function Sneaker({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  useFrame(() => {
    if (!group.current) return;
    const t = progress.get();
    group.current.rotation.y = t * Math.PI * 2;
    group.current.rotation.x = Math.sin(t * Math.PI * 2) * 0.06;
  });

  return (
    <group ref={group} position={[0.85, -0.2, 0]} scale={1.55}>
      <primitive object={scene.clone(true)} />
    </group>
  );
}

function LoadingMark() {
  return (
    <mesh position={[0.8, 0.2, 0]}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial color="#c9a227" />
    </mesh>
  );
}

export default function ProductScene3D({ progress }: ProductScene3DProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: true }}
      camera={{ position: [0, 0.4, 5], fov: 32 }}
      style={{ touchAction: "pan-y" }}
    >
      <color attach="background" args={["#ece7dc"]} />
      <ambientLight intensity={1} />
      <directionalLight position={[5, 8, 6]} intensity={1.8} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#9eb6d4" />
      <Suspense fallback={<LoadingMark />}>
        <Sneaker progress={progress} />
        <ContactShadows
          position={[0.5, -0.22, 0]}
          opacity={0.35}
          scale={12}
          blur={2.4}
          far={5}
          color="#1a1814"
        />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
