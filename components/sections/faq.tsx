import { Eyebrow } from "@/components/ui/eyebrow";
import { DynamicStage } from "@/components/ui/dynamic-stage";
import { Accordion, type AccordionItem } from "@/components/ui/accordion";

/** Exact copy extracted from live /open-money-stack FAQ. */
const FAQ_ITEMS: AccordionItem[] = [
  {
    question:
      "How does the Open Money Stack modernize payment rails for institutions and fintechs?",
    answer:
      "Legacy payment infrastructure wasn't built for today: slow settlement windows, opaque fees, and fragmented rails are baked into the last century. The Open Money Stack replaces that foundation with always-on, programmable settlement that works in seconds rather than days. For institutions, that means dropping into existing compliance and banking workflows without rebuilding from scratch. For fintechs, it means taking onchain settlement into production with the reliability and interoperability that real-world payment flows demand.",
  },
  {
    question: "Is this production-ready for real payments?",
    answer:
      "Yes. The Open Money Stack is built on Polygon’s battle-tested blockchain infrastructure, which already processes billions in stablecoin transfers for fintechs, enterprises, and institutions. Many components of the OMS are already live, designed for high-volume payments, predictable finality, and enterprise-grade reliability. More components, like a single API for easy integration, are forthcoming.",
  },
  {
    question:
      "What will it look like to run an entire payments stack on the Open Money Stack?",
    answer:
      "The Open Money Stack is being built to slot into existing infrastructure, not replace it. Whether you're running a neobank, a fintech, or a crypto-native platform, you can bring your existing system and build on top of the Open Money Stack. Choose what you need (Polygon Chain, wallets, on/off-ramp), leave what you don’t, and integrate with ease. Early access is available now.",
  },
];

const CONTACT_HREF =
  "https://info.polygon.technology/get-early-access?utm_source=Website&utm_medium=Polygon_website_cta&utm_campaign=Polygon_homepage&utm_content=Contact";

const SUPPORT_COPY =
  "If you don't see your question answered here, reach out to our support team, we're always happy to help.";

/**
 * Cut-corner "contact us" button — live `.btn-new.is-black`: a grey OUTLINE (no
 * fill) in the shared #buttonClip shape (rounded left, beveled bottom-right, right
 * tab), label + triangle arrow. The outline is drawn as a grey-300 layer behind a
 * 1px-inset background-colored fill, both clipped to #buttonClip — so the bevel
 * keeps its stroke (a plain CSS border would be clipped away). Theme-safe via tokens.
 */
function ContactButton({ className }: { className?: string }) {
  return (
    <a
      href={CONTACT_HREF}
      className={`group relative inline-flex items-center justify-between text-primary ${className ?? ""}`}
    >
      {/* Border layer (grey-300) */}
      <span
        aria-hidden
        className="absolute inset-0 bg-grey-300 transition-colors group-hover:bg-grey-200"
        style={{ clipPath: "url(#buttonClip)" }}
      />
      {/* Fill layer — section bg, inset 1px to reveal the border ring */}
      <span
        aria-hidden
        className="absolute inset-px bg-background"
        style={{ clipPath: "url(#buttonClip)" }}
      />
      <span className="relative text-desktop-mono-medium uppercase">contact us</span>
      <svg
        width="8"
        height="10"
        viewBox="0 0 8 10"
        fill="none"
        className="relative ml-[12px] shrink-0"
        aria-hidden
      >
        <path d="M8 5L0 9.33013V0.669873L8 5Z" fill="currentColor" />
      </svg>
    </a>
  );
}

export function FaqSection() {
  return (
    <section
      className="relative w-full bg-background"
      style={{ containerType: "inline-size" }}
    >
      {/* ── Desktop ─────────────────────────────────────────────── */}
      <DynamicStage className="hidden md:block" width={1440} initialHeight={642}>
        <div className="ml-[59px] pt-[8px] w-[1324px]">
          {/* Header zone */}
          <div className="relative">
            <Eyebrow
              text="FAQ"
              borderColor="grey-200"
              textColor="grey-100"
              className="absolute left-0 top-[7px] z-10"
            />
            <h2 className="w-[640px] text-desktop-h2-indent text-primary">
              Frequently asked questions.
            </h2>
            {/* Right column — support copy + CONTACT US, fixed at live x≈633 */}
            <div className="absolute left-[633px] top-[33px] w-[400px]">
              <p className="text-desktop-body text-primary">{SUPPORT_COPY}</p>
              <ContactButton className="mt-[12px] h-[53px] w-[183px] pl-[12px] pr-[30px]" />
            </div>
          </div>

          {/* Accordion */}
          <div className="mt-[78px]">
            <Accordion items={FAQ_ITEMS} variant="desktop" />
          </div>
        </div>
      </DynamicStage>

      {/* ── Mobile ──────────────────────────────────────────────── */}
      <DynamicStage className="md:hidden" width={500} initialHeight={760}>
        <div className="ml-[21px] pt-[6px] w-[459px]">
          <div className="relative w-[300px]">
            <Eyebrow
              text="FAQ"
              borderColor="grey-200"
              textColor="grey-100"
              textSize="text-mobile-mono-small"
              className="absolute left-0 top-[4px] z-10 h-[30px]"
            />
            <h2 className="text-mobile-h2-indent leading-[1.3] text-primary [text-indent:62px]">
              Frequently asked questions.
            </h2>
          </div>
          <p className="mt-[18px] w-[300px] text-mobile-body text-primary">
            {SUPPORT_COPY}
          </p>
          <ContactButton className="mt-[24px] h-[46px] w-[170px] pl-[12px] pr-[28px]" />

          <div className="mt-[92px]">
            <Accordion items={FAQ_ITEMS} variant="mobile" />
          </div>
        </div>
      </DynamicStage>
    </section>
  );
}
