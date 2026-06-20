# OMS Products — Zigzag Section (Desktop)

**Date:** 2026-06-19
**Page:** `/open-money-stack` (live: `polygon.technology/open-money-stack`)
**Goal:** Replace the reused homepage `OpenMoneyStack` section on the OMS page with a
new component that matches the live OMS "Global rails for upgraded money" section —
a left/right **zigzag** of self-contained product cards around a central video column,
with connector lines that run only to the middle (behind the video).

Scope: **desktop only** for now. Mobile keeps the current stacked layout and is a
follow-up. Homepage `components/sections/open-money-stack.tsx` stays untouched.

---

## Source of truth (extracted from live @1440, DPR irrelevant; px are CSS px)

Live section: `.sec.is-blue.is-lottie`, page-y **1082 → 3677** (height **2595**),
background `rgb(52,73,193)` = `#3449C1`. All section-relative y below = page-y − 1082.

| Element | Live page-y | Section-rel y | x / w | Notes |
|---|---|---|---|---|
| Top dark platform + eyebrow `PRODUCTS` | ~1082–1366 | 0–284 | centered | eyebrow pill `.h-eyebrow` x663 y1334 w115; reuse homepage top-platform treatment |
| Heading "Global rails for upgraded money" | 1542 | 460 | wrap x391 w660, heading w534 centered | `text-desktop-h2` (64/1.06/−1.28), 2 lines |
| Body "One stack for wallets, compliance, on- and off-ramps…" | 1688 | 606 | x391 w660 centered | `text-body-large` 18px. **No CTA button.** |
| Central video column | 1804 | 722 | x526 **w390 h1208** (center x720) | `OmsVideoPlayer` (`oms-entrance.webm`→`oms-loop.webm`), reused asset |
| Product 1 — Wallet Infrastructure | 1874 | 792 | LEFT | card x59 **w596 h331** → line x59→655 |
| Product 2 — Crosschain Interop | 2204 | 1122 | RIGHT | card x853 **w530 h343** → line 853→1383 |
| Product 3 — On/Off and Cash Ramps | 2547 | 1465 | LEFT | card x59 **w596 h391** → line x59→655 |
| Product 4 — Blockchain Rails | 2909 | 1827 | RIGHT | card x853 **w530 h274** → line 853→1383 |
| Coming-soon cards (Stablecoin Orchestration, KYC Hub) | ~3100 | ~2018 | x60, two side-by-side | reuse `SecondaryCard`; exact tops verified at build |
| Bottom inverted-primary grid band | 3556 | **2474** | full width, single 121px row flush to section bottom | reuse existing bottom-grid SVG (diagonal-cut top-left); the `is-bottom` *wrap* is 360 tall but the visible black row sits at the bottom edge, matching the homepage pattern (verified against live) |

---

## The zigzag product card

A single new `OmsProductCard` with a `side: 'left' | 'right'` prop. Internals are a
**single vertical column** (~417px content width) — NOT the homepage's 2-column split —
stacking, top to bottom:

1. **Badge** `oms-product-tag` ("LIVE") — corner-tick bordered pill. LEFT: hangs at the
   card's top-left; RIGHT: top-right corner of the content column.
2. **Heading** — `u-h3-new` = `text-desktop-h3` (36/1.25/−0.36), `whitespace-pre-line`.
3. **Subtitle** — `text-body-mono-medium`, uppercase, opacity 70%.
4. **Button-wrap** (`oms-button-wrap`, ~316×110) — 2 equal cells:
   - left cell: wire icon image (`oms-what-button-image`, 151×108) + colored `DotHex`
     indicator (10×8) top-left, with a `border-top`/`border-left`.
   - right cell: cut-corner SVG border, explore label (`ScrambleText`) top-right +
     `ExploreArrow` (44×36, colored on hover) bottom-right.
5. **Description** — `text-body-regular`, opacity 70%, ~417px wide.
6. **Powered-by** — "powered by" mono + logo (Sequence / Trails / Coinme; Blockchain
   Rails has none).

**Card box vs content.** The card `<a>` carries the **1px white `border-top`** (the
connector line) and is wider than its content so the line overshoots toward center and
is hidden behind the video:
- LEFT: card `left:59 width:596` (line x59→655); content column left-aligned at x59.
- RIGHT: card `left:853 width:530` (line 853→1383); content column right-aligned at
  x1012 (right margin 1383).

**Hover** (reuse existing behaviour): card border + text/badge brighten to white
(`--bc` swap #707bb7→white); explore arrow fills with the row's dot color.

Per-row dot colors (existing defaults): Wallet `#00FF08`, Crosschain `#E271D7`,
On/Off `#FF7421`, Blockchain `#00BBFF`.

---

## Architecture

- **New file** `components/sections/oms-products.tsx` exporting `OmsProducts`.
  - Self-contained 1440×2595 scale-to-fit stage (same pattern as the current section).
  - Renders: background (radial + grid), top platform + eyebrow, heading, body,
    central `OmsVideoPlayer`, 4 `OmsProductCard`s (absolute-positioned at the rel-y/side
    above), 2 `SecondaryCard`s, bottom grid band.
  - `OmsProductCard` lives in this file (or a colocated helper); reuses `DotHex`,
    `ExploreArrow`, `ScrambleText`, `Badge`, and the existing icon/logo assets.
- **Reuse, don't duplicate:** if `DotHex`/`ExploreArrow`/`ARROW_BOX`/`ARROW_TRI` are
  needed by both files, lift them into a shared module rather than copy-paste.
- **Swap** in `app/open-money-stack/page.tsx`: `<OpenMoneyStack eyebrow=… heading=…/>`
  → `<OmsProducts />`. Remove now-unused props. Homepage import unchanged.
- Content (products + coming-soon) carried as defaults in the new file, seeded from the
  existing `OMS_DEFAULT_PRODUCTS` / `OMS_DEFAULT_COMING_SOON` (already match live).

---

## Verification (per Pixel-Perfect Fidelity Protocol)

Reference: `.figma-ref/oms-page/live-products-d.png` (full section, DPR2).

1. Render local, screenshot the section at DPR2, overlay/diff against the live ref.
2. Per-element zoomed checks: each card's badge corner, heading, subtitle wrap, the
   button-wrap (icon + dot + explore + arrow), description wrap, powered-by logo.
3. **Connector lines:** confirm each line starts at the correct margin and terminates
   behind the video (x655 left / x853 right), not crossing to the far side.
4. Video column alignment: hexagon objects sit centered between the L/R cards; verify
   the reused asset aligns — re-extract only if visibly off.
5. Hover state on each card (border/text/badge → white, arrow fill = dot color).
6. Output a PASS/FAIL table (live value vs local) before claiming done.

---

## Out of scope (this pass)

- Mobile layout (separate follow-up; current stacked mobile remains).
- Homepage `open-money-stack.tsx` changes.
- Any change to hero, stats, FAQ, or use-cases sections.
