'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyDonation } from '../lib/api'
import { formatDonationAmount } from '../lib/donations'

export default function DonationStatusBanner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const [variant, setVariant] = useState<'success' | 'error'>('success')

  useEffect(() => {
    const status = searchParams.get('donation')
    const reference = searchParams.get('reference')

    if (status !== 'success' || !reference) return

    let cancelled = false

    verifyDonation(reference)
      .then((result) => {
        if (cancelled) return
        setVariant('success')
        setMessage(
          `${result.message} (${formatDonationAmount(result.amount, result.currency)})`,
        )
      })
      .catch((error) => {
        if (cancelled) return
        setVariant('error')
        setMessage(error instanceof Error ? error.message : 'Could not verify your payment')
      })
      .finally(() => {
        if (cancelled) return
        router.replace('/support#donate', { scroll: false })
      })

    return () => {
      cancelled = true
    }
  }, [searchParams, router])

  if (!message) return null

  return (
    <div
      className={`donation-status donation-status--${variant}`}
      role="status"
      style={{ maxWidth: '960px', margin: '0 auto 1.5rem' }}
    >
      {message}
    </div>
  )
}
