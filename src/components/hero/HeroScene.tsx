'use client';
import {useRef,useState,useEffect,type SyntheticEvent} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {site} from '@/config/site';
import {motion} from '@/config/motion';
import {type HeroState,isTransitioning} from '@/lib/hero-state';
gsap.registerPlugin(useGSAP);
function warmPoses(el:HTMLElement|null){
  el?.querySelectorAll<HTMLImageElement>('img[data-pose-src]').forEach(img=>{if(!img.getAttribute('src'))img.src=img.dataset.poseSrc!;});
}
export default function HeroScene({quiet}:{quiet:boolean}) {
  const root=useRef<HTMLDivElement>(null);
  const timeline=useRef<gsap.core.Timeline|null>(null);
  const ambient=useRef<gsap.core.Tween|null>(null);
  const welcome=useRef<gsap.core.Timeline|null>(null);
  const stateRef=useRef<HeroState>('idle');
  const [state,setState]=useState<HeroState>('idle');
  const [failed,setFailed]=useState(false);
  const {contextSafe}=useGSAP((context)=>{
    const destination=stateRef.current==='hiding'||stateRef.current==='peeking'?'peeking':'idle';
    if(isTransitioning(stateRef.current)){timeline.current?.kill();stateRef.current=destination;setState(destination);}
    gsap.set('.cat-travel',{xPercent:destination==='peeking'?110:0,autoAlpha:destination==='peeking'?0:1});
    gsap.set('.peek-cat',{scaleX:-1,xPercent:0,autoAlpha:destination==='peeking'?1:0});
    gsap.set('.ground-shadow',{opacity:destination==='peeking'?0:.8});
    gsap.set('.scene-action',{scale:1,xPercent:0});
    gsap.set('.standing-cat',{opacity:1});gsap.set('.stepping-cat',{opacity:0});
    const el=root.current;
    if(el){el.dataset.welcome='stopped';el.dataset.interactive='ready';}
    if(!performance.getEntriesByName('anon-cat-controls-ready').length)performance.mark('anon-cat-controls-ready');
    if(quiet || failed) return;
    ambient.current=gsap.to('.cat-breathe',{scaleY:1.012,duration:motion.breathe,yoyo:true,repeat:-1,ease:'sine.inOut',transformOrigin:'50% 100%'});
    const poses=Array.from(el?.querySelectorAll<HTMLImageElement>('img[data-pose-src]')??[]);
    const startWelcome=()=>context.add(()=>{
      if(welcome.current?.isActive()||stateRef.current!=='idle'||poses.some(img=>!img.getAttribute('src')||!img.complete||img.naturalWidth===0))return;
      welcome.current?.kill();
      // A short, interruptible character performance; controls never wait for it.
      const w=gsap.timeline({delay:.2,repeat:-1,repeatDelay:5.5,onStart:()=>{if(el)el.dataset.welcome='playing';if(!performance.getEntriesByName('anon-cat-first-character-motion').length)performance.mark('anon-cat-first-character-motion');}});
      welcome.current=w;
      w.to('.cat-glance',{rotation:-3,duration:.12,ease:'power2.out'},0)
       .to('.scene-action',{scale:1.025,duration:.18,ease:'power2.out'},0)
       .to('.standing-cat',{opacity:0,duration:.08},.1)
       .to('.stepping-cat',{opacity:1,duration:.08},.1)
       .to('.cat-travel',{xPercent:110,duration:motion.hide,ease:'power2.inOut'},.12)
       .to('.ground-shadow',{opacity:0,duration:motion.hide},.12)
       .set('.cat-travel',{autoAlpha:0},.54)
       .set('.peek-cat',{xPercent:15,autoAlpha:0},.54)
       .to('.peek-cat',{xPercent:0,autoAlpha:1,duration:motion.peek,ease:'power2.out'},.55)
       .to('.peek-cat',{xPercent:15,autoAlpha:0,duration:.12},1.15)
       .set('.cat-travel',{autoAlpha:1,xPercent:110},1.16)
       .to('.cat-travel',{xPercent:0,duration:motion.return,ease:'power2.inOut'},1.18)
       .to('.ground-shadow',{opacity:.8,duration:.42},1.18)
       .to('.standing-cat',{opacity:1,duration:.12},1.5)
       .to('.stepping-cat',{opacity:0,duration:.12},1.5)
       .to('.cat-glance',{rotation:0,duration:.12},1.5)
       .to('.scene-action',{scale:1,duration:.2,ease:'power2.out'},1.5);
    });
    poses.forEach(img=>img.addEventListener('load',startWelcome));
    startWelcome();
    let visible=true;
    const pause=()=>{ambient.current?.pause();welcome.current?.pause();};
    const resume=()=>{ambient.current?.resume();welcome.current?.resume();};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&!document.hidden)resume();else pause();},{threshold:.1});
    if(el) observer.observe(el);
    const onVisibility=()=>document.hidden||!visible?pause():resume();
    const freeze=()=>{pause();timeline.current?.pause();};
    document.addEventListener('visibilitychange',onVisibility);
    document.addEventListener('anon-cat:freeze',freeze);
    return ()=>{welcome.current?.kill();poses.forEach(img=>img.removeEventListener('load',startWelcome));observer.disconnect();document.removeEventListener('visibilitychange',onVisibility);document.removeEventListener('anon-cat:freeze',freeze);};
  },{scope:root,dependencies:[quiet,failed],revertOnUpdate:true});
  const change=(value:HeroState)=>{stateRef.current=value;setState(value);};
  const fallback=(e:SyntheticEvent<HTMLImageElement>,path:string)=>{
    const img=e.currentTarget;
    if(img.dataset.fallback==='yes'){img.style.visibility='hidden';return;}
    img.dataset.fallback='yes';
    img.parentElement?.querySelector('source')?.removeAttribute('srcset');
    img.src=path;
  };
  useEffect(()=>()=>{timeline.current?.kill();},[]);
  useEffect(()=>{
    if(quiet)return;
    let cancelled=false,first=0,second=0;
    const img=root.current?.querySelector<HTMLImageElement>('.standing-cat');
    // Keep the hidden poses out of the initial request queue until the poster is decoded.
    img?.decode().catch(()=>{}).then(()=>{if(cancelled)return;if(img.naturalWidth>0&&!performance.getEntriesByName('anon-cat-hero-decoded').length)performance.mark('anon-cat-hero-decoded');first=requestAnimationFrame(()=>{second=requestAnimationFrame(()=>{if(!cancelled)warmPoses(root.current);});});});
    return()=>{cancelled=true;cancelAnimationFrame(first);cancelAnimationFrame(second);};
  },[quiet]);
  const toggle=()=>contextSafe(()=>{
    if(isTransitioning(stateRef.current))return;
    timeline.current?.kill();
    const hidden=stateRef.current==='peeking';
    warmPoses(root.current);welcome.current?.kill();if(root.current)root.current.dataset.welcome='stopped';
    if(!hidden){gsap.set('.cat-travel',{xPercent:0,autoAlpha:1});gsap.set('.standing-cat',{opacity:1});gsap.set('.stepping-cat',{opacity:0});gsap.set('.peek-cat',{autoAlpha:0});gsap.set('.cat-glance',{rotation:0});gsap.set('.scene-action',{scale:1,xPercent:0});}
    if(quiet){change(hidden?'idle':'peeking');gsap.set('.cat-travel',{xPercent:hidden?0:110,autoAlpha:hidden?1:0});gsap.set('.peek-cat',{autoAlpha:hidden?0:1,xPercent:0});gsap.set('.ground-shadow',{opacity:hidden?.8:0});return;}
    change(hidden?'returning':'hiding');
    const t=gsap.timeline({onComplete:()=>change(hidden?'idle':'peeking')});timeline.current=t;
    if(hidden){
      t.to('.peek-cat',{xPercent:15,autoAlpha:0,duration:.12},0)
       .set('.cat-travel',{autoAlpha:1},.06)
       .to('.cat-travel',{xPercent:0,duration:motion.return,ease:'power2.inOut'},.08)
       .to('.ground-shadow',{opacity:.8,duration:.42},.08)
       .to('.standing-cat',{opacity:1,duration:.1},.44)
       .to('.stepping-cat',{opacity:0,duration:.1},.44)
       .to('.scene-action',{scale:1,xPercent:0,duration:.18,ease:'power2.out'},.38);
    }else{
      t.to('.scene-action',{scale:1.025,xPercent:-1,duration:.2,ease:'power2.out'},0)
       .to('.cat-glance',{rotation:-3,duration:.1,ease:'power2.out'},0)
       .to('.standing-cat',{opacity:0,duration:.08},.08)
       .to('.stepping-cat',{opacity:1,duration:.08},.08)
       .to('.cat-travel',{xPercent:110,duration:motion.hide,ease:'power2.inOut'},.1)
       .to('.ground-shadow',{opacity:0,duration:motion.hide},.1)
       .set('.cat-travel',{autoAlpha:0},.52)
       .set('.cat-glance',{rotation:0},.52)
       .set('.peek-cat',{xPercent:15},.52)
       .to('.peek-cat',{xPercent:0,autoAlpha:1,duration:motion.peek,ease:'power2.out'},.54)
       .to('.scene-action',{scale:1,xPercent:0,duration:.18,ease:'power2.out'},.54);
    }
  })();
  return <div className={`hero-scene ${failed?'asset-fallback':''}`} ref={root} data-state={state} data-quiet={quiet}>
    <div className="scene-camera"><div className="scene-pointer"><div className="scene-action"><div className="scene-art" aria-hidden="true">
      <div className="scene-light"/>
      <picture className="architecture"><source media="(max-width:700px)" srcSet={site.assets.mobile}/><img src={site.assets.background} onError={e=>fallback(e,'/assets/environments/hideout-back.png')} alt="" width="1400" height="1400" fetchPriority="high"/></picture>
      <div className="ground-shadow"/>
      <div className="cat-occlusion"><div className="cat-travel"><div className="cat-breathe"><div className="cat-glance">
        <picture><source media="(max-width:700px)" srcSet={failed?'/assets/character/hero-cat.png':'/assets/character/hero-cat-mobile.webp'}/><img className="standing-cat" src={failed?'/assets/character/hero-cat.png':site.assets.hero} onError={()=>setFailed(true)} alt="" width="750" height="1500" fetchPriority="high"/></picture>
        <img className="stepping-cat" data-pose-src={site.assets.step} onError={e=>fallback(e,'/assets/character/step-cat.png')} alt="" width="750" height="1500" fetchPriority="low" decoding="async"/>
      </div></div></div></div>
      <img className="scene-front" src={site.assets.foreground} onError={e=>fallback(e,'/assets/environments/hideout-front.png')} alt="" width="1400" height="1400"/>
      <img className="peek-cat" data-pose-src={site.assets.peek} onError={e=>fallback(e,'/assets/character/peek-cat.png')} alt="" width="700" height="900" fetchPriority="low" decoding="async"/>
    </div></div></div></div>
    <div className="scene-caption"><span>SUBJECT 001</span><span className="scene-note">Comfortably undisclosed.</span></div>
    <div className="scene-control"><button className="incognito" onClick={toggle} disabled={isTransitioning(state)} aria-pressed={state==='peeking'}><span className="incognito-symbol" aria-hidden="true">◉</span>{state==='peeking'||state==='returning'?'Come back':'Go incognito'}<span className="small-plus" aria-hidden="true">{state==='peeking'?'−':'+'}</span></button><p className="sr-only" role="status">{state==='idle'?'The orange cat is standing in its charcoal knitted disguise.':state==='hiding'?'The cat is stepping behind the wall.':state==='peeking'?'The cat is hidden, with one ear and its eyes peeking around the wall.':'The cat is returning.'}</p></div>
  </div>;
}
