import sharp from 'sharp';
import fs from 'node:fs/promises';
// Full-resolution transparent PNG masters remain available for source and recovery.
for(const [name,height]of [['hero',1200],['step',900],['peek',750],['seated',1000]]){
  const output=`public/assets/character/${name}-cat.webp`;
  await sharp(`public/assets/character/${name}-cat.png`).resize({height,withoutEnlargement:true}).webp({quality:82,alphaQuality:95,effort:6}).toFile(output);
  console.log(`${name}: ${(await fs.stat(output)).size} bytes`);
}
await sharp('public/assets/character/hero-cat.png').resize({height:900}).webp({quality:82,alphaQuality:95,effort:6}).toFile('public/assets/character/hero-cat-mobile.webp');
console.log(`hero-mobile: ${(await fs.stat('public/assets/character/hero-cat-mobile.webp')).size} bytes`);
