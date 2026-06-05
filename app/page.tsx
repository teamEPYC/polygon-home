import { Nav } from '@/components/sections/nav'
import { Hero } from '@/components/sections/hero'
import { Spacer } from '@/components/ui/spacer'
import { AtGlance } from '@/components/sections/at-glance'
import { OpenMoneyStack } from '@/components/sections/open-money-stack'
import { NoiseOverlay } from '@/components/ui/noise-overlay'

export default function Home() {
  return (
    <div className="min-h-screen bg-background" data-theme="dark">
      <NoiseOverlay />
      <Nav />
      <main className="relative max-w-[1440px] mx-auto overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-px bg-stroke z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-px bg-stroke z-10 pointer-events-none" />
        <Hero />
        <Spacer />
        <AtGlance />
        <Spacer />
        <OpenMoneyStack />
      </main>
    </div>
  )
}
