import type { FastifyInstance } from 'fastify'
import { withAdminRoles, anyAdminRole } from '../../plugins/admin-role-guard.js'
import { prisma } from '../../lib/prisma.js'
import { getSiteSettings, mapSiteSettings } from '../../lib/site-settings.js'
import { isPaystackConfigured } from '../../lib/paystack.js'

const PLACEHOLDER_RE =
  /\bplaceholder\b|before (public )?launch|will be updated with our full|coming soon/i

type OpsCheck = {
  id: string
  ok: boolean
  /** When false, shown as a warning but does not block overall readiness. */
  required?: boolean
  label: string
  href?: string
}

export async function adminDashboardRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/admin/dashboard',
    { preHandler: [withAdminRoles(anyAdminRole)] },
    async () => {
      const [
        events,
        publishedEvents,
        messages,
        newMessages,
        donations,
        paidDonations,
        pendingStories,
        newRegistrations,
        newsletterSubscribers,
        settings,
        publishedNews,
        placeholderNews,
        contentBlocks,
        viewsToday,
      ] = await Promise.all([
        prisma.event.count(),
        prisma.event.count({ where: { published: true } }),
        prisma.contactMessage.count(),
        prisma.contactMessage.count({ where: { status: 'new' } }),
        prisma.donation.count(),
        prisma.donation.count({ where: { status: 'success' } }),
        prisma.communitySubmission.count({ where: { status: 'pending' } }),
        prisma.eventRegistration.count({ where: { status: 'new' } }),
        prisma.newsletterSubscriber.count(),
        getSiteSettings(),
        prisma.newsPost.count({ where: { published: true } }),
        prisma.newsPost.count({
          where: { published: true, title: { startsWith: 'Placeholder' } },
        }),
        prisma.contentBlock.findMany({
          where: { published: true },
          select: { key: true, label: true, body: true },
        }),
        prisma.analyticsPageView.count({
          where: {
            createdAt: {
              gte: new Date(
                Date.UTC(
                  new Date().getUTCFullYear(),
                  new Date().getUTCMonth(),
                  new Date().getUTCDate(),
                ),
              ),
            },
          },
        }),
      ])

      const placeholderKeys = contentBlocks
        .filter((block) => PLACEHOLDER_RE.test(block.body))
        .map((block) => ({ key: block.key, label: block.label }))
        .sort((a, b) => a.key.localeCompare(b.key))

      const paystackConfigured = isPaystackConfigured()
      const contactEmailOk = Boolean(settings.contactEmail?.trim())
      const opsChecks: OpsCheck[] = [
        {
          id: 'maintenance',
          ok: !settings.maintenanceMode,
          label: settings.maintenanceMode
            ? 'Maintenance mode is ON — turn off for go-live'
            : 'Maintenance mode is off',
          href: '/admin/settings',
        },
        {
          id: 'contact-email',
          ok: contactEmailOk,
          label: contactEmailOk
            ? 'Contact email is set in Settings'
            : 'Set a public contact email in Settings',
          href: '/admin/settings',
        },
        {
          id: 'events',
          ok: publishedEvents > 0,
          label:
            publishedEvents > 0
              ? `${publishedEvents} published event(s)`
              : 'Publish at least one upcoming event',
          href: '/admin/events',
        },
        {
          id: 'news',
          ok: publishedNews > 0,
          label:
            publishedNews > 0
              ? `${publishedNews} published news/blog post(s)`
              : 'Publish at least one news or blog post',
          href: '/admin/news',
        },
        {
          id: 'paystack',
          ok: paystackConfigured,
          required: false,
          label: paystackConfigured
            ? 'Paystack keys configured (online donate enabled)'
            : 'Paystack not configured — online donate stays offline until keys are set',
          href: '/admin/system',
        },
      ]

      const opsReady = opsChecks.every((check) => check.ok || check.required === false)
      const contentReady = placeholderKeys.length === 0 && placeholderNews === 0
      const ready = opsReady && contentReady

      return {
        data: {
          events: { total: events, published: publishedEvents },
          contactMessages: { total: messages, new: newMessages },
          donations: { total: donations, successful: paidDonations },
          inbox: {
            pendingStories,
            newRegistrations,
          },
          newsletter: { subscribers: newsletterSubscribers },
          news: { published: publishedNews, placeholderTitles: placeholderNews },
          analytics: { viewsToday },
          launchReadiness: {
            ready,
            opsChecks,
            placeholderContentKeys: placeholderKeys,
            placeholderNewsCount: placeholderNews,
            maintenanceMode: settings.maintenanceMode,
            donationsConfigured: paystackConfigured,
          },
          site: mapSiteSettings(settings),
        },
      }
    },
  )
}
