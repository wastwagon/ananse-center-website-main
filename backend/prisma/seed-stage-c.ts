/**
 * Stage C — content entry from client-supplied institutional copy only.
 * Caps used here: 8 Insights + 15 Library Read pieces. No invented people,
 * events, Midday episode media, or photo albums (those remain blocked until
 * OceanCyber receives agreed lists / files / dates).
 */
import type { PrismaClient } from '@prisma/client'
import { slugify } from '../src/lib/slug.js'

const AUTHOR = 'ANANSE Center'

type InsightSeed = {
  title: string
  slug: string
  excerpt: string
  body: string
  topics: string[]
  contentType: string
  featured?: boolean
  showInLibraryRead?: boolean
  sortOrder: number
}

type LibrarySeed = {
  title: string
  slug: string
  description: string
  body: string
  collection: string
  topics: string[]
  wisdomNugget?: string
  featured?: boolean
  sortOrder: number
}

/** Eight Insights drawn from About / identity copy they already approved. */
export const STAGE_C_INSIGHTS: InsightSeed[] = [
  {
    title: 'Leadership Is More Than Position',
    slug: 'leadership-is-more-than-position',
    excerpt:
      'Leadership is character in action. It is responsibility, influence, wisdom, and service.',
    body: `Leadership is character in action. It is responsibility, influence, wisdom, and service.

At ANANSE, we believe that developing effective leaders requires more than teaching skills. It requires developing the whole person—strengthening character, deepening understanding, nurturing authentic spirituality, encouraging excellence, and equipping people to respond creatively to the challenges around them.

We bring people together through education, mentorship, lectures, conversations, publications, and practical initiatives designed to add value to people's lives.`,
    topics: ['Leadership', 'Character', 'Personal Growth'],
    contentType: 'Leadership Reflections',
    featured: true,
    showInLibraryRead: true,
    sortOrder: 1,
  },
  {
    title: 'Character Before Influence',
    slug: 'character-before-influence',
    excerpt:
      'Leadership without character can become an exercise in power. For ANANSE, leadership development helps people become those who can be trusted with leadership.',
    body: `Leadership without character can become an exercise in power.
Competence without wisdom can produce unintended consequences.
Knowledge without responsibility can fail to serve society.

For ANANSE, leadership development therefore involves more than preparing people to do leadership. It involves helping them become people who can be trusted with leadership.

We emphasize:

Character — Integrity, responsibility, courage, humility, and trustworthiness.

Competence — Knowledge, skills, judgment, creativity, and the ability to perform with excellence.

Wisdom — The capacity to understand situations, discern what matters, and make responsible decisions.

Purpose — Knowing why we lead and understanding the responsibilities that accompany influence.

Service — Using leadership not merely for personal advancement, but to add value to the lives of others.`,
    topics: ['Character', 'Leadership', 'Excellence'],
    contentType: 'Articles',
    featured: true,
    showInLibraryRead: true,
    sortOrder: 2,
  },
  {
    title: 'From Learning to Transformation',
    slug: 'from-learning-to-transformation',
    excerpt:
      'Effective leadership development moves through Learn, Develop, and Serve—so people are not only informed, but formed.',
    body: `ANANSE believes that effective leadership development should move through three interconnected stages:

Learn — Acquire knowledge, encounter ideas, ask questions, and develop understanding.

Develop — Apply what has been learned, build practical skills, receive mentoring, and develop character.

Serve — Use knowledge, skills, relationships, and influence to create meaningful value for others.

The goal is not simply informed people. It is formed people—people whose knowledge, character, competence, and influence are increasingly aligned.`,
    topics: ['Education', 'Mentorship', 'Personal Growth'],
    contentType: 'Essays',
    showInLibraryRead: true,
    sortOrder: 3,
  },
  {
    title: 'Rooted in Africa. Open to the World.',
    slug: 'rooted-in-africa-open-to-the-world',
    excerpt:
      'ANANSE carries an African identity while engaging questions of leadership and human development that are shared across societies.',
    body: `ANANSE carries an African identity and is particularly concerned with the development of people, institutions, and communities across the African continent and diaspora.

Our African focus is not simply geographical. It reflects a conviction that Africa possesses immense human potential, wisdom, creativity, and resources—and that developing this potential requires investment in people.

We seek to contribute by encouraging leadership, education, mentorship, practical skills, innovation, excellence, and responsible service.

At the same time, ANANSE's conversations and resources are not limited to Africa. The challenges of leadership, character, relationships, culture, spirituality, education, and human development are shared across societies.

Our roots are African. Our conversations are global.`,
    topics: ['Africa & Development', 'Society', 'Leadership'],
    contentType: 'Perspectives',
    sortOrder: 4,
  },
  {
    title: 'Developing People for Life, Leadership, and Service',
    slug: 'developing-people-for-life-leadership-and-service',
    excerpt:
      'ANANSE’s mission brings together leadership education, mentoring, intellectual engagement, authentic spirituality, and practical service.',
    body: `To develop people through leadership education, mentoring, intellectual engagement, authentic spirituality, and practical service, equipping them to lead with character, excellence, and purpose.

Our mission brings together five dimensions of development:

Leadership education — Providing knowledge, frameworks, and practical tools for effective leadership.

Mentoring — Connecting emerging leaders with people whose experience and wisdom can help guide their development.

Intellectual engagement — Encouraging thoughtful inquiry, critical thinking, conversation, and lifelong learning.

Authentic spirituality — Recognizing the importance of genuine inner transformation, values, meaning, and a life grounded in authentic spiritual convictions.

Practical service — Turning knowledge and influence into meaningful contribution and service to others.`,
    topics: ['Leadership', 'Mentorship', 'Authentic Spirituality', 'Education'],
    contentType: 'Articles',
    sortOrder: 5,
  },
  {
    title: 'A Generation Prepared to Lead and Serve',
    slug: 'a-generation-prepared-to-lead-and-serve',
    excerpt:
      'Our vision extends beyond preparing people for positions of leadership to the responsibilities that accompany influence.',
    body: `A generation of principled, competent, spiritually grounded, and transformational leaders who use their influence to serve others and strengthen society.

Our vision extends beyond preparing people for positions of leadership. We seek to prepare people for the responsibilities that accompany influence—in their families, professions, institutions, communities, and society.`,
    topics: ['Leadership', 'Service', 'Society'],
    contentType: 'Special Reflections',
    sortOrder: 6,
  },
  {
    title: 'The Wisdom Behind the Name',
    slug: 'the-wisdom-behind-the-name',
    excerpt:
      'Ananse stories teach wisdom and resourcefulness. The name ANANSE also represents African Network & Advisory for Needed Services & Excellence.',
    body: `Ananse is the Ghanaian word for spider and is one of the most recognizable figures in Ghanaian traditional storytelling.

In Ghanaian folk stories, Ananse is often used as a didactic character—a vehicle through which wisdom and life lessons are communicated. The stories explore themes such as wisdom, wit, resourcefulness, and creative problem-solving.

The spider therefore provides an apt metaphor for the spirit of ANANSE: the ability to think creatively, learn from experience, work with available resources, solve problems, and navigate the complexities of life with purpose.

The name ANANSE also represents: African Network & Advisory for Needed Services & Excellence.

Together, the name and the acronym express our commitment to developing people, sharing knowledge, building practical capacity, and contributing solutions to real needs.`,
    topics: ['Music & Culture', 'Africa & Development', 'Personal Growth'],
    contentType: 'Essays',
    sortOrder: 7,
  },
  {
    title: 'Leadership Is a Shared Journey',
    slug: 'leadership-is-a-shared-journey',
    excerpt:
      'ANANSE is a growing community of people who believe that we become better leaders by continuing to learn, grow, and serve.',
    body: `ANANSE is more than a collection of programs. It is a growing community of people who believe that we become better leaders by continuing to learn, grow, and serve.

Our community includes leaders, mentors, educators, professionals, students, young people, speakers, partners, and friends who contribute their experience, ideas, time, and resources.

Each person brings something to the table. Together, we create opportunities for wisdom to be shared, questions to be explored, potential to be developed, and lives to be strengthened.`,
    topics: ['Mentorship', 'Personal Growth', 'Society'],
    contentType: 'Leadership Reflections',
    sortOrder: 8,
  },
]

/** Fifteen Library Read items: seven Wisdom Nuggets + eight study excerpts. */
export const STAGE_C_LIBRARY: LibrarySeed[] = [
  {
    title: 'Character',
    slug: 'wisdom-nugget-character',
    description: 'We value integrity, honesty, responsibility, and moral courage.',
    body: 'We value integrity, honesty, responsibility, and moral courage.',
    collection: 'Wisdom Nuggets',
    topics: ['Character'],
    wisdomNugget: 'We value integrity, honesty, responsibility, and moral courage.',
    featured: true,
    sortOrder: 1,
  },
  {
    title: 'Excellence',
    slug: 'wisdom-nugget-excellence',
    description: 'We pursue quality, discipline, continuous improvement, and responsible stewardship of ability.',
    body: 'We pursue quality, discipline, continuous improvement, and responsible stewardship of ability.',
    collection: 'Wisdom Nuggets',
    topics: ['Excellence'],
    wisdomNugget: 'We pursue quality, discipline, continuous improvement, and responsible stewardship of ability.',
    sortOrder: 2,
  },
  {
    title: 'Wisdom',
    slug: 'wisdom-nugget-wisdom',
    description: 'We value thoughtful reflection, sound judgment, experience, and the ability to discern what truly matters.',
    body: 'We value thoughtful reflection, sound judgment, experience, and the ability to discern what truly matters.',
    collection: 'Wisdom Nuggets',
    topics: ['Personal Growth', 'Leadership'],
    wisdomNugget: 'We value thoughtful reflection, sound judgment, experience, and the ability to discern what truly matters.',
    sortOrder: 3,
  },
  {
    title: 'Authentic Spirituality',
    slug: 'wisdom-nugget-authentic-spirituality',
    description: 'We value genuine inner transformation and a life grounded in authentic spiritual convictions.',
    body: 'We value genuine inner transformation and a life grounded in authentic spiritual convictions.',
    collection: 'Wisdom Nuggets',
    topics: ['Authentic Spirituality', 'Faith & Life'],
    wisdomNugget: 'We value genuine inner transformation and a life grounded in authentic spiritual convictions.',
    sortOrder: 4,
  },
  {
    title: 'Mentorship',
    slug: 'wisdom-nugget-mentorship',
    description: 'We believe wisdom grows when generations learn from one another.',
    body: 'We believe wisdom grows when generations learn from one another.',
    collection: 'Wisdom Nuggets',
    topics: ['Mentorship'],
    wisdomNugget: 'We believe wisdom grows when generations learn from one another.',
    sortOrder: 5,
  },
  {
    title: 'Service',
    slug: 'wisdom-nugget-service',
    description: 'We believe influence carries responsibility and that leadership should add value to the lives of others.',
    body: 'We believe influence carries responsibility and that leadership should add value to the lives of others.',
    collection: 'Wisdom Nuggets',
    topics: ['Leadership', 'Society'],
    wisdomNugget: 'We believe influence carries responsibility and that leadership should add value to the lives of others.',
    sortOrder: 6,
  },
  {
    title: 'Lifelong Learning',
    slug: 'wisdom-nugget-lifelong-learning',
    description: 'We remain learners—curious, teachable, reflective, and willing to grow.',
    body: 'We remain learners—curious, teachable, reflective, and willing to grow.',
    collection: 'Wisdom Nuggets',
    topics: ['Education', 'Personal Growth'],
    wisdomNugget: 'We remain learners—curious, teachable, reflective, and willing to grow.',
    sortOrder: 7,
  },
  {
    title: 'Learning by Doing',
    slug: 'study-learning-by-doing',
    description: 'Leadership cannot be fully learned from books or lectures alone.',
    body: `Leadership cannot be fully learned from books or lectures alone.

ANANSE therefore places value on hands-on learning, mentoring, practical engagement, and opportunities to apply knowledge to real situations.

Our programs are designed to encourage participants to think critically, solve problems creatively, develop practical skills, learn from experience, work collaboratively, receive and give mentorship, take responsibility, serve others, and pursue excellence.

Where appropriate, ANANSE also supports training, mentorship, and internship opportunities, particularly for students and young professionals.`,
    collection: 'Study Materials',
    topics: ['Education', 'Mentorship', 'Leadership'],
    sortOrder: 8,
  },
  {
    title: 'Who We Serve',
    slug: 'study-who-we-serve',
    description: 'ANANSE works with people seeking to learn, grow, lead, and serve at different stages of the journey.',
    body: `ANANSE works with people who are seeking to learn, grow, lead, and serve, including:

Students — Helping students develop character, practical skills, leadership capacity, and a vision for purposeful living.

Young professionals — Providing opportunities for continued development, mentorship, professional growth, and meaningful contribution.

Emerging leaders — Equipping those preparing to assume greater responsibility and influence.

Institutions and organizations — Supporting organizations that seek to strengthen leadership, develop people, and build healthier institutional cultures.

Communities — Engaging with communities through educational, developmental, and practical initiatives.`,
    collection: 'Study Materials',
    topics: ['Education', 'Leadership', 'Society'],
    sortOrder: 9,
  },
  {
    title: 'ANANSE and EAGLESonline',
    slug: 'study-ananse-and-eaglesonline',
    description: 'ANANSE is a subsidiary of EAGLESonline alongside the EAGLES Center.',
    body: `ANANSE Center for Leadership Development is a subsidiary of EAGLESonline, an umbrella organization bringing together two centers of leadership development: the EAGLES Center and the ANANSE Center.

EAGLES stands for: Empowerment & Advisory Group for Leadership, Excellence, & Service.

Within this broader vision, ANANSE has a particular emphasis on training, mentorship, practical development, and empowering people to become agents of positive social change.

The two centers share a commitment to leadership, excellence, service, and human development while providing distinct avenues through which that vision can be pursued.`,
    collection: 'Publications',
    topics: ['Leadership', 'Africa & Development'],
    sortOrder: 10,
  },
  {
    title: 'Ideas for Living, Leading, and Serving',
    slug: 'study-insights-invitation',
    description: 'ANANSE Insights explores questions that shape our lives, leadership, communities, and world.',
    body: `ANANSE Insights is a space for thoughtful ideas, reflections, perspectives, and conversations on the questions that shape our lives, our leadership, our communities, and our world.

Here, we explore issues that matter—not simply to inform, but to encourage thoughtful reflection, meaningful dialogue, personal growth, and responsible action.

Our aim is simple:
To think deeply.
To learn continually.
To live wisely.
To lead responsibly.
To serve meaningfully.`,
    collection: 'Leadership Reflections',
    topics: ['Leadership', 'Personal Growth'],
    featured: true,
    sortOrder: 11,
  },
  {
    title: 'The ANANSE Library',
    slug: 'study-the-ananse-library',
    description: 'Ideas. Conversations. Wisdom. A place to listen, watch, read, explore, and discover.',
    body: `The ANANSE Library is a growing collection of lectures, reflections, conversations, writings, videos, photographs, and other resources designed to inform, challenge, inspire, and equip.

Here you can listen, watch, read, explore, and discover ideas from across the ANANSE community.

Whether you are looking for wisdom on leadership, a reflection for everyday living, a lecture on excellence, a conversation about relationships, an exploration of music and culture, or resources for personal growth, the ANANSE Library provides a place to begin.

Explore. Learn. Reflect. Grow.`,
    collection: 'Publications',
    topics: ['Education', 'Personal Growth'],
    sortOrder: 12,
  },
  {
    title: 'Preserving What We Learn',
    slug: 'study-the-ananse-archive',
    description: 'The Library is also an evolving institutional archive for future generations.',
    body: `The ANANSE Library is not only about today's content. It is also an evolving institutional archive—a place where lectures, conversations, writings, photographs, and other resources can be preserved and made available for future generations.

As ANANSE grows, the Library will become a record of ideas shared, questions explored, people developed, relationships formed, and lessons learned.`,
    collection: 'Publications',
    topics: ['Education', 'Africa & Development'],
    sortOrder: 13,
  },
  {
    title: 'Discover Related Content',
    slug: 'study-discover-related-content',
    description: 'One idea can lead to another across programs, Insights, and the Library.',
    body: `ANANSE content is interconnected.

A lecture on leadership may lead to an article on character. A Midday Reflection may connect with a related Insight. A conversation about marriage may lead to another resource on communication or relationships. A discussion of music may open a broader conversation about culture and identity.

Where possible, Library items should therefore display related programs, topics, people, events, and resources. This allows visitors not simply to find one item, but to continue exploring.`,
    collection: 'Study Materials',
    topics: ['Education', 'Personal Growth'],
    sortOrder: 14,
  },
  {
    title: 'There Is a Place for You at ANANSE',
    slug: 'study-join-the-journey',
    description: 'Explore. Learn. Grow. Lead. Serve.',
    body: `Whether you are a student seeking direction, a young professional looking for mentorship, an experienced leader with wisdom to share, an organization seeking development opportunities, or simply someone who wants to keep learning, there are many ways to connect with ANANSE.

Explore. Learn. Grow. Lead. Serve.`,
    collection: 'Leadership Reflections',
    topics: ['Mentorship', 'Personal Growth', 'Leadership'],
    sortOrder: 15,
  },
]

export async function seedStageCContent(prisma: PrismaClient) {
  const now = new Date()

  for (const insight of STAGE_C_INSIGHTS) {
    await prisma.newsPost.upsert({
      where: { slug: insight.slug },
      create: {
        title: insight.title,
        slug: insight.slug,
        excerpt: insight.excerpt,
        body: insight.body,
        dateLabel: 'Institutional reflection',
        author: AUTHOR,
        category: insight.contentType,
        contentType: insight.contentType,
        topics: insight.topics,
        featured: insight.featured ?? false,
        showInLibraryRead: insight.showInLibraryRead ?? false,
        published: true,
        sortOrder: insight.sortOrder,
      },
      update: {
        title: insight.title,
        excerpt: insight.excerpt,
        body: insight.body,
        author: AUTHOR,
        category: insight.contentType,
        contentType: insight.contentType,
        topics: insight.topics,
        featured: insight.featured ?? false,
        showInLibraryRead: insight.showInLibraryRead ?? false,
        published: true,
        sortOrder: insight.sortOrder,
      },
    })
  }

  for (const item of STAGE_C_LIBRARY) {
    const slug = item.slug || slugify(item.title)
    await prisma.libraryItem.upsert({
      where: { slug },
      create: {
        title: item.title,
        slug,
        description: item.description,
        shelf: 'read',
        collection: item.collection,
        body: item.body,
        wisdomNugget: item.wisdomNugget ?? '',
        topics: item.topics,
        dateLabel: 'From ANANSE identity materials',
        publishedAt: now,
        featured: item.featured ?? false,
        published: true,
        sortOrder: item.sortOrder,
      },
      update: {
        title: item.title,
        description: item.description,
        shelf: 'read',
        collection: item.collection,
        body: item.body,
        wisdomNugget: item.wisdomNugget ?? '',
        topics: item.topics,
        featured: item.featured ?? false,
        published: true,
        sortOrder: item.sortOrder,
      },
    })
  }

  console.log(
    `Stage C seeded: ${STAGE_C_INSIGHTS.length} insights, ${STAGE_C_LIBRARY.length} library read items. Events/people/albums/midday media skipped (awaiting client materials).`,
  )
}

const isDirectRun = process.argv[1]?.includes('seed-stage-c')
if (isDirectRun) {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  try {
    await seedStageCContent(prisma)
  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}
