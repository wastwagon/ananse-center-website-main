import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

function mapArchive(row: {
  id: string
  title: string
  description: string
  culture: string
  era: string
  rightsNote: string
  tags: unknown
  mediaUrl: string
}) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    culture: row.culture,
    era: row.era,
    rightsNote: row.rightsNote,
    tags: Array.isArray(row.tags) ? row.tags : [],
    mediaUrl: row.mediaUrl || undefined,
  }
}

export async function archiveRoutes(app: FastifyInstance) {
  app.get('/api/v1/archives', async () => {
    const rows = await prisma.archiveRecord.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    })
    return { data: rows.map(mapArchive) }
  })
}
