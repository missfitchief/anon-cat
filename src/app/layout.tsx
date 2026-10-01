import type { Metadata } from 'next';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-600.css';
import './globals.css';
import './motion.css';
import {site} from '@/config/site';
export const metadata: Metadata = { title: `${site.name} — Private by instinct`, description:site.description, icons:{icon:'/favicon.svg'}, robots:{index:false,follow:false} };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:"try{document.documentElement.dataset.motion=matchMedia('(prefers-reduced-motion: reduce)').matches||localStorage.getItem('anon-cat-motion')==='off'?'off':'on'}catch{document.documentElement.dataset.motion='off'}"}}/><noscript><style>{'img[data-deferred-src]{display:none}'}</style></noscript></head><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
