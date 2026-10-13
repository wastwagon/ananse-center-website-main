import type { MediaAsset, Person, Program } from '@prisma/client'
import { parseStringArray } from './json-arrays.js'
import { mediaPublicPath } from './media-url.js'
import { parseRelatedOverrides } from './related-overrides.js'
import { isPubliclyVisible, statusFromPublished } from './publication.js'

export function parseFeatures(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

type LeadRef = Pick<Person, 'id' | 'slug' | 'name' | 'roleTitle'> & {
  published: boolean
  publicationStatus: string
  scheduledAt: Date | null
}

type ProgramWithCover = Program & {
  coverMedia?: MediaAsset | null
  leadPerson?: LeadRef | null
}

export function mapPublicProgram(program: ProgramWithCover) {
  return {
    id: program.id,
    slug: program.slug,
    title: program.title,
    description: program.description,
    category: program.category,
    section: program.section,
    duration: program.duration,
    level: program.level,
    iconKey: program.iconKey,
    features: parseFeatures(program.features),
    sortOrder: program.sortOrder,
    coverImageUrl: program.coverMedia ? mediaPublicPath(program.coverMedia.id) : null,
    tagline: program.tagline,
    ctaLabel: program.ctaLabel,
    ctaHref: program.ctaHref,
    topics: parseStringArray(program.topics),
    seoTitle: program.seoTitle,
    seoDescription: program.seoDescription,
    summary: program.summary,
    keywords: program.keywords,
    noindex: program.noindex,
    shareImageUrl: program.shareMediaId ? mediaPublicPath(program.shareMediaId) : null,
    lead:
      program.leadPerson && isPubliclyVisible(program.leadPerson)
        ? {
            id: program.leadPerson.id,
            slug: program.leadPerson.slug,
            name: program.leadPerson.name,
            roleTitle: program.leadPerson.roleTitle,
          }
        : null,
    publicationStatus: program.publicationStatus || statusFromPublished(program.published),
    scheduledAt: program.scheduledAt?.toISOString() ?? null,
    relatedPinned: parseRelatedOverrides(program.relatedPinned),
    relatedHidden: parseRelatedOverrides(program.relatedHidden),
  }
}

export const programIncludeCover = {
  coverMedia: true,
  leadPerson: {
    select: {
      id: true,
      slug: true,
      name: true,
      roleTitle: true,
      published: true,
      publicationStatus: true,
      scheduledAt: true,
    },
  },
} as const
