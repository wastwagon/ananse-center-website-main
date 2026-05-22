import { getServerApiUrl } from './server-api-url'

export type SiteIntegrations = {
  lmsPortalUrl: string
  googleAnalyticsId: string
  legacyRedirectHost: string
}

const defaults: SiteIntegrations = {
  lmsPortalUrl: process.env.NEXT_PUBLIC_LMS_PORTAL_URL?.trim() ?? '',
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? '',
  legacyRedirectHost: process.env.LEGACY_SITE_HOST?.trim() ?? 'anansecenter.oceancyber.site',
}

export async function getSiteIntegrations(): Promise<SiteIntegrations> {
  try {
    const response = await fetch(`${getServerApiUrl()}/api/v1/site/integrations`, {
      next: { revalidate: 60 },
    })
    if (!response.ok) return defaults
    const payload = (await response.json()) as { data: SiteIntegrations }
    const db = payload.data
    return {
      lmsPortalUrl: defaults.lmsPortalUrl || db.lmsPortalUrl,
      googleAnalyticsId: defaults.googleAnalyticsId || db.googleAnalyticsId,
      legacyRedirectHost: defaults.legacyRedirectHost || db.legacyRedirectHost,
    }
  } catch {
    return defaults
  }
}
