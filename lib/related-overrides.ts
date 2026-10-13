export type RelatedOverrides = {
  insights?: string[]
  library?: string[]
  events?: string[]
  albums?: string[]
  people?: string[]
}

export function mergeRelatedSlugs(
  automatic: string[],
  pinned: string[] | undefined,
  hidden: string[] | undefined,
  limit = 6,
) {
  const hide = new Set((hidden ?? []).map((slug) => slug.trim()).filter(Boolean))
  const pin = (pinned ?? []).map((slug) => slug.trim()).filter(Boolean).filter((slug) => !hide.has(slug))
  const rest = automatic.filter((slug) => !hide.has(slug) && !pin.includes(slug))
  return [...pin, ...rest].slice(0, limit)
}

export function orderBySlugs<T extends { slug: string }>(items: T[], slugs: string[]) {
  const bySlug = new Map(items.map((item) => [item.slug, item]))
  return slugs.map((slug) => bySlug.get(slug)).filter((item): item is T => Boolean(item))
}

/** Apply pin/hide overrides to related-item lists (automatic + optional pinned extras). */
export function applyRelatedItems<T extends { slug: string }>(
  automatic: T[],
  pinnedSlugs: string[] | undefined,
  hiddenSlugs: string[] | undefined,
  pinnedExtras: T[] = [],
  limit = 6,
): T[] {
  const bySlug = new Map<string, T>()
  for (const item of [...pinnedExtras, ...automatic]) {
    bySlug.set(item.slug, item)
  }
  const ordered = mergeRelatedSlugs(
    automatic.map((item) => item.slug),
    pinnedSlugs,
    hiddenSlugs,
    limit,
  )
  return ordered.map((slug) => bySlug.get(slug)).filter((item): item is T => Boolean(item))
}
