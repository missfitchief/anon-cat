import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('docs/screenshots',{recursive:true});
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'});
await page.evaluate(()=>document.fonts.ready);
await page.screenshot({path:'docs/screenshots/hero-proof-desktop.png'});
await browser.close();
