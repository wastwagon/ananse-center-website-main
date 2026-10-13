import type { MediaAsset, Person } from '@prisma/client'
import { parseStringArray } from './json-arrays.js'
import { mediaPublicPath } from './media-url.js'
import { parseRelatedOverrides } from './related-overrides.js'
import { isPubliclyVisible, publicVisibilityWhere, statusFromPublished } from './publication.js'

type ProgramLink = {
  program: {
    id: string
    slug: string
    title: string
    published: boolean
    publicationStatus: string
    scheduledAt: Date | null
  }
}
type EventRoleLink = {
  role: string
  event: {
    id: string
    slug: string
    title: string
    dateLabel: string
    published: boolean
    publicationStatus: string
    scheduledAt: Date | null
  }
}
type InsightLink = { id: string; slug: string; title: string; dateLabel: string; contentType: string }

type PersonWithMedia = Person & {
  photoMedia?: MediaAsset | null
  logoMedia?: MediaAsset | null
  programs?: ProgramLink[]
  eventRoles?: EventRoleLink[]
  insights?: InsightLink[]
}

export const personIncludeMedia = {
  photoMedia: true,
  logoMedia: true,
  programs: {
    include: {
      program: {
        select: {
          id: true,
          slug: true,
          title: true,
          published: true,
          publicationStatus: true,
          scheduledAt: true,
        },
      },
    },
  },
} as const

export const personIncludeDetail = {
  ...personIncludeMedia,
  eventRoles: {
    include: {
      event: {
        select: {
          id: true,
          slug: true,
          title: true,
          dateLabel: true,
          published: true,
          publicationStatus: true,
          scheduledAt: true,
        },
      },
    },
  },
  insights: {
    where: publicVisibilityWhere(),
    select: { id: true, slug: true, title: true, dateLabel: true, contentType: true },
    orderBy: { createdAt: 'desc' as const },
    take: 12,
  },
} as const

export function mapPublicPerson(row: PersonWithMedia) {
  return {
    id: row.id,
    name: row.name,
    preferredName: row.preferredName,
    displayName: row.preferredName.trim() || row.name,
    slug: row.slug,
    roleTitle: row.roleTitle,
    bio: row.bio,
    fullBio: row.fullBio,
    socialLinks: row.socialLinks,
    photoAlt: row.photoMedia?.altText?.trim() || row.preferredName.trim() || row.name,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    groups: parseStringArray(row.groups),
    isOrganization: row.isOrganization,
    organizationName: row.organizationName,
    expertise: row.expertise,
    expertiseTopics: parseStringArray(row.expertiseTopics),
    keywords: row.keywords,
    noindex: row.noindex,
    shareImageUrl: row.shareMediaId ? mediaPublicPath(row.shareMediaId) : null,
    cohortLabel: row.cohortLabel,
    programs: (row.programs ?? [])
      .filter((link) => isPubliclyVisible(link.program))
      .map((link) => ({
        id: link.program.id,
        slug: link.program.slug,
        title: link.program.title,
      })),
    events: (row.eventRoles ?? [])
      .filter((link) => isPubliclyVisible(link.event))
      .map((link) => ({
        id: link.event.id,
        slug: link.event.slug,
        title: link.event.title,
        date: link.event.dateLabel,
        role: link.role,
      })),
    insights: (row.insights ?? []).map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      date: item.dateLabel,
      contentType: item.contentType,
    })),
    websiteUrl: row.websiteUrl.trim() || null,
    photoImageUrl: row.photoMedia ? mediaPublicPath(row.photoMedia.id) : null,
    logoImageUrl: row.logoMedia ? mediaPublicPath(row.logoMedia.id) : null,
    featured: row.featured,
    publicationStatus: row.publicationStatus || statusFromPublished(row.published),
    scheduledAt: row.scheduledAt?.toISOString() ?? null,
    relatedPinned: parseRelatedOverrides(row.relatedPinned),
    relatedHidden: parseRelatedOverrides(row.relatedHidden),
  }
}

export function mapAdminPerson(row: PersonWithMedia) {
  return {
    id: row.id,
    name: row.name,
    preferredName: row.preferredName,
    slug: row.slug,
    roleTitle: row.roleTitle,
    bio: row.bio,
    fullBio: row.fullBio,
    consentConfirmed: row.consentConfirmed,
    socialLinks: row.socialLinks,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    groups: parseStringArray(row.groups),
    isOrganization: row.isOrganization,
    organizationName: row.organizationName,
    expertise: row.expertise,
    expertiseTopics: parseStringArray(row.expertiseTopics),
    keywords: row.keywords,
    noindex: row.noindex,
    shareMediaId: row.shareMediaId,
    cohortLabel: row.cohortLabel,
    programIds: (row.programs ?? []).map((link) => link.program.id),
    websiteUrl: row.websiteUrl,
    photoMediaId: row.photoMediaId,
    logoMediaId: row.logoMediaId,
    photoImageUrl: row.photoMedia ? mediaPublicPath(row.photoMedia.id) : null,
    logoImageUrl: row.logoMedia ? mediaPublicPath(row.logoMedia.id) : null,
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
