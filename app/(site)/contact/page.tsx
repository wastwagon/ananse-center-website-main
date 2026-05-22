import type { Metadata } from 'next'
import { buildPageMetadata } from '../../../lib/page-meta'
import { images } from '../../../lib/images'
import {
  DEFAULT_CONTACT_FORM_SUBJECTS,
  DEFAULT_CONTACT_HERO_CTA_PRIMARY,
  DEFAULT_CONTACT_HERO_CTA_SECONDARY,
  DEFAULT_CONTACT_HERO_STATS,
  DEFAULT_CONTACT_HERO_TITLE,
  DEFAULT_CONTACT_INFO_TITLES,
  getCmsTexts,
  parseCmsJson,
  type CmsHeroCta,
  type CmsHeroStat,
  type CmsHeroTitle,
} from '../../../lib/cms/content'
import { getPublicSiteProfile } from '../../../lib/site-profile'
import ContactPageClient from './ContactPageClient'

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact',
  description: 'Get in touch with The Ananse Center in Accra — programs, partnerships, and general inquiries worldwide.',
  path: '/contact',
  ogImage: images.hero.contact,
})

export default async function ContactPage() {
  const [cms, profile] = await Promise.all([
    getCmsTexts([
      'contact.hero.lead',
      'contact.hero.title',
      'contact.hero.stats',
      'contact.hero.cta.primary',
      'contact.hero.cta.secondary',
      'contact.form.heading',
      'contact.form.subjects',
      'contact.map.heading',
      'contact.map.subtitle',
      'contact.visit.heading',
      'contact.visit.linkText',
      'contact.info.titles',
      'contact.visit.blurb',
      'contact.cta.heading',
      'contact.cta.body',
    ] as const),
    getPublicSiteProfile(),
  ])

  const heroTitle = parseCmsJson<CmsHeroTitle>(cms['contact.hero.title'], DEFAULT_CONTACT_HERO_TITLE)
  const heroStats = parseCmsJson<CmsHeroStat[]>(cms['contact.hero.stats'], DEFAULT_CONTACT_HERO_STATS)
  const heroPrimaryCta = parseCmsJson<CmsHeroCta>(cms['contact.hero.cta.primary'], DEFAULT_CONTACT_HERO_CTA_PRIMARY)
  const heroSecondaryCta = parseCmsJson<CmsHeroCta>(cms['contact.hero.cta.secondary'], DEFAULT_CONTACT_HERO_CTA_SECONDARY)
  const formSubjects = parseCmsJson<string[]>(cms['contact.form.subjects'], DEFAULT_CONTACT_FORM_SUBJECTS)
  const infoTitles = parseCmsJson<string[]>(cms['contact.info.titles'], DEFAULT_CONTACT_INFO_TITLES)

  return (
    <ContactPageClient
      heroLead={cms['contact.hero.lead']}
      heroTitle={heroTitle}
      heroStats={heroStats}
      heroPrimaryCta={heroPrimaryCta}
      heroSecondaryCta={heroSecondaryCta}
      formHeading={cms['contact.form.heading']}
      formSubjects={formSubjects}
      mapHeading={cms['contact.map.heading']}
      mapSubtitle={cms['contact.map.subtitle']}
      visitHeading={cms['contact.visit.heading']}
      visitLinkText={cms['contact.visit.linkText']}
      infoTitles={infoTitles}
      visitBlurb={cms['contact.visit.blurb']}
      ctaHeading={cms['contact.cta.heading']}
      ctaBody={cms['contact.cta.body']}
      profile={profile}
    />
  )
}
