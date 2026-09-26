import PolicyPageLayout from '../../../components/PolicyPageLayout'
import { buildCmsMetadata } from '../../../lib/cms/seo'
import { getCmsTexts } from '../../../lib/cms/content'
import { CONTENT_REGISTRY } from '../../../lib/cms/registry'

function leadershipLegalCopy(value: string, key: 'privacy.lead' | 'privacy.body') {
  if (/arts and culture|newsletter/i.test(value)) return CONTENT_REGISTRY[key].defaultBody
  return value
}

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
      lead={leadershipLegalCopy(cms['privacy.lead'], 'privacy.lead')}
      body={leadershipLegalCopy(cms['privacy.body'], 'privacy.body')}
      headingKey="privacy.heading"
      leadKey="privacy.lead"
      bodyKey="privacy.body"
    />
  )
}
