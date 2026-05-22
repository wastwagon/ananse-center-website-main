import ContentPageHero from '../components/ContentPageHero'
import LocalizedLink from '../components/LocalizedLink'
import { getServerLocale } from '../lib/locale-server'
import { t } from '../lib/i18n'

export default async function NotFound() {
  const locale = await getServerLocale()

  return (
    <article className="content-page">
      <ContentPageHero
        badge={t('notFound.badge', locale)}
        title={t('notFound.title', locale)}
        lead={t('notFound.lead', locale)}
      />
      <section className="page-section page-section--muted section-reveal">
        <div className="page-section-container content-prose">
          <div className="content-actions">
            <LocalizedLink href="/" className="btn-primary">
              {t('policy.home', locale)}
            </LocalizedLink>
            <LocalizedLink href="/contact#form" className="btn-outline">
              {t('policy.contact', locale)}
            </LocalizedLink>
          </div>
        </div>
      </section>
    </article>
  )
}
