import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const rows=[];
async function visit(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){
 const p=path.join(dir,entry.name);if(entry.isDirectory())await visit(p);else{
  const data=await fs.readFile(p);let dimensions={};try{const m=await sharp(p).metadata();dimensions={width:m.width,height:m.height,alpha:m.hasAlpha};}catch{}
  rows.push({path:p.replaceAll('\\','/'),bytes:data.length,...dimensions,sha256:crypto.createHash('sha256').update(data).digest('hex')});
 }
}}
await visit('public/assets');await fs.writeFile('docs/asset-manifest.json',JSON.stringify(rows,null,2));console.log(`Manifest: ${rows.length} local assets`);
