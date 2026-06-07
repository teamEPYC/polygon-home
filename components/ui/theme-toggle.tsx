'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ScrambleText } from '@/components/ui/scramble-text'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return (
    <div className="h-8 w-16 border border-stroke" aria-hidden />
  )

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="scramble-host text-desktop-mono-small text-primary border border-stroke px-3 py-1.5 hover:bg-grey-600 transition-colors cursor-pointer"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <ScrambleText>{isDark ? 'LIGHT' : 'DARK'}</ScrambleText>
    </button>
  )
}
