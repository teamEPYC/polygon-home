"use client";

import Image from "next/image";
import { type ReactNode, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ScrambleText } from "@/components/ui/scramble-text";
import { MobileStage } from "@/components/ui/stage";
import { Spacer } from "../ui/spacer";

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

/* ──────────────────────── MOBILE (≤767px) ────────────────────────
 * Live renders a completely separate `.h-uc-mobile-wrap` on mobile (the
 * desktop staircase is `hide-desktop`). It is a vertical stack of 4 cards
 * (Payments / Stablecoins / RWA / DeFI — note: mobile adds DeFI as 04, which
 * the desktop staircase omits). Each card: a top row [number eyebrow + EXPLORE
 * chip], then a bottom row [120×108 cut-corner icon box + heading], then the
 * body copy. Values extracted live @375 (deviceMetrics 375×812):
 *   • wrap px-4 (343 wide); eyebrow→cards gap 48; card gap 21.
 *   • card-eyebrow 31×28, grey-200 left/right/bottom border, 12px mono.
 *   • EXPLORE chip: cut-corner outline 130×44 viewBox, diamond tick + divider
 *     + "EXPLORE" 12px mono, grey-200; chip ≈85×38.
 *   • icon box 30% width (≈104), aspect 120/108, grey-200 icon (verbatim live
 *     SVG incl. the cut-corner frame mask).
 *   • h2 36px/1.06 (-0.02em); body 14px/1.2 grey/white.
 * Default (non-hover) state only — per task, no hover/gesture work here.
 */
// Mobile section height @500. The wrap (eyebrow + 4 cards) sits at top 111 and
// runs to ~1285; the stage must be tall enough to not clip the 4th (DeFI) card.
const M_UC_H = 1296;
const MOBILE_USE_CASES = [
  { number: "01", label: "Payments", href: "/payments", desc: USE_CASES[0].desc },
  { number: "02", label: "Stablecoins", href: "/stablecoins", desc: USE_CASES[1].desc },
  { number: "03", label: "RWA", href: "/tokenization", desc: USE_CASES[2].desc },
  {
    number: "04",
    label: "DeFI",
    href: "/defi",
    desc: "Borrow with tokenized credit. Swap across borders. Plug into liquidity that doesn’t sleep. If your product needs DeFi, Polygon already has the parts.",
  },
] as const;

// Verbatim live `.uc-icon-image` SVGs (120×108, currentColor = grey-200). Each
// includes the cut-corner frame (mask + border) plus the use-case glyph.
function MobileUcIcon({ label }: { label: string }) {
  const glyph: Record<string, ReactNode> = {
    Payments: (
      <path
        d="M67.8968 45.7726C68.2799 46.0593 68.6382 46.3859 68.967 46.7528C72.3335 50.4152 71.3049 56.8009 66.7227 61.0267C62.1405 65.2525 55.688 65.6281 52.415 61.9658C52.1375 61.6553 51.9987 61.4632 51.7813 61.1165M50.9998 77.9299H48.5811C37.7335 77.9299 28.8496 69.1027 28.8496 58.1155C28.8496 47.2223 37.64 38.3012 48.5811 38.3012H57.7455M68.0003 29.1921H71.1186C81.9662 29.1921 90.8501 38.0194 90.8501 49.0065C90.8501 59.8997 82.0598 68.8209 71.1186 68.8209H61.9542M67.0972 44.8745C70.4638 48.5369 69.4351 54.9226 64.8529 59.1484C60.2707 63.3742 53.8182 63.7498 50.5452 60.0875C47.2722 56.4251 48.2074 50.0394 52.7896 45.8136C57.2783 41.5878 63.7307 41.1182 67.0972 44.8745ZM68.2194 35.5778L61.4864 29.38L68.2194 22.9004V35.5778ZM51.4805 71.6382L58.6811 78.2117L51.4805 85.2547V71.6382Z"
        stroke="currentColor"
        strokeMiterlimit="10"
      />
    ),
    Stablecoins: (
      <>
        <path
          d="M43.0883 65.684C40.8055 62.3381 39.4487 58.3368 39.4052 54.0096C39.3794 51.4353 39.8484 48.9715 40.6482 46.6727C43.5315 38.7914 51.101 33.2205 60.0432 33.2392C62.2376 33.2438 64.3804 33.577 66.362 34.2384C73.4615 36.499 79.0069 42.4261 80.6167 49.7691M88.149 54.0349C88.3037 69.4161 75.9288 81.8698 60.5226 81.8371C50.9279 81.8168 42.3808 76.9271 37.2624 69.5268C34.2023 65.0867 32.3386 59.6639 32.2802 53.8617C32.2455 50.4133 32.8698 47.0757 33.9903 44.0128C37.8864 33.457 48.0092 26.0343 59.9614 26.0596C62.9221 26.0659 65.7226 26.5098 68.4179 27.3913C77.9332 30.4219 85.305 38.3743 87.4875 48.2315C87.8906 50.1481 88.1292 52.0644 88.149 54.0349Z"
          stroke="currentColor"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M60.8233 46.9242L61.1315 46.9524C62.6234 47.0875 63.6755 47.6848 64.3654 48.5057C64.9891 49.248 65.3306 50.1923 65.4157 51.1848H64.0748C64.0206 50.6084 63.8234 50.0086 63.4366 49.4961C62.9694 48.8776 62.2409 48.4037 61.2156 48.248L60.8233 48.1884V53.4647L61.1077 53.5101C62.595 53.7507 63.8184 54.0767 64.6695 54.6875C65.492 55.2778 65.9999 56.16 66 57.6161C65.9999 58.7085 65.593 59.7555 64.792 60.5569C63.9917 61.3574 62.7793 61.9329 61.1388 62.0486L60.8233 62.0708V64H60.1674V62.0728L59.855 62.0486C58.1464 61.9128 56.9401 61.2279 56.1572 60.278C55.4371 59.4041 55.0598 58.2842 55 57.1139H56.4177C56.4781 57.7836 56.6732 58.5406 57.113 59.1967C57.6335 59.9728 58.4832 60.5876 59.7834 60.754L60.1674 60.8025V54.9037L59.8872 54.8552C58.4122 54.5968 57.314 54.1671 56.5879 53.5394C55.8762 52.9242 55.491 52.0912 55.4909 50.9453C55.491 49.9107 55.881 48.9761 56.6097 48.2703C57.3396 47.5633 58.4289 47.0679 59.855 46.9524L60.1674 46.9272V45H60.8233V46.9242ZM60.8233 59.416C60.8233 59.6236 60.8175 59.7825 60.7984 59.9031C60.7785 60.0283 60.7504 60.0647 60.7465 60.0688C60.7296 60.0866 60.715 60.0996 60.6853 60.1274C60.6615 60.1496 60.6182 60.1902 60.5815 60.2416C60.5404 60.2994 60.5024 60.3768 60.4933 60.4731C60.4845 60.5658 60.5045 60.6508 60.5337 60.7227L60.5379 60.7318L60.542 60.7399C60.6072 60.8764 60.7305 60.9317 60.7901 60.9521C60.8584 60.9755 60.9288 60.9839 60.9862 60.9874C61.104 60.9946 61.2421 60.9837 61.3775 60.9642C61.6497 60.925 61.9776 60.8415 62.2399 60.7287L62.2389 60.7277C63.1101 60.3567 63.6855 59.8868 64.0395 59.3584C64.3937 58.8297 64.5096 58.2689 64.5097 57.7485C64.5097 57.0557 64.3139 56.4574 63.7572 55.9911C63.2241 55.5447 62.397 55.2526 61.2218 55.0523L60.8233 54.9846V59.416ZM60.0044 48.0297C59.8923 48.0248 59.7543 48.0334 59.6069 48.053C59.3853 48.0824 59.1184 48.1406 58.8545 48.2359L58.594 48.343C57.3688 48.9133 56.9615 49.9667 56.9615 50.8139C56.9616 51.2739 57.0494 51.7922 57.4846 52.253C57.9083 52.7014 58.6199 53.0511 59.7564 53.2878L60.1674 53.3737V49.6073C60.1674 49.4018 60.1724 49.2345 60.1861 49.11C60.1928 49.0486 60.2012 49.0045 60.2089 48.9756C60.2158 48.9499 60.2195 48.9478 60.213 48.9585C60.2209 48.9481 60.2323 48.937 60.2514 48.9211C60.2545 48.9185 60.3258 48.8637 60.3583 48.8331C60.407 48.7874 60.4842 48.7009 60.5057 48.5684C60.5262 48.4405 60.4848 48.3283 60.4424 48.248H60.4403C60.3962 48.1648 60.3315 48.1184 60.294 48.0974C60.2515 48.0737 60.21 48.0605 60.1809 48.053C60.1219 48.0377 60.0588 48.0321 60.0044 48.0297Z"
          fill="currentColor"
        />
      </>
    ),
    RWA: (
      <>
        <path d="M91 75.4756H29V76.4756H91V75.4756Z" fill="currentColor" />
        <path
          d="M46.4586 32V65.878M30.6543 32V65.878M61.5537 32V65.878M76.5824 40.976C75.7984 47.4669 74.704 50.6284 71.9925 52.6943C67.9974 55.6506 61.5255 54.1325 58.1696 52.8541C54.8138 51.5757 51.3781 49.9777 47.8624 50.3772C44.2669 50.7767 41.2306 53.3335 39.2331 56.2898C37.2356 59.2462 36.1969 62.7618 35.318 66.2774M69.946 40.686L76.3742 33.7026L83.0947 40.686L69.946 40.686Z"
          stroke="currentColor"
          strokeMiterlimit="10"
        />
      </>
    ),
    DeFI: (
      <path
        d="M37.6322 59.5148V50.3742H83.043V59.5148M60.3746 40.4058V60.0142M50.3738 32H69.4864V40.7781H50.3738V32ZM44.3734 66.8139C44.3734 70.7992 41.1562 74.0298 37.1877 74.0298C33.2191 74.0298 30.002 70.7992 30.002 66.8139C30.002 62.8287 33.2191 59.598 37.1877 59.598C41.1562 59.598 44.3734 62.8287 44.3734 66.8139ZM67.5603 66.8139C67.5603 70.7992 64.3431 74.0298 60.3746 74.0298C56.406 74.0298 53.1889 70.7992 53.1889 66.8139C53.1889 62.8287 56.406 59.598 60.3746 59.598C64.3431 59.598 67.5603 62.8287 67.5603 66.8139ZM90.6732 66.8139C90.6732 70.7992 87.456 74.0298 83.4875 74.0298C79.5189 74.0298 76.3017 70.7992 76.3017 66.8139C76.3017 62.8287 79.5189 59.598 83.4875 59.598C87.456 59.598 90.6732 62.8287 90.6732 66.8139Z"
        stroke="currentColor"
        strokeMiterlimit="10"
      />
    ),
  };
  const maskId = `ucm-frame-${label}`;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 120 108"
      fill="none"
      aria-hidden
      className="text-grey-200"
    >
      <mask id={maskId} fill="white">
        <path d="M116 0C118.209 2.57702e-07 120 1.79086 120 4V91.2881C120 92.3582 119.571 93.3841 118.81 94.1357L105.928 106.847C105.179 107.585 104.17 108 103.118 108H4C1.79086 108 4.76914e-06 106.209 0 104V0H116Z" />
      </mask>
      <path
        d="M116 0V-1V-1V0ZM118.81 94.1357L119.512 94.8476L119.512 94.8475L118.81 94.1357ZM105.928 106.847L105.225 106.135L105.225 106.135L105.928 106.847ZM4 108V107V107V108ZM0 104H-1V104H0ZM0 0V-1H-1V0H0ZM116 0V1C117.657 1 119 2.34315 119 4H120H121C121 1.23858 118.761 -1 116 -1V0ZM120 4H119V91.2881H120H121V4H120ZM120 91.2881H119C119 92.0908 118.678 92.8603 118.107 93.424L118.81 94.1357L119.512 94.8475C120.464 93.9079 121 92.6255 121 91.2881H120ZM118.81 94.1357L118.107 93.4239L105.225 106.135L105.928 106.847L106.63 107.558L119.512 94.8476L118.81 94.1357ZM105.928 106.847L105.225 106.135C104.664 106.689 103.907 107 103.118 107V108V109C104.433 109 105.695 108.482 106.63 107.558L105.928 106.847ZM103.118 108V107H4V108V109H103.118V108ZM4 108V107C2.34315 107 1 105.657 1 104H0H-1C-0.999994 106.761 1.23858 109 4 109V108ZM0 104H1V0H0H-1V104H0ZM0 0V1H116V0V-1H0V0Z"
        fill="currentColor"
        mask={`url(#${maskId})`}
      />
      {glyph[label]}
    </svg>
  );
}

// Mobile EXPLORE chip — cut-corner outline (130×44 viewBox, grey-200) with a
// diamond tick, a vertical divider, and the "EXPLORE" mono label.
function MobileExploreChip() {
  return (
    <div className="relative inline-flex items-center justify-center gap-[6px] px-[8px] py-[12px] text-grey-200">
      <svg
        className="absolute inset-0 h-full w-full text-grey-200"
        viewBox="0 0 130 44"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 0.5H126C127.933 0.5 129.5 2.067 129.5 4V27.2559C129.5 29.2715 128.689 31.2026 127.249 32.6133L117.156 42.5C116.502 43.1408 115.623 43.5 114.707 43.5H4C2.067 43.5 0.5 41.933 0.5 40V4C0.5 2.067 2.067 0.5 4 0.5Z"
          stroke="currentColor"
        />
      </svg>
      <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden className="shrink-0">
        <path
          d="M10 0.5L10 8.79289C10 9.23835 9.46143 9.46143 9.14645 9.14645L0.853553 0.853553C0.538571 0.53857 0.761654 -3.3293e-08 1.20711 -5.27643e-08L9.5 -4.15258e-07C9.77614 -4.27329e-07 10 0.223857 10 0.5Z"
          fill="currentColor"
        />
      </svg>
      <span className="block h-[8px] w-px bg-grey-300" />
      <span
        className="relative uppercase text-grey-200"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          lineHeight: 1.2,
          letterSpacing: "0.12px",
        }}
      >
        EXPLORE
      </span>
    </div>
  );
}

function MobileUseCaseCard({
  uc,
}: {
  uc: (typeof MOBILE_USE_CASES)[number];
}) {
  return (
    <a
      href={uc.href}
      className="flex flex-col bg-inverted-primary pb-[12px]"
      style={{ borderTop: "1px solid var(--grey-200)" }}
    >
      {/* top row — number eyebrow (left) + EXPLORE chip (right) */}
      <div className="flex w-full items-stretch justify-between">
        <div
          className="flex h-[28px] w-[31px] items-center justify-center text-grey-200"
          style={{
            borderRight: "1px solid var(--grey-200)",
            borderLeft: "1px solid var(--grey-200)",
            borderBottom: "1px solid var(--grey-200)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            lineHeight: 1.2,
          }}
        >
          {uc.number}
        </div>
        <div className="-mt-px">
          <MobileExploreChip />
        </div>
      </div>

      {/* bottom — icon box (30%) + heading; then body */}
      <div className="mt-[18px] flex flex-col gap-[20px]">
        <div className="flex gap-[12px]">
          <div className="w-[30%] shrink-0" style={{ aspectRatio: "120 / 108" }}>
            <MobileUcIcon label={uc.label} />
          </div>
          <div className="mt-[15px] flex-1">
            <h2
              className="font-heading font-[300] text-primary"
              style={{ fontSize: 36, lineHeight: 1.06, letterSpacing: "-0.02em" }}
            >
              {uc.label}
            </h2>
          </div>
        </div>
        <p
          className="text-primary"
          style={{ fontSize: 14, lineHeight: 1.2 }}
        >
          {uc.desc}
        </p>
      </div>
    </a>
  );
}

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

export function UseCasesCta({
  eyebrow = "WHAT POLYGON CAN DO FOR YOU",
  useCases = USE_CASES,
  mobileUseCases = MOBILE_USE_CASES,
  renderGetStarted = true,
  getStarted,
}: {
  eyebrow?: string;
  useCases?: UseCase[];
  mobileUseCases?: typeof MOBILE_USE_CASES;
  renderGetStarted?: boolean;
  getStarted?: Parameters<typeof GetStartedCta>[0];
} = {}) {
  return (
    <>
      <section
        className="relative w-full bg-inverted-primary"
        style={{ containerType: "inline-size" }}
      >
        {/* ── MOBILE (≤767px): live `.h-uc-mobile-wrap` — eyebrow + 4 cards ── */}
        <div className="md:hidden" style={{ containerType: "inline-size" }}>
          <MobileStage width={500} height={M_UC_H}>
            {/* Faint full-bleed background grid (shows through the card gaps),
                matching live's section bg grid. 5 cols × 100px @500. */}
            <div className="absolute inset-0 z-0">
              {Array.from({ length: Math.ceil(M_UC_H / 100) }).flatMap((_, row) =>
                Array.from({ length: 5 }).map((__, col) => (
                  <div
                    key={`bg-${row}-${col}`}
                    className="absolute"
                    style={{
                      left: col * 100,
                      top: row * 100,
                      width: 100,
                      height: 100,
                      border: "1px solid var(--stroke)",
                    }}
                  />
                )),
              )}
            </div>
            <div
              className="absolute z-[1] flex flex-col"
              style={{ left: 22, top: 111, width: 456, gap: 48 }}
            >
              {/* WHAT POLYGON CAN DO FOR YOU eyebrow — transparent, grey-200
                  border, triangle corner ticks, no dot (live is-stat). */}
              <Eyebrow
                text={eyebrow}
                borderColor="grey-200"
                textColor="primary"
              />
              {/* Card stack — gap 21. */}
              <div className="flex flex-col" style={{ gap: 21 }}>
                {mobileUseCases.map((uc) => (
                  <MobileUseCaseCard key={uc.number} uc={uc} />
                ))}
              </div>
            </div>
          </MobileStage>
        </div>

        {/* ── DESKTOP (≥768px): staircase stage (unchanged) ── */}
        <div
          className="relative hidden w-full md:block"
          style={{ aspectRatio: "1440 / 720" }}
        >
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
                text={eyebrow}
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
              {useCases.map((uc, i) => (
                <UseCaseBar key={uc.number} uc={uc} first={i === 0} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: GET STARTED CTA (Figma node 1727:42786) ── */}
      {renderGetStarted && <GetStartedCta {...getStarted} />}
    </>
  );
}

/* ───────────────────────────── GET STARTED CTA ─────────────────────────────
 * 1440×1440 design stage, scaled to section width (footer/pol-token pattern).
 * Fixed blue accent bg #3449c1 (does not flip). Grid, eyebrow, heading and
 * buttons use semantic tokens so they flip light/dark.
 */

// Footer button cards.
// `top` overrides the default card y (736) — needed when the heading wraps to
// more lines than the homepage default (e.g. the OMS band's 3-line heading,
// where live places the card lower so it clears "payments?").
type CtaButton = { label: string; href: string; left: number; top?: number };
const CTA_BUTTONS: CtaButton[] = [
  { label: "START BUILDING", href: "/docs", left: 60 },
  { label: "CONTACT US", href: "#contact", left: 510 },
  { label: "OPEN MONEY STACK", href: "#open-money-stack", left: 960 },
];

// One desktop CTA card — used for every button (homepage 3-up AND the OMS
// single card) so the frame, poly tick, and button geometry can never drift.
// `btn.left` positions the 420×164 card; a single centered card just passes
// left: 510 (page centre). Button is left-aligned at (60,56), 301×51 — the
// exact live geometry.
function GetStartedButtonCard({ btn }: { btn: CtaButton }) {
  return (
    <div
      className="absolute z-[4]"
      style={{ left: btn.left, top: btn.top ?? 736, width: 420, height: 164 }}
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
      {/* Corner poly mark at the top-left cut (live "trail poly.svg" — a
          rounded right-triangle, right angle bottom-right), 10px at (8,3). */}
      <svg
        className="absolute"
        style={{ left: 8, top: 3, width: 10, height: 10 }}
        viewBox="0 0 10 10"
        fill="none"
        aria-hidden
      >
        <path d="M8.79395 9.29395H0.501052C0.0555997 9.29395 -0.167485 8.75538 0.147498 8.44039L8.44039 0.147499C8.75537 -0.167484 9.29395 0.0555996 9.29395 0.501052V8.79395C9.29395 9.07009 9.07009 9.29395 8.79395 9.29395Z" fill="#F2F1F5" />
      </svg>
      {/* Button — live geometry: 301×51 at (60,56) inside the 420×164 card
          (left-aligned past the top-left cut, vertically centred). */}
      <div
        className="absolute"
        style={{ left: 60, top: 56, width: 301, height: 51 }}
      >
        <CtaCornerButton label={btn.label} href={btn.href} />
      </div>
    </div>
  );
}

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

export function GetStartedCta({
  eyebrow = "LET'S BUILD",
  heading = "Get started with Polygon",
  buttons = CTA_BUTTONS,
}: {
  eyebrow?: string;
  heading?: string;
  buttons?: CtaButton[];
} = {}) {
  const funnelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(funnelRef, { once: true, margin: "0px 0px -80px 0px" });
  return (
    <section
      id="get-started"
      className="relative w-full overflow-hidden bg-[#3449c1]"
      style={{ containerType: "inline-size" }}
    >
      {/* ── MOBILE (≤767px): centered eyebrow + heading + stacked cards ── */}
      <MobileGetStarted eyebrow={eyebrow} heading={heading} buttons={buttons} />

      {/* ── DESKTOP (≥768px): 1440×1200 stage (unchanged) ── */}
      <div className="hidden md:block" style={{ aspectRatio: "1440 / 1200" }}>
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
          {/* Corner cut on the transition band. Like every other themed asset
              (SVG fills can't read tokens), the corner flips via CSS dual-render:
              dark #07060D/#1B1B1D, light #F2F1F5/#E1E1E5 — matching the
              bg-inverted-primary band cells beside it. */}
          <style>{`
            .gs-corner-light { display: none; }
            [data-theme="light"] .gs-corner-dark { display: none; }
            [data-theme="light"] .gs-corner-light { display: block; }
          `}</style>
          <Image
            src="/assets/getstarted/row-corner.svg"
            alt=""
            width={120}
            height={120}
            unoptimized
            className="gs-corner-dark absolute z-[2] pointer-events-none select-none"
            style={{ left: 0, top: 1080, width: 120, height: 120 }}
          />
          <Image
            src="/assets/getstarted/row-corner-light.svg"
            alt=""
            width={120}
            height={120}
            unoptimized
            className="gs-corner-light absolute z-[2] pointer-events-none select-none"
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
            text={eyebrow}
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
          {heading}
        </h2>

        {/* Footer button cards — same card for every button; `btn.left`
            positions each one (homepage 3-up, or a single centred card at 510). */}
        {buttons.map((btn) => (
          <GetStartedButtonCard key={btn.label} btn={btn} />
        ))}
      </div>
      </div>
    </section>
  );
}

/* ──────────────────────── MOBILE GET STARTED (≤767px) ────────────────────────
 * Live blue section @375 (deviceMetrics 375×812): section h≈877, centered.
 *   • white-stroke grid behind (5 cols × 75px); a small black funnel near the
 *     top (row0 cells 1–3 black, row1 cell 2 black/white-top); a black bottom
 *     band (75px) with the first cell corner-clipped.
 *   • LET'S BUILD eyebrow @top 24 (centered); heading 48px/0.9 (-0.02em) @top
 *     190, wraps centered; 3 stacked full-width cut-corner cards (aspect
 *     343/96 → h≈87) @top 432, gap 12, each with corner poly mark + centered btn.
 */
const M_GS_H = 1000;
const M_GS_CELL = 100; // 500 / 5 cols
const M_GS_COLS = 5;
// The black "shape" band now lives in the footer's top row, so the get-started
// just ends with its grid rows.
const M_GS_ROWS = 10;
// Black funnel cells [col,row] near the top (live hide-desktop grid).
const M_FUNNEL: [number, number][] = [
  [1, 0],
  [2, 0],
  [3, 0],
  [2, 1],
];
const isFunnel = (c: number, r: number) =>
  M_FUNNEL.some(([fc, fr]) => fc === c && fr === r);

function MobileGetStarted({
  eyebrow,
  heading,
  buttons,
}: {
  eyebrow: string;
  heading: string;
  buttons: CtaButton[];
}) {
  return (
    <div className="md:hidden">
      <MobileStage width={500} height={M_GS_H}>
        {/* bg glow — blue radial (live `#background-gradient`: #141B6B base with a
            brighter glow toward the top). Covers the full section. */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(150% 90% at 50% 24%, #3a48b6 0%, #2731a2 45%, #1a2585 78%, #141b6b 100%)",
          }}
        />
        {/* white-stroke grid + funnel */}
        <div className="absolute inset-0 z-[1]">
          {Array.from({ length: M_GS_ROWS }).flatMap((_, row) =>
            Array.from({ length: M_GS_COLS }).map((__, col) => (
              <div
                key={`g-${row}-${col}`}
                className="absolute"
                style={{
                  left: col * M_GS_CELL,
                  top: row * M_GS_CELL,
                  width: M_GS_CELL,
                  height: M_GS_CELL,
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: isFunnel(col, row) ? "#07060d" : "transparent",
                  borderTop: isFunnel(col, row)
                    ? "1px solid rgba(255,255,255,0.07)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}
              />
            )),
          )}
          {/* Bottom black band — last row, on the section's real blue. The first
              cell is diagonal-clipped (#triangleClip) so the cut reveals the
              actual get-started blue (matches automatically, like OMS). */}
          {Array.from({ length: M_GS_COLS }).map((__, col) => (
            <div
              key={`band-${col}`}
              className="absolute z-[2] bg-inverted-primary"
              style={{
                left: col * M_GS_CELL,
                top: M_GS_H - M_GS_CELL,
                width: M_GS_CELL,
                height: M_GS_CELL,
                borderTop: "1px solid var(--grid-stroke)",
                clipPath: col === 0 ? "url(#triangleClip)" : undefined,
              }}
            />
          ))}
        </div>

        {/* centered content */}
        <div className="absolute z-[3] left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div style={{ height: 48 }} />
          <Eyebrow text={eyebrow} borderColor="grey-200" textColor="primary" hasDot />
          <h2
            className="mt-[224px] text-center font-heading font-[300] text-white"
            style={{ fontSize: 48, lineHeight: 0.9, letterSpacing: "-0.02em", width: 303 }}
          >
            {heading}
          </h2>
          <div className="mt-[78px] flex w-[457px] flex-col" style={{ gap: 12 }}>
            {buttons.map((btn) => (
              <div
                key={btn.label}
                className="relative flex items-center px-[20px]"
                style={{ aspectRatio: "343 / 96" }}
              >
                <svg
                  className="absolute inset-0 h-full w-full select-none"
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
                <svg
                  className="absolute"
                  style={{ left: 8, top: 3, width: 8, height: 8 }}
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden
                >
                  <path d="M8.79395 9.29395H0.501052C0.0555997 9.29395 -0.167485 8.75538 0.147498 8.44039L8.44039 0.147499C8.75537 -0.167484 9.29395 0.0555996 9.29395 0.501052V8.79395C9.29395 9.07009 9.07009 9.29395 8.79395 9.29395Z" fill="#F2F1F5" />
                </svg>
                <MobileTrailButton label={btn.label} href={btn.href} />
              </div>
            ))}
          </div>
        </div>
      </MobileStage>
    </div>
  );
}

// Desktop get-started button — identical to live (and to the mobile button):
// full-width cut-corner outline (`.black-button-bg.is-trails`, 305×53 viewBox,
// bottom-right diagonal), label LEFT + right chevron via justify-between.
function CtaCornerButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="scramble-host relative flex h-full w-full items-center justify-between whitespace-nowrap px-[16px] text-white transition-opacity hover:opacity-90"
    >
      {/* Cut-corner outline — verbatim live `.black-button-bg.is-trails` path. */}
      <svg
        className="absolute inset-0 h-full w-full select-none"
        viewBox="0 0 305 53"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M299.905 0C302.39 0.000263866 304.405 2.01488 304.405 4.5V32.5898C304.405 34.8702 303.489 37.0552 301.862 38.6533L289.03 51.2598C288.189 52.0862 287.056 52.5496 285.877 52.5498H4C1.79086 52.5498 0 50.7589 0 48.5498V4C0 1.79086 1.79086 1.45964e-08 4 0H299.905ZM4 1C2.34315 1 1 2.34315 1 4V48.5498C1 50.2067 2.34315 51.5498 4 51.5498H285.877C286.794 51.5496 287.675 51.1895 288.329 50.5469L301.162 37.9404C302.597 36.5303 303.405 34.6019 303.405 32.5898V4.5C303.405 2.56717 301.838 1.00026 299.905 1H4Z"
          fill="currentColor"
        />
      </svg>
      <span className="relative text-desktop-mono-small">
        <ScrambleText>{label}</ScrambleText>
      </span>
      <span className="relative">
        <TrailChevron />
      </span>
    </a>
  );
}

/* ── MOBILE-ONLY get-started button ──
 * Matches live `.btn-new.is-black.is-trails` at ≤479px: a full-width inner
 * button (label LEFT, chevron RIGHT via justify-between), transparent fill, a
 * cut-corner white outline (live `.black-button-bg.is-trails` SVG, bottom-right
 * diagonal = trailsButtonClip), 13px mono label, padding ≈13.6px / 12px.
 * Used ONLY inside the mobile GetStarted cards — never on desktop.
 */
// Right-pointing chevron — verbatim live `.oms-button-icon` path (12×12).
function TrailChevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="shrink-0"
      aria-hidden
    >
      <path
        d="M7.86511 5.38649C8.07403 5.5838 8.07403 5.9162 7.86511 6.11351L4.59331 9.20354C4.27444 9.50469 3.75 9.27863 3.75 8.84003L3.75 2.65997C3.75 2.22137 4.27444 1.99531 4.59331 2.29646L7.86511 5.38649Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MobileTrailButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="scramble-host relative flex w-full items-center justify-between whitespace-nowrap px-[12px] py-[13.6px] text-white transition-opacity hover:opacity-90"
    >
      {/* Cut-corner outline — verbatim live `.black-button-bg.is-trails` path
          (viewBox 305×53, bottom-right diagonal cut), stroked in currentColor. */}
      <svg
        className="absolute inset-0 h-full w-full select-none"
        viewBox="0 0 305 53"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M299.905 0C302.39 0.000263866 304.405 2.01488 304.405 4.5V32.5898C304.405 34.8702 303.489 37.0552 301.862 38.6533L289.03 51.2598C288.189 52.0862 287.056 52.5496 285.877 52.5498H4C1.79086 52.5498 0 50.7589 0 48.5498V4C0 1.79086 1.79086 1.45964e-08 4 0H299.905ZM4 1C2.34315 1 1 2.34315 1 4V48.5498C1 50.2067 2.34315 51.5498 4 51.5498H285.877C286.794 51.5496 287.675 51.1895 288.329 50.5469L301.162 37.9404C302.597 36.5303 303.405 34.6019 303.405 32.5898V4.5C303.405 2.56717 301.838 1.00026 299.905 1H4Z"
          fill="currentColor"
        />
      </svg>
      <span className="relative text-desktop-mono-small">
        <ScrambleText>{label}</ScrambleText>
      </span>
      <span className="relative">
        <TrailChevron />
      </span>
    </a>
  );
}
