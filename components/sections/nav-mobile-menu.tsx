"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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

const NAV_LINKS = [
  { label: "Products" },
  { label: "Use Cases" },
  { label: "Company" },
  { label: "Use Polygon" },
  { label: "Developers Docs" },
];

// Solid right-pointing caret — exact path from live `.nav-tablets-svg`.
function CaretIcon() {
  return (
    <svg
      width="5"
      height="8"
      viewBox="0 0 5 8"
      fill="none"
      className="shrink-0 text-grey-200"
      aria-hidden
    >
      <path
        d="M4.1147 3.2273C4.32362 3.42461 4.32362 3.757 4.1147 3.95431L0.842903 7.04435C0.524036 7.3455 -0.000408692 7.11944 -0.000408692 6.68084L-0.000408639 0.500776C-0.000408639 0.0621771 0.524036 -0.163883 0.842903 0.137269L4.1147 3.2273Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Solid right-pointing triangle — exact path from live `oms-button-icon`.
function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path
        d="M7.86511 5.38649C8.07403 5.5838 8.07403 5.9162 7.86511 6.11351L4.59331 9.20354C4.27444 9.50469 3.75 9.27863 3.75 8.84003L3.75 2.65997C3.75 2.22137 4.27444 1.99531 4.59331 2.29646L7.86511 5.38649Z"
        fill="white"
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

  return (
    // Right-side cluster of the mobile bar: purple CTA + hamburger.
    // Visibility (≤991px) is controlled by the parent wrapper in nav.tsx.
    <div className="flex h-full items-stretch gap-0">
      {/* BOOK A CALL — purple, angled cut + arrow (live `hide-desktop-only`) */}
      <a
        href="https://info.polygon.technology/get-early-access"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-[10px] bg-purple px-[16px] text-desktop-mono-medium text-white transition-colors hover:bg-purple-hover"
        style={{ clipPath: "url(#navClipLeft)" }}
      >
        BOOK A CALL
        <ArrowIcon />
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

      {/* Overlay menu panel — sits below the bar (top:100%), full width */}
      <div
        id="mobile-nav-overlay"
        className="fixed inset-x-0 top-[55px] bottom-0 overflow-hidden"
        style={{
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <nav
          className="absolute inset-x-0 top-0 bg-inverted-primary px-[20px] py-[56px] transition-transform duration-300 ease-in-out"
          style={{
            transform: open ? "translateX(0)" : "translateX(100%)",
          }}
          aria-hidden={!open}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href="#"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-[8px] border-t border-grey-400 py-[16px] text-mobile-h4 uppercase text-primary"
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
