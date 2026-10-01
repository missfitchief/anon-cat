'use client';
import {useEffect} from 'react';
import gsap from 'gsap';

export default function PageMotion(){
  useEffect(()=>{
    let context:gsap.Context|null=null;
    let observer:IntersectionObserver|null=null;
    let disposePointer=()=>{};
    let frozen=false;
    let generation=0;
    const progress=document.querySelector<HTMLElement>('.scroll-progress');
    let frame=0;
    const updateProgress=()=>{
      frame=0;
      const length=document.documentElement.scrollHeight-innerHeight;
      if(progress)progress.style.transform=`scaleX(${length>0?scrollY/length:0})`;
    };
    const onScroll=()=>{if(!frame)frame=requestAnimationFrame(updateProgress);};
    const setup=()=>{
      const current=++generation;
      observer?.disconnect();disposePointer();context?.revert();frozen=false;
      context=gsap.context(()=>{
        // Other sections stay in native flow; PrivacyStory owns the ethos stage.
        const visible=new WeakSet<Element>();
        observer=new IntersectionObserver(entries=>{
          entries.forEach(entry=>{
            if(!entry.isIntersecting){visible.delete(entry.target);return;}
            if(frozen||visible.has(entry.target))return;
            visible.add(entry.target);
            // An entrance must run on loaded artwork, and replay on re-entry.
            const images=Array.from(entry.target.querySelectorAll<HTMLImageElement>('img'));
            Promise.allSettled(images.map(img=>img.decode().catch(()=>img.decode()))).then(()=>{
              if(current!==generation||frozen||!visible.has(entry.target)||images.some(img=>img.naturalWidth===0))return;
              context?.add(()=>{
              const el=entry.target;
              if(el.matches('.file-art')){
                gsap.fromTo(el,{y:60,rotation:-3,scale:.94},{y:0,rotation:0,scale:1,duration:.65,ease:'power3.out',overwrite:'auto'});
                gsap.fromTo('.file-orange-disc',{scale:.75},{scale:1,duration:.65,ease:'power3.out',overwrite:'auto'});
              }else{
                gsap.fromTo(el,{y:32},{y:0,duration:.5,ease:'power3.out',overwrite:'auto'});
              }
              });
            });
          });
        },{threshold:.08,rootMargin:'0px 0px -25px 0px'});
        document.querySelectorAll('.file-art,.file-copy h2,.footer-top>p,.footer-cat').forEach(el=>observer?.observe(el));
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
    document.addEventListener('anon-cat:freeze',freeze);
    window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
    return()=>{generation++;observer?.disconnect();disposePointer();context?.revert();cancelAnimationFrame(frame);document.removeEventListener('anon-cat:freeze',freeze);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);};
  },[]);
  return null;
}
