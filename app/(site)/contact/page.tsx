import { buildCmsMetadata } from '../../../lib/cms/seo'
import { images, resolveCmsImage } from '../../../lib/images'
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
import { CONTACT_SUBJECTS } from '../../../lib/leadership/copy'

export async function generateMetadata() {
  return buildCmsMetadata('contact', { ogImage: images.hero.contact })
}

export default async function ContactPage() {
  const [cms, profile] = await Promise.all([
    getCmsTexts([
      'contact.hero.lead',
      'contact.hero.image',
      'contact.hero.imageAlt',
      'contact.hero.title',
      'contact.hero.stats',
      'contact.hero.cta.primary',
      'contact.hero.cta.secondary',
      'contact.form.heading',
      'contact.form.subjects',
      'contact.map.heading',
      'contact.map.subtitle',
      'contact.map.embedUrl',
      'contact.map.linkUrl',
      'contact.map.linkText',
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
      heroLead="Write to ANANSE Center for Leadership Development. The same form is on Get Involved, which is where Contact lives in the menu."
      heroTitle={{ prefix: 'Contact ', accent: 'ANANSE' }}
      heroStats={[]}
      heroPrimaryCta={{ label: 'Get involved', href: '/get-involved' }}
      heroSecondaryCta={{ label: 'Send a message', href: '#form' }}
      heroImageSrc={resolveCmsImage(cms['contact.hero.image'], images.hero.contact)}
      heroImageAlt={cms['contact.hero.imageAlt']}
      formHeading={cms['contact.form.heading']}
      formSubjects={[...CONTACT_SUBJECTS]}
      mapHeading="Write to us"
      mapSubtitle="A public street address will be added when ANANSE confirms it."
      mapEmbedUrl=""
      mapLinkUrl=""
      mapLinkText=""
      visitHeading="Get involved"
      visitLinkText="See ways to take part"
      infoTitles={infoTitles}
      visitBlurb="Learn, attend, mentor, partner, support, or share. Contact sits with those pathways."
      ctaHeading={cms['contact.cta.heading']}
      ctaBody={cms['contact.cta.body']}
      profile={profile}
    />
  )
}
