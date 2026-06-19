// Usage: node scripts/cap-section.mjs <url> <outPng> <matchText>
// Locates the <section> containing matchText, clips its bounding box at DPR2.
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
const CHROME = '/usr/bin/google-chrome-stable';
const [, , url, out, matchText] = process.argv;
mkdirSync(dirname(out), { recursive: true });
const userDataDir = mkdtempSync(join(tmpdir(), 'cs-'));
const port = 9500 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ['--headless=new','--disable-gpu','--hide-scrollbars','--no-first-run','--mute-audio',`--user-data-dir=${userDataDir}`,`--remote-debugging-port=${port}`,'about:blank'], { stdio: 'pipe' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function getWs(){for(let i=0;i<60;i++){try{const r=await fetch(`http://127.0.0.1:${port}/json/version`);const j=await r.json();if(j.webSocketDebuggerUrl)return j.webSocketDebuggerUrl;}catch{}await sleep(100);}throw new Error('no cdp');}
let id=0;
function cdp(ws,m,p={},s){const i=++id;return new Promise((res,rej)=>{const on=ev=>{const x=JSON.parse(ev.data);if(x.id===i){ws.removeEventListener('message',on);x.error?rej(new Error(x.error.message)):res(x.result);}};ws.addEventListener('message',on);ws.send(JSON.stringify({id:i,method:m,params:p,sessionId:s}));});}
async function evalp(ws,s,e){const{result}=await cdp(ws,'Runtime.evaluate',{expression:e,returnByValue:true,awaitPromise:true},s);return result.value;}
const ws=new WebSocket(await getWs());await new Promise(r=>ws.onopen=r);
const{targetId}=await cdp(ws,'Target.createTarget',{url:'about:blank'});
const{sessionId}=await cdp(ws,'Target.attachToTarget',{targetId,flatten:true});
await cdp(ws,'Page.enable',{},sessionId);await cdp(ws,'Runtime.enable',{},sessionId);
await cdp(ws,'Emulation.setDeviceMetricsOverride',{width:1440,height:2700,deviceScaleFactor:2,mobile:false},sessionId);
await cdp(ws,'Page.navigate',{url},sessionId);
await new Promise(r=>{const on=ev=>{if(JSON.parse(ev.data).method==='Page.loadEventFired'){ws.removeEventListener('message',on);r();}};ws.addEventListener('message',on);});
await sleep(3500);
await evalp(ws,sessionId,"(function(){for(const el of document.querySelectorAll('*')){const t=(el.textContent||'').toLowerCase();const cs=getComputedStyle(el);if(cs.position==='fixed'&&/cookie|consent|essential/.test(t)&&t.length<800)el.remove();}return 1;})()");
const box=await evalp(ws,sessionId,`(function(){var els=[].slice.call(document.querySelectorAll('h1,h2,h3,p'));var a=els.find(function(e){return e.textContent.indexOf(${JSON.stringify(matchText)})>=0;});if(!a)return null;var s=a.closest('section');if(!s)return null;var r=s.getBoundingClientRect();return {x:0,y:Math.round(r.top+window.scrollY),w:Math.round(r.width),h:Math.round(r.height)};})()`);
if(!box){console.error('match not found');process.exit(1);}
await evalp(ws,sessionId,`window.scrollTo(0,${box.y});`); await sleep(2000);
const{data}=await cdp(ws,'Page.captureScreenshot',{format:'png',clip:{x:0,y:box.y,width:1440,height:box.h,scale:2}},sessionId);
writeFileSync(out,Buffer.from(data,'base64'));
console.log('captured',out,JSON.stringify(box));
ws.close();chrome.kill();process.exit(0);
