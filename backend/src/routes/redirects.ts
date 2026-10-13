import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

export async function redirectRoutes(app: FastifyInstance) {
  app.get('/api/v1/redirects', async () => {
    const rows = await prisma.pathRedirect.findMany({
      select: { fromPath: true, toPath: true },
      orderBy: { createdAt: 'desc' },
      take: 2000,
    })
    return { data: rows }
  })
}
