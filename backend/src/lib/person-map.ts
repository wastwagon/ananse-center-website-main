import type { MediaAsset, Person } from '@prisma/client'
import { parseStringArray } from './json-arrays.js'
import { mediaPublicPath } from './media-url.js'

type PersonWithMedia = Person & {
  photoMedia?: MediaAsset | null
  logoMedia?: MediaAsset | null
}

export const personIncludeMedia = {
  photoMedia: true,
  logoMedia: true,
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
