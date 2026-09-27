import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'
import { prisma } from '../../lib/prisma.js'
import { smtpConfigured } from '../../lib/mail.js'
import { sendNewsletterIssue } from '../../lib/newsletter-mail.js'

const sendSchema = z.object({
  subject: z.string().trim().min(3).max(140),
  body: z.string().trim().min(10).max(20000),
})

export async function adminNewsletterRoutes(app: FastifyInstance) {
  const readGuard = { preHandler: [withAdminRoles(['superadmin', 'admin', 'editor'])] }
  const sendGuard = { preHandler: [withAdminRoles(['superadmin', 'admin'])] }

  app.get('/api/v1/admin/newsletter/subscribers', readGuard, async () => {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return {
      smtpConfigured: smtpConfigured(),
      data: subscribers.map((row) => ({
        id: row.id,
        email: row.email,
        status: row.status,
        createdAt: row.createdAt.toISOString(),
        unsubscribedAt: row.unsubscribedAt?.toISOString() ?? null,
      })),
    }
  })

  app.post('/api/v1/admin/newsletter/send', sendGuard, async (request, reply) => {
    const parsed = sendSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Add a subject and a message before sending.',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    const result = await sendNewsletterIssue(parsed.data.subject, parsed.data.body)
    if (!result.ok) {
      return reply.status(503).send({ error: result.error })
    }

    return {
      ok: true,
      sent: result.sent,
      failed: result.failed,
      recipients: result.recipients,
    }
  })
}
