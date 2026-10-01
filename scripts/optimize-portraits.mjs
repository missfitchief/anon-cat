import fs from 'node:fs/promises';
import sharp from 'sharp';
await fs.mkdir('art-source/portraits',{recursive:true});
for(const id of ['side-eye','peek','relaxed']){
 const path=`public/assets/portraits/${id}.png`;const master=`art-source/portraits/${id}-master.png`;
 try{await fs.access(master);}catch{await fs.copyFile(path,master);}
 await sharp(master).resize(1024,1024,{fit:'cover'}).png({compressionLevel:9}).toFile(`${path}.tmp`);
 await fs.rename(`${path}.tmp`,path);
 await sharp(master).resize(1024,1024,{fit:'cover'}).webp({quality:88}).toFile(`public/assets/portraits/${id}.webp`);
}
