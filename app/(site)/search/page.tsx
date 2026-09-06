import ContentPageHero from '../../../components/ContentPageHero'
import SiteSearch from '../../../components/SiteSearch'
import { buildCmsMetadata } from '../../../lib/cms/seo'

export async function generateMetadata() {
  return buildCmsMetadata('search')
}

export default function SearchPage() {
  return (
    <article className="content-page">
      <ContentPageHero
        badge="Search"
        title="Find programs, events & resources"
        lead="Search across our catalog, calendar, and mission pages."
      />
      <section className="page-section page-section--muted section-reveal">
        <div className="page-section-container content-prose">
          <SiteSearch />
        </div>
      </section>
    </article>
  )
}
