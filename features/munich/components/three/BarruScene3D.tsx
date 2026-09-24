"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { ASSETS } from "../../config/assets";

function GlbModel() {
  const { scene } = useGLTF(ASSETS.PRODUCT_MODEL);
  return (
    <group scale={1.4} position={[0, -0.2, 0]}>
      <primitive object={scene.clone(true)} />
    </group>
  );
}

function ProxyShoe() {
  return (
    <group rotation={[0.15, -0.55, 0]} position={[0, -0.1, 0]}>
      <mesh position={[0.15, 0.05, 0]}>
        <boxGeometry args={[1.6, 0.45, 0.55]} />
        <meshStandardMaterial color="#C9A227" roughness={0.72} />
      </mesh>
      <mesh position={[-0.7, 0.08, 0]}>
        <boxGeometry args={[0.35, 0.55, 0.58]} />
        <meshStandardMaterial color="#1A2F4A" roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[1.75, 0.12, 0.62]} />
        <meshStandardMaterial color="#6F5336" roughness={0.9} />
      </mesh>
    </group>
  );
}

function SceneBody({ useGlb }: { useGlb: boolean }) {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 5, 3]} intensity={1.45} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#8fa8c8" />
      <Suspense fallback={<ProxyShoe />}>
        <Environment preset="warehouse" environmentIntensity={0.22} />
        {useGlb ? <GlbModel /> : <ProxyShoe />}
        <ContactShadows position={[0, -0.45, 0]} opacity={0.45} scale={8} blur={2.4} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={2.8}
        maxDistance={5.5}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.7}
        autoRotate
        autoRotateSpeed={0.35}
        enableDamping
        dampingFactor={0.06}
      />
    </>
  );
}

export default function BarruScene3D() {
  const [useGlb, setUseGlb] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(ASSETS.PRODUCT_MODEL, { method: "HEAD" })
      .then((r) => {
        if (alive && r.ok) {
          setUseGlb(true);
          useGLTF.preload(ASSETS.PRODUCT_MODEL);
        }
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.4, 4.2], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: "none" }}
    >
      <color attach="background" args={["#0B0B0C"]} />
      <SceneBody useGlb={useGlb} />
    </Canvas>
  );
}
