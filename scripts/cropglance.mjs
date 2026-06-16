import sharp from 'sharp';
// crop y800..1460 css (×2 physical) from both, save
for (const [src,out] of [['.figma-ref/mobile/glance-live-500.png','/tmp/gl-live.png'],['.figma-ref/mobile/glance-mine-500.png','/tmp/gl-mine.png']]) {
  await sharp(src).extract({left:0, top:800*2, width:1000, height:660*2}).png().toFile(out);
}
console.log('cropped');
