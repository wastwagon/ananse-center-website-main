import { impactStats as staticImpactStats, site } from './site'

export type ImpactStat = {
  value: string
  label: string
}

export const DEFAULT_IMPACT_STATS: ImpactStat[] = [...staticImpactStats]

export const DEFAULT_CONTACT_ADDRESS = site.address
