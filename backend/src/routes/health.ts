import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { pingRedis } from '../lib/redis.js'

export async function healthRoutes(app: FastifyInstance) {
  app.get('/api/v1/health', async () => {
    let database = false
    let redis = false

    try {
      await prisma.$queryRaw`SELECT 1`
      database = true
    } catch {
      database = false
    }

    redis = await pingRedis()

    const ok = database
    return {
      ok,
      service: 'ananse-api',
      database,
      redis,
      timestamp: new Date().toISOString(),
    }
  })
}
