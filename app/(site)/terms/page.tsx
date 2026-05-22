import PolicyPageLayout from '../../../components/PolicyPageLayout'
import { buildPageMetadata } from '../../../lib/page-meta'
import { getCmsTexts } from '../../../lib/cms/content'

export const metadata = buildPageMetadata({
  title: 'Terms of Service',
  description: 'Terms and conditions for using The Ananse Center website and services.',
  path: '/terms',
})

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
