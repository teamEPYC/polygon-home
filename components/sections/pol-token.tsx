import { Eyebrow } from '@/components/ui/eyebrow'
import { CoinVideoPlayer } from '@/components/ui/coin-video-player'

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

export function PolToken() {
  return (
    <section
      className="relative w-full overflow-hidden bg-inverted-primary"
      style={{ containerType: 'inline-size' }}
    >
      {/* Fixed 1440×816 design stage, scaled to the section width (scale-to-fit).
          The %-based positions resolve against the 1440 stage and the fixed-px
          text now scales with it, instead of staying full size below 1440. */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1440 / 816' }}>
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
    </section>
  )
}
