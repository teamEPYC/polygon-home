import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const polySansSlimWide = localFont({
  src: '../public/fonts/PolySansTrial-SlimWide.otf',
  variable: '--font-heading',
  weight: '300',
  display: 'swap',
})

const polySansNeutral = localFont({
  src: '../public/fonts/PolySansTrial-Neutral.otf',
  variable: '--font-body',
  weight: '400',
  display: 'swap',
})

const polySansMono = localFont({
  src: '../public/fonts/PolySansTrial-NeutralMono.otf',
  variable: '--font-mono',
  weight: '400',
  display: 'swap',
})

// Metadata mirrors live polygon.technology (title, description, favicon,
// apple-touch icon, and OG/Twitter card image downloaded into public/assets/meta).
const TITLE = 'Polygon | The Go-To Blockchain for Global Payments'
const DESCRIPTION =
  'Polygon is the chosen blockchain infrastructure for enterprises and institutions to move assets instantly at scale with low fees, enterprise tooling, and proven reliability.'

// Resolve relative OG/icon URLs against the origin that actually serves them.
// On Vercel this is the deployment's production URL (the assets live in this
// app's /public, not on the live Webflow polygon.technology site). Override
// with NEXT_PUBLIC_SITE_URL once the app owns the real domain.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: '/assets/meta/favicon.png',
    shortcut: '/assets/meta/favicon.png',
    apple: '/assets/meta/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    images: [{ url: '/assets/meta/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/assets/meta/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${polySansSlimWide.variable} ${polySansNeutral.variable} ${polySansMono.variable}`}
    >
      <body>
        {/* Shared SVG clip-path defs — referenced via url(#id) across all sections */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <defs>
            <clipPath id="navClipLeft" clipPathUnits="objectBoundingBox">
              <path d="M0 0 H0.833 H1 V0.628 C1 0.67 0.993 0.71 0.98 0.739 L0.873 0.978 C0.866 0.992 0.858 1 0.849 1 H0.833 H0 V0 Z" />
            </clipPath>
            <clipPath id="navMenuMobile" clipPathUnits="objectBoundingBox">
              <path d="M0.077 1 H0.615 H0.653 C0.673 1 0.692 0.991 0.706 0.975 L0.953 0.691 C0.983 0.657 1 0.61 1 0.561 V0 H0.615 H0 V0.909 C0 0.959 0.034 1 0.077 1Z" />
            </clipPath>
            <clipPath id="buttonClip" clipPathUnits="objectBoundingBox" transform="scale(0.0052, 0.0192)">
              <path d="M0 4C0 1.79086 1.79086 0 4 0H164V52H4C1.79086 52 0 50.2091 0 48V4Z" />
              <path d="M188 0C190.209 0 192 1.79086 192 4V32.6784C192 34.8433 191.123 36.9157 189.568 38.4225L176.726 50.872C175.979 51.5955 174.981 52 173.941 52H163V0H188Z" />
            </clipPath>
            <clipPath id="glanceCards" clipPathUnits="objectBoundingBox" transform="scale(0.0045045045, 0.0048543689)">
              <path fillRule="evenodd" clipRule="evenodd" d="M218.004 0C220.213 0.000174788 222.004 1.79108 222.004 4V179H222V183.398C222 184.463 221.575 185.484 220.82 186.234L202.118 204.837C201.369 205.582 200.355 206.001 199.298 206.001H4C1.79107 206.001 9.989e-05 204.21 0 202.001V178.001H0.00390625V22.6025C0.00395409 21.538 0.428859 20.5173 1.18359 19.7666L19.8857 1.16406C20.6352 0.418759 21.6491 3.8124e-05 22.7061 0H218.004Z" />
            </clipPath>
            {/* Live mobileHeroClip (363×600 objectBoundingBox path) — beveled
                top-left corner for the mobile hero scene card. Scaled to the
                scene card box via clipPathUnits. Referenced from hero.tsx. */}
            <clipPath
              id="mobileHeroClip"
              clipPathUnits="objectBoundingBox"
              transform="scale(0.0027548209, 0.0016666667)"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M363 0.995135V599.995H0V29.2031C9.66733e-08 28.0973 0.457819 27.0404 1.26465 26.2842L28.1543 1.08107C28.8987 0.383409 29.8821 -0.00303945 30.9023 1.80045e-05L363 0.995135Z"
              />
            </clipPath>
            {/* Live triangleClip — the OMS bottom-row corner cell (121×122 path):
                a triangle cut so the black cell shows a diagonal edge. */}
            <clipPath
              id="triangleClip"
              clipPathUnits="objectBoundingBox"
              transform="scale(0.008264, 0.008197)"
            >
              <path d="M121 0V122H0L121 0Z" />
            </clipPath>
            {/* Live omsHeroClip — the OMS hero blue scene field (720×600 path):
                a beveled BOTTOM-LEFT corner (bottom edge stops at x120 then cuts
                diagonally up to y480). The cut is transparent, so it reveals the
                page background and flips light/dark. Referenced from hero-oms.tsx. */}
            <clipPath
              id="omsHeroClip"
              clipPathUnits="objectBoundingBox"
              transform="scale(0.00139, 0.00167)"
            >
              <path d="M0 0H720V600H120L0 480V0Z" />
            </clipPath>
          </defs>
        </svg>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
