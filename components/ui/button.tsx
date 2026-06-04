type ButtonProps = {
  label: string
  href?: string
  variant?: 'primary' | 'ghost' | 'purple'
}

const CUT = 14

const clipPath = `polygon(0 0, calc(100% - ${CUT}px) 0, 100% ${CUT}px, 100% 100%, 0 100%)`

function ArrowIcon({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path d="M3 9L9 3M9 3H4M9 3V8" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Button({ label, href = '#', variant = 'primary' }: ButtonProps) {
  const styles = {
    primary: {
      bg: 'bg-primary',
      text: 'text-purple',
      arrowColor: 'var(--color-purple)',
    },
    ghost: {
      bg: 'bg-inverted-primary',
      text: 'text-grey-100',
      arrowColor: 'var(--color-grey-100)',
    },
    purple: {
      bg: 'bg-purple hover:bg-purple-hover',
      text: 'text-primary',
      arrowColor: 'var(--color-primary)',
    },
  }[variant]

  return (
    <a
      href={href}
      className={`inline-flex items-center h-[52px] pl-[16px] pr-[28px] gap-[8px] transition-opacity hover:opacity-90 ${styles.bg} ${styles.text}`}
      style={{ clipPath }}
    >
      <span className="text-desktop-mono-small">{label}</span>
      {variant !== 'ghost' && <ArrowIcon color={styles.arrowColor} />}
    </a>
  )
}
