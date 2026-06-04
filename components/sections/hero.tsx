'use client'

import Image from 'next/image'
import { Eyebrow } from '@/components/ui/eyebrow'

const CUT = 14
const clipPath = `polygon(0 0, calc(100% - ${CUT}px) 0, 100% ${CUT}px, 100% 100%, 0 100%)`

const HERO_VIDEO = '/assets/hero-loop.mp4'

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

const LOGOS = [
  { src: '/assets/logo-stripe.svg', alt: 'Stripe', w: 66, h: 26 },
  { src: '/assets/logo-revolut.svg', alt: 'Revolut', w: 81, h: 18 },
  { src: '/assets/logo-google.svg', alt: 'Google', w: 85, h: 27 },
  { src: '/assets/logo-nexo.svg', alt: 'Nexo', w: 95, h: 19 },
]

function XIcon() {
  return (
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none">
      <path
        d="M11.44.25h2.19L8.9 5.93l5.57 7.82H10.1L6.77 9.1 2.97 13.75H.78L5.61 7.7.24.25h4.54L7.9 4.85 11.44.25Zm-.77 12.06h1.21L4.1 1.5H2.8l7.87 10.81Z"
        fill="rgba(255,255,255,0.6)"
      />
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
      <path
        d="M15.23 1.42A14.9 14.9 0 0 0 11.5.27a.06.06 0 0 0-.06.03c-.16.28-.34.65-.46.94a13.74 13.74 0 0 0-4.13 0 9.5 9.5 0 0 0-.47-.94.06.06 0 0 0-.06-.03c-1.3.22-2.55.62-3.72 1.15a.05.05 0 0 0-.03.02C.27 4.97-.16 8.4.05 11.8a.06.06 0 0 0 .03.04c1.56 1.15 3.07 1.84 4.56 2.3a.06.06 0 0 0 .06-.02c.35-.48.66-.99.93-1.52a.06.06 0 0 0-.03-.08 9.8 9.8 0 0 1-1.4-.67.06.06 0 0 1-.01-.1l.28-.21a.05.05 0 0 1 .05-.01c2.93 1.34 6.1 1.34 9 0a.05.05 0 0 1 .06.01l.28.21a.06.06 0 0 1 0 .1c-.45.27-.91.49-1.4.67a.06.06 0 0 0-.03.08c.27.53.59 1.04.93 1.52a.06.06 0 0 0 .06.02c1.5-.46 3-1.15 4.57-2.3a.06.06 0 0 0 .02-.04c.26-3.94-.42-7.34-1.8-10.36a.04.04 0 0 0-.02-.02ZM6.02 9.74c-.9 0-1.64-.83-1.64-1.84 0-1.02.72-1.84 1.64-1.84.92 0 1.66.83 1.64 1.84 0 1.01-.73 1.84-1.64 1.84Zm6.06 0c-.9 0-1.64-.83-1.64-1.84 0-1.02.72-1.84 1.64-1.84.93 0 1.66.83 1.64 1.84 0 1.01-.71 1.84-1.64 1.84Z"
        fill="rgba(255,255,255,0.6)"
      />
    </svg>
  )
}

export function Hero() {
  return (
    <section className="relative w-full h-[840px] overflow-hidden bg-background">
      {/*
       * Layout: video fills right ~62% of section (starting at col 5 / x=600).
       * Dark section background shows on the left ~38%.
       * Text content is absolutely positioned over the full width.
       */}

      {/* Video — clipped to the right portion of the section */}
      <div className="absolute inset-y-0 right-0 w-[calc(100%-480px)]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-left"
          poster="/assets/hero-bg.png"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        {/* Soft left-edge blend so video merges into the dark panel */}
        <div
          className="absolute inset-y-0 left-0 w-[240px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, #07060D 0%, rgba(7,6,13,0.6) 50%, rgba(7,6,13,0) 100%)',
          }}
        />
      </div>

      {/* Grid overlay — matches Figma dark-mode stroke */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
        }}
      />

      {/* ── Left panel content (all text) ── */}

      {/* Eyebrow — row 1 */}
      <div className="absolute left-[60px] top-[120px]">
        <Eyebrow text="$250B in Stablecoin Volume" borderColor="white" textColor="primary" />
      </div>

      {/* Heading — rows 2–4 */}
      <div className="absolute left-[60px] top-[176px] flex flex-col gap-[2px]">
        <h1 className="font-heading font-[300] text-[80px] leading-[72px] tracking-[-0.8px] text-grey-100">
          It&rsquo;s not
          <br />
          our first
        </h1>
        {/* Third line: decorative diamond · chain thumbnail · "trillion." */}
        <div className="flex items-end gap-[12px] mt-[4px]">
          <div className="pb-[14px]">
            <Image src="/assets/poly-diamond.svg" alt="" width={16} height={16} unoptimized />
          </div>
          <div className="h-[86px] w-[152px] overflow-hidden rounded-[2px]">
            <Image
              src="/assets/hero-chains.png"
              alt=""
              width={152}
              height={86}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
          <h1 className="font-heading font-[300] text-[80px] leading-[72px] tracking-[-0.8px] text-grey-100 whitespace-nowrap">
            trillion.
          </h1>
        </div>
      </div>

      {/* Body text */}
      <p className="absolute left-[60px] top-[472px] w-[421px] text-desktop-body-large">
        <span className="text-white">The go-to blockchain for global payments, </span>
        <span className="text-grey-200">
          where trillions in assets move instantly, at scale.
        </span>
      </p>

      {/* CTA buttons — primary is purple, secondary is inverted */}
      <div className="absolute left-[60px] top-[570px] flex items-center gap-[12px]">
        <a
          href="#"
          className="inline-flex items-center gap-[8px] h-[52px] pl-[16px] pr-[32px] bg-primary text-purple transition-colors hover:bg-inverted-primary-hover whitespace-nowrap"
          style={{ clipPath }}
        >
          <span className="text-desktop-mono-small">BUILD</span>
          <ArrowIcon color="var(--color-purple)" />
        </a>
        <a
          href="#"
          className="inline-flex items-center gap-[8px] h-[52px] pl-[16px] pr-[32px] bg-grey-500 hover:bg-grey-500-hover text-primary transition-colors whitespace-nowrap"
          style={{ clipPath }}
        >
          <span className="text-desktop-mono-small">USE POLYGON</span>
          <ArrowIcon color="var(--color-primary)" />
        </a>
      </div>

      {/* ── Right panel content ── */}

      {/* Trusted By — top-right, col 8 onward (x=960) */}
      <div
        className="absolute top-[120px] overflow-hidden h-[120px]"
        style={{ left: 960, right: 0 }}
      >
        {/* Fade out at right edge */}
        <div className="absolute inset-y-0 right-0 w-[80px] bg-gradient-to-l from-[#07060D] to-transparent z-10 pointer-events-none" />

        <div className="absolute top-[8px] left-[22px] z-20 flex items-center gap-[6px]">
          <Image src="/assets/poly-corner.svg" alt="" width={8} height={8} unoptimized />
          <span className="text-desktop-mono text-grey-100">TRUSTED BY</span>
        </div>

        <div className="absolute top-[44px] left-[22px] flex items-center gap-[20px]">
          {LOGOS.map((logo) => (
            <Image
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              width={logo.w}
              height={logo.h}
              className="object-contain opacity-80"
              unoptimized
            />
          ))}
        </div>
      </div>

      {/* Social icons — right edge of section */}
      <div className="absolute right-[48px] top-[500px] flex flex-col gap-[32px]">
        <a href="#" aria-label="Follow on X" className="hover:opacity-80 transition-opacity">
          <XIcon />
        </a>
        <a href="#" aria-label="Join Discord" className="hover:opacity-80 transition-opacity">
          <DiscordIcon />
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute right-[68px] bottom-[48px]">
        <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
          <path
            d="M6 9L1 14M6 9L11 14M6 7L1 2M6 7L11 2"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  )
}
