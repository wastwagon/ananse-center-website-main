import type { FastifyInstance } from 'fastify'
import { withAdminRoles, anyAdminRole } from '../../plugins/admin-role-guard.js'
import { prisma } from '../../lib/prisma.js'

function startOfUtcDay(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

function daysAgoUtc(days: number) {
  const d = startOfUtcDay()
  d.setUTCDate(d.getUTCDate() - days)
  return d
}

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

export async function adminAnalyticsRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/admin/analytics',
    { preHandler: [withAdminRoles(anyAdminRole)] },
    async () => {
      const now = new Date()
      const todayStart = startOfUtcDay(now)
      const day7 = daysAgoUtc(6)
      const day30 = daysAgoUtc(29)
      const seriesStart = daysAgoUtc(13)

      const [viewsToday, views7d, views30d, uniquesToday, uniques7d, topPaths, topReferrers, recent] =
        await Promise.all([
          prisma.analyticsPageView.count({ where: { createdAt: { gte: todayStart } } }),
          prisma.analyticsPageView.count({ where: { createdAt: { gte: day7 } } }),
          prisma.analyticsPageView.count({ where: { createdAt: { gte: day30 } } }),
          prisma.analyticsPageView
            .findMany({
              where: { createdAt: { gte: todayStart } },
              distinct: ['sessionId'],
              select: { sessionId: true },
            })
            .then((rows) => rows.length),
          prisma.analyticsPageView
            .findMany({
              where: { createdAt: { gte: day7 } },
              distinct: ['sessionId'],
              select: { sessionId: true },
            })
            .then((rows) => rows.length),
          prisma.analyticsPageView.groupBy({
            by: ['path'],
            where: { createdAt: { gte: day30 } },
            _count: { _all: true },
            orderBy: { _count: { path: 'desc' } },
            take: 12,
          }),
          prisma.analyticsPageView.groupBy({
            by: ['referrer'],
            where: { createdAt: { gte: day30 }, NOT: { referrer: '' } },
            _count: { _all: true },
            orderBy: { _count: { referrer: 'desc' } },
            take: 8,
          }),
          prisma.analyticsPageView.findMany({
            where: { createdAt: { gte: seriesStart } },
            select: { createdAt: true },
          }),
        ])

      const seriesMap = new Map<string, number>()
      for (let i = 13; i >= 0; i -= 1) {
        seriesMap.set(dateKey(daysAgoUtc(i)), 0)
      }
      for (const row of recent) {
        const key = dateKey(row.createdAt)
        if (seriesMap.has(key)) {
          seriesMap.set(key, (seriesMap.get(key) || 0) + 1)
        }
      }

      return {
        data: {
          selfHosted: true,
          range: { today: dateKey(todayStart), days7: dateKey(day7), days30: dateKey(day30) },
          totals: {
            viewsToday,
            views7d,
            views30d,
            uniquesToday,
            uniques7d,
          },
          series14d: Array.from(seriesMap.entries()).map(([date, views]) => ({ date, views })),
          topPages: topPaths.map((row) => ({ path: row.path, views: row._count._all })),
          topReferrers: topReferrers.map((row) => ({
            referrer: row.referrer || '(direct)',
            views: row._count._all,
          })),
        },
      }
    },
  )
}
