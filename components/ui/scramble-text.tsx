'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Gibberish-reveal hover effect: on hover of the nearest `.scramble-host`
 * ancestor (button/link), the text turns to random gibberish and resolves
 * left-to-right back to the real text. The real text stays in the DOM via
 * aria-label for accessibility, and is rendered on the server (no hydration
 * mismatch — animation only runs after mount, on hover).
 */
const CHARS = '!<>-_\\/[]{}—=+*^?#$%&@'

type Slot = { to: string; end: number }

export function ScrambleText({
  children,
  className,
}: {
  children: string
  className?: string
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
          out += CHARS[Math.floor(Math.random() * CHARS.length)]
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
      // Staggered end frame per character → left-to-right reveal.
      slots = text.split('').map((to, i) => ({ to, end: 4 + i * 2 }))
      raf = requestAnimationFrame(tick)
    }

    const reset = () => {
      cancelAnimationFrame(raf)
      setOutput(text)
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
  }, [text])

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
