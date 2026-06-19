import Image from "next/image";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DesktopStage, MobileStage } from "@/components/ui/stage";

/* ── Stat data ──────────────────────────────────────────────────────────────
 * Values, labels and per-card icon art extracted from live polygon.technology
 * /open-money-stack. Each card has a light + dark icon variant (webp). Card 03
 * uses one shared asset for both themes (live references the same file twice).
 * Stored in number order (01..06); desktop positions each explicitly. */
type Stat = {
  num: string;
  value: string;
  label: string;
  light: string;
  dark: string;
};

const STATS: Stat[] = [
  {
    num: "01",
    value: "159M",
    label: "Unique wallet addresses",
    light: "/assets/oms-page/stat-card-1-light.webp",
    dark: "/assets/oms-page/stat-card-1-dark.webp",
  },
  {
    num: "02",
    value: "54B",
    label: "Stablecoin transfer volume",
    light: "/assets/oms-page/stat-card-2-light.webp",
    dark: "/assets/oms-page/stat-card-2-dark.webp",
  },
  {
    num: "03",
    value: "3.4B",
    label: "Stablecoin supply",
    light: "/assets/oms-page/stat-card-3.webp",
    dark: "/assets/oms-page/stat-card-3.webp",
  },
  {
    num: "04",
    value: "110",
    label: "Transactions per second",
    light: "/assets/oms-page/stat-card-4-light.webp",
    dark: "/assets/oms-page/stat-card-4-dark.webp",
  },
  {
    num: "05",
    value: "$0.002",
    label: "Average transaction cost",
    light: "/assets/oms-page/stat-card-5-light.webp",
    dark: "/assets/oms-page/stat-card-5-dark.webp",
  },
  {
    num: "06",
    value: "7B",
    label: "Total transactions",
    light: "/assets/oms-page/stat-card-6-light.webp",
    dark: "/assets/oms-page/stat-card-6-dark.webp",
  },
];

/* Desktop card placement (1440 canvas, section-relative). Cards are the
 * `.h-feature-card.is-oms` box = 434×256, laid out in a 3-column zig-zag.
 * x ∈ {40, 502, 965} (≈28px gutter), y pitch ≈ 284. Order is by stat number. */
const DESKTOP_POS: Record<string, { x: number; y: number }> = {
  "01": { x: 965, y: 0 },
  "02": { x: 502, y: 252 },
  "03": { x: 40, y: 537 },
  "04": { x: 965, y: 537 },
  "05": { x: 502, y: 821 },
  "06": { x: 40, y: 1106 },
};

// Live DOM / mobile stacking order (159M, 54B, 3.4B, $0.002, 110, 7B): the index
// numbers stay 01..06 tied to each value, but card 05 ($0.002) renders before 04.
const MOBILE_ORDER = ["01", "02", "03", "05", "04", "06"];
const byNum = (n: string) => STATS.find((s) => s.num === n)!;

const DESKTOP_H = 1394;
const MOBILE_W = 500;
// 6 cards at 467×229, x16, first at y213, pitch ≈284 → last bottom 1865.
const MOBILE_FIRST_Y = 213;
const MOBILE_PITCH = 284.4;
const MOBILE_H = 1865;

/* frameClip — exact cut-corner clip path from live (#frameClip, objectBoundingBox,
 * authored at 420×248). Long top-left chamfer, short bottom-right chamfer. */
const FRAME_CLIP = (
  <clipPath
    id="statsFrameClip"
    clipPathUnits="objectBoundingBox"
    transform="scale(0.002381, 0.004032)"
  >
    <path d="M71.552 0H415.98C418.189 0 419.98 1.791 419.98 4L420 208.055C420 209.009 419.61 209.923 418.921 210.583L381.393 246.527C380.741 247.151 379.873 247.5 378.971 247.5H4C1.791 247.5 0 245.709 0 243.5V76.5L0.022 76L0.005 70.184C0.002 69.239 0.381 68.333 1.055 67.673L69.103 1.5C69.716 0.899 70.527 0.546 71.381 0.504L71.552 0Z" />
  </clipPath>
);

/* Border outline SVGs — exact stroke paths from live `.feature-card-bg-embed`.
 * Desktop variant authored on 420×248, mobile on 343×168. stroke=currentColor
 * (text-grey-200 → #A0A1A6 dark / #686D73 light). */
function CardBorder({ mobile = false }: { mobile?: boolean }) {
  return mobile ? (
    <svg
      className="absolute inset-0 h-full w-full text-grey-200"
      width="100%"
      height="100%"
      viewBox="0 0 343 168"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M31.5195 0.5H338.98C340.913 0.500241 342.48 2.06667 342.48 3.99902L342.5 149.989L342.495 150.174C342.447 151.094 342.036 151.961 341.35 152.583L325.885 166.594C325.241 167.177 324.403 167.5 323.535 167.5H4C2.06701 167.5 0.5 165.933 0.5 164V76.5H0.521484V76L0.500977 30.2119C0.500558 29.2536 0.893114 28.3367 1.58691 27.6758L29.1055 1.46582C29.7156 0.884758 30.5137 0.544147 31.3516 0.503906L31.5195 0.5Z"
        stroke="currentColor"
      />
    </svg>
  ) : (
    <svg
      className="absolute inset-0 h-full w-full text-grey-200"
      width="100%"
      height="100%"
      viewBox="0 0 420 248"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M71.5518 0.5H415.98C417.913 0.500234 419.48 2.06666 419.48 3.99902L419.5 208.055C419.5 209.009 419.11 209.923 418.421 210.583L380.893 246.527C380.241 247.151 379.373 247.5 378.471 247.5H4C2.067 247.5 0.5 245.933 0.5 244V76.5H0.522461L0.521484 75.999L0.504883 70.1836C0.502225 69.2394 0.880641 68.3334 1.55469 67.6729L69.1025 1.5C69.7159 0.899191 70.5273 0.545647 71.3809 0.503906L71.5518 0.5Z"
        stroke="currentColor"
      />
    </svg>
  );
}

/* Top-left corner tick — exact 10×10 path from live `.h-feature-card-icon`. */
function CornerTick({ className }: { className?: string }) {
  return (
    <span className={`absolute size-[8px] text-primary ${className ?? ""}`}>
      <svg width="100%" height="100%" viewBox="0 0 10 10" fill="none" aria-hidden>
        <path
          d="M8.79395 9.29395H0.501052C0.0555997 9.29395 -0.167485 8.75538 0.147498 8.44039L8.44039 0.147499C8.75537 -0.167484 9.29395 0.0555996 9.29395 0.501052V8.79395C9.29395 9.07009 9.07009 9.29395 8.79395 9.29395Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

/* One stat card. `mobile` switches the border SVG, typography and spacing to the
 * mobile measurements. Card box: 434×256 desktop / 467×229 mobile. */
function StatCard({ stat, mobile = false }: { stat: Stat; mobile?: boolean }) {
  return (
    <div className="relative h-full w-full">
      {/* Cut-corner fill — bg-inverted-primary clipped to the frame shape */}
      <div
        className="absolute inset-0 bg-inverted-primary"
        style={{ clipPath: "url(#statsFrameClip)" }}
      />
      {/* Stroke outline (exact live path) */}
      <CardBorder mobile={mobile} />
      {/* Corner tick (8×8 at 13,13 — identical desktop/mobile) */}
      <CornerTick className="left-[13px] top-[13px]" />

      {/* Icon art — top-right; light/dark variants flip via CSS. The icon webp is
          216×204; rendered at 97×92 (right:18, top:41) reproduces the live glyph. */}
      <div className="absolute" style={{ right: 18, top: 41, width: 97, height: 92 }}>
        <Image
          src={stat.dark}
          alt=""
          fill
          className="object-contain hidden [[data-theme=dark]_&]:block"
          unoptimized
        />
        <Image
          src={stat.light}
          alt=""
          fill
          className="object-contain block [[data-theme=dark]_&]:hidden"
          unoptimized
        />
      </div>

      {/* Value — top-left */}
      <p
        className="absolute font-heading font-[300] text-primary"
        style={
          mobile
            ? { left: 56, top: 30, fontSize: 28, letterSpacing: "-0.28px", lineHeight: "28px" }
            : { left: 74, top: 30, fontSize: 36, letterSpacing: "-0.36px", lineHeight: "45px" }
        }
      >
        {stat.value}
      </p>

      {/* Index number — bottom-left */}
      <p
        className="absolute font-mono text-grey-200 uppercase"
        style={
          mobile
            ? { left: 38, top: 185, fontSize: 12, lineHeight: "12px" }
            : { left: 18, top: 212, fontSize: 12, lineHeight: "12px" }
        }
      >
        {stat.num}
      </p>

      {/* Label — bottom */}
      <p
        className="absolute font-mono text-grey-200 uppercase"
        style={
          mobile
            ? { left: 56, top: 185, fontSize: 14, lineHeight: "14px" }
            : { left: 74, top: 212, fontSize: 14, lineHeight: "14px" }
        }
      >
        {stat.label}
      </p>
    </div>
  );
}

export function StatsBand() {
  return (
    <section
      className="relative w-full bg-background"
      style={{ containerType: "inline-size" }}
    >
      {/* Shared SVG defs (clip path) */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>{FRAME_CLIP}</defs>
      </svg>

      {/* ── Desktop (≥768px) ─────────────────────────────────────────────── */}
      <DesktopStage className="hidden md:block" height={DESKTOP_H}>
        {/* Heading — live u-h2 64px / lh1.1 / -1.28px, indented to clear eyebrow */}
        <h2
          className="absolute left-[40px] top-[14px] w-[560px] text-desktop-h2 text-primary"
          style={{ textIndent: "120px", lineHeight: "1.1" }}
        >
          Real usage, not just promises
        </h2>
        <div className="absolute left-[40px] top-[26px]">
          <Eyebrow text="STATS" borderColor="grey-200" textColor="primary" />
        </div>

        {STATS.map((stat) => {
          const pos = DESKTOP_POS[stat.num];
          return (
            <div
              key={stat.num}
              className="absolute"
              style={{ left: pos.x, top: pos.y, width: 434, height: 256 }}
            >
              <StatCard stat={stat} />
            </div>
          );
        })}
      </DesktopStage>

      {/* ── Mobile (<768px) ──────────────────────────────────────────────── */}
      <MobileStage className="md:hidden" width={MOBILE_W} height={MOBILE_H}>
        <h2
          className="absolute left-[16px] top-[14px] w-[380px] font-heading font-light text-primary text-[43.2px] leading-[1.3] tracking-[-0.864px]"
          style={{ textIndent: "84px" }}
        >
          Real usage, not just promises
        </h2>
        <div className="absolute left-[16px] top-[16px]">
          <Eyebrow text="STATS" borderColor="grey-200" textColor="primary" />
        </div>

        {MOBILE_ORDER.map((num, i) => (
          <div
            key={num}
            className="absolute"
            style={{
              left: 16,
              top: MOBILE_FIRST_Y + i * MOBILE_PITCH,
              width: 467,
              height: 229,
            }}
          >
            <StatCard stat={byNum(num)} mobile />
          </div>
        ))}
      </MobileStage>
    </section>
  );
}
