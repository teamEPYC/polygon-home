import { PNG } from 'pngjs'; import { readFileSync } from 'node:fs';
const png=PNG.sync.read(readFileSync(process.argv[2])); const {width,height,data}=png;
// sample a horizontal line at mid-height; report where it's "pure blue bg" vs "content"
// pure blue ≈ #2941b7-ish (r<70,g<90,b>140). content (coil/dark) differs.
const yc=Math.floor(height/2);
const isBg=(x)=>{const i=(yc*width+x)*4;const r=data[i],g=data[i+1],b=data[i+2];return Math.abs(r-41)<30&&Math.abs(g-65)<35&&b>140&&b<210;};
let firstContent=-1,lastContent=-1;
for(let x=0;x<width;x++){ if(!isBg(x)){ if(firstContent<0)firstContent=x; lastContent=x; } }
console.log(process.argv[2].split('/').pop(), `imgW=${width} contentX=${firstContent}..${lastContent} contentW=${lastContent-firstContent}`);
