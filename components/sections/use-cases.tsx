"use client";

import Image from "next/image";
import type { ReactNode } from "react";
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

function DeFiIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
      <g
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* top node */}
        <rect x="30" y="18" width="12" height="10" rx="1" />
        {/* bottom nodes */}
        <rect x="16" y="44" width="12" height="10" rx="1" />
        <rect x="30" y="44" width="12" height="10" rx="1" />
        <rect x="44" y="44" width="12" height="10" rx="1" />
        {/* connectors */}
        <path d="M36 28v6M22 44v-4h28v4M36 40v4" />
      </g>
    </svg>
  );
}

type UseCase = {
  number: string;
  label: string;
  width: number;
  icon: ReactNode;
};

const USE_CASES: UseCase[] = [
  { number: "01", label: "Payments", width: 840, icon: <PaymentsIcon /> },
  { number: "02", label: "Stablecoins", width: 960, icon: <StablecoinsIcon /> },
  { number: "03", label: "RWA", width: 1080, icon: <RWAIcon /> },
  { number: "04", label: "DeFi", width: 1200, icon: <DeFiIcon /> },
];

// Icon-box cut-corner: top-right corner clipped (matches Figma container).
const ICO_CUT = 16;
const icoClip = `polygon(0 0, calc(100% - ${ICO_CUT}px) 0, 100% ${ICO_CUT}px, 100% 100%, 0 100%)`;

function UseCaseBar({ uc }: { uc: UseCase }) {
  return (
    <div
      className="relative bg-inverted-primary overflow-clip rounded-tl-[2px] shrink-0"
      style={{
        width: uc.width,
        height: 168,
        borderTop: "1px solid var(--grey-200)",
      }}
    >
      {/* content column — number badge on top, icon+label centered */}
      <div className="flex h-full flex-col items-start justify-center">
        {/* number badge */}
        <div
          className="absolute left-0 top-0 flex items-center justify-center bg-inverted-primary p-[8px] rounded-tl-[2px]"
          style={{ border: "1px solid var(--grey-200)" }}
        >
          <span className="font-mono text-[12px] leading-[1.1] tracking-[0.12px] uppercase text-grey-200">
            {uc.number}
          </span>
        </div>

        {/* icon + label */}
        <div className="flex items-center gap-[24px]">
          {/* cut-corner icon box */}
          <div
            className="relative shrink-0 bg-inverted-primary"
            style={{ width: 120, height: 108, clipPath: icoClip }}
          >
            <div
              className="absolute inset-0 bg-grey-200"
              style={{ clipPath: icoClip }}
            />
            <div
              className="absolute bg-inverted-primary"
              style={{ inset: 1, clipPath: icoClip }}
            />
            <div
              className="absolute text-grey-200"
              style={{ left: 24, top: 18 }}
            >
              {uc.icon}
            </div>
          </div>

          {/* label */}
          <p
            className="font-heading font-[300] whitespace-nowrap text-grey-100"
            style={{
              fontSize: 80,
              lineHeight: "72px",
              letterSpacing: "-0.8px",
            }}
          >
            {uc.label}
          </p>
        </div>
      </div>
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
        <div className="relative w-full" style={{ aspectRatio: "1440 / 840" }}>
          {/* Fixed 1440×840 design stage, scaled to the section width */}
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{
              width: 1440,
              height: 840,
              transform: "scale(calc(100cqw / 1440))",
            }}
          >
            {/* Background grid — full 12×7 grid of 120px cells */}
            <div className="absolute inset-0 z-[1]">
              {Array.from({ length: 7 }).flatMap((_, row) =>
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

            {/* Eyebrow */}
            <div className="absolute z-[3]" style={{ left: 60, top: 120 }}>
              <Eyebrow
                text="WHAT POLYGON CAN DO FOR YOU"
                borderColor="grey-100"
                textColor="primary"
                hasDot
              />
            </div>

            {/* Staircase list — right-aligned, stepping left going down */}
            <div
              className="absolute z-[2] flex flex-col items-end"
              style={{ left: 240, top: 120, width: 1200 }}
            >
              {USE_CASES.map((uc) => (
                <UseCaseBar key={uc.number} uc={uc} />
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

// Solid grid cells (bg-inverted-primary + border-stroke). Everything else faint.
const SOLID_CELLS: [number, number][] = [
  // Top inverted staircase
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
  // Bottom corner band @ y1320 (x0 handled separately by row-corner.svg)
  [120, 1320],
  [240, 1320],
  [360, 1320],
  [480, 1320],
  [600, 1320],
  [720, 1320],
  [840, 1320],
  [960, 1320],
  [1080, 1320],
  [1200, 1320],
  [1320, 1320],
];
const isSolid = (x: number, y: number) =>
  SOLID_CELLS.some(([sx, sy]) => sx === x && sy === y);

function GetStartedCta() {
  return (
    <section
      id="get-started"
      className="relative w-full overflow-hidden bg-[#3449c1]"
      style={{ containerType: "inline-size", aspectRatio: "1440 / 1440" }}
    >
      {/* Fixed 1440×1440 design stage, scaled to section width */}
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: 1440,
          height: 1440,
          transform: "scale(calc(100cqw / 1440))",
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

        {/* Background grid — 12 cols × 12 rows of 120px cells */}
        <div className="absolute inset-0 z-[1]">
          {Array.from({ length: 12 }).flatMap((_, row) =>
            Array.from({ length: 12 }).map((__, col) => {
              const x = col * 120;
              const y = row * 120;
              // Bottom-left corner-cut piece replaces the plain cell at x0/y1320.
              if (x === 0 && y === 1320) {
                return (
                  <Image
                    key={`${x}-${y}`}
                    src="/assets/getstarted/row-corner.svg"
                    alt=""
                    width={120}
                    height={120}
                    unoptimized
                    className="absolute pointer-events-none select-none"
                    style={{ left: x, top: y, width: 120, height: 120 }}
                  />
                );
              }
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
          {/* Solid cells layered on top (semantic tokens) */}
          {SOLID_CELLS.map(([x, y]) => (
            <div
              key={`solid-${x}-${y}`}
              className="absolute border border-stroke bg-inverted-primary"
              style={{ left: x, top: y, width: 120, height: 120 }}
            />
          ))}
        </div>

        {/* Eyebrow — centered */}
        <div
          className="absolute z-[3] -translate-x-1/2"
          style={{ left: 720, top: 284 }}
        >
          <Eyebrow
            text="LET'S BUILD"
            borderColor="grey-100"
            textColor="primary"
            hasDot
          />
        </div>

        {/* Heading — centered */}
        <h2
          className="absolute z-[3] -translate-x-1/2 text-center font-heading font-[300] text-grey-100"
          style={{
            left: 720,
            top: 504,
            width: 665,
            fontSize: 80,
            lineHeight: "72px",
            letterSpacing: "-0.8px",
          }}
        >
          Get Started with Polygon
        </h2>

        {/* Footer button cards */}
        {CTA_BUTTONS.map((btn) => (
          <div
            key={btn.label}
            className="absolute z-[4]"
            style={{ left: btn.left, top: 960, width: 420, height: 164 }}
          >
            {/* Cut-corner outlined card frame */}
            <Image
              src="/assets/getstarted/btn-card.svg"
              alt=""
              width={420}
              height={164}
              unoptimized
              className="absolute inset-0 pointer-events-none select-none"
              style={{ width: 420, height: 164 }}
            />
            {/* Rotated diamond tick at the card's top-left */}
            <div
              className="absolute border border-grey-100 bg-inverted-primary"
              style={{
                left: 8,
                top: 8,
                width: 10,
                height: 10,
                transform: "rotate(45deg)",
              }}
            />
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
      className="scramble-host inline-flex h-[44px] items-center gap-[10px] border border-primary pl-[16px] pr-[24px] text-primary transition-opacity hover:opacity-90"
      style={{ clipPath }}
    >
      <span className="text-desktop-mono-small">
        <ScrambleText>{label}</ScrambleText>
      </span>
      <CtaArrow />
    </a>
  );
}
