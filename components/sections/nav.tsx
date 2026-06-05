import Image from 'next/image'

const NAV_LINKS = [
  { label: 'Products', hasNew: true },
  { label: 'Developers' },
  { label: 'Use Polygon' },
  { label: 'Company' },
  { label: 'Blog' },
]

// NE arrow that lives inside the BUILD button corner cap.
function ArrowIcon({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
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
    <nav className="fixed top-0 left-0 right-0 z-50 h-[52px]">
      <div className="relative max-w-[1440px] mx-auto h-full">
        {/* Logo-area box — bordered panel with cut bottom-left corner */}
        <img
          src="/assets/hero/nav-logo-area.svg"
          alt=""
          className="absolute left-[24px] top-0 h-[52px] w-[216px]"
        />
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

        {/* Center nav links — 840px box offset 60px left of center, links left-packed */}
        <div className="absolute left-[calc(50%-60px)] -translate-x-1/2 top-0 flex items-center gap-[32px] h-[52px] w-[840px] px-[32px] bg-inverted-primary border-l border-t border-b border-stroke">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href="#"
              className="flex items-center gap-[4px] text-desktop-mono-small text-grey-100 hover:text-primary transition-colors whitespace-nowrap"
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

        {/* STAKE POL — inline SVGs so CSS vars resolve correctly */}
        <a href="#" className="absolute left-[1080px] top-0 flex items-center h-[52px] border-l border-stroke">
          <div className="relative h-[52px] w-[100px] bg-inverted-primary">
            <span className="absolute left-[23px] top-[18px] text-desktop-mono-small text-grey-100">
              STAKE POL
            </span>
          </div>
          <svg width="20" height="52" viewBox="0 0 20 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M20 0V32.6784C20 34.8433 19.1226 36.9157 17.5682 38.4225L4.72555 50.872C3.9793 51.5955 2.98077 52 1.94143 52H0V0H20Z" fill="var(--inverted-primary)" />
          </svg>
        </a>

        {/* BUILD ON POLYGON — purple button, white text, inline SVG corner + arrow */}
        <a href="#" className="absolute left-[1200px] top-0 flex items-center h-[52px]">
          <div className="flex items-center h-[52px] pl-[16px] pr-[43px] rounded-bl-[4px] bg-purple">
            <span className="text-desktop-mono-small text-primary">BUILD ON POLYGON</span>
          </div>
          <div className="relative h-[52px] w-[28px] overflow-hidden shrink-0">
            <svg width="29" height="52" viewBox="0 0 29 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-[-1px] top-0">
              <path d="M29 0V32.6784C29 34.8433 28.1226 36.9157 26.5682 38.4225L13.7256 50.872C12.9793 51.5955 11.9808 52 10.9414 52H0V0H29Z" fill="var(--purple)" />
            </svg>
            <span className="absolute left-0 top-[20px] size-[12px]">
              <ArrowIcon color="var(--color-primary)" />
            </span>
          </div>
        </a>
      </div>
    </nav>
  )
}
