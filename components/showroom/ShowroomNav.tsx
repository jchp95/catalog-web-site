'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowIcon } from '@/components/ui/ArrowIcon';

export function ShowroomNav() {
  const [open, setOpen] = useState(false);
  return <header className="showroom-nav">
    <Link href="/" className="showroom-logo" aria-label="LOCAL showroom home">LOCAL<span>/</span><small>Independent digital craft</small></Link>
    <nav aria-label="Main navigation" className={open ? 'nav-links is-open' : 'nav-links'} id="showroom-navigation">
      <a href="#work" onClick={() => setOpen(false)}>The collection <span>06</span></a>
      <a href="#method" onClick={() => setOpen(false)}>The approach</a>
      <a href="#personalize" onClick={() => setOpen(false)}>Make it yours <ArrowIcon size={15} /></a>
    </nav>
    <button type="button" className="nav-menu" aria-expanded={open} aria-controls="showroom-navigation" onClick={() => setOpen(!open)} onKeyDown={event => { if (event.key === 'Escape') setOpen(false); }}>{open ? 'Close' : 'Menu'}<span aria-hidden="true">{open ? '−' : '+'}</span></button>
  </header>;
}
