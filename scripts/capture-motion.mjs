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
await page.goto('http://127.0.0.1:3001/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(2600);
await page.mouse.move(1140,250);await page.waitForTimeout(200);await page.mouse.move(850,550);await page.waitForTimeout(200);
await page.getByRole('button',{name:'Go incognito'}).click();await page.waitForTimeout(850);
await page.getByRole('button',{name:'Come back'}).click();await page.waitForTimeout(700);
await page.screenshot({path:'docs/screenshots/hero-fast-desktop.png'});
const file=await page.locator('#file').evaluate(el=>el.getBoundingClientRect().top+scrollY-96);await glide(file,650);await page.waitForTimeout(450);
await page.getByRole('button',{name:'Too much information'}).click();await page.waitForTimeout(300);
const story=await page.locator('#ethos').evaluate(el=>el.getBoundingClientRect().top+scrollY-96);await glide(story,650);await page.waitForTimeout(500);
await page.locator('.ethos-cinema.is-cinematic[data-story-ready="true"]').waitFor();
const storyBounds=await page.locator('.pin-spacer').evaluate(el=>({start:el.getBoundingClientRect().top+scrollY-innerHeight*.06,span:Math.round(innerHeight*1.75)}));
for(const progress of [.08,.31,.52,.73,.94]){await glide(storyBounds.start+storyBounds.span*progress,700);await page.waitForTimeout(250);}
const art=await page.locator('#artwork').evaluate(el=>el.getBoundingClientRect().top+scrollY-96);await glide(art,650);await page.waitForTimeout(450);
await page.getByRole('button',{name:'Peek',exact:true}).click();await page.waitForTimeout(450);
await page.getByRole('button',{name:'Relaxed',exact:true}).click();await page.waitForTimeout(450);
await page.locator('.portrait-options').screenshot({path:'docs/screenshots/portrait-options-clean.png'});
await page.screenshot({path:'docs/screenshots/portrait-stack.png'});
await context.close();await video.saveAs(path.resolve('../anon-cat-motion-preview.webm'));await browser.close();
console.log('Saved actual production browser recording: ../anon-cat-motion-preview.webm');
