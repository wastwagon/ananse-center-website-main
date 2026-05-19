import type { Program } from '@prisma/client'

export function parseFeatures(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

export function mapPublicProgram(program: Program) {
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
  }
}
