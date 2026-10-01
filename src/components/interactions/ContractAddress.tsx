'use client';
import {useEffect,useRef,useState} from 'react';
import {site} from '@/config/site';

function copyFallback(value:string){
  const active=document.activeElement as HTMLElement|null;
  const field=document.createElement('textarea');field.value=value;field.readOnly=true;
  field.style.cssText='position:fixed;top:0;left:0;width:1px;height:1px;opacity:0';
  document.body.appendChild(field);field.focus({preventScroll:true});field.select();
  try{return document.execCommand('copy');}catch{return false;}
  finally{field.remove();active?.focus({preventScroll:true});}
}
function CopyIcon({copied}:{copied:boolean}){return <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{copied?<path d="m4 10 4 4 8-8"/>:<><rect x="7" y="7" width="10" height="10" rx="1"/><path d="M12 5V3H3v9h2"/></>}</svg>;}
export default function ContractAddress({compact=false}:{compact?:boolean}){
  const [status,setStatus]=useState<'idle'|'copied'|'failed'>('idle');
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null),mounted=useRef(false);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;if(timer.current)clearTimeout(timer.current);};},[]);
  const address=site.assetIdentifier;if(!address)return null;
  const copy=async()=>{
    let success=false;
    try{await navigator.clipboard.writeText(address);success=true;}catch{success=copyFallback(address);}
    if(!mounted.current)return;
    if(timer.current)clearTimeout(timer.current);
    setStatus(success?'copied':'failed');timer.current=setTimeout(()=>setStatus('idle'),2500);
  };
  const message=status==='copied'?'Contract address copied.':status==='failed'?'Copy unavailable. Select the full address in the footer.':'';
  if(compact)return <div className="contract-compact"><button type="button" onClick={copy} aria-label={`Copy contract address ${address}`} title={message||address}><span>CA</span><code className="contract-short" aria-hidden="true">{address.slice(0,4)}…{address.slice(-4)}</code><CopyIcon copied={status==='copied'}/></button><span className="sr-only" role="status">{message}</span></div>;
  return <div className="contract-full"><span className="contract-label">Official CA</span><code>{address}</code><button type="button" onClick={copy} aria-label={`Copy contract address ${address}`}><span>{status==='copied'?'Copied':'Copy'}</span><CopyIcon copied={status==='copied'}/></button><span className={status==='failed'?'contract-copy-error':'sr-only'} role="status">{message}</span></div>;
}
