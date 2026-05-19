import type { Event } from '@prisma/client'

export function parseHighlights(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

export function mapPublicEvent(event: Event) {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    date: event.dateLabel,
    location: event.location,
    venue: event.venue,
    type: event.type,
    image: event.imageEmoji,
    featured: event.featured,
    storyTitle: event.storyTitle,
    storyBody: event.storyBody,
    highlights: parseHighlights(event.highlights),
  }
}
