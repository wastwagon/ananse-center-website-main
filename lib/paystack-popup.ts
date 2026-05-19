type PaystackTransaction = {
  reference: string
}

type PaystackPopInstance = {
  newTransaction: (options: Record<string, unknown>) => void
}

declare global {
  interface Window {
    PaystackPop?: new () => PaystackPopInstance
  }
}

let scriptPromise: Promise<void> | null = null

export function loadPaystackPopup(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Paystack is only available in the browser'))
  }

  if (window.PaystackPop) return Promise.resolve()

  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-paystack-inline]')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load Paystack')))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v2/inline.js'
    script.async = true
    script.dataset.paystackInline = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Paystack'))
    document.body.appendChild(script)
  })

  return scriptPromise
}

export async function openPaystackCheckout(input: {
  publicKey: string
  email: string
  accessCode: string
  currency?: string
  onSuccess: (reference: string) => void
  onCancel?: () => void
}) {
  await loadPaystackPopup()

  if (!window.PaystackPop) {
    throw new Error('Paystack failed to initialize')
  }

  const popup = new window.PaystackPop()
  popup.newTransaction({
    key: input.publicKey,
    email: input.email,
    access_code: input.accessCode,
    currency: input.currency || 'GHS',
    onSuccess: (transaction: PaystackTransaction) => {
      input.onSuccess(transaction.reference)
    },
    onCancel: () => input.onCancel?.(),
  })
}
