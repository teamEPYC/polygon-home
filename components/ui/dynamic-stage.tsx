"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type DynamicStageProps = {
  /** Design-canvas width in px (1440 desktop, 500 mobile). */
  width: number;
  /** Collapsed-state canvas height — SSR/first-paint fallback before measuring. */
  initialHeight: number;
  className?: string;
  children: ReactNode;
};

/**
 * Like {@link Stage}, scales a fixed `width`-px canvas to the section width via
 * `scale(100cqw / width)`. UNLIKE Stage, the outer box height is NOT fixed — it
 * tracks the scaled content height with a ResizeObserver, so the section grows
 * when content does (e.g. an FAQ accordion opening) and pushes the next section
 * down instead of clipping/overlapping it.
 *
 * Requirement: the children must establish height in normal flow (the inner
 * canvas is in-flow, not absolutely positioned). Position interior pieces with
 * margins, not by making the top-level wrapper `absolute`.
 *
 * The parent <section> must set `containerType: 'inline-size'`.
 */
export function DynamicStage({
  width,
  initialHeight,
  className,
  children,
}: DynamicStageProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const update = () => {
      const ow = outer.clientWidth;
      // offsetHeight is the UN-transformed layout height of the in-flow canvas
      // (transforms are visual only). Scale it by the same factor the CSS
      // transform uses: containerWidth / width.
      const contentH = inner.offsetHeight;
      setHeight(contentH * (ow / width));
    };
    update();
    // Observe the inner (content height changes, e.g. accordion open) and the
    // outer (width changes → scale factor changes).
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div
      ref={outerRef}
      className={`relative w-full overflow-hidden ${className ?? ""}`}
      style={
        height == null
          ? { aspectRatio: `${width} / ${initialHeight}` }
          : { height }
      }
    >
      <div
        ref={innerRef}
        className="origin-top-left"
        style={
          {
            width,
            transform: `scale(calc(100cqw / ${width}px))`,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
