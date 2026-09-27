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
import { selectLeadershipPrograms } from '../../../lib/leadership/programs'
import { HOME_PROGRAMS_INTRO } from '../../../lib/leadership/copy'

const DEFAULT_PROGRAM_BENEFITS: ProgramBenefit[] = [
  {
    title: 'Leadership education',
    category: 'Development',
    description: 'Providing knowledge, frameworks, and practical tools for effective leadership.',
    iconKey: 'Award',
  },
  {
    title: 'Mentoring',
    category: 'Development',
    description: 'Connecting emerging leaders with people whose experience and wisdom can help guide their development.',
    iconKey: 'Users',
  },
  {
    title: 'Intellectual engagement',
    category: 'Development',
    description: 'Encouraging thoughtful inquiry, critical thinking, conversation, and lifelong learning.',
    iconKey: 'BookOpen',
  },
  {
    title: 'Authentic spirituality',
    category: 'Development',
    description: 'Recognizing genuine inner transformation, values, meaning, and a life grounded in authentic spiritual convictions.',
    iconKey: 'Sun',
  },
  {
    title: 'Practical service',
    category: 'Development',
    description: 'Turning knowledge and influence into meaningful contribution and service to others.',
    iconKey: 'HandHeart',
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
  const [cms, loadedPrograms] = await Promise.all([
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
  const programs = selectLeadershipPrograms(loadedPrograms)

  const sectionVisibility = {
    ...parseSectionVisibility(cms['programs.sections.visible'], DEFAULT_PROGRAMS_SECTIONS),
    testimonials: false,
  }
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
    { label: 'Apply Now', href: '/get-involved#contact' },
  )
  const benefits = parseCmsJson<ProgramBenefit[]>(cms['programs.benefits'], DEFAULT_PROGRAM_BENEFITS)
  const testimonials = parseCmsJson<ProgramTestimonial[]>(
    cms['programs.testimonials'],
    DEFAULT_PROGRAM_TESTIMONIALS,
  )

  return (
    <>
    <ProgramsPageClient
      heroLead={HOME_PROGRAMS_INTRO.lead + ' ' + HOME_PROGRAMS_INTRO.body}
      heroTitle={{ prefix: 'Our ', accent: 'programs' }}
      heroStats={[]}
      heroPrimaryCta={{ label: 'Browse programs', href: '/programs#catalog' }}
      heroSecondaryCta={{ label: 'Get involved', href: '/get-involved' }}
      heroImageSrc={resolveCmsImage(cms['programs.hero.image'], images.hero.programs)}
      heroImageAlt="ANANSE programs"
      catalogHeading="Ten programs"
      catalogLead="Human development is multidimensional. From leadership development and mentorship to marriage and relationships, music and culture, healthy living, and peacemaking, these programs share one purpose: developing people, transforming lives, and strengthening communities."
      benefitsBadge="Our mission"
      benefitsHeading="Five dimensions of development"
      benefitsCardLabel="Development"
      testimonialsBadge={cms['programs.testimonials.badge']}
      testimonialsHeading={cms['programs.testimonials.heading']}
      cardCtaPrimary="Get involved"
      cardCtaSecondary=""
      ctaPrimary={ctaPrimary}
      ctaSecondary={{ label: 'Get involved', href: '/get-involved' }}
      benefitsLead="To develop people through leadership education, mentoring, intellectual engagement, authentic spirituality, and practical service."
      benefits={DEFAULT_PROGRAM_BENEFITS}
      testimonials={testimonials}
      ctaHeading="There is a place for you at ANANSE"
      ctaBody="Whether you are a student seeking direction, a young professional looking for mentorship, an experienced leader with wisdom to share, or an organization seeking development opportunities, there are many ways to connect."
      programs={programs}
      sectionVisibility={sectionVisibility}
    />
    <LmsPortalBanner />
    </>
  )
}
