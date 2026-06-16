# Mobile Responsiveness Pass — Design Spec

**Date:** 2026-06-15
**Status:** Approved (strategy), pending implementation plan
**Scope:** Full mobile experience for the Polygon homepage — layout, navigation, component swaps, and touch interactions — matched pixel-perfect to the live site (`polygon.technology`) at the 375px mobile canvas.

---

## 1. Background & current state

The homepage is built on a fixed **1440px desktop design stage** per section, scaled to the viewport via `transform: scale(calc(100cqw / 1440px))` inside a `containerType: inline-size` container. All 9 sections (`nav`, `hero`, `at-glance`, `open-money-stack`, `purpose`, `pol-token`, `use-cases`, `footer`, and the deferred `news-slider`) use this single pattern.

Consequences today:
- There is **no responsive code** — zero `sm:`/`md:`/`@media`/`useMediaQuery` usage.
- On a phone, the desktop layout is uniformly shrunk to ~26% (375/1440) — everything is proportionally identical to desktop but tiny.
- Mobile typography tokens (`text-mobile-h1`, `text-mobile-h2`, … defined in `app/globals.css`) exist but are used **only** in `app/style-guide/page.tsx`, never in real sections.

The live site has a genuine, distinct mobile design: a 375px / 4-column grid, the mobile type scale, a hamburger nav, and component swaps (e.g. the slider's `hide-desktop` / `hide-landscape` variants).

**This pass builds the mobile layouts that do not yet exist.**

---

## 2. Locked decisions

| Decision | Choice |
|---|---|
| **Fidelity bar** | Pixel-perfect to live mobile — same standard as desktop. Extract live mobile DOM/CSS/assets per section; verify with a per-element PASS/FAIL table. Governed by the CLAUDE.md Pixel-Perfect Fidelity Protocol. |
| **Technique** | Per-section **375px mobile scale-to-fit stage**, mirroring the existing desktop stage pattern. Both stages live in the DOM; CSS toggles which is visible. |
| **Section breakpoint** | **768px** (Tailwind stock `md`). Desktop 1440 stage at ≥768px (`hidden md:block`); mobile 375 stage at ≤767px (`md:hidden`). |
| **Nav breakpoint** | **992px** (custom `nav` screen). Desktop nav at ≥992px; hamburger menu at ≤991px. |
| **Interactive scope** | In scope: hamburger nav, component swaps, touch interactions. Not a layout-only pass. |
| **Execution strategy** | **Foundation-first, then sequential** (C → A). Build shared infra once, then sections top-to-bottom with a verify gate each. Parallelization deferred until the pattern is proven on nav + hero. |

### Breakpoint behavior summary

- **≥992px:** desktop nav + desktop content stages.
- **768–991px:** hamburger nav + desktop content stages (a normal "tablet" combination).
- **≤767px:** hamburger nav + mobile 375 content stages.

The mobile stage is pixel-perfect at 375px (real phones) and scales up to ~767px proportionally. The desktop stage scales down to 768px (~0.53×) at the bottom of its range.

---

## 3. The stage-swap pattern

Each section keeps its desktop stage and gains a parallel mobile stage:

```tsx
<section style={{ containerType: 'inline-size' }}>
  {/* Desktop — visible ≥768px */}
  <DesktopStage className="hidden md:block">
    {/* existing 1440 coordinate-space layout */}
  </DesktopStage>

  {/* Mobile — visible ≤767px */}
  <MobileStage className="md:hidden" height={MOBILE_H}>
    {/* new 375 coordinate-space layout */}
  </MobileStage>
</section>
```

Mobile stage internals:
- Outer box: `aspectRatio: 375 / <contentHeight>` so the section reserves correct vertical space.
- Inner: `width: 375; transform: scale(calc(100cqw / 375px)); transform-origin: top left`.
- `<contentHeight>` is the **exact live mobile section height**, extracted — never guessed.

---

## 4. Phase 0 — Shared foundation (build once)

1. **Stage components** in `components/ui/`:
   - Extract the repeated scale-stage boilerplate into a reusable component (e.g. `Stage` for the 1440 desktop stage and `MobileStage` for the 375 stage), parameterized by design width and content height.
   - Refactor existing sections to use the desktop `Stage` as they are touched (no big-bang refactor; convert per section during its cycle to limit blast radius).
2. **Custom `nav` breakpoint (992px)** added once in `app/globals.css` via `@theme` (`--breakpoint-nav: 992px`), enabling `nav:` / `max-nav:` variants for the navbar only. Sections rely on stock `md`.
3. **Mobile typography wiring** — begin using the existing `text-mobile-*` utilities in real sections (first real usage outside the style guide).
4. **Live-mobile extraction harness** — a headless-Chrome (CDP) script that loads `polygon.technology` with mobile device emulation at 375px width, captures per-section reference screenshots and computed styles, and writes them to `.figma-ref/mobile/`. This is the mobile edition of the existing extract-and-diff loop.

---

## 5. Phase 1+ — Per-section execution

**Order:** `nav` (hamburger) → `hero` → `at-glance` → `open-money-stack` → `purpose` → `pol-token` → `use-cases` → `footer`. The `news-slider` stays deferred while it is commented out in `app/page.tsx`.

**Per-section loop (the verify gate):**
1. Extract live mobile source-of-truth: DOM structure + classes, computed CSS (colors, spacing, sizes), real SVG paths, and any mobile-specific assets — captured at 375px.
2. Capture the live mobile reference screenshot for the section.
3. Build the section's 375 mobile stage using the extracted values and mobile type tokens.
4. Screenshot the local section at 375px (primary), with spot-checks at 767px and 991px boundaries.
5. Produce a **per-element PASS/FAIL table** (live value vs. local value) covering text, color, spacing (gap-between and space-within), icons/SVG, assets, and default + interactive states.
6. Only advance once the table is clean.

---

## 6. Interactive chunks (mini-builds)

- **Nav hamburger (built first — sets the interaction template):** a `'use client'` component with open/close toggle state, a slide-out menu + overlay, animated to match live's mobile menu. Triggered ≤991px via the custom `nav` breakpoint.
- **Component swaps:** sections where live renders a different component on mobile (stacked vs side-by-side cards, the at-glance carousel behavior, etc.). Surfaced during each section's extraction step and implemented within its cycle.
- **Touch interactions:** mobile gestures that replace desktop hover/drag (swipe on carousels/sliders, tap-to-expand). Implemented within the owning section's cycle.

---

## 7. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Raster assets (webp/png) upscale and soften when the mobile stage exceeds 375px (up to 767px). | Vectors/SVG and text stay crisp. Identify raster-heavy sections during extraction and verify them specifically at 767px; supply higher-res or vector assets where live does. |
| Fixed-height mobile stages need the exact live mobile content height. | Extract the real section height from live mobile per section; never estimate. |
| 768–991px shows desktop content + hamburger nav — must not look broken. | Boundary spot-checks at 767 and 991 in every section's verify step. |
| Parallelizing too early causes inconsistent stage wrappers / nav-state assumptions. | Prove the pattern on nav + hero sequentially before considering parallel work on the simpler trailing sections. |

---

## 8. Out of scope

- A dedicated tablet (768–991) layout distinct from the upscaled mobile stage — the design system has only two canvases (1440, 375), so tablet inherits the desktop content stage.
- The `news-slider` section while it remains commented out.
- Any net-new desktop changes; this pass only adds mobile layers to existing sections.

---

## 9. Definition of done

Every in-scope section has a 375 mobile stage that passes its per-element PASS/FAIL table against live mobile; the hamburger nav works ≤991px; component swaps and touch interactions match live; and the page is verified at 375px with clean 767px/991px boundaries.
