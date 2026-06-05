'use client'

import Image from 'next/image'
import { useRef, useState, useCallback } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'
import { Eyebrow } from '@/components/ui/eyebrow'

const STROKE = 'rgba(255,255,255,0.05)'
const CELL = 120

// Ellipse orbit parameters (pixels, absolute from section top-left)
const ORB_CX = 720   // center x (1440 / 2)
const ORB_CY = 348   // orbit center y — ~24px above diamond center
const ORB_A = 249    // semi-major (horizontal radius)
const ORB_B = 50     // semi-minor (vertical radius)

// Diamond center y for z-index cut (932/2 - 94 = 372)
const DIAMOND_CY = 372

const AUTO_SPEED = 0.00035      // radians per ms
const MOMENTUM_DECAY = 0.92     // per frame
const RESUME_DELAY_MS = 1200    // ms after drag ends before auto-rotation resumes

type CardDef = {
  value: string
  label: string
  bg: string
  baseAngle: number   // radians — starting position on ellipse
  size: 'lg' | 'sm'
}

const CARDS: CardDef[] = [
  // bottom-left (front, large)
  { value: '$2.3T+', label: 'Transfer\nVolume',     bg: '/assets/stat-card-bg-3.svg', baseAngle: Math.PI * 0.65, size: 'lg' },
  // bottom-right (front, large)
  { value: '$3.4B',  label: 'Stablecoin supply',    bg: '/assets/stat-card-bg-4.svg', baseAngle: Math.PI * 0.35, size: 'lg' },
  // top-left (back, small — flipped)
  { value: '1500+',  label: 'Transactions\nPer Second', bg: '/assets/stat-card-bg-1.svg', baseAngle: Math.PI * 1.35, size: 'sm' },
  // top-right (back, small — flipped)
  { value: '6.3T',   label: 'Total transactions',   bg: '/assets/stat-card-bg-2.svg', baseAngle: Math.PI * 1.65, size: 'sm' },
]

function getCardStyle(
  baseAngle: number,
  globalAngle: number,
  size: 'lg' | 'sm',
): React.CSSProperties {
  const φ = baseAngle + globalAngle
  const x = ORB_CX + ORB_A * Math.cos(φ)
  const y = ORB_CY + ORB_B * Math.sin(φ)

  const sinPhi = Math.sin(φ)

  // ScaleY: positive at front (bottom of orbit), negative/flipped at back (top)
  // Magnitude ~0.96 at front, ~0.86 at back — matches Figma static values
  const depth = (sinPhi + 1) / 2
  const scaleYSign = sinPhi >= 0 ? 1 : -1
  const scaleYMag = 0.86 + 0.10 * depth
  const scaleY = scaleYSign * scaleYMag

  // SkewX: cards lean as they curve around the ellipse
  const skewX = -35 * Math.cos(φ)

  // Z-index: cards below orbit center appear in front of diamond
  const zIndex = y > DIAMOND_CY ? 20 : 5

  const w = size === 'lg' ? 222 : 190
  const h = size === 'lg' ? 206 : 177

  return {
    position: 'absolute',
    left: x - w / 2,
    top: y - h / 2,
    width: w,
    height: h,
    transform: `scaleY(${scaleY.toFixed(3)}) skewX(${skewX.toFixed(1)}deg)`,
    transformOrigin: 'center center',
    zIndex,
    opacity: 0.70 + 0.30 * Math.abs(sinPhi),
  }
}

function StatCard({
  value,
  label,
  bg,
  style,
  size = 'lg',
}: {
  value: string
  label: string
  bg: string
  style: React.CSSProperties
  size?: 'lg' | 'sm'
}) {
  const pad = size === 'lg' ? 'p-[28px]' : 'p-[24px]'
  const valSize = size === 'lg' ? '40px' : '34px'
  const track = size === 'lg' ? '-0.4px' : '-0.34px'

  return (
    <div style={style}>
      <div className="relative overflow-hidden w-full h-full">
        <Image src={bg} alt="" fill className="object-fill" unoptimized />
        <div className={`absolute inset-0 flex flex-col justify-between ${pad}`}>
          <p
            className="font-heading font-[300] text-primary leading-[1.25]"
            style={{ fontSize: valSize, letterSpacing: track }}
          >
            {value}
          </p>
          <p
            className={`${size === 'lg' ? 'text-desktop-mono-large' : 'text-desktop-mono'} text-primary uppercase whitespace-pre-line`}
            style={{ fontFeatureSettings: '"dlig" 1' }}
          >
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}

function StaircaseRow({ top, left, cols }: { top: number; left: number; cols: number }) {
  return (
    <div
      className="absolute bg-[#07060D]"
      style={{
        top,
        left,
        width: cols * CELL,
        height: CELL,
        backgroundImage: `linear-gradient(${STROKE} 1px, transparent 1px), linear-gradient(90deg, ${STROKE} 1px, transparent 1px)`,
        backgroundSize: `${CELL}px ${CELL}px`,
        outline: `1px solid ${STROKE}`,
      }}
    />
  )
}

// Returns the cards and a drag overlay as siblings (no wrapping stacking context)
// so card z-indexes interleave properly with the diamond.
function OrbitingCards() {
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
      forceUpdate((n) => n + 1)
      return
    }

    angleRef.current += AUTO_SPEED * delta
    forceUpdate((n) => n + 1)
  })

  const onPanStart = useCallback(() => {
    isDraggingRef.current = true
    isPausedRef.current = true
    momentumRef.current = 0
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
  }, [])

  const onPan = useCallback((_e: PointerEvent, info: { delta: { x: number } }) => {
    const dAngle = (info.delta.x / 600) * Math.PI * 2
    angleRef.current -= dAngle
    momentumRef.current = -dAngle * 0.5
    forceUpdate((n) => n + 1)
  }, [])

  const onPanEnd = useCallback(() => {
    isDraggingRef.current = false
    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false
      momentumRef.current = 0
    }, RESUME_DELAY_MS)
  }, [])

  const cardStyles = CARDS.map((card) =>
    getCardStyle(card.baseAngle, angleRef.current, card.size)
  )

  return (
    <>
      {/* Cards render at the section stacking context — no z-indexed wrapper —
          so their individual zIndexes properly interleave with the diamond (z=10) */}
      {CARDS.map((card, i) => (
        <StatCard
          key={card.value}
          value={card.value}
          label={card.label}
          bg={card.bg}
          size={card.size}
          style={cardStyles[i]}
        />
      ))}
      {/* Transparent drag overlay on top of everything to capture pan events */}
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

export function AtGlance() {
  return (
    <section className="relative w-full h-[932px] overflow-hidden bg-[#141b6b]">
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

      {/* Staircase grid — dark cells forming a pyramid at the bottom */}
      <StaircaseRow top={480} left={600} cols={2} />
      <StaircaseRow top={600} left={480} cols={4} />
      <StaircaseRow top={720} left={240} cols={8} />

      {/* Faint grid over the whole section */}
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

      {/* 3D center diamond — z-index 10 sits between front and back cards */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[178px] h-[244px] pointer-events-none"
        style={{ left: '50%', top: `${DIAMOND_CY}px`, zIndex: 10 }}
      >
        <Image src="/assets/diamond-3d.png" alt="" fill className="object-cover" unoptimized />
      </div>

      {/* Orbiting stat cards + drag overlay */}
      <OrbitingCards />

      {/* Gem — left */}
      <div className="absolute w-[125px] h-[168px] pointer-events-none" style={{ left: 300, top: 492, zIndex: 15 }}>
        <Image src="/assets/gem-3d.svg" alt="" fill className="object-contain" unoptimized />
      </div>

      {/* Hexagon — right */}
      <div className="absolute w-[137px] h-[149px] pointer-events-none" style={{ left: 1011, top: 508, zIndex: 15 }}>
        <Image src="/assets/hexagon-3d.svg" alt="" fill className="object-contain" unoptimized />
      </div>
    </section>
  )
}
