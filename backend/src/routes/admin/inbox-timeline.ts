import type { FastifyInstance } from 'fastify'
import { withAdminRoles } from '../../plugins/admin-role-guard.js'
import { fromSubunit } from '../../lib/paystack.js'
import { prisma } from '../../lib/prisma.js'

const guard = { preHandler: [withAdminRoles(['superadmin', 'admin', 'editor', 'finance'])] }

export type InboxTimelineItem = {
  id: string
  kind: 'contact' | 'donation' | 'registration' | 'community' | 'newsletter'
  at: string
  title: string
  summary: string
  email: string
  status: string
  adminPath: string
}

export async function adminInboxTimelineRoutes(app: FastifyInstance) {
  app.get('/api/v1/admin/inbox/timeline', guard, async () => {
    const [contacts, donations, registrations, stories, subscribers] = await Promise.all([
      prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 40 }),
      prisma.donation.findMany({
        where: { status: 'success' },
        orderBy: [{ paidAt: 'desc' }, { createdAt: 'desc' }],
        take: 30,
      }),
      prisma.eventRegistration.findMany({ orderBy: { createdAt: 'desc' }, take: 40 }),
      prisma.communitySubmission.findMany({ orderBy: { createdAt: 'desc' }, take: 40 }),
      prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
    ])

    const items: InboxTimelineItem[] = [
      ...contacts.map((row) => ({
        id: row.id,
        kind: 'contact' as const,
        at: row.createdAt.toISOString(),
        title: row.subject,
        summary: row.name,
        email: row.email,
        status: row.status,
        adminPath: '/admin/contact',
      })),
      ...donations.map((row) => ({
        id: row.id,
        kind: 'donation' as const,
        at: (row.paidAt ?? row.createdAt).toISOString(),
        title: `Donation ${row.reference}`,
        summary: `${fromSubunit(row.amount)} ${row.currency}${row.donorName ? ` — ${row.donorName}` : ''}`,
        email: row.email,
        status: row.status,
        adminPath: '/admin/donations',
      })),
      ...registrations.map((row) => ({
        id: row.id,
        kind: 'registration' as const,
        at: row.createdAt.toISOString(),
        title: row.eventTitle || row.eventSlug || 'Event registration',
        summary: row.name,
        email: row.email,
        status: row.status,
        adminPath: '/admin/inbox',
      })),
      ...stories.map((row) => ({
        id: row.id,
        kind: 'community' as const,
        at: row.createdAt.toISOString(),
        title: row.title,
        summary: row.org ? `${row.name} (${row.org})` : row.name,
        email: row.email,
        status: row.status,
        adminPath: '/admin/inbox',
      })),
      ...subscribers.map((row) => ({
        id: row.id,
        kind: 'newsletter' as const,
        at: row.createdAt.toISOString(),
        title: 'Newsletter signup',
        summary: row.email,
        email: row.email,
        status: 'subscribed',
        adminPath: '/admin/newsletter',
      })),
    ]

    items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())

    return { data: items.slice(0, 60) }
  })
}
