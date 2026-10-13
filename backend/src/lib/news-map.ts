import type { Event, MediaAsset, NewsPost, Person, Program } from '@prisma/client'
import { parseStringArray } from './json-arrays.js'
import { mediaPublicPath } from './media-url.js'
import { parseRelatedOverrides } from './related-overrides.js'
import { isPubliclyVisible, statusFromPublished } from './publication.js'

type VisibilityFields = {
  published: boolean
  publicationStatus: string
  scheduledAt: Date | null
}

const visibilitySelect = {
  published: true,
  publicationStatus: true,
  scheduledAt: true,
} as const

type ProgramLink = {
  program: Pick<Program, 'id' | 'slug' | 'title'> & VisibilityFields
}

type EventLink = {
  event: Pick<Event, 'id' | 'slug' | 'title' | 'dateLabel'> & VisibilityFields
}

type NewsWithCover = NewsPost & {
  coverMedia?: MediaAsset | null
  program?: (Pick<Program, 'id' | 'slug' | 'title'> & VisibilityFields) | null
  authorPerson?: (Pick<Person, 'id' | 'slug' | 'name'> & VisibilityFields) | null
  programLinks?: ProgramLink[]
  eventLinks?: EventLink[]
}

function insightHref(row: NewsWithCover) {
  const link = row.linkHref.trim()
  if (link) return link
  return `/insights/${row.slug}`
}

export function mapPublicNewsPost(row: NewsWithCover) {
  const link = row.linkHref.trim()
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    subtitle: row.subtitle,
    excerpt: row.excerpt,
    body: row.body,
    date: row.dateLabel,
    author:
      row.author ||
      (row.authorPerson && isPubliclyVisible(row.authorPerson) ? row.authorPerson.name : '') ||
      '',
    authorPerson:
      row.authorPerson && isPubliclyVisible(row.authorPerson)
        ? { id: row.authorPerson.id, slug: row.authorPerson.slug, name: row.authorPerson.name }
        : null,
    program:
      row.program && isPubliclyVisible(row.program)
        ? { id: row.program.id, slug: row.program.slug, title: row.program.title }
        : null,
    category: row.category || 'Articles',
    contentType: row.contentType || row.category || 'Articles',
    topics: parseStringArray(row.topics),
    showInLibraryRead: row.showInLibraryRead,
    imageCredit: row.imageCredit,
    pullQuote: row.pullQuote,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    primaryTopic: row.primaryTopic,
    keywords: row.keywords,
    noindex: row.noindex,
    shareImageUrl: row.shareMediaId ? mediaPublicPath(row.shareMediaId) : null,
    programs: [
      ...(row.program && isPubliclyVisible(row.program)
        ? [{ id: row.program.id, slug: row.program.slug, title: row.program.title }]
        : []),
      ...(row.programLinks ?? [])
        .filter((link) => isPubliclyVisible(link.program) && link.program.id !== row.program?.id)
        .map((link) => ({
          id: link.program.id,
          slug: link.program.slug,
          title: link.program.title,
        })),
    ],
    events: (row.eventLinks ?? [])
      .filter((link) => isPubliclyVisible(link.event))
      .map((link) => ({
        id: link.event.id,
        slug: link.event.slug,
        title: link.event.title,
        date: link.event.dateLabel,
      })),
    featured: row.featured,
    publicationStatus: row.publicationStatus || statusFromPublished(row.published),
    scheduledAt: row.scheduledAt?.toISOString() ?? null,
    relatedPinned: parseRelatedOverrides(row.relatedPinned),
    relatedHidden: parseRelatedOverrides(row.relatedHidden),
    href: link || `/news/${row.slug}`,
    insightHref: insightHref(row),
    isExternal: /^https?:\/\//i.test(link),
    coverImageUrl: row.coverMedia ? mediaPublicPath(row.coverMedia.id) : null,
  }
}

export function mapPublicInsightPost(row: NewsWithCover) {
  const base = mapPublicNewsPost(row)
  const link = row.linkHref.trim()
  return {
    ...base,
    href: link || `/insights/${row.slug}`,
    isExternal: /^https?:\/\//i.test(link),
  }
}

export function mapAdminNewsPost(row: NewsWithCover) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    dateLabel: row.dateLabel,
    subtitle: row.subtitle,
    author: row.author || '',
    authorPersonId: row.authorPersonId,
    programId: row.programId,
    category: row.category || 'Articles',
    contentType: row.contentType || 'Articles',
    topics: parseStringArray(row.topics),
    showInLibraryRead: row.showInLibraryRead,
    imageCredit: row.imageCredit,
    pullQuote: row.pullQuote,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    primaryTopic: row.primaryTopic,
    keywords: row.keywords,
    noindex: row.noindex,
    shareMediaId: row.shareMediaId,
    programIds: [
      ...(row.programId ? [row.programId] : []),
      ...(row.programLinks ?? []).map((link) => link.program.id).filter((id) => id !== row.programId),
    ],
    eventIds: (row.eventLinks ?? []).map((link) => link.event.id),
    featured: row.featured,
    linkHref: row.linkHref,
    published: row.published,
    publicationStatus: row.publicationStatus || statusFromPublished(row.published),
    scheduledAt: row.scheduledAt?.toISOString() ?? null,
    relatedPinned: parseRelatedOverrides(row.relatedPinned),
    relatedHidden: parseRelatedOverrides(row.relatedHidden),
    sortOrder: row.sortOrder,
    coverMediaId: row.coverMediaId,
    coverImageUrl: row.coverMedia ? mediaPublicPath(row.coverMedia.id) : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export const newsIncludeCover = {
  coverMedia: true,
  program: { select: { id: true, slug: true, title: true, ...visibilitySelect } },
  authorPerson: { select: { id: true, slug: true, name: true, ...visibilitySelect } },
  programLinks: {
    include: {
      program: { select: { id: true, slug: true, title: true, ...visibilitySelect } },
    },
  },
  eventLinks: {
    include: {
      event: {
        select: { id: true, slug: true, title: true, dateLabel: true, ...visibilitySelect },
      },
    },
  },
} as const
