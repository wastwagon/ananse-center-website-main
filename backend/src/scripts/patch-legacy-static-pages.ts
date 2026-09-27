/**
 * Overwrite legacy arts-era ContentBlock bodies for static roadmap keys
 * when the stored copy still contains Akatakyiwa / arts framing.
 * New bodies come from CONTENT_REGISTRY (lib/cms/static-pages.ts sync).
 */
import { PrismaClient } from '@prisma/client'
import { CONTENT_REGISTRY } from '../cms/registry.js'

const PATCH_KEYS = [
  'community.spotlights',
  'visit.directions',
  'visit.lead',
  'resources.entries',
  'news.items',
  'trustees.members',
] as const

const LEGACY_MARKERS = [
  'Akatakyiwa',
  'Ananse Center for Arts and Culture',
  'Arts and Culture',
  'restorative arts',
  'Restorative arts',
  'Trustee Circle',
  'youth arts',
  'artist residencies',
  'Kente Collective',
  'Storytelling Circle',
  'Kente Weaving',
  'permanent campus',
  'Central Region, Ghana',
  'weaving studio',
]

function looksLegacy(body: string): boolean {
  return LEGACY_MARKERS.some((m) => body.includes(m))
}

async function main() {
  const prisma = new PrismaClient()
  const updated: string[] = []
  const skipped: string[] = []
  const missing: string[] = []

  for (const key of PATCH_KEYS) {
    const entry = CONTENT_REGISTRY[key as keyof typeof CONTENT_REGISTRY]
    if (!entry) {
      console.warn(`No registry entry for ${key}`)
      continue
    }
    const row = await prisma.contentBlock.findUnique({ where: { key } })
    if (!row) {
      missing.push(key)
      continue
    }
    if (!looksLegacy(row.body)) {
      skipped.push(key)
      continue
    }
    await prisma.contentBlock.update({
      where: { key },
      data: { body: entry.defaultBody, format: entry.format ?? row.format },
    })
    updated.push(key)
  }

  console.log(
    JSON.stringify(
      {
        patchedCount: updated.length,
        updated,
        skippedCount: skipped.length,
        skipped,
        missing,
      },
      null,
      2,
    ),
  )
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
