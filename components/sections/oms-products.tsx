import { OmsVideoPlayer } from "@/components/ui/oms-video-player";
import { OMSStaircase } from "./oms-staircase";

const STAGE_H = 2595;
const HEADING = "Global rails for upgraded money";
const BODY =
  "One stack for wallets, compliance, on- and off-ramps, and settlement. Built to plug into existing systems and move money in seconds.";
const EYEBROW = "PRODUCTS";

export function OmsProducts() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#3449c1]"
      style={{ containerType: "inline-size" }}
    >
      <div
        className="relative hidden w-full overflow-hidden md:block"
        style={{ aspectRatio: `1440 / ${STAGE_H}` }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: 1440, height: STAGE_H, transform: "scale(calc(100cqw / 1440px))" }}
        >
          {/* Background — same radial + faint grid as the homepage section */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 50% 40%, #273ead, #2941b7 39%, #07092c 75%)" }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "120px 120px",
            }}
          />

          {/* Top platform + eyebrow (reused) */}
          <OMSStaircase eyebrow={EYEBROW} />

          {/* Heading — text-desktop-h2, centered, 2-line wrap */}
          <p
            className="absolute left-1/2 -translate-x-1/2 text-desktop-h2 text-white text-center w-[560px]"
            style={{ top: 460 }}
          >
            {HEADING}
          </p>

          {/* Body — 18px body-large, centered */}
          <p
            className="absolute left-1/2 -translate-x-1/2 text-desktop-body-large text-white text-center w-[660px]"
            style={{ top: 606 }}
          >
            {BODY}
          </p>

          {/* Central video column — reused asset, 390px wide, centered */}
          <div className="absolute left-1/2 -translate-x-1/2 w-[390px] z-10" style={{ top: 722 }}>
            <OmsVideoPlayer />
          </div>

          {/* Product cards + coming-soon + bottom grid added in later tasks */}
        </div>
      </div>
    </section>
  );
}
