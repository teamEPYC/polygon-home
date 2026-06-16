import { PNG } from 'pngjs'; import { readFileSync } from 'node:fs';
const png=PNG.sync.read(readFileSync(process.argv[2])); const {width,height,data}=png;
// find first row (top→down) where avg blue dominates (the #3449C1 section). Sample x40..960
const isBlueRow=(yc)=>{const y=yc*2;let b=0,rr=0,n=0;for(let xx=80;xx<920;xx++){const i=(y*width+xx)*4;rr+=data[i];b+=data[i+2];n++;}return (b/n>70 && b/n - rr/n > 40);};
let first=null; for(let yc=700;yc<1000;yc++){ if(isBlueRow(yc)){first=yc;break;} }
console.log(process.argv[2].split('/').pop(),'blue section starts at y=',first);
