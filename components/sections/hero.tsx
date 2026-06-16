"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ScrambleText } from "@/components/ui/scramble-text";
import { MobileStage } from "@/components/ui/stage";

// Exact mobile section height extracted from live (500 canvas): the hero spans
// from the page top (nav floats over the top grid) down to where the next
// "We've been around the block" glance section begins at css 808.
const HERO_MOBILE_H = 808;

const HERO_VIDEO = "/assets/hero-loop.mp4";

function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
      poster="/assets/hero/hero-scene.png"
    >
      <source src={HERO_VIDEO} type='video/mp4; codecs="avc1.42E01E"' />
      <source src={HERO_VIDEO} type="video/mp4" />
    </video>
  );
}

// Alpha-mask that carves the 3D scene into its Figma silhouette.
const SCENE_MASK = {
  WebkitMaskImage: "url(/assets/hero/hero-scene-mask.svg)",
  maskImage: "url(/assets/hero/hero-scene-mask.svg)",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
} as const;

// Solid ▸ triangle — the live `oms-button-icon` arrow (same as nav).
function TriangleArrow({ color = "currentColor" }: { color?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M7.86511 5.38649C8.07403 5.5838 8.07403 5.9162 7.86511 6.11351L4.59331 9.20354C4.27444 9.50469 3.75 9.27863 3.75 8.84003L3.75 2.65997C3.75 2.22137 4.27444 1.99531 4.59331 2.29646L7.86511 5.38649Z"
        fill={color}
      />
    </svg>
  );
}

// Hero CTA — live `.btn-new`: flex with a 60px gap between label and arrow,
// 18px/16px padding, `clip-path: url(#buttonClip)` bottom-right cut, mono 14px.
// `tilt` rotates the ▸ arrow −45° → ↗ (live `.btn-icon-tilt`, used on external links).
function CtaButton({
  label,
  bgClass,
  tilt,
  textClass = "text-white",
  compact,
}: {
  label: string;
  bgClass: string;
  tilt?: boolean;
  textClass?: string;
  /** Mobile sizing — live `.btn-new` @375: 15px/12px padding, 13px mono,
   *  space-between (full width of its 175px parent). */
  compact?: boolean;
}) {
  const sizing = compact
    ? "w-full py-[15px] px-[12px] text-mobile-mono"
    : "gap-[60px] py-[18px] px-[16px] text-desktop-mono-medium";
  return (
    <a
      href="#"
      className={`scramble-host flex items-center justify-between leading-[1.2] transition-colors ${sizing} ${textClass} ${bgClass}`}
      style={{ clipPath: "url(#buttonClip)" }}
    >
      <span>
        <ScrambleText>{label}</ScrambleText>
      </span>
      <span className={tilt ? "-rotate-45" : ""}>
        <TriangleArrow color="currentColor" />
      </span>
    </a>
  );
}

// Order, sizes, and viewBox aspect ratios extracted from the live hero
// `.hero-marquee-wrap.is-capped` inline SVGs. Each live logo is a
// fill="currentColor" SVG so it recolors per theme — we mirror that here by
// rendering each as a CSS mask filled with `bg-primary` (flips light/dark to
// match the live cell `color`: #07060D light / #FFFFFF dark).
// Cell widths: is-capped=88px, is-large=120px, is-xlarge=150px.
// `vbW`/`vbH` are the live SVG viewBox dims, used to keep the aspect ratio.
const LOGOS = [
  {
    src: "/assets/hero/logos/stripe.svg",
    alt: "Stripe",
    w: 88,
    vbW: 72,
    vbH: 60,
  },
  {
    src: "/assets/hero/logos/revolut.svg",
    alt: "Revolut",
    w: 120,
    vbW: 88,
    vbH: 60,
  },
  {
    src: "/assets/hero/logos/polymarket.svg",
    alt: "Polymarket",
    w: 150,
    vbW: 132,
    vbH: 60,
  },
  {
    src: "/assets/hero/logos/courtyard.svg",
    alt: "Courtyard",
    w: 150,
    vbW: 132,
    vbH: 60,
  },
  {
    src: "/assets/hero/logos/google.svg",
    alt: "Google",
    w: 120,
    vbW: 88,
    vbH: 60,
  },
  {
    src: "/assets/hero/logos/reddit.svg",
    alt: "Reddit",
    w: 88,
    vbW: 76,
    vbH: 60,
  },
  { src: "/assets/hero/logos/nexo.svg", alt: "Nexo", w: 150, vbW: 98, vbH: 60 },
  {
    src: "/assets/hero/logos/securitize.svg",
    alt: "Securitize",
    w: 150,
    vbW: 120,
    vbH: 60,
  },
];

// Hero socials — exact SVGs from the live site (fill=currentColor so the
// whole-cell hover can recolor them). All render at 24px inside a 120px cell.
function XIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
      <path
        d="M19.5 18.5625L13.6341 10.913L13.6441 10.9202L18.9331 5.4375H17.1656L12.857 9.9L9.43553 5.4375H4.80013L10.2766 12.5793L10.2759 12.5787L4.5 18.5625H6.26745L11.0576 13.5977L14.8646 18.5625H19.5ZM8.73522 6.63068L16.9655 17.3693H15.5649L7.32792 6.63068H8.73522Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.7175 4.1052L3.88718 10.6219C2.73858 11.0851 2.74523 11.7285 3.67645 12.0154L7.99747 13.3689L17.9951 7.03519C18.4678 6.74638 18.8997 6.90175 18.5447 7.21819L10.4447 14.5584H10.4428L10.4447 14.5594L10.1466 19.0315C10.5833 19.0315 10.7759 18.8304 11.0209 18.5931L13.1197 16.5438L17.4853 19.7817C18.2903 20.2268 18.8684 19.998 19.0687 19.0334L21.9345 5.47202C22.2278 4.29107 21.4855 3.75635 20.7175 4.1052Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 50 50" fill="none">
      <path
        d="M45.4771 0H4.52291C2.025 0 0 2.025 0 4.52291V45.477C0 47.975 2.025 50 4.52291 50H45.477C47.975 50 50 47.975 50 45.477V4.52291C50 2.025 47.975 0 45.4771 0ZM15.4721 43.1733C15.4721 43.9003 14.8829 44.4895 14.1559 44.4895H8.55301C7.82605 44.4895 7.23678 43.9003 7.23678 43.1733V19.6863C7.23678 18.9593 7.82605 18.37 8.55301 18.37H14.1559C14.8829 18.37 15.4721 18.9593 15.4721 19.6863V43.1733ZM11.3545 16.156C8.41479 16.156 6.03168 13.7729 6.03168 10.8332C6.03168 7.89359 8.41479 5.51047 11.3545 5.51047C14.2941 5.51047 16.6772 7.89359 16.6772 10.8332C16.6772 13.7729 14.2942 16.156 11.3545 16.156ZM44.7526 43.2793C44.7526 43.9476 44.2107 44.4895 43.5424 44.4895H37.5301C36.8618 44.4895 36.3199 43.9476 36.3199 43.2793V32.2626C36.3199 30.6191 36.802 25.0609 32.025 25.0609C28.3196 25.0609 27.5681 28.8653 27.4171 30.5726V43.2793C27.4171 43.9476 26.8754 44.4895 26.2069 44.4895H20.392C19.7237 44.4895 19.1818 43.9476 19.1818 43.2793V19.5802C19.1818 18.9119 19.7237 18.37 20.392 18.37H26.2069C26.8753 18.37 27.4171 18.9119 27.4171 19.5802V21.6293C28.7911 19.5674 30.833 17.9759 35.1805 17.9759C44.8077 17.9759 44.7526 26.9702 44.7526 31.912V43.2793Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Stacked in the rightmost grid column (col 12), rows 5–7 → tops 480/600/720.
const SOCIALS = [
  { label: "Follow on X", href: "https://x.com/0xPolygon", Icon: XIcon },
  { label: "Telegram", href: "https://t.me/PolygonHQ", Icon: TelegramIcon },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/polygonlabs/",
    Icon: LinkedInIcon,
  },
];

export function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden bg-background"
      style={{ containerType: "inline-size" }}
    >
      {/* Fixed 1440×840 design stage, scaled to the section width — same pattern
          as purpose/news/use-cases/footer. Below 1440 the whole hero (grid, scene,
          text, columns) scales as one unit, staying aligned with the nav.
          Hidden below the md (768px) breakpoint, where the mobile stage takes over. */}
      <div
        className="relative hidden w-full overflow-hidden md:block"
        style={{ aspectRatio: "1440 / 840" }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: 1440,
            height: 840,
            transform: "scale(calc(100cqw / 1440px))",
          }}
        >
          {/* Grid — solid stroke cells behind everything (matches Figma 120px grid) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-stroke) 1px, transparent 1px), linear-gradient(90deg, var(--color-stroke) 1px, transparent 1px)",
              backgroundSize: "120px 120px",
            }}
          />

          {/* 3D scene — masked into its silhouette */}
          <div
            className="absolute left-[24px] top-[-94px] w-[1392px] h-[1044px] pointer-events-none"
            style={{
              ...SCENE_MASK,
              WebkitMaskSize: "1392px 740px",
              maskSize: "1392px 740px",
              WebkitMaskPosition: "0px 170px",
              maskPosition: "0px 170px",
            }}
          >
            <HeroVideo />
          </div>

          {/* Overlay — darkens the left of the scene so the white heading reads.
          The hero is theme-INDEPENDENT (white text on the colorful scene in BOTH
          themes, per live) so this dark wash is fixed, not theme-aware. */}
          <div
            className="absolute left-[24px] top-[76px] w-[700px] h-[756px] opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(60.2deg, rgb(7,6,13) 17.5%, rgba(7,6,13,0) 79.3%)",
              ...SCENE_MASK,
              WebkitMaskSize: "1392px 740px",
              maskSize: "1392px 740px",
            }}
          />

          {/* Eyebrow — fixed white on the scene (same in both themes) */}
          <Eyebrow
            text="$2.4 Trillion Transfer Volume"
            borderColor="white"
            textColor="white"
            className="absolute left-[60px] top-[113px]"
          />

          {/* Heading */}
          <div className="absolute left-[60px] top-[168px] w-[560px] flex flex-col gap-[2px]">
            <div className="text-desktop-h1 text-white">
              <p className="mb-0">It&rsquo;s not</p>
              <p>our first</p>
            </div>
            <div className="flex items-end gap-[12px] w-full">
              <div className="flex flex-col items-start justify-end pb-[14px]">
                <Image
                  src="/assets/hero/poly-rotated-16.svg"
                  alt=""
                  width={16}
                  height={16}
                  unoptimized
                />
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
              <div className="text-desktop-h1 text-white whitespace-nowrap">
                trillion
              </div>
            </div>
          </div>

          {/* Body */}
          <p className="absolute left-[60px] top-[464px] w-[421px] text-desktop-body-large">
            <span className="text-white">
              The go-to blockchain for global payments,{" "}
            </span>
            <span className="text-[rgba(255,255,255,0.7)]">
              where trillions in assets move instantly, at scale.
            </span>
          </p>

          {/* CTAs — live button-wrap.is-cappped: 12px gap between buttons */}
          <div className="absolute left-[60px] top-[555px] flex items-center gap-[12px]">
            <CtaButton
              label="OPEN MONEY STACK"
              bgClass="bg-purple hover:bg-purple-hover"
            />
            <CtaButton
              label="BUILD ON POLYGON"
              bgClass="bg-[#07060D] hover:bg-[#121118]"
              tilt
            />
          </div>

          {/* Right-edge column divider — one continuous stroke down the full hero
          right edge (y0 → y840), so the line runs unbroken from the nav, through
          the gap above the trusted-by panel, over the 3D scene, into the socials
          column. The panel and socials draw their own border-r at this same x. */}
          <div className="absolute right-0 top-0 h-[840px] w-px bg-stroke pointer-events-none" />

          {/* Trusted by — fixed label cell + separate scrolling logos area.
          Height is a flat 120px now: the stage transform handles the responsive
          scaling, so the old min(120px,8.333vw) would double-shrink. */}
          <div
            className="absolute right-0 top-[120px] w-[480px] bg-background border-t border-r border-stroke"
            style={{ height: 120 }}
          >
            {/* "TRUSTED BY" label cell — static, first 120px column */}
            <div className="absolute left-0 top-0 w-[120px] h-full">
              <span className="absolute left-[18px] top-[52px] text-center text-desktop-mono-small">
                TRUSTED BY
              </span>
              {/* top-left tick */}
              <Image
                src="/assets/hero/poly-rotated-8.svg"
                alt=""
                width={8}
                height={8}
                unoptimized
                className="absolute left-[10px] top-[8px] rotate-180"
              />
              {/* bottom-right tick */}
              <Image
                src="/assets/hero/poly-rotated-8.svg"
                alt=""
                width={8}
                height={8}
                unoptimized
                className="absolute right-[6px] bottom-[8px]"
              />
            </div>

            {/* Logo scrolling area — starts after the label cell, never overlaps it */}
            <div className="absolute left-[120px] top-0 right-0 h-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 flex items-center animate-[marquee_22s_linear_infinite]">
                {[0, 1].map((set) => (
                  <div
                    key={set}
                    className="flex items-center gap-[24px] pr-[24px] h-full"
                    aria-hidden={set === 1}
                  >
                    {LOGOS.map((logo) => (
                      <div
                        key={logo.alt}
                        className="h-full shrink-0 flex items-center justify-center"
                        style={{ width: logo.w, marginLeft: 24 }}
                      >
                        {/* Live logo is a currentColor SVG; we mask it and fill with
                        bg-primary so it flips #07060D (light) / #FFF (dark). */}
                        <div
                          role="img"
                          aria-label={logo.alt}
                          className="bg-primary"
                          style={{
                            width: logo.w,
                            height: (logo.w * logo.vbH) / logo.vbW,
                            maxHeight: "60%",
                            WebkitMaskImage: `url(${logo.src})`,
                            maskImage: `url(${logo.src})`,
                            WebkitMaskRepeat: "no-repeat",
                            maskRepeat: "no-repeat",
                            WebkitMaskSize: "contain",
                            maskSize: "contain",
                            WebkitMaskPosition: "center",
                            maskPosition: "center",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {/* left fade — at the boundary between label cell and logos */}
              <div
                className="absolute left-0 top-0 h-full w-[80px] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to right, var(--color-background), transparent)",
                }}
              />
              {/* right fade */}
              <div
                className="absolute right-0 top-0 h-full w-[96px] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to left, var(--color-background), transparent)",
                }}
              />
            </div>
          </div>

          {/* Socials — rightmost grid column (col 12), three stacked 120px cells.
          Each cell is opaque (covers the 3D scene) with stroke border-b/border-r,
          matching live `.hero-social-wrap`. Hovering anywhere in the cell recolors
          the icon to purple (live `.hero-social-wrap:hover{color:purple}`). */}
          <div className="absolute right-0 top-[480px] w-[120px] flex flex-col">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-[120px] w-[120px] items-center justify-center border-b border-r border-stroke bg-background text-primary transition-colors duration-200 hover:text-purple"
              >
                <span className="size-[24px]">
                  <Icon />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ───────────────────────── MOBILE (≤767px) ─────────────────────────
          500-canvas stage (the project mobile width guide). The nav floats over
          the top grid, so the hero begins at the page top. Layout extracted
          per-element from live polygon.technology @500 (all px on the 500 canvas):
            • full-bleed grid: 5 cols × 100px, 101px rows (live `.u-bg-grid`)
            • beveled scene card (live `.h_hero_content_wrap`, clip #mobileHeroClip):
              x17 y81 w479 h792, holding the bg video + dark wash + content
            • content: eyebrow y124 · heading y182 (48/0.9, line-3 = chains+trillion)
              · body y356 (16px body-large) · two side-by-side 213px buttons y438
            • mobile logo marquee (live `.marquee-mobile-wrap`): top stroke at
              y585, logos at 50px svg height (~15px glyph), ~13px gap */}
      <MobileStage className="md:hidden" width={500} height={HERO_MOBILE_H}>
        {/* Grid background — 5 cols × 100px wide, 101px rows (live u-bg-grid @500).
            Bottom layer; the opaque scene card covers it where they overlap. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-stroke) 1px, transparent 1px), linear-gradient(90deg, var(--color-stroke) 1px, transparent 1px)",
            backgroundSize: "100px 101px",
            // live's grid lines sit at x=1,101,… and y=…,706,807 (section starts at
            // x1); nudge the pattern +1/−1 so our lines land exactly on live's.
            backgroundPosition: "1px -1px",
          }}
        />

        {/* Beveled 3D scene card — live `.h_hero_content_wrap` clipped to the
            #mobileHeroClip silhouette (beveled top-left). The clip box keeps the
            full 479×792 aspect so the bevel matches live, but the VIDEO is clipped
            to the top 504px (down to the logo strip at y585): below that, live
            shows grid, not scene, so we let the grid show through there. */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: 17,
            top: 81,
            width: 479,
            height: 792,
            clipPath: "url(#mobileHeroClip)",
          }}
        >
          {/* Video clipped to the top 504px (card-relative) — same visible scene
              extent as live (its scene reads to ~y585, then the solid logo band). */}
          <div
            className="absolute left-0 top-0 w-full overflow-hidden"
            style={{ height: 504 }}
          >
            <div className="w-full" style={{ height: 792 }}>
              <HeroVideo />
            </div>
            {/* Subtle top overlay — EXACTLY live's `.top-hero-overlay`: a 303°
                diagonal wash, rgba(7,6,13,0.35) → transparent by 30%, top 475px. */}
            <div
              className="absolute left-0 right-0 top-0 pointer-events-none"
              style={{
                height: 475,
                backgroundImage:
                  "linear-gradient(303deg, rgba(7,6,13,0.35), rgba(7,6,13,0) 30%)",
              }}
            />
          </div>
        </div>

        {/* Eyebrow — live: x55 y124, 12px mono, grey-200 border, white label */}
        <Eyebrow
          text="$2.4 Trillion Transfer Volume"
          borderColor="grey-200"
          textColor="white"
          textSize="text-mobile-mono-small"
          className="absolute left-[55px] top-[124px] !h-[30px] !px-[8px] !py-[6px]"
        />

        {/* Heading — live `.u-h1-new`: 48px, line-height 0.9, tracking -0.96px.
            Line 1/2 plain; line 3 is the chains graphic + "trillion" (live indents
            "trillion" to x177, the chains occupying x55→~165). */}
        <div className="absolute left-[55px] top-[182px] font-heading font-light text-white text-[48px] leading-[0.9] tracking-[-0.96px]">
          <p>It&rsquo;s not</p>
          <p>our first</p>
          <div className="flex items-center gap-[12px]">
            <span className="inline-block h-[50px] w-[110px] overflow-hidden">
              <Image
                src="/assets/hero-chains.png"
                alt=""
                width={110}
                height={50}
                className="h-full w-full object-cover"
                unoptimized
              />
            </span>
            <span className="whitespace-nowrap">trillion</span>
          </div>
        </div>

        {/* Body — live: x61 y356 w414, 16px body-large, line-height 1.4 */}
        <p className="absolute left-[61px] top-[356px] w-[414px] text-mobile-body-large">
          <span className="text-white">
            The go-to blockchain for global payments,{" "}
          </span>
          <span className="text-[rgba(255,255,255,0.7)]">
            where trillions in assets move instantly, at scale.
          </span>
        </p>

        {/* CTAs — live: side by side, y438, each 213px wide, 12px gap. */}
        <div className="absolute left-[55px] top-[438px] flex flex-row items-center gap-[12px]">
          <div className="w-[213px]">
            <CtaButton
              label="OPEN MONEY STACK"
              bgClass="bg-purple hover:bg-purple-hover"
              compact
            />
          </div>
          <div className="w-[213px]">
            <CtaButton
              label="BUILD ON POLYGON"
              bgClass="bg-[#07060D] hover:bg-[#121118]"
              tilt
              compact
            />
          </div>
        </div>

        {/* Mobile logo marquee — live `.hero-marquee-wrap.is-grid`: a SOLID #07060D
            band 120px tall (y585→705) behind the logos so they sit on dark. BELOW
            this band the grid shows (live has grid lines at y706 & y807), so the
            band is only 120px — not the full region. Top stroke at y585, single row
            of logos at 50px svg height (~15px glyph), ~13px gaps, logos at y622. */}
        <div
          className="absolute left-0 right-0 overflow-hidden border-t border-stroke bg-[#07060D]"
          style={{ top: 585, height: 120 }}
        >
          {/* Row sits 37px below the top stroke (live logos at y622) */}
          <div
            className="absolute left-0 flex items-center animate-[marquee_22s_linear_infinite]"
            style={{ top: 37, height: 50 }}
          >
            {[0, 1].map((set) => (
              <div
                key={set}
                className="flex h-full items-center gap-[13px] pr-[13px]"
                aria-hidden={set === 1}
              >
                {LOGOS.map((logo) => (
                  <div
                    key={logo.alt}
                    role="img"
                    aria-label={logo.alt}
                    className="h-full shrink-0 bg-primary"
                    style={{
                      // live: each logo svg renders at 50px tall, width by aspect
                      width: (50 * logo.vbW) / logo.vbH,
                      WebkitMaskImage: `url(${logo.src})`,
                      maskImage: `url(${logo.src})`,
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                      WebkitMaskPosition: "center",
                      maskPosition: "center",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          {/* Edge fades — live `.marquee-grad` (left) + `.marquee-grad.is-right`:
              dark #07060D → transparent, masking logos (and any scene) at the
              vertical edges of the strip. */}
          <div
            className="absolute inset-y-0 left-0 w-[50px] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #07060D 54%, rgba(7,6,13,0))",
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-[50px] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(270deg, #07060D 28%, rgba(7,6,13,0))",
            }}
          />
        </div>
      </MobileStage>
    </section>
  );
}
