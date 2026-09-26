import type { Metadata, Viewport } from 'next'
import SiteAnalytics from '../components/SiteAnalytics'
import { Source_Sans_3, Playfair_Display } from 'next/font/google'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1c1917',
}

const sourceSans = Source_Sans_3({
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
    default: 'ANANSE Center for Leadership Development',
    template: '%s | ANANSE Center',
  },
  description:
    'Developing people. Transforming lives. Strengthening communities. Leadership education, mentoring, and practical service.',
  keywords: [
    'ANANSE Center',
    'Leadership Development',
    'EAGLESonline',
    'Midday Reflection',
    'Sankofa ADR',
    'Mentorship',
    'Excellence Lectures',
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
    title: 'ANANSE Center',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: 'ANANSE Center for Leadership Development',
    description: 'Developing people. Transforming lives. Strengthening communities.',
    type: 'website',
    locale: 'en_GB',
    alternateLocale: ['fr_FR'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${playfair.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-white antialiased font-body">
        <SiteAnalytics />
        {children}
      </body>
    </html>
  )
}
