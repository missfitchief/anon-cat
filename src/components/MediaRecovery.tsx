'use client';
import {useEffect} from 'react';

// A cached image may fail before hydration installs React's onError handlers.
// Recover both those early failures and later failures using the same local PNG.
export default function MediaRecovery(){
  useEffect(()=>{
    const recover=(img:HTMLImageElement)=>{
      const source=img.currentSrc||img.src;
      if(!source.endsWith('.webp'))return;
      img.closest('picture')?.querySelectorAll('source').forEach(el=>el.removeAttribute('srcset'));
      img.src=source.replace(/hero-cat-mobile\.webp$/,'hero-cat.webp').replace(/\.webp$/,'.png');
    };
    const onError=(event:Event)=>{if(event.target instanceof HTMLImageElement)recover(event.target);};
    const onLoad=(event:Event)=>{if(event.target instanceof HTMLImageElement)event.target.removeAttribute('data-deferred-src');};
    document.addEventListener('error',onError,true);
    document.addEventListener('load',onLoad,true);
    document.querySelectorAll('img').forEach(img=>{if(img.complete&&img.naturalWidth===0)recover(img);});
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const img=entry.target as HTMLImageElement;observer.unobserve(img);img.src=img.dataset.deferredSrc!;
    }),{rootMargin:'350px'});
    document.querySelectorAll('img[data-deferred-src]').forEach(img=>observer.observe(img));
    return()=>{observer.disconnect();document.removeEventListener('error',onError,true);document.removeEventListener('load',onLoad,true);};
  },[]);
  return null;
}
