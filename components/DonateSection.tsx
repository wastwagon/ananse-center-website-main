'use client'

import { useEffect, useState } from 'react'
import LocalizedLink from './LocalizedLink'
import {
  fetchDonationConfig,
  initializeDonation,
  verifyDonation,
  type DonationConfig,
} from '../lib/api'
import {
  currencySymbol,
  DONATION_CURRENCY,
  DONATION_MIN_AMOUNT,
  formatDonationAmount,
} from '../lib/donations'
import { paystack } from '../lib/site'
import { openPaystackCheckout } from '../lib/paystack-popup'
import { DEFAULT_SUPPORT_DONATE_PRESETS, type CmsDonatePreset } from '../lib/cms/registry'

const FALLBACK_DONATE_PRESETS = DEFAULT_SUPPORT_DONATE_PRESETS

type DonateSectionProps = {
  heading?: string
  leadReady?: string
  leadOffline?: string
  presets?: CmsDonatePreset[]
}

const DONOR_STORAGE_KEY = 'ananse_donor'

type DonorDetails = {
  name: string
  email: string
}

export default function DonateSection({
  heading,
  leadReady,
  leadOffline,
  presets = FALLBACK_DONATE_PRESETS,
}: DonateSectionProps) {
  const [config, setConfig] = useState<DonationConfig | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchDonationConfig()
      .then(setConfig)
      .catch(() =>
        setConfig({
          enabled: false,
          currency: DONATION_CURRENCY,
          publicKey: null,
          minAmount: DONATION_MIN_AMOUNT,
        }),
      )

    try {
      const saved = sessionStorage.getItem(DONOR_STORAGE_KEY)
      if (saved) {
        const donor = JSON.parse(saved) as DonorDetails
        setName(donor.name || '')
        setEmail(donor.email || '')
      }
    } catch {
      /* ignore */
    }
  }, [])

  function persistDonor(donor: DonorDetails) {
    try {
      sessionStorage.setItem(DONOR_STORAGE_KEY, JSON.stringify(donor))
    } catch {
      /* ignore */
    }
  }

  async function startDonation(amount: number, label: string) {
    setStatus(null)

    if (!config?.enabled || !config.publicKey) {
      setStatus({
        type: 'error',
        text: 'Online giving is not configured yet. Please contact us to donate.',
      })
      return
    }

    const trimmedEmail = email.trim()
    const trimmedName = name.trim()

    if (!trimmedEmail) {
      setStatus({ type: 'error', text: 'Enter your email to continue.' })
      return
    }

    if (amount < config.minAmount) {
      setStatus({
        type: 'error',
        text: `Minimum donation is ${formatDonationAmount(config.minAmount, config.currency)}.`,
      })
      return
    }

    setLoading(true)
    setSelectedLabel(label)

    try {
      persistDonor({ name: trimmedName, email: trimmedEmail })

      const session = await initializeDonation({
        email: trimmedEmail,
        name: trimmedName || undefined,
        amount,
        label,
      })

      const publicKey = session.publicKey || config.publicKey
      if (!publicKey) {
        throw new Error('Paystack public key is missing')
      }

      await openPaystackCheckout({
        publicKey,
        email: trimmedEmail,
        accessCode: session.accessCode,
        currency: session.currency || DONATION_CURRENCY,
        onSuccess: async (reference) => {
          try {
            const verified = await verifyDonation(reference)
            setStatus({ type: 'success', text: verified.message })
          } catch (error) {
            setStatus({
              type: 'error',
              text:
                error instanceof Error
                  ? error.message
                  : 'Payment received — we are confirming your gift.',
            })
          } finally {
            setLoading(false)
            setSelectedLabel(null)
          }
        },
        onCancel: () => {
          setLoading(false)
          setSelectedLabel(null)
          setStatus({ type: 'error', text: 'Payment was cancelled.' })
        },
      })
    } catch (error) {
      setLoading(false)
      setSelectedLabel(null)
      setStatus({
        type: 'error',
        text: error instanceof Error ? error.message : 'Unable to start payment',
      })
    }
  }

  function handleCustomDonation() {
    const amount = Number(customAmount)
    if (!Number.isFinite(amount) || amount <= 0) {
      setStatus({ type: 'error', text: 'Enter a valid custom amount.' })
      return
    }
    void startDonation(amount, 'Custom donation')
  }

  const symbol = currencySymbol(config?.currency || paystack.currency)
  const paymentsReady = Boolean(config?.enabled && config?.publicKey)

  return (
    <section id="donate" className="page-section bg-slate-50 section-reveal">
      <div className="page-section-container">
        <div className="page-section-center-header">
          <h2 className="page-section-heading">{heading ?? 'Ways to Give'}</h2>
          <p className="page-body-text">
            {paymentsReady
              ? (leadReady ??
                'Give securely with Paystack — card, mobile money, and bank transfer where available.')
              : (leadOffline ??
                'Add your Paystack keys to enable secure online giving. You can still reach us to donate offline.')}
          </p>
        </div>

        <div className="donate-panel">
          <div className="donate-panel-form">
            <h3 className="donate-panel-title">Your details</h3>
            <div className="donate-field">
              <label htmlFor="donor-name">Full name</label>
              <input
                id="donor-name"
                type="text"
                autoComplete="name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="donate-field">
              <label htmlFor="donor-email">Email *</label>
              <input
                id="donor-email"
                type="email"
                inputMode="email"
                required
                autoComplete="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            {status ? (
              <p className={`donation-status donation-status--${status.type}`} role="status">
                {status.text}
              </p>
            ) : null}
          </div>

          <div className="grid-cards donate-tier-grid">
            {presets.map((opt) => (
              <div key={opt.amount} className="program-card text-center donate-tier-card">
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A1A1A', marginBottom: '0.5rem' }}>
                  {symbol}
                  {opt.amount}
                </div>
                <div className="section-badge" style={{ marginBottom: '1.5rem' }}>
                  {opt.label}
                </div>
                <button
                  type="button"
                  className="btn-primary w-full"
                  disabled={loading}
                  onClick={() => void startDonation(opt.amount, opt.label)}
                >
                  {loading && selectedLabel === opt.label ? 'Opening Paystack…' : 'Donate Now'}
                </button>
              </div>
            ))}

            <div className="program-card text-center donate-tier-card donate-tier-card--custom">
              <div className="donate-field" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                <label htmlFor="custom-amount">Custom amount ({config?.currency || paystack.currency})</label>
                <input
                  id="custom-amount"
                  type="number"
                  inputMode="numeric"
                  min={config?.minAmount || paystack.minDonation}
                  step="1"
                  className="form-input"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder={`Min ${config?.minAmount || paystack.minDonation}`}
                />
              </div>
              <button
                type="button"
                className="btn-secondary w-full"
                disabled={loading}
                onClick={handleCustomDonation}
              >
                {loading && selectedLabel === 'Custom donation' ? 'Opening Paystack…' : 'Give Custom Amount'}
              </button>
            </div>
          </div>

          {!paymentsReady ? (
            <p className="page-body-text text-center" style={{ marginTop: '1.5rem' }}>
              <LocalizedLink href="/contact#form" className="program-card-link">
                Contact us to give offline →
              </LocalizedLink>
            </p>
          ) : null}

          <p className="donate-paystack-note">
            Payments processed by{' '}
            <a href="https://paystack.com" target="_blank" rel="noopener noreferrer">
              Paystack
            </a>
            . You will complete checkout in a secure popup.
          </p>
        </div>
      </div>
    </section>
  )
}
