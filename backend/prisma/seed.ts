import { PrismaClient } from '@prisma/client'
import { CONTENT_KEYS, CONTENT_REGISTRY } from '../src/cms/registry.js'
import { EVENT_DETAIL_SEED } from '../src/cms/event-detail-seed.js'
import { PROGRAMS_SEED } from '../src/cms/programs-seed.js'
import { DEFAULT_IMPACT_STATS, DEFAULT_SITE_PROFILE } from '../src/cms/site-defaults.js'
import { slugify } from '../src/lib/slug.js'
import { hashPassword } from '../src/lib/password.js'

const prisma = new PrismaClient()

const events = [
  {
    title: 'Ananse Storytelling Festival',
    description:
      'A celebration of African oral traditions featuring master storytellers, cultural performances, and community workshops.',
    dateLabel: 'March 15-17, 2025',
    location: 'Accra, Ghana',
    type: 'Festival',
    imageEmoji: '🎭',
    featured: true,
  },
  {
    title: 'Kente Weaving Workshop Series',
    description:
      'Learn the ancient art of Kente weaving from master weavers in this hands-on workshop series.',
    dateLabel: 'Every Saturday in April',
    location: 'Kumasi, Ghana',
    type: 'Workshop',
    imageEmoji: '🧵',
    featured: false,
  },
  {
    title: 'Diaspora Reconnection Retreat',
    description:
      'A transformative retreat for members of the African diaspora seeking to reconnect with their heritage.',
    dateLabel: 'May 10-12, 2025',
    location: 'Cape Coast, Ghana',
    type: 'Retreat',
    imageEmoji: '🌿',
    featured: true,
  },
  {
    title: 'Contemporary African Art Exhibition',
    description:
      'Showing the work of emerging and established African artists exploring themes of identity and heritage.',
    dateLabel: 'June 1-30, 2025',
    location: 'Accra Arts Center',
    type: 'Exhibition',
    imageEmoji: '🖼️',
    featured: false,
  },
  {
    title: 'Traditional Drumming & Dance Festival',
    description:
      'Experience the power and beauty of traditional African drumming and dance in this vibrant festival.',
    dateLabel: 'July 20-22, 2025',
    location: 'Tamale, Ghana',
    type: 'Festival',
    imageEmoji: '🥁',
    featured: false,
  },
  {
    title: 'Cultural Heritage Symposium',
    description:
      'Academic and community discussions on preserving and celebrating African cultural heritage.',
    dateLabel: 'September 5-7, 2025',
    location: 'University of Ghana',
    type: 'Symposium',
    imageEmoji: '🎓',
    featured: true,
  },
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

  const passwordHash = hashPassword(password)
  await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash, name, role: 'admin' },
    update: { passwordHash, name },
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
    },
    update: {},
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
      },
    })
  }
  console.log(`Seeded ${CONTENT_KEYS.length} registry content blocks`)
}

async function seedEvents() {
  for (const event of events) {
    const slug = slugify(event.title)
    const detail = EVENT_DETAIL_SEED[slug]
    await prisma.event.upsert({
      where: { slug },
      create: {
        ...event,
        slug,
        venue: detail?.venue ?? '',
        storyTitle: detail?.storyTitle ?? null,
        storyBody: detail?.storyBody ?? null,
        highlights: detail?.highlights ?? [],
      },
      update: {
        ...event,
        venue: detail?.venue ?? '',
        storyTitle: detail?.storyTitle ?? null,
        storyBody: detail?.storyBody ?? null,
        highlights: detail?.highlights ?? [],
      },
    })
  }
  console.log(`Seeded ${events.length} events`)
}

async function seedPrograms() {
  for (const program of PROGRAMS_SEED) {
    const slug = slugify(program.title)
    await prisma.program.upsert({
      where: { slug },
      create: {
        title: program.title,
        slug,
        description: program.description,
        category: program.category,
        section: program.section,
        duration: program.duration,
        level: program.level,
        iconKey: program.iconKey,
        features: [...program.features],
        sortOrder: program.sortOrder,
        published: true,
      },
      update: {
        title: program.title,
        description: program.description,
        category: program.category,
        section: program.section,
        duration: program.duration,
        level: program.level,
        iconKey: program.iconKey,
        features: [...program.features],
        sortOrder: program.sortOrder,
      },
    })
  }
  console.log(`Seeded ${PROGRAMS_SEED.length} programs`)
}

async function main() {
  await seedSiteSettings()
  await seedContentBlocks()
  await seedPrograms()
  await seedEvents()
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
