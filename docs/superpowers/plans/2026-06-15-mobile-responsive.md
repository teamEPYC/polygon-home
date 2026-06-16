# Mobile Responsiveness Pass — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add pixel-perfect mobile layouts (≤767px) to every homepage section plus a hamburger nav (≤991px), matched to live `polygon.technology`, without altering the existing desktop layouts.

**Architecture:** Each section keeps its desktop 1440 scale-stage and gains a parallel 375 mobile scale-stage; CSS toggles which is visible (`md` = 768px for sections, custom `nav` = 992px for the navbar). A shared `Stage` component DRYs the repeated scale-to-fit boilerplate. Section layouts are built from values extracted live at 375px and verified with rendered-screenshot diffs + per-element PASS/FAIL tables.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4 (`@theme`), TypeScript, headless Chrome (CDP) for extraction/verification.

**Verification note:** This is a visual pixel-perfect frontend project — there is no unit-test suite. The "test" for each task is (a) `pnpm build` / lint passing where code changes, and (b) a rendered-screenshot comparison against the live mobile reference with a per-element PASS/FAIL table (per CLAUDE.md). Treat the render+compare step as the red/green gate.

---

## File structure

**Phase 0 (foundation) — created/modified once:**
- Create `components/ui/stage.tsx` — `Stage` + `MobileStage` scale-to-fit wrappers.
- Modify `app/globals.css` — add the custom `nav` breakpoint (992px).
- Create `scripts/extract-mobile.mjs` — CDP harness: load live at 375px, capture per-section screenshots + computed styles into `.figma-ref/mobile/`.

**Phase 1 (per section) — each section component gains a mobile stage:**
- `components/sections/nav.tsx` (+ new `components/sections/nav-mobile-menu.tsx` for the hamburger)
- `components/sections/hero.tsx`
- then `at-glance.tsx`, `open-money-stack.tsx`, `purpose.tsx`, `pol-token.tsx`, `use-cases.tsx`, `footer.tsx` (planned after pattern lock — see §Phase 2)

Verification artifacts live under `.figma-ref/mobile/` (live refs) and `/tmp` (local renders), mirroring the existing desktop diff loop.

---

# PHASE 0 — Foundation

## Task 1: `Stage` / `MobileStage` scale-to-fit components

**Files:**
- Create: `components/ui/stage.tsx`

- [ ] **Step 1: Create the component file**

```tsx
import type { CSSProperties, ReactNode } from "react";

type StageProps = {
  /** Design-canvas width in px (1440 desktop, 375 mobile). */
  width: number;
  /** Design-canvas height in px — the exact section content height. */
  height: number;
  className?: string;
  children: ReactNode;
};

/**
 * Fixed-canvas scale-to-fit stage. Renders children in a `width`×`height`
 * coordinate space, scaled to the section width via `scale(100cqw / width)`.
 * The parent <section> must set `containerType: 'inline-size'`.
 * Pixel-perfect at the design width; scales proportionally otherwise.
 */
function Stage({ width, height, className, children }: StageProps) {
  return (
    <div
      className={`relative w-full overflow-hidden ${className ?? ""}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width,
          height,
          transform: `scale(calc(100cqw / ${width}px))`,
        } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

/** Desktop 1440 stage. */
export function DesktopStage({
  height,
  className,
  children,
}: Omit<StageProps, "width">) {
  return (
    <Stage width={1440} height={height} className={className}>
      {children}
    </Stage>
  );
}

/** Mobile 375 stage. */
export function MobileStage({
  height,
  className,
  children,
}: Omit<StageProps, "width">) {
  return (
    <Stage width={375} height={height} className={className}>
      {children}
    </Stage>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /home/aayushman/projects/polygon-home && pnpm build 2>&1 | tail -20`
Expected: build succeeds (the new file is unused so far; it must at least type-check). If `pnpm build` is too slow, run `npx tsc --noEmit` and expect no errors in `components/ui/stage.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/ui/stage.tsx
git commit -m "feat(ui): add Stage/MobileStage scale-to-fit wrappers"
```

---

## Task 2: Custom `nav` breakpoint (992px)

**Files:**
- Modify: `app/globals.css` (the `@theme inline { … }` block)

- [ ] **Step 1: Add the breakpoint token**

Inside the existing `@theme inline { … }` block in `app/globals.css`, add:

```css
  /* Custom breakpoint: navbar swaps to hamburger below 992px.
     Sections use the stock `md` (768px) breakpoint, not this one. */
  --breakpoint-nav: 992px;
```

This makes `nav:` (min-width 992) and `max-nav:` (max-width 991) variants available in Tailwind v4.

- [ ] **Step 2: Verify the variant resolves**

Add a throwaway element somewhere rendered (e.g. temporarily in `app/page.tsx`) with `className="hidden nav:block"`, run the dev server, and confirm via headless Chrome that it is hidden at 991px and visible at 992px. Then remove the throwaway element.

Run:
```bash
(pnpm dev > /tmp/dev.log 2>&1 &) ; sleep 8
google-chrome-stable --headless=new --disable-gpu --window-size=992,400 --screenshot=/tmp/bp992.png --virtual-time-budget=4000 http://localhost:3000 2>/dev/null
google-chrome-stable --headless=new --disable-gpu --window-size=991,400 --screenshot=/tmp/bp991.png --virtual-time-budget=4000 http://localhost:3000 2>/dev/null
```
Expected: the test element appears in `bp992.png`, absent in `bp991.png`.

- [ ] **Step 3: Remove the throwaway element and commit**

```bash
git add app/globals.css
git commit -m "feat(css): add custom nav breakpoint at 992px"
```

---

## Task 3: Live-mobile extraction harness

**Files:**
- Create: `scripts/extract-mobile.mjs`

- [ ] **Step 1: Write the harness**

```js
// Usage: node scripts/extract-mobile.mjs <section-id> [outDir]
// Loads live polygon.technology at 375px mobile emulation, screenshots the
// given section element, and dumps its computed background/color/spacing.
// Requires: chrome with remote debugging. Run chrome once, then this script.
import { writeFileSync } from "node:fs";

const SECTION = process.argv[2];
const OUT = process.argv[3] ?? ".figma-ref/mobile";
const CDP = "http://127.0.0.1:9222";

if (!SECTION) {
  console.error("Provide a section id/selector, e.g. 'is-hero'");
  process.exit(1);
}

// Discover a page target.
const targets = await (await fetch(`${CDP}/json`)).json();
const page = targets.find((t) => t.type === "page");
const ws = page.webSocketDebuggerUrl;
console.log("Connect a CDP client to:", ws);
console.log(
  `Then evaluate getComputedStyle on '.${SECTION}' and screenshot it.\n` +
    `Save screenshot to ${OUT}/${SECTION}-375.png and styles to ${OUT}/${SECTION}.json`,
);
```

> Note: the exact CDP automation (navigate, `Emulation.setDeviceMetricsOverride` to 375×812 mobile, `Page.captureScreenshot` clipped to the section rect, `Runtime.evaluate` of `getComputedStyle`) is finalized during execution against the live DOM. The harness exists to standardize WHERE outputs land (`.figma-ref/mobile/<section>-375.png`, `<section>.json`); the established desktop loop already proves the chrome-headless screenshot approach.

- [ ] **Step 2: Smoke-test the harness**

Run: `node scripts/extract-mobile.mjs is-hero`
Expected: prints a CDP websocket URL and the output-path convention (no crash).

- [ ] **Step 3: Commit**

```bash
git add scripts/extract-mobile.mjs
git commit -m "chore: add live-mobile extraction harness scaffold"
```

---

# PHASE 1 — Proof sections (Nav + Hero)

> **The per-section loop (applies to every section task below):**
> 1. **Extract** live mobile source-of-truth at 375px: DOM + classes, computed CSS (colors, spacing, font sizes), real SVG paths, mobile-only assets, and the **exact section content height** → save the live reference screenshot to `.figma-ref/mobile/<section>-375.png`.
> 2. **Build** the 375 mobile stage in the section component using `MobileStage` + extracted values + `text-mobile-*` tokens.
> 3. **Render** the local section at 375px (headless Chrome `--window-size=375,<h>`), plus boundary spot-checks at 767 and 991.
> 4. **Compare** and produce a **per-element PASS/FAIL table** (live value vs local value): text, color (sampled hex), spacing (gap-between + space-within), icon/SVG paths, assets, default + interactive states.
> 5. **Commit** only when the table is clean.

## Task 4: Nav — hamburger menu (≤991px)

**Files:**
- Modify: `components/sections/nav.tsx`
- Create: `components/sections/nav-mobile-menu.tsx`
- Reference live: nav element + its mobile-menu markup in `sot/source.html`; computed values via the Task 3 harness.

- [ ] **Step 1: Extract the live mobile nav**

Run the harness against the nav, and read the mobile-menu DOM from `sot/source.html`:
```bash
grep -oE ".{0,80}(hamburger|menu-button|nav-mobile|w-nav-button|nav-overlay).{0,120}" sot/source.html | head -20
node scripts/extract-mobile.mjs nav-bar
```
Capture: collapsed-bar height, logo size/position, hamburger icon SVG path + size, menu open background (sample hex), link list typography (`text-mobile-mono`?), link spacing, CTA button treatment, overlay color/opacity, open/close animation (duration/easing). Save the open + closed live screenshots to `.figma-ref/mobile/nav-open-375.png` and `nav-closed-375.png`.

- [ ] **Step 2: Build the mobile menu component**

Create `components/sections/nav-mobile-menu.tsx` as a `'use client'` component with `useState` open/close, a hamburger trigger button, a slide-out/overlay panel, and the link list + CTAs. Use the extracted SVG path, colors, `text-mobile-*` typography, spacing, and animation values from Step 1. (Concrete values come from the extraction artifact — do not guess.)

Skeleton (structure is fixed; values slot in from Step 1):
```tsx
"use client";
import { useState } from "react";

export function NavMobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="max-nav:flex hidden items-center">
      <button aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {/* hamburger SVG — exact path from extraction */}
      </button>
      {open && (
        <>
          <div className="fixed inset-0" /* overlay color/opacity from extraction */ onClick={() => setOpen(false)} />
          <nav /* panel: bg, width, slide animation from extraction */>
            {/* link list — text-mobile-* typography, extracted spacing */}
            {/* CTAs */}
          </nav>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Wire it into `nav.tsx`**

In `components/sections/nav.tsx`, wrap the existing desktop nav links/CTAs in `hidden nav:flex` (visible ≥992px) and render `<NavMobileMenu />` (visible ≤991px via its own `max-nav:flex`). The logo stays visible at all widths.

- [ ] **Step 4: Render & compare**

```bash
(pnpm dev > /tmp/dev.log 2>&1 &) ; sleep 8
google-chrome-stable --headless=new --disable-gpu --window-size=375,812 --screenshot=/tmp/nav-local-375.png --virtual-time-budget=5000 http://localhost:3000 2>/dev/null
```
Build the side-by-side vs `.figma-ref/mobile/nav-closed-375.png` and (after toggling open in a script) `nav-open-375.png`. Produce the PASS/FAIL table (logo, hamburger icon path, bar height, menu bg hex, link type/spacing, CTA, overlay, animation).

- [ ] **Step 5: Verify build + commit**

```bash
pnpm build 2>&1 | tail -5   # expect success
git add components/sections/nav.tsx components/sections/nav-mobile-menu.tsx .figma-ref/mobile/
git commit -m "feat(nav): mobile hamburger menu (<=991px), matched to live"
```

---

## Task 5: Hero — mobile stage (≤767px)

**Files:**
- Modify: `components/sections/hero.tsx`
- Reference live: `.section.is-hero` at 375px via harness + `sot/source.html`.

- [ ] **Step 1: Extract the live mobile hero**

```bash
node scripts/extract-mobile.mjs is-hero
```
Capture at 375px: section content height, heading (`text-mobile-h1`? size/leading), eyebrow placement, body text width/placement, CTA stacking (vertical?) + sizes, the 3D scene/video crop + mask behavior on mobile, trusted-by marquee treatment, social icons placement. Save `.figma-ref/mobile/hero-375.png`.

- [ ] **Step 2: Build the mobile stage**

In `hero.tsx`, wrap the existing desktop stage markup in `hidden md:block`, and add a sibling `<MobileStage height={HERO_MOBILE_H} className="md:hidden">` (import from `components/ui/stage`). Inside it, lay out the hero in 375 coordinates using extracted values + `text-mobile-*` tokens. `HERO_MOBILE_H` = the exact extracted height. Reuse the existing video/mask where live does; swap to the live mobile crop/asset where it differs.

```tsx
import { DesktopStage, MobileStage } from "@/components/ui/stage";
// ...
<section className="relative w-full overflow-hidden bg-background" style={{ containerType: "inline-size" }}>
  <div className="hidden md:block">
    {/* existing desktop 1440 stage, unchanged */}
  </div>
  <MobileStage height={/* extracted */ 0} className="md:hidden">
    {/* 375-coord hero: eyebrow, h1 (text-mobile-h1), body, stacked CTAs, scene, socials */}
  </MobileStage>
</section>
```

- [ ] **Step 3: Render & compare**

```bash
google-chrome-stable --headless=new --disable-gpu --window-size=375,900 --screenshot=/tmp/hero-local-375.png --virtual-time-budget=6000 http://localhost:3000 2>/dev/null
```
Side-by-side vs `.figma-ref/mobile/hero-375.png`; PASS/FAIL table (heading size/wrap, eyebrow, body, CTA stack, scene crop, socials). Spot-check 767px (boundary) and confirm desktop ≥768 is unchanged.

- [ ] **Step 4: Verify build + commit**

```bash
pnpm build 2>&1 | tail -5
git add components/sections/hero.tsx .figma-ref/mobile/
git commit -m "feat(hero): mobile stage (<=767px), matched to live"
```

---

# PHASE 2 — Remaining sections (planned after pattern lock)

After Nav + Hero prove the loop, repeat **the per-section loop** (see Phase 1 header) for each of the following, in order. Each becomes one task identical in shape to Task 5 (extract → build `MobileStage` → render → PASS/FAIL table → commit), with section-specific component swaps/touch interactions surfaced during extraction:

- [ ] **Task 6: At a Glance** — incl. the 3D carousel's mobile behavior (component swap / touch).
- [ ] **Task 7: Open Money Stack** — incl. staircase + product rows stacking; preserve the now-correct CSS radial gradient.
- [ ] **Task 8: Purpose** — feature cards stacking; reuse the existing light/dark image swap.
- [ ] **Task 9: POL Token** — coin video crop + card stacking.
- [ ] **Task 10: Use Cases / Get Started** — use-case mosaic + CTA stacking; touch/tap states.
- [ ] **Task 11: Footer** — column stacking, link groups.

> These are intentionally not pre-coded: their layout values do not exist until extracted at execution time, and fabricating them would violate the no-placeholders rule. Once Nav + Hero land, regenerate this section of the plan with concrete per-section code, or execute them directly via the locked per-section loop. The `news-slider` stays out of scope while commented out in `app/page.tsx`.

---

## Self-review notes

- **Spec coverage:** §3 stage pattern → Task 1; §2 breakpoints → Tasks 2/4/5; §4 foundation → Tasks 1–3; §5 order + per-section loop → Phase 1 header + Tasks 4–11; §6 interactive chunks → Task 4 (nav) + per-section notes; §7 risks → boundary spot-checks in render steps. Covered.
- **Placeholders:** Phase 0 is fully concrete. Phase 1/2 layout *values* are deliberately sourced from live extraction at execution time (documented why) — the *procedure, files, scaffolds, and commands* are concrete.
- **Type consistency:** `DesktopStage`/`MobileStage` exported from `components/ui/stage.tsx` and imported identically in Tasks 4–11; `--breakpoint-nav` → `nav:`/`max-nav:` used consistently.
