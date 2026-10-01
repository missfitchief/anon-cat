import type { Metadata } from 'next';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import './globals.css';
import {site} from '@/config/site';
export const metadata: Metadata = { title: `${site.name} — Private by instinct`, description:site.description, icons:{icon:'/favicon.svg'}, robots:{index:false,follow:false} };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
