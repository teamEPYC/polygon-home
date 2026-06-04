const GRID_STYLE = {
  backgroundImage:
    'linear-gradient(var(--color-stroke) 1px, transparent 1px), linear-gradient(90deg, var(--color-stroke) 1px, transparent 1px)',
  backgroundSize: '120px 120px',
} as const

export function Spacer() {
  return <div className="h-[120px] w-full bg-background" style={GRID_STYLE} aria-hidden />
}

export function SpacerMobile() {
  return <div className="h-[75px] w-full" aria-hidden />
}
