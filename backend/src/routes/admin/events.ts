import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { slugify } from '../../lib/slug.js'
import { authenticateAdmin } from '../../plugins/admin-auth.js'

const eventBodySchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10),
  dateLabel: z.string().min(2).max(120),
  location: z.string().min(2).max(200),
  type: z.string().min(2).max(80),
  imageEmoji: z.string().min(1).max(8).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  slug: z.string().min(2).max(200).optional(),
})

function mapEvent(event: {
  id: string
  title: string
  slug: string
  description: string
  dateLabel: string
  location: string
  type: string
  imageEmoji: string
  featured: boolean
  published: boolean
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    dateLabel: event.dateLabel,
    location: event.location,
    type: event.type,
    imageEmoji: event.imageEmoji,
    featured: event.featured,
    published: event.published,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  }
}

export async function adminEventRoutes(app: FastifyInstance) {
  const guard = { preHandler: [authenticateAdmin] }

  app.get('/api/v1/admin/events', guard, async () => {
    const events = await prisma.event.findMany({
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })
    return { data: events.map(mapEvent) }
  })

  app.get<{ Params: { id: string } }>('/api/v1/admin/events/:id', guard, async (request, reply) => {
    const event = await prisma.event.findUnique({ where: { id: request.params.id } })
    if (!event) return reply.status(404).send({ error: 'Event not found' })
    return { data: mapEvent(event) }
  })

  app.post('/api/v1/admin/events', guard, async (request, reply) => {
    const parsed = eventBodySchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }

    const data = parsed.data
    const slug = data.slug?.trim() || slugify(data.title)
    const existing = await prisma.event.findUnique({ where: { slug } })
    if (existing) {
      return reply.status(409).send({ error: 'An event with this slug already exists' })
    }

    const event = await prisma.event.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        dateLabel: data.dateLabel,
        location: data.location,
        type: data.type,
        imageEmoji: data.imageEmoji ?? '🎭',
        featured: data.featured ?? false,
        published: data.published ?? true,
      },
    })

    return reply.status(201).send({ data: mapEvent(event) })
  })

  app.patch<{ Params: { id: string } }>('/api/v1/admin/events/:id', guard, async (request, reply) => {
    const parsed = eventBodySchema.partial().safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }

    const existing = await prisma.event.findUnique({ where: { id: request.params.id } })
    if (!existing) return reply.status(404).send({ error: 'Event not found' })

    const data = parsed.data
    const slug = data.slug?.trim() || (data.title ? slugify(data.title) : undefined)

    if (slug && slug !== existing.slug) {
      const conflict = await prisma.event.findUnique({ where: { slug } })
      if (conflict) return reply.status(409).send({ error: 'An event with this slug already exists' })
    }

    const event = await prisma.event.update({
      where: { id: existing.id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(slug !== undefined ? { slug } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.dateLabel !== undefined ? { dateLabel: data.dateLabel } : {}),
        ...(data.location !== undefined ? { location: data.location } : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.imageEmoji !== undefined ? { imageEmoji: data.imageEmoji } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
      },
    })

    return { data: mapEvent(event) }
  })

  app.delete<{ Params: { id: string } }>('/api/v1/admin/events/:id', guard, async (request, reply) => {
    const existing = await prisma.event.findUnique({ where: { id: request.params.id } })
    if (!existing) return reply.status(404).send({ error: 'Event not found' })
    await prisma.event.delete({ where: { id: existing.id } })
    return { ok: true }
  })
}
