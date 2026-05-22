import LocalizedCmsPageShell from '../../../components/LocalizedCmsPageShell'
import { buildPageMetadata } from '../../../lib/page-meta'
import { getCmsTexts, parseCmsJson, splitParagraphs } from '../../../lib/cms/content'

type PartnershipTier = { title: string; description: string }

export const metadata = buildPageMetadata({
  title: 'Partnerships',
  description:
    'Corporate and institutional partnerships with The Ananse Center for Arts and Culture.',
  path: '/partnerships',
})

export default async function PartnershipsPage() {
  const cms = await getCmsTexts([
    'partnerships.badge',
    'partnerships.heading',
    'partnerships.lead',
    'partnerships.body',
    'partnerships.tiers',
  ] as const)
  const tiers = parseCmsJson<PartnershipTier[]>(cms['partnerships.tiers'], [])

  return (
    <LocalizedCmsPageShell
      i18nKey="page.partnerships"
      badge={cms['partnerships.badge']}
      title={cms['partnerships.heading']}
      lead={cms['partnerships.lead']}
      primaryCta={{ label: 'Start a conversation', href: '/contact#form' }}
      secondaryCta={{ label: 'Support our work', href: '/support' }}
    >
      <div className="content-prose-body">
        {splitParagraphs(cms['partnerships.body']).map((p) => (
          <p key={p.slice(0, 48)} className="page-body-text content-prose-p">
            {p}
          </p>
        ))}
      </div>
      <div className="grid-cards grid-cards--stack-narrow">
        {tiers.map((tier) => (
          <article key={tier.title} className="premium-card">
            <h3 className="premium-card-title">{tier.title}</h3>
            <p className="premium-card-description">{tier.description}</p>
          </article>
        ))}
      </div>
    </LocalizedCmsPageShell>
  )
}
