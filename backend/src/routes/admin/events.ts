import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { slugify } from '../../lib/slug.js'
import { eventIncludeAdmin, mapAdminEvent } from '../../lib/event-map.js'
import {
  adminPublicationFieldsSchema,
  publicationCreateDefaults,
  resolvePublicationWrite,
} from '../../lib/admin-publication-fields.js'
import { rememberPathRedirect } from '../../lib/path-redirect.js'
import { EVENT_DELIVERY_MODES, EVENT_STATUSES } from '../../lib/taxonomy.js'
import { CONTENT_EDITOR_ROLES } from '../../lib/admin-roles.js'
import {
  denyPublicationChange,
  enteringPublication,
  plainText,
  publishError,
  sharedEntryCreate,
  sharedEntryFieldsSchema,
  sharedEntryWrite,
} from '../../lib/entry-fields.js'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'

const registrationStatusSchema = z.enum([
  'auto',
  'open',
  'closed',
  'waitlist',
  'completed',
  'not_required',
  'unavailable',
])

const eventBodySchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10),
  dateLabel: z.string().min(2).max(120),
  startsAt: z.union([z.string().min(1), z.null()]).optional(),
  endsAt: z.union([z.string().min(1), z.null()]).optional(),
  timeLabel: z.string().max(120).optional(),
  capacity: z.number().int().positive().optional().nullable(),
  registrationStatus: registrationStatusSchema.optional(),
  eventStatus: z.enum(EVENT_STATUSES).optional(),
  deliveryMode: z.enum(EVENT_DELIVERY_MODES).optional(),
  meetingUrl: z.string().max(500).optional(),
  recordingUrl: z.string().max(500).optional(),
  audioUrl: z.string().max(500).optional(),
  cost: z.string().max(120).optional(),
  registrationUrl: z.string().max(500).optional(),
  organizer: z.string().max(200).optional(),
  timeZone: z.string().max(80).optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  transcript: z.string().max(50000).optional(),
  subtitle: z.string().max(240).optional(),
  speakers: z
    .array(z.object({ personId: z.string().cuid(), role: z.string().max(80).optional() }))
    .max(24)
    .optional(),
  galleryMediaIds: z.array(z.string().cuid()).max(48).optional(),
  programId: z.string().cuid().optional().nullable(),
  location: z.string().min(2).max(200),
  venue: z.string().max(200).optional(),
  type: z.string().min(2).max(80),
  imageEmoji: z.string().min(1).max(8).optional(),
  storyTitle: z.string().max(200).optional().nullable(),
  storyBody: z.string().max(20000).optional().nullable(),
  highlights: z.array(z.string().min(1)).optional(),
  featured: z.boolean().optional(),
  slug: z.string().min(2).max(200).optional(),
  coverMediaId: z.string().cuid().optional().nullable(),
  insightIds: z.array(z.string().cuid()).max(24).optional(),
}).merge(sharedEntryFieldsSchema).merge(adminPublicationFieldsSchema)

function parseOptionalDate(value: string | null | undefined): Date | null | undefined {
  if (value === undefined) return undefined
  if (value === null || value === '') return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export async function adminEventRoutes(app: FastifyInstance) {
  const guard = { preHandler: [withAdminRoles(CONTENT_EDITOR_ROLES)] }

  app.get('/api/v1/admin/events', guard, async () => {
    const events = await prisma.event.findMany({
      include: eventIncludeAdmin,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })
    return { data: events.map(mapAdminEvent) }
  })

  app.get<{ Params: { id: string } }>('/api/v1/admin/events/:id', guard, async (request, reply) => {
    const event = await prisma.event.findUnique({
      where: { id: request.params.id },
      include: eventIncludeAdmin,
    })
    if (!event) return reply.status(404).send({ error: 'Event not found' })
    return { data: mapAdminEvent(event) }
  })

  app.post('/api/v1/admin/events', guard, async (request, reply) => {
    const parsed = eventBodySchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }

    const data = parsed.data
    const nextStatus = data.publicationStatus ?? (data.published === false ? 'draft' : 'published')
    if (denyPublicationChange(request.admin?.role, nextStatus, null, reply)) return
    if (enteringPublication(nextStatus, null)) {
      const error = publishError(
        [
          !plainText(data.description) ? 'short description' : '',
          !plainText(data.storyBody) ? 'full description' : '',
        ].filter(Boolean),
      )
      if (error) return reply.status(400).send({ error })
    }
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
        eventStatus: data.eventStatus ?? 'scheduled',
        deliveryMode: data.deliveryMode ?? 'in_person',
        meetingUrl: data.meetingUrl ?? '',
        recordingUrl: data.recordingUrl ?? '',
        audioUrl: data.audioUrl ?? '',
        cost: data.cost ?? '',
        registrationUrl: data.registrationUrl ?? '',
        organizer: data.organizer ?? '',
        timeZone: data.timeZone ?? '',
        seoTitle: data.seoTitle ?? '',
        seoDescription: data.seoDescription ?? '',
        transcript: data.transcript ?? '',
        subtitle: data.subtitle ?? '',
        speakers: {
          create: (data.speakers ?? []).map((speaker) => ({
            personId: speaker.personId,
            role: speaker.role?.trim() || 'Speaker',
          })),
        },
        galleryMediaIds: data.galleryMediaIds ?? [],
        programId: data.programId ?? null,
        location: data.location,
        venue: data.venue ?? '',
        type: data.type,
        imageEmoji: data.imageEmoji ?? '📅',
        storyTitle: data.storyTitle ?? null,
        storyBody: data.storyBody ?? null,
        highlights: data.highlights ?? [],
        featured: data.featured ?? false,
        ...publicationCreateDefaults(data),
        ...sharedEntryCreate(data),
        coverMediaId: data.coverMediaId ?? null,
        ...(data.insightIds
          ? { insightLinks: { create: data.insightIds.map((newsPostId) => ({ newsPostId })) } }
          : {}),
      },
      include: eventIncludeAdmin,
    })

    return reply.status(201).send({ data: mapAdminEvent(event) })
  })

  app.patch<{ Params: { id: string } }>('/api/v1/admin/events/:id', guard, async (request, reply) => {
    const parsed = eventBodySchema.partial().safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }

    const existing = await prisma.event.findUnique({ where: { id: request.params.id } })
    if (!existing) return reply.status(404).send({ error: 'Event not found' })

    const data = parsed.data
    const nextStatus = data.publicationStatus ?? existing.publicationStatus
    if (denyPublicationChange(request.admin?.role, data.publicationStatus, existing.publicationStatus, reply)) {
      return
    }
    if (enteringPublication(nextStatus, existing.publicationStatus)) {
      const error = publishError(
        [
          !plainText(data.description ?? existing.description) ? 'short description' : '',
          !plainText(data.storyBody ?? existing.storyBody) ? 'full description' : '',
        ].filter(Boolean),
      )
      if (error) return reply.status(400).send({ error })
    }
    const slug = data.slug?.trim() || (data.title ? slugify(data.title) : undefined)

    if (slug && slug !== existing.slug) {
      const conflict = await prisma.event.findUnique({ where: { slug } })
      if (conflict) return reply.status(409).send({ error: 'An event with this slug already exists' })
      await rememberPathRedirect(`/events/${existing.slug}`, `/events/${slug}`)
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
        ...(data.eventStatus !== undefined ? { eventStatus: data.eventStatus } : {}),
        ...(data.deliveryMode !== undefined ? { deliveryMode: data.deliveryMode } : {}),
        ...(data.meetingUrl !== undefined ? { meetingUrl: data.meetingUrl } : {}),
        ...(data.recordingUrl !== undefined ? { recordingUrl: data.recordingUrl } : {}),
        ...(data.audioUrl !== undefined ? { audioUrl: data.audioUrl } : {}),
        ...(data.cost !== undefined ? { cost: data.cost } : {}),
        ...(data.registrationUrl !== undefined ? { registrationUrl: data.registrationUrl } : {}),
        ...(data.organizer !== undefined ? { organizer: data.organizer } : {}),
        ...(data.timeZone !== undefined ? { timeZone: data.timeZone } : {}),
        ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),
        ...(data.seoDescription !== undefined ? { seoDescription: data.seoDescription } : {}),
        ...(data.transcript !== undefined ? { transcript: data.transcript } : {}),
        ...(data.subtitle !== undefined ? { subtitle: data.subtitle } : {}),
        ...(data.speakers !== undefined
          ? {
              speakers: {
                deleteMany: {},
                create: data.speakers.map((speaker) => ({
                  personId: speaker.personId,
                  role: speaker.role?.trim() || 'Speaker',
                })),
              },
            }
          : {}),
        ...(data.galleryMediaIds !== undefined ? { galleryMediaIds: data.galleryMediaIds } : {}),
        ...(data.programId !== undefined ? { programId: data.programId } : {}),
        ...(data.location !== undefined ? { location: data.location } : {}),
        ...(data.venue !== undefined ? { venue: data.venue } : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.imageEmoji !== undefined ? { imageEmoji: data.imageEmoji } : {}),
        ...(data.storyTitle !== undefined ? { storyTitle: data.storyTitle } : {}),
        ...(data.storyBody !== undefined ? { storyBody: data.storyBody } : {}),
        ...(data.highlights !== undefined ? { highlights: data.highlights } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
        ...resolvePublicationWrite(data, existing),
        ...sharedEntryWrite(data),
        ...(data.coverMediaId !== undefined ? { coverMediaId: data.coverMediaId } : {}),
        ...(data.insightIds !== undefined
          ? {
              insightLinks: {
                deleteMany: {},
                create: data.insightIds.map((newsPostId) => ({ newsPostId })),
              },
            }
          : {}),
      },
      include: eventIncludeAdmin,
    })

    return { data: mapAdminEvent(event) }
  })

  app.delete<{ Params: { id: string } }>('/api/v1/admin/events/:id', guard, async (request, reply) => {
    const existing = await prisma.event.findUnique({ where: { id: request.params.id } })
    if (!existing) return reply.status(404).send({ error: 'Event not found' })
    if (denyPublicationChange(request.admin?.role, 'draft', existing.publicationStatus, reply)) return
    await prisma.event.delete({ where: { id: existing.id } })
    return { ok: true }
  })
}
