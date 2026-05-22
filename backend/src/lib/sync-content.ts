import { CONTENT_KEYS, CONTENT_REGISTRY, type ContentRegistryEntry } from '../cms/registry.js'
import { prisma } from './prisma.js'

function registryFormat(entry: ContentRegistryEntry): 'plain' | 'markdown' {
  return entry.format ?? 'plain'
}

/** Ensure every registry key exists in DB (safe on every deploy). */
export async function syncRegistryContent() {
  let created = 0
  for (const key of CONTENT_KEYS) {
    const entry = CONTENT_REGISTRY[key]
    const existing = await prisma.contentBlock.findUnique({ where: { key } })
    if (existing) continue
    await prisma.contentBlock.create({
      data: {
        key,
        label: entry.label,
        section: entry.section,
        body: entry.defaultBody,
        format: registryFormat(entry),
        published: true,
      },
    })
    created += 1
  }
  if (created > 0) {
    console.log(`[cms] Created ${created} missing content block(s) from registry`)
  }
}
