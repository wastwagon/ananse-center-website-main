import type { MediaAsset, PhotoAlbum, PhotoAlbumImage, Program, Event } from '@prisma/client'
import { mediaPublicPath } from './media-url.js'

type AlbumImageWithMedia = PhotoAlbumImage & { media: MediaAsset }
type ProgramRef = Pick<Program, 'id' | 'slug' | 'title'>
type EventRef = Pick<Event, 'id' | 'slug' | 'title'>

type AlbumWithRelations = PhotoAlbum & {
  coverMedia?: MediaAsset | null
  program?: ProgramRef | null
  event?: EventRef | null
  images?: AlbumImageWithMedia[]
}

export const photoAlbumIncludeRelations = {
  coverMedia: true,
  program: { select: { id: true, slug: true, title: true } },
  event: { select: { id: true, slug: true, title: true } },
  images: {
    orderBy: { sortOrder: 'asc' as const },
    include: { media: true },
  },
} as const

function mapAlbumImages(images: AlbumImageWithMedia[] | undefined) {
  return (images ?? []).map((image) => ({
    id: image.id,
    mediaId: image.mediaId,
    caption: image.caption,
    sortOrder: image.sortOrder,
    url: mediaPublicPath(image.media.id),
  }))
}

export function mapPublicPhotoAlbum(row: AlbumWithRelations) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    dateLabel: row.dateLabel,
    place: row.place,
    collection: row.collection,
    program: row.program
      ? { id: row.program.id, slug: row.program.slug, title: row.program.title }
      : null,
    event: row.event ? { id: row.event.id, slug: row.event.slug, title: row.event.title } : null,
    coverImageUrl: row.coverMedia ? mediaPublicPath(row.coverMedia.id) : null,
    images: mapAlbumImages(row.images),
    featured: row.featured,
    href: `/library/photos/${row.slug}`,
  }
}

export function mapAdminPhotoAlbum(row: AlbumWithRelations) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    dateLabel: row.dateLabel,
    place: row.place,
    collection: row.collection,
    programId: row.programId,
    eventId: row.eventId,
    coverMediaId: row.coverMediaId,
    coverImageUrl: row.coverMedia ? mediaPublicPath(row.coverMedia.id) : null,
    images: mapAlbumImages(row.images),
    featured: row.featured,
    published: row.published,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}
