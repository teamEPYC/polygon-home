'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ScrambleText } from '@/components/ui/scramble-text'

/* ──────────────────────────────────────────────────────────────────────────
 * Polygon in the news — single-video carousel (Figma node 1727:42564).
 *
 * Built on the fixed 1440×840 design-stage pattern (containerType inline-size +
 * a 1440×840 absolute stage scaled by transform: scale(100cqw / 1440px)), so all
 * absolute px coordinates below are pixel-accurate against the Figma frame and
 * scale down responsively.
 *
 * NOTE: Figma get_design_context coordinates are horizontally mirrored vs the
 * actual render. All coordinates here are in VISUAL space (already un-mirrored
 * via x_visual = 1440 - x_code - width) to match the reference screenshot.
 * ────────────────────────────────────────────────────────────────────────── */

const NEWS_ITEMS = [
  {
    url: 'https://www.youtube.com/watch?v=PN4jcLeXqOw',
    thumbnail: '/assets/news-thumb-1.avif',
    alt: 'Polygon in the news — clip 1',
  },
  {
    url: 'https://www.youtube.com/watch?v=biCLIAwl8Dk',
    thumbnail: '/assets/news-thumb-2.avif',
    alt: 'Polygon in the news — clip 2',
  },
  {
    url: 'https://www.youtube.com/watch?v=YlFCbwSIMF4',
    thumbnail: '/assets/news-thumb-3.avif',
    alt: 'Polygon in the news — clip 3',
  },
]

const TOTAL = NEWS_ITEMS.length

/* Solid grid cells (theme-aware: bg-inverted-primary + border-stroke).
 * Visual space. Full top row + a solid block on the left + heading backing. */
const SOLID_CELLS: [number, number, number, number][] = [
  // Top row @ y=0 (full width)
  ...Array.from({ length: 12 }, (_, i) => [i * 120, 0, 120, 120] as [number, number, number, number]),
  // Left solid block, rows y=120..720, x 0..600
  ...[120, 240, 360, 480, 600, 720].flatMap((y) =>
    [0, 120, 240, 360, 480].map((x) => [x, y, 120, 120] as [number, number, number, number]),
  ),
]

/* Faint grid cells (theme-aware via var(--grid-stroke)). Fill the remainder of
 * rows y=120..720 to the right of the solid block (x 600..1320). */
const FAINT_CELLS: [number, number, number, number][] = [120, 240, 360, 480, 600, 720].flatMap((y) =>
  [600, 720, 840, 960, 1080, 1200, 1320].map((x) => [x, y, 120, 120] as [number, number, number, number]),
)

/* 3-segment progress bar. Visual x: 60, 192, 324; y=322; each 120×2. */
const SEGMENTS = [60, 192, 324]

export function NewsSlider() {
  const [current, setCurrent] = useState(0) // 0-based active slide

  const handlePrev = () => setCurrent((c) => (c - 1 + TOTAL) % TOTAL)
  const handleNext = () => setCurrent((c) => (c + 1) % TOTAL)

  const item = NEWS_ITEMS[current]

  return (
    <section className="w-full bg-inverted-primary" style={{ containerType: 'inline-size' }}>
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1440 / 840' }}>
        {/* Fixed 1440×840 design stage, scaled to the section width */}
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: 1440, height: 840, transform: 'scale(calc(100cqw / 1440px))' }}
        >
          {/* Faint grid (behind everything) */}
          <div className="absolute inset-0 z-[1]">
            {FAINT_CELLS.map(([x, y, w, h]) => (
              <div
                key={`f-${x}-${y}`}
                className="absolute"
                style={{ left: x, top: y, width: w, height: h, border: '1px solid var(--grid-stroke)' }}
              />
            ))}
          </div>

          {/* Pink gradient glow — behind the video. Code: 840×720, visual x 600, top 120. */}
          <div
            className="absolute z-[2] mix-blend-screen"
            style={{ left: 600, top: 80, width: 840, height: 720 }}
          >
            <Image
              src="/assets/news/bg-gradient.svg"
              alt=""
              fill
              className="object-cover"
              aria-hidden
            />
          </div>

          {/* Large video preview — bleeds off the right edge.
              Visual: left 720, width 853, vertical center y=360+60=... → top 240, h 480. */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.alt}
            className="absolute z-[5] block overflow-hidden rounded-[4px]"
            style={{ left: 600, top: 160, width: 853, height: 480 }}
          >
            <Image
              key={item.thumbnail}
              src={item.thumbnail}
              alt={item.alt}
              fill
              className="object-cover"
              sizes="853px"
              priority
            />

            {/* Pink gradient panel behind the play button (video lower-left). */}
            <span
              className="absolute"
              style={{
                left: 18,
                top: 300,
                width: 120,
                height: 120,
                background:
                  'radial-gradient(120% 120% at 0% 100%, var(--bubble-gum) 0%, rgba(226,113,215,0.35) 55%, rgba(226,113,215,0) 100%)',
              }}
              aria-hidden
            />

            {/* Play button — dark cut-corner box with a white play arrow. */}
            <span
              className="absolute flex items-center justify-center bg-inverted-primary"
              style={{
                left: 30,
                top: 322,
                width: 76,
                height: 72,
                clipPath: 'polygon(0 0, 100% 0, 100% 76%, 84% 100%, 0 100%)',
              }}
              aria-hidden
            >
              <svg width="20" height="24" viewBox="0 0 10 17" fill="none">
                <path
                  d="M9.6 7.53a1.2 1.2 0 0 1 0 1.7L1.97 16.44C1.22 17.14 0 16.61 0 15.59V1.17C0 .15 1.22-.38 1.97.32L9.6 7.53Z"
                  className="fill-primary"
                />
              </svg>
            </span>
          </a>

          {/* Heading backing rect (solid block under heading) + solid grid.
              Drawn above the gradient so the top-left stays solid. */}
          <div className="absolute inset-0 z-[6] pointer-events-none">
            {SOLID_CELLS.map(([x, y, w, h]) => (
              <div
                key={`s-${x}-${y}`}
                className="absolute border border-stroke bg-inverted-primary"
                style={{ left: x, top: y, width: w, height: h }}
              />
            ))}
          </div>

          {/* Heading — top-left, indent 120px on first line. Visual x 60, y 136. */}
          <h2
            className="absolute z-[8] text-desktop-h2-indent text-grey-100"
            style={{ left: 60, top: 136, width: 480 }}
          >
            Polygon in the news.
          </h2>

          {/* Counter eyebrow (1/3) — in the heading first-line indent gap.
              Visual x ~68, y 152. Small bordered pill with corner triangles. */}
          <div
            className="absolute z-[9] inline-flex h-[32px] items-center justify-center rounded-[2px] border border-grey-200 bg-inverted-primary px-[12px]"
            style={{ left: 60, top: 152 }}
          >
            <span className="text-desktop-mono-small pt-px text-grey-200">
              {current + 1}/{TOTAL}
            </span>
            {/* top-left corner triangle */}
            <span className="absolute left-0 top-0 size-[6px] text-grey-200">
              <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                <path d="M0 0H6L0 6V0Z" fill="currentColor" />
              </svg>
            </span>
            {/* bottom-right corner triangle */}
            <span className="absolute bottom-0 right-0 size-[6px] text-grey-200">
              <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                <path d="M6 6H0L6 0V6Z" fill="currentColor" />
              </svg>
            </span>
          </div>

          {/* 3-segment progress bar. Visual x 60/192/324, y 322, 120×2.
              Active segment shows a partial bright fill; others are faint. */}
          {SEGMENTS.map((x, i) => {
            const isActive = i === current
            const isPast = i < current
            return (
              <div
                key={`seg-${x}`}
                className="absolute z-[8] h-[2px] w-[120px] overflow-hidden bg-grey-400/40"
                style={{ left: x, top: 322 }}
              >
                <div
                  className="h-full bg-primary"
                  style={{ width: isPast ? '100%' : isActive ? '66%' : '0%' }}
                />
              </div>
            )
          })}

          {/* PREV / NEXT navigation — lower-left. Visual PREV x 256, NEXT x 376, y 496. */}
          <div className="absolute z-[8] flex items-center gap-[24px]" style={{ left: 130, top: 496 }}>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous news item"
              className="scramble-host text-desktop-mono-small flex items-center gap-[8px] text-grey-200 transition-colors hover:text-grey-100"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M7 2.5 3.5 6 7 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <ScrambleText>PREV</ScrambleText>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next news item"
              className="scramble-host text-desktop-mono-small flex items-center gap-[8px] text-grey-100 transition-colors hover:text-grey-200"
            >
              <ScrambleText>NEXT</ScrambleText>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M5 2.5 8.5 6 5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
