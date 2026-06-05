import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { BtnOutline } from '@/components/ui/btn-outline'
import { OMSStaircase } from './oms-staircase'

const CUT = 14
const clipPath = `polygon(0 0, calc(100% - ${CUT}px) 0, 100% ${CUT}px, 100% 100%, 0 100%)`

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path d="M3 9L9 3M9 3H4M9 3V8" stroke="var(--color-primary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type PoweredByProps = {
  logos: string[]
  opacity?: number
}

function PoweredBy({ logos, opacity = 1 }: PoweredByProps) {
  return (
    <div className="flex items-center gap-[12px]" style={{ opacity }}>
      <span className="text-desktop-mono-small text-[var(--grey-200)] uppercase">Powered by</span>
      <div className="flex items-center gap-[8px]">
        {logos.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt=""
            width={120}
            height={22}
            className="object-contain h-[22px] w-auto"
            unoptimized
          />
        ))}
      </div>
    </div>
  )
}

type ProductSectionProps = {
  badge: string
  badgeVariant?: 'primary' | 'blue'
  titleDim?: string
  title: string
  subtitle: string
  description: string
  wireIcon: string
  productImg: string
  containerBg: string
  dotColor?: string
  poweredBy?: string[]
  isFirst?: boolean
}

function ProductSection({
  badge,
  badgeVariant = 'blue',
  titleDim,
  title,
  subtitle,
  description,
  wireIcon,
  productImg,
  containerBg,
  dotColor,
  poweredBy,
  isFirst = false,
}: ProductSectionProps) {
  const borderColor = isFirst ? 'border-[var(--primary)]' : 'border-[var(--semi-transparent-blue)]'

  return (
    <div className={`flex items-start justify-between border-t ${borderColor} rounded-[2px] py-[28px]`}>
      {/* Left: Title area */}
      <div className="flex flex-col gap-[8px] shrink-0 max-w-[420px]">
        <div className="flex flex-col gap-[8px]">
          <Badge text={badge} variant={badgeVariant} />
          <div className="flex items-baseline gap-[8px] mt-[8px]">
            {titleDim && (
              <span className="font-heading font-[300] text-[32px] leading-[1.125] text-[rgba(255,255,255,0.7)] whitespace-nowrap">
                {titleDim}
              </span>
            )}
            <span
              className={`font-heading font-[300] text-[32px] leading-[1.125] whitespace-nowrap ${isFirst ? 'text-grey-100' : 'text-[rgba(255,255,255,0.7)]'}`}
            >
              {title}
            </span>
          </div>
        </div>
        <p
          className="text-desktop-mono-medium text-[rgba(255,255,255,0.7)] uppercase"
          style={{ fontFeatureSettings: '"dlig" 1' }}
        >
          {subtitle}
        </p>
      </div>

      {/* Right: Icon + content */}
      <div className="flex flex-col gap-[28px] shrink-0">
        {/* Icon row */}
        <div className="flex items-center gap-[4px]">
          {/* Wire icon */}
          <div className="relative w-[153px] h-[100px]">
            {dotColor && (
              <span
                className="absolute top-[12px] left-[12px] z-10 inline-block w-[8px] h-[8px] rounded-full"
                style={{ backgroundColor: dotColor }}
              />
            )}
            <Image
              src={wireIcon}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          {/* Product image container */}
          <div className="relative w-[156px] h-[100px]">
            <Image
              src={containerBg}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
            <Image
              src={productImg}
              alt=""
              fill
              className="object-contain rotate-180"
              unoptimized
            />
          </div>
          {/* CTA */}
          <div className="flex flex-col items-end gap-[12px] ml-[8px]">
            <BtnOutline variant={isFirst ? 'white' : 'default'} />
            <span
              className="text-desktop-mono-small text-right whitespace-nowrap uppercase"
              style={{
                color: isFirst ? 'var(--color-primary)' : 'rgba(255,255,255,0.6)',
                fontFeatureSettings: '"dlig" 1',
              }}
            >
              GET EARLY ACCESS
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-desktop-body w-[296px] leading-[1.375]"
          style={{ color: isFirst ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.6)' }}
        >
          {description}
        </p>

        {/* Powered by */}
        {poweredBy && <PoweredBy logos={poweredBy} opacity={isFirst ? 1 : 0.7} />}
      </div>
    </div>
  )
}

type SecondaryCardProps = {
  title: string
  subtitle: string
  description: string
  icon: string
}

function SecondaryCard({ title, subtitle, description, icon }: SecondaryCardProps) {
  return (
    <div className="relative flex items-start gap-0 border-t border-[var(--semi-transparent-blue)] rounded-[2px] w-[646px] h-[164px]">
      {/* Icon area */}
      <div className="relative w-[180px] h-[120px] mt-[44px] shrink-0">
        <Image src="/assets/product-card-container.svg" alt="" fill className="object-cover" unoptimized />
        <Image src={icon} alt="" fill className="object-contain" unoptimized />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between h-[120px] mt-[43px] pl-[24px]">
        <div className="flex flex-col gap-[12px]">
          <Badge text="coming soon" variant="blue" />
          <div className="flex items-baseline gap-[8px] mt-[8px]">
            <span className="font-heading font-[300] text-[28px] leading-[1.14] text-[rgba(255,255,255,0.7)] whitespace-nowrap">
              Polygon
            </span>
            <span className="font-heading font-[300] text-[28px] leading-[1.14] text-grey-100 whitespace-nowrap">
              {title}
            </span>
          </div>
          <p
            className="text-desktop-mono-medium text-[rgba(255,255,255,0.7)] uppercase"
            style={{ fontFeatureSettings: '"dlig" 1' }}
          >
            {description}
          </p>
        </div>
        <BtnOutline />
      </div>
    </div>
  )
}


export function OpenMoneyStack() {
  return (
    <section className="relative w-full overflow-hidden bg-[#3449c1]" style={{ height: 2521 }}>
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <Image src="/assets/products-bg.svg" alt="" fill className="object-cover object-top" unoptimized />
      </div>

      {/* Faint global grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
        }}
      />

      {/* Inverted staircase — animates in on scroll */}
      <OMSStaircase />

      {/* Heading */}
      <p
        className="absolute left-1/2 -translate-x-1/2 font-heading font-[300] text-[56px] leading-[60px] tracking-[-0.56px] text-grey-100 text-center w-[652px]"
        style={{ top: 416 }}
      >
        One open stack for money movement.
      </p>

      {/* Body text */}
      <p
        className="absolute left-1/2 -translate-x-1/2 text-desktop-body-large text-white text-center w-[778px]"
        style={{ top: 580 }}
      >
        The Open Money Stack is a vertically integrated stack of services and technologies designed
        to move money reliably from offchain systems to onchain settlement, and back again
      </p>

      {/* START BUILDING button */}
      <a
        href="#"
        className="absolute inline-flex items-center gap-[8px] h-[52px] pl-[16px] pr-[32px] bg-inverted-primary text-primary hover:opacity-90 transition-opacity"
        style={{ top: 662, left: '50%', transform: 'translateX(-50%)', clipPath }}
      >
        <span className="text-desktop-mono-small">START BUILDING</span>
        <ArrowIcon />
      </a>

      {/* Product sections — absolute, centered 1320px wide, starts at y=790 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[1320px] flex flex-col gap-[48px]"
        style={{ top: 790 }}
      >
        <ProductSection
          badge="LIVE"
          badgeVariant="primary"
          title="Wallet Infrastructure"
          subtitle="A secure digital wallet that works everywhere"
          description="Provide seamless user and business experience with a single wallet for any application across an ecosystem."
          wireIcon="/assets/ico-wire-chains.png"
          productImg="/assets/product-img-wallet.svg"
          containerBg="/assets/product-icon-container-dark.svg"
          dotColor="#00FF08"
          poweredBy={['/assets/logo-sequence.png', '/assets/logo-trails.png']}
          isFirst
        />
        <ProductSection
          badge="LIVE"
          title="Crosschain Interop"
          subtitle="Move any crypto asset to any chain in 1-click"
          description="Enable your users to make transactions on any chain, with any token, using any wallet in just 1-click."
          wireIcon="/assets/ico-wire-trails.png"
          productImg="/assets/product-img-interop.svg"
          containerBg="/assets/product-icon-container-light.svg"
          dotColor="#00BBFF"
          poweredBy={['/assets/logo-sequence.png', '/assets/logo-trails.png']}
        />
        <ProductSection
          badge="LIVE"
          title="On/Off and Cash Ramps"
          subtitle="Physical cash and digital fiat on- and off-ramps"
          description="Compliant, friction-free ramps that bridge traditional finance to digital assets on blockchain rails."
          wireIcon="/assets/ico-wire-wallet.png"
          productImg="/assets/product-img-ramps.svg"
          containerBg="/assets/product-icon-container-light.svg"
          dotColor="#C590E5"
          poweredBy={['/assets/logo-coinme.png']}
        />
        <ProductSection
          badge="LIVE"
          title="Blockchain Rails"
          subtitle={"The fastest settlement layer to\nmove money globally"}
          description="Build on Polygon rails or any chain your use case demands, without tradeoffs. We'll focus on moving the money, so you can focus on growing it."
          wireIcon="/assets/ico-wire-bpn.png"
          productImg="/assets/product-img-ramps.svg"
          containerBg="/assets/product-icon-container-light.svg"
          dotColor="#FF7421"
        />
      </div>

      {/* 3D animation — absolute overlay floating over the product section center gap */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[484px] h-[710px] pointer-events-none z-10"
        style={{ top: 1145 }}
      >
        <Image src="/assets/products-center.png" alt="" fill className="object-contain" unoptimized />
      </div>

      {/* Secondary cards */}
      <div
        className="absolute flex items-center justify-between w-[1320px]"
        style={{ top: 2068, left: 60 }}
      >
        <SecondaryCard
          title="Business Kit"
          subtitle="Polygon Business Kit"
          description="Scale your business with crypto payments"
          icon="/assets/ico-kit.png"
        />
        <SecondaryCard
          title="Pay"
          subtitle="Polygon Pay"
          description="One app for crypto payments"
          icon="/assets/ico-pay.png"
        />
      </div>
    </section>
  )
}
