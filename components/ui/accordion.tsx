"use client";

import { useState } from "react";

export type AccordionItem = { question: string; answer: string };

/** Chevron glyph (live `oms-faq-icon`, 12×12). Rotates 180° when open. */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        d="M10.6422 3.68461C10.8394 3.88019 10.8394 4.19894 10.6422 4.39452L6.70429 8.30128C6.31442 8.68807 5.68558 8.68807 5.29571 8.30128L1.35779 4.39452C1.16065 4.19894 1.16065 3.88019 1.35779 3.68461L1.69571 3.34936C1.89065 3.15597 2.20507 3.15597 2.4 3.34936L5.64785 6.57151C5.84279 6.7649 6.15721 6.7649 6.35215 6.57151L9.6 3.34936C9.79493 3.15597 10.1094 3.15597 10.3043 3.34936L10.6422 3.68461Z"
        fill="currentColor"
      />
    </svg>
  );
}

type AccordionProps = {
  items: AccordionItem[];
  /** Only one row open at a time (live behaviour). Default true. */
  singleOpen?: boolean;
  defaultOpenIndex?: number;
  /** Tuned per stage. */
  variant?: "desktop" | "mobile";
};

/**
 * FAQ accordion matched to live /open-money-stack.
 *
 * Row top border: light `grey-200` (#686D73) / dark `primary` (#FFFFFF).
 * Desktop rows carry a plain `01/02/03` mono tag (no box) above the question;
 * mobile rows have no tag. Question is heading font at weight 400. The
 * cut-corner chevron button sits at the right and rotates 180° on open.
 * Single-open: opening a row closes any other. Open animates via grid-rows.
 */
export function Accordion({
  items,
  singleOpen = true,
  defaultOpenIndex,
  variant = "desktop",
}: AccordionProps) {
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(defaultOpenIndex != null ? [defaultOpenIndex] : []),
  );
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = singleOpen ? new Set<number>() : new Set(prev);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const isDesktop = variant === "desktop";
  // Cut-corner chevron button (bottom-right cut). ~64×51 desktop / 64×56 mobile.
  const chevClip =
    "polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)";

  return (
    <div className="flex w-full flex-col">
      {items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} className="border-t border-grey-200 dark:border-primary">
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${i}`}
              id={`accordion-button-${i}`}
              className={`flex w-full cursor-pointer items-start justify-between text-left ${
                isDesktop
                  ? "gap-[28px] pt-[12px] pb-[35px]"
                  : "gap-[16px] pt-[17px] pb-[38px]"
              }`}
            >
              <div className="flex flex-1 flex-col">
                {isDesktop && (
                  <span className="mb-[33px] pl-[13px] text-desktop-mono-medium text-grey-200">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
                <span
                  className={`text-primary ${isDesktop ? "text-desktop-h5" : "text-mobile-h5"}`}
                  style={{ fontWeight: 400 }}
                >
                  {it.question}
                </span>
              </div>
              <span
                className={`flex shrink-0 items-center justify-center border border-grey-200 text-primary dark:border-primary ${
                  isDesktop ? "h-[51px] w-[64px]" : "h-[56px] w-[64px]"
                }`}
                style={{ clipPath: chevClip }}
              >
                <Chevron open={isOpen} />
              </span>
            </button>
            <div
              id={`accordion-panel-${i}`}
              role="region"
              aria-labelledby={`accordion-button-${i}`}
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p
                  className={`text-grey-200 ${
                    isDesktop
                      ? "max-w-[1165px] pb-[40px] text-desktop-body-large"
                      : "pb-[40px] text-mobile-body-large"
                  }`}
                >
                  {it.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
