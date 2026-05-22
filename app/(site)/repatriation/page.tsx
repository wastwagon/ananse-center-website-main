import CmsPageShell from '../../../components/CmsPageShell'
import { buildPageMetadata } from '../../../lib/page-meta'
import { getCmsTexts, parseCmsJson, splitParagraphs } from '../../../lib/cms/content'
import { DEFAULT_JOURNEY_STORIES, type CmsJourneyStory } from '../../../lib/cms/static-pages'
import LocalizedLink from '../../../components/LocalizedLink'

export const metadata = buildPageMetadata({
  title: 'Repatriation & Healing',
  description:
    'Restorative arts and repatriation resources for the African diaspora in Ghana’s Central Region.',
  path: '/repatriation',
})

export default async function RepatriationPage() {
  const cms = await getCmsTexts([
    'repatriation.badge',
    'repatriation.heading',
    'repatriation.lead',
    'repatriation.body',
    'repatriation.stories',
  ] as const)
  const stories = parseCmsJson<CmsJourneyStory[]>(cms['repatriation.stories'], DEFAULT_JOURNEY_STORIES)

  return (
    <CmsPageShell
      badge={cms['repatriation.badge']}
      title={cms['repatriation.heading']}
      lead={cms['repatriation.lead']}
      primaryCta={{ label: 'Apply to programs', href: '/admissions' }}
      secondaryCta={{ label: 'Contact our team', href: '/contact#form' }}
    >
      <div className="content-prose-body">
        {splitParagraphs(cms['repatriation.body']).map((p) => (
          <p key={p.slice(0, 48)} className="page-body-text content-prose-p">
            {p}
          </p>
        ))}
      </div>
      <h2 className="content-block-title content-block-title--plain">Sankofa Journey stories</h2>
      <div className="grid-cards grid-cards--stack-narrow">
        {stories.map((story) => (
          <article key={story.name} className="premium-card">
            <span className="insight-card-tag">{story.origin}</span>
            <h3 className="premium-card-title">{story.name}</h3>
            <p className="premium-card-description">&ldquo;{story.quote}&rdquo;</p>
            {story.mediaUrl ? (
              <LocalizedLink href={story.mediaUrl} className="program-card-link">
                Watch story →
              </LocalizedLink>
            ) : null}
          </article>
        ))}
      </div>
    </CmsPageShell>
  )
}
