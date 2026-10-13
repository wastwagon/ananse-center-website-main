import type { MediaAsset, PhotoAlbum, PhotoAlbumImage, Program, Event, Person } from '@prisma/client'
import { mediaPublicPath } from './media-url.js'
import { parseRelatedOverrides } from './related-overrides.js'
import { isPubliclyVisible, statusFromPublished } from './publication.js'

type AlbumImageWithMedia = PhotoAlbumImage & { media: MediaAsset }
type VisibilityFields = {
  published: boolean
  publicationStatus: string
  scheduledAt: Date | null
}
type ProgramRef = Pick<Program, 'id' | 'slug' | 'title'> & VisibilityFields
type EventRef = Pick<Event, 'id' | 'slug' | 'title'> & VisibilityFields
type PersonRef = Pick<Person, 'id' | 'slug' | 'name'> & VisibilityFields

type AlbumWithRelations = PhotoAlbum & {
  coverMedia?: MediaAsset | null
  program?: ProgramRef | null
  event?: EventRef | null
  images?: AlbumImageWithMedia[]
  people?: { person: PersonRef }[]
}

const visibilitySelect = {
  published: true,
  publicationStatus: true,
  scheduledAt: true,
} as const

export const photoAlbumIncludeRelations = {
  coverMedia: true,
  program: { select: { id: true, slug: true, title: true, ...visibilitySelect } },
  event: { select: { id: true, slug: true, title: true, ...visibilitySelect } },
  people: {
    include: {
      person: { select: { id: true, slug: true, name: true, ...visibilitySelect } },
    },
  },
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
    alt: image.altText?.trim() || image.media.altText?.trim() || image.caption || '',
    sortOrder: image.sortOrder,
    url: mediaPublicPath(image.media.id),
  }))
}

function mapPeople(people: { person: PersonRef }[] | undefined, publicOnly = false) {
  return (people ?? [])
    .filter((row) => (publicOnly ? isPubliclyVisible(row.person) : true))
    .map((row) => ({
      id: row.person.id,
      slug: row.person.slug,
      name: row.person.name,
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
    photographer: row.photographer,
    rightsNote: row.rightsNote,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    keywords: row.keywords,
    noindex: row.noindex,
    shareImageUrl: row.shareMediaId ? mediaPublicPath(row.shareMediaId) : null,
    program:
      row.program && isPubliclyVisible(row.program)
        ? { id: row.program.id, slug: row.program.slug, title: row.program.title }
        : null,
    event:
      row.event && isPubliclyVisible(row.event)
        ? { id: row.event.id, slug: row.event.slug, title: row.event.title }
        : null,
    people: mapPeople(row.people, true),
    coverImageUrl: row.coverMedia ? mediaPublicPath(row.coverMedia.id) : null,
    images: mapAlbumImages(row.images),
    featured: row.featured,
    publicationStatus: row.publicationStatus || statusFromPublished(row.published),
    scheduledAt: row.scheduledAt?.toISOString() ?? null,
    relatedPinned: parseRelatedOverrides(row.relatedPinned),
    relatedHidden: parseRelatedOverrides(row.relatedHidden),
    href: `/library/photo-gallery/${row.slug}`,
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
    photographer: row.photographer,
    rightsNote: row.rightsNote,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    keywords: row.keywords,
    noindex: row.noindex,
    shareMediaId: row.shareMediaId,
    programId: row.programId,
    eventId: row.eventId,
    personIds: mapPeople(row.people).map((person) => person.id),
    coverMediaId: row.coverMediaId,
    coverImageUrl: row.coverMedia ? mediaPublicPath(row.coverMedia.id) : null,
    images: mapAlbumImages(row.images),
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
