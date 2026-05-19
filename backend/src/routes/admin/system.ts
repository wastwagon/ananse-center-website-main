import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authenticateAdmin } from '../../plugins/admin-auth.js'
import { prisma } from '../../lib/prisma.js'
import {
  runMigrations,
  runSeed,
  systemConfirmHints,
  systemOpsAllowed,
  validateSystemConfirm,
} from '../../lib/system-ops.js'
import { getSiteSettings, mapSiteSettings } from '../../lib/site-settings.js'

const actionSchema = z.object({
  confirm: z.string().min(1),
})

export async function adminSystemRoutes(app: FastifyInstance) {
  const guard = { preHandler: [authenticateAdmin] }

  app.get('/api/v1/admin/system/status', guard, async () => {
    const [events, messages, donations, admins, settings] = await Promise.all([
      prisma.event.count(),
      prisma.contactMessage.count(),
      prisma.donation.count(),
      prisma.adminUser.count(),
      getSiteSettings(),
    ])

    return {
      data: {
        environment: process.env.NODE_ENV || 'development',
        systemOpsAllowed: systemOpsAllowed(),
        autoMigrateOnDeploy: true,
        autoSeedOnDeploy: process.env.SKIP_PRISMA_SEED !== 'true',
        confirmPhrases: systemConfirmHints,
        counts: {
          events,
          contactMessages: messages,
          donations,
          adminUsers: admins,
        },
        site: mapSiteSettings(settings),
      },
    }
  })

  app.post('/api/v1/admin/system/migrate', guard, async (request, reply) => {
    if (!systemOpsAllowed()) {
      return reply.status(403).send({
        error: 'System migrations are disabled in production. Set ADMIN_ALLOW_SYSTEM_OPS=true to enable.',
      })
    }

    const parsed = actionSchema.safeParse(request.body)
    if (!parsed.success || !validateSystemConfirm('migrate', parsed.data.confirm)) {
      return reply.status(400).send({
        error: `Confirmation required. Send { "confirm": "${systemConfirmHints.migrate}" }`,
      })
    }

    const result = await runMigrations()
    if (result.code !== 0) {
      request.log.error({ stderr: result.stderr, stdout: result.stdout })
      return reply.status(500).send({
        error: 'Migration failed',
        output: result.stderr || result.stdout,
      })
    }

    return {
      ok: true,
      message: 'Migrations applied successfully',
      output: result.stdout,
    }
  })

  app.post('/api/v1/admin/system/seed', guard, async (request, reply) => {
    if (!systemOpsAllowed()) {
      return reply.status(403).send({
        error: 'Database seeding is disabled in production. Set ADMIN_ALLOW_SYSTEM_OPS=true to enable.',
      })
    }

    const parsed = actionSchema.safeParse(request.body)
    if (!parsed.success || !validateSystemConfirm('seed', parsed.data.confirm)) {
      return reply.status(400).send({
        error: `Confirmation required. Send { "confirm": "${systemConfirmHints.seed}" }`,
      })
    }

    const result = await runSeed()
    if (result.code !== 0) {
      request.log.error({ stderr: result.stderr, stdout: result.stdout })
      return reply.status(500).send({
        error: 'Seed failed',
        output: result.stderr || result.stdout,
      })
    }

    return {
      ok: true,
      message: 'Database seeded successfully',
      output: result.stdout,
    }
  })
}
