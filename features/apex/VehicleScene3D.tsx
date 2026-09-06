"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Image as ImagePlane, PresentationControls } from "@react-three/drei";
import { Suspense } from "react";

/**
 * A drag-to-inspect 3D presentation of the vehicle, built from the same
 * proven textured-plane technique as the showroom's hero gallery (an
 * `Html`-projected SVG was tried first and produced an empty canvas in
 * verification — a real photo on a floating plane is both simpler and
 * confirmed to render).
 */
export default function VehicleScene3D() {
  return (
    <Canvas dpr={[1, 1.6]} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }} camera={{ position: [0, 0, 5.4], fov: 32 }} style={{ touchAction: "none" }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <PresentationControls global cursor snap polar={[-0.28, 0.28]} azimuth={[-0.55, 0.55]}>
        <Float speed={1.1} rotationIntensity={0.22} floatIntensity={0.4} floatingRange={[-0.05, 0.05]}>
          <Suspense fallback={null}>
            <ImagePlane url="/images/apex.webp" scale={[4.6, 3.07]} radius={0.05} transparent />
          </Suspense>
        </Float>
      </PresentationControls>
    </Canvas>
  );
}
