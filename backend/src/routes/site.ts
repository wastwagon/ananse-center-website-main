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
