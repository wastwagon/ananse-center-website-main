import type { LibraryItem, MediaAsset, Person, Program } from '@prisma/client'
import { parseStringArray } from './json-arrays.js'
import { mediaPublicPath } from './media-url.js'
import { parseRelatedOverrides } from './related-overrides.js'
import { isPubliclyVisible, statusFromPublished } from './publication.js'

type VisibilityFields = {
  published: boolean
  publicationStatus: string
  scheduledAt: Date | null
}

type ProgramRef = Pick<Program, 'id' | 'slug' | 'title'> & VisibilityFields
type PersonRef = Pick<Person, 'id' | 'slug' | 'name'> & VisibilityFields

type EventRef = { id: string; slug: string; title: string } & VisibilityFields
type InsightRef = { id: string; slug: string; title: string } & VisibilityFields

type LibraryWithRelations = LibraryItem & {
  coverMedia?: MediaAsset | null
  audioMedia?: MediaAsset | null
  videoMedia?: MediaAsset | null
  downloadMedia?: MediaAsset | null
  program?: ProgramRef | null
  person?: PersonRef | null
  event?: EventRef | null
  newsPost?: InsightRef | null
}

const visibilitySelect = {
  published: true,
  publicationStatus: true,
  scheduledAt: true,
} as const

export const libraryIncludeRelations = {
  coverMedia: true,
  audioMedia: true,
  videoMedia: true,
  downloadMedia: true,
  program: { select: { id: true, slug: true, title: true, ...visibilitySelect } },
  person: { select: { id: true, slug: true, name: true, ...visibilitySelect } },
  event: { select: { id: true, slug: true, title: true, ...visibilitySelect } },
  newsPost: { select: { id: true, slug: true, title: true, ...visibilitySelect } },
} as const

function mediaUrl(asset: MediaAsset | null | undefined, fallbackUrl: string) {
  if (asset) return mediaPublicPath(asset.id)
  const external = fallbackUrl.trim()
  return external || null
}

export function mapPublicLibraryItem(row: LibraryWithRelations) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    shelf: row.shelf,
    collection: row.collection,
    body: row.body,
    transcript: row.transcript,
    furtherStudy: row.furtherStudy,
    wisdomNugget: row.wisdomNugget,
    scriptureTheme: row.scriptureTheme,
    episodeNumber: row.episodeNumber,
    dateLabel: row.dateLabel,
    originalAt: row.originalAt?.toISOString() ?? null,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    topics: parseStringArray(row.topics),
    keywords: row.keywords,
    program:
      row.program && isPubliclyVisible(row.program)
        ? { id: row.program.id, slug: row.program.slug, title: row.program.title }
        : null,
    event:
      row.event && isPubliclyVisible(row.event)
        ? { id: row.event.id, slug: row.event.slug, title: row.event.title }
        : null,
    person:
      row.person && isPubliclyVisible(row.person)
        ? { id: row.person.id, slug: row.person.slug, name: row.person.name }
        : null,
    insight:
      row.newsPost && isPubliclyVisible(row.newsPost)
        ? { id: row.newsPost.id, slug: row.newsPost.slug, title: row.newsPost.title }
        : null,
    coverImageUrl: row.coverMedia ? mediaPublicPath(row.coverMedia.id) : null,
    audioUrl: mediaUrl(row.audioMedia, row.audioUrl),
    videoUrl: mediaUrl(row.videoMedia, row.videoUrl),
    downloadUrl: mediaUrl(row.downloadMedia, row.downloadUrl),
    duration: row.duration,
    rightsNote: row.rightsNote,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    noindex: row.noindex,
    shareImageUrl: row.shareMediaId ? mediaPublicPath(row.shareMediaId) : null,
    featured: row.featured,
    publicationStatus: row.publicationStatus || statusFromPublished(row.published),
    scheduledAt: row.scheduledAt?.toISOString() ?? null,
    relatedPinned: parseRelatedOverrides(row.relatedPinned),
    relatedHidden: parseRelatedOverrides(row.relatedHidden),
    href: `/library/${row.slug}`,
  }
}

export function mapAdminLibraryItem(row: LibraryWithRelations) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    shelf: row.shelf,
    collection: row.collection,
    body: row.body,
    transcript: row.transcript,
    furtherStudy: row.furtherStudy,
    wisdomNugget: row.wisdomNugget,
    scriptureTheme: row.scriptureTheme,
    episodeNumber: row.episodeNumber,
    dateLabel: row.dateLabel,
    originalAt: row.originalAt?.toISOString() ?? null,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    topics: parseStringArray(row.topics),
    keywords: row.keywords,
    programId: row.programId,
    eventId: row.eventId,
    personId: row.personId,
    newsPostId: row.newsPostId,
    coverMediaId: row.coverMediaId,
    audioMediaId: row.audioMediaId,
    videoMediaId: row.videoMediaId,
    downloadMediaId: row.downloadMediaId,
    audioUrl: row.audioUrl,
    videoUrl: row.videoUrl,
    downloadUrl: row.downloadUrl,
    duration: row.duration,
    rightsNote: row.rightsNote,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    noindex: row.noindex,
    shareMediaId: row.shareMediaId,
    coverImageUrl: row.coverMedia ? mediaPublicPath(row.coverMedia.id) : null,
    featured: row.featured,
    published: row.published,
    publicationStatus: row.publicationStatus || statusFromPublished(row.published),
    scheduledAt: row.scheduledAt?.toISOString() ?? null,
    relatedPinned: parseRelatedOverrides(row.relatedPinned),
    relatedHidden: parseRelatedOverrides(row.relatedHidden),
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}
