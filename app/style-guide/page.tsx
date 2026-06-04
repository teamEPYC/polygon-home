import { ThemeToggle } from '@/components/ui/theme-toggle'

export const metadata = {
  title: 'Style Guide — Polygon',
}

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-background text-primary">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-stroke bg-background px-[60px] py-4">
        <span className="text-desktop-mono text-primary">POLYGON / STYLE GUIDE</span>
        <ThemeToggle />
      </header>

      <main className="px-[60px] py-[64px] flex flex-col gap-[120px]">
        <TypographySection />
        <ColorsSection />
        <GridSection />
        <SpacingSection />
      </main>
    </div>
  )
}

function TypeRow({
  label,
  spec,
  children,
}: {
  label: string
  spec: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-stroke pb-8">
      <div className="flex items-start justify-between gap-8">
        <div className="shrink-0 w-[280px]">
          <p className="text-desktop-mono-small text-grey-200">{label}</p>
          <p className="text-desktop-mono-small text-grey-300 mt-1 whitespace-pre-line">{spec}</p>
        </div>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}

function TypographySection() {
  return (
    <section>
      <h2 className="text-desktop-h1 text-primary mb-[64px]">Typography</h2>

      <div className="mb-[48px]">
        <p className="text-desktop-mono text-grey-200 mb-[32px]">DESKTOP</p>
        <div className="flex flex-col gap-8">
          <TypeRow label="Desktop / H1" spec="96px · 300 · 90% · −2%">
            <p className="text-desktop-h1 text-primary">The Internet&apos;s Backbone</p>
          </TypeRow>
          <TypeRow label="Desktop / H2" spec="64px · 300 · 106% · −2%">
            <p className="text-desktop-h2 text-primary">The Internet&apos;s Backbone</p>
          </TypeRow>
          <TypeRow label="Desktop / H2 Indent" spec="64px · 300 · 110% · −2% · indent 120px">
            <p className="text-desktop-h2-indent text-primary">The Internet&apos;s Backbone</p>
          </TypeRow>
          <TypeRow label="Desktop / H3" spec="36px · 300 · 125% · −1%">
            <p className="text-desktop-h3 text-primary">The Internet&apos;s Backbone</p>
          </TypeRow>
          <TypeRow label="Desktop / H3 Indent" spec="36px · 300 · 125% · −1% · indent 130px">
            <p className="text-desktop-h3-indent text-primary">The Internet&apos;s Backbone</p>
          </TypeRow>
          <TypeRow label="Desktop / H4" spec="28px · 300 · 125% · −1%">
            <p className="text-desktop-h4 text-primary">The Internet&apos;s Backbone</p>
          </TypeRow>
          <TypeRow label="Desktop / H4 Indent" spec="28px · 300 · 125% · −1% · indent 70px">
            <p className="text-desktop-h4-indent text-primary">The Internet&apos;s Backbone</p>
          </TypeRow>
          <TypeRow label="Desktop / H5" spec="24px · 300 · 125% · −1%">
            <p className="text-desktop-h5 text-primary">The Internet&apos;s Backbone</p>
          </TypeRow>
          <TypeRow label="Desktop / Body Large" spec="18px · 400 · 140%">
            <p className="text-desktop-body-large text-primary">Polygon is a decentralised Ethereum scaling platform that enables developers to build scalable user-friendly dApps with low transaction fees.</p>
          </TypeRow>
          <TypeRow label="Desktop / Body" spec="16px · 400 · 140%">
            <p className="text-desktop-body text-primary">Polygon is a decentralised Ethereum scaling platform that enables developers to build scalable user-friendly dApps with low transaction fees.</p>
          </TypeRow>
          <TypeRow label="Desktop / Body Small" spec="13px · 400 · 120%">
            <p className="text-desktop-body-small text-primary">Polygon is a decentralised Ethereum scaling platform that enables developers to build scalable user-friendly dApps with low transaction fees.</p>
          </TypeRow>
          <TypeRow label="Desktop / Mono Large" spec="16px · 400 · 110% · +1% · uppercase">
            <p className="text-desktop-mono-large text-primary">Polygon Technology</p>
          </TypeRow>
          <TypeRow label="Desktop / Mono Medium" spec="14px · 400 · normal · +1% · uppercase">
            <p className="text-desktop-mono-medium text-primary">Polygon Technology</p>
          </TypeRow>
          <TypeRow label="Desktop / Mono" spec="13px · 400 · 120% · +1% · uppercase">
            <p className="text-desktop-mono text-primary">Polygon Technology</p>
          </TypeRow>
          <TypeRow label="Desktop / Mono Small" spec="12px · 400 · 110% · +1% · uppercase">
            <p className="text-desktop-mono-small text-primary">Polygon Technology</p>
          </TypeRow>
        </div>
      </div>

      <div>
        <p className="text-desktop-mono text-grey-200 mb-[32px]">MOBILE</p>
        <div className="flex flex-col gap-8">
          <TypeRow label="Mobile / H1" spec="56px · 300 · 90% · −2%">
            <p className="text-mobile-h1 text-primary">The Internet&apos;s Backbone</p>
          </TypeRow>
          <TypeRow label="Mobile / H2" spec="36px · 300 · 110% · −2%">
            <p className="text-mobile-h2 text-primary">The Internet&apos;s Backbone</p>
          </TypeRow>
          <TypeRow label="Mobile / H2 Indent" spec="36px · 300 · 110% · −2% · indent 100px">
            <p className="text-mobile-h2-indent text-primary">The Internet&apos;s Backbone</p>
          </TypeRow>
          <TypeRow label="Mobile / H3" spec="28px · 300 · 125% · −1%">
            <p className="text-mobile-h3 text-primary">The Internet&apos;s Backbone</p>
          </TypeRow>
          <TypeRow label="Mobile / H4" spec="24px · 300 · 125% · −1%">
            <p className="text-mobile-h4 text-primary">The Internet&apos;s Backbone</p>
          </TypeRow>
          <TypeRow label="Mobile / H5" spec="18px · 300 · 125% · −1%">
            <p className="text-mobile-h5 text-primary">The Internet&apos;s Backbone</p>
          </TypeRow>
          <TypeRow label="Mobile / Body Large" spec="16px · 400 · 140%">
            <p className="text-mobile-body-large text-primary">Polygon is a decentralised Ethereum scaling platform.</p>
          </TypeRow>
          <TypeRow label="Mobile / Body" spec="14px · 400 · 140%">
            <p className="text-mobile-body text-primary">Polygon is a decentralised Ethereum scaling platform.</p>
          </TypeRow>
          <TypeRow label="Mobile / Mono" spec="13px · 400 · 110% · +1% · uppercase">
            <p className="text-mobile-mono text-primary">Polygon Technology</p>
          </TypeRow>
          <TypeRow label="Mobile / Mono Small" spec="12px · 400 · 110% · +1% · uppercase">
            <p className="text-mobile-mono-small text-primary">Polygon Technology</p>
          </TypeRow>
        </div>
      </div>
    </section>
  )
}

function ColorSwatch({
  name,
  darkValue,
  lightValue,
}: {
  name: string
  darkValue: string
  lightValue: string
}) {
  return (
    <div className="flex gap-4 items-start border-b border-stroke pb-6">
      <div className="shrink-0 w-[200px]">
        <p className="text-desktop-mono-small text-grey-200">{name}</p>
      </div>
      <div className="flex gap-3 flex-1">
        <div className="flex flex-col gap-2 flex-1">
          <div
            className="h-[56px] rounded-[4px] border border-stroke"
            style={{ backgroundColor: darkValue }}
          />
          <p className="text-desktop-mono-small text-grey-300">{darkValue}</p>
          <p className="text-desktop-mono-small text-grey-400">DARK</p>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div
            className="h-[56px] rounded-[4px] border border-stroke"
            style={{ backgroundColor: lightValue }}
          />
          <p className="text-desktop-mono-small text-grey-300">{lightValue}</p>
          <p className="text-desktop-mono-small text-grey-400">LIGHT</p>
        </div>
      </div>
    </div>
  )
}

function AccentSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-[120px] rounded-[4px]" style={{ backgroundColor: value }} />
      <div>
        <p className="text-desktop-mono-small text-primary">{name}</p>
        <p className="text-desktop-mono-small text-grey-200">{value}</p>
      </div>
    </div>
  )
}

function ColorsSection() {
  const themeColors = [
    { name: 'Primary', darkValue: '#FFFFFF', lightValue: '#07060D' },
    { name: 'Inverted Primary', darkValue: '#07060D', lightValue: '#F2F1F5' },
    { name: 'Inverted Primary Hover', darkValue: '#121118', lightValue: '#D0CED6' },
    { name: 'Grey 100', darkValue: '#F2F3F7', lightValue: '#2D2B36' },
    { name: 'Grey 200', darkValue: '#A0A1A6', lightValue: '#888A91' },
    { name: 'Grey 300', darkValue: '#595A5F', lightValue: '#A2A3A5' },
    { name: 'Grey 400', darkValue: '#353535', lightValue: '#BAB9BB' },
    { name: 'Grey 500', darkValue: '#1F1E20', lightValue: '#D7D6D9' },
    { name: 'Grey 500 Hover', darkValue: '#272628', lightValue: '#C4C2C9' },
    { name: 'Grey 600', darkValue: '#141415', lightValue: '#E7E6E8' },
    { name: 'Grey 600 Hover', darkValue: '#1D1D1F', lightValue: '#DCDBDE' },
    { name: 'Stroke', darkValue: '#1B1B1D', lightValue: '#E1E1E5' },
    { name: 'Purple Subtle', darkValue: '#290958', lightValue: '#DDCFF2' },
  ]

  const accentColors = [
    { name: 'Purple', value: '#670DE5' },
    { name: 'Purple Hover', value: '#721FE5' },
    { name: 'Bubble Gum', value: '#E271D7' },
    { name: 'Sky Blue', value: '#00BBFF' },
    { name: 'Neon Green', value: '#00FF08' },
    { name: 'Orange', value: '#FF7421' },
    { name: 'Yellow', value: '#FEE211' },
    { name: 'Blue', value: '#0037C6' },
    { name: 'Semi-transparent Blue', value: '#707BB7' },
    { name: 'Semi-transparent Purple', value: '#C590E5' },
  ]

  return (
    <section>
      <h2 className="text-desktop-h1 text-primary mb-[64px]">Colors</h2>

      <div className="mb-[64px]">
        <p className="text-desktop-mono text-grey-200 mb-[32px]">THEME COLORS</p>
        <p className="text-desktop-body-small text-grey-300 mb-[24px]">
          Each token has distinct dark and light values — they flip automatically when the theme changes.
        </p>
        <div className="flex flex-col gap-6">
          {themeColors.map((c) => (
            <ColorSwatch key={c.name} {...c} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-desktop-mono text-grey-200 mb-[32px]">ACCENT COLORS</p>
        <p className="text-desktop-body-small text-grey-300 mb-[24px]">
          Fixed values — do not change between themes.
        </p>
        <div className="grid grid-cols-5 gap-x-4 gap-y-8">
          {accentColors.map((c) => (
            <AccentSwatch key={c.name} {...c} />
          ))}
        </div>
      </div>
    </section>
  )
}

function GridSection() {
  return (
    <section>
      <h2 className="text-desktop-h1 text-primary mb-[64px]">Grid</h2>

      <div className="mb-[64px]">
        <p className="text-desktop-mono text-grey-200 mb-[32px]">DESKTOP — 1440px</p>
        <div className="relative h-[200px] w-full overflow-hidden border border-stroke rounded-[4px]">
          <div className="absolute inset-0 flex" style={{ paddingLeft: 60, paddingRight: 60 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-purple/10 h-full flex-1 shrink-0"
                style={{ marginLeft: i === 0 ? 0 : 28 }}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-8 mt-4">
          <p className="text-desktop-mono-small text-grey-200">COLUMNS: 12</p>
          <p className="text-desktop-mono-small text-grey-200">MARGIN: 60px</p>
          <p className="text-desktop-mono-small text-grey-200">GUTTER: 28px</p>
          <p className="text-desktop-mono-small text-grey-200">COLUMN WIDTH: ~84.33px</p>
        </div>
      </div>

      <div>
        <p className="text-desktop-mono text-grey-200 mb-[32px]">MOBILE — 375px</p>
        <div
          className="relative h-[200px] overflow-hidden border border-stroke rounded-[4px]"
          style={{ width: 375 }}
        >
          <div className="absolute inset-0 flex" style={{ paddingLeft: 16, paddingRight: 16 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-purple/10 h-full flex-1 shrink-0"
                style={{ marginLeft: i === 0 ? 0 : 16 }}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-8 mt-4">
          <p className="text-desktop-mono-small text-grey-200">COLUMNS: 4</p>
          <p className="text-desktop-mono-small text-grey-200">MARGIN: 16px</p>
          <p className="text-desktop-mono-small text-grey-200">GUTTER: 16px</p>
          <p className="text-desktop-mono-small text-grey-200">COLUMN WIDTH: ~73.5px</p>
        </div>
      </div>
    </section>
  )
}

function SpacerBlock({ height, label }: { height: number; label: string }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-desktop-mono text-grey-200">{label}</p>
      <div
        className="w-full border border-stroke relative"
        style={{ height }}
      >
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${height === 120 ? 12 : 5}, 1fr)`,
            gap: 0,
          }}
        >
          {Array.from({ length: height === 120 ? 12 : 5 }).map((_, i) => (
            <div key={i} className="bg-inverted-primary/80 border border-stroke" />
          ))}
        </div>
      </div>
      <p className="text-desktop-mono-small text-grey-300">{height}px</p>
    </div>
  )
}

function SpacingSection() {
  return (
    <section>
      <h2 className="text-desktop-h1 text-primary mb-[64px]">Spacing</h2>
      <div className="flex flex-col gap-[48px]">
        <SpacerBlock height={120} label="DESKTOP SPACER" />
        <SpacerBlock height={75} label="MOBILE SPACER" />
      </div>
    </section>
  )
}
