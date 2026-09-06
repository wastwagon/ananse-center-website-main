import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { mapPublicNewsPost, newsIncludeCover } from '../lib/news-map.js'

export async function newsRoutes(app: FastifyInstance) {
  app.get('/api/v1/news', async () => {
    const rows = await prisma.newsPost.findMany({
      where: { published: true },
      include: newsIncludeCover,
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return { data: rows.map(mapPublicNewsPost) }
  })

  app.get<{ Params: { slug: string } }>('/api/v1/news/:slug', async (request, reply) => {
    const row = await prisma.newsPost.findFirst({
      where: { slug: request.params.slug, published: true },
      include: newsIncludeCover,
    })
    if (!row) {
      return reply.status(404).send({ error: 'News post not found' })
    }
    return { data: mapPublicNewsPost(row) }
  })
}
