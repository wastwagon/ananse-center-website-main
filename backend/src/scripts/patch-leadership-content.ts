/**
 * Patch ContentBlock rows that still contain legacy arts-and-culture CMS copy.
 * New bodies are taken from CONTENT_REGISTRY defaults (Phase A leadership polish).
 */
import { PrismaClient } from '@prisma/client'
import { CONTENT_REGISTRY } from '../cms/registry.js'

/** Keys updated in Phase A — patch when body still looks like arts-era defaults. */
const PATCH_KEYS = [
  'home.hero.lead',
  'home.hero.trust',
  'home.hero.imageAlt',
  'home.hero.title',
  'home.hero.stats',
  'home.hero.cta.primary',
  'home.hero.cta.secondary',
  'home.story',
  'home.programs.badge',
  'home.programs.lead',
  'home.events.lead',
  'home.sectors.lead',
  'home.testimonials',
  'about.hero.lead',
  'about.mission',
  'about.mission.continuation',
  'about.whoWeAre.body',
  'about.whoWeAre.focusAreas',
  'about.whoWeAre.teamCta',
  'about.hero.imageAlt',
  'about.timeline.lead',
  'about.timeline',
  'about.team.lead',
  'about.team',
  'about.hero.stats',
  'about.vision',
  'about.philosophy.heading',
  'about.impact.cardBadge',
  'about.cta.body',
  'programs.hero.lead',
  'programs.benefits',
  'programs.testimonials',
  'programs.cta.body',
  'events.hero.lead',
  'events.newsletter.lead',
  'events.hero.imageAlt',
  'events.highlights.badge',
  'support.hero.lead',
  'support.hero.stats',
  'support.impact.lead',
  'support.cta.body',
  'site.nav.primary',
  'site.footer.quickLinks',
  'site.footer.programLinks',
  'site.nav.mobile',
  'site.nav.sheet',
  'site.globalBand.body',
  'contact.hero.stats',
  'programs.hero.stats',
] as const

const LEGACY_MARKERS = [
  'Akatakyiwa',
  'Ananse Center for Arts and Culture',
  'arts and culture organization',
  'Preserving Africa',
  'Meet Our Trustees',
  'restorative arts',
  'Restorative arts',
  'Traditional Arts',
  'Music & Rhythm',
  'youth arts',
  'students, artists',
  'learners, artists',
  'artists, and youth',
  'cultural education',
  'artist residencies',
  'Sankofa Programs',
  'Weaving wisdom into',
  'Empowering African communities through Sankofa-inspired',
]

function looksLegacy(body: string): boolean {
  if (LEGACY_MARKERS.some((m) => body.includes(m))) return true
  if (body.includes('/trustees') && body.includes('Meet Our')) return true
  if (/"Videos"/.test(body) && body.trimStart().startsWith('[')) return true
  if (body.includes('Traditional Arts & Crafts')) return true
  // Long hero pillar labels that clip in the 2026 layout
  if (body.includes('Integrity, responsibility, courage')) return true
  if (body.includes('Judgment for what matters')) return true
  if (body.includes('Influence used for others')) return true
  return false
}

async function main() {
  const prisma = new PrismaClient()
  const updated: string[] = []
  const unchanged: string[] = []
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
      unchanged.push(key)
      continue
    }
    await prisma.contentBlock.update({
      where: { key },
      data: { body: entry.defaultBody },
    })
    updated.push(key)
  }

  console.log(
    JSON.stringify(
      { updated, unchangedCount: unchanged.length, missing, unchanged },
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
