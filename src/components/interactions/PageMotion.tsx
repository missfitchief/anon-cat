'use client';
import {useEffect} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {motion} from '@/config/motion';
gsap.registerPlugin(ScrollTrigger);
export default function PageMotion(){
  useEffect(()=>{
    let context:gsap.Context|null=null;
    let media:gsap.MatchMedia|null=null;
    let introPlayed=false;
    let frozen=false;
    let animations:gsap.core.Animation[]=[];
    let disposePointer=()=>{};
    const quiet=()=>{
      let stored=false;try{stored=localStorage.getItem(motion.storageKey)==='off';}catch{}
      return stored||document.documentElement.dataset.motion==='off'||matchMedia('(prefers-reduced-motion: reduce)').matches;
    };
    const setup=()=>{
      disposePointer();media?.revert();context?.revert();animations=[];
      document.querySelector('.ethos-cinema')?.classList.remove('is-cinematic');
      document.documentElement.removeAttribute('data-cinema');
      if(quiet())return;
      frozen=false;
      document.documentElement.dataset.cinema='on';
      context=gsap.context(()=>{
        const track=<T extends gsap.core.Animation>(animation:T)=>{animations.push(animation);return animation;};
        if(!introPlayed && window.scrollY<150){
          introPlayed=true;
          const narrow=window.innerWidth<=700;
          // Arrive at the same static poster. Never gate the page or controls.
          const entrance=track(gsap.timeline({defaults:{ease:'expo.out'}}));
          entrance.from('.scene-art',{scale:narrow?1.12:1.18,y:narrow?45:100,rotation:3,duration:1.8,transformOrigin:'65% 80%'},0)
            .from('.architecture',{y:100,duration:1.6},0)
            .from('.scene-front',{x:170,duration:1.65},.1)
            .from('.hero-copy h1>span',{y:narrow?28:60,skewY:narrow?2:4,scaleX:.92,stagger:.12,duration:1.2,transformOrigin:'0% 100%'},.1)
            .from('.hero-copy .eyebrow',{x:-50,duration:1},.2)
            .from('.hero-copy .hero-intro',{y:narrow?8:20,duration:1.1},.5)
            .fromTo('.scene-arrival span',{x:0,xPercent:0},{x:0,xPercent:130,stagger:.12,duration:1.1,ease:'power4.inOut'},0)
            .from('.hero-ghost',{rotation:-12,duration:2},0);
        }
        track(gsap.to('.scroll-progress',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:true}}));
        media=gsap.matchMedia();
        media.add({desktop:'(min-width:1001px)',mobile:'(max-width:1000px)'},(mm)=>{
          const desktop=!!mm.conditions?.desktop;
          // Move the complete stage together; hide owns inner character travel.
          track(gsap.to('.scene-camera',{y:desktop?105:45,scale:desktop?1.13:1.04,rotation:desktop?-2:0,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.7}}));
          track(gsap.to('.hero-copy',{y:desktop?-85:-28,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.6}}));
          track(gsap.to('.hero-ghost',{x:desktop?-200:-50,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}}));
          track(gsap.from('.file-art',{y:desktop?160:65,rotation:desktop?-7:-3,scale:desktop?.79:.9,duration:1.5,ease:'power3.out',scrollTrigger:{trigger:'.file-art',start:'top 90%',end:'top 30%',scrub:.7}}));
          track(gsap.from('.file-orange-disc',{scale:.25,rotation:-90,ease:'none',scrollTrigger:{trigger:'.file-art',start:'top 100%',end:'top 35%',scrub:.7}}));
          track(gsap.from('.file-copy h2',{x:desktop?130:40,rotation:desktop?3:0,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:'.file-copy',start:'top 88%',once:true}}));
          track(gsap.from('.file-row',{x:desktop?100:35,opacity:.35,stagger:.09,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.character-file',start:'top 88%',once:true}}));
          const cinema=document.querySelector<HTMLElement>('.ethos-cinema');
          if(desktop && cinema){
            cinema.classList.add('is-cinematic');
            const story=track(gsap.timeline({scrollTrigger:{id:'privacy-story',trigger:cinema,start:'top 6%',end:()=>`+=${Math.round(innerHeight*1.75)}`,pin:true,scrub:.65,anticipatePin:1,invalidateOnRefresh:true,
              onUpdate:self=>{cinema.dataset.storyProgress=self.progress.toFixed(3);const index=self.progress<.35?'01':self.progress<.7?'02':'03';const label=cinema.querySelector('.story-current');if(label)label.textContent=index;}}}));
            gsap.set('.silhouette-frame,.relaxed-frame',{clipPath:'inset(0 0 0 100%)'});
            gsap.set('.privacy-shutters span',{x:0,xPercent:330});
            story.from('.ethos-heading h2',{y:100,rotation:-4,scale:.86,duration:1,ease:'power3.out'},0)
              .from('.panel-frame img',{scale:1.25,xPercent:8,duration:2,ease:'none'},0)
              .to('.privacy-shutters span',{x:0,xPercent:-330,duration:.9,stagger:.07,ease:'power3.inOut'},1.2)
              .to('.panel-frame',{clipPath:'inset(0 100% 0 0)',duration:.9,ease:'power3.inOut'},1.25)
              .to('.silhouette-frame',{clipPath:'inset(0 0 0 0%)',duration:.9,ease:'power3.inOut'},1.25)
              .from('.silhouette-frame img',{xPercent:-32,scale:1.15,duration:1.9,ease:'none'},1.3)
              .to('.silhouette-occluder',{xPercent:50,duration:1.3,ease:'power2.inOut'},1.7)
              .fromTo('.privacy-shutters span',{x:0,xPercent:330},{x:0,xPercent:-330,duration:.9,stagger:.07,ease:'power3.inOut',immediateRender:false},3.4)
              .to('.silhouette-frame',{clipPath:'inset(0 100% 0 0)',duration:.9,ease:'power3.inOut'},3.45)
              .to('.relaxed-frame',{clipPath:'inset(0 0 0 0%)',duration:.9,ease:'power3.inOut'},3.45)
              .from('.relaxed-frame img',{scale:1.25,duration:2,ease:'none'},3.5)
              .to('.ethos-heading h2 em',{scale:1.15,x:12,duration:5.5,ease:'none',transformOrigin:'0% 50%'},0)
              .fromTo('.story-progress-track i',{scaleX:0},{scaleX:1,duration:5.5,ease:'none'},0);
          }else{
            gsap.utils.toArray<HTMLElement>('.ethos-frame').forEach((frame,index)=>{
              track(gsap.from(frame,{clipPath:index%2?'inset(0 0 0 100%)':'inset(0 100% 0 0)',scale:.92,ease:'power3.out',scrollTrigger:{trigger:frame,start:'top 93%',end:'top 38%',scrub:.55}}));
              track(gsap.from(frame.querySelector('img'),{scale:1.2,xPercent:index===1?-22:0,ease:'none',scrollTrigger:{trigger:frame,start:'top bottom',end:'bottom top',scrub:.7}}));
            });
          }
          track(gsap.from('.selected-portrait',{y:desktop?180:75,rotation:-14,scale:.76,ease:'power3.out',scrollTrigger:{trigger:'.artwork-grid',start:'top 95%',end:'top 25%',scrub:.7}}));
          track(gsap.from('.artwork-copy .display-title',{x:desktop?-120:-35,skewY:-3,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:'.artwork-copy',start:'top 90%',once:true}}));
          track(gsap.from('.footer-top>p',{x:desktop?-150:-45,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:'.footer',start:'top 95%',once:true}}));
          track(gsap.from('.footer-cat',{y:110,rotation:-20,duration:1,ease:'back.out(1.5)',scrollTrigger:{trigger:'.footer',start:'top 85%',once:true}}));
          return()=>{cinema?.classList.remove('is-cinematic');};
        });
        gsap.utils.toArray<HTMLElement>('.section-top').forEach(el=>track(gsap.from(el,{clipPath:'inset(0 100% 0 0)',duration:1.1,ease:'expo.inOut',scrollTrigger:{trigger:el,start:'top 95%',once:true}})));
        const pointer=document.querySelector<HTMLElement>('.scene-pointer');
        if(pointer && matchMedia('(hover:hover) and (pointer:fine)').matches){
          const rx=gsap.quickTo(pointer,'rotationY',{duration:.9,ease:'power3.out'});
          const ry=gsap.quickTo(pointer,'rotationX',{duration:.9,ease:'power3.out'});
          const tx=gsap.quickTo(pointer,'x',{duration:.9,ease:'power3.out'});
          const move=(event:PointerEvent)=>{if(frozen||document.hidden||scrollY>innerHeight)return;const x=event.clientX/innerWidth-.5;const y=event.clientY/innerHeight-.5;rx(x*9);ry(-y*6);tx(x*18);};
          const reset=()=>{rx(0);ry(0);tx(0);};
          document.addEventListener('pointermove',move);document.addEventListener('pointerleave',reset);
          disposePointer=()=>{document.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',reset);rx.tween.kill();ry.tween.kill();tx.tween.kill();};
        }
      });
      ScrollTrigger.refresh();
    };
    const freeze=()=>{frozen=true;animations.forEach(animation=>animation.pause());};
    setup();
    const observer=new MutationObserver(setup);observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-motion']});
    document.addEventListener('anon-cat:freeze',freeze);
    const refresh=()=>ScrollTrigger.refresh();window.addEventListener('load',refresh);
    return()=>{observer.disconnect();disposePointer();media?.revert();context?.revert();document.querySelector('.ethos-cinema')?.classList.remove('is-cinematic');document.documentElement.removeAttribute('data-cinema');document.removeEventListener('anon-cat:freeze',freeze);window.removeEventListener('load',refresh);};
  },[]);
  return null;
}
