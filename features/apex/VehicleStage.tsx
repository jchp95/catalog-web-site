"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { hasWebGL } from "@/lib/webgl";
import { Canvas3DBoundary } from "@/components/ui/Canvas3DBoundary";

const VehicleScene3D = dynamic(() => import("./VehicleScene3D"), { ssr: false });

type VehicleStageProps = { children: ReactNode };

/**
 * Progressive-enhancement wrapper around the vehicle stage: the flat SVG
 * illustration by default, upgraded — once mounted, only with WebGL and
 * without reduced motion — to a draggable 3D photo of the car itself.
 * The illustration stays the fallback for every non-3D visitor.
 */
export function VehicleStage({ children }: VehicleStageProps) {
  const reducedMotion = useReducedMotion();
  const [enable3d, setEnable3d] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setEnable3d(false);
      return;
    }
    setEnable3d(hasWebGL());
  }, [reducedMotion]);

  if (!enable3d) return <>{children}</>;

  return (
    <Canvas3DBoundary fallback={children}>
      <VehicleScene3D />
      <span className="config-stage-hint" aria-hidden="true">Drag to explore</span>
    </Canvas3DBoundary>
  );
}
