'use client';
import {useEffect,useRef,useState,type PointerEvent as ReactPointerEvent,type CSSProperties} from 'react';
import gsap from 'gsap';
import DeferredImage from '@/components/DeferredImage';

const trail=[{x:18,y:86},{x:24,y:82},{x:30,y:87},{x:36,y:82},{x:42,y:86},{x:48,y:81},{x:54,y:85},{x:60,y:80},{x:66,y:84}];
function Paw(){return <svg viewBox="0 0 40 48" fill="currentColor"><ellipse cx="8" cy="13" rx="5" ry="7" transform="rotate(-22 8 13)"/><ellipse cx="18" cy="8" rx="5" ry="7"/><ellipse cx="29" cy="10" rx="5" ry="7" transform="rotate(18 29 10)"/><ellipse cx="35" cy="21" rx="4" ry="6" transform="rotate(28 35 21)"/><path d="M9 34c0-8 6-15 13-15s12 8 12 16c0 6-5 8-9 6-4-2-6-2-10 0-5 2-8-1-6-7Z"/></svg>;}

export default function LeaveNoTrace(){
  const root=useRef<HTMLElement>(null),room=useRef<HTMLDivElement>(null);
  const actions=useRef<{clear:()=>void;restart:()=>void;brush:(x:number,y:number)=>void}>({clear:()=>{},restart:()=>{},brush:()=>{}});
  const [ready,setReady]=useState(false),[cleared,setCleared]=useState(false);
  const clearedRef=useRef(false);
  useEffect(()=>{
    const el=root.current,stage=room.current;if(!el||!stage)return;
    let disposed=false,started=false,visible=false,frozen=false,frame=0;
    let steppingAvailable=false,seatedAvailable=false;
    let context:gsap.Context|null=null,entry:gsap.core.Timeline|null=null,breathe:gsap.core.Tween|null=null;
    let point={x:0,y:0};const erased=new Set<number>();
    const prints=Array.from(stage.querySelectorAll<HTMLElement>('.trace-print'));
    const playback=()=>{
      const playing=started&&visible&&!document.hidden&&!frozen;
      el.dataset.tracePlaying=String(playing);
      if(playing){entry?.resume();breathe?.resume();}else{entry?.pause();breathe?.pause();}
    };
    const erase=(indices:number[])=>{
      if(!started||disposed)return;
      indices.forEach(index=>{
        if(erased.has(index))return;erased.add(index);
        const print=prints[index];print.dataset.erased='true';
        context?.add(()=>{
          gsap.to(print.querySelector('svg'),{opacity:0,scale:1.5,rotation:14,duration:frozen?0:.26,ease:'power2.out',overwrite:true});
          print.querySelectorAll<HTMLElement>('.trace-dust').forEach((dust,i)=>{
            if(frozen){gsap.set(dust,{opacity:0});return;}
            const angle=(i*90+index*17)*Math.PI/180;
            gsap.fromTo(dust,{opacity:.7,x:0,y:0,scale:1},{opacity:0,x:Math.cos(angle)*26,y:Math.sin(angle)*18-12,scale:.1,duration:.4,ease:'power2.out',overwrite:true});
          });
        });
      });
      if(erased.size===trail.length&&!clearedRef.current){
        clearedRef.current=true;setCleared(true);
        context?.add(()=>{
          gsap.to('.trace-stepping',{autoAlpha:steppingAvailable&&!seatedAvailable?1:0,duration:frozen?0:.35,ease:'power2.out'});
          gsap.to('.trace-seated',{autoAlpha:seatedAvailable?1:0,duration:frozen?0:.45,ease:'power2.out'});
          gsap.to('.trace-light',{opacity:.75,duration:frozen?0:.6,ease:'sine.out'});
        });
      }
    };
    const reset=()=>{
      erased.clear();clearedRef.current=false;setCleared(false);
      prints.forEach(print=>{delete print.dataset.erased;});
      context?.add(()=>{
        gsap.killTweensOf('.trace-print svg,.trace-dust,.trace-stepping,.trace-seated');
        gsap.killTweensOf('.trace-light','opacity');
        gsap.set('.trace-print svg',{opacity:1,scale:1,rotation:0});
        gsap.set('.trace-dust',{opacity:0});gsap.set('.trace-stepping',{autoAlpha:steppingAvailable?1:0});gsap.set('.trace-seated',{autoAlpha:!steppingAvailable&&seatedAvailable?1:0});
        gsap.set('.trace-light',{opacity:1});
      });
      entry?.restart();if(!visible||document.hidden||frozen)entry?.progress(1).pause();
    };
    const clear=()=>{entry?.progress(1).pause();erase(trail.map((_,i)=>i));};
    const brush=(x:number,y:number)=>{
      point={x,y};if(frame||!visible)return;
      frame=requestAnimationFrame(()=>{
        frame=0;if(!started||disposed||frozen)return;
        // Ignore prints not yet laid down by the entrance; vertical touch scrolling stays native.
        erase(prints.flatMap((print,i)=>{
          const box=print.getBoundingClientRect();
          return Number(getComputedStyle(print).opacity)>.5&&Math.hypot(point.x-box.left-box.width/2,point.y-box.top-box.height/2)<48?[i]:[];
        }));
      });
    };
    const initialize=async()=>{
      if(started)return;
      const images=Array.from(stage.querySelectorAll<HTMLImageElement>('img'));
      images.forEach(img=>{img.loading='eager';});
      await Promise.allSettled(images.map(img=>img.decode().catch(()=>img.decode())));
      if(disposed||started)return;started=true;
      steppingAvailable=!!stage.querySelector<HTMLImageElement>('.trace-stepping')?.naturalWidth;
      seatedAvailable=!!stage.querySelector<HTMLImageElement>('.trace-seated')?.naturalWidth;
      context=gsap.context(()=>{
        gsap.set('.trace-stepping',{autoAlpha:steppingAvailable?1:0});
        gsap.set('.trace-seated',{autoAlpha:!steppingAvailable&&seatedAvailable?1:0});
        entry=gsap.timeline({paused:true});
        entry.fromTo('.trace-cat',{x:-Math.min(stage.clientWidth*.28,320),y:-16,rotation:-3},{x:0,y:0,rotation:0,duration:1.6,ease:'power2.out'},0)
          .fromTo('.trace-light',{scaleX:.45},{scaleX:1,duration:1.1,ease:'power3.out'},0)
          .fromTo('.trace-print',{autoAlpha:0,scale:.7},{autoAlpha:1,scale:1,duration:.3,stagger:.1,ease:'back.out(1.3)'},.18)
          .fromTo('.trace-heading',{y:32,rotation:-2},{y:0,rotation:0,duration:.7,ease:'power3.out'},0);
        breathe=gsap.to('.trace-breathe',{scaleY:1.012,duration:2.6,repeat:-1,yoyo:true,ease:'sine.inOut',transformOrigin:'50% 100%',paused:true});
      },el);
      actions.current={clear,restart:reset,brush};setReady(true);el.dataset.traceReady='true';
      if(frozen)entry?.progress(1).pause();playback();
    };
    const observer=new IntersectionObserver(entries=>{
      visible=entries.some(item=>item.isIntersecting);
      if(visible)void initialize();playback();
    },{threshold:.1});observer.observe(stage);
    const visibility=playback;
    const freeze=()=>{frozen=true;entry?.progress(1).pause();context?.getTweens().forEach((tween:gsap.core.Tween)=>tween.pause());playback();};
    document.addEventListener('visibilitychange',visibility);document.addEventListener('anon-cat:freeze',freeze);
    return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();context?.revert();actions.current={clear:()=>{},restart:()=>{},brush:()=>{}};document.removeEventListener('visibilitychange',visibility);document.removeEventListener('anon-cat:freeze',freeze);};
  },[]);
  const brush=(event:ReactPointerEvent<HTMLDivElement>)=>{if(event.pointerType==='mouse'||event.buttons||event.type==='pointerdown')actions.current.brush(event.clientX,event.clientY);};
  return <section ref={root} className="trace-section" id="artwork" aria-labelledby="trace-heading" data-trace-state={cleared?'cleared':'trail'}>
    <div ref={room} className="trace-room" onPointerMove={brush} onPointerDown={brush}>
      <div className="trace-set" aria-hidden="true"><div className="trace-light"/><div className="trace-floor"/><div className="trace-wall"/><div className="trace-ground-shadow"/>
        <div className="trace-cat"><div className="trace-breathe"><DeferredImage className="trace-stepping" src="/assets/character/step-cat.webp" alt="" width="800" height="1300"/><DeferredImage className="trace-seated" src="/assets/character/seated-cat.webp" alt="" width="1000" height="1200"/></div></div>
        {trail.map((paw,i)=><div key={i} className="trace-print" style={{'--paw-x':`${paw.x}%`,'--paw-y':`${paw.y}%`,'--paw-angle':`${i%2?-20:8}deg`} as CSSProperties}><Paw/>{[0,1,2,3].map(n=><span key={n} className="trace-dust"/>)}</div>)}
      </div>
      <h2 className="trace-heading" id="trace-heading">LEAVE<br/><em>NO TRACE.</em></h2>
      <p className="trace-copy">The cat stays.<br/>The trail doesn’t.</p>
      <div className="trace-action"><p id="trace-instruction" aria-live="polite">{cleared?'Still here. Less to follow.':'Brush away the pawprints.'}</p><button type="button" disabled={!ready} onClick={()=>{if(clearedRef.current)actions.current.restart();else actions.current.clear();}}>{cleared?'Let him wander':'Clear the trail'}<span aria-hidden="true">{cleared?'↗':'×'}</span></button></div>
    </div>
  </section>;
}
