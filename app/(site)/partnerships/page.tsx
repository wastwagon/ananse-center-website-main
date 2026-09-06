import LocalizedCmsPageShell from '../../../components/LocalizedCmsPageShell'
import CmsRichText from '../../../components/CmsRichText'
import { buildCmsMetadata } from '../../../lib/cms/seo'
import { getCmsTexts, parseCmsJson } from '../../../lib/cms/content'

type PartnershipTier = { title: string; description: string }

export async function generateMetadata() {
  return buildCmsMetadata('partnerships')
}

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
      <CmsRichText body={cms['partnerships.body']} className="content-prose-body" />
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
