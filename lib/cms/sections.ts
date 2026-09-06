/** Parse section visibility JSON; missing keys default to visible. */
export function parseSectionVisibility(
  raw: string | undefined,
  fallback: Record<string, boolean> = {},
): Record<string, boolean> {
  if (!raw?.trim()) return { ...fallback }
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { ...fallback }
    }
    const out = { ...fallback }
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === 'boolean') out[key] = value
    }
    return out
  } catch {
    return { ...fallback }
  }
}

export function isSectionVisible(
  visibility: Record<string, boolean>,
  key: string,
  defaultVisible = true,
): boolean {
  if (key in visibility) return visibility[key] !== false
  return defaultVisible
}

export const DEFAULT_HOME_SECTIONS: Record<string, boolean> = {
  globalBand: true,
  journey: true,
  story: true,
  pillars: true,
  programs: true,
  events: true,
  testimonials: true,
  sectors: true,
  cta: true,
}

export const DEFAULT_ABOUT_SECTIONS: Record<string, boolean> = {
  whoWeAre: true,
  missionVision: true,
  timeline: true,
  team: true,
  philosophy: true,
  approach: true,
  impact: true,
  cta: true,
}

export const DEFAULT_PROGRAMS_SECTIONS: Record<string, boolean> = {
  benefits: true,
  catalog: true,
  testimonials: true,
  cta: true,
}

export const DEFAULT_EVENTS_SECTIONS: Record<string, boolean> = {
  featured: true,
  calendar: true,
  highlights: true,
  newsletter: true,
  cta: true,
}

export const DEFAULT_SUPPORT_SECTIONS: Record<string, boolean> = {
  donation: true,
  otherWays: true,
  transparency: true,
  standards: true,
  donate: true,
  cta: true,
}
