import type { FastifyInstance } from 'fastify'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { mapPublicInsightPost, newsIncludeCover } from '../lib/news-map.js'
import { INSIGHT_CONTENT_TYPES } from '../lib/taxonomy.js'

type InsightsQuery = {
  topic?: string
  contentType?: string
  featured?: string
}

function buildInsightsWhere(query: InsightsQuery) {
  const where: Prisma.NewsPostWhereInput = { published: true }
  if (query.featured === 'true') where.featured = true
  if (query.contentType?.trim()) {
    where.contentType = query.contentType.trim()
  }
  if (query.topic?.trim()) {
    where.topics = { array_contains: query.topic.trim() }
  }
  return where
}

export async function insightsRoutes(app: FastifyInstance) {
  app.get<{ Querystring: InsightsQuery }>('/api/v1/insights', async (request) => {
    const rows = await prisma.newsPost.findMany({
      where: buildInsightsWhere(request.query),
      include: newsIncludeCover,
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return { data: rows.map(mapPublicInsightPost) }
  })

  app.get('/api/v1/insights/taxonomy', async () => {
    return {
      data: {
        contentTypes: [...INSIGHT_CONTENT_TYPES],
      },
    }
  })

  app.get<{ Params: { slug: string } }>('/api/v1/insights/:slug', async (request, reply) => {
    const row = await prisma.newsPost.findFirst({
      where: { slug: request.params.slug, published: true },
      include: newsIncludeCover,
    })
    if (!row) {
      return reply.status(404).send({ error: 'Insight not found' })
    }
    return { data: mapPublicInsightPost(row) }
  })
}
