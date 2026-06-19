import type { Metadata } from "next";
import { Nav } from "@/components/sections/nav";
import { HeroOMS } from "@/components/sections/hero-oms";
import { Spacer } from "@/components/ui/spacer";
import { OpenMoneyStack } from "@/components/sections/open-money-stack";
import { UseCasesCta } from "@/components/sections/use-cases";
import { Footer } from "@/components/sections/footer";
import { NoiseOverlay } from "@/components/ui/noise-overlay";

export const metadata: Metadata = {
  title: "Build on Polygon's Open Money Stack",
  description:
    "Build compliant, borderless payments on Polygon's Open Money Stack with unified wallets, deep stablecoin liquidity, and always-on settlement.",
  // OG image confirmed/downloaded during extraction (Task 6 wrap or here):
  openGraph: { images: [{ url: "/assets/oms-page/og-image.jpg", width: 1200, height: 630 }] },
};

export default function OpenMoneyStackPage() {
  return (
    <div className="min-h-screen bg-background">
      <NoiseOverlay />
      <Nav />
      <main className="max-w-[1440px] mx-auto overflow-hidden">
        <HeroOMS />
        <Spacer />
        <OpenMoneyStack
          eyebrow="PRODUCTS"
          heading="Global rails for upgraded money"
          /* body / products confirmed against live during extraction */
        />
        {/* <StatsBand /> — Task 5 */}
        {/* <FaqSection /> — Task 6 */}
        <UseCasesCta
          renderGetStarted
          getStarted={{
            heading: "Ready to launch crypto payments?",
            buttons: [{ label: "CONTACT US", href: "#contact", left: 510 }],
          }}
        />
        <Footer />
      </main>
    </div>
  );
}
