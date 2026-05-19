import { site as staticSite, contact as staticContact, social as staticSocial } from './site'
import { DEFAULT_CONTACT_ADDRESS, DEFAULT_IMPACT_STATS, type ImpactStat } from './site-impact'
import { getServerApiUrl } from './server-api-url'

export type { ImpactStat }

export type PublicSiteProfile = {
  site: {
    name: string
    shortName: string
    tagline: string
    location: string
  }
  contact: {
    phone: string
    phoneHref: string
    email: string
    programsEmail: string
    hours: string
    address: string
  }
  impactStats: ImpactStat[]
  social: {
    facebook: string
    instagram: string
    youtube: string
    twitter: string
  }
}

const STATIC_PROFILE: PublicSiteProfile = {
  site: {
    name: staticSite.name,
    shortName: staticSite.shortName,
    tagline: staticSite.tagline,
    location: staticSite.location,
  },
  contact: {
    ...staticContact,
    address: DEFAULT_CONTACT_ADDRESS,
  },
  impactStats: DEFAULT_IMPACT_STATS,
  social: { ...staticSocial },
}

export async function getPublicSiteProfile(): Promise<PublicSiteProfile> {
  try {
    const response = await fetch(`${getServerApiUrl()}/api/v1/site/profile`, {
      next: { revalidate: 60 },
    })
    if (!response.ok) return STATIC_PROFILE
    const payload = (await response.json()) as { data: PublicSiteProfile }
    return payload.data ?? STATIC_PROFILE
  } catch {
    return STATIC_PROFILE
  }
}
