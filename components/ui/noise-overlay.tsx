export function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 9999,
        opacity: 0.09,
        mixBlendMode: 'color-dodge',
        backgroundImage: 'url(/assets/grain-overlay.gif)',
        backgroundPosition: '0 0',
        backgroundSize: '120px',
      }}
    />
  )
}
