'use client';
import {useEffect} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {motion} from '@/config/motion';
gsap.registerPlugin(ScrollTrigger);
export default function PageMotion(){
  useEffect(()=>{
    let context:gsap.Context|null=null;
    const setup=()=>{
      context?.revert();
      if(document.documentElement.dataset.motion==='off'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      context=gsap.context(()=>{
        gsap.utils.toArray<HTMLElement>('.section-top,.file-copy h2,.ethos-heading,.artwork-copy h2').forEach(el=>{
          // Keep every word visible even before its section scrolls into view.
          gsap.from(el,{y:22,duration:motion.reveal,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}});
        });
      });
    };
    setup();const observer=new MutationObserver(setup);observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-motion']});
    return()=>{observer.disconnect();context?.revert();};
  },[]);
  return null;
}
