'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

function MoonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7 5.3 5.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

const MODES = [
  { key: 'dark', label: 'Dark theme', Icon: MoonIcon },
  { key: 'light', label: 'Light theme', Icon: SunIcon },
] as const

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const active = mounted ? theme ?? 'dark' : 'dark'

  return (
    <div
      className={`flex items-center justify-between rounded-[4px] border border-stroke p-[12px] w-[124px] ${className ?? ''}`}
    >
      {MODES.map(({ key, label, Icon }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => setTheme(key)}
            aria-label={label}
            aria-pressed={isActive}
            className={`flex h-[36px] w-[44px] items-center justify-center rounded-[32px] transition-colors cursor-pointer ${
              isActive
                ? 'bg-grey-500 text-primary'
                : 'text-grey-200 hover:text-grey-100'
            }`}
          >
            <Icon />
          </button>
        )
      })}
    </div>
  )
}
