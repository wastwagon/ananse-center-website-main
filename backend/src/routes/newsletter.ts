import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { notifyCrmWebhook } from '../lib/crm-webhook.js'

const subscribeSchema = z.object({
  email: z.string().trim().email().max(254),
})

export async function newsletterRoutes(app: FastifyInstance) {
  app.post('/api/v1/newsletter/subscribe', async (request, reply) => {
    const parsed = subscribeSchema.safeParse(request.body)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    const email = parsed.data.email.toLowerCase()

    const row = await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email },
      update: {},
    })

    void notifyCrmWebhook('newsletter.subscribed', { id: row.id, email: row.email })

    return reply.status(201).send({
      ok: true,
      message: 'You are subscribed to event updates.',
    })
  })
}
