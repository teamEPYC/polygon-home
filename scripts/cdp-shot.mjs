/**
 * cdp-shot.mjs — mobile-EMULATED screenshot via CDP.
 *
 * extract-mobile.mjs uses a plain Chrome window, which renders polygon.technology
 * with a different (transitional) layout than a real device. This captures with
 * Emulation.setDeviceMetricsOverride mobile:true, matching cdp-eval.mjs's
 * measurements, so screenshots and extracted numbers describe the SAME render.
 *
 * Usage:
 *   node scripts/cdp-shot.mjs <outPath> [width] [url] [clipHeight]
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';

const CHROME = '/usr/bin/google-chrome-stable';
const [, , outArg, widthArg, urlArg, clipHArg] = process.argv;
if (!outArg) { console.error('Usage: cdp-shot.mjs <outPath> [width] [url] [clipHeight]'); process.exit(1); }
const outPath = resolve(outArg);
const width = parseInt(widthArg ?? '500', 10);
const url = urlArg ?? 'https://polygon.technology';
const clipH = parseInt(clipHArg ?? '900', 10);
mkdirSync(dirname(outPath), { recursive: true });

const userDataDir = mkdtempSync(join(tmpdir(), 'cdpshot-'));
const port = 9400 + (width % 500);
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--no-default-browser-check', `--user-data-dir=${userDataDir}`,
  `--remote-debugging-port=${port}`, 'about:blank',
], { stdio: 'pipe' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let msgId = 0;
function cdp(ws, method, params = {}, sessionId) {
  const id = ++msgId;
  return new Promise((resolve, reject) => {
    const onMsg = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id === id) { ws.removeEventListener('message', onMsg); m.error ? reject(new Error(m.error.message)) : resolve(m.result); }
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
}
async function wsUrl() {
  for (let i = 0; i < 50; i++) {
    try { const j = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl; } catch {}
    await sleep(100);
  }
  throw new Error('CDP did not come up');
}

async function main() {
  const ws = new WebSocket(await wsUrl());
  await new Promise((r) => (ws.onopen = r));
  const { targetId } = await cdp(ws, 'Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp(ws, 'Target.attachToTarget', { targetId, flatten: true });
  await cdp(ws, 'Page.enable', {}, sessionId);
  await cdp(ws, 'Emulation.setDeviceMetricsOverride', { width, height: clipH, deviceScaleFactor: 2, mobile: true }, sessionId);
  await cdp(ws, 'Page.navigate', { url }, sessionId);
  await new Promise((resolve) => {
    const onMsg = (ev) => { if (JSON.parse(ev.data).method === 'Page.loadEventFired') { ws.removeEventListener('message', onMsg); resolve(); } };
    ws.addEventListener('message', onMsg);
  });
  await sleep(3000);
  // Strip cookie/consent banners (and other fixed bottom overlays) so they don't
  // hide the section being verified.
  await cdp(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const kill = [];
      for (const el of document.querySelectorAll('*')) {
        const t = (el.textContent || '').toLowerCase();
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' && /cookie|consent|essential cookies/.test(t) && t.length < 600) kill.push(el);
        if (/cookie|consent|osano|onetrust|cky-/i.test((el.className || '') + ' ' + (el.id || ''))) kill.push(el);
      }
      kill.forEach(e => e.remove());
    })()`,
  }, sessionId);
  await sleep(200);
  const { data } = await cdp(ws, 'Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width, height: clipH, scale: 1 },
    captureBeyondViewport: true,
  }, sessionId);
  writeFileSync(outPath, Buffer.from(data, 'base64'));
  console.log(`Captured (mobile-emulated): ${outPath}  ${width}×${clipH} @2x`);
  ws.close(); chrome.kill(); process.exit(0);
}
main().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
