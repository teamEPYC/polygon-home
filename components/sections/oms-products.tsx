import Image from "next/image";
import { OmsVideoPlayer } from "@/components/ui/oms-video-player";
import { OMSStaircase } from "./oms-staircase";
import { ScrambleText } from "@/components/ui/scramble-text";
import { MobileStage } from "@/components/ui/stage";
import { Eyebrow } from "@/components/ui/eyebrow";
import {
  DotHex,
  ExploreArrow,
  MobileProductCard,
  MobileComingSoonCard,
} from "./open-money-stack";

const STAGE_H = 2595;
const HEADING = "Global rails for upgraded money";
const BODY =
  "One stack for wallets, compliance, on- and off-ramps, and settlement. Built to plug into existing systems and move money in seconds.";
const EYEBROW = "PRODUCTS";

type Side = "left" | "right";

type Product = {
  side: Side;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  wireIcon: string;
  dot: string;
  explore: string;
  /** When true, the explore label renders as text-desktop-body (16px, title-case)
   *  instead of the default text-desktop-mono-small uppercase. Only for Wallet
   *  Infrastructure per live polygon.technology/open-money-stack. */
  exploreBody?: boolean;
  logo: string | null;
  top: number;
};

// Exact OMS copy + per-row dot colors. Wire icons / powered-by logos reuse the
// existing repo assets (verified against live in Task 4).
const PRODUCTS: Product[] = [
  {
    side: "left", tag: "LIVE", title: "Wallet Infrastructure",
    subtitle: "one-click wallet creation to give your users an onchain account",
    description: "Easily onboard users with a single wallet address with zero-config auth and enterprise-grade security.",
    wireIcon: "/assets/ico-wire-chains.png", dot: "#00FF08",
    explore: "Explore Sequence", exploreBody: true, logo: "/assets/logo-sequence.png", top: 792,
  },
  {
    side: "right", tag: "LIVE", title: "Crosschain Interop",
    subtitle: "one-click crypto transactions with any chain",
    description: "All-in-one integration, enabling users to transact with any wallet, any token, on any chain, bringing deep unified liquidity.",
    wireIcon: "/assets/ico-wire-trails.png", dot: "#E271D7",
    explore: "Get API key", logo: "/assets/logo-trails.svg", top: 1122,
  },
  {
    side: "left", tag: "LIVE", title: "On/Off and\nCash Ramps",
    subtitle: "Physical cash and digital fiat on- and off-ramps",
    description: "Grow your revenue by offering on- and off-ramps, pay with crypto, earn yield, and more. All with enterprise-grade security.",
    wireIcon: "/assets/ico-wire-wallet.png", dot: "#FF7421",
    explore: "Explore On/Off Cash Ramps", logo: "/assets/logo-coinme.png", top: 1465,
  },
  {
    side: "right", tag: "LIVE", title: "Blockchain Rails",
    subtitle: "The go-to settlement layer to move money globally",
    description: "Use crypto to offer faster, cheaper payments, anywhere in the world.",
    wireIcon: "/assets/ico-wire-bpn.png", dot: "#00BBFF",
    explore: "Explore Polygon Chain", logo: null, top: 1827,
  },
];

// ─── Mobile geometry (≤767px) ───────────────────────────────────────────────
// All values extracted from live polygon.technology/open-money-stack @500px
// (cdp-eval). Section is a single 500-wide stacked column; height 3328.
const MOBILE_STAGE_H = 3328;
// Per-card top within the stage (live .oms-lottie-card top, relative to section).
const MOBILE_CARD_TOPS = [593, 1166, 1684, 2245];
// Coming-soon card tops (Stablecoin Orchestration / KYC Hub).
const MOBILE_COMING_SOON_TOPS = [2707, 2881];
// Per-row mobile loop videos — same 4 renders as the homepage OMS section,
// in product order: chains, trails, wallet (sphere), bpn.
const MOBILE_VIDEOS = [
  "/assets/oms-mobile-chains.webm",
  "/assets/oms-mobile-trails.webm",
  "/assets/oms-mobile-wallet.webm",
  "/assets/oms-mobile-bpn.webm",
];

// Coming-soon content (shared between desktop cards below and mobile block).
const COMING_SOON = [
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

// OMS-specific coming-soon card — matches live anatomy on /open-money-stack.
// border-top 1px #707bb7 (semi-transparent-blue); width 648.
// Layout: plain bordered COMING SOON badge (no corner ticks) + horizontal row
// (icon box left, text right).
function OmsComingSoonCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div
      className="relative flex flex-col border-t border-[#707bb7]"
      style={{ width: 648 }}
    >
      {/* Badge — plain bordered rectangle, no corner ticks. Hangs from the card's
          top border, self-start so it sits at the card's top-left. */}
      <div className="inline-flex items-center self-start px-[12px] py-[6px] border border-[#707bb7]">
        <span className="text-desktop-mono-medium text-[rgba(255,255,255,0.7)] whitespace-nowrap pt-[1px]">
          COMING SOON
        </span>
      </div>

      {/* Content row — icon box + text, starts ~45px below the border line
          (badge height ~29px + gap 16px ≈ 45px). Gap ~21px between icon and text. */}
      <div className="flex flex-row items-start gap-[21px] mt-[16px]">
        {/* Icon box — 151×98, cut-corner (beveled) border via product-card-container.svg,
            3D icon on top, hex dot indicator at top-left (x11, y11). */}
        <div className="relative shrink-0" style={{ width: 151, height: 98 }}>
          <Image
            src="/assets/product-card-container.svg"
            alt=""
            fill
            className="object-fill"
            unoptimized
          />
          <Image src={icon} alt="" fill className="object-contain p-[12px]" unoptimized />
          <div className="absolute" style={{ left: 11, top: 11 }}>
            <DotHex color="#C590E5" />
          </div>
        </div>

        {/* Text column — title h4 + subtitle, starts ~x231 within card (151 icon + 21 gap = 172;
            close enough to the 231 live coord accounting for card's own border/padding). */}
        <div className="flex flex-col gap-[28px]">
          <h4 className="text-desktop-h4 text-white">{title}</h4>
          <p className="text-desktop-mono-medium uppercase text-[rgba(255,255,255,0.7)]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

// Per-side geometry. Card box carries the border-top line; content column is
// pinned to the outer margin so the line overshoots toward center (behind video).
const SIDE: Record<Side, { left: number; width: number; content: number; btnW: number }> = {
  left:  { left: 59,  width: 596, content: 417, btnW: 316 },
  right: { left: 853, width: 530, content: 371, btnW: 304 },
};

function OmsProductCard(p: Product) {
  const g = SIDE[p.side];
  const right = p.side === "right";
  const exploreClass = p.exploreBody
    ? "text-desktop-body text-white text-right"
    : "text-desktop-mono-small uppercase text-white text-right";
  return (
    <a
      href="#"
      className="scramble-host group absolute border-t border-[#707bb7] hover:border-white transition-colors cursor-pointer [--bc:#707bb7] hover:[--bc:white]"
      style={{ top: p.top, left: g.left, width: g.width }}
    >
      <div className={`flex flex-col gap-[16px] ${right ? "ml-auto items-end text-right" : "items-start text-left"}`} style={{ width: g.content }}>
        {/* Badge — plain bordered rectangle (live OMS page has NO corner ticks),
            white text. self-start/-end per side. */}
        <div className={`relative inline-flex items-center px-[12px] py-[6px] border border-[var(--bc)] transition-colors ${right ? "self-end" : "self-start"}`}>
          <span className="text-desktop-mono-medium text-white whitespace-nowrap pt-[1px]">{p.tag}</span>
        </div>

        {/* Heading + subtitle */}
        <div className="flex flex-col gap-[8px] w-full">
          <h3 className="text-desktop-h3 text-[rgba(255,255,255,0.7)] group-hover:text-white transition-colors whitespace-pre-line">{p.title}</h3>
          <p className="text-desktop-mono-medium uppercase text-[rgba(255,255,255,0.7)]">{p.subtitle}</p>
        </div>

        {/* Button-wrap — wire icon cell + explore cell */}
        <div className="grid grid-cols-2 border-t border-[var(--bc)] transition-colors" style={{ width: g.btnW }}>
          <div className="relative border-l border-b border-[var(--bc)] transition-colors flex items-center justify-start" style={{ minHeight: 100 }}>
            <Image src={p.wireIcon} alt="" width={151} height={98} className="object-contain max-w-[151px]" unoptimized />
            <div className="absolute" style={{ left: 11, top: 11 }}><DotHex color={p.dot} /></div>
          </div>
          <div className="relative flex flex-col justify-between items-end p-[14px]" style={{ minHeight: 100 }}>
            <svg className="absolute inset-0 pointer-events-none" style={{ color: "var(--bc)", width: "100%", height: "100%" }} viewBox="-1 -1 158 102" preserveAspectRatio="none" fill="none">
              {/* Cut-corner box: right + bevel + bottom + left edges only. The
                  top edge is intentionally NOT drawn here — the button-wrap grid's
                  `border-t` already provides it, so redrawing it caused a double line. */}
              <path d="M154 0.5C154.828 0.5 155.5 1.17157 155.5 2V83.2881C155.5 84.2245 155.124 85.1227 154.458 85.7803L141.576 98.4912C140.921 99.1374 140.038 99.5 139.118 99.5H0.5V0.5" stroke="currentColor" />
            </svg>
            <span className={exploreClass}><ScrambleText>{p.explore}</ScrambleText></span>
            <ExploreArrow color={p.dot} />
          </div>
        </div>

        {/* Description */}
        <p className="text-desktop-body text-[rgba(255,255,255,0.7)] leading-[1.4] w-full">{p.description}</p>

        {/* Powered by */}
        {p.logo && (
          <div className={`flex items-center gap-[12px] mt-[10px] ${right ? "flex-row-reverse" : ""}`}>
            <span className="text-desktop-mono-small uppercase text-[rgba(255,255,255,0.7)]">powered by</span>
            <Image src={p.logo} alt="" width={120} height={20} className="h-[20px] w-auto object-contain" unoptimized />
          </div>
        )}
      </div>
    </a>
  );
}

export function OmsProducts() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#3449c1]"
      style={{ containerType: "inline-size" }}
    >
      <div
        className="relative hidden w-full overflow-hidden md:block"
        style={{ aspectRatio: `1440 / ${STAGE_H}` }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: 1440, height: STAGE_H, transform: "scale(calc(100cqw / 1440px))" }}
        >
          {/* Background — live OMS `.sec.is-blue` keeps a #3449C1 base bright blue
              across the whole body and darkens to solid #141B6B only in a band at
              the very top and bottom edges (sampled: y200 = exact #141B6B, body
              y700–2150 ≈ #283FB2/blue). A vertical gradient matches this far better
              than the homepage's center radial (which bottomed out near-black). */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "linear-gradient(180deg, #141b6b 0%, #141b6b 11%, rgba(20,27,107,0.18) 25%, rgba(20,27,107,0.18) 78%, #141b6b 96%)" }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "120px 120px",
            }}
          />

          {/* Top platform + eyebrow (reused) */}
          <OMSStaircase eyebrow={EYEBROW} />

          {/* Heading — text-desktop-h2, centered, 2-line wrap */}
          <p
            className="absolute left-1/2 -translate-x-1/2 text-desktop-h2 text-white text-center w-[560px]"
            style={{ top: 460 }}
          >
            {HEADING}
          </p>

          {/* Body — 18px body-large, centered */}
          <p
            className="absolute left-1/2 -translate-x-1/2 text-desktop-body-large text-white text-center w-[660px]"
            style={{ top: 606 }}
          >
            {BODY}
          </p>

          {/* Central video column — reused asset, 390px wide, centered */}
          <div className="absolute left-1/2 -translate-x-1/2 w-[390px] z-10" style={{ top: 722 }}>
            <OmsVideoPlayer />
          </div>

          {PRODUCTS.map((p) => (
            <OmsProductCard key={p.title} {...p} />
          ))}

          {/* Coming-soon cards — Stablecoin (left x59) / KYC Hub (right x735), y2150 */}
          <div className="absolute" style={{ top: 2150, left: 59 }}>
            <OmsComingSoonCard
              title="Stablecoin Orchestration"
              description="Enterprise payments infrastructure for stablecoins and tokenized deposits"
              icon="/assets/ico-pay.png"
            />
          </div>
          <div className="absolute" style={{ top: 2150, left: 735 }}>
            <OmsComingSoonCard
              title="KYC Hub"
              description="Manage all payments-related KYC in one place. Worry about your customers while we take care of the rest."
              icon="/assets/ico-kit.png"
            />
          </div>

          {/* Bottom inverted-primary grid band — reuse the homepage SVG (y2235 h121
              row of cells with a diagonal-cut leftmost corner). Theme tokens flip. */}
          <svg
            className="absolute left-0 w-full h-[121px]"
            style={{ top: 2474 }}
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
            <rect x="1.20711" y="1.20711" width="120" height="120" fill="none" stroke="var(--grid-stroke)" />
          </svg>
        </div>
      </div>

      {/* ─── MOBILE (≤767px) ─────────────────────────────────────────────────
          Single-column stacked cards. Reuses the homepage OMS mobile primitives
          (MobileProductCard / MobileComingSoonCard); only the copy, background,
          card tops, and the header (no CTA) differ. Geometry extracted from live
          /open-money-stack @500px. */}
      <MobileStage className="md:hidden" width={500} height={MOBILE_STAGE_H}>
        {/* Background — #3449C1 base + the SAME vertical vignette as desktop
            (live mobile darkens to #141b6b at top/bottom edges, brightest in the
            middle — verified by sampling live: ~#171e73 top → ~#2c46b7 mid →
            ~#223594 bottom). Without it the flat #3449c1 stayed too bright near
            the bottom band and read as a stray blue band. */}
        <div className="absolute inset-0 pointer-events-none bg-[#3449c1]" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #141b6b 0%, #141b6b 11%, rgba(20,27,107,0.18) 25%, rgba(20,27,107,0.18) 78%, #141b6b 96%)",
          }}
        />
        {/* Faint global grid — 100px cells (live u-bg-grid) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />

        {/* Top black staircase pedestal under the PRODUCTS eyebrow:
            row 1 = 3 cells (x100→400, y0), row 2 = 1 centered cell (x200→300, y100). */}
        <div className="absolute flex" style={{ top: 0, left: 100, height: 100 }} aria-hidden>
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

        {/* Eyebrow — centered, y57 (live). */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 57 }}>
          <Eyebrow text={EYEBROW} borderColor="white" textColor="white" hasDot />
        </div>

        {/* Heading — 32px / lh 33.92 (1.06) / -0.64px, centered, y300. */}
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
          {HEADING}
        </p>

        {/* Body — 16px / 22.4 (1.4), centered, y381. No CTA button on this page. */}
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
          {BODY}
        </p>

        {/* LIVE product cards — single column, stacked. */}
        {PRODUCTS.map((p, i) => (
          <MobileProductCard
            key={p.title}
            top={MOBILE_CARD_TOPS[i]}
            badge={p.tag}
            title={p.title}
            subtitle={p.subtitle}
            description={p.description}
            wireIcon={p.wireIcon}
            dotColor={p.dot}
            exploreText={p.explore}
            poweredByLogo={p.logo ?? undefined}
            mobileVideo={MOBILE_VIDEOS[i]}
            mediaFirst
            exploreBody={p.exploreBody}
          />
        ))}

        {/* COMING SOON cards */}
        {COMING_SOON.map((c, i) => (
          <MobileComingSoonCard
            key={c.title}
            top={MOBILE_COMING_SOON_TOPS[i]}
            title={c.title}
            description={c.description}
            icon={c.icon}
          />
        ))}

        {/* Bottom black grid row — 5 cells at y3228, leftmost triangle-clipped
            (live #triangleClip). Section ends at 3328. */}
        <div className="absolute left-0 flex" style={{ top: 3228, width: 500, height: 100 }} aria-hidden>
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
      </MobileStage>
    </section>
  );
}
