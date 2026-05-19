import { CONTENT_REGISTRY, type ContentKey } from './registry'
import { getServerApiUrl } from '../server-api-url'

export type { ContentKey, ContentRegistryEntry } from './registry'
export {
  CONTENT_REGISTRY,
  CONTENT_KEYS,
  DEFAULT_ABOUT_APPROACH,
  DEFAULT_ABOUT_IMPACT_METRICS,
  DEFAULT_ABOUT_PHILOSOPHY,
  DEFAULT_ABOUT_HERO_CTA_PRIMARY,
  DEFAULT_ABOUT_HERO_CTA_SECONDARY,
  DEFAULT_ABOUT_HERO_STATS,
  DEFAULT_ABOUT_HERO_TITLE,
  DEFAULT_CONTACT_HERO_CTA_PRIMARY,
  DEFAULT_CONTACT_HERO_CTA_SECONDARY,
  DEFAULT_CONTACT_HERO_STATS,
  DEFAULT_CONTACT_HERO_TITLE,
  DEFAULT_EVENTS_HERO_CTA_PRIMARY,
  DEFAULT_EVENTS_HERO_CTA_SECONDARY,
  DEFAULT_EVENTS_HERO_STATS,
  DEFAULT_EVENTS_HERO_TITLE,
  DEFAULT_HOME_HERO_CTA_PRIMARY,
  DEFAULT_HOME_HERO_CTA_SECONDARY,
  DEFAULT_HOME_HERO_STATS,
  DEFAULT_HOME_HERO_TITLE,
  DEFAULT_HOME_PILLARS,
  DEFAULT_HOME_SECTORS,
  DEFAULT_HOME_TESTIMONIALS,
  DEFAULT_HOME_STORY_HIGHLIGHTS,
  DEFAULT_SUPPORT_DONATE_PRESETS,
  DEFAULT_SUPPORT_DONATION_TIERS,
  DEFAULT_SUPPORT_OTHER_WAYS,
  DEFAULT_SUPPORT_STANDARDS_ITEMS,
  DEFAULT_SUPPORT_TRANSPARENCY_ALLOCATION,
  DEFAULT_EVENTS_FILTER_CATEGORIES,
  DEFAULT_EVENTS_HIGHLIGHTS_METRICS,
  DEFAULT_EVENTS_HIGHLIGHTS_TESTIMONIAL,
  DEFAULT_PROGRAMS_HERO_CTA_PRIMARY,
  DEFAULT_PROGRAMS_HERO_CTA_SECONDARY,
  DEFAULT_PROGRAMS_HERO_STATS,
  DEFAULT_PROGRAMS_HERO_TITLE,
  DEFAULT_SUPPORT_HERO_CTA_PRIMARY,
  DEFAULT_SUPPORT_HERO_CTA_SECONDARY,
  DEFAULT_SUPPORT_HERO_STATS,
  DEFAULT_SUPPORT_HERO_TITLE,
  DEFAULT_VIDEOS_HERO_CTA_PRIMARY,
  DEFAULT_VIDEOS_HERO_CTA_SECONDARY,
  DEFAULT_VIDEOS_HERO_STATS,
  DEFAULT_VIDEOS_HERO_TITLE,
  DEFAULT_VIDEOS_ITEMS,
  isContentKey,
  type CmsApproachStep,
  type CmsDonatePreset,
  type CmsDonationTier,
  type CmsEventTestimonial,
  type CmsHeroCta,
  type CmsHeroStat,
  type CmsHeroTitle,
  type CmsHomeHeroTitle,
  type CmsLabeledValue,
  type CmsPhilosophyCard,
  type CmsPillar,
  type CmsSector,
  type CmsStoryHighlight,
  type CmsSupportWay,
  type CmsTestimonial,
  type CmsVideoItem,
} from './registry'
export { parseCmsJson } from './parse'

export async function fetchSiteContentMap(): Promise<Record<string, string>> {
  try {
    const response = await fetch(`${getServerApiUrl()}/api/v1/site/content`, {
      next: { revalidate: 30 },
    })
    if (!response.ok) return {}
    const payload = (await response.json()) as { data: Record<string, string> }
    return payload.data ?? {}
  } catch {
    return {}
  }
}

/** Resolved CMS text: database value when published, otherwise registry default. */
export async function getCmsText(key: ContentKey): Promise<string> {
  const map = await fetchSiteContentMap()
  const fromDb = map[key]?.trim()
  if (fromDb) return fromDb
  return CONTENT_REGISTRY[key].defaultBody
}

/** Multiple keys in one request (e.g. home page). */
export async function getCmsTexts<K extends ContentKey>(
  keys: readonly K[],
): Promise<Record<K, string>> {
  const map = await fetchSiteContentMap()
  const out = {} as Record<K, string>
  for (const key of keys) {
    const fromDb = map[key]?.trim()
    out[key] = fromDb || CONTENT_REGISTRY[key].defaultBody
  }
  return out
}

/** Split a block with blank lines into paragraphs. */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}
