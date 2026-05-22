/** Default impact strip (footer) — stored on SiteSettings, not content blocks. */
export const DEFAULT_IMPACT_STATS = [
  { value: '500+', label: 'Lives Impacted' },
  { value: '50+', label: 'Programs Delivered' },
  { value: '15+', label: 'Communities Reached' },
  { value: '6', label: 'Mission Pillars' },
] as const

/** Default public site profile — seeded into SiteSettings; not stored as content blocks. */
export const DEFAULT_SITE_PROFILE = {
  siteName: 'The Ananse Center for Arts and Culture',
  siteShortName: 'Ananse Center',
  siteTagline: 'Weaving wisdom into solutions',
  siteLocation: 'Akatakyiwa, Central Region, Ghana',
  contactPhone: '+233 25 712 7205',
  contactPhoneHref: 'tel:+233257127205',
  contactEmail: 'info@anansecenter.org',
  programsEmail: 'programs@anansecenter.org',
  contactHours: 'Mon–Fri 9:00–17:00 · Sat 10:00–14:00',
  contactAddress: 'The Ananse Center for Arts and Culture\nAkatakyiwa, Central Region\nGhana',
  lmsPortalUrl: '',
  googleAnalyticsId: '',
  legacyRedirectHost: 'anansecenter.oceancyber.site',
  socialFacebook: 'https://www.facebook.com/anansecenter',
  socialInstagram: 'https://www.instagram.com/anansecenter',
  socialYoutube: 'https://www.youtube.com/@anansecenter',
  socialTwitter: 'https://twitter.com/anansecenter',
} as const
