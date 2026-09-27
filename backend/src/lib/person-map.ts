import type { MediaAsset, Person } from '@prisma/client'
import { parseStringArray } from './json-arrays.js'
import { mediaPublicPath } from './media-url.js'

type ProgramLink = { program: { id: string; slug: string; title: string } }
type EventRoleLink = {
  role: string
  event: {
    id: string
    slug: string
    title: string
    dateLabel: string
    published: boolean
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
  programs: { include: { program: { select: { id: true, slug: true, title: true } } } },
} as const

export const personIncludeDetail = {
  ...personIncludeMedia,
  eventRoles: {
    include: {
      event: {
        select: { id: true, slug: true, title: true, dateLabel: true, published: true },
      },
    },
  },
  insights: {
    where: { published: true },
    select: { id: true, slug: true, title: true, dateLabel: true, contentType: true },
    orderBy: { createdAt: 'desc' as const },
    take: 12,
  },
} as const

export function mapPublicPerson(row: PersonWithMedia) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    roleTitle: row.roleTitle,
    bio: row.bio,
    groups: parseStringArray(row.groups),
    isOrganization: row.isOrganization,
    organizationName: row.organizationName,
    expertise: row.expertise,
    cohortLabel: row.cohortLabel,
    programs: (row.programs ?? []).map((link) => link.program),
    events: (row.eventRoles ?? [])
      .filter((link) => link.event.published)
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
  }
}

export function mapAdminPerson(row: PersonWithMedia) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    roleTitle: row.roleTitle,
    bio: row.bio,
    groups: parseStringArray(row.groups),
    isOrganization: row.isOrganization,
    organizationName: row.organizationName,
    expertise: row.expertise,
    cohortLabel: row.cohortLabel,
    programIds: (row.programs ?? []).map((link) => link.program.id),
    websiteUrl: row.websiteUrl,
    photoMediaId: row.photoMediaId,
    logoMediaId: row.logoMediaId,
    photoImageUrl: row.photoMedia ? mediaPublicPath(row.photoMedia.id) : null,
    logoImageUrl: row.logoMedia ? mediaPublicPath(row.logoMedia.id) : null,
    featured: row.featured,
    published: row.published,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}
