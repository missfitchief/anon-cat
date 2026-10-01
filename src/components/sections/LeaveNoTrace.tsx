'use client';
import {useEffect,useRef} from 'react';
import gsap from 'gsap';
import DeferredImage from '@/components/DeferredImage';

export default function LeaveNoTrace(){
  const root=useRef<HTMLElement>(null),room=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=root.current,stage=room.current;if(!el||!stage)return;
    let disposed=false,started=false,visible=false,frozen=false;
    let context:gsap.Context|null=null,entry:gsap.core.Timeline|null=null,breathe:gsap.core.Tween|null=null;
    const playback=()=>{
      const playing=started&&visible&&!document.hidden&&!frozen;
      el.dataset.tracePlaying=String(playing);
      if(playing){entry?.resume();breathe?.resume();}else{entry?.pause();breathe?.pause();}
    };
    const initialize=async()=>{
      if(started)return;
      const image=stage.querySelector<HTMLImageElement>('.trace-stepping');
      if(image){image.loading='eager';await image.decode().catch(()=>image.decode().catch(()=>{}));}
      if(disposed||started)return;started=true;
      context=gsap.context(()=>{
        entry=gsap.timeline({paused:true});
        entry.fromTo('.trace-cat',{x:Math.min(stage.clientWidth*.14,180)},{x:0,duration:1.4,ease:'power2.out'},0)
          .fromTo('.trace-light',{scaleX:.45},{scaleX:1,duration:1.1,ease:'power3.out'},0)
          .fromTo('.trace-heading',{y:32,rotation:-2},{y:0,rotation:0,duration:.7,ease:'power3.out'},0);
        breathe=gsap.to('.trace-breathe',{scaleY:1.012,duration:2.6,repeat:-1,yoyo:true,ease:'sine.inOut',transformOrigin:'50% 100%',paused:true});
      },el);
      el.dataset.traceReady='true';
      if(frozen)entry?.progress(1).pause();playback();
    };
    const observer=new IntersectionObserver(entries=>{
      visible=entries.some(item=>item.isIntersecting);
      if(visible)void initialize();playback();
    },{threshold:.1});observer.observe(stage);
    const freeze=()=>{frozen=true;entry?.progress(1).pause();context?.getTweens().forEach((tween:gsap.core.Tween)=>tween.pause());playback();};
    document.addEventListener('visibilitychange',playback);document.addEventListener('anon-cat:freeze',freeze);
    return()=>{disposed=true;observer.disconnect();context?.revert();document.removeEventListener('visibilitychange',playback);document.removeEventListener('anon-cat:freeze',freeze);};
  },[]);
  return <section ref={root} className="trace-section" id="artwork" aria-labelledby="trace-heading">
    <div ref={room} className="trace-room">
      <div className="trace-set" aria-hidden="true"><div className="trace-light"/><div className="trace-floor"/><div className="trace-wall"/>
        <div className="trace-cat"><div className="trace-ground-shadow"/><div className="trace-breathe"><DeferredImage className="trace-stepping" src="/assets/character/step-clean-paw.webp" alt="" width="800" height="1300"/></div></div>
      </div>
      <h2 className="trace-heading" id="trace-heading">LEAVE<br/><em>NO TRACE.</em></h2>
      <p className="trace-copy">The cat stays.<br/>Nothing to follow.</p>
    </div>
  </section>;
}
