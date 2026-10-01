import type {ImgHTMLAttributes} from 'react';
// Native lazy loading preserves real image markup with or without hydration.
export default function DeferredImage({src,alt='',...props}:ImgHTMLAttributes<HTMLImageElement>&{src:string}){
  return <img {...props} src={src} alt={alt} loading="lazy" decoding="async" fetchPriority="low"/>;
}
