import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { slugify } from '../../lib/slug.js'
import { parseHighlights } from '../../lib/event-map.js'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'

const registrationStatusSchema = z.enum(['auto', 'open', 'closed', 'waitlist', 'completed'])

const eventBodySchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10),
  dateLabel: z.string().min(2).max(120),
  startsAt: z.union([z.string().min(1), z.null()]).optional(),
  endsAt: z.union([z.string().min(1), z.null()]).optional(),
  timeLabel: z.string().max(120).optional(),
  capacity: z.number().int().positive().optional().nullable(),
  registrationStatus: registrationStatusSchema.optional(),
  location: z.string().min(2).max(200),
  venue: z.string().max(200).optional(),
  type: z.string().min(2).max(80),
  imageEmoji: z.string().min(1).max(8).optional(),
  storyTitle: z.string().max(200).optional().nullable(),
  storyBody: z.string().max(20000).optional().nullable(),
  highlights: z.array(z.string().min(1)).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  slug: z.string().min(2).max(200).optional(),
  coverMediaId: z.string().cuid().optional().nullable(),
})

function parseOptionalDate(value: string | null | undefined): Date | null | undefined {
  if (value === undefined) return undefined
  if (value === null || value === '') return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function mapEvent(event: {
  id: string
  title: string
  slug: string
  description: string
  dateLabel: string
  startsAt: Date | null
  endsAt: Date | null
  timeLabel: string
  capacity: number | null
  registrationStatus: string
  location: string
  venue: string
  type: string
  imageEmoji: string
  storyTitle: string | null
  storyBody: string | null
  highlights: unknown
  featured: boolean
  published: boolean
  coverMediaId: string | null
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    dateLabel: event.dateLabel,
    startsAt: event.startsAt?.toISOString() ?? null,
    endsAt: event.endsAt?.toISOString() ?? null,
    timeLabel: event.timeLabel,
    capacity: event.capacity,
    registrationStatus: event.registrationStatus,
    location: event.location,
    venue: event.venue,
    type: event.type,
    imageEmoji: event.imageEmoji,
    storyTitle: event.storyTitle,
    storyBody: event.storyBody,
    highlights: parseHighlights(event.highlights),
    featured: event.featured,
    published: event.published,
    coverMediaId: event.coverMediaId,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  }
}

export async function adminEventRoutes(app: FastifyInstance) {
  const guard = { preHandler: [withAdminRoles(['superadmin', 'admin', 'editor'])] }

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
        startsAt: parseOptionalDate(data.startsAt) ?? null,
        endsAt: parseOptionalDate(data.endsAt) ?? null,
        timeLabel: data.timeLabel ?? '',
        capacity: data.capacity ?? null,
        registrationStatus: data.registrationStatus ?? 'auto',
        location: data.location,
        venue: data.venue ?? '',
        type: data.type,
        imageEmoji: data.imageEmoji ?? '🎭',
        storyTitle: data.storyTitle ?? null,
        storyBody: data.storyBody ?? null,
        highlights: data.highlights ?? [],
        featured: data.featured ?? false,
        published: data.published ?? true,
        coverMediaId: data.coverMediaId ?? null,
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
        ...(data.startsAt !== undefined ? { startsAt: parseOptionalDate(data.startsAt) ?? null } : {}),
        ...(data.endsAt !== undefined ? { endsAt: parseOptionalDate(data.endsAt) ?? null } : {}),
        ...(data.timeLabel !== undefined ? { timeLabel: data.timeLabel } : {}),
        ...(data.capacity !== undefined ? { capacity: data.capacity } : {}),
        ...(data.registrationStatus !== undefined
          ? { registrationStatus: data.registrationStatus }
          : {}),
        ...(data.location !== undefined ? { location: data.location } : {}),
        ...(data.venue !== undefined ? { venue: data.venue } : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.imageEmoji !== undefined ? { imageEmoji: data.imageEmoji } : {}),
        ...(data.storyTitle !== undefined ? { storyTitle: data.storyTitle } : {}),
        ...(data.storyBody !== undefined ? { storyBody: data.storyBody } : {}),
        ...(data.highlights !== undefined ? { highlights: data.highlights } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
        ...(data.coverMediaId !== undefined ? { coverMediaId: data.coverMediaId } : {}),
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
