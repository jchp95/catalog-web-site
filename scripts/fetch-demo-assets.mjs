import { writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';
const photos = {
 mireya: 'photo-1524504388940-b1c1722653e1',
 blackline: 'photo-1503951914875-452162b0f3f1',
 apex: 'photo-1503376780353-7e6692767b70',
 'casa-fuego': 'photo-1517248135467-4c7edcad34c4',
 harbor: 'photo-1600596542815-ffad4c1539a9',
 brightline: 'photo-1600585154340-be6161a56a0c',
 'harbor-pine': 'photo-1600566753086-00f18fb6b3ea',
 'harbor-glass': 'photo-1600607687920-4e2a09cf159d',
 'harbor-sand': 'photo-1600047509807-ba8f99d2cdde'
};
await mkdir('public/images', { recursive: true });
await Promise.all(Object.entries(photos).map(async ([name,id]) => {
 const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=85`;
 const r = await fetch(url); if(!r.ok) throw new Error(`${name}: ${r.status}`);
 const buffer=await sharp(Buffer.from(await r.arrayBuffer())).resize({width:1600,withoutEnlargement:true}).webp({quality:82}).toBuffer();
 await writeFile(`public/images/${name}.webp`, buffer);
 console.log(`${name}: ${buffer.length} bytes`);
}));
await writeFile('public/images/sources.json',JSON.stringify({note:'Unsplash sample photography for fictional business concepts. Images do not depict actual demo staff or properties.',sources:Object.fromEntries(Object.entries(photos).map(([name,id])=>[name,`https://images.unsplash.com/${id}`]))},null,2));
