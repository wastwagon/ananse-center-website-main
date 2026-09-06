import ContentPageHero from './ContentPageHero'
import CmsRichText from './CmsRichText'
import LocalizedLink from './LocalizedLink'
import { getCmsTexts } from '../lib/cms/content'
import { localizedUiText, t } from '../lib/i18n'
import { getServerLocale } from '../lib/locale-server'

type PolicyPageLayoutProps = {
  badge: string
  heading: string
  lead: string
  body: string
  headingKey: 'privacy.heading' | 'terms.heading'
  leadKey: 'privacy.lead' | 'terms.lead'
  bodyKey: 'privacy.body' | 'terms.body'
}

export default async function PolicyPageLayout({
  badge,
  heading,
  lead,
  body,
  headingKey,
  leadKey,
  bodyKey,
}: PolicyPageLayoutProps) {
  const locale = await getServerLocale()
  const cms = await getCmsTexts(['legal.cta.contact', 'legal.cta.home'] as const)
  const displayBadge = localizedUiText('legal.badge', badge, locale)
  const displayHeading = localizedUiText(headingKey, heading, locale)
  const displayLead = localizedUiText(leadKey, lead, locale)
  const displayBody = localizedUiText(bodyKey, body, locale)
  const contactLabel = locale === 'en' ? cms['legal.cta.contact'] : t('policy.contact', locale)
  const homeLabel = locale === 'en' ? cms['legal.cta.home'] : t('policy.home', locale)

  return (
    <article className="content-page content-page--legal">
      <ContentPageHero badge={displayBadge} title={displayHeading} lead={displayLead} />

      <section className="page-section page-section--muted section-reveal">
        <div className="page-section-container content-prose">
          <CmsRichText body={displayBody} className="content-prose-body" />

          <div className="content-actions">
            <LocalizedLink href="/contact#form" className="btn-primary">
              {contactLabel}
            </LocalizedLink>
            <LocalizedLink href="/" className="btn-outline">
              {homeLabel}
            </LocalizedLink>
          </div>
        </div>
      </section>
    </article>
  )
}
