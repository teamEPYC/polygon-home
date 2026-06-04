import Image from 'next/image'
import { Eyebrow } from '@/components/ui/eyebrow'

const STROKE = 'rgba(255,255,255,0.05)'
const CELL = 120

type StatCardProps = {
  value: string
  label: string
  bg: string
  transform: string
  size?: 'lg' | 'sm'
}

function StatCard({ value, label, bg, transform, size = 'lg' }: StatCardProps) {
  const w = size === 'lg' ? 222 : 190
  const h = size === 'lg' ? 206 : 177
  const pad = size === 'lg' ? 'p-[28px]' : 'p-[24px]'
  const valSize = size === 'lg' ? '40px' : '34px'
  const track = size === 'lg' ? '-0.4px' : '-0.34px'

  return (
    <div className="absolute" style={{ transform }}>
      <div className="relative overflow-hidden" style={{ width: w, height: h }}>
        {/* SVG card background — dark panel with cut corners */}
        <Image src={bg} alt="" fill className="object-fill" unoptimized />
        <div className={`absolute inset-0 flex flex-col justify-between ${pad}`}>
          <p
            className="font-heading font-[300] text-primary leading-[1.25]"
            style={{ fontSize: valSize, letterSpacing: track }}
          >
            {value}
          </p>
          <p
            className={`${size === 'lg' ? 'text-desktop-mono-large' : 'text-desktop-mono'} text-primary uppercase whitespace-pre-line`}
            style={{ fontFeatureSettings: '"dlig" 1' }}
          >
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}

/* Staircase row: a band of filled 120×120 grid cells */
function StaircaseRow({
  top,
  left,
  cols,
}: {
  top: number
  left: number
  cols: number
}) {
  const w = cols * CELL
  return (
    <div
      className="absolute bg-[#07060D]"
      style={{
        top,
        left,
        width: w,
        height: CELL,
        backgroundImage: `linear-gradient(${STROKE} 1px, transparent 1px), linear-gradient(90deg, ${STROKE} 1px, transparent 1px)`,
        backgroundSize: `${CELL}px ${CELL}px`,
        outline: `1px solid ${STROKE}`,
      }}
    />
  )
}

export function AtGlance() {
  return (
    <section className="relative w-full h-[932px] overflow-hidden bg-[#141b6b]">
      {/* Atmospheric radial gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/assets/at-glance-bg.svg"
          alt=""
          fill
          className="object-cover object-center"
          unoptimized
        />
      </div>

      {/* Staircase grid — dark cells forming a pyramid at the bottom */}
      {/* Row at y=480: 2 cols (600–840) */}
      <StaircaseRow top={480} left={600} cols={2} />
      {/* Row at y=600: 4 cols (480–960) */}
      <StaircaseRow top={600} left={480} cols={4} />
      {/* Row at y=720: 8 cols (240–1200) */}
      <StaircaseRow top={720} left={240} cols={8} />

      {/* Faint grid over the whole section */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${STROKE} 1px, transparent 1px), linear-gradient(90deg, ${STROKE} 1px, transparent 1px)`,
          backgroundSize: `${CELL}px ${CELL}px`,
        }}
      />

      {/* Heading — H2-indent, eyebrow badge inline to the left */}
      <p
        className="absolute left-[60px] top-[80px] w-[424px] font-heading font-[300] text-[56px] leading-[60px] tracking-[-0.56px] text-grey-100"
        style={{ textIndent: '120px' }}
      >
        Polygon at a Glance.
      </p>
      <div className="absolute left-[60px] top-[96px]">
        <Eyebrow text="INTRO" borderColor="grey-100" textColor="grey-100" />
      </div>

      {/* 3D center diamond */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[178px] h-[244px]"
        style={{ left: '50%', top: 'calc(50% - 94px)' }}
      >
        <Image src="/assets/diamond-3d.png" alt="" fill className="object-cover" unoptimized />
      </div>

      {/* Stat cards — fanned in a pinwheel around the diamond */}
      {/* Front cards (larger, front face) */}
      <StatCard
        value="$2.3T+"
        label={"Transfer\nVolume"}
        bg="/assets/stat-card-bg-3.svg"
        transform="translate(496px, 213px) rotate(16deg) skewX(16deg) scaleY(0.96)"
      />
      <StatCard
        value="$3.4B"
        label="Stablecoin supply"
        bg="/assets/stat-card-bg-4.svg"
        transform="translate(731px, 212px) rotate(-16deg) skewX(-16deg) scaleY(0.96)"
      />
      {/* Back cards (smaller, flipped away) */}
      <StatCard
        value="1500+"
        label={"Transactions\nPer Second"}
        bg="/assets/stat-card-bg-1.svg"
        transform="translate(522px, 143px) rotate(165deg) skewX(-15deg) scaleY(-0.97)"
        size="sm"
      />
      <StatCard
        value="6.3T"
        label="Total transactions"
        bg="/assets/stat-card-bg-2.svg"
        transform="translate(722px, 145px) rotate(-165deg) skewX(15deg) scaleY(-0.97)"
        size="sm"
      />

      {/* Gem — left */}
      <div className="absolute w-[125px] h-[168px]" style={{ left: 300, top: 492 }}>
        <Image src="/assets/gem-3d.svg" alt="" fill className="object-contain" unoptimized />
      </div>

      {/* Hexagon — right */}
      <div className="absolute w-[137px] h-[149px]" style={{ left: 1011, top: 508 }}>
        <Image src="/assets/hexagon-3d.svg" alt="" fill className="object-contain" unoptimized />
      </div>
    </section>
  )
}
