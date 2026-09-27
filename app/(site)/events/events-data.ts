import type { ApiEvent } from '../../../lib/api'

/**
 * Offline fallback when the events API is unreachable.
 * Keep empty — never reintroduce arts-era sample gatherings here.
 * Live listings come from the CMS (plus demo-* preview seed when enabled).
 */
export const fallbackEvents: ApiEvent[] = []
