import { DEFAULT_IMPACT_STATS, DEFAULT_SITE_PROFILE } from '../cms/site-defaults.js'

export type ImpactStat = { value: string; label: string }

export function parseImpactStats(value: unknown): ImpactStat[] {
  if (!Array.isArray(value)) return [...DEFAULT_IMPACT_STATS]
  const parsed = value
    .filter(
      (item): item is ImpactStat =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as ImpactStat).value === 'string' &&
        typeof (item as ImpactStat).label === 'string',
    )
    .map((item) => ({
      value: item.value.trim(),
      label: item.label.trim(),
    }))
    .filter((item) => item.value && item.label)
  return parsed.length > 0 ? parsed : [...DEFAULT_IMPACT_STATS]
}
import { prisma } from './prisma.js'

export const SITE_SETTINGS_ID = 'default'

export async function getSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS_ID },
    create: {
      id: SITE_SETTINGS_ID,
      siteName: DEFAULT_SITE_PROFILE.siteName,
      siteShortName: DEFAULT_SITE_PROFILE.siteShortName,
      siteTagline: DEFAULT_SITE_PROFILE.siteTagline,
      siteLocation: DEFAULT_SITE_PROFILE.siteLocation,
      contactPhone: DEFAULT_SITE_PROFILE.contactPhone,
      contactPhoneHref: DEFAULT_SITE_PROFILE.contactPhoneHref,
      contactEmail: DEFAULT_SITE_PROFILE.contactEmail,
      programsEmail: DEFAULT_SITE_PROFILE.programsEmail,
      contactHours: DEFAULT_SITE_PROFILE.contactHours,
      contactAddress: DEFAULT_SITE_PROFILE.contactAddress,
      impactStats: [...DEFAULT_IMPACT_STATS],
      socialFacebook: DEFAULT_SITE_PROFILE.socialFacebook,
      socialInstagram: DEFAULT_SITE_PROFILE.socialInstagram,
      socialYoutube: DEFAULT_SITE_PROFILE.socialYoutube,
      socialTwitter: DEFAULT_SITE_PROFILE.socialTwitter,
      lmsPortalUrl: DEFAULT_SITE_PROFILE.lmsPortalUrl ?? '',
      googleAnalyticsId: DEFAULT_SITE_PROFILE.googleAnalyticsId ?? '',
      legacyRedirectHost: DEFAULT_SITE_PROFILE.legacyRedirectHost ?? 'anansecenter.oceancyber.site',
    },
    update: {},
  })
}

export function mapSiteIntegrations(settings: SiteSettingsRow) {
  return {
    lmsPortalUrl: settings.lmsPortalUrl?.trim() ?? '',
    googleAnalyticsId: settings.googleAnalyticsId?.trim() ?? '',
    legacyRedirectHost: settings.legacyRedirectHost?.trim() ?? 'anansecenter.oceancyber.site',
  }
}

type SiteSettingsRow = Awaited<ReturnType<typeof getSiteSettings>>

export function mapSiteSettings(settings: SiteSettingsRow) {
  return {
    maintenanceMode: settings.maintenanceMode,
    maintenanceTitle: settings.maintenanceTitle,
    maintenanceMessage: settings.maintenanceMessage,
    siteStatus: settings.maintenanceMode ? ('maintenance' as const) : ('live' as const),
    updatedAt: settings.updatedAt.toISOString(),
  }
}

export function mapSiteProfile(settings: SiteSettingsRow) {
  return {
    site: {
      name: settings.siteName,
      shortName: settings.siteShortName,
      tagline: settings.siteTagline,
      location: settings.siteLocation,
    },
    contact: {
      phone: settings.contactPhone,
      phoneHref: settings.contactPhoneHref,
      email: settings.contactEmail,
      programsEmail: settings.programsEmail,
      hours: settings.contactHours,
      address: settings.contactAddress,
    },
    impactStats: parseImpactStats(settings.impactStats),
    social: {
      facebook: settings.socialFacebook,
      instagram: settings.socialInstagram,
      youtube: settings.socialYoutube,
      twitter: settings.socialTwitter,
    },
  }
}
