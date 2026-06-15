import Image from "next/image";
import { NavMobileMenu } from "./nav-mobile-menu";

/**
 * Top navigation — values extracted verbatim from the live site (puppeteer
 * computed styles + bounding boxes). It's a 12-column grid (120px each at
 * 1440), exactly like the live `.nav-grid`:
 *   brand  cols 1–2   (x0–240)
 *   menu   cols 3–9   (x240–1080, solid 840px panel)
 *   stake  col 10     (x1080–1200)
 *   book   col 11→    (x1200–1367, content width)
 * Items are pinned to grid columns, so positions don't drift with font width.
 */

const NAV_LINKS = [
  { label: "Products", hasNew: true },
  { label: "Use Cases" },
  { label: "Company" },
  { label: "Use Polygon" },
  { label: "Developers Docs" },
];

const NAV_H = 55;

// Solid right-pointing triangle — exact path from the live site's `oms-button-icon`.
function ArrowIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M7.86511 5.38649C8.07403 5.5838 8.07403 5.9162 7.86511 6.11351L4.59331 9.20354C4.27444 9.50469 3.75 9.27863 3.75 8.84003L3.75 2.65997C3.75 2.22137 4.27444 1.99531 4.59331 2.29646L7.86511 5.38649Z"
        fill={color}
      />
    </svg>
  );
}

export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-[100]">
      {/* Theme-toggled brand assets (CSS dual-render — <img>/SVG fills can't
          read theme tokens, and the live wordmark + cut-corner panel flip:
          wordmark #F2F3F7→#07060D, panel #07060D→#FFFFFF, stroke #1B1B1D→#E1E1E5). */}
      <style>{`
        .nav-asset-light { display: none !important; }
        [data-theme="light"] .nav-asset-dark { display: none !important; }
        [data-theme="light"] .nav-asset-light { display: block !important; }
      `}</style>
      {/* Scale-to-fit stage (same model as hero/purpose/news/use-cases/footer):
          a fixed 1440-wide grid scaled by 100cqw/1440. The containerType box is
          capped at max-w-1440 + mx-auto, so 100cqw = min(viewport,1440) → scale ≤ 1
          (1:1 at ≥1440, centered). Because the nav scales by the SAME factor as the
          hero stage, the 120px grid columns line up with the hero grid at every
          width, and STAKE POL / BOOK A CALL scale down instead of overflowing. */}
      <div
        className="relative mx-auto w-full"
        style={{ maxWidth: 1440, containerType: "inline-size", height: NAV_H }}
      >
        {/* Mobile bar (≤991px): full-size logo + purple CTA + hamburger.
            Replaces the scaled 1440 desktop grid below, which is hidden ≤991px. */}
        <div className="absolute inset-0 flex items-stretch justify-between nav:hidden">
          <a
            href="/"
            aria-label="Polygon home"
            className="relative flex items-center pl-[16px]"
          >
            <Image
              src="/assets/polygon-logo.svg"
              alt="Polygon"
              width={110}
              height={26}
              priority
              unoptimized
              className="nav-asset-dark"
            />
            <Image
              src="/assets/polygon-logo-light.svg"
              alt="Polygon"
              width={110}
              height={26}
              priority
              unoptimized
              className="nav-asset-light"
            />
          </a>
          <NavMobileMenu />
        </div>

        <div
          className="absolute left-0 top-0 grid origin-top-left max-nav:hidden"
          style={{
            width: 1440,
            height: NAV_H,
            transform: "scale(calc(100cqw / 1440px))",
            gridTemplateColumns: "repeat(12, 120px)",
          }}
        >
        {/* Brand — cols 1–2 (cut-corner bordered panel + logo) */}
        <a
          href="/"
          aria-label="Polygon home"
          className="relative block"
          style={{ gridColumn: "1 / 3" }}
        >
          {/* left-50 + w-190 → panel spans x50→240 so its right edge lands on the
              col-2 grid line, continuous with the hero grid below. (w-full / no
              width let the SVG keep its ~240px intrinsic width → overshot to x290.) */}
          <img
            src="/assets/hero/nav-logo-area.svg"
            alt=""
            className="nav-asset-dark absolute top-0 left-[50px] h-full w-[190px]"
          />
          <img
            src="/assets/hero/nav-logo-area-light.svg"
            alt=""
            className="nav-asset-light absolute top-0 left-[50px] h-full w-[190px]"
          />
          <Image
            src="/assets/polygon-logo.svg"
            alt="Polygon"
            width={110}
            height={26}
            priority
            unoptimized
            className="nav-asset-dark absolute left-[90px] top-1/2 -translate-y-1/2"
          />
          <Image
            src="/assets/polygon-logo-light.svg"
            alt="Polygon"
            width={110}
            height={26}
            priority
            unoptimized
            className="nav-asset-light absolute left-[90px] top-1/2 -translate-y-1/2"
          />
        </a>

        {/* Menu — cols 3–9: solid 840px panel, links left-aligned */}
        <div
          className="flex items-center border-b border-stroke bg-inverted-primary"
          style={{ gridColumn: "3 / 10" }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href="#"
              className="flex h-full items-center px-[16px] text-desktop-mono-medium text-primary transition-colors hover:opacity-80 whitespace-nowrap"
            >
              {/* nav-link-item: 4px padding, relative anchor for the absolute icon */}
              <span className="relative flex items-center p-[4px]">
                {link.label}
                {link.hasNew && (
                  /* p-icon: absolute so it never shifts the next link (matches live) */
                  <Image
                    src="/assets/ico-new.svg"
                    alt=""
                    width={16}
                    height={16}
                    unoptimized
                    className="absolute right-0 top-1/2"
                    style={{
                      transform: "translate(100%, -43%)",
                      marginTop: -2,
                    }}
                  />
                )}
              </span>
            </a>
          ))}
        </div>

        {/* STAKE POL — col 10, grey, angled cut */}
        <a
          href="https://staking.polygon.technology/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center py-[2px] bg-grey-500 px-[16px] text-desktop-mono-medium text-grey-100 transition-colors hover:bg-grey-500-hover"
          style={{
            gridColumn: "10 / 11",
            clipPath: "url(#navClipLeft)",
            height: NAV_H + 4,
            alignSelf: "center",
          }}
        >
          STAKE POL
        </a>

        {/* BOOK A CALL — starts col 11, content width, purple, angled cut + arrow */}
        <a
          href="#"
          className="flex items-center  gap-[28px] bg-purple px-[16px] text-desktop-mono-medium text-white transition-colors hover:bg-purple-hover"
          style={{
            gridColumn: "11 / 13",
            justifySelf: "start",
            clipPath: "url(#navClipLeft)",
            height: NAV_H + 4,
            alignSelf: "center",
          }}
        >
          BOOK A CALL
          <ArrowIcon color="white" />
        </a>
        </div>
      </div>
    </nav>
  );
}
