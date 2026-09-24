"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { hasWebGL } from "@/lib/webgl";
import { useMunichReducedMotion } from "../hooks/useMunichReducedMotion";
import { Canvas3DBoundary } from "@/components/ui/Canvas3DBoundary";

const BarruScene3D = dynamic(() => import("../components/three/BarruScene3D"), { ssr: false });

export function Product3DSection() {
  const reduced = useMunichReducedMotion();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setOk(!reduced && hasWebGL());
  }, [reduced]);

  return (
    <section className="munich-3d" data-scene="three" data-tone="dark" id="viewer">
      <div className="munich-3d-copy">
        <span className="munich-kicker">INTERACTIVE</span>
        <h2>
          Take
          <br />
          <em>control.</em>
        </h2>
        <p>Drag to orbit. A dedicated WebGL stage — separate from the scroll sequence.</p>
      </div>
      <div className="munich-3d-stage" data-cursor="drag">
        {ok ? (
          <Canvas3DBoundary
            fallback={<div className="munich-3d-fallback">3D unavailable — use the scroll orbit above.</div>}
          >
            <Suspense fallback={null}>
              <BarruScene3D />
            </Suspense>
          </Canvas3DBoundary>
        ) : (
          <div className="munich-3d-fallback">Drag orbit disabled for this device. Scroll the 360 sequence instead.</div>
        )}
      </div>
    </section>
  );
}
