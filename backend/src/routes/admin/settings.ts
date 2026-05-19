import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authenticateAdmin } from '../../plugins/admin-auth.js'
import { getSiteSettings, mapSiteSettings } from '../../lib/site-settings.js'
import { prisma } from '../../lib/prisma.js'

const patchSchema = z.object({
  maintenanceMode: z.boolean().optional(),
  maintenanceTitle: z.string().min(2).max(120).optional(),
  maintenanceMessage: z.string().min(10).max(2000).optional(),
})

export async function adminSettingsRoutes(app: FastifyInstance) {
  const guard = { preHandler: [authenticateAdmin] }

  app.get('/api/v1/admin/settings', guard, async () => {
    const settings = await getSiteSettings()
    return { data: mapSiteSettings(settings) }
  })

  app.patch('/api/v1/admin/settings', guard, async (request, reply) => {
    const parsed = patchSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid settings payload' })
    }

    const settings = await getSiteSettings()
    const updated = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: parsed.data,
    })

    return { data: mapSiteSettings(updated) }
  })
}
