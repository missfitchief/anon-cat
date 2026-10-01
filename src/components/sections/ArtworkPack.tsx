'use client';
import {useState,useRef,useEffect} from 'react';
import gsap from 'gsap';
import {site} from '@/config/site';
import {quietMotion} from '@/lib/motion-preference';
import DeferredImage from '@/components/DeferredImage';
export default function ArtworkPack(){
  const [selected,setSelected]=useState(0);
  const root=useRef<HTMLElement>(null);
  const previous=useRef(0);
  const portrait=site.portraits[selected];
  useEffect(()=>{
    let context:gsap.Context|null=null;
    const old=previous.current;
    const setup=()=>{
      context?.revert();
      const quiet=quietMotion();
      context=gsap.context(()=>{
        const cards=gsap.utils.toArray<HTMLElement>('.portrait-print');
        cards.forEach((card,index)=>{
          const order=(index-selected+3)%3;
          gsap.set(card,{zIndex:order===0?3:3-order,rotationY:0,x:order===0?0:order===1?-8:8,y:order===0?0:order===1?10:14,rotation:order===0?2:order===1?-7:8,scale:order===0?1:.97});
        });
        if(!quiet && old!==selected){
          gsap.fromTo(cards[selected],{xPercent:24,y:-24,rotation:-12,rotationY:-18,scale:.93},{xPercent:0,x:0,y:0,rotation:2,rotationY:0,scale:1,duration:.38,ease:'back.out(1.1)',overwrite:true});
          gsap.timeline().fromTo(cards[old],{xPercent:0,rotation:2},{xPercent:-12,rotation:-10,duration:.14,ease:'power2.in',overwrite:true}).to(cards[old],{xPercent:0,rotation:old===(selected+1)%3?-7:8,duration:.24,ease:'power3.out'});
        }else gsap.set(cards,{xPercent:0});
      },root);
    };
    setup();previous.current=selected;
    const observer=new MutationObserver(setup);observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-motion']});
    const freeze=()=>context?.getTweens().forEach((tween:gsap.core.Tween)=>tween.pause());document.addEventListener('anon-cat:freeze',freeze);
    return()=>{observer.disconnect();context?.revert();document.removeEventListener('anon-cat:freeze',freeze);};
  },[selected]);
  return <section ref={root} className="artwork-section" id="artwork" data-selection={portrait.id} aria-labelledby="artwork-heading"><div className="section-top"><span className="eyebrow">03 / THE ARTWORK</span><span className="tiny-label">TAKE THE CAT. LEAVE THE DETAILS.</span></div>
    <div className="artwork-grid"><div className="artwork-copy"><h2 className="display-title" id="artwork-heading">RECOGNIZABLE.<br/><span>UNIDENTIFIED.</span></h2><p className="section-description">A face you can keep.<br/>A story you don’t get.</p><div className="portrait-options" role="group" aria-label="Choose a cat portrait">{site.portraits.map((p,i)=><button key={p.id} aria-pressed={selected===i} onClick={()=>setSelected(i)}><span className="portrait-number">0{i+1}</span>{p.label}<span className="portrait-indicator" aria-hidden="true">{selected===i?'●':'○'}</span></button>)}</div><a className="button orange-button download-button" href={portrait.src} download={`anon-cat-${portrait.id}.png`}>Download {portrait.label.toLowerCase()}<span aria-hidden="true">↓</span></a><p className="download-note">PNG / 1024 × 1024 / YOURS TO KEEP</p></div>
      <figure className="selected-portrait"><div className="portrait-stage">{site.portraits.map((p,i)=><div className="portrait-print portrait-image" key={p.id} data-active={i===selected} aria-hidden={i!==selected}><DeferredImage src={p.src.replace('.png','.webp')} alt={i===selected?`ANON CAT ${p.label.toLowerCase()} portrait. ${p.description}`:''} width="1024" height="1024"/></div>)}</div><figcaption><span>{portrait.label.toUpperCase()} / 0{selected+1}</span><span>{portrait.description}</span></figcaption><span className="sr-only" role="status">{portrait.label} portrait selected.</span></figure>
    </div>
  </section>;
}
