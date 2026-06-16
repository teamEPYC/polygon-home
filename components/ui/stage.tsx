import type { CSSProperties, ReactNode } from "react";

type StageProps = {
  /** Design-canvas width in px (1440 desktop, 375 mobile). */
  width: number;
  /** Design-canvas height in px — the exact section content height. */
  height: number;
  className?: string;
  children: ReactNode;
};

/**
 * Fixed-canvas scale-to-fit stage. Renders children in a `width`×`height`
 * coordinate space, scaled to the section width via `scale(100cqw / width)`.
 * The parent <section> must set `containerType: 'inline-size'`.
 * Pixel-perfect at the design width; scales proportionally otherwise.
 */
function Stage({ width, height, className, children }: StageProps) {
  return (
    <div
      className={`relative w-full overflow-hidden ${className ?? ""}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width,
          height,
          transform: `scale(calc(100cqw / ${width}px))`,
        } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

/** Desktop 1440 stage. */
export function DesktopStage({
  height,
  className,
  children,
}: Omit<StageProps, "width">) {
  return (
    <Stage width={1440} height={height} className={className}>
      {children}
    </Stage>
  );
}

/**
 * Mobile stage. The mobile design canvas is 500px wide (the project's mobile
 * width guide). Sections migrated to the 500 canvas pass `width={500}`; the
 * default stays 375 for sections not yet migrated.
 */
export function MobileStage({
  width = 375,
  height,
  className,
  children,
}: Omit<StageProps, "width"> & { width?: number }) {
  return (
    <Stage width={width} height={height} className={className}>
      {children}
    </Stage>
  );
}
