import type { Metadata } from 'next';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-600.css';
import './globals.css';
import './motion.css';
import './trace.css';
import './contract.css';
import {site} from '@/config/site';
export const metadata: Metadata = { title: `${site.name} — Private by instinct`, description:site.description, icons:{icon:{url:'/cat-favicon.png',type:'image/png',sizes:'64x64'}}, robots:{index:false,follow:false} };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) {
  return <html lang="en" data-motion="on"><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
