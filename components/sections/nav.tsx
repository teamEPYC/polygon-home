import Image from 'next/image'

const NAV_LINKS = [
  { label: 'Products', hasNew: true },
  { label: 'Use Cases' },
  { label: 'Company' },
  { label: 'Use Polygon' },
  { label: 'Developers Docs' },
]

// NE arrow — matches the live site oms-button-icon (12×12, width:12px)
function ArrowIcon({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ width: 12, flexShrink: 0 }}>
      <path
        d="M3 9L9 3M9 3H4M9 3V8"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100000]">
      <div className="max-w-[1440px] mx-auto flex items-stretch justify-between">

        {/* Brand area — flex:1, bg, border-bottom, logo centered vertically */}
        <div className="flex-1 bg-[#07060d] border-b border-stroke flex items-center pl-[50px]">
          <Image
            src="/assets/polygon-logo.svg"
            alt="Polygon"
            width={110}
            height={26}
            priority
            unoptimized
          />
        </div>

        {/* Nav links — bg, border-bottom, flex row */}
        <div className="bg-[#07060d] border-b border-stroke flex items-center justify-start">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href="#"
              className="flex items-center gap-[4px] text-primary no-underline hover:opacity-80 transition-opacity whitespace-nowrap"
              style={{
                padding: '1rem',
                fontFamily: 'var(--font-mono), Polysans Mono, Arial, sans-serif',
                fontSize: 'min(.875rem, 1.111vw)',
                textTransform: 'uppercase',
                letterSpacing: '0.01em',
                lineHeight: '1.2',
              }}
            >
              {link.label}
              {link.hasNew && (
                <span className="inline-flex items-center justify-center size-[16px] shrink-0">
                  <Image src="/assets/ico-new.svg" alt="" width={16} height={16} unoptimized />
                </span>
              )}
            </a>
          ))}
        </div>

        {/* CTA buttons — nav-button-wrap: flex, align-items:stretch */}
        <div className="flex items-stretch">

          {/* Stake Pol — grey bg, clip-path, no arrow */}
          <a
            href="https://staking.polygon.technology/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center text-grey-100 no-underline hover:opacity-80 transition-opacity whitespace-nowrap"
            style={{
              background: '#1f1e20',
              clipPath: 'url(#navClipLeft)',
              padding: '16px',
              fontFamily: 'var(--font-mono), Polysans Mono, Arial, sans-serif',
              fontSize: '.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.01em',
              lineHeight: '1.2',
            }}
          >
            Stake Pol
          </a>

          {/* Book a Call — purple bg, clip-path, NE arrow */}
          <a
            href="#"
            className="flex items-center text-primary no-underline hover:opacity-80 transition-opacity whitespace-nowrap"
            style={{
              background: '#670de5',
              clipPath: 'url(#navClipLeft)',
              padding: '16px',
              gap: '28px',
              fontFamily: 'var(--font-mono), Polysans Mono, Arial, sans-serif',
              fontSize: '.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.01em',
              lineHeight: '1.2',
            }}
          >
            <span>Book a Call</span>
            <ArrowIcon color="white" />
          </a>

        </div>
      </div>
    </nav>
  )
}
