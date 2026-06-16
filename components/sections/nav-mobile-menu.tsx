"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, ArrowIcon } from "./nav-shared";

/**
 * Mobile nav (≤991px) — matches live polygon.technology Webflow nav.
 *
 * Live behavior (extracted from sot/source.html + live.css):
 *  - Bar (closed): logo (left) · purple "Book a Call" CTA (`hide-desktop-only`,
 *    shows on mobile) · hamburger button (`.menu-button`/`.menu-button-wrap`).
 *    The desktop links, STAKE POL, and the desktop "Book a Call" (`hide-tablet`)
 *    are hidden ≤991px.
 *  - Hamburger: `.menu-button` width 48px; `.menu-button-wrap` bg grey-600
 *    (#141415), clip-path navMenuMobile (bottom-right cut), column flex, gap 6px,
 *    px 10px, full height; two `.nav-menu-line` bars (bg primary/white,
 *    width 100%, height 2px). Open → bars cross into an X.
 *  - Menu panel (`.nav-menu` open): position absolute, full width, bg
 *    --color--interverted-primary (#07060d), padding 56px 20px, links stacked.
 *  - Link (`.nav-link` mobile): border-top 1px grey-400 (#353535), padding 1rem 0,
 *    font 1.5rem (24px) uppercase mono, gap 8px, trailing 8px caret.
 *  - Overlay sits at top:100% (below the bar), full width.
 */

// Solid right-pointing caret — exact path from live `.nav-tablets-svg`.
function CaretIcon() {
  return (
    <svg
      width="5"
      height="8"
      viewBox="0 0 5 8"
      fill="none"
      className="shrink-0 text-grey-200"
      aria-hidden={true}
    >
      <path
        d="M4.1147 3.2273C4.32362 3.42461 4.32362 3.757 4.1147 3.95431L0.842903 7.04435C0.524036 7.3455 -0.000408692 7.11944 -0.000408692 6.68084L-0.000408639 0.500776C-0.000408639 0.0621771 0.524036 -0.163883 0.842903 0.137269L4.1147 3.2273Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function NavMobileMenu() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the overlay is open (live does this via Webflow).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Dismiss on Escape while open (matches live behavior).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    // Right-side cluster of the mobile bar: purple CTA + hamburger.
    // Visibility (≤991px) is controlled by the parent wrapper in nav.tsx.
    <div className="flex h-full items-stretch gap-0">
      {/* BOOK A CALL — purple, angled cut + arrow (live `hide-desktop-only`) */}
      <a
        href="https://info.polygon.technology/get-early-access?utm_source=Website&utm_medium=Polygon_website_cta&utm_campaign=homepage_AB&utm_content=Contact_B"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-[10px] bg-purple px-[16px] text-desktop-mono-medium text-white transition-colors hover:bg-purple-hover"
        style={{ clipPath: "url(#navClipLeft)" }}
      >
        BOOK A CALL
        <ArrowIcon color="white" />
      </a>

      {/* Hamburger button — .menu-button (48px) + .menu-button-wrap */}
      <button
        type="button"
        aria-label="menu"
        aria-expanded={open}
        aria-controls="mobile-nav-overlay"
        onClick={() => setOpen((v) => !v)}
        className="flex h-full w-[48px] items-center justify-center p-0"
      >
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-[6px] bg-grey-600 px-[10px]"
          style={{ clipPath: "url(#navMenuMobile)" }}
        >
          <span
            className="h-[2px] w-full bg-primary transition-transform duration-300 ease-in-out"
            style={
              open
                ? { transform: "translateY(4px) rotate(45deg)" }
                : undefined
            }
          />
          <span
            className="h-[2px] w-full bg-primary transition-transform duration-300 ease-in-out"
            style={
              open
                ? { transform: "translateY(-4px) rotate(-45deg)" }
                : undefined
            }
          />
        </div>
      </button>

      {/* Overlay menu panel — sits below the bar (top:NAV_H), full screen,
          slides DOWN from the top and fills the viewport with solid black. */}
      <div
        id="mobile-nav-overlay"
        className="fixed inset-x-0 bottom-0 overflow-hidden"
        style={{
          // Mobile bar is 47px tall (live), not NAV_H (55, desktop) — start the
          // overlay flush with the bar's bottom so there's no hero-showing gap.
          top: 47,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <nav
          className="absolute inset-0 bg-inverted-primary px-[20px] py-[56px] transition-transform duration-300 ease-in-out"
          style={{
            transform: open ? "translateY(0)" : "translateY(-100%)",
          }}
          aria-hidden={!open}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href="#"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-[8px] border-t border-grey-400 py-[16px] text-mobile-nav-link text-primary"
            >
              <span className="flex items-center gap-[8px]">{link.label}</span>
              <CaretIcon />
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
