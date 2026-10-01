import {site} from '@/config/site';
import ContractAddress from '@/components/interactions/ContractAddress';
export default function Footer(){return <footer className="footer">
  <div className="footer-top">
    <a href="#top" className="brand"><img src="/assets/brand/cat-logo.png" alt="" width="52" height="52"/>{site.name}</a>
    <p>YOU SAW <span>NOTHING.</span></p>
    <div className="footer-peek" aria-hidden="true">
      <img className="footer-cat" src={site.assets.peek} alt="" width="891" height="1200" loading="lazy" decoding="async"/>
      <span className="footer-peek-panel"/>
      <img className="footer-cat footer-cat-paw" src={site.assets.peek} alt="" width="891" height="1200" loading="lazy" decoding="async"/>
      <span className="footer-peek-sill"/>
    </div>
  </div>
  <ContractAddress/>
  <div className="footer-bottom"><span>Independent. Privacy-minded. Cat.</span><div className="footer-links">{site.socials.map(s=><a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>)}<a href="#top">Back to top ↑</a></div><span>© {site.name} 2026</span></div>
</footer>;}
