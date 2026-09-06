import { buildCmsMetadata } from '../../../lib/cms/seo'
import { images } from '../../../lib/images'

export async function generateMetadata() {
  return buildCmsMetadata('events', { ogImage: images.hero.events })
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children
}
