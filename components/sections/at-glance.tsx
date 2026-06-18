"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MobileStage } from "@/components/ui/stage";

// Exact live mobile section height @500 (`.glance-section` getBoundingClientRect
// height = 700). The blue bg overflows below but the section clips it.
const GLANCE_MOBILE_H = 700;

// Mobile (500-canvas) carousel geometry — extracted from live @500: the SAME 3D
// cylinder + centre diamond as desktop, just smaller. Live mobile diamond is
// 170×233 (vs desktop 260×347 → ratio ≈0.654); centred at x251 (canvas centre
// 250), y350 (relTop 234 + h/2). Cards/cylinder/perspective scale by the same
// 0.654 factor so the cylinder reads identically, just shrunk. Card value font on
// live mobile @500 = 28px (-0.28px tracking).
const R = 0.654; // mobile@500 : desktop scale
const MOBILE_GEOM = {
  cardW: Math.round(200 * R), // 131
  cardH: Math.round(180 * R), // 118
  cardPadding: 13,
  cylinderR: Math.round(200 * R), // 131
  diamondW: 170,
  diamondH: 233,
  diamondCx: 251,
  diamondCy: 350,
  perspective: `${Math.round(1296 * R)}px`, // 848
  valueFontSize: "28px",
  valueTracking: "-0.28px",
  // ~14.7px uppercase mono on the 500 canvas (13px desktop ÷ 0.654·…); set inline.
  labelClassName: "font-mono text-[14px] leading-[1.1] tracking-[0.14px]",
};

const STROKE = "rgba(255,255,255,0.05)";
// Grid lines on the inverted-primary staircase surface — flips with theme.
const STAIR_STROKE = "var(--grid-stroke)";
const CELL = 120;

/* ─── Cylinder geometry ───────────────────────────────────────────────────
 *  6 flat cards on a cylinder, each rotated to face outward.
 *  Cards use clip-path:url(#glanceCards) — the live site's cut-corner shape.
 *  Card dimensions from live site CSS: aspect-ratio 222/206, min-height 180px.
 */
const NUM_CARDS = 6;
const CARD_CENTER_DEG = 360 / NUM_CARDS; // 60° between card centres

// Desktop (1440-canvas) carousel geometry. Mobile passes scaled values via props
// (the live mobile glance is the same 3D cylinder + diamond, just smaller — diamond
// 150×206 @375 vs 260×347 @1440, ratio ≈0.577).
const DESKTOP_GEOM = {
  cardW: 200,
  cardH: 180,
  cardPadding: 20,
  cylinderR: 200,
  diamondW: 260,
  diamondH: 347,
  diamondCx: 720,
  diamondCy: 372,
  // 90vw at the 1440 design width = 1296px. Fixed px (not vw) so it lives in the
  // scale-to-fit stage's coordinate space and scales with the stage below 1440.
  perspective: "1296px",
  // Card typography (desktop): value 30px, label = text-desktop-mono (13px).
  valueFontSize: "30px",
  valueTracking: "-0.3px",
  labelClassName: "text-desktop-mono",
};
type CarouselGeom = typeof DESKTOP_GEOM;

const BASE_SPEED = -0.0002;
const SPRING_DAMPING = 0.97;
const SCROLL_STRENGTH = 0.0012;
const MAX_BOOST = 0.005;
const DRAG_DECAY = 0.88;

/* ─── Cards ───────────────────────────────────────────────────────────────
 *  6 stat cards
 */
const CARDS = [
  {
    value: "$2.3T+",
    label: "Transfer\nVolume",
    bg: "/assets/stat-card-bg-3.svg",
  },
  {
    value: "$3.4B",
    label: "Stablecoin\nSupply",
    bg: "/assets/stat-card-bg-4.svg",
  },
  {
    value: "6.3T",
    label: "Total\nTransactions",
    bg: "/assets/stat-card-bg-2.svg",
  },
  {
    value: "300M+",
    label: "Active\nAddresses",
    bg: "/assets/stat-card-bg-1.svg",
  },
  {
    value: "1500+",
    label: "Transactions\nPer Second",
    bg: "/assets/stat-card-bg-3.svg",
  },
  {
    value: "$50B+",
    label: "Total Value\nLocked",
    bg: "/assets/stat-card-bg-4.svg",
  },
];

/* ─── Staircase grid rows ─────────────────────────────────────────────── */
function StaircaseRow({
  top,
  left,
  cols,
  cell = CELL,
  height = cell,
}: {
  top: number;
  left: number;
  cols: number;
  cell?: number;
  /** Row height — defaults to one cell; override to bleed past the cell grid
   *  (e.g. the last mobile row reaching the section edge so no 1px section-bg
   *  hairline shows between the at-glance and OMS light platforms). */
  height?: number;
}) {
  return (
    <div
      className="absolute bg-inverted-primary"
      style={{
        top,
        left,
        width: cols * cell,
        height,
        backgroundImage: `linear-gradient(${STAIR_STROKE} 1px, transparent 1px), linear-gradient(90deg, ${STAIR_STROKE} 1px, transparent 1px)`,
        backgroundSize: `${cell}px ${cell}px`,
        outline: `1px solid ${STAIR_STROKE}`,
      }}
    />
  );
}

/* ─── 3-D cylinder carousel ───────────────────────────────────────────── */
function CylinderCarousel({ geom = DESKTOP_GEOM }: { geom?: CarouselGeom }) {
  const {
    cardW: CARD_W,
    cardH: CARD_H,
    cardPadding: CARD_PADDING,
    cylinderR: CYLINDER_R,
    diamondW: DIAMOND_W,
    diamondH: DIAMOND_H,
    diamondCx: DIAMOND_CX,
    diamondCy: DIAMOND_CY,
    perspective: PERSPECTIVE,
    valueFontSize,
    valueTracking,
    labelClassName,
  } = geom;
  const angleRef = useRef(0);
  const velocityRef = useRef(BASE_SPEED);
  const dragMomentumRef = useRef(0);
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, forceUpdate] = useState(0);

  useAnimationFrame((_t, delta) => {
    if (!isDraggingRef.current) {
      // Spring velocity back toward base speed — elastic snap-back feel
      velocityRef.current =
        velocityRef.current * SPRING_DAMPING +
        BASE_SPEED * (1 - SPRING_DAMPING);
      dragMomentumRef.current *= DRAG_DECAY;
      angleRef.current +=
        (velocityRef.current + dragMomentumRef.current) * delta;
    }
    forceUpdate((n) => n + 1);
  });

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (isDraggingRef.current) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
      const kick = (e.deltaY / 100) * SCROLL_STRENGTH;
      velocityRef.current = Math.max(
        BASE_SPEED - MAX_BOOST,
        Math.min(BASE_SPEED + MAX_BOOST, velocityRef.current + kick),
      );
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  const onPanStart = useCallback(() => {
    isDraggingRef.current = true;
    dragMomentumRef.current = 0;
  }, []);

  const onPan = useCallback(
    (_e: PointerEvent, info: { delta: { x: number } }) => {
      const dAngle = (info.delta.x / 4200) * Math.PI * 2;
      angleRef.current += dAngle;
      forceUpdate((n) => n + 1);
    },
    [],
  );

  const onPanEnd = useCallback(
    (_e: PointerEvent, info: { velocity: { x: number } }) => {
      isDraggingRef.current = false;
      dragMomentumRef.current = Math.max(
        -0.012,
        Math.min(0.012, info.velocity.x / 80000),
      );
    },
    [],
  );

  const globalAngle = angleRef.current;
  const globalAngleDeg = (globalAngle * 180) / Math.PI;

  return (
    <>
      {/* Entry animation — the whole structure (the "null" parent at the diamond
          centre) scales 50% → 100% over 1s with ease-out when the section scrolls
          into view. A single uniform scale keeps every card's size ratio and the
          gaps between cards constant. transformOrigin matches the perspectiveOrigin
          below so the diamond stays anchored while the cards scale in around it. */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${DIAMOND_CX}px ${DIAMOND_CY}px`,
          pointerEvents: "none",
        }}
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* perspective container covers the whole section */}
        <div
          ref={containerRef}
          style={{
            position: "absolute",
            inset: 0,
            perspective: PERSPECTIVE,
            perspectiveOrigin: `${DIAMOND_CX}px ${DIAMOND_CY}px`,
            pointerEvents: "none",
          }}
        >
        {/* rotating cylinder — origin at diamond centre */}
        <div
          style={{
            position: "absolute",
            left: DIAMOND_CX,
            top: DIAMOND_CY,
            width: 0,
            height: 0,
            transformStyle: "preserve-3d",
            transform: `rotateY(${globalAngleDeg}deg)`,
          }}
        >
          {/* Diamond — counter-rotated so it stays stationary at the cylinder axis */}
          <div
            style={{
              position: "absolute",
              left: -DIAMOND_W / 2,
              top: -DIAMOND_H / 2,
              width: DIAMOND_W,
              height: DIAMOND_H,
              transform: `rotateY(${-globalAngleDeg}deg) translateZ(0px)`,
            }}
          >
            <Image
              src="/assets/diamond-3d.png"
              alt=""
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* 6 flat stat cards — each uses the live site's glanceCards clip path */}
          {CARDS.map((card, ci) => {
            const cardAngleDeg = ci * CARD_CENTER_DEG;

            return (
              <div
                key={ci}
                style={{
                  position: "absolute",
                  left: -CARD_W / 2,
                  top: -CARD_H / 2,
                  width: CARD_W,
                  height: CARD_H,
                  transform: `rotateY(${cardAngleDeg}deg) translateZ(${CYLINDER_R}px)`,
                  clipPath: "url(#glanceCards)",
                  overflow: "hidden",
                  backfaceVisibility: "visible",
                }}
              >
                {/* Card bg is a translucent overlay (rgba dark @0.8 + white border) that
                    is theme-INDEPENDENT on live — verified the card fill is pixel-identical
                    in light and dark (it shows the diamond/scene through). Single asset. */}
                <img
                  src={card.bg}
                  alt=""
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "fill",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: CARD_PADDING,
                    pointerEvents: "none",
                  }}
                >
                  <p
                    className="font-heading font-[300] text-white"
                    style={{
                      fontSize: valueFontSize,
                      letterSpacing: valueTracking,
                      lineHeight: "1.2",
                    }}
                  >
                    {card.value}
                  </p>
                  <p
                    className={`${labelClassName} text-white uppercase whitespace-pre-line`}
                    style={{ fontFeatureSettings: '"dlig" 1' }}
                  >
                    {card.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </motion.div>

      {/* Transparent drag-capture overlay */}
      <motion.div
        className="absolute inset-0 cursor-grab select-none active:cursor-grabbing"
        style={{ zIndex: 40, touchAction: "none" }}
        onPanStart={onPanStart as never}
        onPan={onPan as never}
        onPanEnd={onPanEnd as never}
      />
    </>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────── */
export function AtGlance() {
  return (
    <section
      className="relative w-full select-none overflow-hidden bg-[#3449c1]"
      style={{ containerType: "inline-size" }}
    >
      {/* Fixed 1440×940 design stage, scaled to the section width (scale-to-fit).
          The 3D carousel, its entry animation, and the gem/hexagon all live in
          the 1440 coordinate space and scale as one unit.
          Hidden below md (768px), where the mobile stage takes over. */}
      <div className="relative hidden w-full overflow-hidden md:block" style={{ aspectRatio: "1440 / 940" }}>
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: 1440, height: 940, transform: "scale(calc(100cqw / 1440px))" }}
        >
      {/* Atmospheric radial gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/assets/at-glance-bg.svg"
          alt=""
          fill
          className="object-cover object-center"
          unoptimized
        />
      </div>

      {/* Staircase grid */}
      <StaircaseRow top={600} left={600} cols={2} />
      <StaircaseRow top={720} left={480} cols={4} />
      <StaircaseRow top={840} left={240} cols={8} />

      {/* Faint global grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${STROKE} 1px, transparent 1px), linear-gradient(90deg, ${STROKE} 1px, transparent 1px)`,
          backgroundSize: `${CELL}px ${CELL}px`,
        }}
      />

      {/* Heading — live CSS: u-h2-new: font-size:min(4rem,4.444vw)=64px, line-height:1.06, letter-spacing:-0.02em */}
      <h2
        className="absolute left-[60px] top-[60px] w-[600px] text-desktop-h2 text-white pointer-events-none"
        style={{ textIndent: "120px" }}
      >
        We&rsquo;ve been
        <br />
        around the block
      </h2>
      {/* STATS eyebrow — fixed white text + white border on the blue band (both themes, per live) */}
      <div className="absolute left-[60px] top-[76px] pointer-events-none">
        <Eyebrow
          text="STATS"
          borderColor="white-full"
          textColor="white"
        />
      </div>

      {/* 3D cylinder carousel + diamond */}
      <CylinderCarousel />

      {/* Gem — left: 18% of 1440 = 259px per live CSS */}
      <div
        className="absolute pointer-events-none"
        style={{ left: "18%", bottom: "15.5%", width: 120, zIndex: 50 }}
      >
        <Image
          src="/assets/gem-3d.svg"
          alt=""
          width={120}
          height={161}
          className="object-contain"
          unoptimized
        />
      </div>

      {/* Hexagon — right, width:120px per live site CSS */}
      <div
        className="absolute pointer-events-none"
        style={{ right: "18%", bottom: "15.5%", width: 120, zIndex: 50 }}
      >
        <Image
          src="/assets/hexagon-3d.svg"
          alt=""
          width={120}
          height={130}
          className="object-contain"
          unoptimized
        />
      </div>
        </div>
      </div>

      {/* ───────────────────────── MOBILE (≤767px) ─────────────────────────
          500-canvas stage. Live mobile glance is the SAME composition as desktop
          — uniform blue bg + faint white grid, STATS eyebrow + heading top-left,
          the 3D cylinder carousel + centre diamond, and a gem (left) + stone
          (right) at the bottom — just scaled down. All px on the 500 canvas,
          extracted from live polygon.technology @500. */}
      <MobileStage className="md:hidden" width={500} height={GLANCE_MOBILE_H}>
        {/* Blue bg — live `.blue-bg.is-glance` (home bg.svg), object-cover. We reuse
            the desktop at-glance-bg.svg (renders the same near-uniform #3449C1). */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/assets/at-glance-bg.svg"
            alt=""
            fill
            className="object-cover object-center"
            unoptimized
          />
        </div>

        {/* Faint white grid — live `.u-bg-grid.is-white`: 100px cells (500/5 cols),
            stroke rgba(255,255,255,0.05). */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${STROKE} 1px, transparent 1px), linear-gradient(90deg, ${STROKE} 1px, transparent 1px)`,
            backgroundSize: `100px 100px`,
          }}
        />

        {/* Black stepped platform under the carousel — live `.bg-grid-item.bg-black`
            cells (#07060D, 100×100): a 2-tier staircase. Upper tier = 3 cells
            (x100→400) at y499; lower tier = 5 cells (full width) at y599. The gem
            sits in the left blue cell, the stone in the right one (both on top). */}
        <StaircaseRow top={499} left={100} cols={3} cell={100} />
        {/* height 101 (not 100) so the row reaches the section bottom (700) with
            no 1px blue section-bg hairline at the at-glance/OMS seam in light mode. */}
        <StaircaseRow top={599} left={0} cols={5} cell={100} height={101} />

        {/* Heading — live mobile `.u-h2-new` @500: 32px, line-height 1.06, tracking
            -0.64px, at x41 y35. Line 1 ("We've been") is indented to clear the
            inline STATS eyebrow; line 2 ("around the block") wraps to the left. */}
        <h2
          className="absolute left-[41px] top-[35px] w-[340px] font-heading font-light text-white pointer-events-none text-[32px] leading-[1.06] tracking-[-0.64px]"
          style={{ textIndent: "72px" }}
        >
          We&rsquo;ve been
          <br />
          around the block
        </h2>

        {/* STATS eyebrow — fixed white text + white border on the blue band */}
        <div className="absolute left-[41px] top-[37px] pointer-events-none">
          <Eyebrow text="STATS" borderColor="white-full" textColor="white" />
        </div>

        {/* 3D cylinder carousel + diamond — mobile-scaled geometry (R≈0.654) */}
        <CylinderCarousel geom={MOBILE_GEOM} />

        {/* Gem — bottom-left (live `.glance-image-left`: x21 y468, 90×121) */}
        <div
          className="absolute pointer-events-none"
          style={{ left: 21, top: 468, width: 90, zIndex: 50 }}
        >
          <Image
            src="/assets/glance-gem-mobile.webp"
            alt=""
            width={90}
            height={121}
            className="object-contain"
            unoptimized
          />
        </div>

        {/* Stone — bottom-right (live `.glance-image-right`: x390 y477, 90×98) */}
        <div
          className="absolute pointer-events-none"
          style={{ left: 390, top: 477, width: 90, zIndex: 50 }}
        >
          <Image
            src="/assets/glance-stone-mobile.webp"
            alt=""
            width={90}
            height={98}
            className="object-contain"
            unoptimized
          />
        </div>
      </MobileStage>
    </section>
  );
}
