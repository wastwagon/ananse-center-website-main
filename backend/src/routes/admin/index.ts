import type { FastifyInstance } from 'fastify'
import { adminAuthRoutes } from './auth.js'
import { adminEventRoutes } from './events.js'
import { adminProgramRoutes } from './programs.js'
import { adminContactRoutes } from './contact.js'
import { adminDonationRoutes } from './donations.js'
import { adminSettingsRoutes } from './settings.js'
import { adminSystemRoutes } from './system.js'
import { adminContentRoutes } from './content.js'
import { adminDashboardRoutes } from './dashboard.js'
import { adminNewsletterRoutes } from './newsletter.js'
import { adminMediaRoutes } from './media.js'
import { adminInboxRoutes } from './inbox.js'
import { adminArchiveRoutes } from './archives.js'
import { adminExportRoutes } from './export.js'
import { adminUserRoutes } from './users.js'
import { adminNewsRoutes } from './news.js'

export async function adminRoutes(app: FastifyInstance) {
  await app.register(adminAuthRoutes)
  await app.register(adminDashboardRoutes)
  await app.register(adminSettingsRoutes)
  await app.register(adminSystemRoutes)
  await app.register(adminContentRoutes)
  await app.register(adminEventRoutes)
  await app.register(adminProgramRoutes)
  await app.register(adminContactRoutes)
  await app.register(adminDonationRoutes)
  await app.register(adminNewsletterRoutes)
  await app.register(adminMediaRoutes)
  await app.register(adminInboxRoutes)
  await app.register(adminArchiveRoutes)
  await app.register(adminNewsRoutes)
  await app.register(adminExportRoutes)
  await app.register(adminUserRoutes)
}
