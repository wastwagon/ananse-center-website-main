import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { slugify } from '../../lib/slug.js'
import { parseFeatures } from '../../lib/program-map.js'
import { parseStringArray } from '../../lib/json-arrays.js'
import {
  adminPublicationFieldsSchema,
  publicationCreateDefaults,
  resolvePublicationWrite,
} from '../../lib/admin-publication-fields.js'
import { parseRelatedOverrides } from '../../lib/related-overrides.js'
import { statusFromPublished } from '../../lib/publication.js'
import { rememberPathRedirect } from '../../lib/path-redirect.js'
import { INSIGHT_TOPICS } from '../../lib/taxonomy.js'
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

const programBodySchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10),
  category: z.string().min(2).max(120),
  section: z.enum(['catalog', 'sankofa']).optional(),
  duration: z.string().max(80).optional(),
  level: z.string().max(120).optional(),
  iconKey: z.string().min(2).max(40).optional(),
  features: z.array(z.string().min(1)).optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
  slug: z.string().min(2).max(200).optional(),
  coverMediaId: z.string().cuid().optional().nullable(),
  tagline: z.string().max(200).optional(),
  ctaLabel: z.string().max(80).optional(),
  ctaHref: z.string().max(300).optional(),
  topics: z.array(z.enum(INSIGHT_TOPICS)).max(13).optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  summary: z.string().max(2000).optional(),
  leadPersonId: z.string().cuid().optional().nullable(),
  relatedPersonIds: z.array(z.string().cuid()).max(40).optional(),
}).merge(sharedEntryFieldsSchema).merge(adminPublicationFieldsSchema)

function mapProgram(program: {
  id: string
  title: string
  slug: string
  description: string
  category: string
  section: string
  duration: string
  level: string
  iconKey: string
  features: unknown
  sortOrder: number
  published: boolean
  publicationStatus: string
  scheduledAt: Date | null
  relatedPinned: unknown
  relatedHidden: unknown
  coverMediaId: string | null
  tagline: string
  ctaLabel: string
  ctaHref: string
  topics: unknown
  seoTitle: string
  seoDescription: string
  summary: string
  keywords: string
  noindex: boolean
  shareMediaId: string | null
  leadPersonId: string | null
  people?: { personId: string }[]
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: program.id,
    title: program.title,
    slug: program.slug,
    description: program.description,
    category: program.category,
    section: program.section,
    duration: program.duration,
    level: program.level,
    iconKey: program.iconKey,
    features: parseFeatures(program.features),
    sortOrder: program.sortOrder,
    published: program.published,
    publicationStatus: program.publicationStatus || statusFromPublished(program.published),
    scheduledAt: program.scheduledAt?.toISOString() ?? null,
    relatedPinned: parseRelatedOverrides(program.relatedPinned),
    relatedHidden: parseRelatedOverrides(program.relatedHidden),
    coverMediaId: program.coverMediaId,
    tagline: program.tagline,
    ctaLabel: program.ctaLabel,
    ctaHref: program.ctaHref,
    topics: parseStringArray(program.topics),
    seoTitle: program.seoTitle,
    seoDescription: program.seoDescription,
    summary: program.summary,
    keywords: program.keywords,
    noindex: program.noindex,
    shareMediaId: program.shareMediaId,
    leadPersonId: program.leadPersonId,
    relatedPersonIds: (program.people ?? []).map((row) => row.personId),
    createdAt: program.createdAt.toISOString(),
    updatedAt: program.updatedAt.toISOString(),
  }
}

export async function adminProgramRoutes(app: FastifyInstance) {
  const guard = { preHandler: [withAdminRoles(CONTENT_EDITOR_ROLES)] }

  app.get('/api/v1/admin/programs', guard, async () => {
    const programs = await prisma.program.findMany({
      orderBy: [{ section: 'asc' }, { sortOrder: 'asc' }, { title: 'asc' }],
      include: { people: { select: { personId: true } } },
    })
    return { data: programs.map(mapProgram) }
  })

  app.get<{ Params: { id: string } }>('/api/v1/admin/programs/:id', guard, async (request, reply) => {
    const program = await prisma.program.findUnique({
      where: { id: request.params.id },
      include: { people: { select: { personId: true } } },
    })
    if (!program) return reply.status(404).send({ error: 'Program not found' })
    return { data: mapProgram(program) }
  })

  app.post('/api/v1/admin/programs', guard, async (request, reply) => {
    const parsed = programBodySchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }

    const data = parsed.data
    const nextStatus = data.publicationStatus ?? (data.published === false ? 'draft' : 'published')
    if (denyPublicationChange(request.admin?.role, nextStatus, null, reply)) return
    if (enteringPublication(nextStatus, null)) {
      const error = publishError(
        [
          !data.tagline?.trim() ? 'tagline' : '',
          !plainText(data.summary) ? 'short description' : '',
          !plainText(data.description) ? 'full description' : '',
          !(data.topics && data.topics.length > 0) ? 'at least one topic' : '',
          !data.ctaLabel?.trim() || !data.ctaHref?.trim() ? 'call to action label and link' : '',
        ].filter(Boolean),
      )
      if (error) return reply.status(400).send({ error })
    }
    const slug = data.slug?.trim() || slugify(data.title)
    const existing = await prisma.program.findUnique({ where: { slug } })
    if (existing) {
      return reply.status(409).send({ error: 'A program with this slug already exists' })
    }

    const program = await prisma.program.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        category: data.category,
        section: data.section ?? 'catalog',
        duration: data.duration ?? '',
        level: data.level ?? '',
        iconKey: data.iconKey ?? 'BookOpen',
        features: data.features ?? [],
        sortOrder: data.sortOrder ?? 0,
        ...publicationCreateDefaults(data),
        coverMediaId: data.coverMediaId ?? null,
        tagline: data.tagline ?? '',
        ctaLabel: data.ctaLabel ?? '',
        ctaHref: data.ctaHref ?? '',
        topics: data.topics ?? [],
        seoTitle: data.seoTitle ?? '',
        seoDescription: data.seoDescription ?? '',
        summary: data.summary ?? '',
        ...sharedEntryCreate(data),
        leadPersonId: data.leadPersonId ?? null,
        ...(data.relatedPersonIds
          ? { people: { create: data.relatedPersonIds.map((personId) => ({ personId })) } }
          : {}),
      },
      include: { people: { select: { personId: true } } },
    })

    return reply.status(201).send({ data: mapProgram(program) })
  })

  app.patch<{ Params: { id: string } }>('/api/v1/admin/programs/:id', guard, async (request, reply) => {
    const parsed = programBodySchema.partial().safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() })
    }

    const existing = await prisma.program.findUnique({
      where: { id: request.params.id },
      include: { people: { select: { personId: true } } },
    })
    if (!existing) return reply.status(404).send({ error: 'Program not found' })

    const data = parsed.data
    const nextStatus = data.publicationStatus ?? existing.publicationStatus
    if (denyPublicationChange(request.admin?.role, data.publicationStatus, existing.publicationStatus, reply)) {
      return
    }
    if (enteringPublication(nextStatus, existing.publicationStatus)) {
      const error = publishError(
        [
          !(data.tagline ?? existing.tagline).trim() ? 'tagline' : '',
          !plainText(data.summary ?? existing.summary) ? 'short description' : '',
          !plainText(data.description ?? existing.description) ? 'full description' : '',
          !((data.topics ?? parseStringArray(existing.topics)).length > 0) ? 'at least one topic' : '',
          !(data.ctaLabel ?? existing.ctaLabel).trim() || !(data.ctaHref ?? existing.ctaHref).trim()
            ? 'call to action label and link'
            : '',
        ].filter(Boolean),
      )
      if (error) return reply.status(400).send({ error })
    }
    let slug = existing.slug
    if (data.slug && data.slug !== existing.slug) {
      const taken = await prisma.program.findUnique({ where: { slug: data.slug } })
      if (taken) return reply.status(409).send({ error: 'A program with this slug already exists' })
      slug = data.slug
    } else if (data.title && data.title !== existing.title && !data.slug) {
      const nextSlug = slugify(data.title)
      const taken = await prisma.program.findUnique({ where: { slug: nextSlug } })
      if (!taken || taken.id === existing.id) slug = nextSlug
    }

    if (slug !== existing.slug) {
      await rememberPathRedirect(`/programs/${existing.slug}`, `/programs/${slug}`)
    }

    const program = await prisma.program.update({
      where: { id: existing.id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        slug,
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.section !== undefined ? { section: data.section } : {}),
        ...(data.duration !== undefined ? { duration: data.duration } : {}),
        ...(data.level !== undefined ? { level: data.level } : {}),
        ...(data.iconKey !== undefined ? { iconKey: data.iconKey } : {}),
        ...(data.features !== undefined ? { features: data.features } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
        ...resolvePublicationWrite(data, existing),
        ...(data.coverMediaId !== undefined ? { coverMediaId: data.coverMediaId } : {}),
        ...(data.tagline !== undefined ? { tagline: data.tagline } : {}),
        ...(data.ctaLabel !== undefined ? { ctaLabel: data.ctaLabel } : {}),
        ...(data.ctaHref !== undefined ? { ctaHref: data.ctaHref } : {}),
        ...(data.topics !== undefined ? { topics: data.topics } : {}),
        ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),
        ...(data.seoDescription !== undefined ? { seoDescription: data.seoDescription } : {}),
        ...(data.summary !== undefined ? { summary: data.summary } : {}),
        ...sharedEntryWrite(data),
        ...(data.leadPersonId !== undefined ? { leadPersonId: data.leadPersonId } : {}),
        ...(data.relatedPersonIds !== undefined
          ? {
              people: {
                deleteMany: {},
                create: data.relatedPersonIds.map((personId) => ({ personId })),
              },
            }
          : {}),
      },
      include: { people: { select: { personId: true } } },
    })

    return { data: mapProgram(program) }
  })

  app.delete<{ Params: { id: string } }>('/api/v1/admin/programs/:id', guard, async (request, reply) => {
    const existing = await prisma.program.findUnique({ where: { id: request.params.id } })
    if (!existing) return reply.status(404).send({ error: 'Program not found' })
    if (denyPublicationChange(request.admin?.role, 'draft', existing.publicationStatus, reply)) return
    await prisma.program.delete({ where: { id: existing.id } })
    return { ok: true }
  })
}
