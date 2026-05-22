import { getSiteSettings } from './site-settings.js'
import { prisma } from './prisma.js'

/** Copy Coolify env into DB when integration fields are still empty. */
export async function syncIntegrationEnvDefaults() {
  const settings = await getSiteSettings()
  const data: {
    lmsPortalUrl?: string
    googleAnalyticsId?: string
    legacyRedirectHost?: string
  } = {}

  const lms = process.env.NEXT_PUBLIC_LMS_PORTAL_URL?.trim()
  const ga = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
  const legacy =
    process.env.LEGACY_SITE_HOST?.trim() ||
    process.env.NEXT_PUBLIC_LEGACY_SITE_HOST?.trim()

  if (!settings.lmsPortalUrl?.trim() && lms) data.lmsPortalUrl = lms
  if (!settings.googleAnalyticsId?.trim() && ga) data.googleAnalyticsId = ga
  if (!settings.legacyRedirectHost?.trim() && legacy) data.legacyRedirectHost = legacy

  if (Object.keys(data).length === 0) return

  await prisma.siteSettings.update({
    where: { id: settings.id },
    data,
  })
  console.log('[integrations] Applied env defaults to site settings')
}
