'use client';
import {useState,useEffect} from 'react';
import {site} from '@/config/site';
import {motion} from '@/config/motion';
import HeroScene from '@/components/hero/HeroScene';
export default function Experience({children}:{children?:React.ReactNode}) {
  const [quiet,setQuiet]=useState(false);
  const [menu,setMenu]=useState(false);
  useEffect(()=>{
    const query=window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync=()=>{let saved:string|null=null;try{saved=localStorage.getItem(motion.storageKey);}catch{}setQuiet(query.matches||saved==='off');};
    sync();query.addEventListener('change',sync);return()=>query.removeEventListener('change',sync);
  },[]);
  useEffect(()=>{document.documentElement.dataset.motion=quiet?'off':'on';},[quiet]);
  const toggleMotion=()=>{const v=!quiet;setQuiet(v);try{localStorage.setItem(motion.storageKey,v?'off':'on');}catch{}};
  return <>
    <header className="header"><div className="scroll-progress" aria-hidden="true"/><a className="brand" href="#top" aria-label={`${site.name}, back to top`}><img src="/favicon.svg" alt="" width="34" height="34"/>{site.name}<span className="brand-star" aria-hidden="true">✳</span></a>
      <nav id="mobile-nav" aria-label="Main navigation" className={menu?'nav menu-open':'nav'}>{site.navigation.map((n,i)=><a key={n.href} href={n.href} onClick={()=>setMenu(false)}><span>0{i+1}</span>{n.label}</a>)}</nav>
      <div className="header-controls"><button className="motion-button" onClick={toggleMotion} aria-pressed={!quiet} aria-label={quiet?'Turn motion on':'Turn motion off'}><span aria-hidden="true">{quiet?'Ⅱ':'◌'}</span><span className="motion-label">Motion {quiet?'off':'on'}</span></button><button className="menu-button" aria-expanded={menu} aria-controls="mobile-nav" onClick={()=>setMenu(!menu)}>{menu?'Close':'Menu'}<span aria-hidden="true">{menu?'−':'+'}</span></button></div>
    </header>
    <main id="main"><section className="hero" id="top" aria-labelledby="hero-heading">
      <div className="hero-copy"><p className="eyebrow"><span className="orange-rule"/> PRIVATE BY INSTINCT</p><h1 id="hero-heading">{site.headline.map((line,i)=><span className={i===2?'orange-type':''} key={line}>{line}</span>)}</h1><p className="hero-intro">{site.intro}</p><div className="hero-actions"><a href="#file" className="button orange-button">Meet the cat<span aria-hidden="true">+</span></a><p className="monero-caption"><span className="monero-dot" aria-hidden="true">m</span>{site.moneroLine}</p></div></div>
      <div className="hero-ghost" aria-hidden="true">09</div><HeroScene quiet={quiet}/>
      <div className="hero-bottom"><span>NO NAME TAG. NO EXPLANATION.</span><a href="#file">SCROLL TO GET LESS<span aria-hidden="true">↓</span></a><span className="coordinates">09 LIVES / 00 DETAILS</span></div>
    </section>{children}</main>
  </>;
}
