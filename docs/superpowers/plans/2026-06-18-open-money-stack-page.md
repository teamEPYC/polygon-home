# Open Money Stack Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/open-money-stack` page at full parity (desktop + mobile, light + dark) to the live site, reusing existing sections via props and adding three new sections.

**Architecture:** A new App Router route (`app/open-money-stack/page.tsx`) composes mostly-existing sections. Shared sections (`OpenMoneyStack`, `UseCasesCta`, `GetStartedCta`) are refactored to take **content props defaulted to their current homepage values**, so the homepage is unaffected. Three new sections (`HeroOMS`, `StatsBand`, `FaqSection`) plus one new reusable primitive (`ui/accordion.tsx`) are built section-by-section via the project's extract→build→screenshot-diff loop.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4 (`@theme inline`, `@utility`), TypeScript strict, next-themes, framer-motion. Verification: headless Chrome via `scripts/cdp-shot.mjs` + pixelmatch (`scripts/diff-mobile.mjs`).

## Global Constraints

- **No hardcoded color hex in components** — use semantic token classes (`text-primary`, `bg-inverted-primary`, `border-stroke`, …). Fixed accents (`#3449c1` blue band, white-on-blue text) are the only exceptions, matching existing sections.
- **Typography = single utility classes** (`text-desktop-h2`, `text-mobile-body`, …). Never reconstruct type with individual size/weight/leading classes unless the live value has no matching utility (then use inline style as existing sections do).
- **Sections use the scale-to-fit stage**: `DesktopStage` (1440 canvas) / `MobileStage width={500}`; parent `<section>` sets `containerType: 'inline-size'`. Desktop tree `hidden md:block`, mobile tree `md:hidden`.
- **Assets live in `public/assets/`** — download from live, never reference remote/Figma CDN URLs. SVG `<Image>` uses `unoptimized`.
- **Server Components by default**; add `'use client'` only for hooks/events/video/scramble.
- **Reused-section refactors must default to current homepage values** so `app/page.tsx` renders byte-identical (proven by a before/after homepage diff each refactor task).
- **Definition of done per new/changed section**: a per-element PASS/FAIL table (live value vs ours) covering color, placement, asset contents, icon path, spacing, and hover — desktop dark, desktop light, and mobile. (Per `CLAUDE.md` Pixel-Perfect Fidelity Protocol.)
- **Branch:** `feature/open-money-stack-page` (already cut from `main`). Commit after every task.

## Verification Loop (used by every new-section task)

The "test cycle" for visual sections (replaces unit tests):

1. **Capture live reference** (source of truth):
   - Desktop: `node scripts/cdp-shot.mjs .figma-ref/oms-page/live-<section>-d.png 1440 "https://polygon.technology/open-money-stack" <clipH>`
   - Mobile: `node scripts/cdp-shot.mjs .figma-ref/oms-page/live-<section>-m.png 500 "https://polygon.technology/open-money-stack" <clipH>`
   - (Toggle the live theme to capture light + dark; the live theme toggle is clicked via CDP as documented in the `light-mode-capture-and-map` memory.)
2. **Extract** exact DOM/computed values for each element (text, computed color, padding, gap, size, SVG path, asset file) using `scripts/cdp-eval.mjs` before writing code. Download every new asset into `public/assets/`.
3. **Build** the section to those values.
4. **Capture local** the same crop: `node scripts/cdp-shot.mjs .figma-ref/oms-page/local-<section>-d.png 1440 "http://localhost:3000/open-money-stack" <clipH>`.
5. **Diff**: `node scripts/diff-mobile.mjs <live> <local> .figma-ref/oms-page/<section>` → inspect `-side`/`-overlay`/`-diff` outputs.
6. **Per-element PASS/FAIL table** (live value vs ours). Iterate 2–4 until every element passes.

A task is "done" only when its table is all-PASS in dark, light, and mobile.

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `app/open-money-stack/page.tsx` | Route: metadata + section composition | Create |
| `components/sections/open-money-stack.tsx` | Products band — add content props (defaults = current) | Modify |
| `components/sections/use-cases.tsx` | Use-cases staircase + GetStartedCta — add content props; export `GetStartedCta` so the page can place/parameterize it | Modify |
| `components/sections/hero-oms.tsx` | New hero — heading, sub-copy, 2 CTAs, gradient bg | Create |
| `components/sections/stats-band.tsx` | New stats band — eyebrow + heading + 6 metric cards | Create |
| `components/sections/faq.tsx` | New FAQ — eyebrow + heading + contact link + 3 accordion rows | Create |
| `components/ui/accordion.tsx` | New reusable accordion primitive | Create |
| `public/assets/oms-page/…` | New downloaded assets for this page | Create |
| `.figma-ref/oms-page/…` | Live/local screenshots + diffs (gitignored ref dir) | Create |

---

## Task 1: Parameterize `OpenMoneyStack` (Products band)

Make the section accept content props, defaulting to today's homepage values, so the page can pass the `/open-money-stack` copy ("PRODUCTS" eyebrow, "Global rails for upgraded money") while the homepage stays identical.

**Files:**
- Modify: `components/sections/open-money-stack.tsx`
- Reference (unchanged): `app/page.tsx` (still calls `<OpenMoneyStack />` with no props)

**Interfaces:**
- Produces: `OpenMoneyStack(props?: OmsContent)` where
  ```ts
  type OmsProductItem = {
    badge: string; title: string; subtitle: string; description: string;
    wireIcon: string; dotColor?: string; exploreText: string; poweredByLogo?: string;
  };
  type OmsComingSoonItem = { title: string; description: string; icon: string };
  type OmsContent = {
    eyebrow?: string;            // default "OPEN MONEY STACK"
    heading?: string;           // default "One open stack for money movement"
    body?: string;              // default current body copy
    ctaLabel?: string;          // default "GET EARLY ACCESS"
    ctaHref?: string;           // default "#"
    products?: OmsProductItem[];        // default current 4 LIVE
    comingSoon?: OmsComingSoonItem[];   // default current 2
  };
  ```
- Consumes: existing `OMSStaircase`, `OmsVideoPlayer`, `ScrambleText`, `Eyebrow`, `Badge`.

- [ ] **Step 1: Capture homepage baseline (the regression "test")**

```bash
mkdir -p .figma-ref/oms-page
# Build + run the app first (see Task 3 Step note) or use the existing dev server.
node scripts/cdp-shot.mjs .figma-ref/oms-page/home-oms-BEFORE-d.png 1440 "http://localhost:3000" 2521
node scripts/cdp-shot.mjs .figma-ref/oms-page/home-oms-BEFORE-m.png 500 "http://localhost:3000" 3800
```
Expected: two screenshots of the current homepage OMS section saved.

- [ ] **Step 2: Lift hardcoded content to module-level defaults**

In `components/sections/open-money-stack.tsx`, move the existing hardcoded strings/arrays into exported default consts (verbatim current values), e.g.:

```ts
export const OMS_DEFAULT_EYEBROW = "OPEN MONEY STACK";
export const OMS_DEFAULT_HEADING = "One open stack for money movement";
export const OMS_DEFAULT_BODY =
  "A single place to instantly access the onchain economy, with worldwide distribution.";
export const OMS_DEFAULT_CTA = { label: "GET EARLY ACCESS", href: "#" };

export const OMS_DEFAULT_PRODUCTS: OmsProductItem[] = [
  /* the 4 existing ProductSection objects, copied verbatim from current desktop+mobile data */
];
export const OMS_DEFAULT_COMING_SOON: OmsComingSoonItem[] = [
  { title: "Stablecoin Orchestration", description: "Enterprise payments infrastructure for stablecoins and tokenized deposits", icon: "/assets/ico-kit.png" },
  { title: "KYC Hub", description: "Manage all payments-related KYC in one place. Worry about your customers while we take care of the rest.", icon: "/assets/ico-pay.png" },
];
```

Note: `MOBILE_PRODUCTS` carries an extra `mobileVideo` per item; keep the mobile data as its own default array (`OMS_DEFAULT_MOBILE_PRODUCTS`) so the desktop `products` prop and mobile videos stay decoupled. The mobile card copy must derive from the same `products` prop when supplied, falling back to defaults — wire the `mobileVideo` by index.

- [ ] **Step 3: Thread props through the component**

```ts
export function OpenMoneyStack({
  eyebrow = OMS_DEFAULT_EYEBROW,
  heading = OMS_DEFAULT_HEADING,
  body = OMS_DEFAULT_BODY,
  ctaLabel = OMS_DEFAULT_CTA.label,
  ctaHref = OMS_DEFAULT_CTA.href,
  products = OMS_DEFAULT_PRODUCTS,
  comingSoon = OMS_DEFAULT_COMING_SOON,
}: OmsContent = {}) {
  /* replace the hardcoded heading <p>, body <p>, CTA <a> text, and the
     .map() sources for ProductSection / SecondaryCard / MobileProductCard /
     MobileComingSoonCard with these props. */
}
```
Important: `OMSStaircase` renders the eyebrow today. If the eyebrow text must change per page, add an `eyebrow` prop to `OMSStaircase` too (default "OPEN MONEY STACK"); otherwise leave it. Keep the desktop heading width (`w-[652px]`) — note the new heading "Global rails for upgraded money" may wrap differently; the page that passes it will tune width in Task 4-equivalent extraction. For Task 1, only the default path is verified.

- [ ] **Step 4: Verify homepage is byte-identical**

```bash
node scripts/cdp-shot.mjs .figma-ref/oms-page/home-oms-AFTER-d.png 1440 "http://localhost:3000" 2521
node scripts/cdp-shot.mjs .figma-ref/oms-page/home-oms-AFTER-m.png 500 "http://localhost:3000" 3800
node scripts/diff-mobile.mjs .figma-ref/oms-page/home-oms-BEFORE-d.png .figma-ref/oms-page/home-oms-AFTER-d.png .figma-ref/oms-page/home-oms-reg-d
node scripts/diff-mobile.mjs .figma-ref/oms-page/home-oms-BEFORE-m.png .figma-ref/oms-page/home-oms-AFTER-m.png .figma-ref/oms-page/home-oms-reg-m
```
Expected: diff mismatch count `0` (or only sub-pixel noise from video frames — confirm by eye in `-side` output). Also run `pnpm lint` → no new errors.

- [ ] **Step 5: Commit**

```bash
git add components/sections/open-money-stack.tsx
git commit -m "refactor(oms): parameterize content via props (defaults unchanged)"
```

---

## Task 2: Parameterize + export `GetStartedCta`; parameterize `UseCasesCta`

Today `GetStartedCta` is a private function rendered inside `UseCasesCta`. The page needs the final CTA with different copy ("Ready to launch crypto payments?" / single "CONTACT US"). Export it and make both content-driven, defaults = current.

**Files:**
- Modify: `components/sections/use-cases.tsx`
- Reference (unchanged): `app/page.tsx` (still `<UseCasesCta />`)

**Interfaces:**
- Produces:
  ```ts
  export function GetStartedCta(props?: {
    eyebrow?: string;     // default "LET'S BUILD"
    heading?: string;     // default "Get started with Polygon"
    buttons?: { label: string; href: string; left: number }[]; // default CTA_BUTTONS
  }): JSX.Element;

  export function UseCasesCta(props?: {
    eyebrow?: string;            // default "WHAT POLYGON CAN DO FOR YOU"
    useCases?: UseCase[];        // default USE_CASES (desktop)
    mobileUseCases?: typeof MOBILE_USE_CASES;  // default current
    renderGetStarted?: boolean;  // default true (homepage couples them)
    getStarted?: Parameters<typeof GetStartedCta>[0]; // copy passed through
  }): JSX.Element;
  ```
- Consumes: existing `Eyebrow`, `ScrambleText`, `MobileStage`, mosaic/tooltip internals.

- [ ] **Step 1: Capture homepage baseline**

```bash
node scripts/cdp-shot.mjs .figma-ref/oms-page/home-uc-BEFORE-d.png 1440 "http://localhost:3000" 1920
node scripts/cdp-shot.mjs .figma-ref/oms-page/home-uc-BEFORE-m.png 500 "http://localhost:3000" 2300
```
Expected: baseline screenshots of the use-cases + get-started region.

- [ ] **Step 2: Export `GetStartedCta` and add its content props**

Change `function GetStartedCta()` → `export function GetStartedCta({ eyebrow = "LET'S BUILD", heading = "Get started with Polygon", buttons = CTA_BUTTONS }: {...} = {})`. Replace the hardcoded eyebrow text, the `<h2>` heading text, and the `CTA_BUTTONS.map` source with the props (desktop and `MobileGetStarted` both). `MobileGetStarted` must accept the same `eyebrow/heading/buttons` (pass them down from `GetStartedCta`).

Note for the single-button live layout ("CONTACT US" only): when `buttons.length === 1`, center it (the existing 3-up `left` coords assume 3 cards). Add a small layout branch: if one button, place it centered (`left: 510, width: 420`) instead of the 3 fixed `left`s. Verify exact placement against live during Task 6-equivalent extraction.

- [ ] **Step 3: Add `UseCasesCta` content props + `renderGetStarted`**

Replace the two hardcoded eyebrow `<Eyebrow text="WHAT POLYGON CAN DO FOR YOU" …>` with the `eyebrow` prop; replace `USE_CASES`/`MOBILE_USE_CASES` map sources with props. Wrap the trailing `<GetStartedCta />` as:
```tsx
{renderGetStarted && <GetStartedCta {...getStarted} />}
```
Homepage default (`renderGetStarted = true`, no `getStarted`) reproduces current behavior exactly.

- [ ] **Step 4: Verify homepage byte-identical**

```bash
node scripts/cdp-shot.mjs .figma-ref/oms-page/home-uc-AFTER-d.png 1440 "http://localhost:3000" 1920
node scripts/cdp-shot.mjs .figma-ref/oms-page/home-uc-AFTER-m.png 500 "http://localhost:3000" 2300
node scripts/diff-mobile.mjs .figma-ref/oms-page/home-uc-BEFORE-d.png .figma-ref/oms-page/home-uc-AFTER-d.png .figma-ref/oms-page/home-uc-reg-d
node scripts/diff-mobile.mjs .figma-ref/oms-page/home-uc-BEFORE-m.png .figma-ref/oms-page/home-uc-AFTER-m.png .figma-ref/oms-page/home-uc-reg-m
```
Expected: diff mismatch `0` (sub-pixel scramble noise acceptable — confirm by eye). `pnpm lint` clean.

- [ ] **Step 5: Commit**

```bash
git add components/sections/use-cases.tsx
git commit -m "refactor(use-cases): export+parameterize GetStartedCta; content props on UseCasesCta"
```

---

## Task 3: Scaffold the route with reused sections

Stand up `/open-money-stack` wired with Nav + the parameterized OMS Products band + UseCases + GetStartedCta + Footer, and placeholders for the three new sections, so the page renders end-to-end before pixel work begins.

**Files:**
- Create: `app/open-money-stack/page.tsx`

**Interfaces:**
- Consumes: `Nav`, `OpenMoneyStack` (Task 1 props), `UseCasesCta`/`GetStartedCta` (Task 2 props), `Footer`, `Spacer`, `NoiseOverlay`. Placeholder imports for `HeroOMS`/`StatsBand`/`FaqSection` are added as the sections land (Tasks 4–6).

- [ ] **Step 1: Create the route file**

```tsx
import type { Metadata } from "next";
import { Nav } from "@/components/sections/nav";
import { Spacer } from "@/components/ui/spacer";
import { OpenMoneyStack } from "@/components/sections/open-money-stack";
import { UseCasesCta } from "@/components/sections/use-cases";
import { Footer } from "@/components/sections/footer";
import { NoiseOverlay } from "@/components/ui/noise-overlay";

export const metadata: Metadata = {
  title: "Build on Polygon's Open Money Stack",
  description:
    "Build compliant, borderless payments on Polygon's Open Money Stack with unified wallets, deep stablecoin liquidity, and always-on settlement.",
  // OG image confirmed/downloaded during extraction (Task 6 wrap or here):
  openGraph: { images: [{ url: "/assets/oms-page/og-image.jpg", width: 1200, height: 630 }] },
};

export default function OpenMoneyStackPage() {
  return (
    <div className="min-h-screen bg-background">
      <NoiseOverlay />
      <Nav />
      <main className="max-w-[1440px] mx-auto overflow-hidden">
        {/* <HeroOMS /> — Task 4 */}
        <Spacer />
        <OpenMoneyStack
          eyebrow="PRODUCTS"
          heading="Global rails for upgraded money"
          /* body / products confirmed against live during extraction */
        />
        {/* <StatsBand /> — Task 5 */}
        {/* <FaqSection /> — Task 6 */}
        <UseCasesCta
          renderGetStarted
          getStarted={{
            heading: "Ready to launch crypto payments?",
            buttons: [{ label: "CONTACT US", href: "#contact", left: 510 }],
          }}
        />
        <Footer />
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Run the app and verify it renders**

```bash
pnpm dev
# visit http://localhost:3000/open-money-stack
node scripts/cdp-shot.mjs .figma-ref/oms-page/scaffold-d.png 1440 "http://localhost:3000/open-money-stack" 6000
```
Expected: page renders Nav, Products band (with "PRODUCTS"/"Global rails…"), Use Cases, "Ready to launch crypto payments?" CTA, Footer — no runtime errors, `pnpm lint` clean. (Hero/Stats/FAQ gaps are expected.)

- [ ] **Step 3: Commit**

```bash
git add app/open-money-stack/page.tsx
git commit -m "feat(oms-page): scaffold /open-money-stack route with reused sections"
```

---

## Task 4: Build `HeroOMS`

New hero: "Move funds globally with stablecoins in one unified stack", sub-copy, two CTAs (`Get early access`, `USE POLYGON`), gradient/SVG background. Simpler than the homepage 3D hero.

**Files:**
- Create: `components/sections/hero-oms.tsx`
- Modify: `app/open-money-stack/page.tsx` (uncomment `<HeroOMS />`, remove the leading `<Spacer />` if live has none before products)
- Assets: `public/assets/oms-page/hero-*.{svg,png,webm}` (downloaded in Step 2)

**Interfaces:**
- Produces: `export function HeroOMS(): JSX.Element`
- Consumes: `Button` (`label`, `variant`), `Eyebrow`, `ScrambleText`, `DesktopStage`/`MobileStage`.

- [ ] **Step 1: Capture live hero (dark + light + mobile)**

```bash
node scripts/cdp-shot.mjs .figma-ref/oms-page/live-hero-d.png 1440 "https://polygon.technology/open-money-stack" 1000
node scripts/cdp-shot.mjs .figma-ref/oms-page/live-hero-m.png 500 "https://polygon.technology/open-money-stack" 900
```
(Repeat with the live theme toggled to light — see `light-mode-capture-and-map` memory for the CDP toggle click.)
Expected: live hero references for both themes + mobile.

- [ ] **Step 2: Extract exact values + download assets**

Use `scripts/cdp-eval.mjs` against the live hero to read: heading text/computed font + width/break, sub-copy, both CTA labels/variants/order, the exact stage height, and the background treatment (CSS gradient stops vs raster/SVG art). Download any background art into `public/assets/oms-page/`. Record values in the task's PASS/FAIL table skeleton.

- [ ] **Step 3: Build the component to extracted values**

Skeleton (fill coordinates/copy/bg from Step 2):

```tsx
"use client"; // only if a scene video/scramble-on-mount is present; else server
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DesktopStage, MobileStage } from "@/components/ui/stage";

export function HeroOMS() {
  return (
    <section className="relative w-full" style={{ containerType: "inline-size" }}>
      <DesktopStage className="hidden md:block" height={/* from extract */ 840}>
        {/* background gradient/art (from extract), faint grid if present */}
        {/* eyebrow (if any), heading, sub-copy, CTA row: Get early access + USE POLYGON */}
      </DesktopStage>
      <MobileStage className="md:hidden" width={500} height={/* from extract */ 700}>
        {/* mobile composition from extract */}
      </MobileStage>
    </section>
  );
}
```
Wire into `app/open-money-stack/page.tsx`. Use semantic tokens; keep any white-on-art text fixed (like the homepage hero) if the bg is dark in both themes.

- [ ] **Step 4: Screenshot-diff loop (dark, light, mobile)**

```bash
node scripts/cdp-shot.mjs .figma-ref/oms-page/local-hero-d.png 1440 "http://localhost:3000/open-money-stack" 1000
node scripts/diff-mobile.mjs .figma-ref/oms-page/live-hero-d.png .figma-ref/oms-page/local-hero-d.png .figma-ref/oms-page/hero-d
# repeat for -light and -m (mobile)
```
Iterate Steps 2–4 until aligned.

- [ ] **Step 5: Per-element PASS/FAIL table**

Produce a table (heading copy/placement/font, sub-copy, each CTA label+variant+hover, background color/asset, eyebrow, spacing) — live value vs ours — all PASS across dark/light/mobile. Run `pnpm lint`.

- [ ] **Step 6: Commit**

```bash
git add components/sections/hero-oms.tsx app/open-money-stack/page.tsx public/assets/oms-page
git commit -m "feat(oms-page): add HeroOMS section (pixel-matched)"
```

---

## Task 5: Build `StatsBand`

Eyebrow "STATS", heading "Real usage, not just promises", 6 static metric cards (159M unique wallets · 54B stablecoin volume · 3.4B supply · 110 TPS · $0.002 avg cost · 7B total txns). Static grid — NOT the AtGlance 3D carousel.

**Files:**
- Create: `components/sections/stats-band.tsx`
- Modify: `app/open-money-stack/page.tsx` (insert `<StatsBand />` after the Products band)
- Assets: reuse `public/assets/stat-card-bg-*.svg` if they match live; else download to `public/assets/oms-page/stat-card-*`.

**Interfaces:**
- Produces: `export function StatsBand(): JSX.Element`
- Consumes: `Eyebrow`, `DesktopStage`/`MobileStage`. Server component unless an entrance animation is added (then `'use client'` with framer-motion `useInView`, matching `OMSStaircase`).

- [ ] **Step 1: Capture live stats band (dark + light + mobile)**

```bash
node scripts/cdp-shot.mjs .figma-ref/oms-page/live-stats-d.png 1440 "https://polygon.technology/open-money-stack" 1100
node scripts/cdp-shot.mjs .figma-ref/oms-page/live-stats-m.png 500 "https://polygon.technology/open-money-stack" 1600
```
(Both themes.)

- [ ] **Step 2: Extract values + resolve card art**

Extract per card: metric value, label, computed colors, card size/gap, and the card background asset. Compare the live card-bg asset bytes to existing `stat-card-bg-{1..4}.svg` (open and confirm CONTENTS, per protocol) — reuse if identical, else download light+dark variants into `public/assets/oms-page/`. Extract the eyebrow + heading placement and the grid layout (rows/cols).

- [ ] **Step 3: Build to extracted values**

```tsx
import { Eyebrow } from "@/components/ui/eyebrow";
import { DesktopStage, MobileStage } from "@/components/ui/stage";

type Stat = { value: string; label: string; bg: string };
const STATS: Stat[] = [
  { value: "159M", label: "Unique wallet addresses", bg: "/assets/stat-card-bg-1.svg" },
  { value: "54B",  label: "Stablecoin transfer volume", bg: "/assets/stat-card-bg-2.svg" },
  { value: "3.4B", label: "Stablecoin supply", bg: "/assets/stat-card-bg-3.svg" },
  { value: "110",  label: "Transactions per second", bg: "/assets/stat-card-bg-4.svg" },
  { value: "$0.002", label: "Average transaction cost", bg: "/assets/stat-card-bg-1.svg" },
  { value: "7B",   label: "Total transactions", bg: "/assets/stat-card-bg-2.svg" },
]; // exact values/labels/bg confirmed in Step 2

export function StatsBand() {
  return (
    <section className="relative w-full bg-inverted-primary" style={{ containerType: "inline-size" }}>
      <DesktopStage className="hidden md:block" height={/* extract */ 900}>
        {/* eyebrow STATS + heading "Real usage, not just promises" + 6-card grid */}
      </DesktopStage>
      <MobileStage className="md:hidden" width={500} height={/* extract */ 1400}>
        {/* stacked/2-col cards per live */}
      </MobileStage>
    </section>
  );
}
```
Insert `<StatsBand />` into the page. Tokens flip with theme; verify card art has light+dark variants if live does.

- [ ] **Step 4: Screenshot-diff loop (dark, light, mobile)** — same command pattern as Task 4 Step 4 with `-stats`. Iterate to alignment.

- [ ] **Step 5: Per-element PASS/FAIL table** — eyebrow, heading, each of 6 cards (value, label, color, bg asset, size, gap), grid placement, light/dark card art. All PASS across dark/light/mobile. `pnpm lint`.

- [ ] **Step 6: Commit**

```bash
git add components/sections/stats-band.tsx app/open-money-stack/page.tsx public/assets
git commit -m "feat(oms-page): add StatsBand section (pixel-matched)"
```

---

## Task 6: Build `ui/accordion` + `FaqSection`

Reusable accordion primitive, then the FAQ section (eyebrow "FAQ", heading "Frequently asked questions", "contact us" link, 3 Q&A rows).

**Files:**
- Create: `components/ui/accordion.tsx`
- Create: `components/sections/faq.tsx`
- Modify: `app/open-money-stack/page.tsx` (insert `<FaqSection />` after StatsBand)
- Assets: `public/assets/oms-page/faq-icon.svg` (expand/collapse glyph, from extract)

**Interfaces:**
- Produces:
  ```ts
  // accordion.tsx
  export type AccordionItem = { question: string; answer: string };
  export function Accordion(props: {
    items: AccordionItem[];
    singleOpen?: boolean;        // default per live (confirm single vs multi)
    defaultOpenIndex?: number;   // default none
  }): JSX.Element;

  // faq.tsx
  export function FaqSection(): JSX.Element;
  ```
- Consumes: `Eyebrow`, `DesktopStage`/`MobileStage`. `Accordion` is `'use client'` (open/close state + animated height).

- [ ] **Step 1: Capture live FAQ (dark + light + mobile), default + expanded**

```bash
node scripts/cdp-shot.mjs .figma-ref/oms-page/live-faq-d.png 1440 "https://polygon.technology/open-money-stack" 900
node scripts/cdp-shot.mjs .figma-ref/oms-page/live-faq-m.png 500 "https://polygon.technology/open-money-stack" 1200
```
(Both themes; also capture one row expanded if the CDP click can toggle it.)

- [ ] **Step 2: Extract values + answer copy + icon**

Extract: eyebrow/heading placement, the exact 3 questions AND full answer copy, "contact us" link text/href, row borders/padding/gap, the expand/collapse icon SVG path (download), single-open vs multi-open behavior, and the open/close animation.

- [ ] **Step 3: Build the `Accordion` primitive**

```tsx
"use client";
import { useState } from "react";

export type AccordionItem = { question: string; answer: string };

export function Accordion({ items, singleOpen = true, defaultOpenIndex }: {
  items: AccordionItem[]; singleOpen?: boolean; defaultOpenIndex?: number;
}) {
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(defaultOpenIndex != null ? [defaultOpenIndex] : []),
  );
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = singleOpen ? new Set<number>() : new Set(prev);
      prev.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  return (
    <div className="flex flex-col">
      {items.map((it, i) => (
        <div key={i} className="border-t border-stroke">
          <button
            type="button"
            onClick={() => toggle(i)}
            aria-expanded={open.has(i)}
            className="flex w-full items-center justify-between py-[24px] text-left"
          >
            <span className="text-desktop-h5 text-primary">{it.question}</span>
            {/* expand/collapse icon from extract; rotate when open.has(i) */}
          </button>
          <div
            className="grid transition-[grid-template-rows] duration-300"
            style={{ gridTemplateRows: open.has(i) ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <p className="pb-[24px] text-desktop-body text-grey-200">{it.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```
(Tune type scales, padding, icon, and the open animation to extracted values.)

- [ ] **Step 4: Build `FaqSection` using `Accordion`**

```tsx
import { Eyebrow } from "@/components/ui/eyebrow";
import { DesktopStage, MobileStage } from "@/components/ui/stage";
import { Accordion, type AccordionItem } from "@/components/ui/accordion";

const FAQ_ITEMS: AccordionItem[] = [
  { question: "How does the Open Money Stack modernize payment rails?", answer: "/* exact live copy */" },
  { question: "Is this production-ready for real payments?", answer: "/* exact live copy */" },
  { question: "What will running an entire payments stack look like?", answer: "/* exact live copy */" },
];

export function FaqSection() {
  return (
    <section className="relative w-full bg-background" style={{ containerType: "inline-size" }}>
      <DesktopStage className="hidden md:block" height={/* extract */ 840}>
        {/* eyebrow FAQ + heading + "contact us" link + <Accordion items={FAQ_ITEMS} /> */}
      </DesktopStage>
      <MobileStage className="md:hidden" width={500} height={/* extract */ 1100}>
        {/* mobile composition */}
      </MobileStage>
    </section>
  );
}
```
Insert `<FaqSection />` into the page after `<StatsBand />`.

- [ ] **Step 5: Screenshot-diff loop (dark, light, mobile; collapsed + expanded)** — `-faq` outputs; iterate to alignment.

- [ ] **Step 6: Per-element PASS/FAIL table** — eyebrow, heading, contact link, each question + answer copy, icon path, row spacing, expand animation, single/multi-open, hover. All PASS across dark/light/mobile. `pnpm lint`.

- [ ] **Step 7: Commit**

```bash
git add components/ui/accordion.tsx components/sections/faq.tsx app/open-money-stack/page.tsx public/assets/oms-page
git commit -m "feat(oms-page): add reusable Accordion + FaqSection (pixel-matched)"
```

---

## Task 7: Full-page parity pass + finalize CTA/metadata

Verify the assembled page end-to-end against live in both themes and at desktop + mobile; finalize the "Ready to launch crypto payments?" CTA placement, Use Cases copy delta (if any), and the route OG image.

**Files:**
- Modify: `app/open-money-stack/page.tsx` (final copy/props), `public/assets/oms-page/og-image.jpg`

- [ ] **Step 1: Confirm Use Cases + final CTA copy against live**

Extract the live Use Cases eyebrow/cards and the final CTA on `/open-money-stack`. If the eyebrow or cards differ from the homepage defaults, pass `eyebrow`/`useCases` props. Confirm the single "CONTACT US" button's exact placement and the heading "Ready to launch crypto payments?" — adjust the `getStarted` props in the page.

- [ ] **Step 2: Full-page diff, both themes, desktop + mobile**

```bash
node scripts/cdp-shot.mjs .figma-ref/oms-page/live-full-d.png 1440 "https://polygon.technology/open-money-stack" 8000
node scripts/cdp-shot.mjs .figma-ref/oms-page/local-full-d.png 1440 "http://localhost:3000/open-money-stack" 8000
node scripts/diff-mobile.mjs .figma-ref/oms-page/live-full-d.png .figma-ref/oms-page/local-full-d.png .figma-ref/oms-page/full-d
# repeat for light theme and width 500 (mobile)
```
Expected: section order and vertical rhythm match; no missing/extra bands. Address any seams between sections.

- [ ] **Step 3: Finalize metadata/OG**

Download the live OG image to `public/assets/oms-page/og-image.jpg`; confirm `metadata` title/description match live.

- [ ] **Step 4: Whole-page PASS/FAIL summary table**

One row per section (Hero, Products, Stats, FAQ, Use Cases, CTA, Footer) × {desktop-dark, desktop-light, mobile} → all PASS. `pnpm lint` and `pnpm build` clean.

- [ ] **Step 5: Commit + open PR**

```bash
git add app/open-money-stack/page.tsx public/assets/oms-page
git commit -m "feat(oms-page): full-page parity pass + metadata/OG"
git push -u origin feature/open-money-stack-page
gh pr create --base main --title "Add /open-money-stack page" --body "Rebuilds the live open-money-stack landing page at full parity. Reuses Nav, OpenMoneyStack (parameterized), UseCasesCta + GetStartedCta (parameterized), Footer; adds HeroOMS, StatsBand, FaqSection, and a reusable ui/accordion."
```

---

## Notes / Risks

- **Reused-section regression** is the main risk; Tasks 1–2 gate on a homepage before/after diff of `0` mismatch. If a video frame causes noise, confirm equivalence by eye in the `-side` image rather than chasing a 0 count.
- **`cdp-shot.mjs` is mobile-emulated** (`mobile:true`, deviceScaleFactor 2). For desktop captures at width 1440 it still works for visual diffing; if desktop emulation differs from a real desktop render, capture both live and local with the SAME command so the comparison is apples-to-apples (the diff is self-consistent).
- **Light/dark live capture** requires clicking the live theme toggle via CDP — follow the `light-mode-capture-and-map` memory.
- **Open items resolved during extraction** (from the spec): hero background treatment, stat-card asset reuse, FAQ single/multi-open + answer copy, Use Cases copy delta. Each is an explicit extract step in its task.
</content>
