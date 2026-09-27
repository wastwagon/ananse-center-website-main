import ContentPageHero from '../../../components/ContentPageHero'
import SiteSearch from '../../../components/SiteSearch'
import { buildPageMetadata } from '../../../lib/page-meta'

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Search',
    description:
      'Search ANANSE programs, events, library resources, people, insights, and photo albums.',
    path: '/search',
  })
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const initialQuery = typeof q === 'string' ? q : ''

  return (
    <article className="content-page">
      <ContentPageHero
        badge="Search"
        title="Find programs, events, library & people"
        lead="Search across the ANANSE ecosystem — programs, gatherings, library resources, insights, people, and photo albums."
      />
      <section className="page-section page-section--muted section-reveal">
        <div className="page-section-container content-prose">
          <SiteSearch initialQuery={initialQuery} />
        </div>
      </section>
    </article>
  )
}
