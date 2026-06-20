import type { Metadata } from "next";
import { Nav } from "@/components/sections/nav";
import { HeroOMS } from "@/components/sections/hero-oms";
import { Spacer } from "@/components/ui/spacer";
import { OmsProducts } from "@/components/sections/oms-products";
import { StatsBand } from "@/components/sections/stats-band";
import { FaqSection } from "@/components/sections/faq";
import { UseCasesCta } from "@/components/sections/use-cases";
import { Footer } from "@/components/sections/footer";
import { NoiseOverlay } from "@/components/ui/noise-overlay";

export const metadata: Metadata = {
  title: "Build on Polygon’s Open Money Stack | Polygon Technology",
  description:
    "Build compliant, borderless payments on Polygon’s Open Money Stack with unified wallets, deep stablecoin liquidity, and always-on settlement for real-world money movement.",
  // OG image confirmed/downloaded during extraction (Task 6 wrap or here):
  openGraph: {
    images: [
      { url: "/assets/oms-page/og-image.jpg", width: 1200, height: 630 },
    ],
  },
};

export default function OpenMoneyStackPage() {
  return (
    <div className="min-h-screen bg-background">
      <NoiseOverlay />
      <Nav />
      {/* Left + right vertical rails frame the whole capped column, matching
          live's `.u-container-capped` border-left + section border-right
          (1px #1B1B1D dark / #E1E1E5 light). Placed on <main> so they run
          continuously through every section (no floating per-section segments). */}
      <main className="max-w-[1440px] mx-auto overflow-hidden border-x border-stroke">
        <HeroOMS />
        <Spacer />
        <Spacer />
        <OmsProducts />
        <Spacer />
        <StatsBand />
        <Spacer />
        <FaqSection />
        <UseCasesCta
          renderGetStarted
          getStarted={{
            heading: "Ready to launch crypto payments?",
            // 3-line heading → card sits lower than the homepage default (736) so
            // it clears "payments?"; top 823 lands the button at live's y879.
            buttons: [{ label: "CONTACT US", href: "#contact", left: 510, top: 823 }],
          }}
        />
        <Footer />
      </main>
    </div>
  );
}
