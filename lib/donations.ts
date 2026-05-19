import { paystack } from './site'

export const DONATION_CURRENCY = paystack.currency
export const DONATION_MIN_AMOUNT = paystack.minDonation
export const DONATION_SYMBOL = paystack.currencySymbol

export function formatDonationAmount(amount: number, currency: string = DONATION_CURRENCY) {
  if (currency === 'GHS') {
    return `${DONATION_SYMBOL}${amount.toLocaleString()}`
  }
  if (currency === 'USD') {
    return `$${amount.toLocaleString()}`
  }
  if (currency === 'NGN') {
    return `₦${amount.toLocaleString()}`
  }
  return `${currency} ${amount.toLocaleString()}`
}

export function currencySymbol(currency: string = DONATION_CURRENCY) {
  if (currency === 'GHS') return DONATION_SYMBOL
  if (currency === 'USD') return '$'
  if (currency === 'NGN') return '₦'
  return currency
}
