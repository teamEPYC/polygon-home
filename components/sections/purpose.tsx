import Image from "next/image";

/* ───────────────────────────────────────────────────────────────────────────
   Purpose / "benefits" section — Figma node 1727:42354 (1440×1320).
   Absolutely-positioned stage on a 1440px canvas to mirror the Figma frame.
   ─────────────────────────────────────────────────────────────────────────── */

const FRAME_W = 1440;
const FRAME_H = 1320;
const CELL = 120;
const COLS = FRAME_W / CELL; // 12
const ROWS = FRAME_H / CELL; // 11
const CARD_W = 420;
const CARD_H = 248;

/* ─── Feature Card data — exact copy + positions from Figma ───────────────── */
type CardData = {
  label: string;
  number: string;
  description: string;
  image: string;
  left: number;
  top: number;
};

const CARDS: CardData[] = [
  {
    label: "Reliability",
    number: "01",
    description: "5B+ transactions. 99.99% uptime. 0 calls to customer support.",
    image: "/assets/purpose/reliability.webp",
    left: 960,
    top: 0,
  },
  {
    label: "Speed",
    number: "02",
    description:
      "Why pay more to wait longer? Polygon settles instantly—yes, even on Sundays.",
    image: "/assets/purpose/speed.webp",
    left: 510,
    top: 248,
  },
  {
    label: "Cost",
    number: "03",
    description:
      "Pay $0.001 to settle onchain. Keep the other $34.999. Wire transfer fee has left the chat.",
    image: "/assets/purpose/cost.webp",
    left: 960,
    top: 432,
  },
  {
    label: "Enterprise ready",
    number: "04",
    description:
      "Wallets? Yes. Onramps? Covered. Compliance-ready? Absolutely. Everything you need is already here.",
    image: "/assets/purpose/enterprise.webp",
    left: 60,
    top: 496,
  },
  {
    label: "Distribution",
    number: "05",
    description:
      "You don’t need to find liquidity and users. 156M active addresses are already doing business on Polygon.",
    image: "/assets/purpose/distribution.webp",
    left: 510,
    top: 680,
  },
  {
    label: "Liquidity",
    number: "06",
    description:
      "Tap into billions in stablecoins and every major asset on a deeply liquid chain.",
    image: "/assets/purpose/liquidity.webp",
    left: 60,
    top: 928,
  },
];

/* ─── Feature Card ───────────────────────────────────────────────────────── */
function FeatureCard({ label, number, description, image, left, top }: CardData) {
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

      {/* Cut-corner border */}
      <svg
        className="absolute inset-0 h-full w-full text-stroke"
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

      {/* Corner diamond tick — top-left, 10px at (12,12) */}
      <svg
        className="absolute text-grey-200"
        style={{ top: 12, left: 12, width: 10, height: 10 }}
        viewBox="0 0 10 10"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8.79395 9.29395H0.501052C0.0555997 9.29395 -0.167485 8.75538 0.147498 8.44039L8.44039 0.147499C8.75537 -0.167484 9.29395 0.0555996 9.29395 0.501052V8.79395C9.29395 9.07009 9.07009 9.29395 8.79395 9.29395Z"
          fill="currentColor"
        />
      </svg>

      {/* Feature icon — 108×102 at (280,32) */}
      <div className="absolute" style={{ left: 280, top: 32 }}>
        <Image
          src={image}
          alt={label}
          width={108}
          height={102}
          className="object-contain"
          unoptimized
        />
      </div>

      {/* Label — mono, at (80,32) */}
      <p
        className="absolute text-desktop-mono-medium text-grey-200"
        style={{ left: 80, top: 32 }}
      >
        {label}
      </p>

      {/* Number + description — bottom-aligned at (20, bottom 32), gap 45 */}
      <div
        className="absolute flex items-start"
        style={{ left: 20, bottom: 32, width: 356, gap: 45 }}
      >
        <div className="flex flex-1 flex-col items-center justify-center pt-[4px]">
          <p className="text-desktop-mono-small text-grey-200">{number}</p>
        </div>
        <p className="text-desktop-body text-grey-100" style={{ width: 296 }}>
          {description}
        </p>
      </div>
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
      style={{ left: 60, top: 16 }}
    >
      <span className="pt-px text-desktop-mono text-grey-200">BENEFITS</span>
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

      <p
        className="absolute left-0 w-[539px] text-grey-200"
        style={{
          top: "calc(50% - 21.5px)",
          textIndent: 70,
          fontFamily: "var(--font-heading)",
          fontSize: 28,
          fontWeight: 300,
          lineHeight: "32px",
          letterSpacing: "-0.28px",
        }}
      >
        <span style={{ color: "#f2f3f7" }}>Trusted by</span> leading enterprises
        and millions of users.
      </p>
    </div>
  );
}

/* ─── Heading ────────────────────────────────────────────────────────────── */
function Heading() {
  return (
    <h2
      className="absolute"
      style={{
        left: 60,
        top: 0,
        width: 540,
        textIndent: 120,
        fontFamily: "var(--font-heading)",
        fontSize: 56,
        fontWeight: 300,
        lineHeight: "60px",
        letterSpacing: "-0.56px",
      }}
    >
      <span style={{ color: "#f2f3f7" }}>Polygon is purpose-built</span>{" "}
      <span className="text-grey-200">to scale money.</span>
    </h2>
  );
}

/* ─── PurposeSection — scales the 1440px stage responsively ──────────────── */
export function PurposeSection() {
  return (
    <section className="bg-background">
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
              transform: "scale(calc(100cqw / 1440))",
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
