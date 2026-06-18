# Open Money Stack Page — Design Spec

**Date:** 2026-06-18
**Live target:** https://polygon.technology/open-money-stack
**Route:** `/open-money-stack`
**Branch:** `feature/open-money-stack-page`

## Goal

Rebuild the live `/open-money-stack` landing page at full parity — desktop +
mobile, light + dark — to the same Pixel-Perfect Fidelity standard as the
homepage (per `CLAUDE.md`). Maximize reuse of existing sections; build only the
genuinely new pieces.

## Definition of done

- Per-element parity with live in **both themes** and at **desktop + mobile**.
- Each new/changed section ends with a per-element PASS/FAIL table (live value
  vs ours): color, placement, asset contents, icon path, spacing, hover.
- Homepage renders byte-identical after the shared-section refactors (proven by
  before/after screenshot diff).
- Full-page screenshot diff vs live in light and dark.

## Live page inventory (top → bottom)

| # | Live section | Heading / key copy | Disposition |
|---|---|---|---|
| 1 | Nav | logo, Stake Pol, Book a Call | Reuse `Nav` as-is |
| 2 | Hero | "Move funds globally with stablecoins in one unified stack"; CTAs `Get early access`, `USE POLYGON`; gradient/SVG bg | **New** `HeroOMS` |
| 3 | Products | eyebrow `PRODUCTS`, "Global rails for upgraded money"; 4 LIVE + 2 COMING SOON cards | Reuse `OpenMoneyStack` (parameterized) |
| 4 | Stats | eyebrow `STATS`, "Real usage, not just promises"; 6 metric cards | **New** `StatsBand` |
| 5 | FAQ | eyebrow `FAQ`, "Frequently asked questions", "contact us" link; 3 Q&A | **New** `FaqSection` + `ui/accordion` |
| 6 | Use Cases | Payments / Stablecoins / RWA / DeFi | Reuse `UseCasesCta` |
| 7 | CTA | "Ready to launch crypto payments?"; `CONTACT US` | Reuse `GetStartedCta` (parameterized) |
| 8 | Footer | link columns, socials, copyright | Reuse `Footer` as-is |

### Products band — content deltas vs homepage OMS
- Eyebrow: `PRODUCTS` (homepage: `OPEN MONEY STACK`)
- Heading: "Global rails for upgraded money" (homepage: "One open stack for money movement")
- Sub-copy: "One integrated stack for wallets, compliance, ramps, and settlement"
- 4 LIVE products (Wallet Infrastructure / Crosschain Interop / On-Off & Cash
  Ramps / Blockchain Rails) + 2 COMING SOON (Stablecoin Orchestration / KYC Hub)
  — same set already in `OpenMoneyStack`; verify per-card copy against live.

### Stats band — 6 metrics
159M unique wallet addresses · 54B stablecoin transfer volume · 3.4B stablecoin
supply · 110 transactions per second · $0.002 average transaction cost · 7B
total transactions. (Confirm exact labels/values + light/dark card art from live.)

### FAQ — 3 Q&A
1. How does the Open Money Stack modernize payment rails?
2. Is this production-ready for real payments?
3. What will running an entire payments stack look like?
(Confirm exact answer copy from live during extract.)

## Architecture

### Route & composition
`app/open-money-stack/page.tsx`, mirroring `app/page.tsx`:

```
<div className="min-h-screen bg-background">
  <NoiseOverlay />
  <Nav />
  <main className="max-w-[1440px] mx-auto overflow-hidden">
    <HeroOMS />
    <Spacer />
    <OpenMoneyStack {...omsProductsProps} />
    <StatsBand />
    <FaqSection />
    <UseCasesCta />
    <GetStartedCta {...ctaProps} />
    <Footer />
  </main>
</div>
```

Per-page `metadata` export: title "Build on Polygon's Open Money Stack",
live description, and route-specific OG image.

### Decision: reuse strategy = parameterize via props
Shared sections take content props **defaulted to the current homepage values**,
so `app/page.tsx` is unaffected. One source of truth; no duplicated layouts.

## Components

### Reuse refactors (no layout change — content props only)
1. **`OpenMoneyStack`** — extract eyebrow, heading, body, button label, and the
   product/coming-soon arrays into props (defaults = today's homepage values).
   New page passes the Products-band copy above. Touches a working homepage
   component → gated by a homepage regression diff.
2. **`UseCasesCta`** — reuse as-is; parameterize only if live copy differs.
3. **`GetStartedCta`** (in `components/sections/use-cases.tsx`) — parameterize
   heading → "Ready to launch crypto payments?" and CTA label → "CONTACT US".

### New components (3)
1. **`components/sections/hero-oms.tsx`** — heading, sub-copy, two CTAs, gradient
   /SVG background (simpler than homepage 3D hero). Reuses `Button`, `Eyebrow`,
   `ScrambleText`, `DesktopStage`/`MobileStage`. Client only if scramble/video.
2. **`components/sections/stats-band.tsx`** — `STATS` eyebrow + heading + 6
   static metric cards (NOT the AtGlance 3D carousel). Reuse `stat-card-bg-*.svg`
   if they match; else download. Server component.
3. **`components/sections/faq.tsx`** — eyebrow + heading + "contact us" link + 3
   accordion rows. Built on a new reusable **`components/ui/accordion.tsx`**
   (`'use client'`, expand/collapse, animated height). Single-open behavior
   unless live shows multi-open.

## Assets to extract from live (extract-first)
Before building each new section, pull source-of-truth from live:
- Hero: gradient/SVG background + any hero art.
- Stats: 6 stat-card backgrounds (light + dark variants if they differ from
  existing `public/assets/stat-card-bg-*.svg`).
- FAQ: expand/collapse icon (exact SVG path).
- Any new logos/icons not already in `public/assets/`.
- Route OG/meta image.
Reuse existing product wire-icons, partner logos, and OMS videos already present
in `public/assets/`.

## Build order

1. **Refactor reused sections** — add defaulted props; screenshot-diff the
   homepage before/after to prove zero drift.
2. **Scaffold route** — wire `app/open-money-stack/page.tsx` with the reused
   sections (Nav, OMS, UseCases, GetStartedCta, Footer) + placeholders; verify
   render.
3. **Build new sections** one at a time via the extract → build → CDP screenshot
   → pixelmatch diff loop (`scripts/`): desktop dark → desktop light → mobile.
   Each ends with a per-element PASS/FAIL table.
4. **Final full-page diff** vs live in both themes, desktop + mobile.

## Out of scope
- Wiring real CTA destinations / forms (use live `href`s or `#` placeholders as
  live does).
- News slider (already unused on homepage).
- Any backend / data fetching — all content is static.

## Open items to confirm during extract
- Exact Hero background treatment (gradient vs raster art).
- Whether Stats cards reuse existing `stat-card-bg-*` assets.
- FAQ accordion: single-open vs multi-open; exact answer copy.
- Whether `UseCasesCta` eyebrow/copy differs from homepage on this page.
</content>
</invoke>
