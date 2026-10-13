import { z } from 'zod'

const slugList = z.array(z.string().min(1).max(200)).max(48)

export const relatedOverridesSchema = z
  .object({
    insights: slugList.optional(),
    library: slugList.optional(),
    events: slugList.optional(),
    albums: slugList.optional(),
    people: slugList.optional(),
  })
  .passthrough()

export type RelatedOverrides = z.infer<typeof relatedOverridesSchema>

export function parseRelatedOverrides(value: unknown): RelatedOverrides {
  const parsed = relatedOverridesSchema.safeParse(value ?? {})
  return parsed.success ? parsed.data : {}
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
