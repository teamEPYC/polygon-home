import { PNG } from 'pngjs'; import { readFileSync } from 'node:fs';
const png=PNG.sync.read(readFileSync(process.argv[2])); const {width,height,data}=png;
const lumAt=(yc)=>{const y=yc*2;let s=0,n=0;for(let yy=y;yy<y+12&&yy<height;yy++)for(let xx=40;xx<960;xx++){const i=(yy*width+xx)*4;s+=0.299*data[i]+0.587*data[i+1]+0.114*data[i+2];n++;}return Math.round(s/n);};
const r=[];for(let yc=+process.argv[3];yc<=+process.argv[4];yc+=15)r.push(`${yc}:${lumAt(yc)}`);
console.log(process.argv[2].split('/').pop()); console.log(r.join('  '));
