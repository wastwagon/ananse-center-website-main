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
    linkedin: string
    whatsapp: string
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

function preferLeadershipIdentity(profile: PublicSiteProfile): PublicSiteProfile {
  const artsName = /arts and culture/i.test(profile.site.name)
  const artsPlace = /akatakyiwa/i.test(profile.site.location) || /akatakyiwa/i.test(profile.contact.address)
  if (!artsName && !artsPlace) {
    return {
      ...profile,
      social: {
        linkedin: '',
        whatsapp: '',
        ...profile.social,
      },
    }
  }
  return {
    ...profile,
    site: {
      name: artsName ? staticSite.name : profile.site.name,
      shortName: artsName ? staticSite.shortName : profile.site.shortName,
      tagline: artsName || /weaving wisdom/i.test(profile.site.tagline) ? staticSite.tagline : profile.site.tagline,
      location: artsPlace ? staticSite.location : profile.site.location,
    },
    contact: {
      ...profile.contact,
      address: artsPlace || artsName ? staticSite.address : profile.contact.address,
    },
    social: {
      linkedin: '',
      whatsapp: '',
      ...profile.social,
    },
  }
}

export async function getPublicSiteProfile(): Promise<PublicSiteProfile> {
  try {
    const response = await fetch(`${getServerApiUrl()}/api/v1/site/profile`, {
      next: { revalidate: 60 },
    })
    if (!response.ok) return STATIC_PROFILE
    const payload = (await response.json()) as { data: PublicSiteProfile }
    return preferLeadershipIdentity(payload.data ?? STATIC_PROFILE)
  } catch {
    return STATIC_PROFILE
  }
}
