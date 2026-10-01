import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('docs/reference-screenshots',{recursive:true});
const browser=await chromium.launch();
for(const [width,height]of [[1440,900],[390,844]]){
  const page=await browser.newPage({viewport:{width,height}});
  try{
    await page.goto('https://wodlwodl.com/',{waitUntil:'domcontentloaded',timeout:30000});
    const enter=page.getByRole('button',{name:'Waddle in'});if(await enter.isVisible())await enter.click();
    await page.getByRole('heading',{name:/WODL ON/i}).waitFor({state:'visible'});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(1200);
    await page.screenshot({path:`docs/reference-screenshots/wodl-${width}-hero.png`});
    await page.getByRole('link',{name:'Memes',exact:true}).click();
    await page.waitForTimeout(700);
    await page.screenshot({path:`docs/reference-screenshots/wodl-${width}-memes.png`});
    await fs.writeFile(`docs/reference-screenshots/wodl-${width}-text.txt`,await page.locator('body').innerText());
  }catch(e){await fs.writeFile(`docs/reference-screenshots/wodl-${width}-limitation.txt`,String(e));}
  await page.close();
}
const page=await browser.newPage({viewport:{width:1440,height:900}});
await page.goto('https://watch.claynosaurz.com/',{waitUntil:'domcontentloaded'});
await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'docs/reference-screenshots/claynosaurz-current.png'});
await browser.close();
