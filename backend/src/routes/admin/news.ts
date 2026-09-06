import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { slugify } from '../../lib/slug.js'
import { mapAdminNewsPost, newsIncludeCover } from '../../lib/news-map.js'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'

const guard = { preHandler: [withAdminRoles(['superadmin', 'admin', 'editor'])] }

const newsSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(120).optional(),
  excerpt: z.string().min(10).max(2000),
  body: z.string().max(50000).optional(),
  dateLabel: z.string().max(80).optional(),
  author: z.string().max(120).optional(),
  category: z.string().max(80).optional(),
  featured: z.boolean().optional(),
  linkHref: z.string().max(500).optional(),
  coverMediaId: z.string().cuid().optional().nullable(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
})

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
    try {
      const row = await prisma.newsPost.create({
        data: {
          title: parsed.data.title,
          slug,
          excerpt: parsed.data.excerpt,
          body: parsed.data.body ?? '',
          dateLabel: parsed.data.dateLabel ?? '',
          author: parsed.data.author ?? '',
          category: parsed.data.category ?? 'News',
          featured: parsed.data.featured ?? false,
          linkHref: parsed.data.linkHref ?? '',
          coverMediaId: parsed.data.coverMediaId ?? null,
          published: parsed.data.published ?? true,
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
      const row = await prisma.newsPost.update({
        where: { id: request.params.id },
        data: {
          ...(data.title !== undefined ? { title: data.title } : {}),
          ...(data.slug !== undefined ? { slug: data.slug } : {}),
          ...(data.excerpt !== undefined ? { excerpt: data.excerpt } : {}),
          ...(data.body !== undefined ? { body: data.body } : {}),
          ...(data.dateLabel !== undefined ? { dateLabel: data.dateLabel } : {}),
          ...(data.author !== undefined ? { author: data.author } : {}),
          ...(data.category !== undefined ? { category: data.category } : {}),
          ...(data.featured !== undefined ? { featured: data.featured } : {}),
          ...(data.linkHref !== undefined ? { linkHref: data.linkHref } : {}),
          ...(data.coverMediaId !== undefined ? { coverMediaId: data.coverMediaId } : {}),
          ...(data.published !== undefined ? { published: data.published } : {}),
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
    try {
      await prisma.newsPost.delete({ where: { id: request.params.id } })
      return { ok: true }
    } catch {
      return reply.status(404).send({ error: 'News post not found' })
    }
  })
}
