import {motion} from '@/config/motion';
export function quietMotion(){
  const value=document.documentElement.dataset.motion;
  if(value==='on'||value==='off')return value==='off';
  let saved:string|null=null;try{saved=localStorage.getItem(motion.storageKey);}catch{}
  return saved==='off'||(saved!=='on'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
}
