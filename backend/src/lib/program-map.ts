import type { MediaAsset, Program } from '@prisma/client'
import { mediaPublicPath } from './media-url.js'

export function parseFeatures(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

type ProgramWithCover = Program & { coverMedia?: MediaAsset | null }

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
  }
}

export const programIncludeCover = { coverMedia: true } as const
