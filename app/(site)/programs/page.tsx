import { fetchPrograms } from '../../../lib/api'
import { buildCmsMetadata } from '../../../lib/cms/seo'
import { images, resolveCmsImage } from '../../../lib/images'
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
import {
  DEFAULT_PROGRAMS_SECTIONS,
  parseSectionVisibility,
} from '../../../lib/cms/sections'

export async function generateMetadata() {
  return buildCmsMetadata('programs', { ogImage: images.hero.programs })
}
import LmsPortalBanner from '../../../components/LmsPortalBanner'
import ProgramsPageClient, {
  type ProgramBenefit,
  type ProgramTestimonial,
} from './ProgramsPageClient'
import { fallbackCatalogPrograms } from './programs-data'

const DEFAULT_PROGRAM_BENEFITS: ProgramBenefit[] = [
  {
    title: 'Skill Development',
    category: 'Education',
    description:
      'Learn practical cultural and creative skills from experienced practitioners through hands-on workshops, mentorship, and collaborative learning.',
    iconKey: 'Wrench',
  },
  {
    title: 'Cultural Connection',
    category: 'Culture',
    description:
      'Deepen your connection to African heritage through storytelling, traditional arts, festivals, and immersive cultural practice.',
    iconKey: 'Globe',
  },
  {
    title: 'Community Building',
    category: 'Community',
    description:
      'Join a supportive network of learners, artists, and volunteers working together to strengthen communities across Ghana and the diaspora.',
    iconKey: 'Users',
  },
  {
    title: 'Personal Growth',
    category: 'Leadership',
    description:
      'Grow in confidence, purpose, and leadership through mentoring, creative expression, and ancestral wisdom applied to modern life.',
    iconKey: 'Sprout',
  },
]

const DEFAULT_PROGRAM_TESTIMONIALS: ProgramTestimonial[] = [
  {
    name: 'Efua',
    role: 'Youth arts apprentice',
    text: 'Learning beside master artisans taught me patience and pride. Kente, story, and song are not just skills—they are how I know who I am.',
    initials: 'EF',
  },
  {
    name: 'David',
    role: 'Drumming & music participant',
    text: 'The rhythm circle felt like home. I found mentors who expected excellence and still made room for healing.',
    initials: 'DA',
  },
  {
    name: 'Nia',
    role: 'Storytelling & diaspora guest',
    text: 'Sitting with elders under the trees, I finally understood Sankofa—not as a slogan, but as a practice of return and responsibility.',
    initials: 'NI',
  },
]

export default async function ProgramsPage() {
  const [cms, programs] = await Promise.all([
    getCmsTexts([
      'programs.hero.lead',
      'programs.hero.image',
      'programs.hero.imageAlt',
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
      'programs.sections.visible',
    ] as const),
    fetchPrograms('catalog').catch(() => fallbackCatalogPrograms),
  ])

  const sectionVisibility = parseSectionVisibility(
    cms['programs.sections.visible'],
    DEFAULT_PROGRAMS_SECTIONS,
  )
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
    <>
    <ProgramsPageClient
      heroLead={cms['programs.hero.lead']}
      heroTitle={heroTitle}
      heroStats={heroStats}
      heroPrimaryCta={heroPrimaryCta}
      heroSecondaryCta={heroSecondaryCta}
      heroImageSrc={resolveCmsImage(cms['programs.hero.image'], images.hero.programs)}
      heroImageAlt={cms['programs.hero.imageAlt']}
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
      sectionVisibility={sectionVisibility}
    />
    <LmsPortalBanner />
    </>
  )
}
