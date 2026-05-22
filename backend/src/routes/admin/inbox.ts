import type { FastifyInstance } from 'fastify'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'
import { prisma } from '../../lib/prisma.js'

export async function adminInboxRoutes(app: FastifyInstance) {
  const guard = { preHandler: [withAdminRoles(['superadmin', 'admin', 'editor'])] }

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
}
