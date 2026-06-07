import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { BtnOutline } from "@/components/ui/btn-outline";
import { OMSStaircase } from "./oms-staircase";
import { OmsVideoPlayer } from "@/components/ui/oms-video-player";
import { ScrambleText } from "@/components/ui/scramble-text";

const CUT = 14;
const clipPath = `polygon(0 0, calc(100% - ${CUT}px) 0, 100% ${CUT}px, 100% 100%, 0 100%)`;

/* ─── OMS video tuning ────────────────────────────────────────────────────
 *  Video file: 620×1920px (3.1:1 portrait). Objects stacked vertically:
 *  chain → coil → ring → loop shape (each ~480px of the 1920px frame).
 *  Adjust these to align the objects with the product rows.
 */
const VIDEO_TOP = 830; // px from OMS section top — where the video starts
const VIDEO_WIDTH = "19vw"; // live site CSS value (~435px at 1440px viewport)

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
        stroke="var(--color-primary)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
    <div className="scramble-host group flex justify-between border-t border-[#707bb7] hover:border-white transition-colors w-full [--bc:#707bb7] hover:[--bc:white] pt-[28px]">
      {/* LEFT — oms-lottie-left */}
      <div className="flex flex-col gap-[16px] max-w-[70%]">
        {/* Badge — oms-product-tag: border + corner ticks */}
        <div className="relative inline-flex items-center gap-[10px] px-[12px] py-[6px] border border-[var(--bc)] transition-colors self-start">
          <span className="absolute top-0 left-0 size-[6px] pointer-events-none text-[var(--bc)] transition-colors">
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <path d="M0 0H6L0 6V0Z" fill="currentColor" />
            </svg>
          </span>
          <span className="font-mono text-[12px] leading-[1.1] tracking-[0.12px] uppercase text-[rgba(255,255,255,0.7)] group-hover:text-white transition-colors whitespace-nowrap pt-[1px]">
            {badge}
          </span>
          <span className="absolute bottom-0 right-0 size-[6px] pointer-events-none text-[var(--bc)] transition-colors">
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <path d="M6 6H0L6 0V6Z" fill="currentColor" />
            </svg>
          </span>
        </div>

        {/* Title — u-h3-new: 36px, 1.25 line-height, -0.01em tracking */}
        <h3 className="font-heading font-[300] text-[36px] leading-[1.25] tracking-[-0.01em] text-[rgba(255,255,255,0.7)] group-hover:text-white transition-colors whitespace-pre-line">
          {title}
        </h3>

        {/* Subtitle — mono-medium, 70% opacity */}
        <p className="text-desktop-mono-medium uppercase text-[rgba(255,255,255,0.7)] group-hover:text-[rgba(255,255,255,0.7)]">
          {subtitle}
        </p>
      </div>

      {/* RIGHT — oms-card-right: max 30%, flex-col, gap-24px */}
      <div className="flex flex-col gap-[24px] w-[30%] min-w-[30%] shrink-0">
        {/* oms-button-wrap: 2-col grid, border-top */}
        <div className="grid grid-cols-2 border-t border-[var(--bc)] transition-colors -mt-[28px]">
          {/* Left cell — oms-button-left: wire icon, border-l border-b, -translate-y-px */}
          <div className="relative border-l border-b border-[var(--bc)] transition-colors flex items-center justify-start -translate-y-px" style={{ minHeight: 100 }}>
            <Image
              src={wireIcon}
              alt=""
              width={151}
              height={98}
              className="object-contain max-w-[151px]"
              unoptimized
            />
            {dotColor && (
              <div
                className="absolute rounded-full"
                style={{ left: 12, top: 12, width: 10, height: 8, backgroundColor: dotColor }}
              />
            )}
          </div>

          {/* Right cell — oms-button-right: SVG cut-corner border, explore text + arrow */}
          <div className="relative flex flex-col justify-between items-end p-[14px] -translate-y-px" style={{ minHeight: 100 }}>
            {/* Cut-corner SVG border — oms-button-right-embed */}
            <svg
              className="absolute pointer-events-none"
              style={{ inset: '-1px 0 0 0', zIndex: -1, color: 'var(--bc)', width: '100%', height: '100%' }}
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
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <BtnOutline variant="white" />
            </div>
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
  subtitle: string;
  description: string;
  icon: string;
};

function SecondaryCard({
  title,
  subtitle,
  description,
  icon,
}: SecondaryCardProps) {
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

      {/* Content */}
      <div className="flex flex-col justify-between h-[120px] mt-[43px] pl-[24px]">
        <div className="flex flex-col gap-[12px]">
          <Badge text="coming soon" variant="blue" />
          <div className="flex items-baseline gap-[8px] mt-[8px]">
            <span className="font-heading font-[300] text-[28px] leading-[1.14] text-[rgba(255,255,255,0.7)] whitespace-nowrap">
              Polygon
            </span>
            <span className="font-heading font-[300] text-[28px] leading-[1.14] text-grey-100 whitespace-nowrap">
              {title}
            </span>
          </div>
          <p
            className="text-desktop-mono-medium text-[rgba(255,255,255,0.7)] uppercase"
            style={{ fontFeatureSettings: '"dlig" 1' }}
          >
            {description}
          </p>
        </div>
        <BtnOutline />
      </div>
    </div>
  );
}

export function OpenMoneyStack() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#3449c1]"
      style={{ height: 2521 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/assets/products-bg.svg"
          alt=""
          fill
          className="object-cover object-top"
          unoptimized
        />
      </div>

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
      <OMSStaircase />

      {/* Heading */}
      <p
        className="absolute left-1/2 -translate-x-1/2 font-heading font-[300] text-[56px] leading-[60px] tracking-[-0.56px] text-grey-100 text-center w-[652px]"
        style={{ top: 416 }}
      >
        One open stack for money movement.
      </p>

      {/* Body text */}
      <p
        className="absolute left-1/2 -translate-x-1/2 text-desktop-body-large text-white text-center w-[778px]"
        style={{ top: 580 }}
      >
        A single place to instantly access the onchain economy, with worldwide
        distribution.
      </p>

      {/* GET EARLY ACCESS button */}
      <a
        href="#"
        className="scramble-host absolute inline-flex items-center gap-[8px] h-[52px] pl-[16px] pr-[32px] bg-inverted-primary text-primary hover:opacity-90 transition-opacity"
        style={{
          top: 662,
          left: "50%",
          transform: "translateX(-50%)",
          clipPath,
        }}
      >
        <span className="text-desktop-mono-small"><ScrambleText>GET EARLY ACCESS</ScrambleText></span>
        <ArrowIcon />
      </a>

      {/* Product sections — absolute, centered 1320px wide, starts at y=790 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[1320px] flex flex-col gap-[48px]"
        style={{ top: 790 }}
      >
        <ProductSection
          badge="LIVE"
          title="Wallet Infrastructure"
          subtitle="one-click wallet creation to give your users an onchain account"
          description="The Polygon Chain is fast, low cost, and battle-tested. Live for five years, with 99.99% uptime and millions of users, this is the best place to build onchain."
          wireIcon="/assets/ico-wire-chains.png"
          dotColor="#00FF08"
          exploreText="Explore Sequence"
          poweredByLogo="/assets/logo-sequence.png"
        />
        <ProductSection
          badge="LIVE"
          title="Crosschain Interop"
          subtitle="one-click crypto transactions with any chain"
          description="All-in-one integration, enabling users to transact with any wallet, any token, on any chain, bringing deep unified liquidity."
          wireIcon="/assets/ico-wire-trails.png"
          dotColor="#00BBFF"
          exploreText="Explore Trails"
          poweredByLogo="/assets/logo-trails.png"
        />
        <ProductSection
          badge="LIVE"
          title={"On/Off- and\nCash Ramps"}
          subtitle="Physical cash and digital fiat on- and off-ramps"
          description="Grow your revenue by offering on- and off-ramps, pay with crypto, earn yield, and more. All with enterprise-grade security."
          wireIcon="/assets/ico-wire-wallet.png"
          dotColor="#C590E5"
          exploreText="Explore Coinme"
          poweredByLogo="/assets/logo-coinme.png"
        />
        <ProductSection
          badge="LIVE"
          title="Blockchain Rails"
          subtitle="The fastest settlement layer to move money globally"
          description="Use crypto to offer faster, cheaper cross-border transfers."
          wireIcon="/assets/ico-wire-bpn.png"
          dotColor="#FF7421"
          exploreText="Explore Polygon Chain"
        />
      </div>

      {/* 3D animation — entrance video then seamless loop */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-10"
        style={{ top: VIDEO_TOP, width: VIDEO_WIDTH }}
      >
        <OmsVideoPlayer />
      </div>

      {/* Secondary cards */}
      <div
        className="absolute flex items-center justify-between w-[1320px]"
        style={{ top: 2068, left: 60 }}
      >
        <SecondaryCard
          title="Business Kit"
          subtitle="Polygon Business Kit"
          description="Scale your business with crypto payments"
          icon="/assets/ico-kit.png"
        />
        <SecondaryCard
          title="Pay"
          subtitle="Polygon Pay"
          description="One app for crypto payments"
          icon="/assets/ico-pay.png"
        />
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
        <g fill="var(--color-inverted-primary)" stroke="var(--color-stroke)">
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
    </section>
  );
}
