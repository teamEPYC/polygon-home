'use client'

import { useEffect, useRef } from 'react'

export function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    let raf: number

    const drawGrain = () => {
      const { width, height } = canvas
      const imageData = ctx.createImageData(width, height)
      const buf = imageData.data
      for (let i = 0; i < buf.length; i += 4) {
        const v = (Math.random() * 255) | 0
        buf[i] = buf[i + 1] = buf[i + 2] = v
        buf[i + 3] = 255
      }
      ctx.putImageData(imageData, 0, 0)
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawGrain()
    }

    const tick = () => {
      frame++
      // Redraw every 3 frames → ~20fps grain animation on a 60hz display
      if (frame % 3 === 0) drawGrain()
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('resize', resize)
    resize()
    tick()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999, opacity: 0.12, mixBlendMode: 'overlay' }}
    />
  )
}
