import type { ContactMessage } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma.js'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'

const staffGuard = { preHandler: [withAdminRoles(['superadmin', 'admin', 'editor', 'finance'])] }

export async function adminContactRoutes(app: FastifyInstance) {
  app.get('/api/v1/admin/contact-messages', staffGuard, async () => {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return {
      data: messages.map((message: ContactMessage) => ({
        id: message.id,
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message,
        status: message.status,
        createdAt: message.createdAt.toISOString(),
      })),
    }
  })

  app.patch<{ Params: { id: string } }>(
    '/api/v1/admin/contact-messages/:id',
    staffGuard,
    async (request, reply) => {
      const body = request.body as { status?: string }
      const status = body?.status?.trim()
      if (!status) {
        return reply.status(400).send({ error: 'status is required' })
      }

      try {
        const message = await prisma.contactMessage.update({
          where: { id: request.params.id },
          data: { status },
        })
        return {
          data: {
            id: message.id,
            status: message.status,
          },
        }
      } catch {
        return reply.status(404).send({ error: 'Message not found' })
      }
    },
  )
}
