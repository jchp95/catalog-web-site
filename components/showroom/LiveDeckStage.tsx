"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { hasWebGL } from "@/lib/webgl";
import { Canvas3DBoundary } from "@/components/ui/Canvas3DBoundary";
import type { DemoCard } from "@/lib/demos";

const LiveDeckScene = dynamic(() => import("./LiveDeckScene"), { ssr: false });

type LiveDeckStageProps = {
  demos: DemoCard[];
  active: number;
  onSelect: (index: number) => void;
  reducedMotion: boolean;
};

function StaticPhoto({ demo }: { demo: DemoCard }) {
  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div key={demo.slug} className="deck-photo-frame" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
        <Image src={demo.image} alt={demo.imageAlt} fill sizes="(max-width: 760px) 100vw, 58vw" priority={demo.slug === "mireya"} className="deck-photo" />
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Progressive-enhancement stage for the showroom's hero: an ordinary
 * cross-fading photo by default, upgraded — once mounted, only when WebGL
 * is available and the visitor has not asked for reduced motion — to a
 * real-time 3D gallery of every vertical. The upgrade never gates content:
 * the same photo, the same click target, just a richer presentation.
 */
export function LiveDeckStage({ demos, active, onSelect, reducedMotion }: LiveDeckStageProps) {
  const [enable3d, setEnable3d] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setEnable3d(false);
      return;
    }
    setEnable3d(hasWebGL());
  }, [reducedMotion]);

  if (!enable3d) return <StaticPhoto demo={demos[active]} />;

  return (
    <Canvas3DBoundary fallback={<StaticPhoto demo={demos[active]} />}>
      <LiveDeckScene demos={demos} active={active} onSelect={onSelect} />
    </Canvas3DBoundary>
  );
}
