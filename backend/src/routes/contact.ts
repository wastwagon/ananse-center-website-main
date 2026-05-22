import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { formRateLimit } from '../lib/rate-limit-route.js'
import { prisma } from '../lib/prisma.js'
import { notifyCrmWebhook } from '../lib/crm-webhook.js'

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
})

export async function contactRoutes(app: FastifyInstance) {
  app.post('/api/v1/contact', formRateLimit(), async (request, reply) => {
    const parsed = contactSchema.safeParse(request.body)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    const message = await prisma.contactMessage.create({
      data: parsed.data,
    })

    void notifyCrmWebhook('contact.created', {
      id: message.id,
      name: message.name,
      email: message.email,
      subject: message.subject,
    })

    return reply.status(201).send({
      ok: true,
      id: message.id,
      message: 'Thank you. We received your message and will respond soon.',
    })
  })
}
