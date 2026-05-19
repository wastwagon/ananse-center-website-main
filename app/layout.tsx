import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

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
  title: 'The Ananse Center for Arts and Culture',
  description:
    'Empowering Africa\'s next generation of leaders through cultural arts, education, and community programs. Weaving wisdom into solutions.',
  keywords: [
    'African arts', 'cultural center', 'Ghana', 'youth leadership',
    'Pan-Africanism', 'community development', 'Sankofa',
  ],
  openGraph: {
    title: 'The Ananse Center for Arts and Culture',
    description: 'Weaving wisdom into solutions — empowering Africa\'s next generation.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-white antialiased font-body">{children}</body>
    </html>
  )
}
