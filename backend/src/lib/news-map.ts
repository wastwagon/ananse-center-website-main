import type { MediaAsset, NewsPost, Person, Program } from '@prisma/client'
import { parseStringArray } from './json-arrays.js'
import { mediaPublicPath } from './media-url.js'

type NewsWithCover = NewsPost & {
  coverMedia?: MediaAsset | null
  program?: Pick<Program, 'id' | 'slug' | 'title'> | null
  authorPerson?: Pick<Person, 'id' | 'slug' | 'name'> | null
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
    author: row.author || row.authorPerson?.name || '',
    authorPerson: row.authorPerson
      ? { id: row.authorPerson.id, slug: row.authorPerson.slug, name: row.authorPerson.name }
      : null,
    program: row.program
      ? { id: row.program.id, slug: row.program.slug, title: row.program.title }
      : null,
    category: row.category || 'Articles',
    contentType: row.contentType || row.category || 'Articles',
    topics: parseStringArray(row.topics),
    showInLibraryRead: row.showInLibraryRead,
    featured: row.featured,
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
    featured: row.featured,
    linkHref: row.linkHref,
    published: row.published,
    sortOrder: row.sortOrder,
    coverMediaId: row.coverMediaId,
    coverImageUrl: row.coverMedia ? mediaPublicPath(row.coverMedia.id) : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export const newsIncludeCover = {
  coverMedia: true,
  program: { select: { id: true, slug: true, title: true } },
  authorPerson: { select: { id: true, slug: true, name: true } },
} as const
