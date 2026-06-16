/**
 * cdp-eval.mjs
 *
 * Launches headless Chrome, emulates a mobile viewport, navigates to a URL,
 * and evaluates a JS expression in the page — returning the JSON result.
 * This is the "extract-first" half of the pixel-fidelity loop: it pulls REAL
 * computed CSS values (getBoundingClientRect / getComputedStyle) from live,
 * not just a screenshot.
 *
 * Usage:
 *   node scripts/cdp-eval.mjs <evalFile> [width] [url]
 *
 *   evalFile : path to a .js file whose contents are an expression evaluated
 *              in the page. Must evaluate to a JSON-serialisable value.
 *   width    : CSS viewport width (default 375)
 *   url      : default https://polygon.technology
 */
import { spawn } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = '/usr/bin/google-chrome-stable';
const [, , evalFile, widthArg, urlArg] = process.argv;
const width = parseInt(widthArg ?? '375', 10);
const url = urlArg ?? 'https://polygon.technology';
const expression = readFileSync(evalFile, 'utf8');

const userDataDir = mkdtempSync(join(tmpdir(), 'cdp-'));
const port = 9300 + Math.floor((width % 500));

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  `--remote-debugging-port=${port}`,
  'about:blank',
], { stdio: 'pipe' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      const j = await res.json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch {}
    await sleep(100);
  }
  throw new Error('Chrome CDP did not come up');
}

let msgId = 0;
function cdp(ws, method, params = {}, sessionId) {
  const id = ++msgId;
  return new Promise((resolve, reject) => {
    const onMsg = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id === id) {
        ws.removeEventListener('message', onMsg);
        if (m.error) reject(new Error(m.error.message));
        else resolve(m.result);
      }
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
}

async function main() {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => (ws.onopen = r));

  const { targetId } = await cdp(ws, 'Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp(ws, 'Target.attachToTarget', { targetId, flatten: true });

  await cdp(ws, 'Page.enable', {}, sessionId);
  await cdp(ws, 'Runtime.enable', {}, sessionId);
  // Mobile-emulated render — the coherent layout a real phone shows, and what
  // cdp-shot.mjs screenshots, so measurements and screenshots describe the SAME
  // render. Set MOBILE=0 to fall back to a plain window.
  await cdp(ws, 'Emulation.setDeviceMetricsOverride', {
    width, height: 812, deviceScaleFactor: 2, mobile: process.env.MOBILE !== '0',
  }, sessionId);

  await cdp(ws, 'Page.navigate', { url }, sessionId);
  // wait for load
  await new Promise((resolve) => {
    const onMsg = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.method === 'Page.loadEventFired') { ws.removeEventListener('message', onMsg); resolve(); }
    };
    ws.addEventListener('message', onMsg);
  });
  await sleep(2500); // settle animations / lazy content

  const { result, exceptionDetails } = await cdp(ws, 'Runtime.evaluate', {
    expression: `JSON.stringify((() => { return (${expression}); })())`,
    returnByValue: true,
    awaitPromise: true,
  }, sessionId);

  if (exceptionDetails) {
    console.error('Eval error:', exceptionDetails.exception?.description || exceptionDetails.text);
    process.exit(1);
  }
  console.log(result.value);
  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
