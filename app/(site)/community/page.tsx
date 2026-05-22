import CmsPageShell from '../../../components/CmsPageShell'
import StorySubmissionForm from '../../../components/StorySubmissionForm'
import { buildPageMetadata } from '../../../lib/page-meta'
import { getCmsTexts, parseCmsJson } from '../../../lib/cms/content'
import { DEFAULT_SPOTLIGHTS, type CmsSpotlight } from '../../../lib/cms/static-pages'
import { fetchPublishedSpotlights, type ApiSpotlight } from '../../../lib/api'

export const metadata = buildPageMetadata({
  title: 'Community Spotlight',
  description: 'Partners and community organizations highlighted by The Ananse Center.',
  path: '/community',
})

function mergeSpotlights(cms: CmsSpotlight[], published: ApiSpotlight[]): CmsSpotlight[] {
  const fromDb = published.map((row) => ({
    name: row.name,
    org: row.org || row.title,
    description: row.description,
  }))
  const seen = new Set(fromDb.map((s) => `${s.name}:${s.org}`))
  const merged = [...fromDb]
  for (const item of cms) {
    const key = `${item.name}:${item.org}`
    if (!seen.has(key)) merged.push(item)
  }
  return merged
}

export default async function CommunityPage() {
  const cms = await getCmsTexts([
    'community.badge',
    'community.heading',
    'community.lead',
    'community.spotlights',
  ] as const)
  const cmsSpotlights = parseCmsJson<CmsSpotlight[]>(cms['community.spotlights'], DEFAULT_SPOTLIGHTS)
  const published = await fetchPublishedSpotlights()
  const spotlights = mergeSpotlights(cmsSpotlights, published)

  return (
    <>
      <CmsPageShell
        badge={cms['community.badge']}
        title={cms['community.heading']}
        lead={cms['community.lead']}
        primaryCta={{ label: 'Partner with us', href: '/partnerships' }}
        secondaryCta={{ label: 'View events', href: '/events' }}
      >
        <div className="grid-cards grid-cards--stack-narrow">
          {spotlights.map((item) => (
            <article key={`${item.name}-${item.org}`} className="premium-card">
              <h3 className="premium-card-title">{item.name}</h3>
              <span className="insight-card-tag">{item.org}</span>
              <p className="premium-card-description">{item.description}</p>
            </article>
          ))}
        </div>
      </CmsPageShell>
      <section className="page-section section-reveal bg-slate-50">
        <div className="page-section-container max-w-md">
          <h2 className="page-section-heading section-heading-sm">Share a story</h2>
          <p className="page-body-text text-body-md mb-section">
            Suggest a community partner or submit your Sankofa Journey experience for review.
          </p>
          <StorySubmissionForm />
        </div>
      </section>
    </>
  )
}
