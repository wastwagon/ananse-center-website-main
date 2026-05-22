import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

const PAGE_LABELS: Record<string, string> = {
  'about.hero.lead': 'About',
  'programs.catalog.heading': 'Programs',
  'events.catalog.heading': 'Events',
  'support.hero.lead': 'Support',
  'repatriation.heading': 'Repatriation',
  'trustees.heading': 'Trustees',
  'transparency.heading': 'Transparency',
  'archives.heading': 'Archives',
  'resources.heading': 'CSO Directory',
  'community.heading': 'Community',
  'news.heading': 'News',
  'visit.heading': 'Visit',
  'admissions.heading': 'Admissions',
}

const PAGE_PATHS: Record<string, string> = {
  about: '/about',
  programs: '/programs',
  events: '/events',
  support: '/support',
  repatriation: '/repatriation',
  trustees: '/trustees',
  transparency: '/transparency',
  archives: '/archives',
  resources: '/resources',
  community: '/community',
  news: '/news',
  visit: '/visit',
  admissions: '/admissions',
}

function pathForContentKey(key: string): string | null {
  const section = key.split('.')[0]
  return PAGE_PATHS[section] ?? null
}

export async function searchRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { q?: string } }>('/api/v1/search', async (request) => {
    const q = request.query.q?.trim() ?? ''
    if (q.length < 2) {
      return { data: { programs: [], events: [], pages: [] } }
    }

    const contains = { contains: q, mode: 'insensitive' as const }

    const [programs, events, blocks] = await Promise.all([
      prisma.program.findMany({
        where: {
          published: true,
          OR: [{ title: contains }, { description: contains }, { category: contains }],
        },
        take: 12,
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.event.findMany({
        where: {
          published: true,
          OR: [{ title: contains }, { description: contains }, { location: contains }, { type: contains }],
        },
        take: 12,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contentBlock.findMany({
        where: {
          published: true,
          OR: [{ key: contains }, { body: contains }, { label: contains }],
        },
        take: 20,
      }),
    ])

    const pages = blocks
      .map((block) => {
        const path = pathForContentKey(block.key)
        if (!path) return null
        const snippet = block.body.replace(/\s+/g, ' ').slice(0, 160)
        return {
          title: PAGE_LABELS[block.key] ?? block.label,
          path,
          snippet,
        }
      })
      .filter((item): item is { title: string; path: string; snippet: string } => item !== null)
      .filter((item, index, arr) => arr.findIndex((x) => x.path === item.path) === index)
      .slice(0, 8)

    return {
      data: {
        programs: programs.map((p) => ({
          title: p.title,
          path: `/programs#catalog`,
          snippet: p.description.slice(0, 140),
        })),
        events: events.map((e) => ({
          title: e.title,
          path: `/events/${e.slug}`,
          snippet: e.description.slice(0, 140),
        })),
        pages,
      },
    }
  })
}
