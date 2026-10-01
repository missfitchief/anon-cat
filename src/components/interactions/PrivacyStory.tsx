'use client';
import {useEffect,useRef,type ReactNode} from 'react';
import gsap from 'gsap';

export default function PrivacyStory({children}:{children:ReactNode}){
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=root.current;
    if(!el)return;
    let disposed=false,started=false;
    let initialArtwork=location.hash==='#artwork';
    const cancelInitialAnchor=()=>{initialArtwork=false;};
    window.addEventListener('wheel',cancelInitialAnchor,{passive:true});
    window.addEventListener('touchstart',cancelInitialAnchor,{passive:true});
    let context:gsap.Context|null=null;
    let media:gsap.MatchMedia|null=null;
    let refresh=()=>{};
    const initialize=async()=>{
      if(started)return;started=true;
      el.querySelectorAll<HTMLImageElement>('img').forEach(img=>{img.loading='eager';});
      // Load scroll choreography near this section, outside the hero's first requests.
      const {ScrollTrigger}=await import('gsap/ScrollTrigger');
      if(disposed)return;
      const following=document.querySelector('#artwork');
      const alignInitialAnchor=()=>{if(!disposed&&initialArtwork&&location.hash==='#artwork')following?.scrollIntoView({block:'start',behavior:'instant'});};
      const preserveFollowing=el.getBoundingClientRect().bottom<0&&following;
      const followingTop=preserveFollowing?following.getBoundingClientRect().top:0;
      gsap.registerPlugin(ScrollTrigger);
      context=gsap.context(()=>{
        media=gsap.matchMedia();
        media.add({desktop:'(min-width:1001px)',compact:'(max-width:1000px)'},mm=>{
          if(mm.conditions?.desktop){
            el.classList.add('is-cinematic');
            const story=gsap.timeline({scrollTrigger:{id:'privacy-story',trigger:el,start:'top 6%',end:()=>`+=${Math.round(innerHeight*1.75)}`,pin:true,scrub:true,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>{
              el.dataset.storyProgress=self.progress.toFixed(3);
              const chapter=self.progress<.35?'01':self.progress<.7?'02':'03';
              el.dataset.storyChapter=chapter;
            }}});
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
              .to('.ethos-heading h2 em',{scale:1.15,x:12,duration:5.5,ease:'none',transformOrigin:'0% 50%'},0);
          }else{
            gsap.utils.toArray<HTMLElement>('.ethos-frame').forEach((item,index)=>{
              gsap.from(item,{clipPath:index%2?'inset(0 0 0 100%)':'inset(0 100% 0 0)',scale:.92,ease:'power3.out',scrollTrigger:{trigger:item,start:'top 93%',end:'top 38%',scrub:true}});
              gsap.from(item.querySelector('img'),{scale:1.2,xPercent:index===1?-22:0,ease:'none',scrollTrigger:{trigger:item,start:'top bottom',end:'bottom top',scrub:true}});
            });
          }
          return()=>{el.classList.remove('is-cinematic');delete el.dataset.storyProgress;delete el.dataset.storyChapter;};
        });
      },el);
      refresh=()=>{if(!disposed)ScrollTrigger.refresh();};
      refresh();
      if(preserveFollowing){const change=following.getBoundingClientRect().top-followingTop;if(Math.abs(change)>1)window.scrollBy({top:change,behavior:'instant'});}
      alignInitialAnchor();
      document.fonts.ready.then(()=>{refresh();requestAnimationFrame(()=>{alignInitialAnchor();initialArtwork=false;});});
      window.addEventListener('load',refresh);
      el.dataset.storyReady='true';
    };
    const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();void initialize().catch(()=>{media?.revert();context?.revert();el.classList.remove('is-cinematic');el.dataset.storyReady='fallback';});}},{rootMargin:'800px'});
    observer.observe(el);
    return()=>{disposed=true;observer.disconnect();window.removeEventListener('load',refresh);window.removeEventListener('wheel',cancelInitialAnchor);window.removeEventListener('touchstart',cancelInitialAnchor);media?.revert();context?.revert();el.classList.remove('is-cinematic');};
  },[]);
  return <div className="ethos-cinema" ref={root}>{children}</div>;
}
