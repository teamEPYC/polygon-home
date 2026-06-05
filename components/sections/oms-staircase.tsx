'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Eyebrow } from '@/components/ui/eyebrow'

const STROKE = 'rgba(255,255,255,0.05)'
const CELL = 120

const ROWS = [
  { top: 0,   left: 240, cols: 8 },
  { top: 120, left: 480, cols: 4 },
  { top: 240, left: 600, cols: 2 },
]

// Eyebrow appears after all 3 rows have landed
const EYEBROW_DELAY = ROWS.length * 0.14  // 0.42s

export function OMSStaircase() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })

  return (
    <>
      {/* Trigger anchor at the top of the staircase */}
      <div ref={ref} className="absolute top-0 left-0 w-px h-px pointer-events-none" />

      {ROWS.map((row, i) => (
        <motion.div
          key={i}
          className="absolute bg-[#07060D]"
          style={{
            top: row.top,
            left: row.left,
            width: row.cols * CELL,
            height: CELL,
            backgroundImage: `linear-gradient(${STROKE} 1px, transparent 1px), linear-gradient(90deg, ${STROKE} 1px, transparent 1px)`,
            backgroundSize: `${CELL}px ${CELL}px`,
            outline: `1px solid ${STROKE}`,
          }}
          initial={{ y: -CELL, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : undefined}
          transition={{
            duration: 0.55,
            delay: i * 0.14,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}

      {/* Eyebrow — fades in after the last row lands */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-10"
        style={{ top: 284 }}
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{
          duration: 0.4,
          delay: EYEBROW_DELAY,
          ease: 'easeOut',
        }}
      >
        <Eyebrow text="OPEN MONEY STACK" borderColor="stroke" textColor="primary" hasDot />
      </motion.div>
    </>
  )
}
