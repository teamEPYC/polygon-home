# Style Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire all Polygon design tokens from Figma into `globals.css` and build the live `/style-guide` page with full light/dark theme switching.

**Architecture:** Design tokens as CSS custom properties in `globals.css`, themed via `[data-theme="dark"]` on `<html>`, mapped to Tailwind v4 utilities via `@theme inline`. Fonts loaded with `next/font/local`. `next-themes` manages the toggle with SSR safety. The `/style-guide` page is a Server Component; only the toggle button is a Client Component.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript, next-themes

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `app/globals.css` | Modify | All design tokens, @theme, @utility typography classes |
| `app/layout.tsx` | Modify | Load fonts via next/font/local, wrap ThemeProvider |
| `components/theme-provider.tsx` | Create | next-themes Client Component wrapper |
| `components/ui/theme-toggle.tsx` | Create | Sun/moon toggle button (Client Component) |
| `app/style-guide/page.tsx` | Create | Full style guide page (Server Component) |
| `CONTEXT.md` | Create | Living design system reference — loaded by every agent session |
| `CLAUDE.md` | Modify | Add `@CONTEXT.md` so it's auto-loaded at session start |

---

## Task 1: Install next-themes

**Files:**
- Modify: `package.json` (via pnpm)

- [ ] **Step 1: Install the package**

```bash
cd /home/aayushman/projects/polygon-home && pnpm add next-themes
```

Expected output: `packages/next-themes added` (or similar pnpm success message)

- [ ] **Step 2: Verify it's in package.json**

```bash
grep "next-themes" package.json
```

Expected: `"next-themes": "^X.X.X"` in dependencies.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml && git commit -m "chore: add next-themes"
```

---

## Task 2: Rewrite globals.css with all design tokens

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css with the full token system**

Full file content — replace everything:

```css
@import "tailwindcss";

/* ─── Light Theme (default) ────────────────────────────────────────────────── */
:root {
  --primary: #07060D;
  --inverted-primary: #F2F1F5;
  --inverted-primary-hover: #D0CED6;
  --background: #FFFFFF;
  --foreground: #07060D;
  --grey-100: #2D2B36;
  --grey-200: #888A91;
  --grey-300: #A2A3A5;
  --grey-400: #BAB9BB;
  --grey-500: #D7D6D9;
  --grey-500-hover: #C4C2C9;
  --grey-600: #E7E6E8;
  --grey-600-hover: #DCDBDE;
  --stroke: #E1E1E5;
  --purple-subtle: #DDCFF2;

  /* Accent colors — no theme flip */
  --purple: #670DE5;
  --purple-hover: #721FE5;
  --bubble-gum: #E271D7;
  --sky-blue: #00BBFF;
  --neon-green: #00FF08;
  --orange: #FF7421;
  --yellow: #FEE211;
  --blue: #0037C6;
  --semi-transparent-blue: #707BB7;
  --semi-transparent-purple: #C590E5;
}

/* ─── Dark Theme ────────────────────────────────────────────────────────────── */
[data-theme="dark"] {
  --primary: #FFFFFF;
  --inverted-primary: #07060D;
  --inverted-primary-hover: #121118;
  --background: #07060D;
  --foreground: #FFFFFF;
  --grey-100: #F2F3F7;
  --grey-200: #A0A1A6;
  --grey-300: #595A5F;
  --grey-400: #353535;
  --grey-500: #1F1E20;
  --grey-500-hover: #272628;
  --grey-600: #141415;
  --grey-600-hover: #1D1D1F;
  --stroke: #1B1B1D;
  --purple-subtle: #290958;
}

/* ─── Tailwind Token Map ────────────────────────────────────────────────────── */
/* Maps CSS vars to Tailwind utility names (bg-primary, text-foreground, etc.)  */
@theme inline {
  /* Fonts — injected by next/font/local via className on <html> */
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
  --font-mono: var(--font-mono);

  /* Semantic */
  --color-primary: var(--primary);
  --color-inverted-primary: var(--inverted-primary);
  --color-inverted-primary-hover: var(--inverted-primary-hover);
  --color-background: var(--background);
  --color-foreground: var(--foreground);

  /* Greys */
  --color-grey-100: var(--grey-100);
  --color-grey-200: var(--grey-200);
  --color-grey-300: var(--grey-300);
  --color-grey-400: var(--grey-400);
  --color-grey-500: var(--grey-500);
  --color-grey-500-hover: var(--grey-500-hover);
  --color-grey-600: var(--grey-600);
  --color-grey-600-hover: var(--grey-600-hover);
  --color-stroke: var(--stroke);
  --color-purple-subtle: var(--purple-subtle);

  /* Accents */
  --color-purple: var(--purple);
  --color-purple-hover: var(--purple-hover);
  --color-bubble-gum: var(--bubble-gum);
  --color-sky-blue: var(--sky-blue);
  --color-neon-green: var(--neon-green);
  --color-orange: var(--orange);
  --color-yellow: var(--yellow);
  --color-blue: var(--blue);
  --color-semi-transparent-blue: var(--semi-transparent-blue);
  --color-semi-transparent-purple: var(--semi-transparent-purple);
}

/* ─── Typography Utilities ──────────────────────────────────────────────────── */
/* Desktop headings — PolySans Slim Wide, weight 300 */
@utility text-desktop-h1 {
  font-family: var(--font-heading);
  font-size: 96px;
  font-weight: 300;
  line-height: 0.9;
  letter-spacing: -1.92px;
}
@utility text-desktop-h2 {
  font-family: var(--font-heading);
  font-size: 64px;
  font-weight: 300;
  line-height: 1.06;
  letter-spacing: -1.28px;
}
@utility text-desktop-h2-indent {
  font-family: var(--font-heading);
  font-size: 64px;
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -1.28px;
  text-indent: 120px;
}
@utility text-desktop-h3 {
  font-family: var(--font-heading);
  font-size: 36px;
  font-weight: 300;
  line-height: 1.25;
  letter-spacing: -0.36px;
}
@utility text-desktop-h3-indent {
  font-family: var(--font-heading);
  font-size: 36px;
  font-weight: 300;
  line-height: 1.25;
  letter-spacing: -0.36px;
  text-indent: 130px;
}
@utility text-desktop-h4 {
  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 300;
  line-height: 1.25;
  letter-spacing: -0.28px;
}
@utility text-desktop-h4-indent {
  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 300;
  line-height: 1.25;
  letter-spacing: -0.28px;
  text-indent: 70px;
}
@utility text-desktop-h5 {
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 300;
  line-height: 1.25;
  letter-spacing: -0.24px;
}

/* Desktop body — PolySans Neutral, weight 400 */
@utility text-desktop-body-large {
  font-family: var(--font-body);
  font-size: 18px;
  font-weight: 400;
  line-height: 1.4;
}
@utility text-desktop-body {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
}
@utility text-desktop-body-small {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.2;
}

/* Desktop mono — PolySans NeutralMono, weight 400, always uppercase */
@utility text-desktop-mono-large {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: 0.16px;
  text-transform: uppercase;
  font-feature-settings: 'dlig' on;
}
@utility text-desktop-mono-medium {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.14px;
  text-transform: uppercase;
  font-feature-settings: 'dlig' on;
}
@utility text-desktop-mono {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: 0.13px;
  text-transform: uppercase;
  font-feature-settings: 'dlig' on;
}
@utility text-desktop-mono-small {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: 0.12px;
  text-transform: uppercase;
  font-feature-settings: 'dlig' on;
}

/* Mobile headings — same family/weight, scaled sizes */
@utility text-mobile-h1 {
  font-family: var(--font-heading);
  font-size: 56px;
  font-weight: 300;
  line-height: 0.9;
  letter-spacing: -1.12px;
}
@utility text-mobile-h2 {
  font-family: var(--font-heading);
  font-size: 36px;
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.72px;
}
@utility text-mobile-h2-indent {
  font-family: var(--font-heading);
  font-size: 36px;
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.72px;
  text-indent: 100px;
}
@utility text-mobile-h3 {
  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 300;
  line-height: 1.25;
  letter-spacing: -0.28px;
}
@utility text-mobile-h4 {
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 300;
  line-height: 1.25;
  letter-spacing: -0.24px;
}
@utility text-mobile-h5 {
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 300;
  line-height: 1.25;
  letter-spacing: -0.18px;
}
@utility text-mobile-body-large {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
}
@utility text-mobile-body {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
}
@utility text-mobile-mono {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: 0.13px;
  text-transform: uppercase;
  font-feature-settings: 'dlig' on;
}
@utility text-mobile-mono-small {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: 0.12px;
  text-transform: uppercase;
  font-feature-settings: 'dlig' on;
}

/* ─── Base ──────────────────────────────────────────────────────────────────── */
body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-body);
}
```

- [ ] **Step 2: Verify the dev server still starts without errors**

```bash
cd /home/aayushman/projects/polygon-home && pnpm dev
```

Open http://localhost:3000. The default page should still render (just with updated CSS). No console errors.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css && git commit -m "feat: add full design token system to globals.css"
```

---

## Task 3: Load fonts and wire ThemeProvider into layout.tsx

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/theme-provider.tsx`

- [ ] **Step 1: Create the ThemeProvider component**

Create `components/theme-provider.tsx`:

```tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  )
}
```

- [ ] **Step 2: Rewrite layout.tsx with font loading and ThemeProvider**

Full file — replace entirely:

```tsx
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const polySansSlimWide = localFont({
  src: '../public/fonts/PolySansTrial-SlimWide.otf',
  variable: '--font-heading',
  weight: '300',
  display: 'swap',
})

const polySansNeutral = localFont({
  src: '../public/fonts/PolySansTrial-Neutral.otf',
  variable: '--font-body',
  weight: '400',
  display: 'swap',
})

const polySansMono = localFont({
  src: '../public/fonts/PolySansTrial-NeutralMono.otf',
  variable: '--font-mono',
  weight: '400',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Polygon',
  description: 'Polygon Technology',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${polySansSlimWide.variable} ${polySansNeutral.variable} ${polySansMono.variable}`}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify the dev server starts and fonts load**

```bash
pnpm dev
```

Open http://localhost:3000. Open DevTools → Network tab → filter by "Font". You should see three font requests: `PolySansTrial-SlimWide.otf`, `PolySansTrial-Neutral.otf`, `PolySansTrial-NeutralMono.otf` all returning 200.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx components/theme-provider.tsx && git commit -m "feat: load PolySans fonts and wire ThemeProvider"
```

---

## Task 4: Build the ThemeToggle button

**Files:**
- Create: `components/ui/theme-toggle.tsx`

- [ ] **Step 1: Create the directory**

```bash
mkdir -p /home/aayushman/projects/polygon-home/components/ui
```

- [ ] **Step 2: Create the ThemeToggle component**

Create `components/ui/theme-toggle.tsx`:

```tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return (
    <div className="h-8 w-16 border border-stroke" aria-hidden />
  )

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="text-desktop-mono-small text-primary border border-stroke px-3 py-1.5 hover:bg-grey-600 transition-colors cursor-pointer"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? 'LIGHT' : 'DARK'}
    </button>
  )
}
```

- [ ] **Step 3: Verify the toggle renders (add it temporarily to app/page.tsx)**

At the top of `app/page.tsx`, add the import and render it somewhere visible:

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle'
// Inside the JSX, add: <ThemeToggle />
```

Open http://localhost:3000. The toggle button should appear, clicking it should switch between dark and light. The background and text colors should flip. Remove the temporary import from `app/page.tsx` after verifying.

- [ ] **Step 4: Commit**

```bash
git add components/ui/theme-toggle.tsx && git commit -m "feat: add ThemeToggle button"
```

---

## Task 5: Build the /style-guide page — skeleton + Typography section

**Files:**
- Create: `app/style-guide/page.tsx`

- [ ] **Step 1: Create the style-guide directory and page skeleton**

Create `app/style-guide/page.tsx`:

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle'

export const metadata = {
  title: 'Style Guide — Polygon',
}

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-background text-primary">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-stroke bg-background px-[60px] py-4">
        <span className="text-desktop-mono text-primary">POLYGON / STYLE GUIDE</span>
        <ThemeToggle />
      </header>

      <main className="px-[60px] py-[64px] flex flex-col gap-[120px]">
        <TypographySection />
        <ColorsSection />
        <GridSection />
        <SpacingSection />
      </main>
    </div>
  )
}

/* ─── Typography ─────────────────────────────────────────────────────────────── */
function TypeRow({
  label,
  spec,
  children,
}: {
  label: string
  spec: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-stroke pb-8">
      <div className="flex items-start justify-between gap-8">
        <div className="shrink-0 w-[280px]">
          <p className="text-desktop-mono-small text-grey-200">{label}</p>
          <p className="text-desktop-mono-small text-grey-300 mt-1 whitespace-pre-line">{spec}</p>
        </div>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}

function TypographySection() {
  return (
    <section>
      <h2 className="text-desktop-h1 text-primary mb-[64px]">Typography</h2>

      <div className="mb-[48px]">
        <p className="text-desktop-mono text-grey-200 mb-[32px]">DESKTOP</p>
        <div className="flex flex-col gap-8">
          <TypeRow label="Desktop / H1" spec="96px · 300 · 90% · −2%">
            <p className="text-desktop-h1 text-primary">The Internet's Backbone</p>
          </TypeRow>
          <TypeRow label="Desktop / H2" spec="64px · 300 · 106% · −2%">
            <p className="text-desktop-h2 text-primary">The Internet's Backbone</p>
          </TypeRow>
          <TypeRow label="Desktop / H2 Indent" spec="64px · 300 · 110% · −2% · indent 120px">
            <p className="text-desktop-h2-indent text-primary">The Internet's Backbone</p>
          </TypeRow>
          <TypeRow label="Desktop / H3" spec="36px · 300 · 125% · −1%">
            <p className="text-desktop-h3 text-primary">The Internet's Backbone</p>
          </TypeRow>
          <TypeRow label="Desktop / H3 Indent" spec="36px · 300 · 125% · −1% · indent 130px">
            <p className="text-desktop-h3-indent text-primary">The Internet's Backbone</p>
          </TypeRow>
          <TypeRow label="Desktop / H4" spec="28px · 300 · 125% · −1%">
            <p className="text-desktop-h4 text-primary">The Internet's Backbone</p>
          </TypeRow>
          <TypeRow label="Desktop / H4 Indent" spec="28px · 300 · 125% · −1% · indent 70px">
            <p className="text-desktop-h4-indent text-primary">The Internet's Backbone</p>
          </TypeRow>
          <TypeRow label="Desktop / H5" spec="24px · 300 · 125% · −1%">
            <p className="text-desktop-h5 text-primary">The Internet's Backbone</p>
          </TypeRow>
          <TypeRow label="Desktop / Body Large" spec="18px · 400 · 140%">
            <p className="text-desktop-body-large text-primary">Polygon is a decentralised Ethereum scaling platform that enables developers to build scalable user-friendly dApps with low transaction fees.</p>
          </TypeRow>
          <TypeRow label="Desktop / Body" spec="16px · 400 · 140%">
            <p className="text-desktop-body text-primary">Polygon is a decentralised Ethereum scaling platform that enables developers to build scalable user-friendly dApps with low transaction fees.</p>
          </TypeRow>
          <TypeRow label="Desktop / Body Small" spec="13px · 400 · 120%">
            <p className="text-desktop-body-small text-primary">Polygon is a decentralised Ethereum scaling platform that enables developers to build scalable user-friendly dApps with low transaction fees.</p>
          </TypeRow>
          <TypeRow label="Desktop / Mono Large" spec="16px · 400 · 110% · +1% · uppercase">
            <p className="text-desktop-mono-large text-primary">Polygon Technology</p>
          </TypeRow>
          <TypeRow label="Desktop / Mono Medium" spec="14px · 400 · normal · +1% · uppercase">
            <p className="text-desktop-mono-medium text-primary">Polygon Technology</p>
          </TypeRow>
          <TypeRow label="Desktop / Mono" spec="13px · 400 · 120% · +1% · uppercase">
            <p className="text-desktop-mono text-primary">Polygon Technology</p>
          </TypeRow>
          <TypeRow label="Desktop / Mono Small" spec="12px · 400 · 110% · +1% · uppercase">
            <p className="text-desktop-mono-small text-primary">Polygon Technology</p>
          </TypeRow>
        </div>
      </div>

      <div>
        <p className="text-desktop-mono text-grey-200 mb-[32px]">MOBILE</p>
        <div className="flex flex-col gap-8">
          <TypeRow label="Mobile / H1" spec="56px · 300 · 90% · −2%">
            <p className="text-mobile-h1 text-primary">The Internet's Backbone</p>
          </TypeRow>
          <TypeRow label="Mobile / H2" spec="36px · 300 · 110% · −2%">
            <p className="text-mobile-h2 text-primary">The Internet's Backbone</p>
          </TypeRow>
          <TypeRow label="Mobile / H2 Indent" spec="36px · 300 · 110% · −2% · indent 100px">
            <p className="text-mobile-h2-indent text-primary">The Internet's Backbone</p>
          </TypeRow>
          <TypeRow label="Mobile / H3" spec="28px · 300 · 125% · −1%">
            <p className="text-mobile-h3 text-primary">The Internet's Backbone</p>
          </TypeRow>
          <TypeRow label="Mobile / H4" spec="24px · 300 · 125% · −1%">
            <p className="text-mobile-h4 text-primary">The Internet's Backbone</p>
          </TypeRow>
          <TypeRow label="Mobile / H5" spec="18px · 300 · 125% · −1%">
            <p className="text-mobile-h5 text-primary">The Internet's Backbone</p>
          </TypeRow>
          <TypeRow label="Mobile / Body Large" spec="16px · 400 · 140%">
            <p className="text-mobile-body-large text-primary">Polygon is a decentralised Ethereum scaling platform.</p>
          </TypeRow>
          <TypeRow label="Mobile / Body" spec="14px · 400 · 140%">
            <p className="text-mobile-body text-primary">Polygon is a decentralised Ethereum scaling platform.</p>
          </TypeRow>
          <TypeRow label="Mobile / Mono" spec="13px · 400 · 110% · +1% · uppercase">
            <p className="text-mobile-mono text-primary">Polygon Technology</p>
          </TypeRow>
          <TypeRow label="Mobile / Mono Small" spec="12px · 400 · 110% · +1% · uppercase">
            <p className="text-mobile-mono-small text-primary">Polygon Technology</p>
          </TypeRow>
        </div>
      </div>
    </section>
  )
}

/* ─── Colors ─────────────────────────────────────────────────────────────────── */
function ColorSwatch({
  name,
  darkValue,
  lightValue,
}: {
  name: string
  darkValue: string
  lightValue: string
}) {
  return (
    <div className="flex gap-4 items-start border-b border-stroke pb-6">
      <div className="shrink-0 w-[200px]">
        <p className="text-desktop-mono-small text-grey-200">{name}</p>
      </div>
      <div className="flex gap-3 flex-1">
        <div className="flex flex-col gap-2 flex-1">
          <div
            className="h-[56px] rounded-[4px] border border-stroke"
            style={{ backgroundColor: darkValue }}
          />
          <p className="text-desktop-mono-small text-grey-300">{darkValue}</p>
          <p className="text-desktop-mono-small text-grey-400">DARK</p>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div
            className="h-[56px] rounded-[4px] border border-stroke"
            style={{ backgroundColor: lightValue }}
          />
          <p className="text-desktop-mono-small text-grey-300">{lightValue}</p>
          <p className="text-desktop-mono-small text-grey-400">LIGHT</p>
        </div>
      </div>
    </div>
  )
}

function AccentSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-[120px] rounded-[4px]" style={{ backgroundColor: value }} />
      <div>
        <p className="text-desktop-mono-small text-primary">{name}</p>
        <p className="text-desktop-mono-small text-grey-200">{value}</p>
      </div>
    </div>
  )
}

function ColorsSection() {
  const themeColors = [
    { name: 'Primary', darkValue: '#FFFFFF', lightValue: '#07060D' },
    { name: 'Inverted Primary', darkValue: '#07060D', lightValue: '#F2F1F5' },
    { name: 'Inverted Primary Hover', darkValue: '#121118', lightValue: '#D0CED6' },
    { name: 'Grey 100', darkValue: '#F2F3F7', lightValue: '#2D2B36' },
    { name: 'Grey 200', darkValue: '#A0A1A6', lightValue: '#888A91' },
    { name: 'Grey 300', darkValue: '#595A5F', lightValue: '#A2A3A5' },
    { name: 'Grey 400', darkValue: '#353535', lightValue: '#BAB9BB' },
    { name: 'Grey 500', darkValue: '#1F1E20', lightValue: '#D7D6D9' },
    { name: 'Grey 500 Hover', darkValue: '#272628', lightValue: '#C4C2C9' },
    { name: 'Grey 600', darkValue: '#141415', lightValue: '#E7E6E8' },
    { name: 'Grey 600 Hover', darkValue: '#1D1D1F', lightValue: '#DCDBDE' },
    { name: 'Stroke', darkValue: '#1B1B1D', lightValue: '#E1E1E5' },
    { name: 'Purple Subtle', darkValue: '#290958', lightValue: '#DDCFF2' },
  ]

  const accentColors = [
    { name: 'Purple', value: '#670DE5' },
    { name: 'Purple Hover', value: '#721FE5' },
    { name: 'Bubble Gum', value: '#E271D7' },
    { name: 'Sky Blue', value: '#00BBFF' },
    { name: 'Neon Green', value: '#00FF08' },
    { name: 'Orange', value: '#FF7421' },
    { name: 'Yellow', value: '#FEE211' },
    { name: 'Blue', value: '#0037C6' },
    { name: 'Semi-transparent Blue', value: '#707BB7' },
    { name: 'Semi-transparent Purple', value: '#C590E5' },
  ]

  return (
    <section>
      <h2 className="text-desktop-h1 text-primary mb-[64px]">Colors</h2>

      <div className="mb-[64px]">
        <p className="text-desktop-mono text-grey-200 mb-[32px]">THEME COLORS</p>
        <p className="text-desktop-body-small text-grey-300 mb-[24px]">
          Each token has distinct dark and light values — they flip automatically when the theme changes.
        </p>
        <div className="flex flex-col gap-6">
          {themeColors.map((c) => (
            <ColorSwatch key={c.name} {...c} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-desktop-mono text-grey-200 mb-[32px]">ACCENT COLORS</p>
        <p className="text-desktop-body-small text-grey-300 mb-[24px]">
          Fixed values — do not change between themes.
        </p>
        <div className="grid grid-cols-5 gap-x-4 gap-y-8">
          {accentColors.map((c) => (
            <AccentSwatch key={c.name} {...c} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Grid ───────────────────────────────────────────────────────────────────── */
function GridSection() {
  return (
    <section>
      <h2 className="text-desktop-h1 text-primary mb-[64px]">Grid</h2>

      {/* Desktop grid */}
      <div className="mb-[64px]">
        <p className="text-desktop-mono text-grey-200 mb-[32px]">DESKTOP — 1440px</p>
        <div className="relative h-[200px] w-full overflow-hidden border border-stroke rounded-[4px]">
          {/* 12 columns: margin 60px each side, gutter 28px, column ~84.33px */}
          <div className="absolute inset-0 flex" style={{ paddingLeft: 60, paddingRight: 60 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-purple/10 h-full flex-1 shrink-0"
                style={{ marginLeft: i === 0 ? 0 : 28 }}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-8 mt-4">
          <p className="text-desktop-mono-small text-grey-200">COLUMNS: 12</p>
          <p className="text-desktop-mono-small text-grey-200">MARGIN: 60px</p>
          <p className="text-desktop-mono-small text-grey-200">GUTTER: 28px</p>
          <p className="text-desktop-mono-small text-grey-200">COLUMN WIDTH: ~84.33px</p>
        </div>
      </div>

      {/* Mobile grid */}
      <div>
        <p className="text-desktop-mono text-grey-200 mb-[32px]">MOBILE — 375px</p>
        <div
          className="relative h-[200px] overflow-hidden border border-stroke rounded-[4px]"
          style={{ width: 375 }}
        >
          {/* 4 columns: margin 16px each side, gutter 16px, column ~73.5px */}
          <div className="absolute inset-0 flex" style={{ paddingLeft: 16, paddingRight: 16 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-purple/10 h-full flex-1 shrink-0"
                style={{ marginLeft: i === 0 ? 0 : 16 }}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-8 mt-4">
          <p className="text-desktop-mono-small text-grey-200">COLUMNS: 4</p>
          <p className="text-desktop-mono-small text-grey-200">MARGIN: 16px</p>
          <p className="text-desktop-mono-small text-grey-200">GUTTER: 16px</p>
          <p className="text-desktop-mono-small text-grey-200">COLUMN WIDTH: ~73.5px</p>
        </div>
      </div>
    </section>
  )
}

/* ─── Spacing ────────────────────────────────────────────────────────────────── */
function SpacerBlock({ height, label }: { height: number; label: string }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-desktop-mono text-grey-200">{label}</p>
      <div
        className="w-full border border-stroke relative"
        style={{ height }}
      >
        <div className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${height === 120 ? 12 : 5}, 1fr)`,
            gap: 0,
          }}
        >
          {Array.from({ length: height === 120 ? 12 : 5 }).map((_, i) => (
            <div key={i} className="bg-inverted-primary/80 border border-stroke" />
          ))}
        </div>
      </div>
      <p className="text-desktop-mono-small text-grey-300">{height}px</p>
    </div>
  )
}

function SpacingSection() {
  return (
    <section>
      <h2 className="text-desktop-h1 text-primary mb-[64px]">Spacing</h2>
      <div className="flex flex-col gap-[48px]">
        <SpacerBlock height={120} label="DESKTOP SPACER" />
        <SpacerBlock height={75} label="MOBILE SPACER" />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify the page renders at http://localhost:3000/style-guide**

Check for:
- Sticky header with "POLYGON / STYLE GUIDE" and the theme toggle button
- All type styles render using PolySans fonts (not a system serif/sans)
- Theme toggle switches colors on click — background flips dark↔light, all tokens update
- Colors section shows 13 theme swatches + 10 accent swatches
- Grid section shows both desktop and mobile grid visualizations
- Spacing section shows both spacer units
- No console errors

- [ ] **Step 3: Commit**

```bash
git add app/style-guide/page.tsx && git commit -m "feat: add /style-guide page with typography, colors, grid, and spacing"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Implemented in |
|------------------|---------------|
| CSS custom properties light/dark | Task 2, globals.css |
| `[data-theme="dark"]` selector | Task 2, globals.css |
| `@theme inline` Tailwind map | Task 2, globals.css |
| All 13 theme color tokens | Task 2, globals.css |
| All 10 accent color tokens | Task 2, globals.css |
| PolySans Slim Wide (headings) | Task 3, layout.tsx |
| PolySans Neutral (body) | Task 3, layout.tsx |
| PolySans NeutralMono (mono) | Task 3, layout.tsx |
| next-themes SSR-safe toggle | Task 3+4 |
| `suppressHydrationWarning` | Task 3, layout.tsx |
| All desktop type utilities | Task 2, globals.css |
| All mobile type utilities | Task 2, globals.css |
| `/style-guide` Typography section | Task 5 |
| `/style-guide` Colors section | Task 5 |
| `/style-guide` Grid section | Task 5 |
| `/style-guide` Spacing section | Task 5 |
| Gradients | Out of scope (next spec) |

**No placeholders present** — all steps contain complete, runnable code.

**Type consistency:** All class names (`text-desktop-h1`, `text-primary`, `bg-grey-600`, `border-stroke`) defined in globals.css Task 2 and used identically in style-guide page Task 5.

---

## Task 6: Write CONTEXT.md and wire it into CLAUDE.md

**Why this task exists:** Any agent starting a fresh session needs to know the design system without re-reading Figma. `CLAUDE.md` is auto-loaded by Claude Code at session start — anything it references via `@file` is loaded too. `CONTEXT.md` becomes the permanent, always-available design system reference.

**Files:**
- Create: `CONTEXT.md`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Create CONTEXT.md**

Create `CONTEXT.md` at the project root:

```markdown
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
```

- [ ] **Step 2: Update CLAUDE.md to reference CONTEXT.md**

Read the current `CLAUDE.md`:

```bash
cat /home/aayushman/projects/polygon-home/CLAUDE.md
```

It currently contains `@AGENTS.md`. Add the CONTEXT reference:

```markdown
@AGENTS.md
@CONTEXT.md
```

- [ ] **Step 3: Verify the reference works**

```bash
cat /home/aayushman/projects/polygon-home/CLAUDE.md
```

Expected output:
```
@AGENTS.md
@CONTEXT.md
```

- [ ] **Step 4: Commit**

```bash
git add CONTEXT.md CLAUDE.md && git commit -m "docs: add CONTEXT.md with full design system reference, wire into CLAUDE.md"
```
