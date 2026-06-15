"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { Eyebrow } from "@/components/ui/eyebrow";

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

const CARD_W = 200;
const CARD_H = 180;
const CARD_PADDING = 20;

const CYLINDER_R = 200;

const DIAMOND_W = 260;
const DIAMOND_H = 347;

const DIAMOND_CX = 720;
const DIAMOND_CY = 372;

// 90vw at the 1440 design width = 1296px. Fixed px (not vw) so it lives in the
// scale-to-fit stage's coordinate space and scales with the stage below 1440.
const PERSPECTIVE = "1296px";

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
}: {
  top: number;
  left: number;
  cols: number;
}) {
  return (
    <div
      className="absolute bg-inverted-primary"
      style={{
        top,
        left,
        width: cols * CELL,
        height: CELL,
        backgroundImage: `linear-gradient(${STAIR_STROKE} 1px, transparent 1px), linear-gradient(90deg, ${STAIR_STROKE} 1px, transparent 1px)`,
        backgroundSize: `${CELL}px ${CELL}px`,
        outline: `1px solid ${STAIR_STROKE}`,
      }}
    />
  );
}

/* ─── 3-D cylinder carousel ───────────────────────────────────────────── */
function CylinderCarousel() {
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
      const dAngle = (info.delta.x / 650) * Math.PI * 2;
      angleRef.current += dAngle;
      forceUpdate((n) => n + 1);
    },
    [],
  );

  const onPanEnd = useCallback(
    (_e: PointerEvent, info: { velocity: { x: number } }) => {
      isDraggingRef.current = false;
      dragMomentumRef.current = Math.max(
        -0.1,
        Math.min(0.1, info.velocity.x / 10000),
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
                      fontSize: "30px",
                      letterSpacing: "-0.3px",
                      lineHeight: "1.2",
                    }}
                  >
                    {card.value}
                  </p>
                  <p
                    className="text-desktop-mono text-white uppercase whitespace-pre-line"
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
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ zIndex: 40 }}
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
      className="relative w-full overflow-hidden bg-[#3449c1]"
      style={{ containerType: "inline-size" }}
    >
      {/* Fixed 1440×940 design stage, scaled to the section width (scale-to-fit).
          The 3D carousel, its entry animation, and the gem/hexagon all live in
          the 1440 coordinate space and scale as one unit. */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1440 / 940" }}>
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
    </section>
  );
}
