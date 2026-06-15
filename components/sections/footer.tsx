import type { ReactNode } from 'react'
import Image from 'next/image'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { ScrambleText } from '@/components/ui/scramble-text'

/* ─── Link columns (Figma node 1727:42993 "items") ──────────────────────────
 * Each column is absolutely positioned in the 1440×840 design space. A column
 * may hold one or two title-groups; groups are separated by 64px, links by 18px.
 */
type Group = { title: string; links: string[] }
type Column = { left: number; groups: Group[] }

// Columns + links extracted from the live footer (polygon.technology), 4 columns
// at 240px spacing. Titles render uppercase via text-desktop-mono-medium.
const COLUMNS: Column[] = [
  {
    left: 0,
    groups: [
      {
        title: 'Solutions by Polygon',
        links: [
          'Polygon Chain',
          'Crosschain Interop',
          'Wallet Infrastructure',
          'On-/Off- Ramps',
          'Polygon CDK',
          'Polygon Agglayer',
          'Polygon Vaultbridge',
        ],
      },
      {
        title: 'Incubations',
        links: ['Miden', 'Billions', 'Zisk', 'Katana'],
      },
    ],
  },
  {
    left: 240,
    groups: [
      {
        title: 'Use Cases',
        links: ['Payments', 'RWAs', 'Stablecoins'],
      },
      {
        title: 'Resources',
        links: ['Blog', 'Payments Knowledge Base', 'POL Whitepaper', 'Plonky 3', 'ZK Research'],
      },
      {
        title: 'Legal',
        links: ['Legal Terms Home', 'Terms of Use', 'Privacy Policy'],
      },
    ],
  },
  {
    left: 480,
    groups: [
      {
        title: 'Dev Community',
        links: ['Docs', 'Events', 'Support', 'Forum', 'Governance', 'Github', 'Security', 'Faucet'],
      },
    ],
  },
  {
    left: 720,
    groups: [
      {
        title: 'Company',
        links: ['About Polygon', 'Careers', 'Contact', 'Brand Guidelines', 'POL Token'],
      },
      {
        title: 'Use Polygon',
        links: ['Airdrops', 'Ecosystem', 'Polygon Scan', 'Staking', 'Portal'],
      },
    ],
  },
]

const SOCIALS: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: 'X (Twitter)',
    href: 'https://twitter.com/0xPolygon',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M17.53 3h3.2l-7 8 8.23 10.9h-6.44l-5.05-6.6-5.77 6.6H1.5l7.48-8.55L1.6 3h6.6l4.56 6.03L17.53 3Zm-1.12 16.98h1.77L7.7 4.92H5.8l10.6 15.06Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/polygon',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M20.3 4.9A19.8 19.8 0 0 0 15.4 3.4l-.25.5a18.3 18.3 0 0 1 5.3 1.7 18.5 18.5 0 0 0-14.9 0 18.3 18.3 0 0 1 5.3-1.7l-.25-.5A19.8 19.8 0 0 0 3.7 4.9C1.6 8 .9 11.6 1.2 15.1a19.9 19.9 0 0 0 6 3l.8-1.1c-1-.37-1.94-.84-2.8-1.4l.7-.5a14.2 14.2 0 0 0 12.2 0l.7.5c-.86.56-1.8 1.03-2.8 1.4l.8 1.1a19.9 19.9 0 0 0 6-3c.4-4.1-.65-7.7-2.7-10.2ZM8.5 13c-.95 0-1.7-.88-1.7-1.96 0-1.08.74-1.96 1.7-1.96.96 0 1.72.88 1.7 1.96 0 1.08-.74 1.96-1.7 1.96Zm7 0c-.95 0-1.7-.88-1.7-1.96 0-1.08.74-1.96 1.7-1.96.96 0 1.72.88 1.7 1.96 0 1.08-.74 1.96-1.7 1.96Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: 'Telegram',
    href: 'https://t.me/polygonofficial',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M21.94 4.3 18.6 19.1c-.25 1.1-.9 1.38-1.83.86l-5.05-3.72-2.44 2.35c-.27.27-.5.5-1 .5l.36-5.1 9.3-8.4c.4-.36-.09-.56-.62-.2L5.4 12.9.46 11.36c-1.07-.34-1.1-1.07.22-1.58L20.55 2.9c.9-.33 1.68.2 1.39 1.4Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: 'Reddit',
    href: 'https://reddit.com/r/0xPolygon',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M22 12.1c0-1.2-.98-2.18-2.2-2.18-.6 0-1.13.24-1.53.62a10.7 10.7 0 0 0-5.6-1.77l.95-4.5 3.13.66a1.56 1.56 0 1 0 .16-.94l-3.5-.74a.4.4 0 0 0-.47.3l-1.06 5a10.7 10.7 0 0 0-5.68 1.77 2.18 2.18 0 1 0-2.4 3.56 4.3 4.3 0 0 0-.05.66c0 3.35 3.9 6.06 8.72 6.06 4.82 0 8.72-2.71 8.72-6.06 0-.22-.02-.44-.05-.65A2.18 2.18 0 0 0 22 12.1ZM7.2 13.66a1.56 1.56 0 1 1 3.12 0 1.56 1.56 0 0 1-3.12 0Zm8.7 4.12c-1.07 1.07-3.1 1.15-3.7 1.15-.6 0-2.63-.08-3.7-1.15a.4.4 0 0 1 .57-.57c.67.67 2.11.91 3.13.91 1.02 0 2.46-.24 3.13-.91a.4.4 0 1 1 .57.57Zm-.27-2.56a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/0xPolygon',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/0xpolygon',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16.7" cy="7.3" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
]

// Content sits inside the 60px page margins; the grid spans the full canvas.
const PAD = 60
// Left margin for the link columns / logo / copyright. Live insets them 37px from
// the footer edge (columns at 37/277/517/756), tighter than the 60px PAD, so they
// sit just inside the link-block border.
const CONTENT_LEFT = 37

export function Footer() {
  return (
    <footer className="w-full bg-inverted-primary" style={{ containerType: 'inline-size' }}>
      <div className="relative w-full" style={{ aspectRatio: '1440 / 840' }}>
        {/* Fixed 1440×840 design stage, scaled to the footer width */}
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: 1440, height: 840, transform: 'scale(calc(100cqw / 1440px))' }}
        >
          {/* Background grid — uniform 12×7 grid of 120px cells. The link block
              spans cols 0–7, rows 1–5 (x0–960, y120–720): those cells get NO
              per-cell border (no horizontal lines through the links). The block
              keeps its outer border + the 3 vertical column dividers (at the 240 /
              480 / 720 grid lines, aligned with every other section's grid). */}
          <div className="absolute inset-0 z-[1]">
            {Array.from({ length: 7 }).flatMap((_, row) =>
              Array.from({ length: 12 }).map((__, col) => {
                const isLinkCell = col <= 7 && row >= 1 && row <= 5;
                return (
                  <div
                    key={`${col}-${row}`}
                    className={`absolute bg-inverted-primary ${isLinkCell ? "" : "border border-stroke"}`}
                    style={{ left: col * 120, top: row * 120, width: 120, height: 120 }}
                  />
                );
              }),
            )}
            {/* Outer border of the link block */}
            <div
              className="absolute border border-stroke"
              style={{ left: 0, top: 120, width: 8 * 120, height: 5 * 120 }}
              aria-hidden
            />
            {/* Vertical dividers between the 4 columns, on the 120px grid */}
            {[240, 480, 720].map((x) => (
              <div
                key={`vdiv-${x}`}
                className="absolute border-l border-stroke"
                style={{ left: x, top: 120, height: 5 * 120 }}
                aria-hidden
              />
            ))}
          </div>

          {/* Top row: logo + theme switcher + socials */}
          <div className="absolute left-0 top-0 z-[4] h-[120px] w-full">
            {/* Opaque mask (footer fill) over the logo cell, hiding the WHOLE
                vertical grid line that runs through the logo (full top-row height,
                y1–119) while leaving the horizontal lines at y0 / y120 intact. */}
            <div
              className="absolute bg-inverted-primary pointer-events-none"
              style={{ left: 54, top: 1, width: 132, height: 118 }}
              aria-hidden
            />
            {/* Logo — centered in its grid cell (x 0–240, on the x120 line),
                vertically centred in the 120px top row. */}
            <div className="absolute" style={{ left: 60, top: 46 }}>
              <Image src="/assets/polygon-logo.svg" alt="Polygon" width={120} height={28} />
            </div>
            {/* Mask over the theme-switcher cell, hiding the vertical grid line
                (x=360) that runs through the switcher — same treatment as the logo. */}
            <div
              className="absolute bg-inverted-primary pointer-events-none"
              style={{ left: 292, top: 1, width: 138, height: 118 }}
              aria-hidden
            />
            {/* Theme switcher — centered in its grid cell (x 240–480) */}
            <div className="absolute" style={{ left: 298, top: 30 }}>
              <ThemeSwitcher />
            </div>
            {/* Mask over the socials cells, hiding the vertical grid lines
                (x=1080/1200/1320) that run through the icons — same treatment
                as the logo and theme switcher. */}
            <div
              className="absolute bg-inverted-primary pointer-events-none"
              style={{ left: 1006, top: 1, width: 380, height: 118 }}
              aria-hidden
            />
            {/* Socials — right-aligned to the content edge (x=1380) */}
            <div className="absolute flex gap-[44px]" style={{ left: PAD + 956, top: 48 }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-grey-200 hover:text-primary transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="absolute left-0 z-[3]" style={{ top: 120 }}>
            {COLUMNS.map((col) => (
              <div
                key={col.left}
                className="absolute flex flex-col gap-[64px]"
                style={{ left: CONTENT_LEFT + col.left, top: 28, width: 200 }}
              >
                {col.groups.map((group) => (
                  <div key={group.title} className="flex flex-col gap-[18px]">
                    {/* Column title — live: mono 14px / 0.14px / uppercase / white */}
                    <p className="text-desktop-mono-medium text-primary">{group.title}</p>
                    {group.links.map((link) => (
                      <a
                        key={link}
                        href="#"
                        /* Link — live: body 12px / 14.4px (1.2) / 400 / normal / grey-200. All identical. */
                        className="scramble-host font-body text-[12px] font-[400] leading-[1.2] tracking-normal text-grey-200 hover:text-grey-100 transition-colors w-fit"
                      >
                        <ScrambleText>{link}</ScrambleText>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="absolute left-0 z-[2] flex h-[120px] w-full items-center" style={{ top: 720 }}>
            <p className="text-desktop-mono-small text-grey-200" style={{ marginLeft: CONTENT_LEFT }}>
              © 2025 Polygon Labs UI (Cayman) Ltd. All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
