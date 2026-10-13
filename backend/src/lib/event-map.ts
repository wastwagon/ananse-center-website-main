import type { Event, MediaAsset, Program } from '@prisma/client'
import { parseStringArray } from './json-arrays.js'
import { mediaPublicPath } from './media-url.js'
import { parseRelatedOverrides } from './related-overrides.js'
import { isPubliclyVisible, statusFromPublished } from './publication.js'

export function parseHighlights(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

const visibilitySelect = {
  published: true,
  publicationStatus: true,
  scheduledAt: true,
} as const

type VisibilityFields = {
  published: boolean
  publicationStatus: string
  scheduledAt: Date | null
}

type ProgramRef = Pick<Program, 'id' | 'slug' | 'title'> & VisibilityFields

type SpeakerRef = {
  role: string
  person: {
    id: string
    slug: string
    name: string
    roleTitle: string
  } & VisibilityFields
}

type InsightLink = {
  newsPost: {
    id: string
    slug: string
    title: string
    contentType: string
  } & VisibilityFields
}

type EventWithCover = Event & {
  coverMedia?: MediaAsset | null
  program?: ProgramRef | null
  speakers?: SpeakerRef[]
  insightLinks?: InsightLink[]
}

export function galleryImageUrls(galleryMediaIds: unknown): string[] {
  return parseStringArray(galleryMediaIds).map((id) => mediaPublicPath(id))
}

export function mapPublicEvent(event: EventWithCover) {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    date: event.dateLabel,
    startsAt: event.startsAt?.toISOString() ?? null,
    endsAt: event.endsAt?.toISOString() ?? null,
    timeLabel: event.timeLabel || '',
    capacity: event.capacity,
    registrationStatus: event.registrationStatus || 'auto',
    eventStatus: event.eventStatus || 'scheduled',
    deliveryMode: event.deliveryMode || 'in_person',
    meetingUrl: event.meetingUrl.trim() || null,
    recordingUrl: event.recordingUrl.trim() || null,
    audioUrl: event.audioUrl.trim() || null,
    cost: event.cost,
    registrationUrl: event.registrationUrl.trim() || null,
    organizer: event.organizer,
    timeZone: event.timeZone,
    seoTitle: event.seoTitle,
    seoDescription: event.seoDescription,
    keywords: event.keywords,
    noindex: event.noindex,
    shareImageUrl: event.shareMediaId ? mediaPublicPath(event.shareMediaId) : null,
    insights: (event.insightLinks ?? [])
      .filter((row) => isPubliclyVisible(row.newsPost))
      .map((row) => ({
        id: row.newsPost.id,
        slug: row.newsPost.slug,
        title: row.newsPost.title,
        contentType: row.newsPost.contentType,
      })),
    transcript: event.transcript,
    subtitle: event.subtitle,
    galleryMediaIds: parseStringArray(event.galleryMediaIds),
    galleryImageUrls: galleryImageUrls(event.galleryMediaIds),
    program:
      event.program && isPubliclyVisible(event.program)
        ? { id: event.program.id, slug: event.program.slug, title: event.program.title }
        : null,
    location: event.location,
    venue: event.venue,
    type: event.type,
    image: event.imageEmoji,
    coverImageUrl: event.coverMedia ? mediaPublicPath(event.coverMedia.id) : null,
    featured: event.featured,
    speakers: (event.speakers ?? [])
      .filter((row) => isPubliclyVisible(row.person))
      .map((row) => ({
        role: row.role,
        id: row.person.id,
        slug: row.person.slug,
        name: row.person.name,
        roleTitle: row.person.roleTitle,
      })),
    storyTitle: event.storyTitle,
    storyBody: event.storyBody,
    highlights: parseHighlights(event.highlights),
    publicationStatus: event.publicationStatus || statusFromPublished(event.published),
    scheduledAt: event.scheduledAt?.toISOString() ?? null,
    relatedPinned: parseRelatedOverrides(event.relatedPinned),
    relatedHidden: parseRelatedOverrides(event.relatedHidden),
  }
}

export const eventIncludeCover = { coverMedia: true } as const

const speakerInclude = {
  speakers: {
    include: {
      person: {
        select: {
          id: true,
          slug: true,
          name: true,
          roleTitle: true,
          ...visibilitySelect,
        },
      },
    },
  },
} as const

const insightInclude = {
  insightLinks: {
    include: {
      newsPost: {
        select: { id: true, slug: true, title: true, contentType: true, ...visibilitySelect },
      },
    },
  },
} as const

export const eventIncludePublic = {
  coverMedia: true,
  program: { select: { id: true, slug: true, title: true, ...visibilitySelect } },
  ...speakerInclude,
  ...insightInclude,
} as const

export const eventIncludeAdmin = {
  coverMedia: true,
  program: { select: { id: true, slug: true, title: true, ...visibilitySelect } },
  ...speakerInclude,
  ...insightInclude,
} as const

export function mapAdminEvent(event: EventWithCover) {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    dateLabel: event.dateLabel,
    startsAt: event.startsAt?.toISOString() ?? null,
    endsAt: event.endsAt?.toISOString() ?? null,
    timeLabel: event.timeLabel,
    capacity: event.capacity,
    registrationStatus: event.registrationStatus,
    eventStatus: event.eventStatus,
    deliveryMode: event.deliveryMode,
    meetingUrl: event.meetingUrl,
    recordingUrl: event.recordingUrl,
    audioUrl: event.audioUrl,
    cost: event.cost,
    registrationUrl: event.registrationUrl,
    organizer: event.organizer,
    timeZone: event.timeZone,
    seoTitle: event.seoTitle,
    seoDescription: event.seoDescription,
    keywords: event.keywords,
    noindex: event.noindex,
    shareMediaId: event.shareMediaId,
    insightIds: (event.insightLinks ?? []).map((row) => row.newsPost.id),
    transcript: event.transcript,
    subtitle: event.subtitle,
    speakers: (event.speakers ?? []).map((row) => ({
      personId: row.person.id,
      role: row.role,
      name: row.person.name,
    })),
    galleryMediaIds: parseStringArray(event.galleryMediaIds),
    programId: event.programId,
    program: event.program
      ? { id: event.program.id, slug: event.program.slug, title: event.program.title }
      : null,
    location: event.location,
    venue: event.venue,
    type: event.type,
    imageEmoji: event.imageEmoji,
    storyTitle: event.storyTitle,
    storyBody: event.storyBody,
    highlights: parseHighlights(event.highlights),
    featured: event.featured,
    published: event.published,
    publicationStatus: event.publicationStatus || statusFromPublished(event.published),
    scheduledAt: event.scheduledAt?.toISOString() ?? null,
    relatedPinned: parseRelatedOverrides(event.relatedPinned),
    relatedHidden: parseRelatedOverrides(event.relatedHidden),
    coverMediaId: event.coverMediaId,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  }
}
