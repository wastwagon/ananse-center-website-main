import { PrismaClient } from '@prisma/client'
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

const contentBlocks = [
  {
    key: 'home.hero.lead',
    label: 'Home hero description',
    section: 'home',
    body:
      'Preserving heritage, restoring identity, and developing the next generation of Pan-African leaders through Sankofa arts and culture programs in Ghana and across the diaspora.',
  },
  {
    key: 'home.story.intro',
    label: 'Our story intro',
    section: 'home',
    body:
      'The Ananse Center for Arts and Culture is a living space for African heritage, creativity, and leadership development.',
  },
  {
    key: 'about.mission',
    label: 'About mission statement',
    section: 'about',
    body:
      'We weave wisdom into solutions by connecting cultural knowledge with practical programs that empower youth and communities.',
  },
]

async function seedSiteSettings() {
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    create: { id: 'default' },
    update: {},
  })
  console.log('Seeded site settings')
}

async function seedContentBlocks() {
  for (const block of contentBlocks) {
    await prisma.contentBlock.upsert({
      where: { key: block.key },
      create: block,
      update: {
        label: block.label,
        section: block.section,
        body: block.body,
      },
    })
  }
  console.log(`Seeded ${contentBlocks.length} content blocks`)
}

async function main() {
  await seedSiteSettings()
  await seedContentBlocks()

  for (const event of events) {
    const slug = slugify(event.title)
    await prisma.event.upsert({
      where: { slug },
      create: { ...event, slug },
      update: event,
    })
  }

  console.log(`Seeded ${events.length} events`)
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
