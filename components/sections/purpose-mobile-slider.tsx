"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import type { CardData } from "./purpose";

// px on the 500 design canvas → cqw (1cqw = 1% of the section width = 5px @500).
// Using cqw keeps the slider scaling with the viewport (like the other mobile
// stages) while remaining a REAL scroll container (native horizontal swipe).
const c = (px: number) => `${px / 5}cqw`;

const CARD_W = 414;
const CARD_H = 393;

function MobileCard({
  label,
  number,
  description,
  mobileDescription,
  image,
  imageLight,
}: CardData) {
  return (
    <div
      className="relative shrink-0 snap-start overflow-hidden"
      style={{ width: c(CARD_W), height: c(CARD_H) }}
    >
      {/* Card surface — inverted-primary fill, cut-corner (top-left + bottom-right) */}
      <div
        className="absolute inset-0 bg-inverted-primary"
        style={{
          clipPath:
            "polygon(12.45% 0%, 100% 0%, 100% 92.5%, 93.23% 99.79%, 0% 99.79%, 0% 12.5%, 12.45% 0%)",
        }}
      />
      {/* Cut-corner border — feature-card-bg-embed, grey-200 (#A0A1A6) */}
      <svg
        className="absolute inset-0 h-full w-full text-grey-200"
        viewBox="0 0 253 240"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M31.5195 0.5H248.98C250.913 0.500227 252.48 2.06666 252.48 3.99902L252.5 221.989L252.495 222.174C252.447 223.094 252.036 223.961 251.35 224.583L235.885 238.594C235.241 239.177 234.403 239.5 233.535 239.5H4C2.067 239.5 0.5 237.933 0.5 236V76.5H0.521484V76L0.500977 30.2119C0.50056 29.2536 0.893116 28.3367 1.58691 27.6758L29.1055 1.46582C29.7156 0.88476 30.5137 0.544148 31.3516 0.503906L31.5195 0.5Z"
          stroke="currentColor"
        />
      </svg>
      {/* Corner diamond tick — top-left */}
      <svg
        className="absolute text-primary"
        style={{ top: c(13), left: c(14), width: c(8), height: c(8) }}
        viewBox="0 0 10 10"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8.79395 9.29395H0.501052C0.0555997 9.29395 -0.167485 8.75538 0.147498 8.44039L8.44039 0.147499C8.75537 -0.167484 9.29395 0.0555996 9.29395 0.501052V8.79395C9.29395 9.07009 9.07009 9.29395 8.79395 9.29395Z"
          fill="currentColor"
        />
      </svg>
      {/* Feature icon — 88×83 top-right (right-gap 32, top 32) */}
      <div
        className="absolute"
        style={{ top: c(32), left: c(CARD_W - 32 - 88), width: c(88), height: c(83) }}
      >
        <Image
          src={image}
          alt={label}
          width={88}
          height={83}
          className={`h-full w-full object-contain ${imageLight ? "purpose-img-dark" : ""}`}
          unoptimized
        />
        {imageLight && (
          <Image
            src={imageLight}
            alt={label}
            width={88}
            height={83}
            className="purpose-img-light absolute inset-0 h-full w-full object-contain"
            unoptimized
          />
        )}
      </div>
      {/* Label — mono 13px, grey-200, at (46,32) */}
      <p
        className="absolute text-grey-200 uppercase"
        style={{
          left: c(46),
          top: c(32),
          fontFamily: "var(--font-mono)",
          fontWeight: 400,
          fontSize: c(13),
          lineHeight: c(13),
          letterSpacing: c(0.13),
        }}
      >
        {label}
      </p>
      {/* Number — mono-small grey-200, at (20,322) */}
      <p
        className="absolute text-grey-200 uppercase"
        style={{
          left: c(20),
          top: c(322),
          fontFamily: "var(--font-mono)",
          fontWeight: 400,
          fontSize: c(12),
          lineHeight: c(12),
        }}
      >
        {number}
      </p>
      {/* Description — 14px / 19.6 lh, primary, at (46,322) width 363 */}
      <p
        className="absolute text-primary"
        style={{
          left: c(46),
          top: c(322),
          width: c(363),
          fontFamily: "var(--font-body)",
          fontWeight: 400,
          fontSize: c(14),
          lineHeight: c(19.6),
        }}
      >
        {mobileDescription ?? description}
      </p>
    </div>
  );
}

export function PurposeMobileSlider({ cards }: { cards: CardData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // each card advance = card width + gap; snap-start means scrollLeft ≈ i*step
    const step = el.scrollWidth / cards.length;
    setActive(Math.max(0, Math.min(cards.length - 1, Math.round(el.scrollLeft / step))));
  }, [cards.length]);

  return (
    <>
      {/* Slider — real horizontal scroll container (native swipe), starts at y181 */}
      <div
        ref={ref}
        onScroll={onScroll}
        className="absolute left-0 flex overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        style={{
          top: c(181),
          width: "100%",
          gap: c(16),
          paddingLeft: c(22),
          paddingRight: c(22),
          scrollPaddingLeft: c(22),
        }}
      >
        {cards.map((card) => (
          <MobileCard key={card.label} {...card} />
        ))}
      </div>

      {/* Dot pagination — live `purpose-pagination`: 6 circles (10px), 18px apart,
          at (22, 597). Active = filled primary; inactive = grey-300 outline. */}
      <div
        className="absolute flex items-center"
        style={{ top: c(597), left: c(22), height: c(10), gap: c(8) }}
        aria-hidden="true"
      >
        {cards.map((_, i) => (
          <span
            key={i}
            className="rounded-full transition-colors"
            style={{
              width: c(10),
              height: c(10),
              backgroundColor:
                i === active ? "var(--color-primary)" : "transparent",
              border:
                i === active ? "none" : "1px solid var(--color-grey-300)",
            }}
          />
        ))}
      </div>
    </>
  );
}
