# OMS Products Zigzag Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the reused homepage `OpenMoneyStack` on `/open-money-stack` with a new `OmsProducts` desktop section that pixel-matches the live "Global rails for upgraded money" zigzag (4 alternating L/R product cards around a central video column, connector lines running only to the middle behind the video).

**Architecture:** New self-contained `components/sections/oms-products.tsx` using the same 1440×H scale-to-fit stage pattern as the existing section. Small presentational bits (`DotHex`, `ExploreArrow`, arrow path constants) and the `SecondaryCard` are exported from the existing `open-money-stack.tsx` and reused (no duplication). The central video reuses `OmsVideoPlayer`. Homepage is untouched; only the OMS page import is swapped.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4 (inline `@theme`), TypeScript strict. Verification via headless Chrome (CDP) screenshot + `sharp` crop/diff against the live reference.

## Global Constraints

- Tailwind v4, semantic token classes only — EXCEPT this section's fixed blue scene (`#3449C1`, dot accent colors, `#707bb7` lines) which do NOT theme-flip on live; copy those literals as the existing component does.
- Typography as single utilities (`text-desktop-h2`, `text-desktop-h3`, etc.), never reconstructed.
- Server Components by default; `'use client'` only for browser APIs/hooks. `OmsProducts` is a Server Component (its client children — `ScrambleText`, `OmsVideoPlayer` — are already client components).
- No Figma CDN URLs; assets live under `public/assets/`.
- Desktop only this pass (≥768px / `md:block`). Mobile is out of scope.
- Live source of truth: `polygon.technology/open-money-stack`. Live reference image: `.figma-ref/oms-page/live-products-d.png` (full section, DPR2).
- Section is a 1440×**2595** stage. All coordinates below are **section-relative** (page-y − 1082).
- Exact OMS copy (differs from homepage defaults — use these verbatim):
  - Heading: `Global rails for upgraded money`
  - Body: `One stack for wallets, compliance, on- and off-ramps, and settlement. Built to plug into existing systems and move money in seconds.`
  - Eyebrow: `PRODUCTS`

---

## File Structure

- **Create** `components/sections/oms-products.tsx` — `OmsProducts` section + `OmsProductCard` + product/coming-soon data.
- **Modify** `components/sections/open-money-stack.tsx` — add `export` to `DotHex`, `ExploreArrow`, `ARROW_BOX`, `ARROW_TRI`, `SecondaryCard` (no behavior change).
- **Modify** `app/open-money-stack/page.tsx` — swap `<OpenMoneyStack …>` → `<OmsProducts />`.
- **Create** `scripts/cap-section.mjs` — reusable CDP capture: locate a section by text, clip its bounding box at DPR2 (used for both live and localhost verification).

### Reference coordinates (section-relative, from live @1440)

| Element | y | x / w |
|---|---|---|
| Eyebrow `PRODUCTS` pill (centered) | 252 | center x720, w115 |
| Heading (centered, `text-desktop-h2`) | 460 | w≈534 |
| Body (centered, 18px) | 606 | wrap w660 |
| Central video (`OmsVideoPlayer`) | 722 | centered, **w390** (h auto ≈1208) |
| Card 1 Wallet — LEFT | 792 | box left59 **w596** → line 59→655 |
| Card 2 Crosschain — RIGHT | 1122 | box left853 **w530** → line 853→1383 |
| Card 3 On/Off — LEFT | 1465 | box left59 **w596** |
| Card 4 Blockchain — RIGHT | 1827 | box left853 **w530** |
| Coming-soon: Stablecoin (left) / KYC Hub (right) | 2151 | left59 / left735, each w648 h142 |
| Bottom inverted-primary grid band | 2235 | full width h360 |

Card content column widths: LEFT 417, RIGHT 371 (pinned to outer margin). Button-wrap width: LEFT 316, RIGHT 304.

---

## Task 1: Component shell — background, top block, video, page swap

**Files:**
- Create: `components/sections/oms-products.tsx`
- Create: `scripts/cap-section.mjs`
- Modify: `app/open-money-stack/page.tsx`

**Interfaces:**
- Produces: `export function OmsProducts(): JSX.Element` — no props (content is internal).

- [ ] **Step 1: Create the capture/verify script**

Create `scripts/cap-section.mjs`:

```js
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
const box=await evalp(ws,sessionId,`(function(){var els=[].slice.call(document.querySelectorAll('h1,h2,h3'));var a=els.find(function(e){return e.textContent.indexOf(${JSON.stringify(matchText)})>=0;});if(!a)return null;var s=a.closest('section');var r=s.getBoundingClientRect();return {x:0,y:Math.round(r.top+window.scrollY),w:Math.round(r.width),h:Math.round(r.height)};})()`);
if(!box){console.error('match not found');process.exit(1);}
await evalp(ws,sessionId,`window.scrollTo(0,${box.y});`); await sleep(2000);
const{data}=await cdp(ws,'Page.captureScreenshot',{format:'png',clip:{x:0,y:box.y,width:1440,height:box.h,scale:2}},sessionId);
writeFileSync(out,Buffer.from(data,'base64'));
console.log('captured',out,JSON.stringify(box));
ws.close();chrome.kill();process.exit(0);
```

- [ ] **Step 2: Create the component shell** (`components/sections/oms-products.tsx`)

```tsx
import { OmsVideoPlayer } from "@/components/ui/oms-video-player";
import { OMSStaircase } from "./oms-staircase";

const STAGE_H = 2595;
const HEADING = "Global rails for upgraded money";
const BODY =
  "One stack for wallets, compliance, on- and off-ramps, and settlement. Built to plug into existing systems and move money in seconds.";
const EYEBROW = "PRODUCTS";

export function OmsProducts() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#3449c1]"
      style={{ containerType: "inline-size" }}
    >
      <div
        className="relative hidden w-full overflow-hidden md:block"
        style={{ aspectRatio: `1440 / ${STAGE_H}` }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: 1440, height: STAGE_H, transform: "scale(calc(100cqw / 1440px))" }}
        >
          {/* Background — same radial + faint grid as the homepage section */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 50% 40%, #273ead, #2941b7 39%, #07092c 75%)" }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "120px 120px",
            }}
          />

          {/* Top platform + eyebrow (reused) */}
          <OMSStaircase eyebrow={EYEBROW} />

          {/* Heading — text-desktop-h2, centered, 2-line wrap */}
          <p
            className="absolute left-1/2 -translate-x-1/2 text-desktop-h2 text-white text-center w-[560px]"
            style={{ top: 460 }}
          >
            {HEADING}
          </p>

          {/* Body — 18px body-large, centered */}
          <p
            className="absolute left-1/2 -translate-x-1/2 text-desktop-body-large text-white text-center w-[660px]"
            style={{ top: 606 }}
          >
            {BODY}
          </p>

          {/* Central video column — reused asset, 390px wide, centered */}
          <div className="absolute left-1/2 -translate-x-1/2 w-[390px] z-10" style={{ top: 722 }}>
            <OmsVideoPlayer />
          </div>

          {/* Product cards + coming-soon + bottom grid added in later tasks */}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Swap the component on the OMS page**

In `app/open-money-stack/page.tsx`: replace the import `import { OpenMoneyStack } from "@/components/sections/open-money-stack";` with `import { OmsProducts } from "@/components/sections/oms-products";`, and replace the JSX block:

```tsx
        <OpenMoneyStack
          eyebrow="PRODUCTS"
          heading="Global rails for upgraded money"
        />
```

with:

```tsx
        <OmsProducts />
```

- [ ] **Step 4: Verify it compiles and the top renders**

Ensure dev server is running (`pnpm dev` on :3000). Then:

```bash
node scripts/cap-section.mjs http://localhost:3000/open-money-stack /tmp/oms-local-1.png "Global rails"
node -e "require('sharp')('/tmp/oms-local-1.png').resize(560).png().toFile('/tmp/oms-local-1-s.png').then(()=>console.log('ok'))"
```

Expected: capture succeeds (page compiles), the eyebrow/heading/body and the central video column render. Visually compare `/tmp/oms-local-1-s.png` top region to `.figma-ref/oms-page/live-products-d.png` — heading at ~y460, body ~y606, video centered.

- [ ] **Step 5: Commit**

```bash
git add components/sections/oms-products.tsx scripts/cap-section.mjs app/open-money-stack/page.tsx
git commit -m "feat(oms-page): scaffold OmsProducts shell + swap on page"
```

---

## Task 2: Zigzag product cards

**Files:**
- Modify: `components/sections/open-money-stack.tsx` (export shared bits)
- Modify: `components/sections/oms-products.tsx` (add `OmsProductCard` + render 4 cards)

**Interfaces:**
- Consumes from `open-money-stack.tsx`: `export function DotHex({color}), export function ExploreArrow({color}), export const ARROW_BOX, export const ARROW_TRI`.
- Produces: `OmsProductCard({ side, tag, title, subtitle, description, wireIcon, dot, explore, logo, top })`.

- [ ] **Step 1: Export the shared bits from `open-money-stack.tsx`**

Change these declarations (add `export`, no other change):
- `function DotHex(` → `export function DotHex(`
- `const ARROW_BOX =` → `export const ARROW_BOX =`
- `const ARROW_TRI =` → `export const ARROW_TRI =`
- `function ExploreArrow(` → `export function ExploreArrow(`

- [ ] **Step 2: Add `OmsProductCard` to `oms-products.tsx`**

Add imports at top:

```tsx
import Image from "next/image";
import { ScrambleText } from "@/components/ui/scramble-text";
import { DotHex, ExploreArrow } from "./open-money-stack";
```

Add the card component and the product data (before `OmsProducts`):

```tsx
type Side = "left" | "right";

type Product = {
  side: Side;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  wireIcon: string;
  dot: string;
  explore: string;
  logo: string | null;
  top: number;
};

// Exact OMS copy + per-row dot colors. Wire icons / powered-by logos reuse the
// existing repo assets (verified against live in Task 4).
const PRODUCTS: Product[] = [
  {
    side: "left", tag: "LIVE", title: "Wallet Infrastructure",
    subtitle: "one-click wallet creation to give your users an onchain account",
    description: "Easily onboard users with a single wallet address with zero-config auth and enterprise-grade security.",
    wireIcon: "/assets/ico-wire-chains.png", dot: "#00FF08",
    explore: "Explore Sequence", logo: "/assets/logo-sequence.png", top: 792,
  },
  {
    side: "right", tag: "LIVE", title: "Crosschain Interop",
    subtitle: "one-click crypto transactions with any chain",
    description: "All-in-one integration, enabling users to transact with any wallet, any token, on any chain, bringing deep unified liquidity.",
    wireIcon: "/assets/ico-wire-trails.png", dot: "#E271D7",
    explore: "Get API key", logo: "/assets/logo-trails.svg", top: 1122,
  },
  {
    side: "left", tag: "LIVE", title: "On/Off and\nCash Ramps",
    subtitle: "Physical cash and digital fiat on- and off-ramps",
    description: "Grow your revenue by offering on- and off-ramps, pay with crypto, earn yield, and more. All with enterprise-grade security.",
    wireIcon: "/assets/ico-wire-wallet.png", dot: "#FF7421",
    explore: "Explore On/Off Cash Ramps", logo: "/assets/logo-coinme.png", top: 1465,
  },
  {
    side: "right", tag: "LIVE", title: "Blockchain Rails",
    subtitle: "The go-to settlement layer to move money globally",
    description: "Use crypto to offer faster, cheaper payments, anywhere in the world.",
    wireIcon: "/assets/ico-wire-bpn.png", dot: "#00BBFF",
    explore: "Explore Polygon Chain", logo: null, top: 1827,
  },
];

// Per-side geometry. Card box carries the border-top line; content column is
// pinned to the outer margin so the line overshoots toward center (behind video).
const SIDE: Record<Side, { left: number; width: number; content: number; btnW: number }> = {
  left:  { left: 59,  width: 596, content: 417, btnW: 316 },
  right: { left: 853, width: 530, content: 371, btnW: 304 },
};

function OmsProductCard(p: Product) {
  const g = SIDE[p.side];
  const right = p.side === "right";
  return (
    <a
      href="#"
      className="scramble-host group absolute border-t border-[#707bb7] hover:border-white transition-colors cursor-pointer [--bc:#707bb7] hover:[--bc:white]"
      style={{ top: p.top, left: g.left, width: g.width }}
    >
      <div className={`flex flex-col gap-[16px] ${right ? "ml-auto items-end text-right" : "items-start text-left"}`} style={{ width: g.content }}>
        {/* Badge — corner-tick pill; self-start/-end per side */}
        <div className={`relative inline-flex items-center px-[12px] py-[6px] border border-[var(--bc)] transition-colors ${right ? "self-end" : "self-start"}`}>
          <span className="absolute top-0 left-0 size-[6px] text-[var(--bc)]"><svg width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M0 0H6L0 6V0Z" fill="currentColor" /></svg></span>
          <span className="text-desktop-mono-medium text-[rgba(255,255,255,0.7)] group-hover:text-white transition-colors whitespace-nowrap pt-[1px]">{p.tag}</span>
          <span className="absolute bottom-0 right-0 size-[6px] text-[var(--bc)]"><svg width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M6 6H0L6 0V6Z" fill="currentColor" /></svg></span>
        </div>

        {/* Heading + subtitle */}
        <div className="flex flex-col gap-[8px] w-full">
          <h3 className="text-desktop-h3 text-[rgba(255,255,255,0.7)] group-hover:text-white transition-colors whitespace-pre-line">{p.title}</h3>
          <p className="text-desktop-mono-medium uppercase text-[rgba(255,255,255,0.7)]">{p.subtitle}</p>
        </div>

        {/* Button-wrap — wire icon cell + explore cell */}
        <div className="grid grid-cols-2 border-t border-[var(--bc)] transition-colors" style={{ width: g.btnW }}>
          <div className="relative border-l border-b border-[var(--bc)] transition-colors flex items-center justify-start" style={{ minHeight: 100 }}>
            <Image src={p.wireIcon} alt="" width={151} height={98} className="object-contain max-w-[151px]" unoptimized />
            <div className="absolute" style={{ left: 11, top: 11 }}><DotHex color={p.dot} /></div>
          </div>
          <div className="relative flex flex-col justify-between items-end p-[14px]" style={{ minHeight: 100 }}>
            <svg className="absolute pointer-events-none" style={{ inset: "-1px 0 0 0", zIndex: -1, color: "var(--bc)", width: "100%", height: "100%" }} viewBox="0 0 156 100" preserveAspectRatio="none" fill="none">
              <path d="M154 0.5C154.828 0.5 155.5 1.17157 155.5 2V83.2881C155.5 84.2245 155.124 85.1227 154.458 85.7803L141.576 98.4912C140.921 99.1374 140.038 99.5 139.118 99.5H0.5V0.5H154Z" stroke="currentColor" />
            </svg>
            <span className="text-desktop-mono-small uppercase text-[rgba(255,255,255,0.7)] group-hover:text-white transition-colors text-right"><ScrambleText>{p.explore}</ScrambleText></span>
            <ExploreArrow color={p.dot} />
          </div>
        </div>

        {/* Description */}
        <p className="text-desktop-body text-[rgba(255,255,255,0.7)] leading-[1.4] w-full">{p.description}</p>

        {/* Powered by */}
        {p.logo && (
          <div className={`flex items-center gap-[12px] mt-[10px] ${right ? "flex-row-reverse" : ""}`}>
            <span className="text-desktop-mono-small uppercase text-[rgba(255,255,255,0.7)]">powered by</span>
            <Image src={p.logo} alt="" width={120} height={20} className="h-[20px] w-auto object-contain" unoptimized />
          </div>
        )}
      </div>
    </a>
  );
}
```

- [ ] **Step 3: Render the cards in `OmsProducts`**

Replace the comment `{/* Product cards + coming-soon + bottom grid added in later tasks */}` with:

```tsx
          {PRODUCTS.map((p) => (
            <OmsProductCard key={p.title} {...p} />
          ))}
```

- [ ] **Step 4: Verify the zigzag**

```bash
node scripts/cap-section.mjs http://localhost:3000/open-money-stack /tmp/oms-local-2.png "Global rails"
node -e "require('sharp')('/tmp/oms-local-2.png').resize(560).png().toFile('/tmp/oms-local-2-s.png').then(()=>console.log('ok'))"
```

Expected: 4 cards at the correct L/R positions; each card's top line runs from its margin toward center and stops behind the video (LEFT line ends x655, RIGHT line starts x853); LEFT badges top-left, RIGHT badges top-right; button-wrap with wire icon + colored dot + explore + arrow; powered-by on Wallet/Crosschain/On-Off, none on Blockchain. Compare against the live ref. (Fine-tuning of gaps happens in Task 4.)

- [ ] **Step 5: Commit**

```bash
git add components/sections/open-money-stack.tsx components/sections/oms-products.tsx
git commit -m "feat(oms-page): zigzag product cards (L/R) with center-tucked lines"
```

---

## Task 3: Coming-soon cards + bottom grid band

**Files:**
- Modify: `components/sections/open-money-stack.tsx` (export `SecondaryCard`)
- Modify: `components/sections/oms-products.tsx` (render coming-soon + bottom grid)

**Interfaces:**
- Consumes: `export function SecondaryCard({ title, description, icon })` from `open-money-stack.tsx`.

- [ ] **Step 1: Export `SecondaryCard`**

In `open-money-stack.tsx`: `function SecondaryCard(` → `export function SecondaryCard(`.

- [ ] **Step 2: Render coming-soon cards + bottom grid in `OmsProducts`**

Add import: `import { SecondaryCard } from "./open-money-stack";`

After the `PRODUCTS.map(...)` block, add:

```tsx
          {/* Coming-soon cards — Stablecoin (left x59) / KYC Hub (right x735), y2151 */}
          <div className="absolute" style={{ top: 2151, left: 59 }}>
            <SecondaryCard
              title="Stablecoin Orchestration"
              description="Enterprise payments infrastructure for stablecoins and tokenized deposits"
              icon="/assets/ico-kit.png"
            />
          </div>
          <div className="absolute" style={{ top: 2151, left: 735 }}>
            <SecondaryCard
              title="KYC Hub"
              description="Manage all payments-related KYC in one place. Worry about your customers while we take care of the rest."
              icon="/assets/ico-pay.png"
            />
          </div>

          {/* Bottom inverted-primary grid band — reuse the homepage SVG (y2235 h121
              row of cells with a diagonal-cut leftmost corner). Theme tokens flip. */}
          <svg
            className="absolute left-0 w-full h-[121px]"
            style={{ top: 2235 }}
            viewBox="0 0 1441.71 121.707"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <g fill="var(--color-inverted-primary)" stroke="var(--color-stroke)">
              <path d="M1081.21 1.20711H1201.21V121.207H1081.21V1.20711Z" />
              <path d="M1201.21 1.20711H1321.21V121.207H1201.21V1.20711Z" />
              <path d="M1321.21 1.20711H1441.21V121.207H1321.21V1.20711Z" />
              <path d="M961.207 1.20711H1081.21V121.207H961.207V1.20711Z" />
              <path d="M841.207 1.20711H961.207V121.207H841.207V1.20711Z" />
              <path d="M481.207 1.20711H601.207V121.207H481.207V1.20711Z" />
              <path d="M601.207 1.20711H721.207V121.207H601.207V1.20711Z" />
              <path d="M721.207 1.20711H841.207V121.207H721.207V1.20711Z" />
              <path d="M361.207 1.20711H481.207V121.207H361.207V1.20711Z" />
              <path d="M241.207 1.20711H361.207V121.207H241.207V1.20711Z" />
              <path d="M121.207 1.20711H241.207V121.207H121.207V1.20711Z" />
              <path d="M121.207 1.20711V121.207H1.20711L121.207 1.20711Z" />
            </g>
            <rect x="1.20711" y="1.20711" width="120" height="120" fill="none" stroke="var(--grid-stroke)" />
          </svg>
```

- [ ] **Step 3: Verify the bottom**

```bash
node scripts/cap-section.mjs http://localhost:3000/open-money-stack /tmp/oms-local-3.png "Global rails"
node -e "require('sharp')('/tmp/oms-local-3.png').extract({left:0,top:4200,width:2880,height:1100}).resize(900).png().toFile('/tmp/oms-bottom-s.png').then(()=>console.log('ok'))"
```

Expected: two coming-soon cards side-by-side at y2151 (Stablecoin left, KYC Hub right) with COMING SOON badges + 3D icons, then the bottom grid band. Compare bottom of `.figma-ref/oms-page/live-products-d.png`.

- [ ] **Step 4: Commit**

```bash
git add components/sections/open-money-stack.tsx components/sections/oms-products.tsx
git commit -m "feat(oms-page): coming-soon cards + bottom grid band"
```

---

## Task 4: Full-section pixel verification + tuning

**Files:**
- Modify: `components/sections/oms-products.tsx` (tune deltas only)

- [ ] **Step 1: Capture local + live at matched scale**

```bash
node scripts/cap-section.mjs http://localhost:3000/open-money-stack /tmp/oms-local-final.png "Global rails"
# live ref already at .figma-ref/oms-page/live-products-d.png
node -e "const sharp=require('sharp');(async()=>{await sharp('/tmp/oms-local-final.png').resize(560).png().toFile('/tmp/oms-fin-s.png');await sharp('.figma-ref/oms-page/live-products-d.png').resize(560).png().toFile('/tmp/oms-live-s.png');console.log('ok');})()"
```

- [ ] **Step 2: Per-element zoom checks**

For each card, crop both local and live at the same region and compare. Example (Wallet card, live coords y792→1123 rel = page-y region within the DPR2 ref):

```bash
node -e "const sharp=require('sharp');(async()=>{for(const [f,o] of [['/tmp/oms-local-final.png','/tmp/wallet-local.png'],['.figma-ref/oms-page/live-products-d.png','/tmp/wallet-live.png']]){await sharp(f).extract({left:0,top:1540,width:1400,height:760}).resize(700).png().toFile(o);}console.log('ok');})()"
```

Verify per the Pixel-Perfect Fidelity Protocol — produce a PASS/FAIL table with columns: element, live value, local value, status. Cover for every card: badge corner + text, heading, subtitle wrap, wire icon, dot color, explore label, arrow box, description wrap, powered-by logo presence/position, **line span** (LEFT ends x655 / RIGHT starts x853), and default vs hover.

- [ ] **Step 3: Tune deltas inline**

Adjust only the offending values in `oms-products.tsx` (card gaps, `top`, content/btn widths, heading/body width or y). Re-run Step 1–2 until the diff is clean. Do NOT claim done without the PASS/FAIL table.

- [ ] **Step 4: Confirm no regressions**

```bash
node scripts/cap-section.mjs http://localhost:3000/ /tmp/home-oms.png "open stack for money" || echo "home section unaffected (different copy) — skip"
```

Spot-check the homepage `/` OMS section still renders (the exported-bits refactor must not change it).

- [ ] **Step 5: Final commit**

```bash
git add components/sections/oms-products.tsx
git commit -m "fix(oms-page): pixel-tune zigzag products to live"
```

---

## Self-Review

**Spec coverage:** top block (Task 1) ✓, central video (Task 1) ✓, 4 zigzag cards + center-tucked lines + hover (Task 2) ✓, single-column card anatomy (Task 2) ✓, coming-soon cards (Task 3) ✓, bottom grid (Task 3) ✓, component swap + no homepage change (Task 1/2) ✓, verification + PASS/FAIL (Task 4) ✓. Mobile explicitly out of scope ✓.

**Placeholder scan:** copy strings are verbatim from live; coordinates are concrete; the only `null` (Blockchain `logo`, handled by the `{p.logo && …}` guard) is intentional.

**Type consistency:** `DotHex`/`ExploreArrow` signatures match `open-money-stack.tsx`; `SecondaryCard({title,description,icon})` matches its definition; `OmsProductCard` consumes the `Product` type defined in Task 2; `SIDE` keys match the `Side` union.

**Open verification points (resolved during Task 4, not placeholders):** exact card internal gaps, whether `OMSStaircase`'s top platform matches the OMS variant, and whether the reused wire-icon/logo assets visually match live — each has an explicit check + tune step.
