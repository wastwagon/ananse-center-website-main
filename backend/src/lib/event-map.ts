import type { Event, MediaAsset, Program } from '@prisma/client'
import { parseStringArray } from './json-arrays.js'
import { mediaPublicPath } from './media-url.js'

export function parseHighlights(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

type ProgramRef = Pick<Program, 'id' | 'slug' | 'title'>

type SpeakerRef = {
  role: string
  person: { id: string; slug: string; name: string; roleTitle: string }
}

type EventWithCover = Event & {
  coverMedia?: MediaAsset | null
  program?: ProgramRef | null
  speakers?: SpeakerRef[]
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
    transcript: event.transcript,
    subtitle: event.subtitle,
    galleryMediaIds: parseStringArray(event.galleryMediaIds),
    galleryImageUrls: galleryImageUrls(event.galleryMediaIds),
    program: event.program
      ? { id: event.program.id, slug: event.program.slug, title: event.program.title }
      : null,
    location: event.location,
    venue: event.venue,
    type: event.type,
    image: event.imageEmoji,
    coverImageUrl: event.coverMedia ? mediaPublicPath(event.coverMedia.id) : null,
    featured: event.featured,
    speakers: (event.speakers ?? []).map((row) => ({
      role: row.role,
      id: row.person.id,
      slug: row.person.slug,
      name: row.person.name,
      roleTitle: row.person.roleTitle,
    })),
    storyTitle: event.storyTitle,
    storyBody: event.storyBody,
    highlights: parseHighlights(event.highlights),
  }
}

export const eventIncludeCover = { coverMedia: true } as const

const speakerInclude = {
  speakers: {
    include: {
      person: { select: { id: true, slug: true, name: true, roleTitle: true } },
    },
  },
} as const

export const eventIncludePublic = {
  coverMedia: true,
  program: { select: { id: true, slug: true, title: true } },
  ...speakerInclude,
} as const

export const eventIncludeAdmin = {
  coverMedia: true,
  program: { select: { id: true, slug: true, title: true } },
  ...speakerInclude,
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
    transcript: event.transcript,
    subtitle: event.subtitle,
    speakers: (event.speakers ?? []).map((row) => ({
      personId: row.person.id,
      role: row.role,
      name: row.person.name,
    })),
    galleryMediaIds: parseStringArray(event.galleryMediaIds),
    programId: event.programId,
    program: event.program ?? null,
    location: event.location,
    venue: event.venue,
    type: event.type,
    imageEmoji: event.imageEmoji,
    storyTitle: event.storyTitle,
    storyBody: event.storyBody,
    highlights: parseHighlights(event.highlights),
    featured: event.featured,
    published: event.published,
    coverMediaId: event.coverMediaId,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  }
}
