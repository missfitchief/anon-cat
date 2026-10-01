import {site} from '@/config/site';
import DeferredImage from '@/components/DeferredImage';
export default function PrivacyEthos(){return <section className="ethos-section" id="ethos" aria-labelledby="ethos-heading">
  <div className="section-top"><span className="eyebrow">02 / THE INSTINCT</span><span className="tiny-label">ACCESS IS OPTIONAL</span></div>
  <div className="ethos-cinema">
  <div className="ethos-heading"><h2 className="display-title" id="ethos-heading">SOME THINGS<br/>ARE <em>YOURS.</em></h2><p>Curiosity is allowed.<br/>Access is optional.</p></div>
  <div className="ethos-sequence">
    <figure className="ethos-frame panel-frame"><DeferredImage src="/assets/portraits/peek.webp" width="1024" height="1024" alt="The cat watches from behind a dark panel."/><figcaption><span>01</span>Not every detail needs an audience.</figcaption></figure>
    <figure className="ethos-frame silhouette-frame"><DeferredImage src="/assets/character/step-cat.webp" width="800" height="1300" alt="The cat is only partly visible in a narrow opening."/><div className="silhouette-occluder" aria-hidden="true"/><figcaption><span>02</span>Privacy has claws.</figcaption></figure>
    <figure className="ethos-frame relaxed-frame"><DeferredImage src="/assets/portraits/relaxed.webp" width="1024" height="1024" alt="The disguised cat relaxes in its own warm, quiet space."/><figcaption><span>03</span>Make yourself unavailable.</figcaption></figure>
  </div>
  </div>
  <div className="monero-editorial"><p className="eyebrow"><span className="orange-rule"/> THE MONERO CONNECTION</p><div><p>Privacy is an instinct here.<br/>In Monero, it’s part of the design.</p><p className="monero-explanation">Monero is a cryptocurrency focused on private transactions. Its privacy technologies conceal the sender, recipient, and amount. This independent character project takes inspiration from that ethos.</p><a className="text-link" href={site.moneroUrl} target="_blank" rel="noopener noreferrer">Explore Monero <span className="external-label">OFFICIAL SITE</span></a></div></div>
</section>;}
