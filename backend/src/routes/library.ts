import type { FastifyInstance } from 'fastify'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { libraryIncludeRelations, mapPublicLibraryItem } from '../lib/library-map.js'
import { mapPublicInsightPost, newsIncludeCover } from '../lib/news-map.js'

type LibraryQuery = {
  shelf?: string
  collection?: string
  program?: string
  person?: string
  topic?: string
  featured?: string
  q?: string
}

function buildLibraryWhere(query: LibraryQuery): Prisma.LibraryItemWhereInput {
  const where: Prisma.LibraryItemWhereInput = { published: true }
  if (query.shelf?.trim()) where.shelf = query.shelf.trim().toLowerCase()
  if (query.collection?.trim()) where.collection = query.collection.trim()
  if (query.featured === 'true') where.featured = true
  if (query.program?.trim()) {
    where.program = { slug: query.program.trim() }
  }
  if (query.person?.trim()) {
    where.person = { slug: query.person.trim() }
  }
  if (query.topic?.trim()) {
    where.topics = { array_contains: query.topic.trim() }
  }
  if (query.q?.trim()) {
    const contains = { contains: query.q.trim(), mode: 'insensitive' as const }
    where.OR = [
      { title: contains },
      { description: contains },
      { body: contains },
      { transcript: contains },
      { wisdomNugget: contains },
      { scriptureTheme: contains },
      { keywords: contains },
      { dateLabel: contains },
      { topics: { string_contains: query.q.trim() } },
    ]
  }
  return where
}

export async function libraryRoutes(app: FastifyInstance) {
  app.get('/api/v1/library/midday-reflection/episodes', async () => {
    const rows = await prisma.libraryItem.findMany({
      where: {
        published: true,
        collection: 'Midday Reflection',
      },
      include: libraryIncludeRelations,
      orderBy: [{ episodeNumber: 'desc' }, { publishedAt: 'desc' }, { sortOrder: 'asc' }],
    })
    return { data: rows.map(mapPublicLibraryItem) }
  })

  app.get('/api/v1/library/read/linked-articles', async () => {
    const rows = await prisma.newsPost.findMany({
      where: { published: true, showInLibraryRead: true },
      include: newsIncludeCover,
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return { data: rows.map(mapPublicInsightPost) }
  })

  app.get<{ Querystring: LibraryQuery }>('/api/v1/library', async (request) => {
    const rows = await prisma.libraryItem.findMany({
      where: buildLibraryWhere(request.query),
      include: libraryIncludeRelations,
      orderBy: [
        { featured: 'desc' },
        { episodeNumber: 'desc' },
        { sortOrder: 'asc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    })
    return { data: rows.map(mapPublicLibraryItem) }
  })

  app.get<{ Params: { slug: string } }>('/api/v1/library/:slug', async (request, reply) => {
    const row = await prisma.libraryItem.findFirst({
      where: { slug: request.params.slug, published: true },
      include: libraryIncludeRelations,
    })
    if (!row) {
      return reply.status(404).send({ error: 'Library item not found' })
    }
    return { data: mapPublicLibraryItem(row) }
  })
}
