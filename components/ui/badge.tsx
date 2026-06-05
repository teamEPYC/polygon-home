type BadgeProps = {
  text: string
  variant?: 'primary' | 'blue'
}

export function Badge({ text, variant = 'primary' }: BadgeProps) {
  const dotColor = variant === 'blue' ? 'var(--semi-transparent-blue)' : 'var(--neon-green)'
  const borderColor =
    variant === 'blue' ? 'border-[var(--semi-transparent-blue)]' : 'border-primary'
  const textColor =
    variant === 'blue' ? 'text-[rgba(255,255,255,0.7)]' : 'text-primary'

  return (
    <span
      className={`inline-flex items-center gap-[8px] h-[28px] px-[8px] border ${borderColor} rounded-bl-[2px] rounded-br-[2px] rounded-tl-[2px]`}
    >
      <span
        className="size-[6px] rounded-full shrink-0"
        style={{ backgroundColor: dotColor }}
      />
      <span
        className={`text-desktop-mono-small ${textColor} whitespace-nowrap`}
        style={{ fontFeatureSettings: '"dlig" 1' }}
      >
        {text}
      </span>
    </span>
  )
}
