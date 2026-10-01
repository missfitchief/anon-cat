import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

// Capture the actual production website, without composited or invented frames.
const browser=await chromium.launch();
const temp=path.resolve('../../work/motion-capture');await fs.mkdir(temp,{recursive:true});
const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:temp,size:{width:1440,height:900}}});
const page=await context.newPage();const video=page.video();
const glide=async(y,duration)=>page.evaluate(({y,duration})=>new Promise(resolve=>{
  const from=scrollY;const start=performance.now();
  const tick=now=>{const t=Math.min(1,(now-start)/duration);const ease=.5-Math.cos(Math.PI*t)/2;window.scrollTo({top:from+(y-from)*ease,behavior:'instant'});if(t<1)requestAnimationFrame(tick);else resolve();};
  requestAnimationFrame(tick);
}),{y,duration});
await page.goto('http://127.0.0.1:3001/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(2500);
await page.getByRole('button',{name:'Go incognito'}).click();await page.waitForTimeout(2600);
await page.getByRole('button',{name:'Come back'}).click();await page.waitForTimeout(1600);
const file=await page.locator('#file').evaluate(el=>el.getBoundingClientRect().top+scrollY-96);await glide(file,1100);await page.waitForTimeout(700);
await page.getByRole('button',{name:'Too much information'}).click();await page.waitForTimeout(700);
const story=await page.locator('.ethos-cinema').evaluate(el=>el.getBoundingClientRect().top+scrollY-innerHeight*.06);await glide(story,1100);await glide(story+900*1.75,5000);await page.waitForTimeout(900);
const art=await page.locator('#artwork').evaluate(el=>el.getBoundingClientRect().top+scrollY-96);await glide(art,1100);await page.waitForTimeout(700);
await page.getByRole('button',{name:'02 Peek',exact:true}).click();await page.waitForTimeout(1100);
await page.getByRole('button',{name:'03 Relaxed',exact:true}).click();await page.waitForTimeout(1200);
await page.screenshot({path:'docs/screenshots/portrait-stack.png'});
await context.close();await video.saveAs(path.resolve('../anon-cat-motion-preview.webm'));await browser.close();
console.log('Saved actual production browser recording: ../anon-cat-motion-preview.webm');
