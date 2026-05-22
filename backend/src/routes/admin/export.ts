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
}
