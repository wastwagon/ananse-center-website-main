import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { getSiteSettings, mapSiteProfile, mapSiteSettings } from '../lib/site-settings.js'

export async function siteRoutes(app: FastifyInstance) {
  app.get('/api/v1/site/status', async () => {
    const settings = await getSiteSettings()
    return mapSiteSettings(settings)
  })

  app.get('/api/v1/site/profile', async () => {
    const settings = await getSiteSettings()
    return { data: mapSiteProfile(settings) }
  })

  app.get('/api/v1/site/integrations', async () => {
    const settings = await getSiteSettings()
    const envLms = process.env.NEXT_PUBLIC_LMS_PORTAL_URL?.trim() ?? ''
    const envGa = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? ''
    const envLegacy =
      process.env.LEGACY_SITE_HOST?.trim() ||
      process.env.NEXT_PUBLIC_LEGACY_SITE_HOST?.trim() ||
      ''
    const dbLegacy = settings.legacyRedirectHost?.trim() ?? 'anansecenter.oceancyber.site'
    return {
      data: {
        lmsPortalUrl: envLms || settings.lmsPortalUrl?.trim() || '',
        googleAnalyticsId: envGa || settings.googleAnalyticsId?.trim() || '',
        legacyRedirectHost: envLegacy || dbLegacy,
      },
    }
  })

  app.get('/api/v1/site/content', async () => {
    const blocks = await prisma.contentBlock.findMany({
      where: { published: true },
      orderBy: [{ section: 'asc' }, { label: 'asc' }],
    })

    const data: Record<string, string> = {}
    for (const block of blocks) {
      data[block.key] = block.body
    }

    return { data }
  })
}
