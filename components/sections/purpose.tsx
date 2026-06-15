import Image from "next/image";

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
      <div className="mx-auto w-full max-w-[1440px]">
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
    </section>
  );
}
