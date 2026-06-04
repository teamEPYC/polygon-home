import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const polySansSlimWide = localFont({
  src: '../public/fonts/PolySansTrial-SlimWide.otf',
  variable: '--font-heading',
  weight: '300',
  display: 'swap',
})

const polySansNeutral = localFont({
  src: '../public/fonts/PolySansTrial-Neutral.otf',
  variable: '--font-body',
  weight: '400',
  display: 'swap',
})

const polySansMono = localFont({
  src: '../public/fonts/PolySansTrial-NeutralMono.otf',
  variable: '--font-mono',
  weight: '400',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Polygon',
  description: 'Polygon Technology',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${polySansSlimWide.variable} ${polySansNeutral.variable} ${polySansMono.variable}`}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
