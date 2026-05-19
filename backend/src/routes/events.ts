import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

export async function eventRoutes(app: FastifyInstance) {
  app.get('/api/v1/events', async () => {
    const events = await prisma.event.findMany({
      where: { published: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })

    return {
      data: events.map((event) => ({
        id: event.id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        date: event.dateLabel,
        location: event.location,
        type: event.type,
        image: event.imageEmoji,
        featured: event.featured,
      })),
    }
  })

  app.get<{ Params: { slug: string } }>('/api/v1/events/:slug', async (request, reply) => {
    const event = await prisma.event.findFirst({
      where: { slug: request.params.slug, published: true },
    })

    if (!event) {
      return reply.status(404).send({ error: 'Event not found' })
    }

    return {
      data: {
        id: event.id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        date: event.dateLabel,
        location: event.location,
        type: event.type,
        image: event.imageEmoji,
        featured: event.featured,
      },
    }
  })
}
