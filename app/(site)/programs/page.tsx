import { fetchPrograms } from '../../../lib/api'
import {
  DEFAULT_PROGRAMS_HERO_CTA_PRIMARY,
  DEFAULT_PROGRAMS_HERO_CTA_SECONDARY,
  DEFAULT_PROGRAMS_HERO_STATS,
  DEFAULT_PROGRAMS_HERO_TITLE,
  getCmsTexts,
  parseCmsJson,
  type CmsHeroCta,
  type CmsHeroStat,
  type CmsHeroTitle,
} from '../../../lib/cms/content'
import ProgramsPageClient, {
  type ProgramBenefit,
  type ProgramTestimonial,
} from './ProgramsPageClient'
import { fallbackCatalogPrograms } from './programs-data'

const DEFAULT_PROGRAM_BENEFITS: ProgramBenefit[] = [
  {
    title: 'Skill Development',
    description:
      'Learn traditional and contemporary techniques from master practitioners with years of experience.',
    iconKey: 'Wrench',
  },
  {
    title: 'Cultural Connection',
    description:
      'Deepen your understanding and connection to African heritage through immersion and practice.',
    iconKey: 'Globe',
  },
  {
    title: 'Community Building',
    description:
      'Join a supportive network of learners, artists, and cultural enthusiasts from diverse backgrounds.',
    iconKey: 'Users',
  },
  {
    title: 'Personal Growth',
    description:
      'Discover new aspects of yourself through creative expression and ancestral wisdom.',
    iconKey: 'Sprout',
  },
]

const DEFAULT_PROGRAM_TESTIMONIALS: ProgramTestimonial[] = [
  {
    name: 'Ama Mensah',
    role: 'Traditional Arts Student',
    text: "Learning Adinkra symbols wasn't just about art—it was about understanding the wisdom of my ancestors. This program gave me a deeper connection to who I am.",
    initials: 'AM',
  },
  {
    name: 'Kwame Johnson',
    role: 'Music & Rhythm Student',
    text: 'The drumming program changed my life. I found community, purpose, and a way to express emotions I did not know how to put into words.',
    initials: 'KJ',
  },
  {
    name: 'Evelyn Davis',
    role: 'Storytelling Participant',
    text: 'As someone in the diaspora, this program helped me reconnect with my roots in the most beautiful way. I now carry these stories with pride.',
    initials: 'ED',
  },
]

export default async function ProgramsPage() {
  const [cms, programs] = await Promise.all([
    getCmsTexts([
      'programs.hero.lead',
      'programs.hero.title',
      'programs.hero.stats',
      'programs.hero.cta.primary',
      'programs.hero.cta.secondary',
      'programs.catalog.heading',
      'programs.catalog.lead',
      'programs.benefits.badge',
      'programs.benefits.heading',
      'programs.benefits.cardLabel',
      'programs.testimonials.badge',
      'programs.testimonials.heading',
      'programs.card.cta.primary',
      'programs.card.cta.secondary',
      'programs.cta.primary',
      'programs.cta.secondary',
      'programs.benefits.lead',
      'programs.benefits',
      'programs.testimonials',
      'programs.cta.heading',
      'programs.cta.body',
    ] as const),
    fetchPrograms('catalog').catch(() => fallbackCatalogPrograms),
  ])

  const heroTitle = parseCmsJson<CmsHeroTitle>(cms['programs.hero.title'], DEFAULT_PROGRAMS_HERO_TITLE)
  const heroStats = parseCmsJson<CmsHeroStat[]>(cms['programs.hero.stats'], DEFAULT_PROGRAMS_HERO_STATS)
  const heroPrimaryCta = parseCmsJson<CmsHeroCta>(cms['programs.hero.cta.primary'], DEFAULT_PROGRAMS_HERO_CTA_PRIMARY)
  const heroSecondaryCta = parseCmsJson<CmsHeroCta>(
    cms['programs.hero.cta.secondary'],
    DEFAULT_PROGRAMS_HERO_CTA_SECONDARY,
  )
  const ctaPrimary = parseCmsJson<CmsHeroCta>(
    cms['programs.cta.primary'],
    { label: 'View All Programs', href: '/programs#catalog' },
  )
  const ctaSecondary = parseCmsJson<CmsHeroCta>(
    cms['programs.cta.secondary'],
    { label: 'Apply Now', href: '/contact#form' },
  )
  const benefits = parseCmsJson<ProgramBenefit[]>(cms['programs.benefits'], DEFAULT_PROGRAM_BENEFITS)
  const testimonials = parseCmsJson<ProgramTestimonial[]>(
    cms['programs.testimonials'],
    DEFAULT_PROGRAM_TESTIMONIALS,
  )

  return (
    <ProgramsPageClient
      heroLead={cms['programs.hero.lead']}
      heroTitle={heroTitle}
      heroStats={heroStats}
      heroPrimaryCta={heroPrimaryCta}
      heroSecondaryCta={heroSecondaryCta}
      catalogHeading={cms['programs.catalog.heading']}
      catalogLead={cms['programs.catalog.lead']}
      benefitsBadge={cms['programs.benefits.badge']}
      benefitsHeading={cms['programs.benefits.heading']}
      benefitsCardLabel={cms['programs.benefits.cardLabel']}
      testimonialsBadge={cms['programs.testimonials.badge']}
      testimonialsHeading={cms['programs.testimonials.heading']}
      cardCtaPrimary={cms['programs.card.cta.primary']}
      cardCtaSecondary={cms['programs.card.cta.secondary']}
      ctaPrimary={ctaPrimary}
      ctaSecondary={ctaSecondary}
      benefitsLead={cms['programs.benefits.lead']}
      benefits={benefits}
      testimonials={testimonials}
      ctaHeading={cms['programs.cta.heading']}
      ctaBody={cms['programs.cta.body']}
      programs={programs}
    />
  )
}
