import { PNG } from 'pngjs'; import { readFileSync } from 'node:fs';
const png=PNG.sync.read(readFileSync(process.argv[2])); const {width,height,data}=png;
// detect horizontal grid lines in y690-810: rows where avg luminance spikes vs neighbors (stroke ~27 on bg ~8)
const rowLum=(yc)=>{let s=0,n=0;const y=yc*2;for(let xx=40;xx<960;xx++){const i=(y*width+xx)*4;s+=0.299*data[i]+0.587*data[i+1]+0.114*data[i+2];n++;}return s/n;};
const out=[];for(let yc=690;yc<=815;yc++){const l=rowLum(yc);if(l>14)out.push(`${yc}(${l.toFixed(0)})`);}
console.log(process.argv[2].split('/').pop(),'bright rows:',out.join(' ')||'none>14');
