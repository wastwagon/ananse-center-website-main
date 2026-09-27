import type { ApiProgram } from '../api'
import { looksLikeHtml, stripHtmlToPlain } from '../cms/richtext'

/**
 * Ten ANANSE programs, in the client's order.
 * The first paragraph is the short public line. Later paragraphs are their longer text.
 * Keep slugs aligned with backend/src/cms/programs-seed.ts.
 */
export const LEADERSHIP_PROGRAMS: ApiProgram[] = [
  {
    id: 'leadership-development',
    slug: 'leadership-development',
    title: 'Leadership Development',
    category: 'Program',
    section: 'catalog',
    duration: '',
    level: '',
    iconKey: 'Award',
    sortOrder: 0,
    coverImageUrl: null,
    features: [
      'Character and integrity',
      'Leadership principles',
      'Decision-making',
      'Critical thinking',
      'Emotional and relational intelligence',
      'Problem-solving',
      'Excellence',
      'Responsible influence',
      'Leadership and service',
    ],
    description: [
      'Developing leaders whose character matches their competence.',
      'Character. Competence. Influence. Service.',
      'Leadership is more than position.',
      'Our Leadership Development programs help people understand the responsibilities that accompany influence and develop the character, competence, wisdom, and practical skills required to lead effectively.',
      'Through lectures, workshops, conversations, mentoring, and practical learning, participants are encouraged to think critically, act responsibly, pursue excellence, and use their influence in service of others.',
    ].join('\n\n'),
  },
  {
    id: 'mentorship',
    slug: 'mentorship',
    title: 'Mentorship',
    category: 'Program',
    section: 'catalog',
    duration: '',
    level: '',
    iconKey: 'Users',
    sortOrder: 1,
    coverImageUrl: null,
    features: [
      'Intergenerational exchange',
      'Shared experience',
      'Emerging talent',
      'Practical guidance',
      'Walking alongside',
    ],
    description: [
      'Connecting experience with emerging talent.',
      'Wisdom Shared. Potential Developed.',
      'No one develops entirely alone.',
      'Mentorship connects experience with emerging talent, creating opportunities for people to learn from those who have traveled portions of the journey before them.',
      'ANANSE seeks to encourage meaningful intergenerational relationships in which experience, wisdom, questions, opportunities, and practical guidance can be shared.',
      'Mentorship is not simply about giving advice. It is about walking alongside people as they learn, grow, and discover their capacity to contribute.',
    ].join('\n\n'),
  },
  {
    id: 'excellence-lectures',
    slug: 'excellence-lectures',
    title: 'Excellence Lectures',
    category: 'Program',
    section: 'catalog',
    duration: '',
    level: '',
    iconKey: 'GraduationCap',
    sortOrder: 2,
    coverImageUrl: null,
    features: [
      'Leadership',
      'Education',
      'Professional development',
      'Character',
      'Society and culture',
      'Human flourishing',
    ],
    description: [
      'Bringing accomplished voices and important ideas into conversation.',
      'Ideas That Challenge. Voices That Inspire. Wisdom That Endures.',
      'The Excellence Lecture Series brings accomplished thinkers, scholars, professionals, leaders, and practitioners into conversation around ideas that matter.',
      'The lectures explore questions of leadership, education, professional development, character, society, culture, and human flourishing.',
      'Our goal is not simply to celebrate achievement, but to learn from experience and expose people to ideas that can deepen their thinking and enlarge their vision.',
    ].join('\n\n'),
  },
  {
    id: 'midday-reflection',
    slug: 'midday-reflection',
    title: 'Midday Reflection',
    category: 'Program',
    section: 'catalog',
    duration: '',
    level: '',
    iconKey: 'Sun',
    sortOrder: 3,
    coverImageUrl: null,
    features: [
      'Scripture',
      'Wisdom',
      'Character',
      'Relationships',
      'Leadership',
      'Faith',
      'Everyday life',
    ],
    description: [
      'Discovering wisdom for everyday living.',
      'Wisdom for the Journey of Life.',
      'Midday Reflection is a weekly journey into Scripture, wisdom, character, relationships, leadership, faith, and everyday life.',
      'Hosted by Dr. Samuel Koranteng-Pipim, the program invites listeners to slow down, think deeply, and discover wisdom for the journey of life.',
      'It is more than a weekly broadcast. It is an invitation to pause amid the demands of life and consider how timeless wisdom can shape the way we live.',
      "An invitation to linger over God's Word until its wisdom becomes part of our lives.",
      'New content is added regularly.',
    ].join('\n\n'),
  },
  {
    id: 'public-lectures-conversations',
    slug: 'public-lectures-conversations',
    title: 'Public Lectures & Conversations',
    category: 'Program',
    section: 'catalog',
    duration: '',
    level: '',
    iconKey: 'Globe',
    sortOrder: 4,
    coverImageUrl: null,
    features: [
      'Lectures',
      'Panel discussions',
      'Interviews',
      'Forums',
      'Conversations',
    ],
    description: [
      'Creating spaces for thoughtful engagement with significant questions.',
      'Thinking Together About Questions That Matter.',
      'Some questions deserve more than quick answers.',
      'ANANSE creates opportunities for thoughtful public engagement through lectures, panel discussions, interviews, forums, and conversations addressing issues that affect individuals, institutions, communities, and society.',
      'These engagements bring different experiences and perspectives into conversation while encouraging thoughtful inquiry, respectful dialogue, and informed reflection.',
    ].join('\n\n'),
  },
  {
    id: 'special-initiatives',
    slug: 'special-initiatives',
    title: 'Special Initiatives',
    category: 'Program',
    section: 'catalog',
    duration: '',
    level: '',
    iconKey: 'Sparkles',
    sortOrder: 5,
    coverImageUrl: null,
    features: [
      'Education',
      'Mentorship',
      'Youth development',
      'Professional development',
      'Community engagement',
      'Practical training',
    ],
    description: [
      'Responding creatively to emerging needs and opportunities.',
      'Responding to Needs. Creating Opportunities. Making a Difference.',
      'Not every important idea fits neatly into an established program.',
      'ANANSE develops special initiatives in response to emerging needs, opportunities, partnerships, and community concerns.',
      'These initiatives may involve education, mentorship, youth development, professional development, community engagement, practical training, or other forms of service.',
      'The common thread is simple: Identify a need. Develop a thoughtful response. Mobilize people. Create value.',
    ].join('\n\n'),
  },
  {
    id: 'marriage-relationships',
    slug: 'marriage-relationships',
    title: 'Marriage & Relationships',
    category: 'Program',
    section: 'catalog',
    duration: '',
    level: '',
    iconKey: 'Heart',
    sortOrder: 6,
    coverImageUrl: null,
    features: [
      'Marriage',
      'Family',
      'Friendship',
      'Communication',
      'Commitment',
      'Trust',
    ],
    description: [
      'Exploring the principles that contribute to healthy and meaningful relationships.',
      'Building Relationships That Matter.',
      'Our lives are shaped by relationships.',
      'Marriage & Relationships explores the principles, practices, and experiences that contribute to healthy and meaningful relationships.',
      'The program creates space for thoughtful conversations about marriage, family, friendship, communication, commitment, trust, conflict, companionship, and the responsibilities we have toward one another.',
      'The goal is not to offer simplistic answers to complex human experiences, but to encourage wisdom, understanding, communication, responsibility, and healthy relationships.',
    ].join('\n\n'),
  },
  {
    id: 'music-culture',
    slug: 'music-culture',
    title: 'Music & Culture',
    category: 'Program',
    section: 'catalog',
    duration: '',
    level: '',
    iconKey: 'Music',
    sortOrder: 7,
    coverImageUrl: null,
    features: [
      'Music',
      'Culture',
      'Heritage',
      'Identity',
      'Creativity',
      'The arts',
    ],
    description: [
      'Exploring music, culture, heritage, identity, creativity, and the arts.',
      'Understanding Who We Are Through What We Create and Share.',
      'Music is more than entertainment.',
      'It carries memory, identity, history, emotion, values, and stories. It can preserve heritage, shape communities, bridge generations, and influence how people understand themselves and the world around them.',
      'Music & Culture explores music, culture, heritage, identity, creativity, and the role of the arts in shaping individuals and communities.',
      'Through articles, reflections, conversations, recordings, and special programs, ANANSE seeks to encourage thoughtful engagement with the cultural expressions that shape our lives.',
    ].join('\n\n'),
  },
  {
    id: 'sankofa-adr',
    slug: 'sankofa-adr',
    title: 'Sankofa ADR',
    category: 'Program',
    section: 'catalog',
    duration: '',
    level: '',
    iconKey: 'Scale',
    sortOrder: 8,
    coverImageUrl: null,
    features: [
      'Dispute resolution',
      'Reconciliation',
      'Dialogue',
      'Mediation',
      'Peacemaking',
      'African traditions',
    ],
    description: [
      'A specialized ANANSE program for resolving disputes and peacemaking as was done by our African forebears.',
      'Resolving Disputes. Restoring Relationships. Pursuing Peace.',
      'Sankofa ADR is a specialized ANANSE program for resolving disputes and peacemaking as was done by our African forebears.',
      'The name Sankofa reflects the principle of learning from the wisdom of the past in order to address the challenges of the present and build a better future.',
      'Sankofa ADR explores approaches to dispute resolution, reconciliation, dialogue, mediation, and peacemaking that draw upon African traditions of community, dialogue, responsibility, and restoration.',
      'The program seeks to recover and apply relevant wisdom from our African heritage while engaging contemporary approaches to dispute resolution and peacebuilding.',
    ].join('\n\n'),
  },
  {
    id: 'healthy-living',
    slug: 'healthy-living',
    title: 'Healthy Living',
    category: 'Program',
    section: 'catalog',
    duration: '',
    level: '',
    iconKey: 'Sprout',
    sortOrder: 9,
    coverImageUrl: null,
    features: [
      'Healthy habits',
      'Lifestyle choices',
      'Physical well-being',
      'Mental and emotional well-being',
      'Rest and balance',
      'Nutrition',
      'Relationships',
      'Purposeful living',
      'Sustainable personal practices',
    ],
    description: [
      'Promoting informed choices and practical principles for healthy, balanced, purposeful living.',
      'Living Well. Living Wisely. Living Purposefully.',
      'Healthy living involves more than the absence of illness.',
      'It encompasses the choices, habits, relationships, environments, and practices that contribute to a balanced and purposeful life.',
      'The Healthy Living program provides educational resources and conversations designed to encourage informed choices and responsible approaches to personal well-being.',
      'ANANSE approaches healthy living as part of the broader task of developing the whole person.',
    ].join('\n\n'),
  },
]

export const LEADERSHIP_PROGRAM_SLUGS = new Set(LEADERSHIP_PROGRAMS.map((program) => program.slug))

/** Arts-and-culture catalog slugs. They are not ANANSE leadership programs. */
export const LEGACY_ARTS_PROGRAM_SLUGS = [
  'traditional-arts-crafts',
  'african-music-rhythm',
  'storytelling-oral-traditions',
  'contemporary-african-art',
  'dance-movement',
  'cultural-leadership-training',
  'sankofa-mentorship',
  'sankofa-mediation',
  'sankofa-resources',
  'sankofa-music',
  'sankofa-kitchen-health',
  'sankofa-sabbath-volunteering',
] as const

export function programSummary(description: string): string {
  const plain = looksLikeHtml(description) ? stripHtmlToPlain(description) : description
  return plain.split(/\n\s*\n/)[0]?.trim() || plain
}

/** Split program copy into hero lead, optional tagline, and body paragraphs. */
export function programNarrative(description: string): {
  summary: string
  tagline: string | null
  body: string[]
} {
  const summary = programSummary(description)
  if (looksLikeHtml(description)) {
    return { summary, tagline: null, body: [] }
  }
  const parts = description
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
  const candidate = parts[1]
  const isTagline = (text: string) => {
    if (text.length <= 72) return true
    const fragments = text
      .split('.')
      .map((part) => part.trim())
      .filter(Boolean)
    return fragments.length >= 2 && fragments.every((part) => part.length <= 40) && text.length <= 110
  }
  if (candidate && isTagline(candidate)) {
    return { summary, tagline: candidate, body: parts.slice(2) }
  }
  return { summary, tagline: null, body: parts.slice(1) }
}

export function leadershipProgramBySlug(slug: string): ApiProgram | null {
  return LEADERSHIP_PROGRAMS.find((program) => program.slug === slug) ?? null
}

/** Prefer CMS rows for the ten programs. If none are published yet, use the written descriptions. */
export function selectLeadershipPrograms(programs: ApiProgram[]): ApiProgram[] {
  const matched = programs.filter((program) => LEADERSHIP_PROGRAM_SLUGS.has(program.slug))
  if (matched.length === 0) return LEADERSHIP_PROGRAMS
  return [...matched].sort((a, b) => a.sortOrder - b.sortOrder)
}

/** Next programs in catalog order (wraps), excluding the current page. */
export function neighborPrograms(
  currentSlug: string,
  programs: ApiProgram[],
  count = 3,
): ApiProgram[] {
  const sorted = selectLeadershipPrograms(programs)
  const index = sorted.findIndex((program) => program.slug === currentSlug)
  if (index < 0) {
    return sorted.filter((program) => program.slug !== currentSlug).slice(0, count)
  }
  const neighbors: ApiProgram[] = []
  for (let step = 1; step < sorted.length && neighbors.length < count; step += 1) {
    const candidate = sorted[(index + step) % sorted.length]
    if (candidate.slug !== currentSlug) neighbors.push(candidate)
  }
  return neighbors
}

/** Prefer live CMS fields, then fill gaps from the leadership seed. */
export function resolveLeadershipProgram(live: ApiProgram | null, slug: string): ApiProgram | null {
  const seed = leadershipProgramBySlug(slug)
  if (!live && !seed) return null
  if (!live) return seed
  if (!seed) return live

  const liveNarrative = programNarrative(live.description)
  const seedNarrative = programNarrative(seed.description)
  // TipTap HTML has no “tagline” block — never overwrite live rich copy with seed.
  const description =
    !live.description.trim()
      ? seed.description
      : looksLikeHtml(live.description)
        ? live.description
        : !liveNarrative.tagline && seedNarrative.tagline
          ? seed.description
          : live.description

  return {
    ...live,
    features: live.features.length > 0 ? live.features : seed.features,
    description,
    iconKey: live.iconKey || seed.iconKey,
    coverImageUrl: live.coverImageUrl || seed.coverImageUrl,
  }
}
