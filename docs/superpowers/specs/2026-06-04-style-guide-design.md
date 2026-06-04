# Style Guide + Design Token System — Design Spec

**Date:** 2026-06-04  
**Source:** Figma file `Xot6Ao6SMgaUTRzC2TWHoP` — "Polygon Style Guide" page  
**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript

---

## Goals

1. Extract all Polygon design tokens from Figma into the codebase as the single source of truth.
2. Wire light/dark theming from day one so every future component inherits both themes automatically.
3. Deliver a live `/style-guide` page that renders the full token set (typography, colors, grid, spacing).

---

## Architecture: Approach A — Tailwind v4 `@theme` + CSS custom properties

### Token flow

```
globals.css                 → defines CSS custom properties per theme
  :root                     → light theme values (default)
  [data-theme="dark"]       → dark theme values
  @theme inline             → maps CSS vars → Tailwind utility names
  @font-face                → self-hosted PolySans + ABC Diatype Mono

layout.tsx                  → wraps app in <ThemeProvider>
components/theme-provider   → next-themes Client Component
components/ui/theme-toggle  → sun/moon toggle button
```

### Dark/light switching

- Default: `prefers-color-scheme` (system preference)
- Manual: clicking toggle sets `data-theme="dark"` | `"light"` on `<html>`, persisted to `localStorage`
- SSR-safe: `suppressHydrationWarning` on `<html>` prevents flash

---

## Fonts

Self-hosted OTF files in `public/fonts/`. ABC Diatype Mono is not available — `PolySansTrial-NeutralMono.otf` is used as the closest substitute for label/mono styles.

| File | Font family name | Usage |
|------|-----------------|-------|
| `PolySansTrial-SlimWide.otf` | `"PolySans Slim Wide"` | All headings H1–H5 (weight 300) |
| `PolySansTrial-Neutral.otf` | `"PolySans Neutral"` | Body text (weight 400) |
| `PolySansTrial-NeutralMono.otf` | `"PolySans Mono"` | Labels, mono caps (weight 400) |

CSS variables: `--font-heading` · `--font-body` · `--font-mono`

---

## Typography Scale

### Desktop

| Token | Family | Size | Weight | Line-height | Letter-spacing |
|-------|--------|------|--------|-------------|----------------|
| Desktop/H1 | PolySans Slim Wide | 96px | 300 | 90% | -1.92px (-2%) |
| Desktop/H2 | PolySans Slim Wide | 64px | 300 | 106% | -1.28px (-2%) |
| Desktop/H2-Indent | PolySans Slim Wide | 64px | 300 | 110% | -1.28px (-2%) · text-indent 120px |
| Desktop/H3 | PolySans Slim Wide | 36px | 300 | 125% | -0.36px (-1%) |
| Desktop/H3-Indent | PolySans Slim Wide | 36px | 300 | 125% | -0.36px (-1%) · text-indent 130px |
| Desktop/H4 | PolySans Slim Wide | 28px | 300 | 125% | -0.28px (-1%) |
| Desktop/H4-Indent | PolySans Slim Wide | 28px | 300 | 125% | -0.28px (-1%) · text-indent 70px |
| Desktop/H5 | PolySans Slim Wide | 24px | 300 | 125% | -0.24px (-1%) |
| Desktop/Body Large | PolySans Neutral | 18px | 400 | 140% | — |
| Desktop/Body | PolySans Neutral | 16px | 400 | 140% | — |
| Desktop/Body Small | PolySans Neutral | 13px | 400 | 120% | — |
| Desktop/Mono Large | ABC Diatype Mono | 16px | 400 | 110% | +0.16px (+1%) · uppercase · dlig |
| Desktop/Mono Medium | ABC Diatype Mono | 14px | 400 | normal | +0.14px (+1%) · uppercase · dlig |
| Desktop/Mono | ABC Diatype Mono | 13px | 400 | 120% | +0.13px (+1%) · uppercase · dlig |
| Desktop/Mono Small | ABC Diatype Mono | 12px | 400 | 110% | +0.12px (+1%) · uppercase · dlig |

### Mobile

| Token | Size | Weight | Line-height | Letter-spacing |
|-------|------|--------|-------------|----------------|
| Mobile/H1 | 56px | 300 | 90% | -1.12px (-2%) |
| Mobile/H2 | 36px | 300 | 110% | -0.72px (-2%) |
| Mobile/H2-Indent | 36px | 300 | 110% | -0.72px (-2%) · text-indent 100px |
| Mobile/H3 | 28px | 300 | 125% | -0.28px (-1%) |
| Mobile/H4 | 24px | 300 | 125% | -0.24px (-1%) |
| Mobile/H5 | 18px | 300 | 125% | -0.18px (-1%) |
| Mobile/Body Large | 16px | 400 | 140% | — |
| Mobile/Body | 14px | 400 | 140% | — |
| Mobile/Mono | 13px | 400 | 110% | +0.13px (+1%) · uppercase · dlig |
| Mobile/Mono Small | 12px | 400 | 110% | +0.12px (+1%) · uppercase · dlig |

Typography implemented as CSS `@utility` classes (e.g. `.text-desktop-h1`, `.text-mobile-h2`) that apply all properties together. Used on any element via Tailwind.

---

## Color System

### Theme Colors (semantic — flip per theme)

| Token | Dark value | Light value |
|-------|-----------|-------------|
| `--primary` | `#FFFFFF` | `#07060D` |
| `--inverted-primary` | `#07060D` | `#F2F1F5` |
| `--inverted-primary-hover` | `#121118` | `#D0CED6` |
| `--grey-100` | `#F2F3F7` | `#2D2B36` |
| `--grey-200` | `#A0A1A6` | `#888A91` |
| `--grey-300` | `#595A5F` | `#A2A3A5` |
| `--grey-400` | `#353535` | `#BAB9BB` |
| `--grey-500` | `#1F1E20` | `#D7D6D9` |
| `--grey-500-hover` | `#272628` | `#C4C2C9` |
| `--grey-600` | `#141415` | `#E7E6E8` |
| `--grey-600-hover` | `#1D1D1F` | `#DCDBDE` |
| `--stroke` | `#1B1B1D` | `#E1E1E5` |
| `--purple-subtle` | `#290958` | `#DDCFF2` |

### Accent Colors (fixed — no theme flip)

| Token | Value |
|-------|-------|
| `--purple` | `#670DE5` |
| `--purple-hover` | `#721FE5` |
| `--bubble-gum` | `#E271D7` |
| `--sky-blue` | `#00BBFF` |
| `--neon-green` | `#00FF08` |
| `--orange` | `#FF7421` |
| `--yellow` | `#FEE211` |
| `--blue` | `#0037C6` |
| `--semi-transparent-blue` | `#707BB7` |
| `--semi-transparent-purple` | `#C590E5` |

---

## Grid System

### Desktop (1440px canvas)
- Columns: 12
- Margin: 60px (left + right)
- Gutter: 28px
- Column width: ~84.33px
- Row: 4px height, 4px gutter, auto count, top-aligned

### Mobile (375px canvas)
- Columns: 4
- Margin: 16px (left + right)
- Gutter: 16px
- Column width: ~73.5px
- Row: 4px height, 4px gutter, auto count, top-aligned

Grid implemented as Tailwind v4 custom utilities and CSS variables for use in layout containers.

### Spacers
- Desktop spacer: 120px height (1 full spacer unit)
- Mobile spacer: 75px height (1 full spacer unit)

---

## `/style-guide` Page Structure

```
/style-guide
  ├── Section: Typography
  │     ├── Desktop type scale (H1 → Mono Small) — live text + spec label
  │     └── Mobile type scale (H1 → Mono Small) — live text + spec label
  ├── Section: Colors
  │     ├── Theme Colors — dark/light side-by-side swatches
  │     └── Accent Colors — fixed palette swatches
  ├── Section: Grid
  │     ├── Desktop 12-column visual
  │     └── Mobile 4-column visual
  └── Section: Spacing
        ├── Desktop spacer (120px)
        └── Mobile spacer (75px)
```

The page itself uses `data-theme` toggle so you can preview all sections in both themes live.

---

## File Structure

```
app/
  globals.css                  ← @font-face, :root tokens, [data-theme="dark"] tokens, @theme inline
  layout.tsx                   ← wraps with ThemeProvider, adds suppressHydrationWarning
  style-guide/
    page.tsx                   ← full style guide page (Server Component)
components/
  theme-provider.tsx           ← next-themes ClientProvider wrapper
  ui/
    theme-toggle.tsx           ← toggle button Client Component
public/
  fonts/
    PolySansTrial-SlimWide.otf      ← heading font
    PolySansTrial-Neutral.otf       ← body font
    PolySansTrial-NeutralMono.otf   ← mono/label font
```

---

## Dependencies to add

- `next-themes` — theme switching with SSR support and localStorage persistence

---

## Out of scope for this spec

- Gradient Language System (complex visual system — separate spec after homepage design is shared)
- Homepage sections (separate spec once style guide is complete)
