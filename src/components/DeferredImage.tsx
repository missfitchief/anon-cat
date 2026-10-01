import type {ImgHTMLAttributes} from 'react';
// MediaRecovery starts these requests close to the viewport, after critical hero media.
// The ordinary image remains available when JavaScript is disabled.
export default function DeferredImage({src,alt='',...props}:ImgHTMLAttributes<HTMLImageElement>&{src:string}){
  return <><img {...props} alt={alt} data-deferred-src={src} decoding="async" fetchPriority="low"/><noscript className="deferred-fallback"><img {...props} alt={alt} src={src} loading="lazy"/></noscript></>;
}
