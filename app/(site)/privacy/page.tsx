import PolicyPageLayout from '../../../components/PolicyPageLayout'
import { buildCmsMetadata } from '../../../lib/cms/seo'
import { getCmsTexts } from '../../../lib/cms/content'

export async function generateMetadata() {
  return buildCmsMetadata('privacy')
}

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
