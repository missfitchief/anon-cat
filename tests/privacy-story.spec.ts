import {test,expect,type Page} from '@playwright/test';

async function openStory(page:Page){
  await page.locator('.ethos-cinema').scrollIntoViewIfNeeded();
  await expect(page.locator('.ethos-cinema')).toHaveAttribute('data-story-ready','true');
  await expect(page.locator('.ethos-cinema')).toHaveClass(/is-cinematic/);
  await page.evaluate(()=>document.fonts.ready);
  await expect.poll(()=>page.locator('.ethos-cinema img').evaluateAll(nodes=>nodes.every(img=>(img as HTMLImageElement).complete&&(img as HTMLImageElement).naturalWidth>0))).toBe(true);
  return page.locator('.pin-spacer').evaluate(el=>({start:el.getBoundingClientRect().top+scrollY-innerHeight*.06,span:Math.round(innerHeight*1.75)}));
}

async function seek(page:Page,bounds:{start:number;span:number},progress:number){
  await page.evaluate(({start,span,progress})=>window.scrollTo({top:start+span*progress,behavior:'instant'}),{...bounds,progress});
  await expect.poll(async()=>Math.abs(Number(await page.locator('.ethos-cinema').getAttribute('data-story-progress'))-progress)).toBeLessThan(.01);
}

test('desktop story restores three full scenes, shutters, progress and reverse scrolling',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/');
  const bounds=await openStory(page);
  for(const [progress,chapter,selector]of [[.08,'01','.panel-frame'],[.52,'02','.silhouette-frame'],[.94,'03','.relaxed-frame']]as const){
    await seek(page,bounds,progress);
    await expect(page.locator('.story-current')).toHaveText(chapter);
    expect(await page.locator(selector).evaluate(el=>getComputedStyle(el).clipPath)).not.toMatch(/100%/);
    const position=await page.locator('.ethos-cinema').evaluate(el=>el.getBoundingClientRect().top);
    expect(Math.abs(position-54)).toBeLessThan(2);
    await page.screenshot({path:`docs/screenshots/restored-story-${chapter}.png`});
  }
  await seek(page,bounds,.31);
  expect(await page.locator('.privacy-shutters span').evaluateAll(nodes=>nodes.some(el=>{const box=el.getBoundingClientRect();const stage=el.parentElement!.getBoundingClientRect();return box.left<stage.right&&box.right>stage.left;}))).toBe(true);
  await seek(page,bounds,.08);
  await expect(page.locator('.story-current')).toHaveText('01');
  expect(await page.locator('.silhouette-frame').evaluate(el=>getComputedStyle(el).clipPath)).toMatch(/100%/);
  await page.getByRole('link',{name:'The artwork',exact:true}).click();
  await expect(page.getByRole('button',{name:'02 Peek',exact:true})).toBeInViewport();
});

test('responsive story removes desktop pinning and restores it without duplicates',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/');await openStory(page);
  await page.setViewportSize({width:390,height:844});
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.locator('.ethos-cinema')).not.toHaveClass(/is-cinematic/);
  await page.locator('.silhouette-frame').scrollIntoViewIfNeeded();
  await expect(page.locator('.silhouette-frame')).toBeInViewport();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.setViewportSize({width:1440,height:900});
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
  await expect(page.locator('.ethos-cinema')).toHaveClass(/is-cinematic/);
});

for(const height of [600,700])test(`story and its chapter progress fit a ${height}px desktop viewport`,async({page})=>{
  await page.setViewportSize({width:1280,height});await page.goto('/');const bounds=await openStory(page);await seek(page,bounds,.52);
  const layout=await page.locator('.story-progress').evaluate(el=>({bottom:el.getBoundingClientRect().bottom,overflow:document.documentElement.scrollWidth>innerWidth}));
  expect(layout.bottom).toBeLessThanOrEqual(height);expect(layout.overflow).toBe(false);
});

test('direct artwork navigation stays reachable while story initializes',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/#artwork');
  await expect(page.locator('.ethos-cinema')).toHaveAttribute('data-story-ready','true');
  await expect(page.getByRole('button',{name:'02 Peek',exact:true})).toBeInViewport();
  await page.getByRole('button',{name:'02 Peek',exact:true}).click();
  await expect(page.locator('#artwork')).toHaveAttribute('data-selection','peek');
  expect(await page.locator('body').innerText()).not.toContain('<img');
});
