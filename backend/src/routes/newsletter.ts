import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { formRateLimit } from '../lib/rate-limit-route.js'
import { notifyStaff } from '../lib/staff-notify.js'
import { subscribeAddress, unsubscribeByToken } from '../lib/newsletter-mail.js'

const subscribeSchema = z.object({
  email: z.string().trim().email().max(254),
})

const unsubscribeSchema = z.object({
  token: z.string().trim().min(16).max(128),
})

export async function newsletterRoutes(app: FastifyInstance) {
  app.post('/api/v1/newsletter/subscribe', formRateLimit(), async (request, reply) => {
    const parsed = subscribeSchema.safeParse(request.body)

    if (!parsed.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors,
      })
    }

    const email = parsed.data.email.toLowerCase()
    const result = await subscribeAddress(email)

    if (!result.alreadyActive) {
      void notifyStaff('newsletter.subscribed', { id: result.row.id, email: result.row.email })
    }

    const message = result.alreadyActive
      ? 'This address is already subscribed.'
      : result.emailed
        ? 'You are subscribed. A confirmation is on its way.'
        : 'You are subscribed. A confirmation email is sent when mail delivery is configured.'

    return reply.status(result.alreadyActive ? 200 : 201).send({
      ok: true,
      alreadySubscribed: result.alreadyActive,
      emailed: result.emailed,
      message,
    })
  })

  app.post('/api/v1/newsletter/unsubscribe', formRateLimit(), async (request, reply) => {
    const parsed = unsubscribeSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'A valid unsubscribe link is required.' })
    }

    const result = await unsubscribeByToken(parsed.data.token)
    if (!result.ok) {
      return reply.status(404).send({ error: 'This unsubscribe link is no longer valid.' })
    }

    return { ok: true, message: 'You are unsubscribed. We will not send further updates to this address.' }
  })
}
