type BtnOutlineProps = {
  href?: string
  variant?: 'default' | 'white'
  className?: string
}

export function BtnOutline({ href = '#', variant = 'default', className }: BtnOutlineProps) {
  const borderColor = variant === 'white' ? 'border-primary' : 'border-[rgba(255,255,255,0.4)]'
  const arrowColor =
    variant === 'white' ? 'var(--color-primary)' : 'rgba(255,255,255,0.6)'

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center w-[44px] h-[36px] border ${borderColor} rounded-[2px] hover:opacity-80 transition-opacity ${className ?? ''}`}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M2 10L10 2M10 2H4M10 2V8"
          stroke={arrowColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}
