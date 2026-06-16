import { Eyebrow } from '@/components/ui/eyebrow'
import { CoinVideoPlayer } from '@/components/ui/coin-video-player'
import { MobileStage } from '@/components/ui/stage'

// Faint 120px grid squares on the right half (Figma node 1727:42516 "Grid").
// Coordinates are in the 1440×816 design space.
const gridCells: { left: number; top: number }[] = [
  // Row @ top: 456px
  ...[600, 720, 840, 960, 1080, 1200, 1320].map((left) => ({ left, top: 456 })),
  // Row @ 576px
  ...[480, 600, 720, 840, 960, 1080, 1200, 1320].map((left) => ({ left, top: 576 })),
  // Row @ 696px
  ...[360, 480, 600, 720, 840, 960, 1080, 1200, 1320].map((left) => ({
    left,
    top: 696,
  })),
]

// Mobile (≤767px) — extracted live @375 canvas (see MOBILE block below).
const MOBILE_H = 614 // live .section.is-card-coin height @375
const M_VIDEO_H = 320 // live .h-coin-video-container height
const M_GAP = 32 // live column gap (2rem) between video and heading-wrap
const M_LEFT = 16 // live --site--margin (≈1rem) @375

export function PolToken() {
  return (
    <section
      className="relative w-full overflow-hidden bg-inverted-primary"
      style={{ containerType: 'inline-size' }}
    >
      {/* DESKTOP (≥768px) — fixed 1440×816 design stage, scaled to the section
          width (scale-to-fit). Unchanged. The %-based positions resolve against
          the 1440 stage and the fixed-px text scales with it. */}
      <div
        className="relative hidden w-full overflow-hidden md:block"
        style={{ aspectRatio: '1440 / 816' }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: 1440, height: 816, transform: 'scale(calc(100cqw / 1440px))' }}
        >
      {/* Coin loop video — full bleed */}
      <CoinVideoPlayer />

      {/* Faint grid on the right */}
      <div className="absolute inset-0 z-[2]">
        {gridCells.map(({ left, top }) => (
          <div
            key={`${left}-${top}`}
            className="absolute border border-stroke bg-inverted-primary"
            style={{
              left: `${(left / 1440) * 100}%`,
              top: `${(top / 816) * 100}%`,
              width: `${(120 / 1440) * 100}%`,
              height: `${(120 / 816) * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Top-left corner cut (Figma node 1727:42531 "corner") — filled upper-left
          triangle with the diagonal running top-right → bottom-left, so the coin
          video shows through the lower-right. */}
      <svg
        className="absolute left-0 top-0 z-[2]"
        style={{
          width: `${(120 / 1440) * 100}%`,
          height: `${(120 / 816) * 100}%`,
        }}
        viewBox="0 0 121.707 121.707"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden
      >
        <path
          d="M120.5 0.5H0.5V120.5L120.5 0.5Z"
          fill="var(--color-inverted-primary)"
          stroke="var(--color-stroke)"
        />
      </svg>

      {/* Heading + eyebrow (Figma: heading x=734 y=528, indent 120px) */}
      <div
        className="absolute z-20"
        style={{ left: `${(734 / 1440) * 100}%`, top: `${(528 / 816) * 100}%` }}
      >
        <h2 className="text-desktop-h2-indent text-primary">
          Powered by
          <br />
          $POL.
        </h2>
      </div>

      {/* Eyebrow sits in the heading's first-line indent gap */}
      <div
        className="absolute z-20"
        style={{ left: `${(686 / 1440) * 100}%`, top: `${(544 / 816) * 100}%` }}
      >
        <Eyebrow text="TOKEN" borderColor="grey-200" textColor="primary" />
      </div>

      {/* Body text (Figma: x=734 y=704 width=375) */}
      <p
        className="absolute z-20 text-desktop-body-large"
        style={{
          left: `${(734 / 1440) * 100}%`,
          top: `${(704 / 816) * 100}%`,
          width: `${(375 / 1440) * 100}%`,
        }}
      >
        <span className="text-primary">
          $POL powers Polygon as the native gas and staking token,{' '}
        </span>
        <span className="text-grey-200">
          that secures the network and enables users to access thousands of apps.
          A token with real utility.
        </span>
      </p>
        </div>
      </div>

      {/* MOBILE (≤767px) — 375 canvas. Live `.section.is-card-coin` becomes a
          vertical flex column (aspect-ratio:auto, gap 2rem): full-bleed coin
          video (320px) on top, then the heading-wrap (TOKEN eyebrow + "Powered
          by $POL" + body + Stake now CTA). Extracted live @375:
            • section height 614; video 320×375 (full bleed), corner-clipped
              top-left to match the desktop cut (CSS polygon — see note below).
            • headwrap left 16 (--site--margin ≈ 1rem), top 352 (= video 320 +
              32px column gap). eyebrow @top355 (h30); h2 @top365 (32px/1.06,
              -0.02em, weight 300); para @top448 w326 (16px); CTA @top554
              (118×46, purple btn-new, 13px label + play-triangle arrow).
          ──────────────────────────────────────────────────────────────────── */}
      <div className="md:hidden" style={{ containerType: 'inline-size' }}>
        <MobileStage height={MOBILE_H}>
          {/* Coin video — full bleed, 320px tall, clipped to the top-left
              corner cut. Live's #cornerClip (M120 0…V120L120 0) is an
              objectBoundingBox path that didn't apply here, so we use an
              equivalent CSS polygon: cut spans 120/1440 of width (8.333%) ×
              120/816 of height (14.706%). */}
          <div
            className="absolute left-0 top-0 z-[1] w-full overflow-hidden"
            style={{
              height: M_VIDEO_H,
              clipPath:
                'polygon(8.333% 0, 100% 0, 100% 100%, 0 100%, 0 14.706%)',
            }}
          >
            <CoinVideoPlayer />
          </div>

          {/* Heading-wrap — left 16, starts 32px below the video. Live nests
              [eyebrow+h2] (heading-wrap, h70) then para then CTA. The eyebrow
              sits in the heading's first-line indent (like desktop): line 1
              "Powered" is indented past the eyebrow, "by $POL" is full-left. */}
          <div
            className="absolute z-20"
            style={{ left: M_LEFT, top: M_VIDEO_H + M_GAP, width: 375 - M_LEFT }}
          >
            {/* Heading block (eyebrow overlaid in line-1 indent). Live h70. */}
            <div className="relative" style={{ height: 70 }}>
              {/* TOKEN eyebrow — 8px padding, 12px mono, grey-200 border +
                  corner triangle ticks (h-eyebrow-container @375). */}
              <div className="absolute left-0 top-0 inline-flex h-[30px] items-center gap-[10px] rounded-[2px] border border-grey-200 bg-inverted-primary px-[8px] py-[8px]">
                <span
                  className="text-primary uppercase"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 400,
                    fontSize: 12,
                    lineHeight: 1,
                    letterSpacing: '0.12px',
                  }}
                >
                  TOKEN
                </span>
                <span className="pointer-events-none absolute left-0 top-0 size-[6px] text-primary">
                  <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                    <path d="M0 0H6L0 6V0Z" fill="currentColor" />
                  </svg>
                </span>
                <span className="pointer-events-none absolute bottom-0 right-0 size-[6px] text-primary">
                  <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                    <path d="M6 6H0L6 0V6Z" fill="currentColor" />
                  </svg>
                </span>
              </div>

              {/* Heading — live: 32px / 33.92 lh / -0.64px ls / weight 300.
                  Line 1 ("Powered") indented past the eyebrow via leading
                  spaces; line 2 ("by $POL") full-left. */}
              <h2
                className="absolute left-0 top-0 text-primary"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 300,
                  fontSize: 32,
                  lineHeight: '33.92px',
                  letterSpacing: '-0.64px',
                }}
              >
                <span className="inline-block" style={{ width: 90 }} />Powered
                <br />
                by $POL
              </h2>
            </div>

            {/* Body copy — 16px / 22.4 lh, width 326, white first span + grey-200
                tail. Sits 13px below the heading block (live para t6096). */}
            <p
              className="text-primary"
              style={{
                marginTop: 26,
                width: 326,
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 16,
                lineHeight: '22.4px',
              }}
            >
              $POL powers Polygon as the native gas and staking token
              <span className="text-grey-200">
                {' '}
                that secures the network and enables users to access thousands of
                apps. A token with real utility.
              </span>
            </p>

            {/* Stake now CTA — live `.btn-new`: purple #670DE5, white text,
                cut-corner, 13px mono label + play-triangle. 15px below para. */}
            <a
              href="https://staking.polygon.technology/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-[27px] inline-flex items-center gap-[10px] bg-purple text-white transition-colors hover:bg-purple-hover"
              style={{ padding: '15px 12px', clipPath: 'url(#buttonClip)' }}
            >
              <span
                className="uppercase"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 400,
                  fontSize: 13,
                  lineHeight: 1.2,
                  letterSpacing: '0.13px',
                }}
              >
                Stake now
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                <path
                  d="M7.86511 5.38649C8.07403 5.5838 8.07403 5.9162 7.86511 6.11351L4.59331 9.20354C4.27444 9.50469 3.75 9.27863 3.75 8.84003L3.75 2.65997C3.75 2.22137 4.27444 1.99531 4.59331 2.29646L7.86511 5.38649Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </MobileStage>
      </div>
    </section>
  )
}
