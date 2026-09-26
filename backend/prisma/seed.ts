import { PrismaClient } from '@prisma/client'
import { CONTENT_KEYS, CONTENT_REGISTRY } from '../src/cms/registry.js'
import { LEGACY_ARTS_PROGRAM_SLUGS, LEADERSHIP_PROGRAMS } from '../../lib/leadership/programs.ts'
import { LEGACY_ARTS_EVENT_SLUGS } from '../../lib/leadership/legacy-events.ts'
import { DEFAULT_IMPACT_STATS, DEFAULT_SITE_PROFILE } from '../src/cms/site-defaults.js'
import { DEFAULT_NEWS } from '../src/cms/static-pages.js'
import { slugify } from '../src/lib/slug.js'
import { hashPassword } from '../src/lib/password.js'

const prisma = new PrismaClient()

const LEGACY_ARTS_NEWS_SLUGS = [
  'ananse-storytelling-circle-welcomes-elders-and-youth',
  'kente-weaving-intensive-opens-for-youth-apprentices',
  'drumming-dance-festival-returns-this-december',
  'walking-the-sankofa-path-a-diaspora-reflection',
  'how-youth-leadership-circles-build-confidence-and-service',
  'restorative-arts-healing-through-pattern-color-and-cloth',
]

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME?.trim() || 'Administrator'

  if (!email || !password) {
    console.log('Skipping admin seed (set ADMIN_EMAIL and ADMIN_PASSWORD in .env)')
    return
  }

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters')
  }

  const allowedRoles = new Set(['superadmin', 'admin', 'editor', 'finance'])
  const role = allowedRoles.has(process.env.ADMIN_ROLE?.trim() ?? '')
    ? (process.env.ADMIN_ROLE!.trim() as 'superadmin' | 'admin' | 'editor' | 'finance')
    : 'admin'

  const passwordHash = hashPassword(password)
  await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash, name, role },
    update: { passwordHash, name, role },
  })

  console.log(`Seeded admin user: ${email}`)
}

async function seedSiteSettings() {
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      siteName: DEFAULT_SITE_PROFILE.siteName,
      siteShortName: DEFAULT_SITE_PROFILE.siteShortName,
      siteTagline: DEFAULT_SITE_PROFILE.siteTagline,
      siteLocation: DEFAULT_SITE_PROFILE.siteLocation,
      contactPhone: DEFAULT_SITE_PROFILE.contactPhone,
      contactPhoneHref: DEFAULT_SITE_PROFILE.contactPhoneHref,
      contactEmail: DEFAULT_SITE_PROFILE.contactEmail,
      programsEmail: DEFAULT_SITE_PROFILE.programsEmail,
      contactHours: DEFAULT_SITE_PROFILE.contactHours,
      contactAddress: DEFAULT_SITE_PROFILE.contactAddress,
      impactStats: [...DEFAULT_IMPACT_STATS],
      socialFacebook: DEFAULT_SITE_PROFILE.socialFacebook,
      socialInstagram: DEFAULT_SITE_PROFILE.socialInstagram,
      socialYoutube: DEFAULT_SITE_PROFILE.socialYoutube,
      socialTwitter: DEFAULT_SITE_PROFILE.socialTwitter,
      socialLinkedin: DEFAULT_SITE_PROFILE.socialLinkedin,
      socialWhatsapp: DEFAULT_SITE_PROFILE.socialWhatsapp,
    },
    update: {
      siteName: DEFAULT_SITE_PROFILE.siteName,
      siteShortName: DEFAULT_SITE_PROFILE.siteShortName,
      siteTagline: DEFAULT_SITE_PROFILE.siteTagline,
      siteLocation: DEFAULT_SITE_PROFILE.siteLocation,
      contactAddress: DEFAULT_SITE_PROFILE.contactAddress,
      maintenanceMessage:
        'The ANANSE Center website is undergoing scheduled updates. Thank you for your patience.',
    },
  })
  console.log('Seeded site settings')
}

async function seedContentBlocks() {
  for (const key of CONTENT_KEYS) {
    const entry = CONTENT_REGISTRY[key]
    await prisma.contentBlock.upsert({
      where: { key },
      create: {
        key,
        label: entry.label,
        section: entry.section,
        body: entry.defaultBody,
        format: entry.format ?? 'plain',
        published: true,
      },
      update: {
        label: entry.label,
        section: entry.section,
        // Keep published site copy aligned with registry defaults during launch iteration.
        // Set CMS_PRESERVE_BODIES=1 to skip overwriting custom CMS edits.
        ...(process.env.CMS_PRESERVE_BODIES === '1'
          ? {}
          : { body: entry.defaultBody, format: entry.format ?? 'plain' }),
      },
    })
  }
  console.log(`Seeded ${CONTENT_KEYS.length} registry content blocks`)
}

async function seedEvents() {
  const hidden = await prisma.event.updateMany({
    where: { slug: { in: [...LEGACY_ARTS_EVENT_SLUGS] } },
    data: { published: false, featured: false },
  })
  console.log(`Unpublished ${hidden.count} arts-and-culture events`)
}

async function seedPrograms() {
  for (const program of LEADERSHIP_PROGRAMS) {
    await prisma.program.upsert({
      where: { slug: program.slug },
      create: {
        title: program.title,
        slug: program.slug,
        description: program.description,
        category: program.category,
        section: 'catalog',
        duration: program.duration,
        level: program.level,
        iconKey: program.iconKey,
        features: program.features,
        sortOrder: program.sortOrder,
        published: true,
      },
      update: {
        title: program.title,
        description: program.description,
        category: program.category,
        section: 'catalog',
        duration: program.duration,
        level: program.level,
        iconKey: program.iconKey,
        features: program.features,
        sortOrder: program.sortOrder,
        published: true,
      },
    })
  }
  const hidden = await prisma.program.updateMany({
    where: { slug: { in: [...LEGACY_ARTS_PROGRAM_SLUGS] } },
    data: { published: false },
  })
  console.log(`Seeded ${LEADERSHIP_PROGRAMS.length} programs; unpublished ${hidden.count} arts programs`)
}

async function seedArchives() {
  const items = [
    {
      title: 'Adinkra symbol folio',
      culture: 'Akan',
      era: '20th century teaching collection',
      description:
        'Digitized reference set for symbolism workshops and school programs.',
      rightsNote:
        'Community attribution; educational use with credit to originating stewards.',
      tags: ['adinkra', 'textiles', 'education'],
      sortOrder: 0,
    },
    {
      title: 'Sankofa oral history excerpt',
      culture: 'Pan-African diaspora',
      era: 'Contemporary',
      description:
        'Recorded narrative on repatriation and healing practices near Cape Coast.',
      rightsNote: 'Participant consent on file; metadata includes interviewer and locale.',
      tags: ['oral-history', 'repatriation', 'sankofa'],
      sortOrder: 1,
    },
  ]

  for (const item of items) {
    const existing = await prisma.archiveRecord.findFirst({
      where: { title: item.title },
    })
    if (existing) continue
    await prisma.archiveRecord.create({
      data: {
        ...item,
        tags: 'tags' in item && Array.isArray(item.tags) ? item.tags : [],
        published: true,
      },
    })
  }
  console.log('Seeded archive records')
}

async function seedNews() {
  let order = 0
  let created = 0
  for (const item of DEFAULT_NEWS) {
    const slug = slugify(item.title)
    const linkHref = item.href?.trim() ?? ''
    const body = `<p>${item.excerpt}</p><p>Read more about this story and related programs on our site, or contact the Center to learn how to take part.</p>`
    const existing = await prisma.newsPost.findUnique({ where: { slug } })
    if (existing) {
      // Refresh placeholder posts only; leave custom posts alone
      if (existing.title.startsWith('Placeholder') || item.title.startsWith('Placeholder')) {
        await prisma.newsPost.update({
          where: { slug },
          data: {
            title: item.title,
            excerpt: item.excerpt,
            body,
            dateLabel: item.date,
            author: 'Ananse Center',
            category: 'News',
            featured: order === 0,
            linkHref,
            published: true,
            sortOrder: order,
          },
        })
      }
    } else {
      await prisma.newsPost.create({
        data: {
          title: item.title,
          slug,
          excerpt: item.excerpt,
          body,
          dateLabel: item.date,
          author: 'Ananse Center',
          category: 'News',
          featured: order === 0,
          linkHref,
          published: true,
          sortOrder: order,
        },
      })
      created += 1
    }
    order += 1
  }
  console.log(
    created > 0
      ? `Seeded ${created} news posts (${DEFAULT_NEWS.length} placeholder templates)`
      : `News posts ready (${DEFAULT_NEWS.length} placeholder templates checked)`,
  )
}

import { seedStageCContent } from './seed-stage-c.js'

async function main() {
  await seedSiteSettings()
  await seedContentBlocks()
  await seedPrograms()
  await seedEvents()
  const hiddenNews = await prisma.newsPost.updateMany({
    where: { slug: { in: LEGACY_ARTS_NEWS_SLUGS } },
    data: { published: false, featured: false },
  })
  console.log(`Unpublished ${hiddenNews.count} arts-and-culture news posts`)
  await seedStageCContent(prisma)
  await seedAdmin()
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
