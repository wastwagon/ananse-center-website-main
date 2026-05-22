import type { FastifyInstance } from 'fastify'
import { formRateLimit } from '../lib/rate-limit-route.js'
import { prisma } from '../lib/prisma.js'

export async function registrationRoutes(app: FastifyInstance) {
  app.post<{
    Body: {
      eventSlug?: string
      eventTitle?: string
      name?: string
      email?: string
      phone?: string
      notes?: string
    }
  }>('/api/v1/events/register', formRateLimit(), async (request, reply) => {
    const { eventSlug = '', eventTitle = '', name, email, phone = '', notes = '' } = request.body ?? {}

    if (!name?.trim() || !email?.trim()) {
      return reply.status(400).send({ error: 'Name and email are required' })
    }

    const row = await prisma.eventRegistration.create({
      data: {
        eventSlug: eventSlug.trim(),
        eventTitle: eventTitle.trim(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        notes: notes.trim(),
      },
    })

    return {
      data: {
        id: row.id,
        message: 'Thank you — we will confirm your registration by email.',
      },
    }
  })
}
