'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { demos, type DemoCategory } from '@/lib/demos';
import { ArrowIcon } from '@/components/ui/ArrowIcon';

const filters: ('All industries' | DemoCategory)[] = ['All industries', 'Beauty & grooming', 'Food & hospitality', 'Homes & property', 'Automotive'];

export function ProjectRail() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All industries');
  const visible = demos.filter(demo => filter === 'All industries' || demo.category === filter);
  return <>
    <div className="collection-toolbar"><div className="collection-filters" role="group" aria-label="Filter websites by industry">{filters.map(item => <button type="button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}{item === 'All industries' && <span>06</span>}</button>)}</div><p aria-live="polite">{visible.length} {visible.length === 1 ? 'concept' : 'concepts'}</p></div>
    <div className="project-grid" id="collection-results">
      {visible.map(demo => <article key={demo.slug} className={`project-card preview-${demo.slug}`}>
        <Link href={demo.href} className="project-preview" aria-label={`Explore ${demo.name} ${demo.industry} demo`}>
          <Image src={demo.image} alt={demo.imageAlt} fill sizes="(max-width: 640px) 100vw, 50vw" />
          <div className="project-shade" />
          <span className="preview-wordmark">{demo.name}</span>
          <span className="preview-title">{demo.headline}</span>
          <span className="preview-enter"><ArrowIcon size={23} /></span>
          <span className="preview-action">{demo.action}</span>
        </Link>
        <div className="project-caption"><div><h3><Link href={demo.href}>{demo.name}</Link></h3><p>{demo.industry}</p></div><a href={`#personalize`} aria-label={`Personalize a ${demo.industry} website`} onClick={() => window.dispatchEvent(new CustomEvent('showroom:select-demo', { detail: demo.slug }))}>Make it yours <ArrowIcon size={15} /></a></div>
        <ul className="project-features">{demo.proof.map(item => <li key={item}>{item}</li>)}</ul>
      </article>)}
    </div>
  </>;
}
