import sharp from 'sharp';
const [,,src,out,top,h]=process.argv;
const meta=await sharp(src).metadata();
const t=Math.min(+top*2, meta.height-2);
const hh=Math.min(+h*2, meta.height-t);
await sharp(src).extract({left:0,top:t,width:Math.min(1000,meta.width),height:hh}).png().toFile(out);
console.log('cropped',out,`top=${t} h=${hh} (img ${meta.width}x${meta.height})`);
