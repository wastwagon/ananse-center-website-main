import type { FastifyInstance } from 'fastify'
import { authenticateAdmin } from '../../plugins/admin-auth.js'
import { prisma } from '../../lib/prisma.js'
import { getSiteSettings, mapSiteSettings } from '../../lib/site-settings.js'

export async function adminDashboardRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/admin/dashboard',
    { preHandler: [authenticateAdmin] },
    async () => {
      const [events, publishedEvents, messages, newMessages, donations, paidDonations, settings] =
        await Promise.all([
          prisma.event.count(),
          prisma.event.count({ where: { published: true } }),
          prisma.contactMessage.count(),
          prisma.contactMessage.count({ where: { status: 'new' } }),
          prisma.donation.count(),
          prisma.donation.count({ where: { status: 'success' } }),
          getSiteSettings(),
        ])

      return {
        data: {
          events: { total: events, published: publishedEvents },
          contactMessages: { total: messages, new: newMessages },
          donations: { total: donations, successful: paidDonations },
          site: mapSiteSettings(settings),
        },
      }
    },
  )
}
