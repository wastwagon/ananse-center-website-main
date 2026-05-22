import LocalizedCmsPageShell from '../../../components/LocalizedCmsPageShell'
import { buildPageMetadata } from '../../../lib/page-meta'
import { getCmsTexts, parseCmsJson } from '../../../lib/cms/content'
import { DEFAULT_TRUSTEES, type CmsTrustee } from '../../../lib/cms/static-pages'

export const metadata = buildPageMetadata({
  title: 'Trustee Circle',
  description: 'Governance and accountability leadership at The Ananse Center for Arts and Culture.',
  path: '/trustees',
})

export default async function TrusteesPage() {
  const cms = await getCmsTexts(['trustees.badge', 'trustees.heading', 'trustees.lead', 'trustees.members'] as const)
  const members = parseCmsJson<CmsTrustee[]>(cms['trustees.members'], DEFAULT_TRUSTEES)

  return (
    <LocalizedCmsPageShell
      i18nKey="page.trustees"
      badge={cms['trustees.badge']}
      title={cms['trustees.heading']}
      lead={cms['trustees.lead']}
      primaryCta={{ label: 'Financial transparency', href: '/transparency' }}
      secondaryCta={{ label: 'Support our mission', href: '/support' }}
    >
      <div className="grid-cards grid-cards--stack-narrow">
        {members.map((member) => (
          <article key={member.name} className="premium-card">
            <h3 className="premium-card-title">{member.name}</h3>
            <span className="insight-card-tag">{member.role}</span>
            <p className="premium-card-description">{member.bio}</p>
          </article>
        ))}
      </div>
    </LocalizedCmsPageShell>
  )
}
