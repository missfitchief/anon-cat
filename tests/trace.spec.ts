import {test,expect,type Page} from '@playwright/test';

async function openScene(page:Page){
  await page.goto('/#artwork');
  await expect(page.locator('#artwork')).toHaveAttribute('data-trace-ready','true');
  await expect.poll(()=>page.locator('.trace-cat').evaluate(el=>Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m41))).toBeLessThan(.1);
}

test('the hideout settles without pawprints or scene controls and keyboard navigation stays usable',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await openScene(page);
  await expect(page.locator('.trace-heading')).toBeInViewport();
  await expect(page.locator('.trace-print,.trace-action,.trace-seated,.portrait-options,a[download]')).toHaveCount(0);
  await page.screenshot({path:'docs/screenshots/trace-room-desktop.png'});
  await page.getByRole('link',{name:'Back to top ↑',exact:true}).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#top$/);
  await expect(page.getByRole('heading',{level:1})).toBeInViewport();
});

test('the scene pauses offscreen and resumes when it is visible again',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await openScene(page);
  await expect(page.locator('#artwork')).toHaveAttribute('data-trace-playing','true');
  await page.locator('#top').scrollIntoViewIfNeeded();
  await expect.poll(()=>page.locator('.trace-room').evaluate(el=>el.getBoundingClientRect().top>innerHeight)).toBe(true);
  await expect(page.locator('#artwork')).toHaveAttribute('data-trace-playing','false');
  const paused=await page.locator('.trace-breathe').evaluate(el=>getComputedStyle(el).transform);
  await page.waitForTimeout(200);
  expect(await page.locator('.trace-breathe').evaluate(el=>getComputedStyle(el).transform)).toBe(paused);
  await page.locator('#artwork').scrollIntoViewIfNeeded();
  await expect(page.locator('#artwork')).toHaveAttribute('data-trace-playing','true');
  expect(errors).toEqual([]);
});

test('capture freeze holds the scene still through scrolling away and back',async({page})=>{
  await openScene(page);await page.evaluate(()=>document.dispatchEvent(new Event('anon-cat:freeze')));
  const snapshot=()=>page.locator('.trace-cat,.trace-breathe,.trace-light,.trace-ground-shadow,.trace-stepping').evaluateAll(nodes=>nodes.map(el=>{const s=getComputedStyle(el);return [s.transform,s.opacity,s.visibility];}));
  const frozen=await snapshot();await page.waitForTimeout(450);expect(await snapshot()).toEqual(frozen);
  await page.locator('#top').scrollIntoViewIfNeeded();await page.locator('#artwork').scrollIntoViewIfNeeded();
  await expect(page.locator('#artwork')).toHaveAttribute('data-trace-playing','false');
  await page.waitForTimeout(450);expect(await snapshot()).toEqual(frozen);
});

test('the mobile scene keeps native scrolling',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();await openScene(page);
  const room=await page.locator('.trace-room').boundingBox();expect(room).not.toBeNull();
  await page.touchscreen.tap(room!.x+room!.width/2,room!.y+Math.min(room!.height/2,300));
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:'docs/screenshots/trace-room-mobile.png'});
  const before=await page.evaluate(()=>scrollY);await page.mouse.wheel(0,250);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before);
  await context.close();
});

test('the scene remains visible without JavaScript or a downloaded gallery',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();await page.goto('/#artwork');
  await expect(page.locator('.trace-heading')).toBeVisible();
  await expect.poll(()=>page.locator('.trace-stepping').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
  await expect(page.locator('.trace-print,.trace-action,.trace-seated,a[download]')).toHaveCount(0);await context.close();
});
