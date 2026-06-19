"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ScrambleText } from "@/components/ui/scramble-text";
import { DesktopStage, MobileStage } from "@/components/ui/stage";

// Exact section heights extracted from live polygon.technology/open-money-stack.
// Desktop: section.oms-hero spans y0 → 839 (content starts at the 120px grid row).
// Mobile (500-canvas): section spans y0 → 797.
const HERO_DESKTOP_H = 839;
const HERO_MOBILE_H = 797;

// Hero scene video (3D objects, alpha webm) — downloaded from live
// (OMS_Hero_V2-WebM.webm). Sits on top of the blue gradient SVG.
const HERO_VIDEO = "/assets/oms-page/hero-video.webm";
// Blue gradient field behind the scene (live `.oms-hero-bg`, 720×600 svg, cover).
const HERO_BG = "/assets/oms-page/hero-bg.svg";

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
    >
      <source src={HERO_VIDEO} type="video/webm" />
    </video>
  );
}

// Solid ▸ triangle — live `.oms-button-icon` arrow (viewBox 0 0 12 12).
function TriangleArrow({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path
        d="M7.86511 5.38649C8.07403 5.5838 8.07403 5.9162 7.86511 6.11351L4.59331 9.20354C4.27444 9.50469 3.75 9.27863 3.75 8.84003L3.75 2.65997C3.75 2.22137 4.27444 1.99531 4.59331 2.29646L7.86511 5.38649Z"
        fill={color}
      />
    </svg>
  );
}

// Hero CTA — live `.btn-new`: flex, 60px gap label↔arrow, 18/16 padding,
// clip-path #buttonClip bottom-right cut, mono 14px (13px mobile).
function CtaButton({
  label,
  bgClass,
  textClass,
  compact,
}: {
  label: string;
  bgClass: string;
  textClass: string;
  /** Mobile sizing — 15/12 padding, 13px mono, space-between in fixed-width parent. */
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
      <span>
        <TriangleArrow color="currentColor" />
      </span>
    </a>
  );
}

// Trusted-by marquee logos — identical set/order to the homepage hero.
// Live renders each as a currentColor SVG; we mask + fill bg-primary so they
// flip #07060D (light) / #FFFFFF (dark) to match the cell color per theme.
const LOGOS = [
  { src: "/assets/hero/logos/stripe.svg", alt: "Stripe", w: 88, vbW: 72, vbH: 60 },
  { src: "/assets/hero/logos/revolut.svg", alt: "Revolut", w: 120, vbW: 88, vbH: 60 },
  { src: "/assets/hero/logos/polymarket.svg", alt: "Polymarket", w: 150, vbW: 132, vbH: 60 },
  { src: "/assets/hero/logos/courtyard.svg", alt: "Courtyard", w: 150, vbW: 132, vbH: 60 },
  { src: "/assets/hero/logos/google.svg", alt: "Google", w: 120, vbW: 88, vbH: 60 },
  { src: "/assets/hero/logos/reddit.svg", alt: "Reddit", w: 88, vbW: 76, vbH: 60 },
  { src: "/assets/hero/logos/nexo.svg", alt: "Nexo", w: 150, vbW: 98, vbH: 60 },
  { src: "/assets/hero/logos/securitize.svg", alt: "Securitize", w: 150, vbW: 120, vbH: 60 },
];

const HEADING = "Move funds globally with stablecoins in one unified stack";
const SUBCOPY =
  "The enterprise-ready stack to onboard your business to blockchain. Seamlessly connect offchain systems to onchain settlement, all in one integration.";

export function HeroOMS() {
  return (
    <section
      className="relative w-full overflow-hidden bg-background"
      style={{ containerType: "inline-size" }}
    >
      {/* ───────────────────────── DESKTOP (≥768px) ───────────────────────── */}
      <DesktopStage className="hidden md:block" height={HERO_DESKTOP_H}>
        {/* 120px grid — solid stroke cells behind everything (flips per theme) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-stroke) 1px, transparent 1px), linear-gradient(90deg, var(--color-stroke) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />

        {/* Blue scene — gradient field SVG with the 3D video on top. Fixed blue
            in BOTH themes (live scene/gradient do not flip). x721 y120 w662 h603. */}
        <div
          className="absolute overflow-hidden"
          style={{ left: 721, top: 120, width: 662, height: 603 }}
        >
          <Image
            src={HERO_BG}
            alt=""
            fill
            unoptimized
            className="object-cover"
            priority
          />
          <div className="absolute inset-0">
            <HeroVideo />
          </div>
        </div>

        {/* Heading — live `.u-h2-new` (H1 tag, 64px): white→dark flip via token */}
        <h1 className="absolute left-[60px] top-[148px] w-[600px] text-desktop-h2 text-primary">
          {HEADING}
        </h1>

        {/* Sub-copy — 18px body-large, flips white/dark via token */}
        <p className="absolute left-[60px] top-[429px] w-[378px] text-desktop-body-large text-primary">
          {SUBCOPY}
        </p>

        {/* CTAs — live `.button-wrap`: 12px gap. Get early access (purple, fixed)
            + Use Polygon (grey-500, flips). */}
        <div className="absolute left-[60px] top-[565px] flex items-center gap-[12px]">
          <CtaButton
            label="Get early access"
            bgClass="bg-purple hover:bg-purple-hover"
            textClass="text-white"
          />
          <CtaButton
            label="Use Polygon"
            bgClass="bg-grey-500 hover:bg-grey-500-hover"
            textClass="text-grey-100"
          />
        </div>

        {/* Trusted-by marquee — live `.hero-marquee-wrap.is-oms`: x1 y720 w820 h120,
            bg inverted-primary (#07060D dark / #F2F1F5 light), border-top stroke. */}
        <div
          className="absolute overflow-hidden border-t border-stroke bg-inverted-primary"
          style={{ left: 0, top: 720, width: 820, height: 120 }}
        >
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
                    <div
                      role="img"
                      aria-label={logo.alt}
                      className="bg-primary"
                      style={{
                        width: logo.w,
                        height: (logo.w * logo.vbH) / logo.vbW,
                        maxHeight: "55%",
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
          {/* edge fades — live `.marquee-grad.is-oms` (82px) */}
          <div
            className="absolute left-0 top-0 h-full w-[82px] pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, var(--color-inverted-primary), transparent)",
            }}
          />
          <div
            className="absolute right-0 top-0 h-full w-[82px] pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, var(--color-inverted-primary), transparent)",
            }}
          />
        </div>
      </DesktopStage>

      {/* ───────────────────────── MOBILE (≤767px) ─────────────────────────
          500-canvas. Layout extracted per-element from live @500:
            • heading y80 (32px/1.06/-0.64) · sub y203 (16px body-large)
            • two side-by-side 213/172px CTAs y307 · full-bleed scene y384→797 */}
      <MobileStage className="md:hidden" width={500} height={HERO_MOBILE_H}>
        {/* 120px grid (full bleed) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-stroke) 1px, transparent 1px), linear-gradient(90deg, var(--color-stroke) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />

        {/* Heading — flips via token */}
        <h1 className="absolute left-[25px] top-[80px] w-[455px] font-heading font-light text-primary text-[32px] leading-[1.06] tracking-[-0.64px]">
          {HEADING}
        </h1>

        {/* Sub-copy */}
        <p className="absolute left-[25px] top-[203px] w-[455px] text-mobile-body-large text-primary">
          {SUBCOPY}
        </p>

        {/* CTAs — side by side, y307, 12px gap (213px + 172px) */}
        <div className="absolute left-[25px] top-[307px] flex flex-row items-center gap-[12px]">
          <div className="w-[213px]">
            <CtaButton
              label="Get early access"
              bgClass="bg-purple hover:bg-purple-hover"
              textClass="text-white"
              compact
            />
          </div>
          <div className="w-[172px]">
            <CtaButton
              label="Use Polygon"
              bgClass="bg-grey-500 hover:bg-grey-500-hover"
              textClass="text-grey-100"
              compact
            />
          </div>
        </div>

        {/* Full-bleed blue scene — live `.oms-hero-bg` x3 y384 w495 h413.
            Gradient field + 3D video on top, fixed blue in both themes. */}
        <div
          className="absolute overflow-hidden"
          style={{ left: 3, top: 384, width: 495, height: 413 }}
        >
          <Image
            src={HERO_BG}
            alt=""
            fill
            unoptimized
            className="object-cover"
            priority
          />
          <div className="absolute inset-0">
            <HeroVideo />
          </div>
        </div>
      </MobileStage>
    </section>
  );
}
