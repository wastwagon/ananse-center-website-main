import type { Metadata, Viewport } from 'next'
import SiteAnalytics from '../components/SiteAnalytics'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0f172a',
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'The Ananse Center for Arts and Culture',
    template: '%s | Ananse Center',
  },
  description:
    'Empowering Africa\'s next generation of leaders through cultural arts, education, and community programs. Weaving wisdom into solutions.',
  keywords: [
    'Ananse Center',
    'African arts',
    'Akatakyiwa',
    'Central Region Ghana',
    'restorative arts',
    'African diaspora',
    'repatriation Ghana',
    'Sankofa',
    'cultural center',
    'non-profit donation Ghana',
  ],
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  icons: {
    icon: [{ url: '/icon', type: 'image/png' }],
    apple: [{ url: '/apple-icon', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: 'Ananse Center',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: 'The Ananse Center for Arts and Culture',
    description: 'Weaving wisdom into solutions — empowering Africa\'s next generation.',
    type: 'website',
    locale: 'en_GB',
    alternateLocale: ['fr_FR'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-white antialiased font-body">
        <SiteAnalytics />
        {children}
      </body>
    </html>
  )
}
