/**
 * Populate 3 News + 3 Blog posts with full HTML bodies and cover images.
 * Run: npx tsx prisma/seed-news-content.ts
 */
import { copyFile, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import { PrismaClient } from '@prisma/client'
import { slugify } from '../src/lib/slug.js'

const prisma = new PrismaClient()
const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const uploadDir = process.env.MEDIA_UPLOAD_DIR?.trim()
  ? path.resolve(process.env.MEDIA_UPLOAD_DIR)
  : path.join(backendRoot, 'uploads')
// Prefer seed-assets (mounted in Docker); fall back to public/images/news on host.
const imageDirCandidates = [
  path.join(backendRoot, 'seed-assets/news'),
  path.join(backendRoot, '../public/images/news'),
]

type PostSeed = {
  title: string
  category: 'News' | 'Blog'
  dateLabel: string
  author: string
  featured: boolean
  sortOrder: number
  imageFile: string
  imageAlt: string
  excerpt: string
  body: string
}

const POSTS: PostSeed[] = [
  {
    title: 'Ananse Storytelling Circle Welcomes Elders and Youth',
    category: 'News',
    dateLabel: '10 August 2026',
    author: 'Ananse Center Communications',
    featured: true,
    sortOrder: 1,
    imageFile: 'news-storytelling-circle.png',
    imageAlt: 'Elders and youth gathered in an outdoor storytelling circle',
    excerpt:
      'A new monthly storytelling circle brings elders and young learners together under the trees at our Akatakyiwa campus.',
    body: `
<p>This month The Ananse Center opened a monthly <strong>Storytelling Circle</strong> on the Akatakyiwa campus — a simple gathering where elders, youth, and visiting diaspora guests sit together to share proverb, song, and memory.</p>
<p>The first session began with libation and greeting songs, then moved into stories of migration, farming seasons, and the meaning of Sankofa for everyday choices. Young people were invited not only to listen, but to retell one lesson in their own words.</p>
<h2>Why this matters</h2>
<p>Oral tradition is not a performance for tourists. It is a living classroom. When elders and youth share the same circle, language, patience, and belonging are restored at the same time.</p>
<ul>
  <li>Open to community members and registered program participants</li>
  <li>Held on the second Saturday of each month</li>
  <li>Facilitated in English and local languages as needed</li>
</ul>
<p>Families interested in joining the next circle can register through our <a href="/events">events calendar</a> or contact the programs team.</p>
`.trim(),
  },
  {
    title: 'Kente Weaving Intensive Opens for Youth Apprentices',
    category: 'News',
    dateLabel: '5 August 2026',
    author: 'Programs Office',
    featured: false,
    sortOrder: 2,
    imageFile: 'news-kente-workshop.png',
    imageAlt: 'Master weaver teaching a youth apprentice at a kente loom',
    excerpt:
      'A hands-on kente weaving intensive pairs master artisans with youth apprentices for skill, discipline, and cultural pride.',
    body: `
<p>The Ananse Center has launched a <strong>Kente Weaving Intensive</strong> that places youth apprentices beside master weavers for guided practice on traditional looms.</p>
<p>Over several weekends, participants learn warp preparation, pattern reading, and the stories carried in cloth. The program emphasizes respect for craft lineages while building practical skill that can support livelihoods.</p>
<h2>What apprentices learn</h2>
<ul>
  <li>Loom setup and basic pattern construction</li>
  <li>Color symbolism and cultural context</li>
  <li>Studio discipline, care of tools, and collaborative work</li>
</ul>
<p>Spaces are limited. Prospective apprentices and parents can learn more on our <a href="/programs">programs page</a> or apply through the contact form.</p>
`.trim(),
  },
  {
    title: 'Drumming & Dance Festival Returns This December',
    category: 'News',
    dateLabel: '1 August 2026',
    author: 'Events Team',
    featured: false,
    sortOrder: 3,
    imageFile: 'news-drumming-festival.png',
    imageAlt: 'Community dancing to traditional drums at an outdoor festival',
    excerpt:
      'Our Traditional Drumming & Dance Festival returns in December with ensembles, youth showcases, and community workshops.',
    body: `
<p>Save the date: The Ananse Center’s <strong>Traditional Drumming & Dance Festival</strong> returns this December with ensembles, youth showcases, and open workshops for the wider community.</p>
<p>Visitors can expect rhythm clinics for beginners, evening performances, and spaces for families to dance together. Local groups and diaspora guests are welcome.</p>
<h2>Festival highlights</h2>
<ul>
  <li>Youth ensemble showcase</li>
  <li>Master drummer workshops</li>
  <li>Community dance circles open to all ages</li>
</ul>
<p>Registration and volunteer openings will be posted on the <a href="/events">events page</a>. Partners interested in supporting instruments, meals, or travel stipends can reach us via <a href="/contact#form">Contact</a>.</p>
`.trim(),
  },
  {
    title: 'Walking the Sankofa Path: A Diaspora Reflection',
    category: 'Blog',
    dateLabel: '8 August 2026',
    author: 'Guest Contributor',
    featured: true,
    sortOrder: 4,
    imageFile: 'blog-sankofa-journey.png',
    imageAlt: 'Visitor walking a green path toward a cultural pavilion in Ghana',
    excerpt:
      'A diaspora guest reflects on returning to Ghana — not as tourism, but as a practice of listening, repair, and belonging.',
    body: `
<p>People often ask what a “Sankofa journey” feels like. For many of us in the diaspora, it is less a checklist of sites and more a change in posture: we come to listen before we speak.</p>
<p>At The Ananse Center, mornings begin quietly — walking the path toward the pavilion, greeting facilitators, sitting with elders who do not rush the conversation. The past is not a museum exhibit; it is a teacher sitting across from you.</p>
<h2>What the path teaches</h2>
<p>Sankofa asks us to fetch what was left behind without becoming trapped in nostalgia. In practice that means learning songs, admitting what we do not know, and offering our skills in service to the community that hosts us.</p>
<blockquote>
  <p>Go back and fetch it — then walk forward with others.</p>
</blockquote>
<p>If you are planning a restorative visit, begin with our <a href="/repatriation">repatriation</a> and <a href="/visit">visit</a> pages, then write to the team so your journey can be prepared with care.</p>
`.trim(),
  },
  {
    title: 'How Youth Leadership Circles Build Confidence and Service',
    category: 'Blog',
    dateLabel: '3 August 2026',
    author: 'Leadership Faculty',
    featured: false,
    sortOrder: 5,
    imageFile: 'blog-youth-leadership.png',
    imageAlt: 'Young adults in a leadership workshop circle at the cultural center',
    excerpt:
      'Inside our youth leadership circles: dialogue, values, and service projects rooted in Ubuntu and Pan-African purpose.',
    body: `
<p>Our <strong>Youth Leadership Circles</strong> are designed as practice rooms for courage. Participants sit in a facilitated circle, name a challenge in their community, and design a small service response they can complete within weeks — not years.</p>
<p>Sessions blend African values, public speaking, conflict listening, and project planning. Mentors help youth move from opinion to action without losing humility.</p>
<h2>A typical circle</h2>
<ol>
  <li>Check-in and shared intention</li>
  <li>Short teaching on a value (Ubuntu, integrity, stewardship)</li>
  <li>Peer coaching on a real community problem</li>
  <li>Commitments for the week ahead</li>
</ol>
<p>Graduates often continue as peer mentors in arts and culture programs. Read more about pathways on the <a href="/programs">programs</a> page, or ask about the next cohort through <a href="/contact#form">Contact</a>.</p>
`.trim(),
  },
  {
    title: 'Restorative Arts: Healing Through Pattern, Color, and Cloth',
    category: 'Blog',
    dateLabel: '28 July 2026',
    author: 'Restorative Arts Studio',
    featured: false,
    sortOrder: 6,
    imageFile: 'blog-restorative-arts.png',
    imageAlt: 'Hands painting Adinkra-inspired patterns on fabric at a studio table',
    excerpt:
      'How restorative arts sessions use pattern, color, and cloth as tools for emotional healing and cultural reconnection.',
    body: `
<p>In the Restorative Arts Studio, healing does not always begin with words. It may begin with a brush, a stamp, or the slow rhythm of painting Adinkra-inspired patterns onto cloth.</p>
<p>Participants are guided to notice breath, choose colors with intention, and reflect on symbols that speak to protection, wisdom, and community. The work is creative and therapeutic at once — never rushed, never graded.</p>
<h2>Who these sessions serve</h2>
<ul>
  <li>Local youth navigating stress and identity questions</li>
  <li>Diaspora guests seeking embodied cultural reconnection</li>
  <li>Community groups requesting closed restorative workshops</li>
</ul>
<p>Finished pieces sometimes join exhibitions or remain private, according to each participant’s choice. Explore related offerings under <a href="/programs">Programs</a>, or request a group session via <a href="/contact#form">Contact</a>.</p>
`.trim(),
  },
]

async function resolveImageDir() {
  for (const dir of imageDirCandidates) {
    try {
      await stat(dir)
      return dir
    } catch {
      // try next
    }
  }
  throw new Error(`News image folder not found. Tried: ${imageDirCandidates.join(', ')}`)
}

async function ensureMedia(
  imageFile: string,
  title: string,
  altText: string,
  client: PrismaClient = prisma,
) {
  const existing = await client.mediaAsset.findFirst({
    where: { originalName: imageFile },
    orderBy: { createdAt: 'desc' },
  })
  if (existing) return existing

  const imageDir = await resolveImageDir()
  const source = path.join(imageDir, imageFile)
  await stat(source)
  await mkdir(uploadDir, { recursive: true })

  const storedName = `${randomUUID()}.png`
  const dest = path.join(uploadDir, storedName)
  await copyFile(source, dest)
  const info = await stat(dest)

  return client.mediaAsset.create({
    data: {
      filename: storedName,
      originalName: imageFile,
      mimeType: 'image/png',
      sizeBytes: info.size,
      title,
      altText,
    },
  })
}

export async function seedNewsContent(client: PrismaClient = prisma) {
  // Remove previous placeholder posts so the listing stays focused
  await client.newsPost.deleteMany({
    where: {
      OR: [
        { title: { startsWith: 'Placeholder' } },
        {
          slug: {
            in: [
              'sankofa-journey-gathering-opens-registration',
              'community-spotlight-kente-collective-partnership',
            ],
          },
        },
      ],
    },
  })

  for (const post of POSTS) {
    const slug = slugify(post.title)
    const media = await ensureMedia(post.imageFile, post.title, post.imageAlt, client)

    await client.newsPost.upsert({
      where: { slug },
      create: {
        title: post.title,
        slug,
        excerpt: post.excerpt,
        body: post.body,
        dateLabel: post.dateLabel,
        author: post.author,
        category: post.category,
        featured: post.featured,
        published: true,
        sortOrder: post.sortOrder,
        coverMediaId: media.id,
        linkHref: '',
      },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        dateLabel: post.dateLabel,
        author: post.author,
        category: post.category,
        featured: post.featured,
        published: true,
        sortOrder: post.sortOrder,
        coverMediaId: media.id,
        linkHref: '',
      },
    })
    console.log(`Upserted ${post.category}: ${slug}`)
  }

  const count = await client.newsPost.count({ where: { published: true } })
  console.log(`Done. Published posts: ${count}`)
}

const isDirectRun = process.argv[1]?.includes('seed-news-content')
if (isDirectRun) {
  seedNewsContent()
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
