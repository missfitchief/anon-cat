import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch();const results=[];
for(const mobile of [false,true]){
 const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:900}});
 const client=await page.context().newCDPSession(page);
 if(mobile){await client.send('Network.enable');await client.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:100000});await client.send('Emulation.setCPUThrottlingRate',{rate:4});}
 await page.addInitScript(()=>{
  window.__metrics={lcp:0,cls:0};
  new PerformanceObserver(list=>{for(const e of list.getEntries())window.__metrics.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__metrics.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
 });
 await page.goto('http://127.0.0.1:3001/',{waitUntil:'networkidle'});await page.waitForTimeout(1200);
 const metrics=await page.evaluate(()=>({...window.__metrics,resources:performance.getEntriesByType('resource').map(r=>({name:r.name,transferSize:r.transferSize,duration:r.duration})),navigation:performance.getEntriesByType('navigation').map(n=>({domContentLoaded:n.domContentLoadedEventEnd,load:n.loadEventEnd}))}));
 results.push({condition:mobile?'390×844 Chromium, cold context, 4× CPU, 150ms latency, 1.6 Mbps down':'1440×900 Chromium, cold context, localhost, unthrottled',...metrics});
 await page.close();
}
await fs.writeFile('docs/performance-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results.map(({condition,lcp,cls})=>({condition,lcp_ms:lcp,cls})),null,2));await browser.close();
