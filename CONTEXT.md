# Polygon Homepage — Codebase Context

## Stack
- Next.js 16 (App Router, no Pages Router)
- React 19
- Tailwind CSS v4 — uses `@import "tailwindcss"` and `@theme inline`, NOT `@tailwind base/components/utilities`
- TypeScript strict mode
- next-themes for dark/light toggle

## Design System Source
Figma file key: `Xot6Ao6SMgaUTRzC2TWHoP` (Polygon Style Guide page)
Full spec: `docs/superpowers/specs/2026-06-04-style-guide-design.md`

---

## Fonts

Loaded via `next/font/local` in `app/layout.tsx`. Files live in `public/fonts/`.

| CSS variable | File | Usage |
|---|---|---|
| `--font-heading` | `PolySansTrial-SlimWide.otf` | All headings H1–H5, weight 300 |
| `--font-body` | `PolySansTrial-Neutral.otf` | All body text, weight 400 |
| `--font-mono` | `PolySansTrial-NeutralMono.otf` | Labels, mono/caps, weight 400 |

In Tailwind: `font-heading`, `font-body`, `font-mono`

---

## Theming

Dark/light is controlled by `data-theme="dark"` on `<html>`, set by `next-themes` (attribute mode).
- Default: system preference (`prefers-color-scheme`)
- Toggle: `ThemeToggle` component at `components/ui/theme-toggle.tsx`
- Provider: `ThemeProvider` at `components/theme-provider.tsx`

**Rule:** Never hardcode color hex values in components. Always use semantic token classes (`text-primary`, `bg-background`, `border-stroke`, etc.).

---

## Color Tokens

All defined in `app/globals.css`. Flip automatically between themes.

### Semantic (theme-aware)

| Tailwind class | Dark | Light | Use for |
|---|---|---|---|
| `text-primary` / `bg-primary` | `#FFFFFF` | `#07060D` | Primary text, icons |
| `bg-background` | `#07060D` | `#FFFFFF` | Page background |
| `bg-inverted-primary` | `#07060D` | `#F2F1F5` | Inverted surfaces |
| `bg-inverted-primary-hover` | `#121118` | `#D0CED6` | Hover on inverted surfaces |
| `text-grey-100` / `bg-grey-100` | `#F2F3F7` | `#2D2B36` | Near-primary text |
| `text-grey-200` / `bg-grey-200` | `#A0A1A6` | `#888A91` | Secondary/muted text |
| `text-grey-300` / `bg-grey-300` | `#595A5F` | `#A2A3A5` | Tertiary text |
| `text-grey-400` / `bg-grey-400` | `#353535` | `#BAB9BB` | Subtle elements |
| `bg-grey-500` | `#1F1E20` | `#D7D6D9` | Subtle surfaces |
| `bg-grey-500-hover` | `#272628` | `#C4C2C9` | Hover on grey-500 |
| `bg-grey-600` | `#141415` | `#E7E6E8` | Deep surfaces |
| `bg-grey-600-hover` | `#1D1D1F` | `#DCDBDE` | Hover on grey-600 |
| `border-stroke` | `#1B1B1D` | `#E1E1E5` | All borders, dividers |
| `bg-purple-subtle` | `#290958` | `#DDCFF2` | Subtle purple tint |

### Accent (fixed — no theme flip)

| Tailwind class | Value | Use for |
|---|---|---|
| `bg-purple` / `text-purple` | `#670DE5` | Primary brand accent |
| `bg-purple-hover` | `#721FE5` | Hover on purple |
| `bg-bubble-gum` | `#E271D7` | Pink accent |
| `bg-sky-blue` | `#00BBFF` | Cyan accent |
| `bg-neon-green` | `#00FF08` | Green accent |
| `bg-orange` | `#FF7421` | Orange accent |
| `bg-yellow` | `#FEE211` | Yellow accent |
| `bg-blue` | `#0037C6` | Blue accent |
| `bg-semi-transparent-blue` | `#707BB7` | Muted blue |
| `bg-semi-transparent-purple` | `#C590E5` | Muted purple |

---

## Typography Utilities

Defined in `app/globals.css` as `@utility` rules. Apply as a single class — they set font-family, size, weight, line-height, and letter-spacing together.

### Desktop

| Class | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|
| `text-desktop-h1` | 96px | 300 | 90% | −1.92px |
| `text-desktop-h2` | 64px | 300 | 106% | −1.28px |
| `text-desktop-h2-indent` | 64px | 300 | 110% | −1.28px + indent 120px |
| `text-desktop-h3` | 36px | 300 | 125% | −0.36px |
| `text-desktop-h3-indent` | 36px | 300 | 125% | −0.36px + indent 130px |
| `text-desktop-h4` | 28px | 300 | 125% | −0.28px |
| `text-desktop-h4-indent` | 28px | 300 | 125% | −0.28px + indent 70px |
| `text-desktop-h5` | 24px | 300 | 125% | −0.24px |
| `text-desktop-body-large` | 18px | 400 | 140% | — |
| `text-desktop-body` | 16px | 400 | 140% | — |
| `text-desktop-body-small` | 13px | 400 | 120% | — |
| `text-desktop-mono-large` | 16px | 400 | 110% | +0.16px · uppercase |
| `text-desktop-mono-medium` | 14px | 400 | normal | +0.14px · uppercase |
| `text-desktop-mono` | 13px | 400 | 120% | +0.13px · uppercase |
| `text-desktop-mono-small` | 12px | 400 | 110% | +0.12px · uppercase |

### Mobile

| Class | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|
| `text-mobile-h1` | 56px | 300 | 90% | −1.12px |
| `text-mobile-h2` | 36px | 300 | 110% | −0.72px |
| `text-mobile-h2-indent` | 36px | 300 | 110% | −0.72px + indent 100px |
| `text-mobile-h3` | 28px | 300 | 125% | −0.28px |
| `text-mobile-h4` | 24px | 300 | 125% | −0.24px |
| `text-mobile-h5` | 18px | 300 | 125% | −0.18px |
| `text-mobile-body-large` | 16px | 400 | 140% | — |
| `text-mobile-body` | 14px | 400 | 140% | — |
| `text-mobile-mono` | 13px | 400 | 110% | +0.13px · uppercase |
| `text-mobile-mono-small` | 12px | 400 | 110% | +0.12px · uppercase |

---

## Grid System

### Desktop (1440px canvas)
- 12 columns
- Margin: 60px left and right → use `px-[60px]` on containers
- Gutter: 28px between columns
- Column width: ~84.33px each

### Mobile (375px canvas)
- 4 columns
- Margin: 16px left and right → use `px-4` on containers
- Gutter: 16px between columns
- Column width: ~73.5px each

### Spacers
- Desktop section spacer: `h-[120px]`
- Mobile section spacer: `h-[75px]`

---

## Component Conventions

- **Server Components by default.** Only add `'use client'` when the component uses browser APIs, event handlers, or React hooks.
- **No hardcoded colors.** Use semantic token classes only.
- **Typography classes as single utilities.** Don't reconstruct type styles with individual Tailwind classes — use `text-desktop-h1`, not `text-[96px] font-light leading-[0.9]`.
- **Sections use 60px horizontal padding** (`px-[60px]`) on desktop, `px-4` on mobile.
- **Section vertical gap:** `gap-[120px]` between major sections (desktop spacer unit).

## Component Library

Shared UI components live at **`components/ui/<name>.tsx`** — flat structure, no subdirectories.

**Before building any UI element, check this file and CONTEXT.md first.** If a component already exists, use it — do not create a duplicate. If a new variant is needed, add it to the existing component via props.

Each component entry below documents: file path, all accepted props with types, variants, and a usage example.

> Components will be listed here as they are built. Start of component library — none yet.
