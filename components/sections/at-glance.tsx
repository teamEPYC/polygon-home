'use client'

import Image from 'next/image'
import { useRef, useState, useCallback } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'
import { Eyebrow } from '@/components/ui/eyebrow'

const STROKE = 'rgba(255,255,255,0.05)'
const CELL = 120

// Diamond center — all orbit math is relative to this point
const DIAMOND_CX = 720
const DIAMOND_CY = 372   // = 932 / 2 - 94

// Horizontal carousel orbit
// sin(θ) → x offset,  cos(θ) → depth (1=front, -1=back)
const ORB_R = 240        // horizontal radius
const ORB_VERT = 24      // slight vertical tilt: front cards slightly lower, back higher

const AUTO_SPEED = 0.00030      // rad/ms
const MOMENTUM_DECAY = 0.90
const RESUME_DELAY_MS = 1200

type CardDef = {
  value: string
  label: string
  bg: string
  baseAngle: number
}

// 4 cards at 90° intervals. baseAngle=0 → starts at FRONT (cos=1, sin=0, x=center).
// Cards face the viewer at all times — only position and scale change.
const CARDS: CardDef[] = [
  { value: '$2.3T+', label: 'Transfer\nVolume',        bg: '/assets/stat-card-bg-3.svg', baseAngle: 0           },
  { value: '$3.4B',  label: 'Stablecoin\nSupply',      bg: '/assets/stat-card-bg-4.svg', baseAngle: Math.PI / 2  },
  { value: '6.3T',   label: 'Total\nTransactions',     bg: '/assets/stat-card-bg-2.svg', baseAngle: Math.PI      },
  { value: '1500+',  label: 'Transactions\nPer Second', bg: '/assets/stat-card-bg-1.svg', baseAngle: 3 * Math.PI / 2 },
]

const CARD_W = 222
const CARD_H = 206

// Null-object carousel: the null sits at the diamond center and rotates.
// Each card is a child of the null at its baseAngle offset. The card face
// never rotates — only its world position and depth-based scale change.
function getCardStyle(baseAngle: number, globalAngle: number): React.CSSProperties {
  const θ = baseAngle + globalAngle

  const sinθ = Math.sin(θ)
  const depth = Math.cos(θ)   // 1 = front (closest), -1 = back (farthest)

  const x = DIAMOND_CX + ORB_R * sinθ
  const y = DIAMOND_CY + ORB_VERT * depth  // front cards slightly lower

  // Uniform scale for depth: 1.0 at front, 0.55 at sides, 0.1 at back
  const scale = 0.55 + 0.45 * (depth + 1) / 2

  // Z-index: front card (z=20) above diamond (z=14), back card (z=2) below
  const zIndex = 2 + Math.round((depth + 1) * 9)

  const opacity = 0.55 + 0.45 * (depth + 1) / 2

  return {
    position: 'absolute',
    left: x - CARD_W / 2,
    top: y - CARD_H / 2,
    width: CARD_W,
    height: CARD_H,
    transform: `scale(${scale.toFixed(3)})`,
    transformOrigin: 'center center',
    zIndex,
    opacity,
  }
}

function StatCard({
  value,
  label,
  bg,
  style,
}: {
  value: string
  label: string
  bg: string
  style: React.CSSProperties
}) {
  return (
    <div style={style}>
      <div className="relative overflow-hidden w-full h-full">
        <Image src={bg} alt="" fill className="object-fill" unoptimized />
        <div className="absolute inset-0 flex flex-col justify-between p-[28px]">
          <p
            className="font-heading font-[300] text-primary leading-[1.25]"
            style={{ fontSize: '40px', letterSpacing: '-0.4px' }}
          >
            {value}
          </p>
          <p
            className="text-desktop-mono-large text-primary uppercase whitespace-pre-line"
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
    // Map drag pixels to angle: full section width ≈ one full rotation
    const dAngle = (info.delta.x / 700) * Math.PI * 2
    angleRef.current -= dAngle
    momentumRef.current = -dAngle * 0.6
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
    getCardStyle(card.baseAngle, angleRef.current)
  )

  return (
    <>
      {/* Cards rendered in the section stacking context so z-indexes interleave
          with the diamond (z=14) and staircase rows */}
      {CARDS.map((card, i) => (
        <StatCard
          key={card.value}
          value={card.value}
          label={card.label}
          bg={card.bg}
          style={cardStyles[i]}
        />
      ))}
      {/* Transparent drag-capture overlay on top of everything */}
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

      {/* Staircase grid */}
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

      {/* Orbiting stat cards (rendered before diamond so diamond z-index
          can sit above back/side cards and below front card) */}
      <OrbitingCards />

      {/* 3D diamond — z=14: above side/back cards, below front card */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[178px] h-[244px] pointer-events-none"
        style={{ left: '50%', top: `${DIAMOND_CY}px`, zIndex: 14 }}
      >
        <Image src="/assets/diamond-3d.png" alt="" fill className="object-cover" unoptimized />
      </div>

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
