import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'ul',
  'ol',
  'li',
  'a',
  'h2',
  'h3',
  'h4',
  'blockquote',
  'span',
]

const ALLOWED_ATTR = ['href', 'target', 'rel', 'class']

/** True when the body already contains HTML tags from the rich editor. */
export function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value.trim())
}

/** Convert plain CMS paragraphs into simple HTML. */
export function plainTextToHtml(value: string): string {
  return value
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br />')}</p>`)
    .join('')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Sanitize CMS HTML for safe public rendering. */
export function sanitizeCmsHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  })
}

/** Normalize any CMS body (plain or HTML) into sanitized HTML. */
export function cmsBodyToSafeHtml(body: string): string {
  const trimmed = body.trim()
  if (!trimmed) return ''
  const html = looksLikeHtml(trimmed) ? trimmed : plainTextToHtml(trimmed)
  return sanitizeCmsHtml(html)
}

export const RICHTEXT_CONTENT_KEYS = new Set([
  'home.story',
  'home.cta.body',
  'about.whoWeAre.body',
  'about.mission',
  'about.mission.continuation',
  'about.vision',
  'about.cta.body',
  'about.timeline.lead',
  'about.team.lead',
  'programs.cta.body',
  'programs.benefits.lead',
  'programs.catalog.lead',
  'events.cta.body',
  'events.highlights.lead',
  'events.newsletter.lead',
  'support.cta.body',
  'support.donate.lead.ready',
  'support.donate.lead.offline',
  'support.transparency.body',
  'contact.cta.body',
  'contact.visit.blurb',
  'videos.cta.body',
  'privacy.lead',
  'privacy.body',
  'terms.lead',
  'terms.body',
  'visit.body',
  'visit.lead',
  'repatriation.body',
  'repatriation.lead',
  'admissions.body',
  'admissions.lead',
  'archives.body',
  'archives.lead',
  'partnerships.body',
  'partnerships.lead',
  'transparency.body',
  'transparency.lead',
  'community.lead',
  'community.body',
  'news.lead',
  'news.body',
  'resources.lead',
  'resources.body',
  'trustees.lead',
  'trustees.body',
])

export function isRichTextContentKey(key: string): boolean {
  return RICHTEXT_CONTENT_KEYS.has(key) || key.endsWith('.body') || key.endsWith('.lead')
}

export function isImagePathContentKey(key: string): boolean {
  return (
    key.endsWith('.image') ||
    key.endsWith('.ogImage') ||
    key === 'site.logo' ||
    key === 'site.favicon' ||
    key === 'site.appleIcon' ||
    key.endsWith('.coverImage') ||
    key.endsWith('.photoUrl') ||
    key.endsWith('.imageUrl')
  )
}

export function isJsonContentKey(key: string, hint?: string): boolean {
  if (key.includes('sections') && key.endsWith('.visible')) return true
  if (hint?.toLowerCase().includes('json')) return true
  return (
    key.endsWith('.stats') ||
    key.endsWith('.title') && (key.includes('.hero') || key.includes('home.hero')) ||
    key.endsWith('.buttons') ||
    key.endsWith('.highlights') ||
    key === 'home.pillars' ||
    key === 'home.testimonials' ||
    key === 'home.sectors' ||
    key === 'about.team' ||
    key === 'about.timeline' ||
    key === 'about.philosophy' ||
    key === 'about.approach' ||
    key === 'about.impact.metrics' ||
    key === 'about.whoWeAre.focusAreas' ||
    key === 'programs.benefits' ||
    key === 'programs.testimonials' ||
    key === 'videos.items' ||
    key === 'site.nav.primary' ||
    key === 'site.nav.mobile' ||
    key === 'site.nav.sheet' ||
    key === 'site.footer.quickLinks' ||
    key === 'site.footer.programLinks' ||
    key.endsWith('.tiers') ||
    key.endsWith('.ways') ||
    key.endsWith('.items') ||
    key.endsWith('.presets') ||
    key.endsWith('.members') ||
    key.endsWith('.allocation') ||
    key.endsWith('.categories') ||
    key.endsWith('.metrics') ||
    key.endsWith('.subjects') ||
    key.endsWith('.titles') ||
    key.endsWith('.visible')
  )
}
