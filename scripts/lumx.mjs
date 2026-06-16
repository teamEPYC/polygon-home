import { PNG } from 'pngjs'; import { readFileSync } from 'node:fs';
const png=PNG.sync.read(readFileSync(process.argv[2])); const {width,height,data}=png;
const yc=parseInt(process.argv[3]||'620',10);
const lumX=(xc)=>{const x=xc*2;let s=0,n=0;for(let yy=yc*2;yy<yc*2+8;yy++)for(let xx=x;xx<x+30 && xx<width;xx++){const i=(yy*width+xx)*4;s+=0.299*data[i]+0.587*data[i+1]+0.114*data[i+2];n++;}return Math.round(s/n);};
const r=[];for(let xc=20;xc<480;xc+=40)r.push(`${xc}:${lumX(xc)}`);
console.log(process.argv[2].split('/').pop()+` y=${yc}`); console.log(r.join('  '));
