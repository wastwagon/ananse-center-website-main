import {
  DEFAULT_CONTACT_HERO_CTA_PRIMARY,
  DEFAULT_CONTACT_HERO_CTA_SECONDARY,
  DEFAULT_CONTACT_HERO_STATS,
  DEFAULT_CONTACT_HERO_TITLE,
  getCmsTexts,
  parseCmsJson,
  type CmsHeroCta,
  type CmsHeroStat,
  type CmsHeroTitle,
} from '../../../lib/cms/content'
import { getPublicSiteProfile } from '../../../lib/site-profile'
import ContactPageClient from './ContactPageClient'

export default async function ContactPage() {
  const [cms, profile] = await Promise.all([
    getCmsTexts([
      'contact.hero.lead',
      'contact.hero.title',
      'contact.hero.stats',
      'contact.hero.cta.primary',
      'contact.hero.cta.secondary',
      'contact.visit.blurb',
      'contact.cta.body',
    ] as const),
    getPublicSiteProfile(),
  ])

  const heroTitle = parseCmsJson<CmsHeroTitle>(cms['contact.hero.title'], DEFAULT_CONTACT_HERO_TITLE)
  const heroStats = parseCmsJson<CmsHeroStat[]>(cms['contact.hero.stats'], DEFAULT_CONTACT_HERO_STATS)
  const heroPrimaryCta = parseCmsJson<CmsHeroCta>(cms['contact.hero.cta.primary'], DEFAULT_CONTACT_HERO_CTA_PRIMARY)
  const heroSecondaryCta = parseCmsJson<CmsHeroCta>(cms['contact.hero.cta.secondary'], DEFAULT_CONTACT_HERO_CTA_SECONDARY)

  return (
    <ContactPageClient
      heroLead={cms['contact.hero.lead']}
      heroTitle={heroTitle}
      heroStats={heroStats}
      heroPrimaryCta={heroPrimaryCta}
      heroSecondaryCta={heroSecondaryCta}
      visitBlurb={cms['contact.visit.blurb']}
      ctaBody={cms['contact.cta.body']}
      profile={profile}
    />
  )
}
