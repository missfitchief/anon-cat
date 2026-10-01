'use client';
import {useEffect} from 'react';
import gsap from 'gsap';
import {quietMotion} from '@/lib/motion-preference';

export default function PageMotion(){
  useEffect(()=>{
    let context:gsap.Context|null=null;
    let observer:IntersectionObserver|null=null;
    let disposePointer=()=>{};
    let frozen=false;
    const progress=document.querySelector<HTMLElement>('.scroll-progress');
    let frame=0;
    const updateProgress=()=>{
      frame=0;
      const length=document.documentElement.scrollHeight-innerHeight;
      if(progress)progress.style.transform=`scaleX(${length>0?scrollY/length:0})`;
    };
    const onScroll=()=>{if(!frame)frame=requestAnimationFrame(updateProgress);};
    const setup=()=>{
      observer?.disconnect();disposePointer();context?.revert();frozen=false;
      if(quietMotion())return;
      context=gsap.context(()=>{
        // Native document flow: no pinned sections, scrub delays or moving controls.
        observer=new IntersectionObserver(entries=>{
          entries.forEach(entry=>{
            if(!entry.isIntersecting||frozen)return;
            observer?.unobserve(entry.target);
            context?.add(()=>{
              const el=entry.target;
              if(el.matches('.file-art')){
                gsap.from(el,{y:36,rotation:-2,scale:.96,duration:.45,ease:'power3.out'});
                gsap.from('.file-orange-disc',{scale:.8,duration:.45,ease:'power3.out'});
              }else if(el.matches('.ethos-frame')){
                gsap.from(el,{y:28,duration:.4,ease:'power3.out'});
                gsap.from(el.querySelector('img'),{scale:1.08,duration:.55,ease:'power3.out'});
              }else{
                gsap.from(el,{y:22,duration:.4,ease:'power3.out'});
              }
            });
          });
        },{threshold:.08,rootMargin:'0px 0px -25px 0px'});
        document.querySelectorAll('.file-art,.file-copy h2,.ethos-frame,.artwork-copy .display-title,.selected-portrait,.footer-top>p,.footer-cat').forEach(el=>observer?.observe(el));
        const pointer=document.querySelector<HTMLElement>('.scene-pointer');
        if(pointer&&matchMedia('(hover:hover) and (pointer:fine)').matches){
          const rx=gsap.quickTo(pointer,'rotationY',{duration:.18,ease:'power2.out'});
          const ry=gsap.quickTo(pointer,'rotationX',{duration:.18,ease:'power2.out'});
          const tx=gsap.quickTo(pointer,'x',{duration:.18,ease:'power2.out'});
          const move=(event:PointerEvent)=>{
            if(frozen||document.hidden||scrollY>innerHeight)return;
            const x=event.clientX/innerWidth-.5,y=event.clientY/innerHeight-.5;
            rx(x*8);ry(-y*5);tx(x*16);
          };
          const reset=()=>{rx(0);ry(0);tx(0);};
          document.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',reset);
          disposePointer=()=>{document.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',reset);rx.tween.kill();ry.tween.kill();tx.tween.kill();};
        }
      });
    };
    const freeze=()=>{frozen=true;context?.getTweens().forEach((tween:gsap.core.Tween)=>tween.pause());};
    setup();updateProgress();
    const preferenceObserver=new MutationObserver(setup);preferenceObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-motion']});
    document.addEventListener('anon-cat:freeze',freeze);
    window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
    return()=>{preferenceObserver.disconnect();observer?.disconnect();disposePointer();context?.revert();cancelAnimationFrame(frame);document.removeEventListener('anon-cat:freeze',freeze);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);};
  },[]);
  return null;
}
