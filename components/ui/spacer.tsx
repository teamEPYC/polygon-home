const GRID_STYLE = {
  backgroundImage:
    'linear-gradient(var(--color-stroke) 1px, transparent 1px), linear-gradient(90deg, var(--color-stroke) 1px, transparent 1px)',
  backgroundSize: '120px 120px',
} as const

export function Spacer() {
  return (
    // Desktop-only 120px grid spacer. On mobile (≤767px) sections abut directly
    // — live has no grid spacer between them — so hide it below md.
    <div className="relative hidden h-[120px] w-full bg-background md:block" style={GRID_STYLE} aria-hidden>
      {/* Right-edge vertical line — the 120px background grid paints lines at
          0…1320 but never reaches x=1440, so add it explicitly to match the
          adjacent sections' right border. */}
      <div className="absolute right-0 top-0 h-full w-px bg-stroke" />
    </div>
  )
}

export function SpacerMobile() {
  return <div className="h-[75px] w-full" aria-hidden />
}
