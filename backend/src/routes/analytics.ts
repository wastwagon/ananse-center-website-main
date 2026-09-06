import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { formRateLimit } from '../lib/rate-limit-route.js'
import { prisma } from '../lib/prisma.js'

const pageviewSchema = z.object({
  path: z.string().trim().min(1).max(300),
  referrer: z.string().trim().max(500).optional().default(''),
  sessionId: z.string().trim().min(8).max(80),
})

function normalizePath(raw: string): string | null {
  let path = raw.trim()
  if (!path.startsWith('/')) path = `/${path}`
  // Drop query/hash; ignore admin & API noise
  path = path.split('?')[0]?.split('#')[0] || '/'
  if (path.startsWith('/admin') || path.startsWith('/api')) return null
  if (path.length > 200) path = path.slice(0, 200)
  return path
}

function normalizeReferrer(raw: string): string {
  const value = raw.trim()
  if (!value) return ''
  try {
    const url = new URL(value)
    return url.hostname.replace(/^www\./, '').slice(0, 120)
  } catch {
    return value.slice(0, 120)
  }
}

export async function analyticsRoutes(app: FastifyInstance) {
  app.post('/api/v1/analytics/pageview', formRateLimit(), async (request, reply) => {
    const parsed = pageviewSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid pageview' })
    }

    const path = normalizePath(parsed.data.path)
    if (!path) {
      return reply.status(204).send()
    }

    await prisma.analyticsPageView.create({
      data: {
        path,
        referrer: normalizeReferrer(parsed.data.referrer || ''),
        sessionId: parsed.data.sessionId,
      },
    })

    return reply.status(204).send()
  })
}
