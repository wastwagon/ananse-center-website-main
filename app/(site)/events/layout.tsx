import type { Metadata } from 'next'
import { buildPageMetadata } from '../../../lib/page-meta'
import { images } from '../../../lib/images'

export const metadata: Metadata = buildPageMetadata({
  title: 'Events',
  description:
    'Cultural gatherings, workshops, and community events at The Ananse Center in Accra — open to local and diaspora participants.',
  path: '/events',
  ogImage: images.hero.events,
})

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children
}
