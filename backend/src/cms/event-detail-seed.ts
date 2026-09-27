/** Long-form event detail copy — seeded into Event rows (not duplicated on the public site). */
export type EventDetailSeed = {
  venue: string
  storyTitle: string
  storyBody: string
  highlights: string[]
}

/** Leadership events are authored in Admin/CMS; demo preview uses `seed-demo-preview.ts`. */
export const EVENT_DETAIL_SEED: Record<string, EventDetailSeed> = {}
