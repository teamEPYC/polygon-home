'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Gibberish-reveal scramble effect: the text turns to random glyphs and
 * resolves left-to-right to the real text. The real text stays in the DOM via
 * aria-label for accessibility, and is rendered on the server (no hydration
 * mismatch — animation only runs after mount).
 *
 * Two triggers:
 *  - `hover` (default): runs on hover/focus of the nearest `.scramble-host`
 *    ancestor (buttons/links). Uses the symbol glyph set.
 *  - `mount`: runs once on mount, after `startDelay` ms — the live hero
 *    heading's on-load decode. Honours `prefers-reduced-motion` (shows the
 *    final text instantly). Pass `charSet` to match the live look (letters).
 */
// Lowercase letters — matches the live hero heading decode; used as the
// default glyph set for hover scrambles (buttons) too.
const CHARS = 'abcdefghijklmnopqrstuvwxyz'

type Slot = { to: string; end: number }

export function ScrambleText({
  children,
  className,
  trigger = 'hover',
  charSet = CHARS,
  startDelay = 0,
}: {
  children: string
  className?: string
  trigger?: 'hover' | 'mount'
  charSet?: string
  startDelay?: number
}) {
  const text = children
  const spanRef = useRef<HTMLSpanElement>(null)
  const [output, setOutput] = useState(text)

  useEffect(() => {
    const span = spanRef.current
    if (!span) return
    const host = (span.closest('.scramble-host') as HTMLElement | null) ?? span

    let raf = 0
    let frame = 0
    let slots: Slot[] = []

    const tick = () => {
      let out = ''
      let done = 0
      for (const slot of slots) {
        if (slot.to === ' ') {
          out += ' '
          done++
        } else if (frame >= slot.end) {
          out += slot.to
          done++
        } else {
          out += charSet[Math.floor(Math.random() * charSet.length)]
        }
      }
      setOutput(out)
      if (done < slots.length) {
        frame += 1
        raf = requestAnimationFrame(tick)
      }
    }

    const run = () => {
      cancelAnimationFrame(raf)
      frame = 0
      // Staggered end frame per character → left-to-right reveal. (~2× faster
      // than the original 4 + i*2 cadence — shared by hover + mount.)
      slots = text.split('').map((to, i) => ({ to, end: 2 + i * 1 }))
      raf = requestAnimationFrame(tick)
    }

    const reset = () => {
      cancelAnimationFrame(raf)
      setOutput(text)
    }

    if (trigger === 'mount') {
      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        setOutput(text)
        return
      }
      // Hold a scrambled frame during the start delay so the real text never
      // flashes before the decode, then resolve left-to-right.
      setOutput(
        text
          .split('')
          .map((ch) => (ch === ' ' ? ' ' : charSet[Math.floor(Math.random() * charSet.length)]))
          .join(''),
      )
      const id = setTimeout(run, startDelay)
      return () => {
        clearTimeout(id)
        cancelAnimationFrame(raf)
      }
    }

    host.addEventListener('mouseenter', run)
    host.addEventListener('mouseleave', reset)
    host.addEventListener('focusin', run)
    host.addEventListener('focusout', reset)
    return () => {
      cancelAnimationFrame(raf)
      host.removeEventListener('mouseenter', run)
      host.removeEventListener('mouseleave', reset)
      host.removeEventListener('focusin', run)
      host.removeEventListener('focusout', reset)
    }
  }, [text, trigger, charSet, startDelay])

  return (
    <span
      ref={spanRef}
      className={`relative inline-block whitespace-nowrap${className ? ` ${className}` : ''}`}
      aria-label={text}
    >
      {/* Sizer: real text, invisible — reserves width so scrambling never shifts layout. */}
      <span aria-hidden className="invisible">
        {text}
      </span>
      {/* Animated overlay — absolutely positioned, so its varying width can't reflow. */}
      <span aria-hidden className="absolute inset-0">
        {output}
      </span>
    </span>
  )
}
