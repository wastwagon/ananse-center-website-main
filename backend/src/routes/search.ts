import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

const PAGE_LABELS: Record<string, string> = {
  'about.hero.lead': 'About',
  'programs.catalog.heading': 'Programs',
  'events.catalog.heading': 'Events',
  'support.hero.lead': 'Support',
  'library.hero.lead': 'Library',
  'insights.hero.lead': 'Insights',
  'people.hero.lead': 'People',
  'get-involved.hero.lead': 'Get Involved',
}

const PAGE_PATHS: Record<string, string> = {
  about: '/about',
  programs: '/programs',
  events: '/events',
  support: '/support',
  library: '/library',
  insights: '/insights',
  people: '/people',
  'get-involved': '/get-involved',
}

function pathForContentKey(key: string): string | null {
  const section = key.split('.')[0]
  return PAGE_PATHS[section] ?? null
}

function plainSnippet(value: string, maxLen: number) {
  const plain = value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
  if (plain.length <= maxLen) return plain
  return `${plain.slice(0, maxLen - 1).trimEnd()}…`
}

export async function searchRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { q?: string } }>('/api/v1/search', async (request) => {
    const q = request.query.q?.trim() ?? ''
    if (q.length < 2) {
      return {
        data: {
          programs: [],
          events: [],
          archives: [],
          news: [],
          insights: [],
          library: [],
          people: [],
          photoAlbums: [],
          pages: [],
        },
      }
    }

    const contains = { contains: q, mode: 'insensitive' as const }

    const [programs, events, newsPosts, libraryItems, people, photoAlbums, blocks] = await Promise.all([
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
          OR: [
            { title: contains },
            { description: contains },
            { location: contains },
            { type: contains },
            { venue: contains },
            { subtitle: contains },
            { transcript: contains },
            { meetingUrl: contains },
          ],
        },
        take: 12,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.newsPost.findMany({
        where: {
          published: true,
          OR: [
            { title: contains },
            { subtitle: contains },
            { excerpt: contains },
            { body: contains },
            { contentType: contains },
            { author: contains },
            { topics: { string_contains: q } },
          ],
        },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.libraryItem.findMany({
        where: {
          published: true,
          OR: [
            { title: contains },
            { description: contains },
            { body: contains },
            { transcript: contains },
            { collection: contains },
            { wisdomNugget: contains },
            { scriptureTheme: contains },
            { keywords: contains },
            { dateLabel: contains },
            { person: { name: contains } },
            { topics: { string_contains: q } },
          ],
        },
        take: 10,
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.person.findMany({
        where: {
          published: true,
          OR: [
            { name: contains },
            { roleTitle: contains },
            { bio: contains },
            { organizationName: contains },
            { expertise: contains },
            { cohortLabel: contains },
          ],
        },
        take: 10,
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.photoAlbum.findMany({
        where: {
          published: true,
          OR: [
            { title: contains },
            { description: contains },
            { place: contains },
            { collection: contains },
          ],
        },
        take: 8,
        orderBy: { sortOrder: 'asc' },
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

    const insightHits = newsPosts.map((n) => ({
      title: n.title,
      path:
        n.linkHref?.trim() && /^https?:\/\//i.test(n.linkHref) ? n.linkHref : `/insights/${n.slug}`,
      snippet: n.excerpt.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140),
      contentType: n.contentType,
    }))

    return {
      data: {
        programs: programs.map((p) => ({
          title: p.title,
          path: `/programs/${p.slug}`,
          snippet: plainSnippet(p.description, 140),
        })),
        events: events.map((e) => ({
          title: e.title,
          path: `/events/${e.slug}`,
          snippet: `${e.deliveryMode === 'online' ? 'Online · ' : ''}${plainSnippet(e.description, 120)}`,
        })),
        archives: [],
        news: [],
        insights: insightHits,
        library: libraryItems.map((item) => ({
          title: item.title,
          path: `/library/${item.slug}`,
          snippet: `${item.shelf} · ${item.collection} — ${plainSnippet(item.description, 100)}`,
        })),
        people: people.map((person) => ({
          title: person.name,
          path: `/people/${person.slug}`,
          snippet: person.roleTitle || plainSnippet(person.bio, 120),
        })),
        photoAlbums: photoAlbums.map((album) => ({
          title: album.title,
          path: `/library/photos/${album.slug}`,
          snippet: `${album.collection} · ${plainSnippet(album.description, 100)}`,
        })),
        pages,
      },
    }
  })
}
