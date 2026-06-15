"use client";

import Image from "next/image";
import { type ReactNode, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ScrambleText } from "@/components/ui/scramble-text";
import { Spacer } from "../ui/spacer";

const CUT = 14;
const clipPath = `polygon(0 0, calc(100% - ${CUT}px) 0, 100% ${CUT}px, 100% 100%, 0 100%)`;

/* ── Line-art icons (stroke = currentColor, theme-aware via text token) ──
 * Each recreated from Figma nodes 1727:40825/40827/40830/40833, drawn on a
 * 72×72 viewBox to match the design's 72px icon size.
 */
function PaymentsIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
      <g
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="36" cy="36" r="9" />
        {/* upper arc, arrow pointing left */}
        <path d="M22 30a16 16 0 0 1 28-4" />
        <path d="M50 18v8h-8" />
        {/* lower arc, arrow pointing right */}
        <path d="M50 42a16 16 0 0 1-28 4" />
        <path d="M22 54v-8h8" />
      </g>
    </svg>
  );
}

function StablecoinsIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
      <g
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="36" cy="36" r="20" />
        <path d="M40 29.5c-1.1-1.6-2.6-2.5-4.5-2.5-2.7 0-4.7 1.6-4.7 3.9 0 5.4 9.6 2.7 9.6 8.2 0 2.4-2.1 4-5 4-2 0-3.7-.9-4.8-2.6" />
        <path d="M36 24v4M36 44v4" />
      </g>
    </svg>
  );
}

function RWAIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
      <g
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* baseline */}
        <path d="M20 52h32" />
        {/* candlestick bars */}
        <path d="M27 20v26M27 24v18" />
        <path d="M36 28v18" />
        <path d="M36 32h0" />
        {/* trend arrow rising to the right */}
        <path d="M30 40c4-1 7-5 9-9 2-4 5-7 9-8" />
        <path d="M44 23h6v6" />
      </g>
    </svg>
  );
}


type UseCase = {
  number: string;
  label: string;
  width: number;
  icon: ReactNode;
  desc: string;
};

const USE_CASES: UseCase[] = [
  {
    number: "01",
    label: "Payments",
    width: 840,
    icon: <PaymentsIcon />,
    desc: "When moving money is part of your product, you can’t afford wires, wait times, or weekend breaks. On Polygon, payments never hit pause.",
  },
  {
    number: "02",
    label: "Stablecoins",
    width: 960,
    icon: <StablecoinsIcon />,
    desc: "Call us stable. That’s the point. The most trusted stablecoins run on Polygon—$3.4B+ in liquidity, full reserve coverage, and the global distribution banks wish they had.",
  },
  {
    number: "03",
    label: "RWA",
    width: 1080,
    icon: <RWAIcon />,
    desc: "You wouldn’t sell a Van Gogh on Facebook Marketplace. Tokenized assets belong on rails with reputation. Polygon delivers trust, distribution, and infrastructure that’s already proven.",
  },
];

// Icon-box cut-corner: BOTTOM-RIGHT corner clipped (live .h-uc-card icon box).
const ICO_CUT = 16;
const icoClip = `polygon(0 0, 100% 0, 100% calc(100% - ${ICO_CUT}px), calc(100% - ${ICO_CUT}px) 100%, 0 100%)`;

// Tooltip shape — live .uc-detail-card (#ucDetailCardClip): top-left AND
// bottom-right corners cut (~20px), like the purpose feature cards.
const TIP_CUT = 20;
const tipClip = `polygon(${TIP_CUT}px 0, 100% 0, 100% calc(100% - ${TIP_CUT}px), calc(100% - ${TIP_CUT}px) 100%, 0 100%, 0 ${TIP_CUT}px)`;

// Hover fill — exact live radial gradient, painted as a grid of "pixels" that
// reveal in a scattered (mosaic) order on enter and vanish instantly on exit.
const BOX_W = 120;
const BOX_H = 108;
const M_CELL = 12; // mosaic pixel size
const M_GRAD = "radial-gradient(circle, #190B38, #5D0FD3 62%, #00C4FF)";
const MOSAIC_CELLS: { x: number; y: number; delay: number }[] = [];
for (let y = 0; y < BOX_H; y += M_CELL) {
  for (let x = 0; x < BOX_W; x += M_CELL) {
    // deterministic pseudo-random (no Math.random → SSR-safe) for the scatter
    const frac = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
    MOSAIC_CELLS.push({ x, y, delay: Math.round(frac * 240) });
  }
}

// Live values (extracted from .h-uc-card-container): bar 156 tall, grey-200 border,
// number at (7,9), icon box 120×108 at (0,28), label at (144,52). Bars overlap 2px
// (step 154) via -2 margin so the 1px borders share an edge.
function UseCaseBar({ uc, first }: { uc: UseCase; first?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="group relative bg-inverted-primary overflow-visible shrink-0 cursor-pointer"
      style={{
        width: uc.width,
        height: 156,
        borderTop: "1px solid var(--grey-200)",
        marginTop: first ? 0 : -2,
        zIndex: hover ? 1 : 0,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* number badge — top-left, grey-200 border */}
      <div
        className="absolute left-0 top-0 flex items-center justify-center bg-inverted-primary px-[7px] py-[6px]"
        style={{ border: "1px solid var(--grey-200)" }}
      >
        <span className="text-desktop-mono-small text-primary">{uc.number}</span>
      </div>

      {/* cut-corner icon box — (0,28), 120×108. Outline grey-200 → white on hover. */}
      <div className="absolute" style={{ left: 0, top: 28, width: BOX_W, height: BOX_H }}>
        <div
          className="absolute inset-0 bg-grey-200 transition-colors group-hover:bg-primary"
          style={{ clipPath: icoClip }}
        />
        <div className="absolute bg-inverted-primary" style={{ inset: 1, clipPath: icoClip }} />

        {/* Mosaic gradient fill — each pixel is a tile of the full radial gradient
            (continuous via background-position). Entry: staggered per-pixel fade
            in. Exit: transition only exists while hovered, so it disappears at once. */}
        <div className="absolute overflow-hidden" style={{ inset: 1, clipPath: icoClip }}>
          {MOSAIC_CELLS.map((c, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: c.x,
                top: c.y,
                width: M_CELL + 1,
                height: M_CELL + 1,
                backgroundImage: M_GRAD,
                backgroundSize: `${BOX_W}px ${BOX_H}px`,
                backgroundPosition: `-${c.x}px -${c.y}px`,
                backgroundRepeat: "no-repeat",
                opacity: hover ? 1 : 0,
                transition: hover ? `opacity 120ms ease ${c.delay}ms` : "none",
              }}
            />
          ))}
        </div>

        {/* icon — on top of the mosaic, white on hover for contrast */}
        <div
          className={`absolute transition-colors ${hover ? "text-white" : "text-grey-200"}`}
          style={{ left: 24, top: 18 }}
        >
          {uc.icon}
        </div>
      </div>

      {/* label — 96px h1. White → grey-200 on hover (live: the outline lights up,
          the label recedes). */}
      <p
        className="absolute text-desktop-h1 whitespace-nowrap text-primary transition-colors group-hover:text-grey-200"
        style={{ left: 144, top: 52 }}
      >
        {uc.label}
      </p>

      {/* Tooltip — live .uc-detail-card: 368px, top-left + bottom-right cut,
          grey-200 outline, #07060D fill, 20px padding, body-large copy. Border
          via two-layer clip so the outline follows the diagonal cuts (a plain CSS
          border gets sliced off by the clip). */}
      {hover && (
        <div
          className="absolute z-30 pointer-events-none"
          style={{ left: 175, top: 10, width: 368 }}
        >
          <div className="absolute inset-0 bg-grey-200" style={{ clipPath: tipClip }} />
          <div
            className="absolute bg-inverted-primary"
            style={{ inset: 1, clipPath: tipClip }}
          />
          <div className="relative flex flex-col gap-[12px] p-[20px]">
            <span className="text-desktop-mono-small text-grey-200">{uc.label}</span>
            <p className="text-desktop-body-large text-white">{uc.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function UseCasesCta() {
  return (
    <>
      <section
        className="relative w-full bg-inverted-primary"
        style={{ containerType: "inline-size" }}
      >
        <div className="relative w-full" style={{ aspectRatio: "1440 / 720" }}>
          {/* Fixed 1440×720 design stage (6 rows) — sized for the 3 bars; one
              fewer row than before so there's no extra empty band before the CTA. */}
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{
              width: 1440,
              height: 720,
              transform: "scale(calc(100cqw / 1440px))",
            }}
          >
            {/* Background grid — full 12×6 grid of 120px cells */}
            <div className="absolute inset-0 z-[1]">
              {Array.from({ length: 6 }).flatMap((_, row) =>
                Array.from({ length: 12 }).map((__, col) => (
                  <div
                    key={`${row}-${col}`}
                    className="absolute border border-stroke bg-inverted-primary"
                    style={{
                      left: col * 120,
                      top: row * 120,
                      width: 120,
                      height: 120,
                    }}
                  />
                )),
              )}
            </div>

            {/* Right-edge vertical line — a cell border at the extreme scaled
                edge (x=1440) gets clipped, so draw it explicitly. Sits ABOVE the
                opaque staircase bars (z-2) so it stays continuous through the
                bar rows instead of being covered. */}
            <div className="absolute right-0 top-0 z-[3] h-full w-px bg-stroke" />

            {/* Eyebrow */}
            <div className="absolute z-[3]" style={{ left: 60, top: 122 }}>
              <Eyebrow
                text="WHAT POLYGON CAN DO FOR YOU"
                borderColor="grey-200"
                textColor="primary"
                hasDot
              />
            </div>

            {/* Staircase list — right-aligned, stepping left going down */}
            <div
              className="absolute z-[2] flex flex-col items-end"
              style={{ left: 240, top: 122, width: 1200 }}
            >
              {USE_CASES.map((uc, i) => (
                <UseCaseBar key={uc.number} uc={uc} first={i === 0} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: GET STARTED CTA (Figma node 1727:42786) ── */}
      <GetStartedCta />
    </>
  );
}

/* ───────────────────────────── GET STARTED CTA ─────────────────────────────
 * 1440×1440 design stage, scaled to section width (footer/pol-token pattern).
 * Fixed blue accent bg #3449c1 (does not flip). Grid, eyebrow, heading and
 * buttons use semantic tokens so they flip light/dark.
 */

// Footer button cards.
type CtaButton = { label: string; href: string; left: number };
const CTA_BUTTONS: CtaButton[] = [
  { label: "START BUILDING", href: "/docs", left: 60 },
  { label: "CONTACT US", href: "#contact", left: 510 },
  { label: "OPEN MONEY STACK", href: "#open-money-stack", left: 960 },
];

// Solid grid cells (bg-inverted-primary + border-stroke) — the top inverted
// staircase / funnel toward the LET'S BUILD eyebrow.
const SOLID_CELLS: [number, number][] = [
  [240, 0],
  [360, 0],
  [480, 0],
  [600, 0],
  [720, 0],
  [840, 0],
  [960, 0],
  [1080, 0],
  [480, 120],
  [600, 120],
  [720, 120],
  [840, 120],
  [600, 240],
  [720, 240],
];
const isSolid = (x: number, y: number) =>
  SOLID_CELLS.some(([sx, sy]) => sx === x && sy === y);

// Funnel stagger — same drop-in animation as the OMS staircase: each row
// drops from one cell above, top row first, then the LET'S BUILD eyebrow fades
// in once all rows have landed.
const FUNNEL_ROW_DELAY = 0.14;
const FUNNEL_EYEBROW_DELAY = 3 * FUNNEL_ROW_DELAY; // 3 funnel rows → 0.42s

function GetStartedCta() {
  const funnelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(funnelRef, { once: true, margin: "0px 0px -80px 0px" });
  return (
    <section
      id="get-started"
      className="relative w-full overflow-hidden bg-[#3449c1]"
      style={{ containerType: "inline-size", aspectRatio: "1440 / 1200" }}
    >
      {/* Fixed 1440×1200 design stage (live .section is ~1217) — cards sit just
          below the heading, then the footer follows. */}
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: 1440,
          height: 1200,
          transform: "scale(calc(100cqw / 1440px))",
        }}
      >
        {/* Background glow */}
        <Image
          src="/assets/getstarted/bg-gradient.svg"
          alt=""
          width={1440}
          height={1440}
          unoptimized
          className="absolute inset-0 z-[0] pointer-events-none select-none"
        />

        {/* Background grid — 12 cols × 10 rows of 120px cells */}
        <div className="absolute inset-0 z-[1]">
          {Array.from({ length: 10 }).flatMap((_, row) =>
            Array.from({ length: 12 }).map((__, col) => {
              const x = col * 120;
              const y = row * 120;
              return (
                <div
                  key={`${x}-${y}`}
                  className="absolute"
                  style={{
                    left: x,
                    top: y,
                    width: 120,
                    height: 120,
                    ...(isSolid(x, y)
                      ? undefined
                      : { border: "1px solid var(--grid-stroke)" }),
                  }}
                />
              );
            }),
          )}
          {/* Right-edge vertical line — a cell border at the extreme scaled
              edge (x=1440) gets clipped, so draw it explicitly. */}
          <div
            className="absolute right-0 top-0 h-full w-px"
            style={{ background: "var(--grid-stroke)" }}
          />
          {/* Trigger anchor for the funnel/eyebrow drop-in (top of the funnel). */}
          <div
            ref={funnelRef}
            className="absolute left-0 top-0 h-px w-px pointer-events-none"
          />
          {/* Solid cells (the inverted-triangle funnel) — same drop-in stagger as
              the OMS staircase: each ROW drops from one cell above, top row first,
              converging toward the LET'S BUILD apex. */}
          {SOLID_CELLS.map(([x, y]) => {
            const rowIndex = y / 120;
            return (
              <motion.div
                key={`solid-${x}-${y}`}
                className="absolute border border-stroke bg-inverted-primary"
                style={{ left: x, top: y, width: 120, height: 120 }}
                initial={{ y: -120, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : undefined}
                transition={{
                  duration: 0.55,
                  delay: rowIndex * FUNNEL_ROW_DELAY,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            );
          })}
          {/* Shape row — dark band across the bottom row (the transition above the
              footer). Its top border is the black line separating the blue section
              from the dark band; the bottom-left corner is cut (row-corner.svg). */}
          {[120, 240, 360, 480, 600, 720, 840, 960, 1080, 1200, 1320].map((x) => (
            <div
              key={`band-${x}`}
              className="absolute z-[2] border border-stroke bg-inverted-primary"
              style={{ left: x, top: 1080, width: 120, height: 120 }}
            />
          ))}
          <Image
            src="/assets/getstarted/row-corner.svg"
            alt=""
            width={120}
            height={120}
            unoptimized
            className="absolute z-[2] pointer-events-none select-none"
            style={{ left: 0, top: 1080, width: 120, height: 120 }}
          />
        </div>

        {/* Eyebrow — centered. Fades in after the funnel rows have landed
            (same timing as the OMS staircase eyebrow). */}
        <motion.div
          className="absolute z-[3] -translate-x-1/2"
          style={{ left: 720, top: 284 }}
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{
            duration: 0.4,
            delay: FUNNEL_EYEBROW_DELAY,
            ease: "easeOut",
          }}
        >
          <Eyebrow
            text="LET'S BUILD"
            borderColor="grey-200"
            textColor="primary"
            hasDot
          />
        </motion.div>

        {/* Heading — centered. FIXED white in both themes (live: rgb(255,255,255)
         * light AND dark — it sits directly over the fixed blue band). */}
        <h2
          className="absolute z-[3] -translate-x-1/2 text-center font-heading font-[300] text-white"
          style={{
            left: 720,
            top: 504,
            width: 700,
            fontSize: 96,
            lineHeight: "86.4px",
            letterSpacing: "-1.92px",
          }}
        >
          Get started with Polygon
        </h2>

        {/* Footer button cards */}
        {CTA_BUTTONS.map((btn) => (
          <div
            key={btn.label}
            className="absolute z-[4]"
            style={{ left: btn.left, top: 736, width: 420, height: 164 }}
          >
            {/* Cut-corner card frame — exact live .h-uc-card path (big top-left
                cut + small bottom-right cut), faint fill + subtle outline. */}
            <svg
              className="absolute inset-0 pointer-events-none select-none"
              width={420}
              height={164}
              viewBox="0 0 420 164"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M420 124.055C420 125.145 419.554 126.19 418.767 126.944L381.238 162.889C380.494 163.602 379.502 164 378.471 164H4C1.79086 164 0 162.209 0 160V64H0.0214844L0.00683594 60.1904C0.00278726 59.1078 0.437335 58.0698 1.21191 57.3135L58.7539 1.1377C59.5011 0.408371 60.5037 0 61.5479 0H415.98C418.189 0 419.98 1.79048 419.98 3.99902L420 64V124.055Z"
                fill="rgba(255,255,255,0.04)"
                stroke="rgba(243,242,246,0.55)"
              />
            </svg>
            {/* Diamond tick at the top-left cut (live trail-poly.svg), 10px at (8,3). */}
            <svg
              className="absolute"
              style={{ left: 8, top: 3, width: 10, height: 10 }}
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden
            >
              <path d="M5 0L10 5L5 10L0 5L5 0Z" fill="#F3F2F6" />
            </svg>
            {/* Centered button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <CtaCornerButton label={btn.label} href={btn.href} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Outlined cut-corner button with diagonal arrow (dark-theme outlined variant).
function CtaArrow() {
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
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CtaCornerButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="scramble-host inline-flex h-[44px] items-center gap-[10px] border border-white pl-[16px] pr-[24px] text-white transition-opacity hover:opacity-90"
      style={{ clipPath }}
    >
      <span className="text-desktop-mono-small">
        <ScrambleText>{label}</ScrambleText>
      </span>
      <CtaArrow />
    </a>
  );
}
