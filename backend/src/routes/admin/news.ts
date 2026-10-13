import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { slugify } from '../../lib/slug.js'
import { mapAdminNewsPost, newsIncludeCover } from '../../lib/news-map.js'
import {
  adminPublicationFieldsSchema,
  publicationCreateDefaults,
  resolvePublicationWrite,
} from '../../lib/admin-publication-fields.js'
import { rememberPathRedirect } from '../../lib/path-redirect.js'
import { INSIGHT_CONTENT_TYPES, INSIGHT_TOPICS } from '../../lib/taxonomy.js'
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

const guard = { preHandler: [withAdminRoles(CONTENT_EDITOR_ROLES)] }

const newsSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(120).optional(),
  excerpt: z.string().min(10).max(2000),
  subtitle: z.string().max(240).optional(),
  body: z.string().max(50000).optional(),
  dateLabel: z.string().max(80).optional(),
  author: z.string().max(120).optional(),
  authorPersonId: z.string().cuid().optional().nullable(),
  programId: z.string().cuid().optional().nullable(),
  category: z.string().max(80).optional(),
  contentType: z.enum(INSIGHT_CONTENT_TYPES).optional(),
  topics: z.array(z.enum(INSIGHT_TOPICS)).max(13).optional(),
  showInLibraryRead: z.boolean().optional(),
  featured: z.boolean().optional(),
  linkHref: z.string().max(500).optional(),
  coverMediaId: z.string().cuid().optional().nullable(),
  imageCredit: z.string().max(200).optional(),
  pullQuote: z.string().max(500).optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  primaryTopic: z.enum(INSIGHT_TOPICS).optional(),
  programIds: z.array(z.string().cuid()).max(10).optional(),
  eventIds: z.array(z.string().cuid()).max(24).optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
}).merge(sharedEntryFieldsSchema).merge(adminPublicationFieldsSchema)

export async function adminNewsRoutes(app: FastifyInstance) {
  app.get('/api/v1/admin/news', guard, async () => {
    const rows = await prisma.newsPost.findMany({
      include: newsIncludeCover,
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return { data: rows.map(mapAdminNewsPost) }
  })

  app.post('/api/v1/admin/news', guard, async (request, reply) => {
    const parsed = newsSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid news payload', details: parsed.error.flatten() })
    }
    const slug = parsed.data.slug?.trim() || slugify(parsed.data.title)
    const contentType = parsed.data.contentType ?? 'Articles'
    const programIds = parsed.data.programIds ?? (parsed.data.programId ? [parsed.data.programId] : [])
    const nextStatus = parsed.data.publicationStatus ?? (parsed.data.published === false ? 'draft' : 'published')
    if (denyPublicationChange(request.admin?.role, nextStatus, null, reply)) return
    if (enteringPublication(nextStatus, null)) {
      const error = publishError(
        [
          !parsed.data.primaryTopic ? 'primary category' : '',
          !plainText(parsed.data.excerpt) ? 'short description' : '',
          !plainText(parsed.data.body) ? 'article body' : '',
          !parsed.data.author?.trim() && !parsed.data.authorPersonId ? 'author' : '',
        ].filter(Boolean),
      )
      if (error) return reply.status(400).send({ error })
    }
    try {
      const row = await prisma.newsPost.create({
        data: {
          title: parsed.data.title,
          slug,
          excerpt: parsed.data.excerpt,
          subtitle: parsed.data.subtitle ?? '',
          body: parsed.data.body ?? '',
          dateLabel: parsed.data.dateLabel ?? '',
          author: parsed.data.author ?? '',
          authorPersonId: parsed.data.authorPersonId ?? null,
          programId: programIds[0] ?? null,
          primaryTopic: parsed.data.primaryTopic ?? '',
          category: parsed.data.category ?? contentType,
          contentType,
          topics: parsed.data.topics ?? [],
          showInLibraryRead: parsed.data.showInLibraryRead ?? false,
          featured: parsed.data.featured ?? false,
          linkHref: parsed.data.linkHref ?? '',
          coverMediaId: parsed.data.coverMediaId ?? null,
          imageCredit: parsed.data.imageCredit ?? '',
          pullQuote: parsed.data.pullQuote ?? '',
          seoTitle: parsed.data.seoTitle ?? '',
          seoDescription: parsed.data.seoDescription ?? '',
          ...publicationCreateDefaults(parsed.data),
          ...sharedEntryCreate(parsed.data),
          ...(programIds.length > 1
            ? { programLinks: { create: programIds.slice(1).map((programId) => ({ programId })) } }
            : {}),
          ...(parsed.data.eventIds?.length
            ? {
                eventLinks: {
                  create: parsed.data.eventIds.map((eventId) => ({ eventId })),
                },
              }
            : {}),
          sortOrder: parsed.data.sortOrder ?? 0,
        },
        include: newsIncludeCover,
      })
      return reply.status(201).send({ data: mapAdminNewsPost(row) })
    } catch {
      return reply.status(409).send({ error: 'A post with this slug already exists' })
    }
  })

  app.patch<{ Params: { id: string } }>('/api/v1/admin/news/:id', guard, async (request, reply) => {
    const parsed = newsSchema.partial().safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid news payload', details: parsed.error.flatten() })
    }
    try {
      const data = parsed.data
      const existing = await prisma.newsPost.findUnique({ where: { id: request.params.id } })
      if (!existing) return reply.status(404).send({ error: 'News post not found' })
      const nextStatus = data.publicationStatus ?? existing.publicationStatus
      if (denyPublicationChange(request.admin?.role, data.publicationStatus, existing.publicationStatus, reply)) {
        return
      }
      if (enteringPublication(nextStatus, existing.publicationStatus)) {
        const error = publishError(
          [
            !(data.primaryTopic ?? existing.primaryTopic) ? 'primary category' : '',
            !plainText(data.excerpt ?? existing.excerpt) ? 'short description' : '',
            !plainText(data.body ?? existing.body) ? 'article body' : '',
            !(data.author ?? existing.author).trim() && !(data.authorPersonId ?? existing.authorPersonId)
              ? 'author'
              : '',
          ].filter(Boolean),
        )
        if (error) return reply.status(400).send({ error })
      }
      const programIds = data.programIds
      if (data.slug && data.slug !== existing.slug) {
        const taken = await prisma.newsPost.findUnique({ where: { slug: data.slug } })
        if (taken) return reply.status(409).send({ error: 'A post with this slug already exists' })
        await rememberPathRedirect(`/insights/${existing.slug}`, `/insights/${data.slug}`)
      }
      const row = await prisma.newsPost.update({
        where: { id: request.params.id },
        data: {
          ...(data.title !== undefined ? { title: data.title } : {}),
          ...(data.slug !== undefined ? { slug: data.slug } : {}),
          ...(data.excerpt !== undefined ? { excerpt: data.excerpt } : {}),
          ...(data.subtitle !== undefined ? { subtitle: data.subtitle } : {}),
          ...(data.body !== undefined ? { body: data.body } : {}),
          ...(data.dateLabel !== undefined ? { dateLabel: data.dateLabel } : {}),
          ...(data.author !== undefined ? { author: data.author } : {}),
          ...(data.authorPersonId !== undefined ? { authorPersonId: data.authorPersonId } : {}),
          ...(programIds !== undefined
            ? { programId: programIds[0] ?? null }
            : data.programId !== undefined
              ? { programId: data.programId }
              : {}),
          ...(data.primaryTopic !== undefined ? { primaryTopic: data.primaryTopic } : {}),
          ...(programIds !== undefined
            ? {
                programLinks: {
                  deleteMany: {},
                  create: programIds.slice(1).map((programId) => ({ programId })),
                },
              }
            : {}),
          ...(data.eventIds !== undefined
            ? {
                eventLinks: {
                  deleteMany: {},
                  create: data.eventIds.map((eventId) => ({ eventId })),
                },
              }
            : {}),
          ...(data.category !== undefined ? { category: data.category } : {}),
          ...(data.contentType !== undefined ? { contentType: data.contentType } : {}),
          ...(data.topics !== undefined ? { topics: data.topics } : {}),
          ...(data.showInLibraryRead !== undefined ? { showInLibraryRead: data.showInLibraryRead } : {}),
          ...(data.featured !== undefined ? { featured: data.featured } : {}),
          ...(data.linkHref !== undefined ? { linkHref: data.linkHref } : {}),
          ...(data.coverMediaId !== undefined ? { coverMediaId: data.coverMediaId } : {}),
          ...(data.imageCredit !== undefined ? { imageCredit: data.imageCredit } : {}),
          ...(data.pullQuote !== undefined ? { pullQuote: data.pullQuote } : {}),
          ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),
          ...(data.seoDescription !== undefined ? { seoDescription: data.seoDescription } : {}),
          ...resolvePublicationWrite(data, existing),
          ...sharedEntryWrite(data),
          ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
        },
        include: newsIncludeCover,
      })
      return { data: mapAdminNewsPost(row) }
    } catch {
      return reply.status(404).send({ error: 'News post not found' })
    }
  })

  app.delete<{ Params: { id: string } }>('/api/v1/admin/news/:id', guard, async (request, reply) => {
    const existing = await prisma.newsPost.findUnique({ where: { id: request.params.id } })
    if (!existing) return reply.status(404).send({ error: 'News post not found' })
    if (denyPublicationChange(request.admin?.role, 'draft', existing.publicationStatus, reply)) return
    await prisma.newsPost.delete({ where: { id: existing.id } })
    return { ok: true }
  })
}
