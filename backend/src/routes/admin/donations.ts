import type { Donation } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma.js'
import { authenticateAdmin } from '../../plugins/admin-auth.js'

export async function adminDonationRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/admin/donations',
    { preHandler: [authenticateAdmin] },
    async () => {
      const donations = await prisma.donation.findMany({
        orderBy: { createdAt: 'desc' },
        take: 200,
      })

      return {
        data: donations.map((donation: Donation) => ({
          id: donation.id,
          reference: donation.reference,
          email: donation.email,
          donorName: donation.donorName,
          amount: donation.amount,
          currency: donation.currency,
          label: donation.label,
          status: donation.status,
          channel: donation.channel,
          paidAt: donation.paidAt?.toISOString() ?? null,
          createdAt: donation.createdAt.toISOString(),
        })),
      }
    },
  )
}
