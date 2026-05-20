import type { Event, MediaAsset } from '@prisma/client'
import { mediaPublicPath } from './media-url.js'

export function parseHighlights(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

type EventWithCover = Event & { coverMedia?: MediaAsset | null }

export function mapPublicEvent(event: EventWithCover) {
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
    coverImageUrl: event.coverMedia ? mediaPublicPath(event.coverMedia.id) : null,
    featured: event.featured,
    storyTitle: event.storyTitle,
    storyBody: event.storyBody,
    highlights: parseHighlights(event.highlights),
  }
}

export const eventIncludeCover = { coverMedia: true } as const
