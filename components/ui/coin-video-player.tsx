'use client'

import { useEffect, useRef, useState } from 'react'

const VIDEO_SRC = {
  light: '/assets/coin-loop.webm',
  dark: '/assets/coin-loop-dark.webm',
} as const

export function CoinVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // Read the active theme from the nearest [data-theme] ancestor. The homepage
  // forces data-theme="dark" on a wrapper div (not via next-themes), so we
  // observe the attribute directly rather than relying on useTheme().
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const el = containerRef.current?.closest('[data-theme]') as HTMLElement | null
    if (!el) return

    const read = () =>
      setTheme(el.getAttribute('data-theme') === 'light' ? 'light' : 'dark')

    read()
    const observer = new MutationObserver(read)
    observer.observe(el, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }
  }, [theme])

  return (
    <div ref={containerRef} className="absolute inset-0 z-[1]">
      <video
        // Remount on theme change so the new source loads and plays.
        key={theme}
        ref={videoRef}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        className="size-full object-cover"
      >
        <source src={VIDEO_SRC[theme]} type="video/webm" />
      </video>
    </div>
  )
}
