import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authenticateAdmin } from '../../plugins/admin-auth.js'
import { getSiteSettings, mapSiteProfile, mapSiteSettings } from '../../lib/site-settings.js'
import { prisma } from '../../lib/prisma.js'

const patchSchema = z.object({
  maintenanceMode: z.boolean().optional(),
  maintenanceTitle: z.string().min(2).max(120).optional(),
  maintenanceMessage: z.string().min(10).max(2000).optional(),
  siteName: z.string().min(2).max(200).optional(),
  siteShortName: z.string().min(2).max(80).optional(),
  siteTagline: z.string().min(2).max(160).optional(),
  siteLocation: z.string().min(2).max(160).optional(),
  contactPhone: z.string().min(3).max(40).optional(),
  contactPhoneHref: z.string().min(3).max(80).optional(),
  contactEmail: z.string().email().optional(),
  programsEmail: z.string().email().optional(),
  contactHours: z.string().min(2).max(160).optional(),
  contactAddress: z.string().min(5).max(2000).optional(),
  impactStats: z
    .array(
      z.object({
        value: z.string().min(1).max(40),
        label: z.string().min(1).max(80),
      }),
    )
    .min(1)
    .max(8)
    .optional(),
  socialFacebook: z.string().url().optional(),
  socialInstagram: z.string().url().optional(),
  socialYoutube: z.string().url().optional(),
  socialTwitter: z.string().url().optional(),
})

export async function adminSettingsRoutes(app: FastifyInstance) {
  const guard = { preHandler: [authenticateAdmin] }

  app.get('/api/v1/admin/settings', guard, async () => {
    const settings = await getSiteSettings()
    return {
      data: {
        ...mapSiteSettings(settings),
        ...mapSiteProfile(settings),
      },
    }
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

    return {
      data: {
        ...mapSiteSettings(updated),
        ...mapSiteProfile(updated),
      },
    }
  })
}
