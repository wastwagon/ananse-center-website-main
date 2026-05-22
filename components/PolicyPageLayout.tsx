import ContentPageHero from './ContentPageHero'
import LocalizedLink from './LocalizedLink'
import { splitParagraphs } from '../lib/cms/content'
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
  const displayBadge = localizedUiText('legal.badge', badge, locale)
  const displayHeading = localizedUiText(headingKey, heading, locale)
  const displayLead = localizedUiText(leadKey, lead, locale)
  const displayBody = localizedUiText(bodyKey, body, locale)
  const paragraphs = splitParagraphs(displayBody)

  return (
    <article className="content-page content-page--legal">
      <ContentPageHero badge={displayBadge} title={displayHeading} lead={displayLead} />

      <section className="page-section page-section--muted section-reveal">
        <div className="page-section-container content-prose">
          <div className="content-prose-body">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="page-body-text content-prose-p">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="content-actions">
            <LocalizedLink href="/contact#form" className="btn-primary">
              {t('policy.contact', locale)}
            </LocalizedLink>
            <LocalizedLink href="/" className="btn-outline">
              {t('policy.home', locale)}
            </LocalizedLink>
          </div>
        </div>
      </section>
    </article>
  )
}
