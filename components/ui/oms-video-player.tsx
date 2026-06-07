'use client'

import { useEffect, useRef, useState } from 'react'

export function OmsVideoPlayer() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const entranceRef = useRef<HTMLVideoElement>(null)
  const loopRef = useRef<HTMLVideoElement>(null)
  const [phase, setPhase] = useState<'idle' | 'entrance' | 'loop'>('idle')
  const triggered = useRef(false)

  // Mute both imperatively for Safari
  useEffect(() => {
    if (entranceRef.current) entranceRef.current.muted = true
    if (loopRef.current) loopRef.current.muted = true
  }, [])

  // IntersectionObserver — trigger entrance video once when 30% visible
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (triggered.current) return
        if (entries[0].isIntersecting) {
          triggered.current = true
          setPhase('entrance')
          entranceRef.current?.play().catch(() => {})
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // When entrance ends, seamlessly switch to loop
  const onEntranceEnded = () => {
    setPhase('loop')
    if (loopRef.current) {
      loopRef.current.currentTime = 0
      loopRef.current.play().catch(() => {})
    }
  }

  return (
    <div ref={wrapRef} style={{ width: '100%', position: 'relative' }}>
      {/* Entrance video — visible during entrance phase */}
      <video
        ref={entranceRef}
        muted
        playsInline
        preload="auto"
        onEnded={onEntranceEnded}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          opacity: phase === 'entrance' ? 1 : 0,
          transition: 'opacity 0.1s',
        }}
      >
        <source src="/assets/oms-entrance.webm" type="video/webm" />
      </video>

      {/* Loop video — absolute overlay, same size, fades in when entrance ends */}
      <video
        ref={loopRef}
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: phase === 'loop' ? 1 : 0,
          transition: 'opacity 0.1s',
        }}
      >
        <source src="/assets/oms-loop.webm" type="video/webm" />
      </video>
    </div>
  )
}
