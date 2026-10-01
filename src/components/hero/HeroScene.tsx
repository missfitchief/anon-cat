'use client';
import {useRef,useState,useEffect,type SyntheticEvent} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {site} from '@/config/site';
import {motion} from '@/config/motion';
import {type HeroState,isTransitioning} from '@/lib/hero-state';
gsap.registerPlugin(useGSAP);
export default function HeroScene({quiet}:{quiet:boolean}) {
  const root=useRef<HTMLDivElement>(null);
  const timeline=useRef<gsap.core.Timeline|null>(null);
  const ambient=useRef<gsap.core.Tween|null>(null);
  const stateRef=useRef<HeroState>('idle');
  const [state,setState]=useState<HeroState>('idle');
  const [failed,setFailed]=useState(false);
  const {contextSafe}=useGSAP(()=>{
    const destination=stateRef.current==='hiding'||stateRef.current==='peeking'?'peeking':'idle';
    if(isTransitioning(stateRef.current)){timeline.current?.kill();stateRef.current=destination;setState(destination);}
    gsap.set('.cat-travel',{xPercent:destination==='peeking'?110:0,autoAlpha:destination==='peeking'?0:1});
    gsap.set('.peek-cat',{scaleX:-1,xPercent:0,autoAlpha:destination==='peeking'?1:0});
    gsap.set('.ground-shadow',{opacity:destination==='peeking'?0:.8});
    gsap.set('.scene-action',{scale:1,xPercent:0});
    gsap.set('.standing-cat',{opacity:1});gsap.set('.stepping-cat',{opacity:0});
    if(quiet || failed) return;
    ambient.current=gsap.to('.cat-breathe',{scaleY:1.006,duration:motion.breathe,yoyo:true,repeat:-1,ease:'sine.inOut',transformOrigin:'50% 100%'});
    const el=root.current;
    let visible=true;
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible && !document.hidden) ambient.current?.resume();else ambient.current?.pause(); },{threshold:.1});
    if(el) observer.observe(el);
    const onVisibility=()=>document.hidden||!visible?ambient.current?.pause():ambient.current?.resume();
    const freeze=()=>{ambient.current?.pause();timeline.current?.pause();};
    document.addEventListener('visibilitychange',onVisibility);
    document.addEventListener('anon-cat:freeze',freeze);
    return ()=>{observer.disconnect();document.removeEventListener('visibilitychange',onVisibility);document.removeEventListener('anon-cat:freeze',freeze);};
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
  const toggle=()=>contextSafe(()=>{
    if(isTransitioning(stateRef.current))return;
    timeline.current?.kill();
    const hidden=stateRef.current==='peeking';
    if(quiet){change(hidden?'idle':'peeking');gsap.set('.cat-travel',{xPercent:hidden?0:110,autoAlpha:hidden?1:0});gsap.set('.peek-cat',{autoAlpha:hidden?0:1,xPercent:0});gsap.set('.ground-shadow',{opacity:hidden?.8:0});return;}
    change(hidden?'returning':'hiding');
    const t=gsap.timeline({onComplete:()=>change(hidden?'idle':'peeking')});timeline.current=t;
    if(hidden){
      t.to('.scene-action',{scale:1.06,xPercent:-2,duration:.5,ease:'power2.inOut'},0)
       .to('.peek-cat',{xPercent:22,autoAlpha:0,duration:.22},0)
       .set('.cat-travel',{autoAlpha:1})
       .to('.cat-travel',{xPercent:0,duration:motion.return,ease:'power2.inOut'})
       .to('.ground-shadow',{opacity:.8,duration:motion.return},'<')
       .to('.standing-cat',{opacity:1,duration:.15},'-=.25')
       .to('.stepping-cat',{opacity:0,duration:.15},'<')
       .to('.scene-action',{scale:1,xPercent:0,duration:.6,ease:'power2.out'},'-=.6');
    }else{
      t.to('.scene-action',{scale:1.06,xPercent:-2,duration:.7,ease:'power2.inOut'},0)
       .to('.cat-glance',{rotation:-3,duration:.22,ease:'power2.out'},0)
       .to('.standing-cat',{opacity:0,duration:.13})
       .to('.stepping-cat',{opacity:1,duration:.13},'<')
       .to('.cat-travel',{xPercent:110,duration:motion.hide,ease:'power2.inOut'},'-=.06')
       .to('.ground-shadow',{opacity:0,duration:motion.hide},'<')
       .set('.cat-travel',{autoAlpha:0})
       .set('.cat-glance',{rotation:0})
       .set('.peek-cat',{xPercent:20})
       .to('.peek-cat',{xPercent:0,autoAlpha:1,duration:motion.peek,ease:'power2.out'},'+=.18')
       .to('.scene-action',{scale:1,xPercent:0,duration:.6,ease:'power2.out'},'<');
    }
  })();
  return <div className={`hero-scene ${failed?'asset-fallback':''}`} ref={root} data-state={state} data-quiet={quiet}>
    <div className="scene-camera"><div className="scene-pointer"><div className="scene-action"><div className="scene-art" aria-hidden="true">
      <div className="scene-light"/>
      <picture className="architecture"><source media="(max-width:700px)" srcSet={site.assets.mobile}/><img src={site.assets.background} onError={e=>fallback(e,'/assets/environments/hideout-back.png')} alt="" width="1400" height="1400" fetchPriority="high"/></picture>
      <div className="ground-shadow"/>
      <div className="cat-occlusion"><div className="cat-travel"><div className="cat-breathe"><div className="cat-glance">
        <img className="standing-cat" src={failed?'/assets/character/hero-cat.png':site.assets.hero} onError={()=>setFailed(true)} alt="" width="750" height="1500" fetchPriority="high"/>
        <img className="stepping-cat" src={site.assets.step} onError={e=>fallback(e,'/assets/character/step-cat.png')} alt="" width="750" height="1500"/>
      </div></div></div></div>
      <img className="scene-front" src={site.assets.foreground} onError={e=>fallback(e,'/assets/environments/hideout-front.png')} alt="" width="1400" height="1400"/>
      <img className="peek-cat" src={site.assets.peek} onError={e=>fallback(e,'/assets/character/peek-cat.png')} alt="" width="700" height="900"/>
    </div></div></div></div>
    <div className="scene-arrival" aria-hidden="true"><span/><span/><span/></div>
    <div className="scene-caption"><span>SUBJECT 001</span><span className="scene-note">Comfortably undisclosed.</span></div>
    <div className="scene-control"><button className="incognito" onClick={toggle} disabled={isTransitioning(state)} aria-pressed={state==='peeking'}><span className="incognito-symbol" aria-hidden="true">◉</span>{state==='peeking'||state==='returning'?'Come back':'Go incognito'}<span className="small-plus" aria-hidden="true">{state==='peeking'?'−':'+'}</span></button><p className="sr-only" role="status">{state==='idle'?'The orange cat is standing in its charcoal knitted disguise.':state==='hiding'?'The cat is stepping behind the wall.':state==='peeking'?'The cat is hidden, with one ear and its eyes peeking around the wall.':'The cat is returning.'}</p></div>
  </div>;
}
