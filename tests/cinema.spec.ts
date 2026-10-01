import {test,expect} from '@playwright/test';

test('desktop privacy story reveals three scenes and reverses with native scrolling',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/');
  await expect(page.locator('.ethos-cinema')).toHaveClass(/is-cinematic/);
  const start=await page.locator('.ethos-cinema').evaluate(el=>el.getBoundingClientRect().top+scrollY-innerHeight*.06);
  for(const [progress,label] of [[.12,'01'],[.52,'02'],[.94,'03'],[.12,'01']] as const){
    await page.evaluate(({start,progress})=>window.scrollTo({top:start+innerHeight*1.75*progress,behavior:'instant'}),{start,progress});
    await expect(page.locator('.story-current')).toHaveText(label);
    await page.waitForTimeout(750); // Allow the actual scrub tween to settle.
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:`docs/screenshots/cinema-${label}.png`});
    if(label==='03'){
      const covers=await page.locator('.privacy-shutters span').evaluateAll(nodes=>nodes.some(el=>{const box=el.getBoundingClientRect();const parent=el.parentElement!.getBoundingClientRect();return box.right>parent.left&&box.left<parent.right;}));
      expect(covers).toBe(false);
    }
  }
});

test('motion-off removes pinning, restores all scenes, and survives reload',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/');
  await expect(page.locator('.ethos-cinema')).toHaveClass(/is-cinematic/);
  await page.getByRole('button',{name:'Turn motion off'}).click();
  await expect(page.locator('.ethos-cinema')).not.toHaveClass(/is-cinematic/);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  for(const scene of ['.panel-frame','.silhouette-frame','.relaxed-frame'])expect(await page.locator(scene).evaluate(el=>getComputedStyle(el).clipPath)).toBe('none');
  await page.reload();await expect(page.locator('html')).toHaveAttribute('data-motion','off');
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await page.getByRole('button',{name:'Turn motion on'}).click();await expect(page.locator('.ethos-cinema')).toHaveClass(/is-cinematic/);
});

test('rapid portrait throws settle on the selected print and matching download',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
  await page.locator('#artwork').scrollIntoViewIfNeeded();
  await page.evaluate(()=>{const options=document.querySelectorAll<HTMLButtonElement>('.portrait-options button');for(let i=0;i<15;i++)options[i%3].click();});
  await expect(page.locator('#artwork')).toHaveAttribute('data-selection','relaxed');
  await expect(page.locator('.download-button')).toHaveAttribute('href','/assets/portraits/relaxed.png');
  await page.waitForTimeout(1400);
  await expect(page.locator('.portrait-print[data-active=true]')).toHaveCount(1);
  const position=await page.locator('.portrait-print[data-active=true]').evaluate(el=>{const box=el.getBoundingClientRect();const stage=el.parentElement!.getBoundingClientRect();return Math.abs(box.x+box.width/2-stage.x-stage.width/2);});
  expect(position).toBeLessThan(25);expect(errors).toEqual([]);
});

for(const width of [360,390])test(`mobile ${width} has full motion and no desktop pin`,async({page})=>{
  await page.setViewportSize({width,height:844});await page.goto('/');await page.waitForTimeout(2200);
  await expect(page.locator('html')).toHaveAttribute('data-cinema','on');await expect(page.locator('.pin-spacer')).toHaveCount(0);
  const cat=await page.locator('.standing-cat').boundingBox();expect(cat?.x).toBeGreaterThan(0);expect((cat?.x??0)+(cat?.width??0)).toBeLessThan(width);
  for(const selector of ['.file-art','.panel-frame','.silhouette-frame','.relaxed-frame','#artwork']){
    await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(850);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.getByRole('button',{name:'Turn motion off'}).click();await expect(page.locator('.pin-spacer')).toHaveCount(0);
});
