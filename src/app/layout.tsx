import type { Metadata } from 'next';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-600.css';
import './globals.css';
import './motion.css';
import {site} from '@/config/site';
export const metadata: Metadata = { title: `${site.name} — Private by instinct`, description:site.description, icons:{icon:'/favicon.svg'}, robots:{index:false,follow:false} };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:"(()=>{try{const saved=localStorage.getItem('anon-cat-motion');document.documentElement.dataset.motion=saved==='off'||(saved!=='on'&&matchMedia('(prefers-reduced-motion: reduce)').matches)?'off':'on'}catch{document.documentElement.dataset.motion='off'}})()"}}/></head><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
