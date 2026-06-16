type EyebrowProps = {
  text: string
  className?: string
  borderColor?: 'stroke' | 'primary' | 'grey-100' | 'grey-200' | 'semi-transparent-blue' | 'white' | 'white-full'
  textColor?: 'primary' | 'grey-100' | 'white-70' | 'white'
  hasDot?: boolean
  /** Override the label type scale. Defaults to desktop mono-medium (14px);
   *  pass e.g. `text-mobile-mono-small` for the 12px mobile eyebrow. */
  textSize?: string
}

export function Eyebrow({
  text,
  className,
  borderColor = 'primary',
  textColor = 'primary',
  hasDot = false,
  textSize = 'text-desktop-mono-medium',
}: EyebrowProps) {
  const borderClass = {
    stroke: 'border-stroke',
    primary: 'border-primary',
    'grey-100': 'border-grey-100',
    'grey-200': 'border-grey-200',
    'semi-transparent-blue': 'border-[var(--semi-transparent-blue)]',
    white: 'border-[rgba(255,255,255,0.5)]',
    'white-full': 'border-white',
  }[borderColor]

  const textClass = {
    primary: 'text-primary',
    'grey-100': 'text-grey-100',
    'white-70': 'text-[rgba(255,255,255,0.7)]',
    white: 'text-white',
  }[textColor]

  return (
    <div
      className={`relative inline-flex items-center gap-[10px] h-[32px] px-[12px] py-[8px] border ${borderClass} rounded-[2px] ${className ?? ''}`}
    >
      {hasDot && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="shrink-0">
          <circle cx="5" cy="4" r="3" fill="currentColor" className={textClass} />
        </svg>
      )}
      <span className={`${textSize} ${textClass} whitespace-nowrap pt-[2px]`}>
        {text}
      </span>
      {/* Top-left corner tick (filled triangle) */}
      <span className={`absolute top-0 left-0 size-[6px] pointer-events-none ${textClass}`}>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
          <path d="M0 0H6L0 6V0Z" fill="currentColor" />
        </svg>
      </span>
      {/* Bottom-right corner tick (filled triangle) */}
      <span className={`absolute bottom-0 right-0 size-[6px] pointer-events-none ${textClass}`}>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
          <path d="M6 6H0L6 0V6Z" fill="currentColor" />
        </svg>
      </span>
    </div>
  )
}
