import {test,expect} from '@playwright/test';
test('hero state machine is guarded, hides and returns',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');const control=page.getByRole('button',{name:'Go incognito'});
  await control.click();await expect(page.locator('.hero-scene')).toHaveAttribute('data-state','hiding');await expect(control).toBeDisabled();
  await page.evaluate(()=>{const b=document.querySelector<HTMLButtonElement>('.incognito');for(let i=0;i<15;i++)b?.click();});
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-state','peeking');
  await expect(page.getByRole('button',{name:'Come back'})).toBeEnabled();
  await page.getByRole('button',{name:'Come back'}).click();await expect(page.locator('.hero-scene')).toHaveAttribute('data-state','idle');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();expect(errors).toEqual([]);
});
test('fictional file redacts accessibly and restores',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Too much information'}).click();
  await expect(page.locator('.character-file')).toHaveClass(/is-redacted/);await expect(page.locator('.file-value').first()).toHaveAttribute('aria-hidden','true');
  expect(await page.locator('.file-row .sr-only').count()).toBe(5);
  await page.getByRole('button',{name:'Show the file'}).click();await expect(page.locator('.character-file')).not.toHaveClass(/is-redacted/);
});
test('portraits select and download actual square PNGs',async({page})=>{
  await page.goto('/');for(const [name,id]of [['Side-eye','side-eye'],['Peek','peek'],['Relaxed','relaxed']]){
    await page.getByRole('button',{name:new RegExp(name)}).click();
    const [download]=await Promise.all([page.waitForEvent('download'),page.locator('.download-button').click()]);
    expect(download.suggestedFilename()).toBe(`anon-cat-${id}.png`);expect(await download.failure()).toBeNull();
    const response=await page.request.get(`/assets/portraits/${id}.png`);const buf=await response.body();expect(buf.readUInt32BE(16)).toBe(1024);expect(buf.readUInt32BE(20)).toBe(1024);
  }
});
test('reduced motion and motion switch during a transition stay operable',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('html')).toHaveAttribute('data-motion','off');
  await page.getByRole('button',{name:'Go incognito'}).click();await expect(page.locator('.hero-scene')).toHaveAttribute('data-state','peeking');
  await page.getByRole('button',{name:'Come back'}).click();await expect(page.locator('.hero-scene')).toHaveAttribute('data-state','idle');
  await page.emulateMedia({reducedMotion:'no-preference'});await page.getByRole('button',{name:'Go incognito'}).click();await page.getByRole('button',{name:'Turn motion off'}).click();
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-state','peeking');await expect(page.getByRole('button',{name:'Come back'})).toBeEnabled();
});
for(const [width,height]of [[360,800],[390,844],[768,1024],[1440,900],[1920,1080]])test(`layout ${width} × ${height}`,async({page})=>{
  await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(await page.locator('h1').count()).toBe(1);await expect(page.getByRole('button',{name:'Go incognito'})).toBeVisible();
  if(width<700){await page.getByRole('button',{name:'Menu',exact:false}).click();await page.getByRole('link',{name:'01 The cat'}).click();await expect(page.getByRole('button',{name:'Menu',exact:false})).toHaveAttribute('aria-expanded','false');}
  for(const selector of ['.file-art','.panel-frame','.silhouette-frame','.relaxed-frame','.selected-portrait']){
    await page.locator(selector).scrollIntoViewIfNeeded();
    await expect.poll(()=>page.locator(selector).locator('img').evaluateAll(nodes=>nodes.every(el=>(el as HTMLImageElement).complete&&(el as HTMLImageElement).naturalWidth>0))).toBe(true);
  }
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.evaluate(()=>{(document.activeElement as HTMLElement)?.blur();document.dispatchEvent(new Event('anon-cat:freeze'));});
  await page.screenshot({path:`docs/screenshots/site-${width}.png`,fullPage:true});
});
test('normal motion can be captured at controlled states',async({page})=>{
  await page.goto('/');await page.evaluate(()=>document.fonts.ready);
  await page.getByRole('button',{name:'Go incognito'}).click();
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-state','peeking');
  await page.evaluate(()=>document.dispatchEvent(new Event('anon-cat:freeze')));
  await page.screenshot({path:'docs/screenshots/hero-peeking-desktop.png'});
  await page.getByRole('button',{name:'Come back'}).click();
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-state','idle');
});
test('production has no unexpected external requests, missing assets or hydration errors',async({page})=>{
  const external:string[]=[];const errors:string[]=[];const missing:string[]=[];
  page.on('request',r=>{if(!new URL(r.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/))external.push(r.url());});
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
  await page.goto('/');await page.locator('#artwork').scrollIntoViewIfNeeded();await page.waitForLoadState('networkidle');
  expect(external).toEqual([]);expect(missing).toEqual([]);expect(errors).toEqual([]);
  await expect(page.locator('input,iframe,canvas,video')).toHaveCount(0);await expect(page.getByRole('link',{name:/buy|connect wallet/i})).toHaveCount(0);
});
test('keyboard, navigation, and media failure leave content usable',async({page})=>{
  await page.route('**/*.webp',route=>route.abort());await page.goto('/');
  await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();await page.keyboard.press('Enter');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();await expect(page.locator('.standing-cat')).toBeVisible();
  await expect.poll(()=>page.locator('.standing-cat').evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);
  await expect.poll(()=>page.locator('.architecture img').evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);
  await page.getByRole('link',{name:'Meet the cat',exact:true}).click();await expect(page).toHaveURL(/#file$/);await page.getByRole('button',{name:'Too much information'}).click();await expect(page.getByRole('button',{name:'Show the file'})).toBeVisible();
  await expect.poll(()=>page.locator('.seated-cat').evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);
});
