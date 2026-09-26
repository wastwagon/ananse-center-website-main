/** Default impact strip (footer) — stored on SiteSettings, not content blocks. */
export const DEFAULT_IMPACT_STATS = [
  { value: '10', label: 'Programs' },
  { value: 'Character', label: 'Before influence' },
  { value: 'Wisdom', label: 'For the journey' },
  { value: 'Service', label: 'With responsibility' },
] as const

/** Default public site profile — seeded into SiteSettings; not stored as content blocks. */
export const DEFAULT_SITE_PROFILE = {
  siteName: 'ANANSE Center for Leadership Development',
  siteShortName: 'ANANSE',
  siteTagline: 'Leadership. Character. Excellence. Service.',
  siteLocation: 'Ghana',
  contactPhone: '+233 25 712 7205',
  contactPhoneHref: 'tel:+233257127205',
  contactEmail: 'info@anansecenter.org',
  programsEmail: 'programs@anansecenter.org',
  contactHours: 'Sun–Fri 9:00–17:00',
  contactAddress: 'ANANSE Center for Leadership Development\nGhana',
  lmsPortalUrl: '',
  googleAnalyticsId: '',
  legacyRedirectHost: 'anansecenter.oceancyber.site',
  socialFacebook: 'https://www.facebook.com/anansecenter',
  socialInstagram: 'https://www.instagram.com/anansecenter',
  socialYoutube: 'https://www.youtube.com/@anansecenter',
  socialTwitter: 'https://twitter.com/anansecenter',
  socialLinkedin: '',
  socialWhatsapp: '',
} as const
