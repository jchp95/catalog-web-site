'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { useState, type PointerEvent } from 'react';
import { demos } from '@/lib/demos';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import { LiveDeckStage } from './LiveDeckStage';

export function LiveDeck() {
  const [active, setActive] = useState(0);
  const demo = demos[active];
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 25 });
  const sy = useSpring(my, { stiffness: 150, damping: 25 });
  const rotateX = useTransform(sy, [-.5, .5], [2, -2]);
  const rotateY = useTransform(sx, [-.5, .5], [-3, 3]);
  function track(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - .5);
    my.set((event.clientY - rect.top) / rect.height - .5);
  }
  return <div className="live-deck-wrap">
    <div className="deck-browser-bar"><span><i /><i /><i /></span><p>the collection / {demo.slug}</p><span className="deck-live">Interactive demo</span></div>
    <motion.div className={`live-deck preview-${demo.slug}`} onPointerMove={track} onPointerLeave={() => { mx.set(0); my.set(0); }} style={reduceMotion ? {} : { rotateX, rotateY, transformPerspective: 1200 }}>
      <div className="deck-scene">
        <LiveDeckStage demos={demos} active={active} onSelect={setActive} reducedMotion={Boolean(reduceMotion)} />
      </div>
      <div className="deck-shade" />
      <AnimatePresence initial={false} mode="wait">
        <motion.div className="deck-text" key={demo.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .18 }}>
          <div className="deck-brand"><b>{demo.name}</b><span>{demo.industry}</span></div>
          <div className="deck-copy"><span>{demo.slug === 'mireya' ? 'Your time. Your ritual.' : demo.industry}</span><h2>{demo.headline}</h2><Link href={demo.href} className="deck-enter">{demo.action}<ArrowIcon size={17} /></Link></div>
        </motion.div>
      </AnimatePresence>
      <span className="deck-caption">A LOCAL/ website concept</span>
    </motion.div>
    <div className="deck-controls"><div role="group" aria-label="Choose featured website">{demos.map((item, index) => <button type="button" key={item.slug} aria-label={`Preview ${item.name}`} aria-pressed={active === index} onClick={() => setActive(index)}><span /></button>)}</div><span aria-live="polite">{String(active + 1).padStart(2, '0')} / 06 <b>{demo.industry}</b></span><button type="button" aria-label="Next featured website" onClick={() => setActive((active + 1) % demos.length)}><ArrowIcon size={20} /></button></div>
  </div>;
}
