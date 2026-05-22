import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

function mapPost(row: {
  id: string
  title: string
  slug: string
  excerpt: string
  body: string
  dateLabel: string
  linkHref: string
}) {
  const link = row.linkHref.trim()
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    date: row.dateLabel,
    href: link || `/news/${row.slug}`,
    isExternal: /^https?:\/\//i.test(link),
  }
}

export async function newsRoutes(app: FastifyInstance) {
  app.get('/api/v1/news', async () => {
    const rows = await prisma.newsPost.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return { data: rows.map(mapPost) }
  })

  app.get<{ Params: { slug: string } }>('/api/v1/news/:slug', async (request, reply) => {
    const row = await prisma.newsPost.findFirst({
      where: { slug: request.params.slug, published: true },
    })
    if (!row) {
      return reply.status(404).send({ error: 'News post not found' })
    }
    return { data: mapPost(row) }
  })
}
