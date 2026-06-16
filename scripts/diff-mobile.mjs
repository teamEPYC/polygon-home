/**
 * diff-mobile.mjs — visual verification for the mobile fidelity loop.
 *
 * Given a live screenshot and my local screenshot (both captured at the same
 * CSS width via extract-mobile.mjs, so both are 2× device-scale), this aligns
 * them to the same pixel height and emits three artifacts:
 *   <out>-side.png    live | mine, side by side
 *   <out>-overlay.png mine painted at 50% over live (misalignment = ghosting)
 *   <out>-diff.png    pixelmatch heatmap (magenta = differing pixels)
 * and prints the mismatched-pixel ratio.
 *
 * Usage:
 *   node scripts/diff-mobile.mjs <live.png> <mine.png> <outPrefix> [cropH]
 *   cropH = optional CSS-px height to crop from the top (×2 internally).
 */
import sharp from 'sharp';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { resolve } from 'node:path';

const [, , liveArg, mineArg, outArg, cropHArg] = process.argv;
if (!liveArg || !mineArg || !outArg) {
  console.error('Usage: node scripts/diff-mobile.mjs <live.png> <mine.png> <outPrefix> [cropH]');
  process.exit(1);
}
const out = resolve(outArg);

async function load(p, cropH) {
  let img = sharp(resolve(p));
  const meta = await img.metadata();
  const w = meta.width;
  const h = cropH ? Math.min(meta.height, cropH * 2) : meta.height;
  return { buf: await img.extract({ left: 0, top: 0, width: w, height: h }).png().toBuffer(), w, h };
}

const cropH = cropHArg ? parseInt(cropHArg, 10) : null;
const live = await load(liveArg, cropH);
const mine = await load(mineArg, cropH);

// Normalise to a common canvas (same width, same height = min of the two).
const W = Math.min(live.w, mine.w);
const H = Math.min(live.h, mine.h);
const norm = async (b) =>
  sharp(b).extract({ left: 0, top: 0, width: W, height: H }).png().toBuffer();
const liveN = await norm(live.buf);
const mineN = await norm(mine.buf);

// Side by side.
await sharp({ create: { width: W * 2 + 8, height: H, channels: 4, background: '#000' } })
  .composite([
    { input: liveN, left: 0, top: 0 },
    { input: mineN, left: W + 8, top: 0 },
  ])
  .png()
  .toFile(`${out}-side.png`);

// 50% overlay (mine over live).
const mineHalf = await sharp(mineN).ensureAlpha(0.5).png().toBuffer();
await sharp(liveN).composite([{ input: mineHalf, blend: 'over' }]).png().toFile(`${out}-overlay.png`);

// Pixel diff heatmap.
const a = PNG.sync.read(liveN);
const b = PNG.sync.read(mineN);
const diff = new PNG({ width: W, height: H });
const mismatch = pixelmatch(a.data, b.data, diff.data, W, H, { threshold: 0.12 });
const { writeFileSync } = await import('node:fs');
writeFileSync(`${out}-diff.png`, PNG.sync.write(diff));

const ratio = ((mismatch / (W * H)) * 100).toFixed(2);
console.log(`canvas      : ${W}×${H} (physical px)`);
console.log(`mismatch    : ${mismatch} px (${ratio}%)`);
console.log(`side-by-side: ${out}-side.png`);
console.log(`overlay@50% : ${out}-overlay.png`);
console.log(`diff heatmap: ${out}-diff.png`);
