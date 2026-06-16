/**
 * extract-mobile.mjs
 *
 * Captures a headless Chrome screenshot at a mobile viewport width.
 * Used as the reference-capture half of the extract-and-diff loop for the
 * mobile responsiveness pass on polygon-home.
 *
 * Usage:
 *   node scripts/extract-mobile.mjs <outPath> [width] [url]
 *
 * Examples:
 *   node scripts/extract-mobile.mjs .figma-ref/mobile/hero-375.png 375 https://polygon.technology
 *   node scripts/extract-mobile.mjs .figma-ref/mobile/hero-390.png 390
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const CHROME = '/usr/bin/google-chrome-stable';
const HEIGHT = 2400; // tall enough to capture full sections; caller crops later

const [, , outPathArg, widthArg, urlArg] = process.argv;

if (!outPathArg) {
  console.error('Usage: node scripts/extract-mobile.mjs <outPath> [width] [url]');
  process.exit(1);
}

const outPath = resolve(outPathArg);
const width   = parseInt(widthArg ?? '375', 10);
const url     = urlArg ?? 'https://polygon.technology';

if (isNaN(width) || width <= 0) {
  console.error(`Error: invalid width "${widthArg}"`);
  process.exit(1);
}

// Ensure the output directory exists.
mkdirSync(dirname(outPath), { recursive: true });

const chromeArgs = [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=2',
  `--window-size=${width},${HEIGHT}`,
  `--screenshot=${outPath}`,
  '--virtual-time-budget=9000',
  url,
];

try {
  execFileSync(CHROME, chromeArgs, { stdio: 'pipe' });
} catch (err) {
  const stderr = err.stderr?.toString().trim() ?? '';
  console.error(`Chrome exited with error:\n${stderr || err.message}`);
  process.exit(1);
}

if (!existsSync(outPath)) {
  console.error(`Error: Chrome ran successfully but output file was not created at:\n  ${outPath}`);
  process.exit(1);
}

const { size } = statSync(outPath);
console.log(`Captured mobile screenshot:`);
console.log(`  outPath : ${outPath}`);
console.log(`  width   : ${width}px  (rendered at 2x → ${width * 2}px physical)`);
console.log(`  url     : ${url}`);
console.log(`  size    : ${(size / 1024).toFixed(1)} KB (${size} bytes)`);
