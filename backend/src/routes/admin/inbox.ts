import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'
import { prisma } from '../../lib/prisma.js'

const guard = { preHandler: [withAdminRoles(['superadmin', 'admin', 'editor'])] }

const statusSchema = z.object({
  status: z.enum(['pending', 'published', 'rejected']),
})

export async function adminInboxRoutes(app: FastifyInstance) {
  app.get('/api/v1/admin/inbox/registrations', guard, async () => {
    const rows = await prisma.eventRegistration.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return { data: rows }
  })

  app.get('/api/v1/admin/inbox/community', guard, async () => {
    const rows = await prisma.communitySubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return { data: rows }
  })

  app.patch<{ Params: { id: string } }>(
    '/api/v1/admin/inbox/community/:id',
    guard,
    async (request, reply) => {
      const parsed = statusSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Invalid status' })
      }
      try {
        const row = await prisma.communitySubmission.update({
          where: { id: request.params.id },
          data: { status: parsed.data.status },
        })
        return { data: row }
      } catch {
        return reply.status(404).send({ error: 'Submission not found' })
      }
    },
  )
}
