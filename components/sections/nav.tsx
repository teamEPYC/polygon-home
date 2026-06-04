import Image from 'next/image'

const NAV_LINKS = [
  { label: 'Products', hasNew: true },
  { label: 'Developers' },
  { label: 'Use Polygon' },
  { label: 'Company' },
  { label: 'Blog' },
]

const CUT = 14
const clipPath = `polygon(0 0, calc(100% - ${CUT}px) 0, 100% ${CUT}px, 100% 100%, 0 100%)`

function NewBadge() {
  return (
    <span className="inline-flex items-center justify-center size-[16px] shrink-0">
      <Image src="/assets/ico-new.svg" alt="" width={16} height={16} unoptimized />
    </span>
  )
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path
        d="M3 9L9 3M9 3H4M9 3V8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[52px] bg-inverted-primary">
      <div className="relative max-w-[1440px] mx-auto h-full">
      {/* Logo */}
      <div className="absolute left-[48px] top-[13px]">
        <Image
          src="/assets/polygon-logo.svg"
          alt="Polygon"
          width={112}
          height={26}
          priority
          unoptimized
        />
      </div>

      {/* Center nav links */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[32px] h-[52px] px-[32px] border border-stroke">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href="#"
            className="flex items-center gap-[4px] text-desktop-mono-small text-grey-100 hover:text-primary transition-colors whitespace-nowrap"
          >
            {link.label}
            {link.hasNew && <NewBadge />}
          </a>
        ))}
      </div>

      {/* Right CTAs */}
      <div className="absolute right-0 top-0 flex items-center">
        {/* STAKE POL ghost */}
        <a
          href="#"
          className="inline-flex items-center h-[52px] px-[23px] text-desktop-mono-small text-grey-100 bg-inverted-primary hover:opacity-80 transition-opacity whitespace-nowrap"
          style={{ clipPath }}
        >
          STAKE POL
        </a>
        {/* BUILD ON POLYGON primary */}
        <a
          href="#"
          className="inline-flex items-center gap-[8px] h-[52px] pl-[16px] pr-[32px] bg-purple hover:bg-purple-hover text-background transition-colors whitespace-nowrap"
          style={{ clipPath }}
        >
          <span className="text-desktop-mono-small">BUILD ON POLYGON</span>
          <ArrowIcon />
        </a>
      </div>
      </div>
    </nav>
  )
}
