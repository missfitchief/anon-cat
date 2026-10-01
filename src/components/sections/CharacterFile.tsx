'use client';
import {useState} from 'react';
import {site} from '@/config/site';
import DeferredImage from '@/components/DeferredImage';
export default function CharacterFile(){
  const [redacted,setRedacted]=useState(false);
  return <section className="file-section" id="file" aria-labelledby="file-heading">
    <div className="section-top"><span className="eyebrow">THE CAT</span><span className="tiny-label">NOTHING TO DECLARE</span></div>
    <div className="file-grid">
      <div className="file-art"><span className="file-corner">IDENTITY: OPTIONAL</span><div className="file-orange-disc" aria-hidden="true"/><DeferredImage className="file-plinth" src="/assets/environments/file-plinth.webp" alt="" aria-hidden="true" width="900" height="600"/><DeferredImage className="seated-cat" src={site.assets.seated} alt="The orange cat in its ribbed gray disguise, sitting comfortably with a knowing expression." width="1000" height="1200"/><span className="art-footnote">Seen here. Knows you saw.</span></div>
      <div className="file-copy"><h2 id="file-heading" className="display-title">A VERY PRIVATE<br/>INDIVIDUAL.</h2><p className="section-description">Happy to be here.<br/>Less happy to elaborate.</p>
        <div className={`character-file ${redacted?'is-redacted':''}`}><div className="file-header"><span>PERSONAL FILE</span><span className="file-stamp"><span>IDENTITY</span> <span>UNKNOWN</span></span></div>
          <dl>{site.file.map(field=><div className="file-row" key={field.label}><dt>{field.label}</dt><dd><span className="file-value" aria-hidden={redacted}>{field.value}</span>{redacted&&<span className="sr-only">Withheld by the cat.</span>}<span className="redaction-bar" aria-hidden="true"/></dd></div>)}</dl>
          <div className="file-bottom"><span>VOLUNTARY DISCLOSURE: ZERO</span><span aria-hidden="true">✳</span></div>
        </div>
        <button className="button dark-button" onClick={()=>setRedacted(!redacted)} aria-pressed={redacted}>{redacted?'Show the file':'Too much information'}<span aria-hidden="true">{redacted?'+':'−'}</span></button>
        <span className="sr-only" role="status">{redacted?'All five fictional details are redacted.':'The fictional character file is visible.'}</span>
      </div>
    </div>
  </section>;
}
