'use client'

import Image from 'next/image'
import { useRef, useState, useCallback } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'
import { Eyebrow } from '@/components/ui/eyebrow'

const STROKE = 'rgba(255,255,255,0.05)'
const CELL = 120

/* ─── Cylinder geometry ───────────────────────────────────────────────────
 *  6 cards arranged as faces of a cylinder.
 *  Each card is subdivided into STRIPS thin vertical slices. Each slice is
 *  placed at the true circumradius and rotated to form a continuous arc,
 *  so all 6 cards together close a full circle when viewed from above.
 */
const NUM_CARDS = 6
const CARD_W = 220           // logical card width (maps to full arc per segment)
const CARD_H = 196           // card height
const STRIPS = 6             // arc slices per card  → 36 total strips = smooth circle
const CARD_DEG = 360 / NUM_CARDS  // 60° per card
const STRIP_DEG = CARD_DEG / STRIPS  // 10° per strip

// Cylinder circumradius R: the center of each strip arc at distance R from Y-axis.
// Chosen so the full arc length per card ≈ CARD_W.
// Arc per card = R × (60° in radians) = R × π/3  →  R = 3·CARD_W / π
const CYLINDER_R = Math.round((3 * CARD_W) / Math.PI)  // ≈ 210px

// Chord width of one strip (the actual CSS element width so strips are gapless)
const STRIP_CHORD = Math.round(2 * CYLINDER_R * Math.sin((STRIP_DEG * Math.PI) / 360))  // ≈ 36px

// Diamond center (orbit axis)
const DIAMOND_CX = 720
const DIAMOND_CY = 372        // = 932/2 − 94

const PERSPECTIVE_PX = 900    // perspective distance — controls 3D depth feel

const AUTO_SPEED = 0.00020    // rad/ms
const MOMENTUM_DECAY = 0.90
const RESUME_DELAY_MS = 1300

/* ─── Cards ───────────────────────────────────────────────────────────────
 *  6 entries: 4 original + 2 new (random realistic stats)
 */
const CARDS = [
  { value: '$2.3T+', label: 'Transfer\nVolume',         bg: '/assets/stat-card-bg-3.svg' },
  { value: '$3.4B',  label: 'Stablecoin\nSupply',       bg: '/assets/stat-card-bg-4.svg' },
  { value: '6.3T',   label: 'Total\nTransactions',      bg: '/assets/stat-card-bg-2.svg' },
  { value: '300M+',  label: 'Active\nAddresses',        bg: '/assets/stat-card-bg-1.svg' },
  { value: '1500+',  label: 'Transactions\nPer Second', bg: '/assets/stat-card-bg-3.svg' },
  { value: '$50B+',  label: 'Total Value\nLocked',      bg: '/assets/stat-card-bg-4.svg' },
]

/* ─── Staircase grid rows ─────────────────────────────────────────────── */
function StaircaseRow({ top, left, cols }: { top: number; left: number; cols: number }) {
  return (
    <div
      className="absolute bg-[#07060D]"
      style={{
        top, left,
        width: cols * CELL,
        height: CELL,
        backgroundImage: `linear-gradient(${STROKE} 1px, transparent 1px), linear-gradient(90deg, ${STROKE} 1px, transparent 1px)`,
        backgroundSize: `${CELL}px ${CELL}px`,
        outline: `1px solid ${STROKE}`,
      }}
    />
  )
}

/* ─── 3-D cylinder carousel ───────────────────────────────────────────── */
function CylinderCarousel() {
  const angleRef = useRef(0)
  const momentumRef = useRef(0)
  const isDraggingRef = useRef(false)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isPausedRef = useRef(false)
  const [, forceUpdate] = useState(0)

  useAnimationFrame((_t, delta) => {
    if (isDraggingRef.current) return
    if (isPausedRef.current) {
      if (Math.abs(momentumRef.current) > 0.0001) {
        angleRef.current += momentumRef.current
        momentumRef.current *= MOMENTUM_DECAY
      }
      forceUpdate(n => n + 1)
      return
    }
    angleRef.current += AUTO_SPEED * delta
    forceUpdate(n => n + 1)
  })

  const onPanStart = useCallback(() => {
    isDraggingRef.current = true
    isPausedRef.current = true
    momentumRef.current = 0
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
  }, [])

  const onPan = useCallback((_e: PointerEvent, info: { delta: { x: number } }) => {
    const dAngle = (info.delta.x / 650) * Math.PI * 2
    angleRef.current -= dAngle
    momentumRef.current = -dAngle * 0.55
    forceUpdate(n => n + 1)
  }, [])

  const onPanEnd = useCallback(() => {
    isDraggingRef.current = false
    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false
      momentumRef.current = 0
    }, RESUME_DELAY_MS)
  }, [])

  const globalAngle = angleRef.current  // in radians
  const globalAngleDeg = (globalAngle * 180) / Math.PI

  return (
    <>
      {/* ── perspective container covers the whole section ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          perspective: PERSPECTIVE_PX,
          // eye is centred on the diamond
          perspectiveOrigin: `${DIAMOND_CX}px ${DIAMOND_CY}px`,
          pointerEvents: 'none',
        }}
      >
        {/* ── rotating cylinder — origin at diamond centre ── */}
        <div
          style={{
            position: 'absolute',
            left: DIAMOND_CX,
            top: DIAMOND_CY,
            width: 0,
            height: 0,
            transformStyle: 'preserve-3d',
            // cylinder rotates around the Y-axis (vertical axis through diamond centre)
            transform: `rotateY(${globalAngleDeg}deg)`,
          }}
        >
          {/* ── Diamond — at Z = 0 (centre of cylinder) ── */}
          <div
            style={{
              position: 'absolute',
              left: -89,
              top: -122,
              width: 178,
              height: 244,
              transform: 'translateZ(0px)',
            }}
          >
            <Image src="/assets/diamond-3d.png" alt="" fill className="object-cover" unoptimized />
          </div>

          {/* ── 6 × STRIPS arc-strips forming the curved cylinder surface ── */}
          {CARDS.map((card, ci) =>
            Array.from({ length: STRIPS }).map((_, si) => {
              // Absolute angle of this strip in the cylinder
              const stripCentreDeg = ci * CARD_DEG + (si - (STRIPS - 1) / 2) * STRIP_DEG
              // Fraction along the card (0 = left edge, 1 = right edge)
              const fraction = si / STRIPS
              // How many pixels into the card image this strip starts
              const bgShift = Math.round(fraction * CARD_W)

              return (
                <div
                  key={`${ci}-${si}`}
                  style={{
                    position: 'absolute',
                    // centre the strip on the Y-axis (strips are rotated into place)
                    left: -STRIP_CHORD / 2,
                    top: -CARD_H / 2,
                    width: STRIP_CHORD,
                    height: CARD_H,
                    transform: `rotateY(${stripCentreDeg}deg) translateZ(${CYLINDER_R}px)`,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    overflow: 'hidden',
                  }}
                >
                  {/* Card background image — full-width, clipped to strip */}
                  <div
                    style={{
                      position: 'absolute',
                      left: -bgShift,
                      top: 0,
                      width: CARD_W,
                      height: CARD_H,
                    }}
                  >
                    <img
                      src={card.bg}
                      alt=""
                      style={{ width: CARD_W, height: CARD_H, display: 'block', objectFit: 'fill' }}
                    />
                  </div>
                </div>
              )
            })
          )}

          {/* ── Text overlay — one per card, flat at card-centre angle ── */}
          {/* Placed at Z = R+1 (just in front of the curved surface) and NOT inside
              a strip, so text is never clipped and always faces outward correctly. */}
          {CARDS.map((card, ci) => {
            const cardCentreDeg = ci * CARD_DEG
            return (
              <div
                key={`${ci}-text`}
                style={{
                  position: 'absolute',
                  left: -CARD_W / 2,
                  top: -CARD_H / 2,
                  width: CARD_W,
                  height: CARD_H,
                  transform: `rotateY(${cardCentreDeg}deg) translateZ(${CYLINDER_R + 1}px)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  pointerEvents: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '24px',
                }}
              >
                <p
                  className="font-heading font-[300] text-primary leading-[1.25]"
                  style={{ fontSize: '36px', letterSpacing: '-0.36px' }}
                >
                  {card.value}
                </p>
                <p
                  className="text-desktop-mono-large text-primary uppercase whitespace-pre-line"
                  style={{ fontFeatureSettings: '"dlig" 1' }}
                >
                  {card.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Transparent drag-capture overlay (above 3D scene) ── */}
      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ zIndex: 40 }}
        onPanStart={onPanStart as never}
        onPan={onPan as never}
        onPanEnd={onPanEnd}
      />
    </>
  )
}

/* ─── Section ─────────────────────────────────────────────────────────── */
export function AtGlance() {
  return (
    <section className="relative w-full h-[932px] overflow-hidden bg-[#141b6b]">
      {/* Atmospheric radial gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <Image src="/assets/at-glance-bg.svg" alt="" fill className="object-cover object-center" unoptimized />
      </div>

      {/* Staircase grid */}
      <StaircaseRow top={480} left={600} cols={2} />
      <StaircaseRow top={600} left={480} cols={4} />
      <StaircaseRow top={720} left={240} cols={8} />

      {/* Faint global grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${STROKE} 1px, transparent 1px), linear-gradient(90deg, ${STROKE} 1px, transparent 1px)`,
          backgroundSize: `${CELL}px ${CELL}px`,
        }}
      />

      {/* Heading */}
      <p
        className="absolute left-[60px] top-[80px] w-[424px] font-heading font-[300] text-[56px] leading-[60px] tracking-[-0.56px] text-grey-100 pointer-events-none"
        style={{ textIndent: '120px' }}
      >
        Polygon at a Glance.
      </p>
      <div className="absolute left-[60px] top-[96px] pointer-events-none">
        <Eyebrow text="INTRO" borderColor="grey-100" textColor="grey-100" />
      </div>

      {/* 3D cylinder carousel + diamond */}
      <CylinderCarousel />

      {/* Gem — left */}
      <div className="absolute w-[125px] h-[168px] pointer-events-none" style={{ left: 300, top: 492, zIndex: 50 }}>
        <Image src="/assets/gem-3d.svg" alt="" fill className="object-contain" unoptimized />
      </div>

      {/* Hexagon — right */}
      <div className="absolute w-[137px] h-[149px] pointer-events-none" style={{ left: 1011, top: 508, zIndex: 50 }}>
        <Image src="/assets/hexagon-3d.svg" alt="" fill className="object-contain" unoptimized />
      </div>
    </section>
  )
}
