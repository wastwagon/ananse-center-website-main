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
  'img',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
]

const ALLOWED_ATTR = [
  'href',
  'target',
  'rel',
  'class',
  'src',
  'alt',
  'title',
  'width',
  'height',
  'colspan',
  'rowspan',
]

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

/** Turn stored feature/highlight lines into an editor bullet list. */
export function linesToListHtml(lines: string[]): string {
  const items = lines.map((line) => line.trim()).filter(Boolean)
  if (!items.length) return ''
  return `<ul>${items
    .map((line) => `<li>${looksLikeHtml(line) ? line : escapeHtml(line)}</li>`)
    .join('')}</ul>`
}

/** Read bullet items back out of editor HTML, keeping inline formatting. */
export function listHtmlToLines(html: string): string[] {
  const items = [...html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((match) => {
    const inner = match[1].trim().replace(/^<p>([\s\S]*)<\/p>$/i, '$1').trim()
    return inner
  })
  const fromList = items.filter((item) => item.replace(/<[^>]+>/g, '').trim())
  if (fromList.length) return fromList
  return stripHtmlToPlain(html)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Strip tags for listing cards, meta descriptions, and search snippets. */
export function stripHtmlToPlain(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim()
}

/** First paragraph of plain or HTML CMS copy, optionally truncated. */
export function cmsPlainExcerpt(value: string, maxLen = 220): string {
  const plain = looksLikeHtml(value) ? stripHtmlToPlain(value) : value.trim()
  const first = plain.split(/\n\s*\n/)[0]?.trim() || plain
  if (!maxLen || first.length <= maxLen) return first
  return `${first.slice(0, maxLen - 1).trimEnd()}…`
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

/**
 * Drop the first top-level block so hero can show a plain summary
 * without duplicating the opener in the rich body.
 */
export function cmsHtmlAfterFirstBlock(body: string): string {
  const html = cmsBodyToSafeHtml(body)
  if (!html) return ''
  const withoutFirst = html.replace(/^<(p|h2|h3|h4|blockquote)(\s[^>]*)?>[\s\S]*?<\/\1>/i, '').trim()
  return withoutFirst || html
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
    (key.endsWith('.title') && (key.includes('.hero') || key.includes('home.hero'))) ||
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
