'use client'

import Image from 'next/image'
import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'
import { Eyebrow } from '@/components/ui/eyebrow'

const STROKE = 'rgba(255,255,255,0.05)'
const CELL = 120

/* ─── Cylinder geometry ───────────────────────────────────────────────────
 *  6 cards on a cylinder. Each card spans CARD_SPAN_DEG (< 60°) so there
 *  are visible gaps between adjacent cards. Each card is sliced into STRIPS
 *  vertical arcs placed at CYLINDER_R — text and background both clip inside
 *  each strip and reassemble across the arc, making text follow the curve.
 */
const NUM_CARDS = 6
const CARD_CENTER_DEG = 360 / NUM_CARDS  // 60° between card centres
const CARD_SPAN_DEG = 54     // arc each card occupies → 6° gap between adjacent cards
const STRIPS = 12            // arc strips per card — more = smoother curve
const STRIP_DEG = CARD_SPAN_DEG / STRIPS  // 6.25° per strip

const CYLINDER_R = 208       // circumradius — controls card spacing and depth

// Chord width of one strip (actual CSS element width)
const STRIP_CHORD = 2 * CYLINDER_R * Math.sin((STRIP_DEG / 2) * Math.PI / 180)
// Logical card content width (sum of all strip chords)
const CARD_W = Math.round(STRIPS * STRIP_CHORD)
const CARD_H = 168

const DIAMOND_W = 240
const DIAMOND_H = 320

// Diamond center (cylinder axis)
const DIAMOND_CX = 720
const DIAMOND_CY = 372

const PERSPECTIVE_PX = 750   // closer perspective = more dramatic 3D depth

const AUTO_SPEED = 0.00020    // rad/ms
const MOMENTUM_DECAY = 0.90

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
  // Extra momentum added on top of the base auto-rotation. Decays toward 0 every
  // frame so the carousel smoothly blends back to AUTO_SPEED without any pause.
  const momentumRef = useRef(0)
  const isDraggingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [, forceUpdate] = useState(0)

  useAnimationFrame((_t, delta) => {
    // Decay extra momentum each frame — blends naturally back to auto-speed
    momentumRef.current *= MOMENTUM_DECAY
    if (!isDraggingRef.current) {
      angleRef.current += AUTO_SPEED * delta + momentumRef.current
    }
    forceUpdate(n => n + 1)
  })

  // Global wheel listener — fires regardless of cursor position.
  // Only applied when the section is visible in the viewport.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (isDraggingRef.current) return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return
      const kick = (e.deltaY / 100) * 0.012
      momentumRef.current = Math.max(-0.1, Math.min(0.1, momentumRef.current + kick))
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  const onPanStart = useCallback(() => {
    isDraggingRef.current = true
    momentumRef.current = 0
  }, [])

  const onPan = useCallback((_e: PointerEvent, info: { delta: { x: number } }) => {
    const dAngle = (info.delta.x / 650) * Math.PI * 2
    angleRef.current += dAngle
    forceUpdate(n => n + 1)
  }, [])

  const onPanEnd = useCallback((_e: PointerEvent, info: { velocity: { x: number } }) => {
    isDraggingRef.current = false
    // Use Framer Motion's smoothed release velocity for the fling — capped so it
    // stays legible. Decays naturally back to auto-speed via MOMENTUM_DECAY.
    momentumRef.current = Math.max(-0.1, Math.min(0.1, info.velocity.x / 10000))
  }, [])

  const globalAngle = angleRef.current  // in radians
  const globalAngleDeg = (globalAngle * 180) / Math.PI

  return (
    <>
      {/* ── perspective container covers the whole section ── */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          inset: 0,
          perspective: PERSPECTIVE_PX,
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
            transform: `rotateY(${globalAngleDeg}deg)`,
          }}
        >
          {/* ── Diamond — counter-rotated so it stays stationary in world space ── */}
          <div
            style={{
              position: 'absolute',
              left: -DIAMOND_W / 2,
              top: -DIAMOND_H / 2,
              width: DIAMOND_W,
              height: DIAMOND_H,
              // rotateY(-globalAngleDeg) cancels the parent cylinder rotation exactly,
              // so the diamond appears fixed while cards spin around it.
              transform: `rotateY(${-globalAngleDeg}deg) translateZ(0px)`,
            }}
          >
            <Image src="/assets/diamond-3d.png" alt="" fill className="object-cover" unoptimized />
          </div>

          {/* ── 6 × STRIPS arc-strips forming the curved cylinder surface ──
           *  Text is rendered INSIDE each strip alongside the background so it
           *  clips and reassembles across the arc — giving the "text follows the
           *  curve" effect. No separate flat text overlay needed.
           */}
          {CARDS.map((card, ci) =>
            Array.from({ length: STRIPS }).map((_, si) => {
              const stripCentreDeg = ci * CARD_CENTER_DEG + (si - (STRIPS - 1) / 2) * STRIP_DEG
              // Pixel offset into the card image this strip represents
              const bgShift = Math.round(si * STRIP_CHORD)

              return (
                <div
                  key={`${ci}-${si}`}
                  style={{
                    position: 'absolute',
                    left: -STRIP_CHORD / 2,
                    top: -CARD_H / 2,
                    width: STRIP_CHORD,
                    height: CARD_H,
                    transform: `rotateY(${stripCentreDeg}deg) translateZ(${CYLINDER_R}px)`,
                    overflow: 'hidden',
                  }}
                >
                  {/* Full card content shifted so only this strip's horizontal slice shows */}
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
                      style={{ position: 'absolute', inset: 0, width: CARD_W, height: CARD_H, display: 'block', objectFit: 'fill' }}
                    />
                    {/* Text overlaid on the same shifting div — clips with the strip */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '18px',
                        pointerEvents: 'none',
                      }}
                    >
                      <p
                        className="font-heading font-[300] text-primary"
                        style={{ fontSize: '30px', letterSpacing: '-0.3px', lineHeight: '1.2' }}
                      >
                        {card.value}
                      </p>
                      <p
                        className="text-desktop-mono text-primary uppercase whitespace-pre-line"
                        style={{ fontFeatureSettings: '"dlig" 1' }}
                      >
                        {card.label}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* ── Transparent drag-capture overlay (above 3D scene) ── */}
      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ zIndex: 40 }}
        onPanStart={onPanStart as never}
        onPan={onPan as never}
        onPanEnd={onPanEnd as never}
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
