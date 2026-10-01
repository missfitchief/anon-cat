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
      img.src=source.replace(/\.webp$/,'.png');
    };
    const onError=(event:Event)=>{if(event.target instanceof HTMLImageElement)recover(event.target);};
    document.addEventListener('error',onError,true);
    document.querySelectorAll('img').forEach(img=>{if(img.complete&&img.naturalWidth===0)recover(img);});
    return()=>document.removeEventListener('error',onError,true);
  },[]);
  return null;
}
