'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { demos } from '@/lib/demos';
import { ArrowIcon } from '@/components/ui/ArrowIcon';

const goals = ['More appointments', 'More inquiries', 'Showcase my work', 'A stronger first impression'];
const clean = (value: string) => value.trim().replace(/\s+/g, ' ').slice(0, 42);

export function ProspectLauncher() {
  const [slug, setSlug] = useState(demos[0].slug);
  const [brand, setBrand] = useState('');
  const [city, setCity] = useState('');
  const [goal, setGoal] = useState(goals[0]);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const active = demos.find(demo => demo.slug === slug) ?? demos[0];
  const params = new URLSearchParams();
  if (clean(brand)) params.set('brand', clean(brand));
  if (clean(city)) params.set('city', clean(city));
  const href = `${active.href}${params.size ? `?${params.toString()}` : ''}`;
  useEffect(() => {
    function select(event: Event) {
      const value: unknown = (event as CustomEvent).detail;
      if (typeof value === 'string' && demos.some(demo => demo.slug === value)) setSlug(value);
    }
    window.addEventListener('showroom:select-demo', select);
    return () => window.removeEventListener('showroom:select-demo', select);
  }, []);
  function downloadBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = [
      'LOCAL/ — Website project brief', '',
      `Business: ${clean(brand) || 'To be discussed'}`, `City: ${clean(city) || 'To be discussed'}`,
      `Starting concept: ${active.name} — ${active.industry}`, `Primary goal: ${goal}`,
      `Demo: ${new URL(href, window.location.origin).href}`, '',
      'What I have in mind:', notes.trim() || 'To be discussed', '',
      'This brief is saved on your device. Share it with your representative to discuss scope, timing and pricing.',
      'The concept is a demonstration. No booking, payment or project request has been submitted.',
    ].join('\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `local-project-brief-${active.slug}.txt`;
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
  }
  return <section className="prospect-launcher" id="personalize" aria-labelledby="personalize-title">
    <div className="prospect-copy"><h2 id="personalize-title">Now picture<br /><em>your name here.</em></h2><p>A small change that makes it personal. Choose a concept, add your business, and take your next website for a test drive.</p><div className="prospect-sample" aria-hidden="true"><span>{active.industry}</span><strong>{clean(brand) || 'Your business.'}</strong><small>{clean(city) || 'Your neighborhood. Your next chapter.'}</small><div><i /> Your personalized preview</div></div></div>
    <form className="prospect-console" onSubmit={downloadBrief} onChange={() => setSaved(false)}>
      <h3>Make it yours</h3><p>Start with a concept. The final design starts with you.</p>
      <label><span>Your starting point</span><select value={slug} onChange={event => setSlug(event.target.value)}>{demos.map(demo => <option key={demo.slug} value={demo.slug}>{demo.name} · {demo.industry}</option>)}</select></label>
      <label><span>Business name</span><input value={brand} maxLength={42} onChange={event => setBrand(event.target.value)} placeholder="Your business name" autoComplete="organization" /></label>
      <label><span>City / market</span><input value={city} maxLength={42} onChange={event => setCity(event.target.value)} placeholder="e.g. Miami, FL" autoComplete="address-level2" /></label>
      <Link href={href} className="prospect-launch">Open your personalized demo <ArrowIcon size={19} /></Link>
      <button type="button" className="brief-toggle" aria-expanded={briefOpen} aria-controls="project-brief" onClick={() => setBriefOpen(!briefOpen)}>Have a project in mind? Save a brief.<span aria-hidden="true">{briefOpen ? '−' : '+'}</span></button>
      {briefOpen && <div id="project-brief" className="brief-fields"><label><span>What should your website do?</span><select value={goal} onChange={event => setGoal(event.target.value)}>{goals.map(item => <option key={item}>{item}</option>)}</select></label><label><span>Anything else you have in mind?</span><textarea value={notes} maxLength={1500} onChange={event => setNotes(event.target.value)} placeholder="Your services, inspiration, or what you wish your current site could do…" rows={3} /></label><button className="brief-download" type="submit">Download project brief <ArrowIcon size={17} /></button><p className="brief-note" role="status">{saved ? 'Brief downloaded. Share the file with your representative to start the conversation.' : 'Saved to your device for you to share. Nothing is submitted.'}</p></div>}
      <small className="prospect-note">No account needed. All demo interactions are simulated.</small>
    </form>
  </section>;
}
