import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { Spacer } from "@/components/ui/spacer";
import { AtGlance } from "@/components/sections/at-glance";
import { OpenMoneyStack } from "@/components/sections/open-money-stack";
import { PurposeSection } from "@/components/sections/purpose";
import { PolToken } from "@/components/sections/pol-token";
import { NewsSlider } from "@/components/sections/news-slider";
import { UseCasesCta } from "@/components/sections/use-cases";
import { Footer } from "@/components/sections/footer";
import { NoiseOverlay } from "@/components/ui/noise-overlay";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <NoiseOverlay />
      <Nav />
      <main className="max-w-[1440px] mx-auto overflow-hidden">
        <Hero />
        <Spacer />
        <AtGlance />
        <OpenMoneyStack />
        <Spacer />
        <PurposeSection />
        <PolToken />
        {/* <NewsSlider /> */}
        <UseCasesCta />
        {/* <Spacer /> */}
        <Footer />
      </main>
    </div>
  );
}
