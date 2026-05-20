import { fetchEvents } from './api'
import { images, resolveEventCoverImage } from './images'

export type FeaturedEventCard = {
  slug: string
  title: string
  date: string
  location: string
  description: string
  image: string
  type: string
}

const fallbackFeatured: FeaturedEventCard[] = [
  {
    slug: 'ananse-storytelling-festival',
    title: 'Ananse Storytelling Festival',
    date: 'March 15-17, 2025',
    location: 'Accra, Ghana',
    description:
      'Master storytellers, performances, and workshops celebrating African oral traditions.',
    image: images.events.featured[0],
    type: 'Festival',
  },
  {
    slug: 'diaspora-reconnection-retreat',
    title: 'Diaspora Reconnection Retreat',
    date: 'May 10-12, 2025',
    location: 'Cape Coast, Ghana',
    description: 'A guided journey home for diaspora communities seeking cultural reconnection.',
    image: images.events.featured[1],
    type: 'Retreat',
  },
  {
    slug: 'cultural-heritage-symposium',
    title: 'Cultural Heritage Symposium',
    date: 'September 5-7, 2025',
    location: 'University of Ghana',
    description: 'Scholars and communities in dialogue on preserving living heritage.',
    image: images.events.featured[2],
    type: 'Symposium',
  },
]

export async function getFeaturedEventsForHome(): Promise<FeaturedEventCard[]> {
  try {
    const data = await fetchEvents()
    if (!data.length) return fallbackFeatured

    const featured = data.filter((e) => e.featured)
    const pool =
      featured.length >= 3
        ? featured
        : [...featured, ...data.filter((e) => !e.featured)]

    const unique = [...new Map(pool.map((e) => [e.slug, e])).values()].slice(0, 3)

    return unique.map((e) => ({
      slug: e.slug,
      title: e.title,
      date: e.date,
      location: e.location,
      description: e.description,
      image: resolveEventCoverImage(e),
      type: e.type,
    }))
  } catch {
    return fallbackFeatured
  }
}
