import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

export async function communityRoutes(app: FastifyInstance) {
  app.post<{
    Body: { type?: string; name?: string; email?: string; title?: string; body?: string }
  }>('/api/v1/community/submit', async (request, reply) => {
    const { type = 'story', name, email, title, body } = request.body ?? {}

    if (!name?.trim() || !email?.trim() || !title?.trim() || !body?.trim()) {
      return reply.status(400).send({ error: 'Name, email, title, and story are required' })
    }

    const row = await prisma.communitySubmission.create({
      data: {
        type: type === 'spotlight' ? 'spotlight' : 'story',
        name: name.trim(),
        email: email.trim().toLowerCase(),
        title: title.trim(),
        body: body.trim(),
      },
    })

    return {
      data: {
        id: row.id,
        message: 'Thank you — your submission is pending review by our team.',
      },
    }
  })
}
