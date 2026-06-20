// The spacer must scale with the viewport exactly like the sections' grids,
// which are drawn on a 1440 canvas (12 cols of 120px) scaled by 100cqw/1440.
// Using fixed 120px here meant the spacer's grid stayed 120px while the section
// grids shrank below 1440 — so cell sizes and vertical lines drifted apart.
// Instead, derive everything from the spacer's own width with relative units:
//   • aspect-ratio 12/1 → height is always one grid cell (width / 12)
//   • background-size  → cell width = 100%/12 (= one of 12 columns), so the
//     vertical lines land on the exact same x as every adjacent section.
const GRID_STYLE = {
  aspectRatio: '12 / 1',
  backgroundImage:
    'linear-gradient(var(--color-stroke) 1px, transparent 1px), linear-gradient(90deg, var(--color-stroke) 1px, transparent 1px)',
  backgroundSize: 'calc(100% / 12) 100%',
} as const

export function Spacer() {
  return (
    // Desktop-only grid spacer (one grid row tall). On mobile (≤767px) sections
    // abut directly — live has no grid spacer between them — so hide it below md.
    <div className="relative hidden w-full bg-background md:block" style={GRID_STYLE} aria-hidden>
      {/* Right-edge vertical line — the column grid paints lines at 0…11/12 but
          never reaches the far edge, so add it explicitly to match the adjacent
          sections' right border. */}
      <div className="absolute right-0 top-0 h-full w-px bg-stroke" />
    </div>
  )
}

export function SpacerMobile() {
  return <div className="h-[75px] w-full" aria-hidden />
}
