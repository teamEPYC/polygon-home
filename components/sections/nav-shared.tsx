/**
 * Shared nav data + components used by both the desktop nav (`nav.tsx`) and the
 * mobile menu (`nav-mobile-menu.tsx`). Single source of truth — keep the link
 * list, bar height, and the arrow icon here so the two never drift.
 */

export const NAV_LINKS = [
  { label: "Products", hasNew: true },
  { label: "Use Cases" },
  { label: "Company" },
  { label: "Use Polygon" },
  { label: "Developers Docs" },
];

export const NAV_H = 55;

// Solid right-pointing triangle — exact path from the live site's `oms-button-icon`.
export function ArrowIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="shrink-0"
      aria-hidden={true}
    >
      <path
        d="M7.86511 5.38649C8.07403 5.5838 8.07403 5.9162 7.86511 6.11351L4.59331 9.20354C4.27444 9.50469 3.75 9.27863 3.75 8.84003L3.75 2.65997C3.75 2.22137 4.27444 1.99531 4.59331 2.29646L7.86511 5.38649Z"
        fill={color}
      />
    </svg>
  );
}
