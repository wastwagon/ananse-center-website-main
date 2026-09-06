import PolicyPageLayout from '../../../components/PolicyPageLayout'
import { buildCmsMetadata } from '../../../lib/cms/seo'
import { getCmsTexts } from '../../../lib/cms/content'

export async function generateMetadata() {
  return buildCmsMetadata('terms')
}

export default async function TermsPage() {
  const cms = await getCmsTexts(['legal.badge', 'terms.heading', 'terms.lead', 'terms.body'] as const)

  return (
    <PolicyPageLayout
      badge={cms['legal.badge']}
      heading={cms['terms.heading']}
      lead={cms['terms.lead']}
      body={cms['terms.body']}
      headingKey="terms.heading"
      leadKey="terms.lead"
      bodyKey="terms.body"
    />
  )
}
