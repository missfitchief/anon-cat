import {test,expect} from '@playwright/test';

test('file artwork waits for real images and animates again on re-entry',async({page})=>{
  let release!:()=>void;
  const ready=new Promise<void>(resolve=>{release=resolve;});
  for(const image of ['file-plinth.webp','seated-cat.webp'])await page.route(`**/${image}`,async route=>{await ready;await route.continue();});
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-interactive','ready');
  const art=page.locator('.file-art');await art.scrollIntoViewIfNeeded();
  expect(await art.evaluate(el=>getComputedStyle(el).transform)).toBe('none');
  release();
  await expect.poll(()=>art.evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).m42),{intervals:[20]}).toBeGreaterThan(2);
  await expect.poll(()=>art.evaluate(el=>Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m42)),{intervals:[40]}).toBeLessThan(.1);
  await expect(page.locator('noscript')).toHaveCount(0);
  expect(await page.locator('body').innerText()).not.toContain('<img');
  await page.screenshot({path:'docs/screenshots/file-native-desktop.png'});
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(80);
  await art.scrollIntoViewIfNeeded();
  await expect.poll(()=>art.evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).m42),{intervals:[20]}).toBeGreaterThan(2);
});

test('compact privacy scenes reveal with scroll without desktop pinning',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  for(const selector of ['.panel-frame','.silhouette-frame','.relaxed-frame']){
    const frame=page.locator(selector);await frame.scrollIntoViewIfNeeded();
    await expect(page.locator('.ethos-cinema')).toHaveAttribute('data-story-ready','true');
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    await expect.poll(()=>frame.locator('img').evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).a),{intervals:[20]}).toBeGreaterThan(1.01);
    const before=await frame.locator('img').evaluate(el=>getComputedStyle(el).transform);
    await page.evaluate(()=>window.scrollBy({top:120,behavior:'instant'}));
    await expect.poll(()=>frame.locator('img').evaluate(el=>getComputedStyle(el).transform)).not.toBe(before);
  }
});

test('camera, redaction and portrait controls produce actual motion after reload',async({page})=>{
  await page.goto('/');await page.reload();
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-welcome','playing');
  await page.mouse.move(1100,160);
  await expect.poll(()=>page.locator('.scene-pointer').evaluate(el=>Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m41)),{intervals:[20]}).toBeGreaterThan(1);
  await page.getByRole('button',{name:'Too much information'}).click();
  const bar=page.locator('.redaction-bar').first();
  await expect.poll(()=>bar.evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).a),{intervals:[20]}).toBeGreaterThan(.05);
  await expect.poll(()=>bar.evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).a)).toBe(1);
  await page.locator('#artwork').scrollIntoViewIfNeeded();
  await page.getByRole('button',{name:'Peek',exact:true}).click();
  await expect.poll(()=>page.locator('.portrait-print[data-active=true]').evaluate(el=>Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m13)),{intervals:[20]}).toBeGreaterThan(.01);
  await expect.poll(()=>page.locator('.portrait-print[data-active=true]').evaluate(el=>Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m13))).toBeLessThan(.001);
});
