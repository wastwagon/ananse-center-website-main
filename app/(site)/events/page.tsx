import EventsPageClient from './EventsPageClient'
import { fetchEvents } from '../../../lib/api'
import { withoutLegacyArtsEvents } from '../../../lib/leadership/legacy-events'
import { buildCmsMetadata } from '../../../lib/cms/seo'
import { images } from '../../../lib/images'

export async function generateMetadata() {
  return buildCmsMetadata('events', { ogImage: images.hero.events })
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type } = await searchParams
  const events = withoutLegacyArtsEvents(await fetchEvents().catch(() => []))
  return <EventsPageClient initialEvents={events} initialType={type} />
}
