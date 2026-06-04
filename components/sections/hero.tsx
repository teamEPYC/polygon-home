'use client'

import Image from 'next/image'
import { Eyebrow } from '@/components/ui/eyebrow'

const HERO_VIDEO = '/assets/hero-loop.mp4'

// Alpha-mask that carves the 3D scene into its Figma silhouette.
const SCENE_MASK = {
  WebkitMaskImage: 'url(/assets/hero/hero-scene-mask.svg)',
  maskImage: 'url(/assets/hero/hero-scene-mask.svg)',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
} as const

// NE arrow that lives inside the button corner cap.
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

// Cut-corner CTA built from the real Figma corner SVG + a left text block.
function CtaButton({
  label,
  corner,
  bgClass,
  textClass,
  arrowColor,
  prClass,
}: {
  label: string
  corner: string
  bgClass: string
  textClass: string
  arrowColor: string
  prClass: string
}) {
  return (
    <a href="#" className="inline-flex items-center">
      <div className={`flex h-[52px] items-center pl-[16px] ${prClass} rounded-l-[4px] ${bgClass}`}>
        <span className={`text-desktop-mono-small ${textClass}`}>{label}</span>
      </div>
      <div className="relative h-[52px] w-[28px] overflow-hidden shrink-0">
        <img src={corner} alt="" className="absolute left-[-1px] top-0 h-[52px] w-[29px]" />
        <span className="absolute left-0 top-[20px] size-[12px]">
          <ArrowIcon color={arrowColor} />
        </span>
      </div>
    </a>
  )
}

// chipW/left are the Figma marquee coordinates; w/h are the logo's intrinsic size.
const LOGOS = [
  { src: '/assets/logo-stripe.svg', alt: 'Stripe', w: 66, h: 26, chipW: 72, left: 26 },
  { src: '/assets/logo-revolut.svg', alt: 'Revolut', w: 81, h: 18, chipW: 88, left: 122 },
  { src: '/assets/logo-google.svg', alt: 'Google', w: 85, h: 27, chipW: 88, left: 234 },
  { src: '/assets/logo-nexo.svg', alt: 'Nexo', w: 95, h: 19, chipW: 98, left: 346 },
]

export function Hero() {
  return (
    <section className="relative w-full h-[840px] overflow-hidden bg-background">
      {/* Grid — solid stroke cells behind everything (matches Figma 120px grid) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-stroke) 1px, transparent 1px), linear-gradient(90deg, var(--color-stroke) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
        }}
      />

      {/* 3D scene — masked into its silhouette */}
      <div
        className="absolute left-[24px] top-[-94px] w-[1392px] h-[1044px] pointer-events-none"
        style={{ ...SCENE_MASK, WebkitMaskSize: '1392px 740px', maskSize: '1392px 740px', WebkitMaskPosition: '0px 170px', maskPosition: '0px 170px' }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/assets/hero/hero-scene.png"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      </div>

      {/* Overlay — darkens the left of the scene so the heading reads */}
      <div
        className="absolute left-[24px] top-[76px] w-[700px] h-[756px] opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(60.2deg, rgb(7,6,13) 17.5%, rgba(7,6,13,0) 79.3%)',
          ...SCENE_MASK,
          WebkitMaskSize: '1392px 740px',
          maskSize: '1392px 740px',
        }}
      />

      {/* Eyebrow */}
      <Eyebrow
        text="$250B in Stablecoin Volume"
        borderColor="white"
        textColor="primary"
        className="absolute left-[60px] top-[120px]"
      />

      {/* Heading */}
      <div className="absolute left-[60px] top-[176px] w-[466px] flex flex-col gap-[2px]">
        <div className="font-heading font-[300] text-[80px] leading-[72px] tracking-[-0.8px] text-grey-100">
          <p className="leading-[72px] mb-0">It&rsquo;s not</p>
          <p className="leading-[72px]">our first</p>
        </div>
        <div className="flex items-end gap-[12px] w-full">
          <div className="flex flex-col items-start justify-end pb-[14px]">
            <Image src="/assets/hero/poly-rotated-16.svg" alt="" width={16} height={16} unoptimized />
          </div>
          <div className="h-[86px] w-[152px] overflow-hidden">
            <Image
              src="/assets/hero-chains.png"
              alt=""
              width={152}
              height={86}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
          <div className="font-heading font-[300] text-[80px] leading-[72px] tracking-[-0.8px] text-grey-100 whitespace-nowrap">
            trillion.
          </div>
        </div>
      </div>

      {/* Body */}
      <p className="absolute left-[60px] top-[472px] w-[421px] font-body text-[18px] leading-[26px]">
        <span className="text-white">The go-to blockchain for global payments, </span>
        <span className="text-grey-200">where trillions in assets move instantly, at scale.</span>
      </p>

      {/* CTAs */}
      <div className="absolute left-[60px] top-[570px] flex items-center gap-[2px]">
        <CtaButton
          label="BUILD"
          corner="/assets/hero/btn-corner-white.svg"
          bgClass="bg-primary"
          textClass="text-purple"
          arrowColor="var(--color-purple)"
          prClass="pr-[107px]"
        />
        <CtaButton
          label="USE POLYGON"
          corner="/assets/hero/btn-corner-grey.svg"
          bgClass="bg-grey-500"
          textClass="text-primary"
          arrowColor="var(--color-primary)"
          prClass="pr-[59px]"
        />
      </div>

      {/* Trusted by — logos on dark chips with edge fades */}
      <div className="absolute left-[66.67%] top-[120px] w-[480px] h-[120px] overflow-hidden">
        {LOGOS.map((logo) => (
          <div
            key={logo.alt}
            className="absolute top-[30px] h-[60px] bg-inverted-primary flex items-center justify-center"
            style={{ left: logo.left, width: logo.chipW }}
          >
            <Image src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} unoptimized />
          </div>
        ))}
        {/* right fade */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 h-[118px] w-[96px] pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--color-background), rgba(7,6,13,0))' }}
        />
        {/* left fade */}
        <div
          className="absolute left-px top-1/2 -translate-y-1/2 h-[118px] w-[205px] pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(7,6,13,0), var(--color-background) 56.731%)' }}
        />
        {/* label + tick marks */}
        <span className="absolute left-[22px] top-[54px] text-desktop-mono text-grey-100">
          TRUSTED BY
        </span>
        <Image
          src="/assets/hero/poly-rotated-8.svg"
          alt=""
          width={8}
          height={8}
          unoptimized
          className="absolute left-[10px] top-[8px] rotate-180"
        />
        <Image
          src="/assets/hero/poly-rotated-8.svg"
          alt=""
          width={8}
          height={8}
          unoptimized
          className="absolute right-[366px] bottom-[8px]"
        />
      </div>

      {/* Socials */}
      <a
        href="#"
        aria-label="Follow on X"
        className="absolute left-[calc(100%-72px)] top-[528px] size-[24px] flex items-center justify-center hover:opacity-80 transition-opacity"
      >
        <Image src="/assets/hero/social-x.svg" alt="" width={15} height={13} unoptimized />
      </a>
      <a
        href="#"
        aria-label="Join Discord"
        className="absolute left-[calc(100%-72px)] top-[648px] size-[24px] flex items-center justify-center hover:opacity-80 transition-opacity"
      >
        <Image src="/assets/hero/social-discord.svg" alt="" width={18} height={13} unoptimized />
      </a>

      {/* Scroll indicator */}
      <div className="absolute left-[calc(100%-60px)] top-[calc(50%+360px)] -translate-x-1/2 -translate-y-1/2 size-[56px] flex items-center justify-center">
        <Image src="/assets/hero/scroll-double-arrow.svg" alt="" width={12} height={16} unoptimized />
      </div>
    </section>
  )
}
