"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion, type MotionValue } from "motion/react";
import { hasWebGL } from "@/lib/webgl";
import { Canvas3DBoundary } from "@/components/ui/Canvas3DBoundary";

const ProductScene3D = dynamic(() => import("./ProductScene3D"), { ssr: false });

type ProductStageProps = {
  progress: MotionValue<number>;
};

/**
 * Progressive enhancement: static silhouette by default, real-time GLB
 * when WebGL is available and the visitor has not requested reduced motion.
 */
export function ProductStage({ progress }: ProductStageProps) {
  const reducedMotion = useReducedMotion();
  const [enable3d, setEnable3d] = useState(false);
  const [fallbackAngle, setFallbackAngle] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setEnable3d(false);
      return;
    }
    setEnable3d(hasWebGL());
  }, [reducedMotion]);

  useEffect(() => {
    if (enable3d) return;
    return progress.on("change", (v) => setFallbackAngle(v * 360));
  }, [enable3d, progress]);

  const fallback = (
    <div className="pulso-fallback" aria-hidden="true">
      <div className="pulso-fallback-shoe" style={{ transform: `rotate(${fallbackAngle}deg)` }} />
      <p>Scroll to turn</p>
    </div>
  );

  if (!enable3d) return fallback;

  return (
    <Canvas3DBoundary fallback={fallback}>
      <ProductScene3D progress={progress} />
    </Canvas3DBoundary>
  );
}
