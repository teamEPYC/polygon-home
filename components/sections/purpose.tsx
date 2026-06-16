import Image from "next/image";
import { MobileStage } from "@/components/ui/stage";

/* ───────────────────────────────────────────────────────────────────────────
   Purpose / "benefits" section — Figma node 1727:42354 (1440×1320).
   Absolutely-positioned stage on a 1440px canvas to mirror the Figma frame.
   ─────────────────────────────────────────────────────────────────────────── */

const FRAME_W = 1440;
// Live's .section.is-featured is 1207 + a 122px spacer. We use 1320 (a clean 120px
// multiple) so the background grid ends exactly on a cell line and flows straight
// into the next section — the extra ~113px below the cards is the gridded gap,
// which avoids a blank/misaligned spacer band between the two grids.
const FRAME_H = 1320;
const CELL = 120;
const COLS = FRAME_W / CELL; // 12
const ROWS = Math.ceil(FRAME_H / CELL); // grid rows to cover the frame
// Live .h-feature-card.is-small = 431×254. Cards sit on a 3-col grid (x 58/505/951,
// 16px gaps) at rows 0/238/477/715/953 — all extracted from the live site.
const CARD_W = 431;
const CARD_H = 254;

/* ─── Feature Card data — exact copy + positions from Figma ───────────────── */
type CardData = {
  label: string;
  number: string;
  description: string;
  /** Live uses slightly different copy on the mobile slider — falls back to `description`. */
  mobileDescription?: string;
  /** Dark-theme illustration (also used in light when no light variant exists). */
  image: string;
  /** Light-theme illustration. Omit when the card uses the same render in both themes. */
  imageLight?: string;
  left: number;
  top: number;
};

const CARDS: CardData[] = [
  {
    label: "Reliability",
    number: "01",
    description: "5B+ transactions. 99.99% uptime. 0 calls to customer support.",
    // Live mobile slider copy differs from desktop.
    mobileDescription:
      "7B+ transactions. 99.99% uptime. 0 hours waiting in line at a bank.",
    // Live has only a single reliability render (no light variant) — same in both themes.
    image: "/assets/purpose/reliability.webp",
    left: 951,
    top: 0,
  },
  {
    label: "Speed",
    number: "02",
    description:
      "Why pay more to wait longer? Polygon settles instantly—yes, even on Sundays.",
    mobileDescription:
      "Polygon settles instantly—yes, even on Sundays. Fast finality has never felt so good.",
    image: "/assets/purpose/speed.webp",
    imageLight: "/assets/purpose/speed-light.webp",
    left: 505,
    top: 238,
  },
  {
    label: "Cost",
    number: "03",
    description:
      "Pay $0.001 to settle onchain. Keep the other $34.999. Wire transfer fee has left the chat.",
    image: "/assets/purpose/cost.webp",
    imageLight: "/assets/purpose/cost-light.webp",
    left: 951,
    top: 477,
  },
  {
    label: "Enterprise ready",
    number: "04",
    description:
      "Wallets? Yes. Onramps? Covered. Compliance-ready? Absolutely. Everything you need is already here.",
    image: "/assets/purpose/enterprise.webp",
    imageLight: "/assets/purpose/enterprise-light.webp",
    left: 58,
    top: 477,
  },
  {
    label: "Distribution",
    number: "05",
    description:
      "You don’t need to find liquidity and users. 156M active addresses are already doing business on Polygon.",
    mobileDescription:
      "You don’t need to find liquidity and users. 156 million active addresses are already doing business on Polygon.",
    image: "/assets/purpose/distribution.webp",
    imageLight: "/assets/purpose/distribution-light.webp",
    left: 505,
    top: 715,
  },
  {
    label: "Liquidity",
    number: "06",
    description:
      "Tap into billions in stablecoins and every major asset on a deeply liquid chain.",
    image: "/assets/purpose/liquidity.webp",
    imageLight: "/assets/purpose/liquidity-light.webp",
    left: 58,
    top: 953,
  },
];

/* ─── Feature Card ───────────────────────────────────────────────────────── */
function FeatureCard({
  label,
  number,
  description,
  image,
  imageLight,
  left,
  top,
}: CardData) {
  return (
    <div
      className="absolute overflow-hidden"
      style={{ left, top, width: CARD_W, height: CARD_H }}
    >
      {/* Card surface clipped to cut-corner shape (top-left + bottom-right cut) */}
      <div
        className="absolute inset-0 bg-inverted-primary"
        style={{
          clipPath:
            "polygon(17.04% 0%, 100% 0%, 100% 83.87%, 90.7% 99.4%, 0% 99.4%, 0% 30.65%, 16.48% 0%)",
        }}
      />

      {/* Cut-corner border — live stroke is grey-200 (#A0A1A6), not the faint
          background-grid stroke, so the cards read brighter than the grid. */}
      <svg
        className="absolute inset-0 h-full w-full text-grey-200"
        viewBox="0 0 420 248"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M71.5518 0.5H415.98C417.913 0.500234 419.48 2.06666 419.48 3.99902L419.5 208.055C419.5 209.009 419.11 209.923 418.421 210.583L380.893 246.527C380.241 247.151 379.373 247.5 378.471 247.5H4C2.067 247.5 0.5 245.933 0.5 244V76.5H0.522461L0.521484 75.999L0.504883 70.1836C0.502225 69.2394 0.880641 68.3334 1.55469 67.6729L69.1025 1.5C69.7159 0.899191 70.5273 0.545647 71.3809 0.503906L71.5518 0.5Z"
          stroke="currentColor"
        />
      </svg>

      {/* Corner diamond tick — top-left, 10px at (13,13). Live fill is WHITE
          (text-primary: #FFF dark / #07060D light), brighter than the border. */}
      <svg
        className="absolute text-primary"
        style={{ top: 13, left: 13, width: 10, height: 10 }}
        viewBox="0 0 10 10"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8.79395 9.29395H0.501052C0.0555997 9.29395 -0.167485 8.75538 0.147498 8.44039L8.44039 0.147499C8.75537 -0.167484 9.29395 0.0555996 9.29395 0.501052V8.79395C9.29395 9.07009 9.07009 9.29395 8.79395 9.29395Z"
          fill="currentColor"
        />
      </svg>

      {/* Feature icon — 108×102 at (280,32).
          Live swaps the illustration per theme (dark render vs light render).
          CSS dual-render: both in DOM, toggled by [data-theme] (an <img> src
          can't read CSS vars). Cards without a light variant show one image. */}
      <div className="absolute" style={{ left: 299, top: 36, width: 108, height: 102 }}>
        <Image
          src={image}
          alt={label}
          width={108}
          height={102}
          className={`object-contain ${imageLight ? "purpose-img-dark" : ""}`}
          unoptimized
        />
        {imageLight && (
          <Image
            src={imageLight}
            alt={label}
            width={108}
            height={102}
            className="purpose-img-light object-contain"
            unoptimized
          />
        )}
      </div>

      {/* Label — mono-medium grey-200, at (60,36) per live */}
      <p
        className="absolute text-desktop-mono-medium text-grey-200"
        style={{ left: 60, top: 36 }}
      >
        {label}
      </p>

      {/* Number — mono-small grey-200, at (24,178) per live */}
      <p
        className="absolute text-desktop-mono-small text-grey-200"
        style={{ left: 24, top: 178 }}
      >
        {number}
      </p>

      {/* Description — body (16px) text-primary, at (60,173) width 347 per live */}
      <p
        className="absolute text-desktop-body text-primary"
        style={{ left: 60, top: 173, width: 347 }}
      >
        {description}
      </p>
    </div>
  );
}

/* ─── Background grid (faint 120px squares) ──────────────────────────────── */
function BackgroundGrid() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {Array.from({ length: ROWS }).map((_, r) =>
        Array.from({ length: COLS }).map((_, c) => (
          <div
            key={`${r}-${c}`}
            className="absolute border border-stroke bg-inverted-primary"
            style={{ left: c * CELL, top: r * CELL, width: CELL, height: CELL }}
          />
        )),
      )}
    </div>
  );
}

/* ─── Eyebrow (BENEFITS, with corner triangle ticks) ─────────────────────── */
function Eyebrow() {
  return (
    <div
      className="absolute flex h-[32px] items-center justify-center gap-[10px] rounded-[2px] border border-grey-200 bg-inverted-primary px-[12px] py-[8px]"
      style={{ left: 58, top: 15 }}
    >
      {/* Live "BENEFITS" text is 14px mono (mono-medium), text-primary. */}
      <span className="pt-px text-desktop-mono-medium text-primary">BENEFITS</span>
      {/* corner ticks */}
      <span
        className="absolute left-0 top-0 size-[6px] border-l border-t border-grey-200"
        aria-hidden="true"
      />
      <span
        className="absolute bottom-0 right-0 size-[6px] border-b border-r border-grey-200"
        aria-hidden="true"
      />
    </div>
  );
}

/* ─── Trusted-by subtext ─────────────────────────────────────────────────── */
function TrustedBy() {
  return (
    <div
      className="absolute overflow-hidden rounded-tl-[2px] border-t border-grey-200"
      style={{ left: 734, top: 1079, width: 646, height: 98 }}
    >
      {/* + eyebrow box, hung off the top-left */}
      <div className="absolute left-0 top-[-1px] flex size-[28px] items-center justify-center rounded-b-[2px] rounded-tl-[2px] border border-grey-200">
        <span className="text-desktop-mono text-grey-200">+</span>
      </div>

      {/* Live: the whole line is text-primary (#07060D light / #FFFFFF dark) —
          both spans share one colour, no grey distinction. */}
      <p
        className="absolute left-0 w-[539px] text-desktop-h4-indent text-primary"
        style={{ top: "calc(50% - 23.5px)" }}
      >
        <span>Trusted by</span> leading enterprises and millions of users.
      </p>
    </div>
  );
}

/* ─── Heading ────────────────────────────────────────────────────────────── */
function Heading() {
  return (
    <h2
      className="absolute text-desktop-h2-indent"
      style={{ left: 58, top: 8, width: 540 }}
    >
      {/* Live: span1 is text-primary (#07060D light / #FFFFFF dark);
          span2 is muted (#686D73 light / #A0A1A6 dark — grey-200 only matches dark). */}
      <span className="text-primary">Polygon is purpose-built</span>{" "}
      <span className="text-grey-200">to scale money.</span>
    </h2>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   MOBILE (≤767px) — Figma/live mobile uses a horizontal swiper of feature
   cards, NOT the desktop grid. Extracted live @375 canvas:
     • section height 650.6 @374w → 652 on the 375 canvas
     • eyebrow at (16,0), heading at (16,9): 36px / 46.8px lh / -0.72px
     • slider starts at y184; cards are 310×294 (aspect 253/240), gap 16, first
       card left 16. Overflow-hidden stage shows card 1 + a peek of card 2,
       matching live's initial state; the row scrolls horizontally (swipe).
     • card internals: tick 8×8 @(0,0); label (mono 13, grey-200) @(46,32);
       image 88×83 top-right (right-gap 32, top 32); number (mono-small,
       grey-200) @(20,223); description (14px / 19.6 lh, primary) @(46,223) w259.
     • cut-corner border: feature-card-bg-embed SVG (viewBox 253×240), grey-200.
   ─────────────────────────────────────────────────────────────────────────── */
const MOBILE_H = 652;
const M_CARD_W = 310;
const M_CARD_H = 294;
const M_CARD_GAP = 16;
const M_SLIDER_TOP = 184;
const M_LEFT = 16;

function MobileFeatureCard({
  label,
  number,
  description,
  mobileDescription,
  image,
  imageLight,
}: CardData) {
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{ width: M_CARD_W, height: M_CARD_H }}
    >
      {/* Card surface — inverted-primary fill, cut-corner (top-left + bottom-right) */}
      <div
        className="absolute inset-0 bg-inverted-primary"
        style={{
          clipPath:
            "polygon(12.45% 0%, 100% 0%, 100% 92.5%, 93.23% 99.79%, 0% 99.79%, 0% 12.5%, 12.45% 0%)",
        }}
      />

      {/* Cut-corner border — feature-card-bg-embed, grey-200 (#A0A1A6) */}
      <svg
        className="absolute inset-0 h-full w-full text-grey-200"
        viewBox="0 0 253 240"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M31.5195 0.5H248.98C250.913 0.500227 252.48 2.06666 252.48 3.99902L252.5 221.989L252.495 222.174C252.447 223.094 252.036 223.961 251.35 224.583L235.885 238.594C235.241 239.177 234.403 239.5 233.535 239.5H4C2.067 239.5 0.5 237.933 0.5 236V76.5H0.521484V76L0.500977 30.2119C0.50056 29.2536 0.893116 28.3367 1.58691 27.6758L29.1055 1.46582C29.7156 0.88476 30.5137 0.544148 31.3516 0.503906L31.5195 0.5Z"
          stroke="currentColor"
        />
      </svg>

      {/* Corner diamond tick — top-left, 8×8 at (0,0) inside the 32px card padding.
          Live places it at the very corner of the cut; offset to sit in the cut. */}
      <svg
        className="absolute text-primary"
        style={{ top: 13, left: 14, width: 8, height: 8 }}
        viewBox="0 0 10 10"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8.79395 9.29395H0.501052C0.0555997 9.29395 -0.167485 8.75538 0.147498 8.44039L8.44039 0.147499C8.75537 -0.167484 9.29395 0.0555996 9.29395 0.501052V8.79395C9.29395 9.07009 9.07009 9.29395 8.79395 9.29395Z"
          fill="currentColor"
        />
      </svg>

      {/* Feature icon — 88×83 top-right (right-gap 32, top 32). Same dual-render
          theme toggle as desktop. */}
      <div
        className="absolute"
        style={{ top: 32, left: M_CARD_W - 32 - 88, width: 88, height: 83 }}
      >
        <Image
          src={image}
          alt={label}
          width={88}
          height={83}
          className={`object-contain ${imageLight ? "purpose-img-dark" : ""}`}
          unoptimized
        />
        {imageLight && (
          <Image
            src={imageLight}
            alt={label}
            width={88}
            height={83}
            className="purpose-img-light object-contain"
            unoptimized
          />
        )}
      </div>

      {/* Label — mono 13px, grey-200, at (46,32) */}
      <p
        className="absolute text-grey-200 uppercase"
        style={{
          left: 46,
          top: 32,
          fontFamily: "var(--font-mono)",
          fontWeight: 400,
          fontSize: 13,
          lineHeight: "13px",
          letterSpacing: "0.13px",
        }}
      >
        {label}
      </p>

      {/* Number — mono-small grey-200, at (20,223) */}
      <p
        className="absolute text-desktop-mono-small text-grey-200"
        style={{ left: 20, top: 223 }}
      >
        {number}
      </p>

      {/* Description — 14px / 19.6 lh (1.4), primary, at (46,223) width 259 */}
      <p
        className="absolute text-primary"
        style={{
          left: 46,
          top: 223,
          width: 259,
          fontFamily: "var(--font-body)",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "19.6px",
        }}
      >
        {mobileDescription ?? description}
      </p>
    </div>
  );
}

/* ─── PurposeSection — scales the 1440px stage responsively ──────────────── */
export function PurposeSection() {
  return (
    <section className="bg-background">
      {/* Theme-toggled feature illustrations (CSS dual-render — an <img> src
          can't read CSS vars, so both variants live in the DOM). */}
      <style>{`
        .purpose-img-light { display: none !important; }
        [data-theme="light"] .purpose-img-dark { display: none !important; }
        [data-theme="light"] .purpose-img-light { display: block !important; }
      `}</style>
      {/* DESKTOP (≥768px) — unchanged 1440px scale-to-fit stage. */}
      <div className="mx-auto hidden w-full max-w-[1440px] md:block">
        {/* Aspect-ratio box keeps the stage proportional below 1440px */}
        <div
          className="relative w-full"
          style={{
            aspectRatio: `${FRAME_W} / ${FRAME_H}`,
            containerType: "inline-size",
          }}
        >
          {/* Fixed-size stage, scaled to fill the box width */}
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{
              width: FRAME_W,
              height: FRAME_H,
              transform: "scale(calc(100cqw / 1440px))",
            }}
          >
            <BackgroundGrid />
            <Heading />
            <Eyebrow />
            {CARDS.map((card) => (
              <FeatureCard key={card.label} {...card} />
            ))}
            <TrustedBy />
          </div>
        </div>
      </div>

      {/* MOBILE (≤767px) — 375 canvas: eyebrow + heading + horizontal swiper of
          feature cards (overflow-hidden shows card 1 + a peek of card 2). */}
      <div className="md:hidden" style={{ containerType: "inline-size" }}>
        <MobileStage height={MOBILE_H}>
          {/* Eyebrow — BENEFITS, grey-200 border + corner ticks (same as desktop) */}
          <div className="absolute" style={{ left: M_LEFT, top: 0 }}>
            <div className="relative inline-flex h-[32px] items-center justify-center gap-[10px] rounded-[2px] border border-grey-200 bg-inverted-primary px-[12px] py-[8px]">
              <span className="pt-px text-desktop-mono-medium text-primary">
                BENEFITS
              </span>
              <span
                className="absolute left-0 top-0 size-[6px] border-l border-t border-grey-200"
                aria-hidden="true"
              />
              <span
                className="absolute bottom-0 right-0 size-[6px] border-b border-r border-grey-200"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Heading — 36px / 46.8 lh / -0.72px, width 343. Sits below the
              eyebrow: live wrap is a flex column, eyebrow (h30) + 9px gap. */}
          <h2
            className="absolute"
            style={{
              left: M_LEFT,
              top: 39,
              width: 343,
              fontFamily: "var(--font-heading)",
              fontWeight: 300,
              fontSize: 36,
              lineHeight: "46.8px",
              letterSpacing: "-0.72px",
            }}
          >
            <span className="text-primary">Polygon is purpose-built</span>{" "}
            <span className="text-grey-200">to scale money.</span>
          </h2>

          {/* Card slider — horizontal scroll; overflow-hidden stage clips to the
              first card + a peek of the next, matching live's initial state. */}
          <div
            className="absolute flex"
            style={{
              top: M_SLIDER_TOP,
              left: M_LEFT,
              gap: M_CARD_GAP,
              width: CARDS.length * (M_CARD_W + M_CARD_GAP) - M_CARD_GAP,
            }}
          >
            {CARDS.map((card) => (
              <MobileFeatureCard key={card.label} {...card} />
            ))}
          </div>
        </MobileStage>
      </div>
    </section>
  );
}
