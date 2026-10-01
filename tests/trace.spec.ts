import {test,expect,type Page} from '@playwright/test';

async function openScene(page:Page){
  await page.goto('/#artwork');
  await expect(page.locator('#artwork')).toHaveAttribute('data-trace-ready','true');
  await expect.poll(()=>page.locator('.trace-cat').evaluate(el=>Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m41))).toBeLessThan(.1);
}

test('brushing removes local pawprints and keyboard clearing changes the cat pose',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await openScene(page);
  await expect(page.locator('.portrait-options,a[download]')).toHaveCount(0);
  await page.screenshot({path:'docs/screenshots/trace-room-desktop.png'});
  const first=await page.locator('.trace-print').first().boundingBox();expect(first).not.toBeNull();
  await page.mouse.move(first!.x+first!.width/2,first!.y+first!.height/2);
  await expect.poll(()=>page.locator('.trace-print[data-erased=true]').count()).toBeGreaterThan(0);
  expect(await page.locator('.trace-print[data-erased=true]').count()).toBeLessThan(9);
  await expect.poll(()=>page.locator('.trace-print').first().locator('svg').evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(0);
  const clear=page.getByRole('button',{name:'Clear the trail',exact:true});await clear.focus();await page.keyboard.press('Enter');
  await expect(page.locator('#artwork')).toHaveAttribute('data-trace-state','cleared');
  await expect.poll(()=>page.locator('.trace-seated').evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(1);
  await expect(page.locator('#trace-instruction')).toHaveText('Still here. Less to follow.');
  await page.screenshot({path:'docs/screenshots/trace-room-cleared.png'});
});

test('rapid clear and restart actions settle on the final trail without duplicate scene work',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await openScene(page);
  await page.evaluate(()=>{const button=document.querySelector<HTMLButtonElement>('.trace-action button')!;for(let i=0;i<10;i++)button.click();});
  await expect(page.locator('#artwork')).toHaveAttribute('data-trace-state','trail');
  await expect(page.locator('.trace-print[data-erased=true]')).toHaveCount(0);
  await expect.poll(()=>page.locator('.trace-print svg').evaluateAll(nodes=>nodes.every(el=>Number(getComputedStyle(el).opacity)===1))).toBe(true);
  await page.getByRole('button',{name:'Clear the trail',exact:true}).click();
  await expect(page.locator('#artwork')).toHaveAttribute('data-trace-state','cleared');
  await expect.poll(()=>page.locator('.trace-print svg').evaluateAll(nodes=>nodes.every(el=>Number(getComputedStyle(el).opacity)===0))).toBe(true);
  await page.locator('#top').scrollIntoViewIfNeeded();
  await expect.poll(()=>page.locator('.trace-room').evaluate(el=>el.getBoundingClientRect().top>innerHeight)).toBe(true);
  await expect(page.locator('#artwork')).toHaveAttribute('data-trace-playing','false');
  const paused=await page.locator('.trace-breathe').evaluate(el=>getComputedStyle(el).transform);
  await page.waitForTimeout(200);
  expect(await page.locator('.trace-breathe').evaluate(el=>getComputedStyle(el).transform)).toBe(paused);
  expect(errors).toEqual([]);
});

test('a failed seated image preserves the visible cat when the trail is cleared',async({page})=>{
  await page.route('**/assets/character/seated-cat.*',route=>route.abort());await openScene(page);
  await page.getByRole('button',{name:'Clear the trail',exact:true}).click();
  await expect(page.locator('#artwork')).toHaveAttribute('data-trace-state','cleared');
  await expect.poll(()=>page.locator('.trace-stepping').evaluate((img:HTMLImageElement)=>img.naturalWidth>0&&Number(getComputedStyle(img).opacity)===1)).toBe(true);
  await expect(page.locator('.trace-seated')).toBeHidden();
});

test('capture freeze holds the scene still and settles subsequent actions immediately',async({page})=>{
  await openScene(page);await page.getByRole('button',{name:'Clear the trail',exact:true}).click();
  await page.evaluate(()=>document.dispatchEvent(new Event('anon-cat:freeze')));
  const snapshot=()=>page.locator('.trace-cat,.trace-breathe,.trace-light,.trace-print svg,.trace-dust,.trace-stepping,.trace-seated').evaluateAll(nodes=>nodes.map(el=>{const s=getComputedStyle(el);return [s.transform,s.opacity,s.visibility];}));
  const frozen=await snapshot();await page.waitForTimeout(450);expect(await snapshot()).toEqual(frozen);
  await page.getByRole('button',{name:'Let him wander',exact:true}).click();
  await page.getByRole('button',{name:'Clear the trail',exact:true}).click();
  await expect.poll(()=>page.locator('.trace-seated').evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(1);
  const settled=await snapshot();await page.waitForTimeout(450);expect(await snapshot()).toEqual(settled);
});

test('touch can clear a print while the mobile page keeps native scrolling',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();await openScene(page);
  const first=await page.locator('.trace-print').first().boundingBox();expect(first).not.toBeNull();
  await page.touchscreen.tap(first!.x+first!.width/2,first!.y+first!.height/2);
  await expect.poll(()=>page.locator('.trace-print[data-erased=true]').count()).toBeGreaterThan(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:'docs/screenshots/trace-room-mobile.png'});
  const before=await page.evaluate(()=>scrollY);await page.mouse.wheel(0,250);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before);
  await context.close();
});

test('the new story remains visible without JavaScript or a downloaded gallery',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();await page.goto('/#artwork');
  await expect(page.locator('.trace-heading')).toBeVisible();
  await expect.poll(()=>page.locator('.trace-stepping').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
  await expect(page.locator('.trace-print')).toHaveCount(9);
  await expect(page.locator('a[download]')).toHaveCount(0);await context.close();
});
