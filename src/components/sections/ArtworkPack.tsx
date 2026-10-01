'use client';
import {useState} from 'react';
import {site} from '@/config/site';
export default function ArtworkPack(){
  const [selected,setSelected]=useState(0);
  const portrait=site.portraits[selected];
  return <section className="artwork-section" id="artwork" aria-labelledby="artwork-heading"><div className="section-top"><span className="eyebrow">03 / THE ARTWORK</span><span className="tiny-label">TAKE THE CAT. LEAVE THE DETAILS.</span></div>
    <div className="artwork-grid"><div className="artwork-copy"><h2 className="display-title" id="artwork-heading">RECOGNIZABLE.<br/><span>UNIDENTIFIED.</span></h2><p className="section-description">A face you can keep.<br/>A story you don’t get.</p><div className="portrait-options" role="group" aria-label="Choose a cat portrait">{site.portraits.map((p,i)=><button key={p.id} aria-pressed={selected===i} onClick={()=>setSelected(i)}><span className="portrait-number">0{i+1}</span>{p.label}<span className="portrait-indicator" aria-hidden="true">{selected===i?'●':'○'}</span></button>)}</div><a className="button orange-button download-button" href={portrait.src} download={`anon-cat-${portrait.id}.png`}>Download {portrait.label.toLowerCase()}<span aria-hidden="true">↓</span></a><p className="download-note">PNG / 1024 × 1024 / YOURS TO KEEP</p></div>
      <figure className="selected-portrait"><div className="portrait-image"><img key={portrait.id} src={portrait.src.replace('.png','.webp')} alt={`ANON CAT ${portrait.label.toLowerCase()} portrait. ${portrait.description}`} width="1024" height="1024" loading="lazy"/></div><figcaption><span>{portrait.label.toUpperCase()} / 0{selected+1}</span><span>{portrait.description}</span></figcaption><span className="sr-only" role="status">{portrait.label} portrait selected.</span></figure>
    </div>
  </section>;
}
