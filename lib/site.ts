/** Single source of truth — NGO-style contact & links (Ashoka / Africa Center pattern) */

export const site = {
  name: 'The Ananse Center for Arts and Culture',
  shortName: 'Ananse Center',
  tagline: 'Weaving wisdom into solutions',
  footerMission:
    'Preserving cultural memory and restoring identity through arts education, community programs, and Pan-African leadership development in Ghana and across the diaspora.',
  location: 'Akatakyiwa, Central Region, Ghana',
  address: 'The Ananse Center for Arts and Culture\nAkatakyiwa, Central Region\nGhana',
} as const

export const contact = {
  phone: '+233 25 712 7205',
  phoneHref: 'tel:+233257127205',
  email: 'info@anansecenter.org',
  programsEmail: 'programs@anansecenter.org',
  hours: 'Mon–Fri 9:00–17:00 · Sat 10:00–14:00',
} as const

/** Replace with your live channel URLs before launch */
export const social = {
  facebook: 'https://www.facebook.com/anansecenter',
  instagram: 'https://www.instagram.com/anansecenter',
  youtube: 'https://www.youtube.com/@anansecenter',
  twitter: 'https://twitter.com/anansecenter',
} as const

/** Impact metrics — update when you have audited figures */
export const impactStats = [
  { value: '500+', label: 'Lives Impacted' },
  { value: '50+', label: 'Programs Delivered' },
  { value: '15+', label: 'Communities Reached' },
  { value: '6', label: 'Mission Pillars' },
] as const

export const heroStatsDefault = impactStats

/** Paystack donations — Ghana cedis (default for Accra-based operations) */
export const paystack = {
  currency: 'GHS',
  currencySymbol: 'GH₵',
  minDonation: 10,
} as const
