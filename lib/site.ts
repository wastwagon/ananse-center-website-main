/** Single source of truth — NGO-style contact & links (Ashoka / Africa Center pattern) */

export const site = {
  name: 'ANANSE Center for Leadership Development',
  shortName: 'ANANSE',
  tagline: 'Leadership. Character. Excellence. Service.',
  footerMission: 'Developing people. Transforming lives. Strengthening communities.',
  location: 'Ghana',
  address: 'ANANSE Center for Leadership Development\nGhana',
} as const

export const contact = {
  phone: '+233 25 712 7205',
  phoneHref: 'tel:+233257127205',
  email: 'info@anansecenter.org',
  programsEmail: 'programs@anansecenter.org',
  hours: 'Sun–Fri 9:00–17:00',
} as const

/** Replace with your live channel URLs before launch */
export const social = {
  facebook: 'https://www.facebook.com/anansecenter',
  instagram: 'https://www.instagram.com/anansecenter',
  youtube: 'https://www.youtube.com/@anansecenter',
  twitter: 'https://twitter.com/anansecenter',
  linkedin: '',
  whatsapp: '',
} as const

/** Impact metrics — update when you have audited figures */
export const impactStats = [
  { value: '10', label: 'Programs' },
  { value: 'Character', label: 'Before influence' },
  { value: 'Wisdom', label: 'For the journey' },
  { value: 'Service', label: 'With responsibility' },
] as const

export const heroStatsDefault = impactStats

/** Paystack donations — Ghana cedis (default for Accra-based operations) */
export const paystack = {
  currency: 'GHS',
  currencySymbol: 'GH₵',
  minDonation: 10,
} as const
