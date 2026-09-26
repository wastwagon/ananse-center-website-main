import type { ApiEvent } from '../api'

/** Seeded arts-and-culture gatherings. Do not present them as ANANSE events. */
export const LEGACY_ARTS_EVENT_SLUGS = new Set([
  'ananse-storytelling-festival',
  'kente-weaving-workshop-series',
  'diaspora-reconnection-retreat',
  'contemporary-african-art-exhibition',
  'traditional-drumming-dance-festival',
  'cultural-heritage-symposium',
])

export function withoutLegacyArtsEvents(events: ApiEvent[]): ApiEvent[] {
  return events.filter((event) => !LEGACY_ARTS_EVENT_SLUGS.has(event.slug))
}
