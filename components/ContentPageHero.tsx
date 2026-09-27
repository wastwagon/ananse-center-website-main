import CmsRichText from './CmsRichText'

type ContentPageHeroProps = {
  badge: string
  title: string
  lead?: string
}

/** Static editorial header for policy and text-heavy pages (no photo hero). */
export default function ContentPageHero({ badge, title, lead }: ContentPageHeroProps) {
  return (
    <section className="content-page-hero section-reveal" aria-labelledby="content-page-title">
      <div className="page-section-container content-page-hero-inner">
        <span className="section-badge">{badge}</span>
        <h1 id="content-page-title" className="content-page-hero-title">
          {title}
        </h1>
        {lead ? <CmsRichText body={lead} className="content-page-hero-lead" /> : null}
      </div>
    </section>
  )
}
