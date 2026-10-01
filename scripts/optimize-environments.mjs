import sharp from 'sharp';
for(const part of ['back','front','mobile'])await sharp(`public/assets/environments/hideout-${part}.png`).webp({quality:88}).toFile(`public/assets/environments/hideout-${part}.webp`);
await sharp('public/assets/environments/file-plinth.png').trim().webp({quality:88}).toFile('public/assets/environments/file-plinth.webp');
