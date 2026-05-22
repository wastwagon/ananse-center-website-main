import PolicyPageLayout from '../../../components/PolicyPageLayout'
import { buildPageMetadata } from '../../../lib/page-meta'
import { getCmsTexts } from '../../../lib/cms/content'

export const metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description:
    'How The Ananse Center collects, uses, and protects your personal information.',
  path: '/privacy',
})

export default async function PrivacyPage() {
  const cms = await getCmsTexts([
    'legal.badge',
    'privacy.heading',
    'privacy.lead',
    'privacy.body',
  ] as const)

  return (
    <PolicyPageLayout
      badge={cms['legal.badge']}
      heading={cms['privacy.heading']}
      lead={cms['privacy.lead']}
      body={cms['privacy.body']}
      headingKey="privacy.heading"
      leadKey="privacy.lead"
      bodyKey="privacy.body"
    />
  )
}
