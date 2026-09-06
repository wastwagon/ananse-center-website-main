import Image from 'next/image'
import LocalizedCmsPageShell from '../../../components/LocalizedCmsPageShell'
import { buildCmsMetadata } from '../../../lib/cms/seo'
import { getCmsTexts, parseCmsJson, type CmsHeroCta } from '../../../lib/cms/content'
import { DEFAULT_TRUSTEES, type CmsTrustee } from '../../../lib/cms/static-pages'

export async function generateMetadata() {
  return buildCmsMetadata('trustees')
}

type TrusteeMember = CmsTrustee & { initials?: string; photoUrl?: string }

export default async function TrusteesPage() {
  const cms = await getCmsTexts([
    'trustees.badge',
    'trustees.heading',
    'trustees.lead',
    'trustees.members',
    'trustees.cta.primary',
    'trustees.cta.secondary',
  ] as const)
  const members = parseCmsJson<TrusteeMember[]>(cms['trustees.members'], DEFAULT_TRUSTEES)
  const primaryCta = parseCmsJson<CmsHeroCta>(cms['trustees.cta.primary'], {
    label: 'Financial Transparency',
    href: '/transparency',
  })
  const secondaryCta = parseCmsJson<CmsHeroCta>(cms['trustees.cta.secondary'], {
    label: 'Support Our Mission',
    href: '/support',
  })

  return (
    <LocalizedCmsPageShell
      i18nKey="page.trustees"
      badge={cms['trustees.badge']}
      title={cms['trustees.heading']}
      lead={cms['trustees.lead']}
      primaryCta={primaryCta}
      secondaryCta={secondaryCta}
    >
      <div className="grid-cards grid-cards--stack-narrow">
        {members.map((member) => (
          <article key={member.name} className="premium-card">
            {member.photoUrl ? (
              <div
                className="premium-card-image-wrapper premium-card-image-wrapper--short"
                style={{ borderRadius: '50%', width: 88, height: 88, marginBottom: '1rem' }}
              >
                <Image
                  src={member.photoUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="88px"
                />
              </div>
            ) : null}
            <h3 className="premium-card-title">{member.name}</h3>
            <span className="insight-card-tag">{member.role}</span>
            <p className="premium-card-description">{member.bio}</p>
          </article>
        ))}
      </div>
    </LocalizedCmsPageShell>
  )
}
