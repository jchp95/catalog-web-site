"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Props = {
  /** Fire once when content should start mounting under the loader (mid-fill). */
  onWarm?: () => void;
  /** Fire when the fill completes and the reveal/exit starts. */
  onReveal: () => void;
  /** Fire when the exit wipe is fully done and the loader can unmount. */
  onDone: () => void;
};

/**
 * Brand fill → soft wipe. Warms page content underneath so the handoff
 * never flashes an empty shell.
 */
export function Preloader({ onWarm, onReveal, onDone }: Props) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"enter" | "fill" | "exit">("enter");

  useEffect(() => {
    let raf = 0;
    let doneTimer = 0;
    let warmFired = false;
    let revealFired = false;
    let finished = false;
    const start = performance.now();
    const enterMs = 420;
    const fillMs = 1600;
    const exitMs = 1100;

    const finish = () => {
      if (finished) return;
      finished = true;
      setProgress(100);
      if (!revealFired) {
        revealFired = true;
        onReveal();
      }
      setPhase("exit");
      doneTimer = window.setTimeout(onDone, exitMs);
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < enterMs) {
        setPhase("enter");
        raf = requestAnimationFrame(tick);
        return;
      }
      const fillT = Math.min(1, (elapsed - enterMs) / fillMs);
      const eased = 1 - Math.pow(1 - fillT, 3);
      const pct = Math.round(eased * 100);
      setProgress(pct);
      setPhase("fill");
      if (!warmFired && pct >= 28) {
        warmFired = true;
        onWarm?.();
      }
      if (fillT < 1) raf = requestAnimationFrame(tick);
      else finish();
    };

    raf = requestAnimationFrame(tick);
    const hard = window.setTimeout(finish, enterMs + fillMs + 500);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(doneTimer);
      window.clearTimeout(hard);
    };
  }, [onWarm, onReveal, onDone]);

  const fillClip = `inset(${100 - progress}% 0 0 0)`;

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="loader"
          className="munich-preloader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-label="Cargando"
        >
          <motion.div
            className="munich-preloader-word"
            initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          >
            <div className="munich-preloader-stroke" aria-hidden="true">
              MUNICH
            </div>
            <div className="munich-preloader-fill" style={{ clipPath: fillClip }}>
              MUNICH
            </div>
          </motion.div>
          <motion.div
            className="munich-preloader-meta"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="munich-mono">Barru 8290 · Preparando secuencia</span>
            <span className="munich-preloader-pct" aria-live="polite">
              {String(progress).padStart(3, "0")}
            </span>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="exit"
          className="munich-preloader munich-preloader--exit"
          initial={{ clipPath: "inset(0% 0 0% 0)" }}
          animate={{ clipPath: "inset(50% 0 50% 0)" }}
          transition={{ duration: 1.05, ease: [0.77, 0, 0.18, 1] }}
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
}
