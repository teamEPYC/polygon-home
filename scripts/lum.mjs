import { PNG } from 'pngjs';
import { readFileSync } from 'node:fs';
const file = process.argv[2];
const png = PNG.sync.read(readFileSync(file));
const { width, height, data } = png;          // physical px (2x)
// average luminance per 10-css-px band down a center strip (avoid logo glyphs: sample x 60..120 css)
const x0 = 60*2, x1 = 130*2;
const lumAt = (yc) => {
  const y = yc*2; let s=0,n=0;
  for (let yy=y; yy<y+20 && yy<height; yy++)
    for (let xx=x0; xx<x1; xx++){ const i=(yy*width+xx)*4; s+=0.299*data[i]+0.587*data[i+1]+0.114*data[i+2]; n++; }
  return Math.round(s/n);
};
const rows=[];
for (let yc=90; yc<=800; yc+=30) rows.push(`${yc}:${lumAt(yc)}`);
console.log(file.split('/').pop());
console.log(rows.join('  '));
