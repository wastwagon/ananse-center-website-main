import type { MediaAsset, NewsPost } from '@prisma/client'
import { parseStringArray } from './json-arrays.js'
import { mediaPublicPath } from './media-url.js'

type NewsWithCover = NewsPost & { coverMedia?: MediaAsset | null }

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
    excerpt: row.excerpt,
    body: row.body,
    date: row.dateLabel,
    author: row.author || '',
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
    author: row.author || '',
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

export const newsIncludeCover = { coverMedia: true } as const
