import {test,expect} from '@playwright/test';

test('first-screen cat performs automatically and controls interrupt it quickly',async({page})=>{
  await page.goto('/');
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-welcome','playing');
  await expect.poll(()=>page.locator('.peek-cat').evaluate(el=>Number(getComputedStyle(el).opacity)),{timeout:4000,intervals:[40]}).toBeGreaterThan(.8);
  await expect(page.getByRole('button',{name:'Go incognito'})).toBeEnabled();
  for(const [label,state]of [['Go incognito','peeking'],['Come back','idle']]){
    await page.getByRole('button',{name:label}).click();
    await expect(page.locator('.hero-scene')).toHaveAttribute('data-state',state,{timeout:1200});
  }
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-welcome','playing');
  await expect.poll(()=>page.locator('.peek-cat').evaluate(el=>Number(getComputedStyle(el).opacity)),{timeout:4000,intervals:[40]}).toBeGreaterThan(.8);
});

test('returning to the first screen replays visible character motion',async({page})=>{
  await page.goto('/');
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-welcome','playing');
  const run=Number(await page.locator('.hero-scene').getAttribute('data-welcome-run'));
  await page.locator('#artwork').scrollIntoViewIfNeeded();
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-welcome','paused');
  await page.getByRole('link',{name:'ANON CAT, back to top'}).click();
  await expect.poll(async()=>Number(await page.locator('.hero-scene').getAttribute('data-welcome-run'))).toBeGreaterThan(run);
  await expect.poll(()=>page.locator('.peek-cat').evaluate(el=>Number(getComputedStyle(el).opacity)),{timeout:4000,intervals:[40]}).toBeGreaterThan(.8);
});

test('a poster failure after hydration recovers motion with the PNG',async({page})=>{
  let release!:()=>void;
  const ready=new Promise<void>(resolve=>{release=resolve;});
  await page.route('**/hero-cat.webp',async route=>{await ready;await route.abort();});
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-interactive','ready');
  release();
  await expect(page.locator('.hero-scene')).toHaveClass(/asset-fallback/);
  await expect.poll(()=>page.locator('.standing-cat').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-welcome','playing');
  await expect.poll(()=>page.locator('.peek-cat').evaluate(el=>Number(getComputedStyle(el).opacity)),{timeout:4000,intervals:[40]}).toBeGreaterThan(.8);
});

test('animation stays enabled without a switch even with reduced-motion preference',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.getByRole('button',{name:/Turn motion/})).toHaveCount(0);
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-welcome','playing');
  await expect.poll(()=>page.locator('.peek-cat').evaluate(el=>Number(getComputedStyle(el).opacity)),{timeout:4000,intervals:[40]}).toBeGreaterThan(.8);
  expect(await page.locator('.scene-camera').evaluate(el=>getComputedStyle(el).animationName)).toBe('scene-arrive');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion','on');
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-welcome','playing');
});

test('HTML fallbacks do not leak raw image markup when JavaScript is enabled',async({page})=>{
  await page.goto('/');
  await page.locator('#file').scrollIntoViewIfNeeded();
  await expect(page.locator('noscript')).toHaveCount(0);
  expect(await page.locator('body').innerText()).not.toContain('<img class=');
});

for(const width of [360,390,768,1440,1920])test(`first-screen actions never overlap at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:width<700?844:1000});
  await page.goto('/',{waitUntil:'domcontentloaded'});
  const samples=await page.evaluate(()=>new Promise<{gap:number;sceneGap:number;overflow:boolean}[]>(resolve=>{
    const rows:{gap:number;sceneGap:number;overflow:boolean}[]=[];const start=performance.now();
    const sample=()=>{
      const button=document.querySelector('.hero-actions .button')!.getBoundingClientRect();
      const caption=document.querySelector('.monero-caption')!.getBoundingClientRect();
      const scene=document.querySelector('.hero-scene')!.getBoundingClientRect();
      rows.push({gap:caption.top-button.bottom,sceneGap:scene.top-caption.bottom,overflow:document.documentElement.scrollWidth>innerWidth});
      if(performance.now()-start<850)requestAnimationFrame(sample);else resolve(rows);
    };requestAnimationFrame(sample);
  }));
  expect(Math.min(...samples.map(r=>r.gap))).toBeGreaterThanOrEqual(15);
  expect(samples.some(r=>r.overflow)).toBe(false);
  if(width<700)expect(Math.min(...samples.map(r=>r.sceneGap))).toBeGreaterThanOrEqual(20);
  await page.getByRole('link',{name:'Meet the cat',exact:true}).hover();
  const gap=await page.locator('.monero-caption').evaluate(el=>el.getBoundingClientRect().top-document.querySelector('.hero-actions .button')!.getBoundingClientRect().bottom);
  expect(gap).toBeGreaterThanOrEqual(15);
});

test('restored cinema keeps navigation to artwork immediate',async({page})=>{
  await page.goto('/');
  await page.locator('.ethos-cinema').scrollIntoViewIfNeeded();
  await expect(page.locator('.ethos-cinema')).toHaveClass(/is-cinematic/);
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
  await page.getByRole('link',{name:'The hideout',exact:true}).click();await expect(page).toHaveURL(/#artwork$/);
  await expect(page.locator('.trace-heading')).toBeInViewport();
});

test('an obsolete saved off value cannot stop animation after removing the switch',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('anon-cat-motion','off'));
  await page.goto('/');
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-welcome','playing');
  await page.reload();await expect(page.locator('html')).toHaveAttribute('data-motion','on');
  await expect(page.locator('.hero-scene')).toHaveAttribute('data-welcome','playing');
  await expect.poll(()=>page.locator('.peek-cat').evaluate(el=>Number(getComputedStyle(el).opacity)),{timeout:4000,intervals:[40]}).toBeGreaterThan(.8);
});

test('hidden pose requests begin after the visible cat is decoded',async({page})=>{
  await page.goto('/');await expect(page.locator('.hero-scene')).toHaveAttribute('data-welcome','playing');
  const times=await page.evaluate(()=>{
    const entries=performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const hero=entries.find(r=>r.name.endsWith('/hero-cat.webp'))!;
    return {heroEnd:hero.responseEnd,poseStarts:entries.filter(r=>r.name.endsWith('/step-cat.webp')||r.name.endsWith('/peek-cat.webp')).map(r=>r.startTime)};
  });
  expect(times.poseStarts.length).toBe(2);
  times.poseStarts.forEach(start=>expect(start).toBeGreaterThanOrEqual(times.heroEnd));
});

test('below-fold images work natively without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();await page.goto('/');
  await page.getByRole('link',{name:'Meet the cat',exact:true}).click();
  await expect(page).toHaveURL(/#file$/);
  const cat=page.locator('.seated-cat');await expect(cat).toBeVisible();
  await expect.poll(()=>cat.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await context.close();
});
