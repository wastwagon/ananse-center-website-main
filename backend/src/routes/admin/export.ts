import type { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma.js'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'

function csvEscape(value: string) {
  const safe = value.replace(/"/g, '""')
  return `"${safe}"`
}

export async function adminExportRoutes(app: FastifyInstance) {
  const financeGuard = { preHandler: [withAdminRoles(['superadmin', 'admin', 'finance'])] }

  app.get('/api/v1/admin/export/donations.csv', financeGuard, async (_request, reply) => {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    })

    const header = ['reference', 'email', 'donor_name', 'amount', 'currency', 'status', 'paid_at', 'created_at']
    const lines = [
      header.join(','),
      ...donations.map((d) =>
        [
          d.reference,
          d.email,
          d.donorName ?? '',
          String(d.amount),
          d.currency,
          d.status,
          d.paidAt?.toISOString() ?? '',
          d.createdAt.toISOString(),
        ]
          .map(csvEscape)
          .join(','),
      ),
    ]

    reply.header('Content-Type', 'text/csv; charset=utf-8')
    reply.header('Content-Disposition', 'attachment; filename="donations.csv"')
    return reply.send(lines.join('\n'))
  })

  app.get('/api/v1/admin/export/contacts.csv', financeGuard, async (_request, reply) => {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    })
    const header = ['name', 'email', 'subject', 'status', 'created_at', 'message']
    const lines = [
      header.join(','),
      ...messages.map((m) =>
        [m.name, m.email, m.subject, m.status, m.createdAt.toISOString(), m.message]
          .map(csvEscape)
          .join(','),
      ),
    ]
    reply.header('Content-Type', 'text/csv; charset=utf-8')
    reply.header('Content-Disposition', 'attachment; filename="contact-messages.csv"')
    return reply.send(lines.join('\n'))
  })

  app.get('/api/v1/admin/export/newsletter.csv', financeGuard, async (_request, reply) => {
    const rows = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
      take: 2000,
    })
    const header = ['email', 'created_at']
    const lines = [
      header.join(','),
      ...rows.map((r) => [r.email, r.createdAt.toISOString()].map(csvEscape).join(',')),
    ]
    reply.header('Content-Type', 'text/csv; charset=utf-8')
    reply.header('Content-Disposition', 'attachment; filename="newsletter-subscribers.csv"')
    return reply.send(lines.join('\n'))
  })
}
