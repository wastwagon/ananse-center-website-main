import type { LibraryItem, MediaAsset, Person, Program } from '@prisma/client'
import { parseStringArray } from './json-arrays.js'
import { mediaPublicPath } from './media-url.js'

type ProgramRef = Pick<Program, 'id' | 'slug' | 'title'>
type PersonRef = Pick<Person, 'id' | 'slug' | 'name'>

type LibraryWithRelations = LibraryItem & {
  coverMedia?: MediaAsset | null
  audioMedia?: MediaAsset | null
  videoMedia?: MediaAsset | null
  program?: ProgramRef | null
  person?: PersonRef | null
}

export const libraryIncludeRelations = {
  coverMedia: true,
  audioMedia: true,
  videoMedia: true,
  program: { select: { id: true, slug: true, title: true } },
  person: { select: { id: true, slug: true, name: true } },
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
    publishedAt: row.publishedAt?.toISOString() ?? null,
    topics: parseStringArray(row.topics),
    program: row.program
      ? { id: row.program.id, slug: row.program.slug, title: row.program.title }
      : null,
    person: row.person
      ? { id: row.person.id, slug: row.person.slug, name: row.person.name }
      : null,
    coverImageUrl: row.coverMedia ? mediaPublicPath(row.coverMedia.id) : null,
    audioUrl: mediaUrl(row.audioMedia, row.audioUrl),
    videoUrl: mediaUrl(row.videoMedia, row.videoUrl),
    featured: row.featured,
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
    publishedAt: row.publishedAt?.toISOString() ?? null,
    topics: parseStringArray(row.topics),
    programId: row.programId,
    personId: row.personId,
    newsPostId: row.newsPostId,
    coverMediaId: row.coverMediaId,
    audioMediaId: row.audioMediaId,
    videoMediaId: row.videoMediaId,
    audioUrl: row.audioUrl,
    videoUrl: row.videoUrl,
    coverImageUrl: row.coverMedia ? mediaPublicPath(row.coverMedia.id) : null,
    featured: row.featured,
    published: row.published,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}
