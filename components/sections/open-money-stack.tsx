import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { OMSStaircase } from "./oms-staircase";
import { OmsVideoPlayer } from "@/components/ui/oms-video-player";
import { ScrambleText } from "@/components/ui/scramble-text";
import { MobileStage } from "@/components/ui/stage";
import { Eyebrow } from "@/components/ui/eyebrow";

// Live mobile OMS section height @500 was 3311, but with 48px gaps between our
// (slightly taller) cards the stack grows: 4 product + 2 coming-soon cards (end
// ~3340) → blue grid → black bottom row at y3500 → grid + spacer rows
// (3600-3800); section ends at 3800.
const OMS_MOBILE_H = 3800;

const CUT = 14;
const clipPath = `polygon(0 0, calc(100% - ${CUT}px) 0, 100% ${CUT}px, 100% 100%, 0 100%)`;

/* ─── OMS video tuning ────────────────────────────────────────────────────
 *  Video file: 620×1920px (3.1:1 portrait). Objects stacked vertically:
 *  chain → coil → ring → loop shape (each ~480px of the 1920px frame).
 *  Adjust these to align the objects with the product rows.
 */
// oms-what-wrap top = row1 border (790) − 64px row margin. The video (lottie-abs)
// is top-aligned inside this wrapper; width is 28% per live `.oms-entrace-video
// -embed.is-capped.is-small` (28% of the 1320px wrapper ≈ 370px).
const VIDEO_TOP = 730;
const VIDEO_WIDTH = "28%";

/* ─── Content types ───────────────────────────────────────────────────── */

export type OmsProductItem = {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  wireIcon: string;
  dotColor?: string;
  exploreText: string;
  poweredByLogo?: string;
};

export type OmsComingSoonItem = {
  title: string;
  description: string;
  icon: string;
};

export type OmsContent = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  products?: OmsProductItem[];
  comingSoon?: OmsComingSoonItem[];
  mobileComingSoon?: OmsComingSoonItem[];
};

/* ─── Default content constants ──────────────────────────────────────── */

export const OMS_DEFAULT_EYEBROW = "OPEN MONEY STACK";
export const OMS_DEFAULT_HEADING = "One open stack for money movement";
export const OMS_DEFAULT_BODY =
  "A single place to instantly access the onchain economy, with worldwide distribution.";
export const OMS_DEFAULT_CTA = { label: "GET EARLY ACCESS", href: "#" };

export const OMS_DEFAULT_PRODUCTS: OmsProductItem[] = [
  {
    badge: "LIVE",
    title: "Wallet Infrastructure",
    subtitle: "one-click wallet creation to give your users an onchain account",
    description:
      "The Polygon Chain is fast, low cost, and battle-tested. Live for five years, with 99.99% uptime and millions of users, this is the best place to build onchain.",
    wireIcon: "/assets/ico-wire-chains.png",
    dotColor: "#00FF08",
    exploreText: "Explore Sequence",
    poweredByLogo: "/assets/logo-sequence.png",
  },
  {
    badge: "LIVE",
    title: "Crosschain Interop",
    subtitle: "one-click crypto transactions with any chain",
    description:
      "All-in-one integration, enabling users to transact with any wallet, any token, on any chain, bringing deep unified liquidity.",
    wireIcon: "/assets/ico-wire-trails.png",
    dotColor: "#E271D7",
    exploreText: "Explore Trails",
    poweredByLogo: "/assets/logo-trails.svg",
  },
  {
    badge: "LIVE",
    title: "On/Off- and\nCash Ramps",
    subtitle: "Physical cash and digital fiat on- and off-ramps",
    description:
      "Grow your revenue by offering on- and off-ramps, pay with crypto, earn yield, and more. All with enterprise-grade security.",
    wireIcon: "/assets/ico-wire-wallet.png",
    dotColor: "#FF7421",
    exploreText: "Explore Coinme",
    poweredByLogo: "/assets/logo-coinme.png",
  },
  {
    badge: "LIVE",
    title: "Blockchain Rails",
    subtitle: "The fastest settlement layer to move money globally",
    description: "Use crypto to offer faster, cheaper cross-border transfers.",
    wireIcon: "/assets/ico-wire-bpn.png",
    dotColor: "#00BBFF",
    exploreText: "Explore Polygon Chain",
  },
];

export const OMS_DEFAULT_COMING_SOON: OmsComingSoonItem[] = [
  {
    title: "Stablecoin Orchestration",
    description:
      "Enterprise payments infrastructure for stablecoins and tokenized deposits",
    icon: "/assets/ico-kit.png",
  },
  {
    title: "KYC Hub",
    description:
      "Manage all payments-related KYC in one place. Worry about your customers while we take care of the rest.",
    icon: "/assets/ico-pay.png",
  },
];

// Mobile preserves the original (pre-refactor) icon order, which was the
// opposite of desktop: Stablecoin→ico-pay, KYC Hub→ico-kit.
export const OMS_DEFAULT_MOBILE_COMING_SOON: OmsComingSoonItem[] = [
  {
    title: "Stablecoin Orchestration",
    description:
      "Enterprise payments infrastructure for stablecoins and tokenized deposits",
    icon: "/assets/ico-pay.png",
  },
  {
    title: "KYC Hub",
    description:
      "Manage all payments-related KYC in one place. Worry about your customers while we take care of the rest.",
    icon: "/assets/ico-kit.png",
  },
];

// Mobile products carry a per-item mobileVideo; kept as a separate default so
// desktop `products` prop and mobile videos stay decoupled.
export type OmsMobileProductItem = OmsProductItem & { mobileVideo: string };

export const OMS_DEFAULT_MOBILE_PRODUCTS: OmsMobileProductItem[] = [
  {
    badge: "LIVE",
    title: "Wallet Infrastructure",
    subtitle: "one-click wallet creation to give your users an onchain account",
    description:
      "The Polygon Chain is fast, low cost, and battle-tested. Live for five years, with 99.99% uptime and millions of users, this is the best place to build onchain.",
    wireIcon: "/assets/ico-wire-chains.png",
    dotColor: "#00FF08",
    exploreText: "Explore Sequence",
    poweredByLogo: "/assets/logo-sequence.png",
    mobileVideo: "/assets/oms-mobile-chains.webm",
  },
  {
    badge: "LIVE",
    title: "Crosschain Interop",
    subtitle: "one-click crypto transactions with any chain",
    description:
      "All-in-one integration, enabling users to transact with any wallet, any token, on any chain, bringing deep unified liquidity.",
    wireIcon: "/assets/ico-wire-trails.png",
    dotColor: "#E271D7",
    exploreText: "Explore Trails",
    poweredByLogo: "/assets/logo-trails.svg",
    mobileVideo: "/assets/oms-mobile-trails.webm",
  },
  {
    badge: "LIVE",
    title: "On/Off- and\nCash Ramps",
    subtitle: "Physical cash and digital fiat on- and off-ramps",
    description:
      "Grow your revenue by offering on- and off-ramps, pay with crypto, earn yield, and more. All with enterprise-grade security.",
    wireIcon: "/assets/ico-wire-wallet.png",
    dotColor: "#FF7421",
    exploreText: "Explore Coinme",
    poweredByLogo: "/assets/logo-coinme.png",
    mobileVideo: "/assets/oms-mobile-wallet.webm",
  },
  {
    badge: "LIVE",
    title: "Blockchain Rails",
    subtitle: "The fastest settlement layer to move money globally",
    description: "Use crypto to offer faster, cheaper cross-border transfers.",
    wireIcon: "/assets/ico-wire-bpn.png",
    dotColor: "#00BBFF",
    exploreText: "Explore Polygon Chain",
    mobileVideo: "/assets/oms-mobile-bpn.webm",
  },
];

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M3 9L9 3M9 3H4M9 3V8"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Per-row dot — elongated hexagon (live `oms-button-indicator`, 10×8), colored per row.
export function DotHex({ color }: { color: string }) {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.75476 0C7.09909 0 7.4192 0.177151 7.60207 0.468909L9.48846 3.47849C9.69252 3.80405 9.692 4.21773 9.48713 4.54278L7.60238 7.5332C7.41925 7.82375 7.09983 8 6.75638 8H2.86709C2.52211 8 2.2015 7.82219 2.01882 7.52956L0.151952 4.53916C-0.0498799 4.21585 -0.0503885 3.80594 0.150641 3.48214L2.01913 0.472543C2.20155 0.178711 2.52286 0 2.86871 0H6.75476Z"
        fill={color}
      />
    </svg>
  );
}

// Explore arrow box — live `oms-what-button-arrow` (44×36 cut-corner). Always
// visible as a #707bb7 outline; on row hover the colored fill (row dot color +
// dark arrow) fades in over it.
export const ARROW_BOX =
  "M40 0C42.2091 0 44 1.79086 44 4V19.20559C44 21.406 43.1345 23.466 41.5986 24.9707L31.5059 34.8574C30.7582 35.5897 29.7535 36 28.707 36H4C1.79086 36 0 34.2091 0 32V4C0 1.79086 1.79086 0 4 0H40Z";
export const ARROW_TRI =
  "M23.8612 17.3865C24.0701 17.5838 24.0701 17.9162 23.8612 18.1135L20.5894 21.2035C20.2705 21.5047 19.7461 21.2786 19.7461 20.84L19.7461 14.66C19.7461 14.2214 20.2705 13.9953 20.5894 14.2965L23.8612 17.3865Z";

export function ExploreArrow({ color }: { color: string }) {
  return (
    <div className="relative" style={{ width: 44, height: 36 }}>
      {/* default outlined box + arrow */}
      <svg
        width="44"
        height="36"
        viewBox="0 0 44 36"
        fill="none"
        className="absolute inset-0"
      >
        <path d={ARROW_BOX} fill="none" stroke="#707bb7" />
        <path d={ARROW_TRI} fill="#707bb7" />
      </svg>
      {/* colored fill, revealed on row hover */}
      <svg
        width="44"
        height="36"
        viewBox="0 0 44 36"
        fill="none"
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <path d={ARROW_BOX} fill={color} />
        <path d={ARROW_TRI} fill="#07060D" />
      </svg>
    </div>
  );
}

type ProductSectionProps = {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  wireIcon: string;
  dotColor?: string;
  exploreText: string;
  poweredByLogo?: string;
};

function ProductSection({
  badge,
  title,
  subtitle,
  description,
  wireIcon,
  dotColor,
  exploreText,
  poweredByLogo,
}: ProductSectionProps) {
  return (
    <div className="scramble-host group flex justify-between border-t border-[#707bb7] hover:border-white transition-colors w-full [--bc:#707bb7] hover:[--bc:white] cursor-pointer">
      {/* LEFT — oms-lottie-left.is-capped: max-width 32% (live) */}
      <div className="flex flex-col gap-[16px] max-w-[32%]">
        {/* Badge — oms-product-tag: border + corner ticks */}
        <div className="relative inline-flex items-center gap-[10px] px-[12px] py-[6px] border border-[var(--bc)] transition-colors self-start">
          <span className="absolute top-0 left-0 size-[6px] pointer-events-none text-[var(--bc)] transition-colors">
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <path d="M0 0H6L0 6V0Z" fill="currentColor" />
            </svg>
          </span>
          <span className="text-desktop-mono-medium text-[rgba(255,255,255,0.7)] group-hover:text-white transition-colors whitespace-nowrap pt-[1px]">
            {badge}
          </span>
          <span className="absolute bottom-0 right-0 size-[6px] pointer-events-none text-[var(--bc)] transition-colors">
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <path d="M6 6H0L6 0V6Z" fill="currentColor" />
            </svg>
          </span>
        </div>

        {/* Title — u-h3-new: 36px, 1.25 line-height, -0.01em tracking */}
        <h3 className="text-desktop-h3 text-[rgba(255,255,255,0.7)] group-hover:text-white transition-colors whitespace-pre-line">
          {title}
        </h3>

        {/* Subtitle — mono-medium, 70% opacity. max-w-[80%] = live oms-lottie-para-wrap
            (80% of the 32% left column ≈ 339px), so it wraps to 2 lines instead of
            running into the 3D art. */}
        <p className="max-w-[80%] text-desktop-mono-medium uppercase text-[rgba(255,255,255,0.7)] group-hover:text-[rgba(255,255,255,0.7)]">
          {subtitle}
        </p>
      </div>

      {/* RIGHT — oms-card-right: max 30%, flex-col, gap-24px */}
      <div className="flex flex-col gap-[24px] w-[30%] min-w-[30%] shrink-0">
        {/* oms-button-wrap: 2-col grid, border-top */}
        <div className="grid grid-cols-2 border-t border-[var(--bc)] transition-colors -mt-px">
          {/* Left cell — oms-button-left: wire icon, border-l border-b, -translate-y-px */}
          <div
            className="relative border-l border-b border-[var(--bc)] transition-colors flex items-center justify-start -translate-y-px"
            style={{ minHeight: 100 }}
          >
            <Image
              src={wireIcon}
              alt=""
              width={151}
              height={98}
              className="object-contain max-w-[151px]"
              unoptimized
            />
            {dotColor && (
              <div className="absolute" style={{ left: 11, top: 11 }}>
                <DotHex color={dotColor} />
              </div>
            )}
          </div>

          {/* Right cell — oms-button-right: SVG cut-corner border, explore text + arrow */}
          <div
            className="relative flex flex-col justify-between items-end p-[14px] -translate-y-px"
            style={{ minHeight: 100 }}
          >
            {/* Cut-corner SVG border — oms-button-right-embed */}
            <svg
              className="absolute pointer-events-none"
              style={{
                inset: "-1px 0 0 0",
                zIndex: -1,
                color: "var(--bc)",
                width: "100%",
                height: "100%",
              }}
              viewBox="0 0 156 100"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M154 0.5C154.828 0.5 155.5 1.17157 155.5 2V83.2881C155.5 84.2245 155.124 85.1227 154.458 85.7803L141.576 98.4912C140.921 99.1374 140.038 99.5 139.118 99.5H0.5V0.5H154Z"
                stroke="currentColor"
              />
            </svg>
            <span className="text-desktop-mono-small uppercase text-[rgba(255,255,255,0.7)] group-hover:text-white transition-colors text-right">
              <ScrambleText>{exploreText}</ScrambleText>
            </span>
            <ExploreArrow color={dotColor ?? "#707bb7"} />
          </div>
        </div>

        {/* lottie-detail-para-wrap: description + powered by */}
        <div className="flex flex-col gap-[28px]">
          <p className="text-desktop-body text-[rgba(255,255,255,0.7)] leading-[1.4]">
            {description}
          </p>
          {poweredByLogo && (
            <div className="flex items-center gap-[12px]">
              <span className="text-desktop-mono-small uppercase text-[rgba(255,255,255,0.7)]">
                powered by
              </span>
              <Image
                src={poweredByLogo}
                alt=""
                width={120}
                height={20}
                className="h-[20px] w-auto object-contain"
                unoptimized
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type SecondaryCardProps = {
  title: string;
  description: string;
  icon: string;
};

export function SecondaryCard({ title, description, icon }: SecondaryCardProps) {
  return (
    <div className="relative flex items-start gap-0 border-t border-[var(--semi-transparent-blue)] rounded-[2px] w-[646px] h-[164px]">
      {/* Icon area */}
      <div className="relative w-[180px] h-[120px] mt-[44px] shrink-0">
        <Image
          src="/assets/product-card-container.svg"
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
        <Image src={icon} alt="" fill className="object-contain" unoptimized />
      </div>

      {/* Content — badge, title, description (no CTA, matching live) */}
      <div className="flex flex-col h-[120px] mt-[43px] pl-[24px]">
        <div className="flex flex-col gap-[12px]">
          <Badge text="coming soon" variant="blue" />
          <div className="mt-[8px]">
            <span className="text-desktop-h4 text-white">{title}</span>
          </div>
          <p
            className="text-desktop-mono-medium text-[rgba(255,255,255,0.7)] uppercase max-w-[320px]"
            style={{ fontFeatureSettings: '"dlig" 1' }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function OpenMoneyStack({
  eyebrow = OMS_DEFAULT_EYEBROW,
  heading = OMS_DEFAULT_HEADING,
  body = OMS_DEFAULT_BODY,
  ctaLabel = OMS_DEFAULT_CTA.label,
  ctaHref = OMS_DEFAULT_CTA.href,
  products = OMS_DEFAULT_PRODUCTS,
  comingSoon = OMS_DEFAULT_COMING_SOON,
  mobileComingSoon = OMS_DEFAULT_MOBILE_COMING_SOON,
}: OmsContent = {}) {
  // Build mobile products by merging product props with mobile video defaults.
  // mobileVideo is sourced by index from OMS_DEFAULT_MOBILE_PRODUCTS.
  const mobileProducts: OmsMobileProductItem[] = products.map((p, i) => ({
    ...p,
    mobileVideo:
      OMS_DEFAULT_MOBILE_PRODUCTS[i]?.mobileVideo ??
      `/assets/oms-mobile-${i}.webm`,
  }));

  return (
    <section
      className="relative w-full overflow-hidden bg-[#3449c1]"
      style={{ containerType: "inline-size" }}
    >
      {/* Fixed 1440×2521 design stage, scaled to the section width (scale-to-fit,
          same as hero/purpose/news/use-cases/footer). Desktop-only (≥768px). */}
      <div
        className="relative hidden w-full overflow-hidden md:block"
        style={{ aspectRatio: "1440 / 2521" }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: 1440,
            height: 2521,
            transform: "scale(calc(100cqw / 1440px))",
          }}
        >
          {/* Background gradient — live `.blue-bg-circle.is-oms.is-home-new`:
          full-size CSS radial (width/height 100%, centered, top-aligned), NOT an
          image. circle at 50% 40%, stops #273ead → #2941b7 39% → #07092c 75%. */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 40%, #273ead, #2941b7 39%, #07092c 75%)",
            }}
          />

          {/* Faint global grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "120px 120px",
            }}
          />

          {/* Inverted staircase — animates in on scroll */}
          <OMSStaircase eyebrow={eyebrow} />

          {/* Heading — live u-h2-new = desktop-h2 token: 64px / 1.06 line-height /
          -1.28px (-0.02em) tracking. Width forces the live 2-line break
          ("One open stack for" / "money movement"). */}
          <p
            className="absolute left-1/2 -translate-x-1/2 text-desktop-h2 text-white text-center w-[652px]"
            style={{ top: 416 }}
          >
            {heading}
          </p>

          {/* Body text — 18px/1.4 (body-large). Width = 400px to reproduce the live
          2-line wrap (line1 ends "…onchain", measured 374px). */}
          <p
            className="absolute left-1/2 -translate-x-1/2 text-desktop-body-large text-white text-center w-[400px]"
            style={{ top: 580 }}
          >
            {body}
          </p>

          {/* GET EARLY ACCESS button.
          Live: DARK = solid #07060D cut-corner fill, white text+arrow.
                LIGHT = transparent cut-corner with a light outline, white text+arrow.
          Both states keep WHITE text/arrow (fixed) on the blue band. */}
          <a
            href={ctaHref}
            className="scramble-host group absolute inline-flex items-center justify-between w-[245px] h-[52px] pl-[16px] pr-[20px] text-white hover:opacity-90 transition-opacity [[data-theme=dark]_&]:bg-[#07060D]"
            style={{
              top: 662,
              left: "50%",
              transform: "translateX(-50%)",
              clipPath,
            }}
          >
            {/* Light-mode outline — only rendered (visible) on the light band.
            viewBox matches the 245px fixed width (14px top-right cut). */}
            <svg
              className="pointer-events-none absolute inset-0 hidden [[data-theme=light]_&]:block"
              width="100%"
              height="100%"
              viewBox="0 0 245 52"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden
            >
              <path
                d="M0.5 0.5H229.79C230.444 0.5 231.07 0.764 231.526 1.232L243.736 13.793C244.176 14.246 244.422 14.853 244.422 15.485V51.5H0.5V0.5Z"
                stroke="rgba(255,255,255,0.7)"
              />
            </svg>
            <span className="text-desktop-mono-medium">
              <ScrambleText>{ctaLabel}</ScrambleText>
            </span>
            <ArrowIcon />
          </a>

          {/* oms-what-wrap — relative wrapper holding BOTH the video and the product
          rows, mirroring the live structure so the video positions itself:
            • lottie-abs : absolute, inset-0, top-aligned, centered, 28% width
            • oms-lottie-wrap : product rows, margin-top 64px, gap 64px
          Wrapper top = row1 border (790) − 64px row margin = 726. */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[1320px]"
            style={{ top: VIDEO_TOP }}
          >
            {/* lottie-abs — video container: top-aligned, horizontally centered, 28%.
            Nudged 20px up from the structural top per design tweak. */}
            <div className="absolute inset-0 flex justify-center items-start pointer-events-none z-10">
              <div style={{ width: VIDEO_WIDTH, marginTop: -20 }}>
                <OmsVideoPlayer />
              </div>
            </div>

            {/* oms-lottie-wrap — product rows */}
            <div className="flex flex-col gap-[64px]" style={{ marginTop: 64 }}>
              {products.map((p, i) => (
                <ProductSection key={i} {...p} />
              ))}
            </div>
          </div>

          {/* Secondary cards */}
          <div
            className="absolute flex items-center justify-between w-[1320px]"
            style={{ top: 2068, left: 60 }}
          >
            {comingSoon.map((c, i) => (
              <SecondaryCard key={i} {...c} />
            ))}
          </div>

          {/* Last grid row — inverted-primary band with diagonal cut on top-left
          corner. Inline SVG so fill/stroke follow the theme (dark ↔ light). */}
          <svg
            className="absolute left-0 w-full h-[121px]"
            style={{ top: 2400 }}
            viewBox="0 0 1441.71 121.707"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <g
              fill="var(--color-inverted-primary)"
              stroke="var(--color-stroke)"
            >
              <path d="M1081.21 1.20711H1201.21V121.207H1081.21V1.20711Z" />
              <path d="M1201.21 1.20711H1321.21V121.207H1201.21V1.20711Z" />
              <path d="M1321.21 1.20711H1441.21V121.207H1321.21V1.20711Z" />
              <path d="M961.207 1.20711H1081.21V121.207H961.207V1.20711Z" />
              <path d="M841.207 1.20711H961.207V121.207H841.207V1.20711Z" />
              <path d="M481.207 1.20711H601.207V121.207H481.207V1.20711Z" />
              <path d="M601.207 1.20711H721.207V121.207H601.207V1.20711Z" />
              <path d="M721.207 1.20711H841.207V121.207H721.207V1.20711Z" />
              <path d="M361.207 1.20711H481.207V121.207H361.207V1.20711Z" />
              <path d="M241.207 1.20711H361.207V121.207H241.207V1.20711Z" />
              <path d="M121.207 1.20711H241.207V121.207H121.207V1.20711Z" />
              <path d="M121.207 1.20711V121.207H1.20711L121.207 1.20711Z" />
            </g>
            <rect
              x="1.20711"
              y="1.20711"
              width="120"
              height="120"
              fill="none"
              stroke="var(--grid-stroke)"
            />
          </svg>
        </div>
      </div>

      {/* ─── MOBILE (≤767px) ─────────────────────────────────────────────────
          Live mobile composition is fundamentally different from desktop:
          single-column stacked cards, the desktop centred lottie is hidden
          and replaced by a per-row mobile loop video. Section height ≈3436. */}
      <MobileStage className="md:hidden" width={500} height={OMS_MOBILE_H}>
        {/* Background gradient — same full-size radial as live `.blue-bg-circle
            .is-oms` on mobile (verified identical to desktop). */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 40%, #273ead, #2941b7 39%, #07092c 75%)",
          }}
        />
        {/* Faint global grid — 100px cells (500/5 cols), live u-bg-grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />

        {/* Top black staircase platform — live `bg-grid-item bg-black` cells form
            a pedestal under the OPEN MONEY STACK eyebrow: row 1 = 3 cells
            (x100→400, y0), row 2 = 1 centered cell (x200→300, y100). */}
        <div
          className="absolute left-0 flex"
          style={{ top: 0, left: 100, height: 100 }}
          aria-hidden
        >
          {[0, 1, 2].map((c) => (
            <div
              key={c}
              className="bg-inverted-primary border-r border-b border-white/10 [[data-theme=light]_&]:border-black/[0.06]"
              style={{ width: 100, height: 100 }}
            />
          ))}
        </div>
        <div
          className="absolute bg-inverted-primary border-r border-b border-white/10 [[data-theme=light]_&]:border-black/[0.06]"
          style={{ top: 100, left: 200, width: 100, height: 100 }}
          aria-hidden
        />

        {/* Eyebrow — centered. Live @500: y57. */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 57 }}>
          <Eyebrow
            text={eyebrow}
            borderColor="stroke"
            textColor="primary"
            hasDot
          />
        </div>

        {/* Heading — live u-h2-new mobile: 32px / lh 33.92px (1.06) / -0.64px,
            centered, x44 w413. Live @500: y300. */}
        <p
          className="absolute left-1/2 -translate-x-1/2 text-white text-center"
          style={{
            top: 300,
            width: 413,
            fontFamily: "var(--font-heading)",
            fontWeight: 300,
            fontSize: 32,
            lineHeight: "33.92px",
            letterSpacing: "-0.64px",
          }}
        >
          {heading}
        </p>

        {/* Body — 16px / 22.4px (1.4), white, centered, x44 w413. Live @500: y381. */}
        <p
          className="absolute left-1/2 -translate-x-1/2 text-white text-center"
          style={{
            top: 381,
            width: 413,
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: 16,
            lineHeight: "22.4px",
          }}
        >
          {body}
        </p>

        {/* GET EARLY ACCESS button — black cut-corner, white mono+arrow, centered.
            Live @500: y439, w213 h46. */}
        <a
          href={ctaHref}
          className="scramble-host group absolute inline-flex items-center justify-between h-[46px] pl-[16px] pr-[18px] text-white [[data-theme=dark]_&]:bg-[#07060D]"
          style={{
            top: 439,
            left: "50%",
            transform: "translateX(-50%)",
            // Cut corner on the BOTTOM-RIGHT (live `.btn-new.is-black` mobile)
            clipPath: `polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)`,
            gap: 14,
          }}
        >
          <span className="text-desktop-mono-medium">
            <ScrambleText>{ctaLabel}</ScrambleText>
          </span>
          <svg
            width="8"
            height="11"
            viewBox="0 0 8 11"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M1.5 1.5L6 5.5L1.5 9.5"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        {/* LIVE product cards — single column, stacked. l=17, w=342. */}
        {mobileProducts.map((p, i) => (
          <MobileProductCard key={i} top={MOBILE_CARD_TOPS[i]} {...p} />
        ))}

        {/* COMING SOON cards */}
        <MobileComingSoonCard
          top={2852}
          title={mobileComingSoon[0]?.title ?? ""}
          description={mobileComingSoon[0]?.description ?? ""}
          icon={mobileComingSoon[0]?.icon ?? ""}
        />
        <MobileComingSoonCard
          top={3120}
          title={mobileComingSoon[1]?.title ?? ""}
          description={mobileComingSoon[1]?.description ?? ""}
          icon={mobileComingSoon[1]?.icon ?? ""}
        />

        {/* Bottom black row — live `u-bg-grid-wrap.is-bottom` last row: 5 black
            (#07060D) grid cells with white stroke lines, the leftmost clipped to a
            triangle (#triangleClip) for the diagonal edge. Grid-aligned at y3500. */}
        <div
          className="absolute left-0 flex"
          style={{ top: 3500, width: 500, height: 100 }}
          aria-hidden
        >
          {[0, 1, 2, 3, 4].map((c) => (
            <div
              key={c}
              className="bg-inverted-primary border-r border-b border-white/10 [[data-theme=light]_&]:border-black/[0.06]"
              style={{
                width: 100,
                height: 100,
                clipPath: c === 0 ? "url(#triangleClip)" : undefined,
              }}
            />
          ))}
        </div>

        {/* Grid rows + spacer after the triangle — live continues the dark grid
            below the black row (`is-bottom` tail) then a grid spacer row
            (`u-bg-grid-wrap.is-spacer`, ~100px) before the next section. */}
        {[3600, 3700].map((rowTop) => (
          <div
            key={rowTop}
            className="absolute left-0 flex"
            style={{ top: rowTop, width: 500, height: 100 }}
            aria-hidden
          >
            {[0, 1, 2, 3, 4].map((c) => (
              <div
                key={c}
                className="bg-inverted-primary border-r border-b border-white/10 [[data-theme=light]_&]:border-black/[0.06]"
                style={{ width: 100, height: 100 }}
              />
            ))}
          </div>
        ))}
      </MobileStage>
    </section>
  );
}

/* ─── Mobile sub-components ─────────────────────────────────────────────── */

// Card start tops. First card at the live line position (y549); each subsequent
// card = prev top + prev rendered height (560/526/554) + a 48px gap between cards.
const MOBILE_CARD_TOPS = [549, 1157, 1731, 2333];

export function MobileBadge({ text }: { text: string }) {
  return (
    <div className="relative inline-flex items-center px-[12px] py-[6px] border-r border-b border-l border-[#707bb7] self-start">
      <span className="absolute top-0 left-0 size-[6px] pointer-events-none text-[#707bb7]">
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
          <path d="M0 0H6L0 6V0Z" fill="currentColor" />
        </svg>
      </span>
      <span className="text-desktop-mono-medium text-[rgba(255,255,255,0.7)] whitespace-nowrap pt-[1px]">
        {text}
      </span>
      <span className="absolute bottom-0 right-0 size-[6px] pointer-events-none text-[#707bb7]">
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
          <path d="M6 6H0L6 0V6Z" fill="currentColor" />
        </svg>
      </span>
    </div>
  );
}

export function MobileProductCard({
  top,
  badge,
  title,
  subtitle,
  description,
  wireIcon,
  dotColor,
  exploreText,
  poweredByLogo,
  mobileVideo,
  mediaFirst = false,
  exploreBody = false,
}: OmsMobileProductItem & {
  top: number;
  mediaFirst?: boolean;
  /** Render the explore label as 16px title-case body (live Wallet card) instead
   *  of uppercase mono. */
  exploreBody?: boolean;
}) {
  return (
    <div
      className="group absolute flex flex-col border-t border-[#707bb7]"
      style={{ top, left: 21, width: 459, gap: 16 }}
    >
      {/* Badge — hangs from the card's top border line (live `oms-lottie-card`
          border-top extends full width; the badge sits at its left end). */}
      <MobileBadge text={badge} />

      {/* Heading — 28px / 28px (1.0) */}
      <h3
        className="text-white whitespace-pre-line"
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 300,
          fontSize: 28,
          lineHeight: "28px",
          letterSpacing: "-0.28px",
        }}
      >
        {title}
      </h3>

      {/* Subtitle — live: 13px mono / lh 14.3 / +0.13px, uppercase, op70 */}
      <p
        className="uppercase text-[rgba(255,255,255,0.7)]"
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 400,
          fontSize: 13,
          lineHeight: "14.3px",
          letterSpacing: "0.13px",
        }}
      >
        {subtitle}
      </p>

      {/* Description — live: 14px / lh 19.6 (1.4), op70.
          mediaFirst (OMS page) flows it BELOW the video/explore bar via CSS order. */}
      <p
        className="text-[rgba(255,255,255,0.7)]"
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "19.6px",
          order: mediaFirst ? 2 : 0,
        }}
      >
        {description}
      </p>

      {/* POWERED BY + logo */}
      {poweredByLogo && (
        <div className="flex items-center gap-[12px]" style={{ order: mediaFirst ? 3 : 0 }}>
          <span className="text-desktop-mono-small uppercase text-[rgba(255,255,255,0.7)]">
            powered by
          </span>
          <Image
            src={poweredByLogo}
            alt=""
            width={120}
            height={20}
            className="h-[20px] w-auto object-contain"
            unoptimized
          />
        </div>
      )}

      {/* Video + explore bar — flush (no flex gap); live joins them so the video's
          bottom edge IS the explore bar's top border. */}
      <div className="flex  flex-col" style={{ order: mediaFirst ? 1 : 0 }}>
        {/* Mobile loop video — live `oms-mobile-video-embed`: 459×200, border on
          top/left/right only (no bottom — it joins the explore bar below).
          object-CONTAIN so the full 620×620 square video shows (not cropped). */}
        <div
          className="relative w-full overflow-hidden border-t border-l border-r border-[#707bb7]"
          style={{ height: 200 }}
        >
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            autoPlay
            muted
            loop
            playsInline
            src={mobileVideo}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Explore bar — live `oms-button-wrap`: w459 h61, TWO EQUAL halves (230 each),
          not a 1fr/2fr grid. Left half = wire icon; right half = colored dot +
          explore text + the colored arrow box. The bar outline is a cut-corner
          rectangle (bevel at the bottom-right), drawn full-size so every border
          line is visible. */}
        <div className="relative flex" style={{ height: 116 }}>
          {/* Full-bar cut-corner outline — top/left/right/bottom with a 14px bevel
            at the bottom-right corner (preserveAspectRatio none → fills exactly). */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ color: "#707bb7", width: "100%", height: "100%" }}
            viewBox="0 0 459 61"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0.5 0.5 H458.5 V46 L444 60.5 H0.5 Z"
              stroke="currentColor"
            />
          </svg>
          {/* Vertical divider between the two halves (live `oms-button-left` right edge) */}
          <div
            className="absolute top-0 bottom-0 w-px bg-[#707bb7] pointer-events-none"
            style={{ left: 230 }}
          />
          {/* Left half (230) — wire icon, 180px wide & fully visible (live lets it
            overflow the 60px bar height; overflow-visible keeps it uncropped).
            Shifted down so it overflows BELOW the bar like live, not up into the
            video above. */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: 230 }}
          >
            <Image
              src={wireIcon}
              alt=""
              width={180}
              height={20}
              className="object-contain "
              style={{
                width: 180,
                height: "auto",
                // transform: "translateY(28px)",
              }}
              unoptimized
            />
          </div>
          {/* Right half (229) — dot + explore text + colored arrow box */}
          <div className="relative flex flex-1 items-center justify-between px-[14px]">
            <div className="flex items-center gap-[10px]">
              <DotHex color={dotColor ?? "#707bb7"} />
              <span
                className={
                  exploreBody
                    ? "text-desktop-body text-white"
                    : "text-desktop-mono-small uppercase text-white"
                }
              >
                {exploreText}
              </span>
            </div>
            {/* Colored arrow box — shown by default on mobile */}
            <div
              className="relative shrink-0"
              style={{ width: 44, height: 36 }}
            >
              <svg
                width="44"
                height="36"
                viewBox="0 0 44 36"
                fill="none"
                className="absolute inset-0"
              >
                <path d={ARROW_BOX} fill={dotColor ?? "#707bb7"} />
                <path d={ARROW_TRI} fill="#07060D" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileComingSoonCard({
  top,
  title,
  description,
  icon,
}: {
  top: number;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div
      className="absolute flex flex-col border-t border-[var(--semi-transparent-blue)]"
      style={{ top, left: 21, width: 459, gap: 16 }}
    >
      {/* COMING SOON badge — hangs from the card's top-border line (no top border) */}
      <div className="relative inline-flex items-center px-[12px] py-[6px] border-r border-b border-l border-[var(--semi-transparent-blue)] self-start">
        <span className="absolute top-0 left-0 size-[6px] pointer-events-none text-[var(--semi-transparent-blue)]">
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <path d="M0 0H6L0 6V0Z" fill="currentColor" />
          </svg>
        </span>
        <span className="text-desktop-mono-medium text-[rgba(255,255,255,0.7)] whitespace-nowrap pt-[1px]">
          coming soon
        </span>
        <span className="absolute bottom-0 right-0 size-[6px] pointer-events-none text-[var(--semi-transparent-blue)]">
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <path d="M6 6H0L6 0V6Z" fill="currentColor" />
          </svg>
        </span>
      </div>

      {/* Icon box — cut-corner border container with the 3D icon */}
      <div className="relative" style={{ width: 110, height: 84 }}>
        <Image
          src="/assets/product-card-container.svg"
          alt=""
          fill
          className="object-fill"
          unoptimized
        />
        <Image
          src={icon}
          alt=""
          fill
          className="object-contain p-[16px]"
          unoptimized
        />
      </div>

      {/* Title — live `u-h4-new`: 24px / lh 30 / -0.24px */}
      <h3
        className="text-white"
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 300,
          fontSize: 24,
          lineHeight: "30px",
          letterSpacing: "-0.24px",
        }}
      >
        {title}
      </h3>

      {/* Subtitle — live: 13px mono / lh 14.3 / uppercase op70 */}
      <p
        className="uppercase text-[rgba(255,255,255,0.7)]"
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 400,
          fontSize: 13,
          lineHeight: "14.3px",
          letterSpacing: "0.13px",
        }}
      >
        {description}
      </p>
    </div>
  );
}
