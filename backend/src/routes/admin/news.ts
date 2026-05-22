import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { slugify } from '../../lib/slug.js'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'

const guard = { preHandler: [withAdminRoles(['superadmin', 'admin', 'editor'])] }

const newsSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(120).optional(),
  excerpt: z.string().min(10).max(2000),
  body: z.string().max(50000).optional(),
  dateLabel: z.string().max(80).optional(),
  linkHref: z.string().max(500).optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
})

function mapAdminRow(row: {
  id: string
  title: string
  slug: string
  excerpt: string
  body: string
  dateLabel: string
  linkHref: string
  published: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    dateLabel: row.dateLabel,
    linkHref: row.linkHref,
    published: row.published,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function adminNewsRoutes(app: FastifyInstance) {
  app.get('/api/v1/admin/news', guard, async () => {
    const rows = await prisma.newsPost.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return { data: rows.map(mapAdminRow) }
  })

  app.post('/api/v1/admin/news', guard, async (request, reply) => {
    const parsed = newsSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid news payload' })
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
          linkHref: parsed.data.linkHref ?? '',
          published: parsed.data.published ?? true,
          sortOrder: parsed.data.sortOrder ?? 0,
        },
      })
      return reply.status(201).send({ data: { id: row.id } })
    } catch {
      return reply.status(409).send({ error: 'A post with this slug already exists' })
    }
  })

  app.patch<{ Params: { id: string } }>('/api/v1/admin/news/:id', guard, async (request, reply) => {
    const parsed = newsSchema.partial().safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid news payload' })
    }
    try {
      const row = await prisma.newsPost.update({
        where: { id: request.params.id },
        data: parsed.data,
      })
      return { data: { id: row.id } }
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
