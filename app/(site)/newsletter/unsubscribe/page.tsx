import { buildPageMetadata } from '../../../../lib/page-meta'
import UnsubscribeClient from './UnsubscribeClient'

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Unsubscribe',
    description: 'Stop ANANSE newsletter updates for this address.',
    path: '/newsletter/unsubscribe',
  })
}

export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  return <UnsubscribeClient token={token?.trim() || ''} />
}
