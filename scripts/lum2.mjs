import { PNG } from 'pngjs';
import { readFileSync } from 'node:fs';
const file = process.argv[2];
const png = PNG.sync.read(readFileSync(file));
const { width, height, data } = png;            // physical (2x)
// sample FULL width avg luminance per y-css band
const lumAt = (yc) => {
  const y = yc*2; let s=0,n=0;
  for (let yy=y; yy<y+16 && yy<height; yy++)
    for (let xx=20*2; xx<480*2; xx++){ const i=(yy*width+xx)*4; s+=0.299*data[i]+0.587*data[i+1]+0.114*data[i+2]; n++; }
  return Math.round(s/n);
};
const rows=[]; for (let yc=420; yc<=700; yc+=20) rows.push(`${yc}:${lumAt(yc)}`);
console.log(file.split('/').pop()+'  (full-width avg lum, y420-700)'); console.log(rows.join('  '));
