"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { demos } from "@/lib/demos";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

export function ProspectLauncher(){
  const live=demos.filter(d=>d.status==="live");
  const [slug,setSlug]=useState(live[0].slug);
  const [brand,setBrand]=useState("");
  const [city,setCity]=useState("Miami, FL");
  const active=live.find(d=>d.slug===slug)??live[0];
  const href=useMemo(()=>{
    const params=new URLSearchParams();
    if(brand.trim()) params.set("brand",brand.trim());
    if(city.trim()) params.set("city",city.trim());
    const query=params.toString();
    return `${active.href}${query?`?${query}`:""}`;
  },[active.href,brand,city]);

  return <section className="prospect-launcher" id="personalize">
    <div className="prospect-copy"><span className="mono-kicker">LIVE SALES MODE</span><h2>Put their name on it<br/><em>before the meeting ends.</em></h2><p>Choose the nearest vertical, add the prospect&apos;s business and market, then open a personalized shareable demo.</p></div>
    <div className="prospect-console">
      <div className="prospect-console-top"><span>PREVIEW BUILDER</span><b>06 live systems</b></div>
      <label><span>Vertical</span><select value={slug} onChange={e=>setSlug(e.target.value)}>{live.map(d=><option key={d.slug} value={d.slug}>{d.name} · {d.industry}</option>)}</select></label>
      <label><span>Business name</span><input value={brand} onChange={e=>setBrand(e.target.value)} placeholder="Prospect business name"/></label>
      <label><span>City / market</span><input value={city} onChange={e=>setCity(e.target.value)} placeholder="Miami, FL"/></label>
      <div className="prospect-preview"><span>CLIENT PREVIEW</span><strong>{brand||active.name}</strong><small>{city||"United States"} · {active.industry}</small></div>
      <Link href={href} className="prospect-launch">Launch personalized demo <ArrowIcon/></Link>
    </div>
  </section>
}
