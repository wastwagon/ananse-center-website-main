import type { FastifyInstance } from 'fastify'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'
import { prisma } from '../../lib/prisma.js'

export async function adminNewsletterRoutes(app: FastifyInstance) {
  const guard = { preHandler: [withAdminRoles(['superadmin', 'admin', 'editor'])] }

  app.get('/api/v1/admin/newsletter/subscribers', guard, async () => {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return {
      data: subscribers.map((row) => ({
        id: row.id,
        email: row.email,
        createdAt: row.createdAt.toISOString(),
      })),
    }
  })
}
