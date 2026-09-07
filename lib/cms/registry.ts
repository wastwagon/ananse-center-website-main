/**
 * Canonical CMS content keys for the public site (seed + pages).
 * Keep in sync with backend/src/cms/registry.ts when adding keys.
 * Long-form copy only; contact/social live on SiteSettings (no duplicate blocks).
 */
import { STATIC_PAGE_REGISTRY } from './static-pages'
import { DEFAULT_MOBILE_NAV, DEFAULT_SHEET_NAV } from './nav'
import {
  DEFAULT_ABOUT_SECTIONS,
  DEFAULT_EVENTS_SECTIONS,
  DEFAULT_HOME_SECTIONS,
  DEFAULT_PROGRAMS_SECTIONS,
  DEFAULT_SUPPORT_SECTIONS,
} from './sections'
export type ContentRegistryEntry = {
  label: string
  section: string
  defaultBody: string
  format?: 'plain' | 'markdown' | 'html'
  hint?: string
}

export type CmsTestimonial = {
  tag: string
  quote: string
  name: string
  photoUrl?: string
}

export type CmsPillar = {
  title: string
  description: string
  iconKey: string
  imageUrl?: string
}

export type CmsSector = {
  name: string
  iconKey: string
}

export type CmsPhilosophyCard = {
  title: string
  description: string
  iconKey: string
  imageUrl?: string
}

export type CmsApproachStep = {
  num: string
  title: string
  description: string
  backgroundColor: string
  textColor: string
}

export type CmsLabeledValue = {
  label: string
  value: string
}

export type CmsDonationTier = {
  amount: string
  label: string
  iconKey: string
  imageUrl?: string
}

export type CmsSupportWay = {
  title: string
  description: string
  iconKey: string
  linkText: string
  imageUrl?: string
  href?: string
}

export type CmsStoryHighlight = {
  label: string
  sub: string
  iconKey: string
}

export type CmsDonatePreset = {
  amount: number
  label: string
}

export type CmsEventTestimonial = {
  quote: string
  name: string
  role: string
  initials: string
  photoUrl?: string
}

export type CmsVideoItem = {
  title: string
  url: string
}

export type CmsHeroTitle = {
  prefix: string
  accent: string
}

export type CmsHomeHeroTitle = {
  line1: string
  accent: string
}

export type CmsHeroStat = {
  value: string
  label: string
}

export type CmsHeroCta = {
  label: string
  href: string
}

const HOME_HERO_TITLE_DEFAULT: CmsHomeHeroTitle = {
  line1: 'Weaving wisdom into',
  accent: " Africa's future",
}

const HOME_HERO_STATS_DEFAULT: CmsHeroStat[] = [
  { value: '500+', label: 'Lives Impacted' },
  { value: '50+', label: 'Programs Delivered' },
  { value: '15+', label: 'Communities Reached' },
  { value: '6', label: 'Mission Pillars' },
]

const HOME_HERO_CTA_PRIMARY_DEFAULT: CmsHeroCta = { label: 'Explore Our Programs', href: '/programs' }
const HOME_HERO_CTA_SECONDARY_DEFAULT: CmsHeroCta = { label: 'Donate Now', href: '/support#donate' }

const ABOUT_HERO_TITLE_DEFAULT: CmsHeroTitle = { prefix: 'About ', accent: 'Ananse Center' }
const ABOUT_HERO_STATS_DEFAULT: CmsHeroStat[] = [
  { value: '2015', label: 'Year Founded' },
  { value: '500+', label: 'Alumni & Participants' },
  { value: '25+', label: 'Partner Organizations' },
  { value: '6', label: 'Mission Pillars' },
]
const ABOUT_HERO_CTA_PRIMARY_DEFAULT: CmsHeroCta = { label: 'Explore Programs', href: '/programs' }
const ABOUT_HERO_CTA_SECONDARY_DEFAULT: CmsHeroCta = { label: 'Visit Us', href: '/contact#form' }

const PROGRAMS_HERO_TITLE_DEFAULT: CmsHeroTitle = { prefix: 'Our ', accent: 'Transformative Programs' }
const PROGRAMS_HERO_STATS_DEFAULT: CmsHeroStat[] = [
  { value: '6+', label: 'Program Tracks' },
  { value: '500+', label: 'Participants' },
  { value: '15+', label: 'Communities' },
  { value: '100%', label: 'Cultural Focus' },
]
const PROGRAMS_HERO_CTA_PRIMARY_DEFAULT: CmsHeroCta = { label: 'Browse Programs', href: '/programs#catalog' }
const PROGRAMS_HERO_CTA_SECONDARY_DEFAULT: CmsHeroCta = { label: 'Apply Now', href: '/contact#form' }

const EVENTS_HERO_TITLE_DEFAULT: CmsHeroTitle = { prefix: 'Events & ', accent: 'Gatherings' }
const EVENTS_HERO_STATS_DEFAULT: CmsHeroStat[] = [
  { value: '45+', label: 'Gatherings' },
  { value: '1.2K+', label: 'Annual Guests' },
  { value: '15+', label: 'Communities' },
  { value: '2026', label: 'Season' },
]
const EVENTS_HERO_CTA_PRIMARY_DEFAULT: CmsHeroCta = { label: 'View Calendar', href: '/events#calendar' }
const EVENTS_HERO_CTA_SECONDARY_DEFAULT: CmsHeroCta = { label: 'Volunteer', href: '/contact#form' }

const SUPPORT_HERO_TITLE_DEFAULT: CmsHeroTitle = { prefix: 'Support Our ', accent: 'Mission' }
const SUPPORT_HERO_STATS_DEFAULT: CmsHeroStat[] = [
  { value: '100%', label: 'Program Focus' },
  { value: 'GH₵10K+', label: 'Monthly Reach' },
  { value: '25+', label: 'Artisans Supported' },
  { value: 'You', label: 'Make It Possible' },
]
const SUPPORT_HERO_CTA_PRIMARY_DEFAULT: CmsHeroCta = { label: 'Donate Now', href: '/support#donate' }
const SUPPORT_HERO_CTA_SECONDARY_DEFAULT: CmsHeroCta = { label: 'Partner With Us', href: '/contact#form' }

const CONTACT_HERO_TITLE_DEFAULT: CmsHeroTitle = { prefix: 'Visit & ', accent: 'Connect' }
const CONTACT_HERO_STATS_DEFAULT: CmsHeroStat[] = [
  { value: 'Accra', label: 'Main Center' },
  { value: '48h', label: 'Typical Reply' },
  { value: 'Sun–Fri', label: 'Office Hours' },
  { value: 'Join', label: 'Our Community' },
]
const CONTACT_HERO_CTA_PRIMARY_DEFAULT: CmsHeroCta = { label: 'Send a Message', href: '/contact#form' }
const CONTACT_HERO_CTA_SECONDARY_DEFAULT: CmsHeroCta = { label: 'View Programs', href: '/programs' }

const VIDEOS_HERO_TITLE_DEFAULT: CmsHeroTitle = { prefix: 'Watch Our ', accent: 'Stories' }
const VIDEOS_HERO_STATS_DEFAULT: CmsHeroStat[] = [
  { value: '8+', label: 'Featured Talks' },
  { value: 'YouTube', label: 'Channel' },
  { value: 'Free', label: 'To Watch' },
  { value: 'Share', label: 'With Community' },
]
const VIDEOS_HERO_CTA_PRIMARY_DEFAULT: CmsHeroCta = { label: 'Get in Touch', href: '/contact#form' }
const VIDEOS_HERO_CTA_SECONDARY_DEFAULT: CmsHeroCta = { label: 'View Events', href: '/events' }

const HOME_CTA_BUTTONS_DEFAULT: CmsHeroCta[] = [
  { label: 'Explore Programs', href: '/programs' },
  { label: 'Get in Touch', href: '/contact#form' },
  { label: 'Donate Today', href: '/support#donate' },
]

const CONTACT_INFO_TITLES_DEFAULT = ['Our Location', 'Email Us', 'Call Us', 'Office Hours']

const CONTACT_FORM_SUBJECTS_DEFAULT = [
  'General Inquiry',
  'Programs & Classes',
  'Partnerships',
  'Volunteering',
]

const EVENTS_DETAIL_HIGHLIGHTS_FALLBACK_DEFAULT = [
  'Join us for an unforgettable gathering at The Ananse Center.',
]

const HOME_PILLARS_DEFAULT: CmsPillar[] = [
  {
    iconKey: 'Sprout',
    title: 'Value-Based Leadership',
    description:
      'Developing youth entrepreneurs and innovators grounded in African values and community responsibility.',
  },
  {
    iconKey: 'Users',
    title: 'Service to Community',
    description:
      'Reorienting young people toward service, self-sufficiency, and the spirit of Ubuntu.',
  },
  {
    iconKey: 'Globe',
    title: 'Pan-Africanism',
    description:
      'Aligning leadership with AU Agenda 2063 — building dignity and unity across the continent.',
  },
  {
    iconKey: 'Heart',
    title: 'Holistic Health & Wellness',
    description:
      'NEWSTART-informed programs for mind, body, and spirit — rooted in cultural wisdom.',
  },
  {
    iconKey: 'Scale',
    title: 'Peace & Conflict Resolution',
    description:
      'Blending traditional African adjudication with modern methods for lasting community peace.',
  },
  {
    iconKey: 'Building2',
    title: 'Organizational Excellence',
    description:
      'A credible, well-resourced center led by professionals committed to the mission.',
  },
]

const HOME_SECTORS_DEFAULT: CmsSector[] = [
  { iconKey: 'GraduationCap', name: 'Education & Leadership' },
  { iconKey: 'Heart', name: 'Healthcare & Wellness' },
  { iconKey: 'Scale', name: 'Legal & Mediation' },
  { iconKey: 'Palette', name: 'Arts, Culture & Music' },
  { iconKey: 'Sprout', name: 'Agriculture & Food' },
  { iconKey: 'Network', name: 'Community & Service' },
]

const ABOUT_PHILOSOPHY_DEFAULT: CmsPhilosophyCard[] = [
  {
    iconKey: 'Globe',
    title: 'Ubuntu Philosophy',
    description:
      'I am because we are. We believe in the interconnectedness of all people and the importance of community in personal and cultural development.',
  },
  {
    iconKey: 'History',
    title: 'Sankofa Principle',
    description:
      'Go back and fetch it. We honor the wisdom of our ancestors while moving forward, understanding that the past holds keys to our future.',
  },
  {
    iconKey: 'Palette',
    title: 'Restorative Arts',
    description:
      'Art as healing. We use creative expression as a tool for personal healing, community restoration, and cultural reclamation.',
  },
  {
    iconKey: 'BookOpen',
    title: 'Intergenerational Wisdom',
    description:
      'Knowledge flows through generations. We create spaces where elders and youth learn from each other in both directions.',
  },
  {
    iconKey: 'Sparkles',
    title: 'Cultural Innovation',
    description:
      'Tradition meets tomorrow. We believe cultural practices should evolve and adapt while maintaining their essential spirit.',
  },
  {
    iconKey: 'Globe2',
    title: 'Global Localism',
    description:
      'Rooted locally, connected globally. We celebrate local traditions while recognizing our place in a global community.',
  },
]

const ABOUT_APPROACH_DEFAULT: CmsApproachStep[] = [
  {
    num: '1',
    backgroundColor: '#fff7ed',
    textColor: '#b45309',
    title: 'Community-Led',
    description:
      'Our programs are developed in partnership with the communities we serve, ensuring cultural authenticity and community ownership.',
  },
  {
    num: '2',
    backgroundColor: '#f0fdf4',
    textColor: '#15803d',
    title: 'Holistic Development',
    description:
      'We address the whole person—mind, body, and spirit—through integrated programs that combine arts, education, and wellness.',
  },
  {
    num: '3',
    backgroundColor: '#f8fafc',
    textColor: '#334155',
    title: 'Intergenerational Connection',
    description:
      'We create opportunities for knowledge exchange between generations, strengthening cultural continuity and mutual understanding.',
  },
  {
    num: '4',
    backgroundColor: '#eff6ff',
    textColor: '#1d4ed8',
    title: 'Accessibility & Inclusion',
    description:
      'We remove barriers to participation and create welcoming spaces for people of all backgrounds, abilities, and experiences.',
  },
]

const ABOUT_IMPACT_METRICS_DEFAULT: CmsLabeledValue[] = [
  { label: 'Students Served', value: '500+' },
  { label: 'Programs Active', value: '15+' },
  { label: 'Community Partners', value: '25+' },
  { label: 'Countries Connected', value: '15+' },
]

const SUPPORT_DONATION_TIERS_DEFAULT: CmsDonationTier[] = [
  {
    amount: 'GH₵50',
    label: 'Provides art supplies for one student for a semester',
    iconKey: 'Palette',
  },
  {
    amount: 'GH₵100',
    label: 'Funds a community workshop for 20 participants',
    iconKey: 'Users',
  },
  {
    amount: 'GH₵250',
    label: "Supports a master artisan's teaching for one month",
    iconKey: 'GraduationCap',
  },
  {
    amount: 'GH₵500',
    label: 'Covers program materials for an entire class',
    iconKey: 'Package',
  },
]

const SUPPORT_OTHER_WAYS_DEFAULT: CmsSupportWay[] = [
  {
    title: 'Volunteer',
    description:
      "Share your skills and time with our programs. Whether you're an artist, educator, or organizer, we'd love to have you on our team.",
    iconKey: 'HandHeart',
    linkText: 'Join Our Team',
  },
  {
    title: 'Corporate Partnerships',
    description:
      'Partner with us to support cultural preservation and community development through corporate social responsibility initiatives.',
    iconKey: 'Building2',
    linkText: 'Partner With Us',
  },
  {
    title: 'Legacy Giving',
    description:
      'Include The Ananse Center in your estate planning to create a lasting impact on cultural preservation for generations to come.',
    iconKey: 'Scroll',
    linkText: 'Plan Your Legacy',
  },
]

const HOME_STORY_HIGHLIGHTS_DEFAULT: CmsStoryHighlight[] = [
  { iconKey: 'Network', label: 'Cultural Weaving', sub: 'Connecting generations' },
  { iconKey: 'Sprout', label: 'Identity Restored', sub: 'Roots rediscovered' },
  { iconKey: 'Users', label: 'Community Built', sub: 'Ubuntu in practice' },
  { iconKey: 'Globe', label: 'Africa-Wide Reach', sub: '15+ communities' },
]

const SUPPORT_TRANSPARENCY_ALLOCATION_DEFAULT: CmsLabeledValue[] = [
  { label: 'Programs & Services', value: '75%' },
  { label: 'Community Outreach', value: '15%' },
  { label: 'Operations', value: '10%' },
]

const SUPPORT_STANDARDS_ITEMS_DEFAULT = [
  'Registered cultural NGO operating in Ghana',
  'Annual financial reporting to partners and donors',
  'Transparent reporting on program outcomes',
  'Board of directors with diverse representation',
]

const SUPPORT_DONATE_PRESETS_DEFAULT: CmsDonatePreset[] = [
  { amount: 50, label: 'Art Supplies' },
  { amount: 100, label: 'Community Workshop' },
  { amount: 250, label: 'Artisan Support' },
  { amount: 500, label: 'Classroom Materials' },
  { amount: 1000, label: 'Legacy Builder' },
]

const EVENTS_FILTER_CATEGORIES_DEFAULT = [
  'All Events',
  'Festival',
  'Workshop',
  'Retreat',
  'Exhibition',
  'Symposium',
]

const EVENTS_HIGHLIGHTS_METRICS_DEFAULT: CmsLabeledValue[] = [
  { label: 'Participants', value: '1,200+' },
  { label: 'Gatherings', value: '45+' },
  { label: 'Partners', value: '25+' },
  { label: 'Countries', value: '15+' },
]

const EVENTS_HIGHLIGHTS_TESTIMONIAL_DEFAULT: CmsEventTestimonial = {
  quote:
    'The festival did not feel like a show I attended—it felt like a family I rejoined. Drumming, story, and shared meals reminded me that culture is how we practice belonging together.',
  name: 'Kwesi',
  role: 'Festival participant · Central Region',
  initials: 'KW',
}

const VIDEOS_ITEMS_DEFAULT: CmsVideoItem[] = [
  { title: 'MARRIAGE & RELATIONSHIPS', url: 'https://www.youtube.com/embed/PhoTnWHzY_Y' },
  { title: 'THE MINDSET OF INTEGRITY', url: 'https://www.youtube.com/embed/bfTzodebHUT16mkYt' },
  { title: 'HEALED WOUNDS BUT UGLY SCARS', url: 'https://www.youtube.com/embed/1-O0vTxDXbs' },
  { title: 'THE NEED FOR EXCELLENCE', url: 'https://www.youtube.com/embed/OiTjdPM1S94' },
  { title: 'EMPOWERING MINDS, SHAPING FUTURES', url: 'https://www.youtube.com/embed/o9f0173B9b8' },
  { title: 'THE MINDSET OF FAILURE', url: 'https://www.youtube.com/embed/PLEsQPe0PR9FcXays' },
  { title: 'TOP OF THE TOP TEN', url: 'https://www.youtube.com/embed/1ipkq8F_Nkc' },
  { title: 'UNCOMFORTABLE GRACE', url: 'https://www.youtube.com/embed/-ZhF1JNx5oc' },
]

const GLOBAL_BAND_CTA_DEFAULT: CmsHeroCta = { label: 'Subscribe', href: '/events#newsletter' }

const VIDEOS_CTA_PRIMARY_DEFAULT: CmsHeroCta = { label: 'View Events', href: '/events' }
const VIDEOS_CTA_SECONDARY_DEFAULT: CmsHeroCta = { label: 'Get in Touch', href: '/contact#form' }

const EVENTS_CTA_PRIMARY_DEFAULT: CmsHeroCta = { label: 'Browse Programs', href: '/programs' }
const EVENTS_CTA_SECONDARY_DEFAULT: CmsHeroCta = { label: 'Volunteer', href: '/contact#form' }

/**
 * SEO defaults, mirrored from lib/cms/seo.ts (title/description only).
 * Kept local to avoid a circular import: seo.ts -> content.ts -> registry.ts.
 */
const SEO_PAGE_IDS = [
  'home',
  'about',
  'programs',
  'events',
  'support',
  'contact',
  'videos',
  'visit',
  'repatriation',
  'admissions',
  'archives',
  'community',
  'news',
  'partnerships',
  'resources',
  'transparency',
  'trustees',
  'privacy',
  'terms',
  'search',
] as const

const SEO_PAGE_TEXT_DEFAULTS: Record<(typeof SEO_PAGE_IDS)[number], { title: string; description: string }> = {
  home: {
    title: 'Home',
    description:
      'The Ananse Center for Arts and Culture — Sankofa programs, events, and Pan-African leadership development in Accra and across the diaspora.',
  },
  about: {
    title: 'About',
    description:
      'Learn about The Ananse Center mission, vision, leadership, and Sankofa approach to cultural restoration.',
  },
  programs: {
    title: 'Programs',
    description: 'Explore Sankofa arts, culture, and leadership programs at The Ananse Center in Ghana.',
  },
  events: {
    title: 'Events',
    description: 'Festivals, workshops, and community gatherings at The Ananse Center for Arts and Culture.',
  },
  support: {
    title: 'Support',
    description:
      'Donate and partner with The Ananse Center to sustain cultural arts education and community programs.',
  },
  contact: {
    title: 'Contact',
    description: 'Contact The Ananse Center for partnerships, visits, programs, and press inquiries.',
  },
  videos: {
    title: 'Videos',
    description: 'Stories, performances, and teachings from The Ananse Center community.',
  },
  visit: {
    title: 'Visit',
    description: 'Plan a visit to The Ananse Center campus in Akatakyiwa, Central Region, Ghana.',
  },
  repatriation: {
    title: 'Repatriation',
    description: 'Sankofa healing journeys and cultural repatriation programs at The Ananse Center.',
  },
  admissions: {
    title: 'Admissions',
    description: 'Admissions information for Ananse Center programs and learning pathways.',
  },
  archives: {
    title: 'Archives',
    description: 'Digitized cultural heritage with community-centered metadata at The Ananse Center.',
  },
  community: {
    title: 'Community',
    description: 'Community stories, spotlights, and submissions from The Ananse Center network.',
  },
  news: {
    title: 'News',
    description: 'News and updates from The Ananse Center for Arts and Culture.',
  },
  partnerships: {
    title: 'Partnerships',
    description: 'Partner with The Ananse Center to advance cultural education and leadership.',
  },
  resources: {
    title: 'Resources',
    description: 'Learning resources and materials from The Ananse Center.',
  },
  transparency: {
    title: 'Transparency',
    description: 'Financial transparency and stewardship reports from The Ananse Center.',
  },
  trustees: {
    title: 'Trustees',
    description: 'Meet the Board of Trustees of The Ananse Center for Arts and Culture.',
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'Privacy policy for The Ananse Center website and community programs.',
  },
  terms: {
    title: 'Terms of Service',
    description: 'Terms of service for The Ananse Center website.',
  },
  search: {
    title: 'Search',
    description: 'Search The Ananse Center website for programs, events, and resources.',
  },
}

type SeoRegistryPageId = (typeof SEO_PAGE_IDS)[number]
type SeoRegistryKey = `seo.${SeoRegistryPageId}.title` | `seo.${SeoRegistryPageId}.description` | `seo.${SeoRegistryPageId}.ogImage`

function buildSeoRegistryKeys(): Record<SeoRegistryKey, ContentRegistryEntry> {
  const out = {} as Record<SeoRegistryKey, ContentRegistryEntry>
  for (const page of SEO_PAGE_IDS) {
    const defaults = SEO_PAGE_TEXT_DEFAULTS[page]
    out[`seo.${page}.title`] = {
      label: `SEO — ${page} title`,
      section: 'seo',
      defaultBody: defaults.title,
      hint: 'Browser tab and search title (site name is appended automatically).',
    }
    out[`seo.${page}.description`] = {
      label: `SEO — ${page} description`,
      section: 'seo',
      defaultBody: defaults.description,
      hint: 'Meta description for search and social previews.',
    }
    out[`seo.${page}.ogImage`] = {
      label: `SEO — ${page} Open Graph image`,
      section: 'seo',
      defaultBody: '',
      hint: 'Optional public path or Media Library URL. Leave blank to use the default OG image.',
    }
  }
  return out
}

const HOME_TESTIMONIALS_DEFAULT: CmsTestimonial[] = [
  {
    tag: 'Mentorship',
    quote:
      'Sankofa Mentorship gave me language for leadership rooted in Ubuntu—not performance, but service. I left with mentors, peers, and a clearer sense of how to give back.',
    name: 'Ama · Sankofa Mentorship alum',
  },
  {
    tag: 'Restorative arts',
    quote:
      'Working with pattern, cloth, and color helped me name grief I had carried quietly. The studio felt like a circle of care as much as a classroom.',
    name: 'Jordan · Restorative Arts participant',
  },
  {
    tag: 'Diaspora return',
    quote:
      'I came from the United States expecting a tour. What I found was kinship—elders, artists, and youth inviting me to listen first and belong with humility.',
    name: 'Marcus · Diaspora guest',
  },
]

export const CONTENT_REGISTRY = {
  'home.hero.lead': {
    label: 'Home — hero lead',
    section: 'home',
    defaultBody:
      "Empowering African communities through Sankofa-inspired education, culture, leadership, and heritage preservation.",
  },
  'home.hero.trust': {
    label: 'Home — hero trust line',
    section: 'home',
    defaultBody:
      'Empowering communities through culture, education, and leadership across Ghana and the African diaspora.',
  },
  'home.hero.image': {
    label: 'Home — hero background image path',
    section: 'home',
    hint: 'Public path like /images/image (20).jpeg or a Media Library URL like /api/media/file/.... Upload in Media, then paste the file URL here.',
    defaultBody: '/images/image (20).jpeg',
  },
  'home.hero.imageAlt': {
    label: 'Home — hero image alt text',
    section: 'home',
    defaultBody: 'Community gathering at The Ananse Center for Arts and Culture',
  },
  'home.hero.title': {
    label: 'Home — hero title (JSON)',
    section: 'home',
    hint: 'JSON: { "line1", "accent" } — accent is shown on the second line in gold.',
    defaultBody: JSON.stringify(HOME_HERO_TITLE_DEFAULT, null, 2),
  },
  'home.hero.stats': {
    label: 'Home — hero stats (JSON)',
    section: 'home',
    hint: 'JSON array: [{ "value", "label" }]',
    defaultBody: JSON.stringify(HOME_HERO_STATS_DEFAULT, null, 2),
  },
  'home.hero.cta.primary': {
    label: 'Home — hero primary CTA (JSON)',
    section: 'home',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(HOME_HERO_CTA_PRIMARY_DEFAULT, null, 2),
  },
  'home.hero.cta.secondary': {
    label: 'Home — hero secondary CTA (JSON)',
    section: 'home',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(HOME_HERO_CTA_SECONDARY_DEFAULT, null, 2),
  },
  'home.story': {
    label: 'Home — our story (paragraphs)',
    section: 'home',
    format: 'html',
    hint: 'Rich text supported. Separate paragraphs with Enter.',
    defaultBody:
      'In Akan tradition, Ananse the spider weaves webs that connect generations — stories that heal, teach, and unite.\n\nOur center is a gathering place where ancestral wisdom meets contemporary creativity: for students finding pathways to heritage, for the diaspora returning home, and for communities celebrating who we are.',
  },
  'home.story.highlights': {
    label: 'Home — story sidebar highlights (JSON)',
    section: 'home',
    hint: 'JSON array: [{ "label", "sub", "iconKey" }]',
    defaultBody: JSON.stringify(HOME_STORY_HIGHLIGHTS_DEFAULT, null, 2),
  },
  'home.story.badge': {
    label: 'Home — story section badge',
    section: 'home',
    defaultBody: 'Our Story',
  },
  'home.story.heading': {
    label: 'Home — story section heading',
    section: 'home',
    defaultBody: 'The Ananse Story',
  },
  'home.pillars.lead': {
    label: 'Home — pillars section intro',
    section: 'home',
    defaultBody:
      'Interconnected commitments that guide every program, partnership, and community initiative we undertake.',
  },
  'home.pillars': {
    label: 'Home — strategic pillars (JSON)',
    section: 'home',
    hint: 'JSON array: [{ "title", "description", "iconKey" }]. Order matches pillar images.',
    defaultBody: JSON.stringify(HOME_PILLARS_DEFAULT, null, 2),
  },
  'home.pillars.badge': {
    label: 'Home — pillars section badge',
    section: 'home',
    defaultBody: 'Strategic Goals',
  },
  'home.pillars.heading': {
    label: 'Home — pillars section heading',
    section: 'home',
    defaultBody: 'Six Pillars of Transformation',
  },
  'home.programs.lead': {
    label: 'Home — programs section intro',
    section: 'home',
    defaultBody:
      'Six flagship initiatives developing whole persons — spiritually, academically, and as community leaders.',
  },
  'home.programs.badge': {
    label: 'Home — programs section badge',
    section: 'home',
    defaultBody: 'Sankofa Programs',
  },
  'home.programs.heading': {
    label: 'Home — programs section heading',
    section: 'home',
    defaultBody: 'Programs That Transform',
  },
  'home.events.lead': {
    label: 'Home — events section intro',
    section: 'home',
    defaultBody:
      'Festivals, workshops, and retreats that bring our mission to life across Ghana.',
  },
  'home.events.badge': {
    label: 'Home — events section badge',
    section: 'home',
    defaultBody: 'Gatherings',
  },
  'home.events.heading': {
    label: 'Home — events section heading',
    section: 'home',
    defaultBody: 'Upcoming Events',
  },
  'home.testimonials.lead': {
    label: 'Home — testimonials section intro',
    section: 'home',
    defaultBody:
      'Voices from participants, alumni, and partners — the human face of our work.',
  },
  'home.testimonials': {
    label: 'Home — testimonials (JSON)',
    section: 'home',
    hint: 'JSON array: [{ "tag", "quote", "name", "photoUrl?" }]. photoUrl can be a Media Library path.',
    defaultBody: JSON.stringify(HOME_TESTIMONIALS_DEFAULT, null, 2),
  },
  'home.testimonials.badge': {
    label: 'Home — testimonials section badge',
    section: 'home',
    defaultBody: 'Impact',
  },
  'home.testimonials.heading': {
    label: 'Home — testimonials section heading',
    section: 'home',
    defaultBody: 'Stories From Our Community',
  },
  'home.sectors.lead': {
    label: 'Home — sectors section intro',
    section: 'home',
    defaultBody:
      'Bridging disciplines with one mission: dignity, development, and cultural excellence.',
  },
  'home.sectors': {
    label: 'Home — sectors grid (JSON)',
    section: 'home',
    hint: 'JSON array: [{ "name", "iconKey" }]',
    defaultBody: JSON.stringify(HOME_SECTORS_DEFAULT, null, 2),
  },
  'home.sectors.badge': {
    label: 'Home — sectors section badge',
    section: 'home',
    defaultBody: 'Sectors We Serve',
  },
  'home.sectors.heading': {
    label: 'Home — sectors section heading',
    section: 'home',
    defaultBody: 'Where We Work',
  },
  'home.cta.heading': {
    label: 'Home — bottom CTA heading',
    section: 'home',
    defaultBody: 'Begin Your Journey With Us',
  },
  'home.cta.body': {
    label: 'Home — bottom CTA body',
    section: 'home',
    format: 'html',
    defaultBody:
      'Whether you seek programs, partnership, or a way to give back — there is a place for you at our table.',
  },
  'home.cta.buttons': {
    label: 'Home — bottom CTA buttons (JSON)',
    section: 'home',
    hint: 'JSON array: [{ "label", "href" }]',
    defaultBody: JSON.stringify(HOME_CTA_BUTTONS_DEFAULT, null, 2),
  },
  'home.story.cta': {
    label: 'Home — story section link',
    section: 'home',
    defaultBody: 'Read Our Mission',
  },
  'home.pillars.cardCta': {
    label: 'Home — pillar card link',
    section: 'home',
    defaultBody: 'Our approach',
  },
  'home.programs.link': {
    label: 'Home — programs section link',
    section: 'home',
    defaultBody: 'View all programs →',
  },
  'home.programs.cardLabel': {
    label: 'Home — program card badge',
    section: 'home',
    defaultBody: 'Sankofa',
  },
  'home.programs.cardCta': {
    label: 'Home — program card link',
    section: 'home',
    defaultBody: 'Program details',
  },
  'home.events.cardCta': {
    label: 'Home — event card link',
    section: 'home',
    defaultBody: 'Event Details',
  },
  'home.events.calendarLink': {
    label: 'Home — events calendar link',
    section: 'home',
    defaultBody: 'View full calendar',
  },
  'about.mission.heading': {
    label: 'About — mission heading',
    section: 'about',
    defaultBody: 'Our Mission',
  },
  'about.vision.heading': {
    label: 'About — vision heading',
    section: 'about',
    defaultBody: 'Our Vision',
  },
  'about.mission': {
    label: 'About — mission summary',
    section: 'about',
    format: 'html',
    defaultBody:
      'We weave wisdom into solutions by connecting cultural knowledge with practical programs that empower youth and communities.',
  },
  'about.mission.continuation': {
    label: 'About — mission (continued)',
    section: 'about',
    format: 'html',
    defaultBody:
      'We connect African cultural knowledge with practical programs that empower youth, strengthen communities, and preserve our shared heritage for future generations.',
  },
  'about.hero.lead': {
    label: 'About — hero description',
    section: 'about',
    defaultBody:
      "Preserving Africa's Heritage. Inspiring Tomorrow's Leaders.",
  },
  'about.whoWeAre.badge': {
    label: 'About — who we are badge',
    section: 'about',
    defaultBody: 'Our Identity',
  },
  'about.whoWeAre.heading': {
    label: 'About — who we are heading',
    section: 'about',
    defaultBody: 'Who We Are',
  },
  'about.whoWeAre.body': {
    label: 'About — who we are (paragraphs)',
    section: 'about',
    format: 'html',
    hint: 'Rich text supported.',
    defaultBody:
      'Ananse Center is a Sankofa-inspired arts and culture organization rooted in Akatakyiwa, Central Region, Ghana — serving communities across Ghana and the African diaspora.\n\nNamed after Ananse, the wise spider of Akan storytelling, we weave ancestral knowledge into living programs for education, culture, leadership, and community development. We exist to restore identity, nurture the next generation of Pan-African leaders, and keep heritage active in contemporary life.',
  },
  'about.whoWeAre.focusHeading': {
    label: 'About — focus areas heading',
    section: 'about',
    defaultBody: 'Our Focus Areas',
  },
  'about.whoWeAre.focusAreas': {
    label: 'About — focus areas (JSON)',
    section: 'about',
    hint: 'JSON array of short focus area labels.',
    defaultBody: JSON.stringify(
      ['Education', 'Culture', 'Leadership', 'Community Development'],
      null,
      2,
    ),
  },
  'about.whoWeAre.teamCta': {
    label: 'About — meet the team link',
    section: 'about',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify({ label: 'Meet Our Trustees', href: '/trustees' }, null, 2),
  },
  'about.hero.image': {
    label: 'About — hero background image path',
    section: 'about',
    hint: 'Public path or Media Library URL (/api/media/file/...).',
    defaultBody: '/images/image (18).jpeg',
  },
  'about.hero.imageAlt': {
    label: 'About — hero image alt text',
    section: 'about',
    defaultBody: 'Community and cultural life at The Ananse Center',
  },
  'about.timeline.badge': {
    label: 'About — timeline badge',
    section: 'about',
    defaultBody: 'Our Journey',
  },
  'about.timeline.heading': {
    label: 'About — timeline heading',
    section: 'about',
    defaultBody: 'Milestones Along the Way',
  },
  'about.timeline.lead': {
    label: 'About — timeline intro',
    section: 'about',
    format: 'html',
    defaultBody:
      'From a Sankofa vision in Ghana to growing programs that connect diaspora and local communities—here are milestones that shaped The Ananse Center.',
  },
  'about.timeline': {
    label: 'About — timeline items (JSON)',
    section: 'about',
    hint: 'JSON array: [{ "year", "title", "description" }]',
    defaultBody: JSON.stringify(
      [
        {
          year: '2015',
          title: 'Vision takes root',
          description:
            'The Ananse Center is founded to weave ancestral wisdom into living arts, culture, and leadership education for Ghana and the African diaspora.',
        },
        {
          year: '2018–2022',
          title: 'Programs expand',
          description:
            'Youth and adult arts education, storytelling circles, and community gatherings grow in Akatakyiwa and with partners across regions.',
        },
        {
          year: '2023–2025',
          title: 'Healing & diaspora pathways',
          description:
            'Restorative arts, cultural immersion, artist residencies, and Sankofa return journeys deepen the Center’s healing and kinship work.',
        },
        {
          year: 'Today',
          title: 'Building toward campus',
          description:
            'With Trustee Circle oversight, we continue festivals, mentorship, and retreats while advancing a permanent campus home in Akatakyiwa.',
        },
      ],
      null,
      2,
    ),
  },
  'about.team.badge': {
    label: 'About — leadership badge',
    section: 'about',
    defaultBody: 'Leadership',
  },
  'about.team.heading': {
    label: 'About — leadership heading',
    section: 'about',
    defaultBody: 'Meet Our Leadership',
  },
  'about.team.lead': {
    label: 'About — leadership intro',
    section: 'about',
    format: 'html',
    defaultBody:
      'Our leadership guides restorative arts, cultural education, and community partnership from Akatakyiwa. The full Trustee Circle is listed on the Trustees page.',
  },
  'about.team': {
    label: 'About — leadership cards (JSON)',
    section: 'about',
    hint: 'JSON array: [{ "name", "role", "bio", "initials?", "photoUrl?" }]. photoUrl can be a Media Library path.',
    defaultBody: JSON.stringify(
      [
        {
          name: 'Nana H. Kojo Herukhuti Sharif Williams, PhD',
          role: 'Founder & CEO',
          bio: 'Founder and Executive Director leading Ananse’s mission to spin social and cultural webs of connection through restorative and creative arts in Akatakyiwa, Ghana.',
          initials: 'SW',
        },
        {
          name: 'Norma Harris, PhD',
          role: 'Board Chair',
          bio: 'Chairs the Trustee Circle, guiding strategic oversight as the Center builds programs and a lasting campus home.',
          initials: 'NH',
        },
        {
          name: 'Kenyatta Andrews',
          role: 'Treasurer',
          bio: 'Stewards financial accountability so gifts for youth arts, residencies, and healing retreats are used with care.',
          initials: 'KA',
        },
      ],
      null,
      2,
    ),
  },
  'about.hero.title': {
    label: 'About — hero title (JSON)',
    section: 'about',
    hint: 'JSON: { "prefix", "accent" }',
    defaultBody: JSON.stringify(ABOUT_HERO_TITLE_DEFAULT, null, 2),
  },
  'about.hero.stats': {
    label: 'About — hero stats (JSON)',
    section: 'about',
    hint: 'JSON array: [{ "value", "label" }]',
    defaultBody: JSON.stringify(ABOUT_HERO_STATS_DEFAULT, null, 2),
  },
  'about.hero.cta.primary': {
    label: 'About — hero primary CTA (JSON)',
    section: 'about',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(ABOUT_HERO_CTA_PRIMARY_DEFAULT, null, 2),
  },
  'about.hero.cta.secondary': {
    label: 'About — hero secondary CTA (JSON)',
    section: 'about',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(ABOUT_HERO_CTA_SECONDARY_DEFAULT, null, 2),
  },
  'about.vision': {
    label: 'About — vision (paragraphs)',
    section: 'about',
    format: 'html',
    hint: 'Rich text supported.',
    defaultBody:
      'We envision a world where African cultural heritage is celebrated and woven into contemporary life — accessible to every person, wherever they live.\n\nA future where Africa\'s cultural wisdom shapes innovation, leadership, and sustainable development worldwide.',
  },
  'about.philosophy.badge': {
    label: 'About — philosophy section badge',
    section: 'about',
    defaultBody: 'Core Beliefs',
  },
  'about.philosophy.heading': {
    label: 'About — philosophy section heading',
    section: 'about',
    defaultBody: 'Our Cultural Philosophy',
  },
  'about.philosophy.cardLabel': {
    label: 'About — philosophy card badge',
    section: 'about',
    defaultBody: 'Philosophy',
  },
  'about.philosophy.cardCta': {
    label: 'About — philosophy card link',
    section: 'about',
    defaultBody: 'Explore Programs',
  },
  'about.philosophy.lead': {
    label: 'About — philosophy section intro',
    section: 'about',
    defaultBody:
      'Understanding the principles that guide our work and shape our community.',
  },
  'about.approach.badge': {
    label: 'About — approach section badge',
    section: 'about',
    defaultBody: 'Methodology',
  },
  'about.approach.heading': {
    label: 'About — approach section heading',
    section: 'about',
    defaultBody: 'Our Approach',
  },
  'about.approach.lead': {
    label: 'About — approach section intro',
    section: 'about',
    defaultBody:
      'How we bring our mission to life through intentional, community-centered practices.',
  },
  'about.impact.cardBadge': {
    label: 'About — impact card badge',
    section: 'about',
    defaultBody: 'Cultural Impact',
  },
  'about.impact.cardHeading': {
    label: 'About — impact card heading',
    section: 'about',
    defaultBody: 'Measuring Our Impact',
  },
  'about.impact.cardCta': {
    label: 'About — impact card link',
    section: 'about',
    defaultBody: 'Join Our Mission',
  },
  'about.philosophy': {
    label: 'About — philosophy cards (JSON)',
    section: 'about',
    hint: 'JSON array: [{ "title", "description", "iconKey" }]',
    defaultBody: JSON.stringify(ABOUT_PHILOSOPHY_DEFAULT, null, 2),
  },
  'about.approach': {
    label: 'About — approach steps (JSON)',
    section: 'about',
    hint: 'JSON array: [{ "num", "title", "description", "backgroundColor", "textColor" }]',
    defaultBody: JSON.stringify(ABOUT_APPROACH_DEFAULT, null, 2),
  },
  'about.impact.metrics': {
    label: 'About — impact sidebar metrics (JSON)',
    section: 'about',
    hint: 'JSON array: [{ "label", "value" }]',
    defaultBody: JSON.stringify(ABOUT_IMPACT_METRICS_DEFAULT, null, 2),
  },
  'about.cta.heading': {
    label: 'About — bottom CTA heading',
    section: 'about',
    defaultBody: 'Join Our Mission',
  },
  'about.cta.body': {
    label: 'About — bottom CTA body',
    section: 'about',
    format: 'html',
    hint: 'Separate paragraphs with a blank line if needed.',
    defaultBody:
      "Help us preserve Africa's heritage while empowering the next generation of leaders.",
  },
  'about.cta.primary': {
    label: 'About — bottom CTA primary (JSON)',
    section: 'about',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify({ label: 'Donate', href: '/support#donate' }, null, 2),
  },
  'about.cta.secondary': {
    label: 'About — bottom CTA secondary (JSON)',
    section: 'about',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify({ label: 'Explore Programs', href: '/programs' }, null, 2),
  },
  'programs.hero.lead': {
    label: 'Programs — hero description',
    section: 'programs',
    defaultBody:
      'Six flagship Sankofa initiatives developing whole persons — spiritually, academically, and as community leaders.',
  },
  'programs.hero.title': {
    label: 'Programs — hero title (JSON)',
    section: 'programs',
    hint: 'JSON: { "prefix", "accent" }',
    defaultBody: JSON.stringify(PROGRAMS_HERO_TITLE_DEFAULT, null, 2),
  },
  'programs.hero.stats': {
    label: 'Programs — hero stats (JSON)',
    section: 'programs',
    hint: 'JSON array: [{ "value", "label" }]',
    defaultBody: JSON.stringify(PROGRAMS_HERO_STATS_DEFAULT, null, 2),
  },
  'programs.hero.cta.primary': {
    label: 'Programs — hero primary CTA (JSON)',
    section: 'programs',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(PROGRAMS_HERO_CTA_PRIMARY_DEFAULT, null, 2),
  },
  'programs.hero.cta.secondary': {
    label: 'Programs — hero secondary CTA (JSON)',
    section: 'programs',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(PROGRAMS_HERO_CTA_SECONDARY_DEFAULT, null, 2),
  },
  'programs.catalog.heading': {
    label: 'Programs — catalog heading',
    section: 'programs',
    defaultBody: 'Find Your Path',
  },
  'programs.catalog.lead': {
    label: 'Programs — catalog intro',
    section: 'programs',
    format: 'html',
    defaultBody:
      'Explore our diverse range of programs designed for all ages and experience levels.',
  },
  'programs.benefits.badge': {
    label: 'Programs — benefits section badge',
    section: 'programs',
    defaultBody: 'Why Join Us?',
  },
  'programs.benefits.heading': {
    label: 'Programs — benefits section heading',
    section: 'programs',
    defaultBody: 'Program Benefits',
  },
  'programs.benefits.cardLabel': {
    label: 'Programs — benefit card badge',
    section: 'programs',
    defaultBody: 'Focus Area',
  },
  'programs.testimonials.badge': {
    label: 'Programs — testimonials section badge',
    section: 'programs',
    defaultBody: 'Voices of Transformation',
  },
  'programs.testimonials.heading': {
    label: 'Programs — testimonials section heading',
    section: 'programs',
    defaultBody: 'Student Experiences',
  },
  'programs.card.cta.primary': {
    label: 'Programs — catalog card primary link',
    section: 'programs',
    defaultBody: 'Apply Now',
  },
  'programs.card.cta.secondary': {
    label: 'Programs — catalog card secondary link',
    section: 'programs',
    defaultBody: 'Learn More',
  },
  'programs.cta.primary': {
    label: 'Programs — bottom CTA primary (JSON)',
    section: 'programs',
    hint: 'JSON: { "label", "href" } — use href "#catalog" for in-page scroll handled in UI',
    defaultBody: JSON.stringify({ label: 'View All Programs', href: '/programs#catalog' }, null, 2),
  },
  'programs.cta.secondary': {
    label: 'Programs — bottom CTA secondary (JSON)',
    section: 'programs',
    defaultBody: JSON.stringify({ label: 'Apply Now', href: '/contact#form' }, null, 2),
  },
  'programs.benefits.lead': {
    label: 'Programs — benefits intro',
    section: 'programs',
    format: 'html',
    defaultBody:
      'Our programs are designed to provide more than just skills—they offer transformation, connection, and personal growth.',
  },
  'programs.benefits': {
    label: 'Programs — benefit cards (JSON)',
    section: 'programs',
    hint: 'JSON array: [{ "title", "description", "iconKey", "category?", "imageUrl?" }]. iconKey: Wrench, Globe, Users, Sprout, etc. imageUrl can be a Media Library path.',
    defaultBody: JSON.stringify(
      [
        {
          title: 'Skill Development',
          category: 'Education',
          description:
            'Learn practical cultural and creative skills from experienced practitioners through hands-on workshops, mentorship, and collaborative learning.',
          iconKey: 'Wrench',
        },
        {
          title: 'Cultural Connection',
          category: 'Culture',
          description:
            'Deepen your connection to African heritage through storytelling, traditional arts, festivals, and immersive cultural practice.',
          iconKey: 'Globe',
        },
        {
          title: 'Community Building',
          category: 'Community',
          description:
            'Join a supportive network of learners, artists, and volunteers working together to strengthen communities across Ghana and the diaspora.',
          iconKey: 'Users',
        },
        {
          title: 'Personal Growth',
          category: 'Leadership',
          description:
            'Grow in confidence, purpose, and leadership through mentoring, creative expression, and ancestral wisdom applied to modern life.',
          iconKey: 'Sprout',
        },
      ],
      null,
      2,
    ),
  },
  'programs.testimonials': {
    label: 'Programs — student testimonials (JSON)',
    section: 'programs',
    hint: 'JSON array: [{ "name", "role", "text", "initials", "photoUrl?" }]. photoUrl can be a Media Library path.',
    defaultBody: JSON.stringify(
      [
        {
          name: 'Efua',
          role: 'Youth arts apprentice',
          text: 'Learning beside master artisans taught me patience and pride. Kente, story, and song are not just skills—they are how I know who I am.',
          initials: 'EF',
        },
        {
          name: 'David',
          role: 'Drumming & music participant',
          text: 'The rhythm circle felt like home. I found mentors who expected excellence and still made room for healing.',
          initials: 'DA',
        },
        {
          name: 'Nia',
          role: 'Storytelling & diaspora guest',
          text: 'Sitting with elders under the trees, I finally understood Sankofa—not as a slogan, but as a practice of return and responsibility.',
          initials: 'NI',
        },
      ],
      null,
      2,
    ),
  },
  'programs.cta.heading': {
    label: 'Programs — bottom CTA heading',
    section: 'programs',
    defaultBody: 'Ready to Begin Your Journey?',
  },
  'programs.cta.body': {
    label: 'Programs — bottom CTA body',
    section: 'programs',
    format: 'html',
    defaultBody:
      "Whether you're looking to learn a new skill, connect with your heritage, or simply explore the richness of African culture, there's a program waiting for you.",
  },
  'events.detail.storyTitleDefault': {
    label: 'Events — detail default story heading',
    section: 'events',
    defaultBody: 'Experience Highlights',
  },
  'events.detail.highlightsHeading': {
    label: 'Events — detail highlights heading',
    section: 'events',
    defaultBody: 'Experience Highlights',
  },
  'events.detail.highlightsFallback': {
    label: 'Events — detail highlights fallback (JSON)',
    section: 'events',
    hint: 'JSON array of strings when event has no highlights',
    defaultBody: JSON.stringify(EVENTS_DETAIL_HIGHLIGHTS_FALLBACK_DEFAULT, null, 2),
  },
  'events.detail.whenLabel': {
    label: 'Events — detail when label',
    section: 'events',
    defaultBody: 'When',
  },
  'events.detail.whereLabel': {
    label: 'Events — detail where label',
    section: 'events',
    defaultBody: 'Where',
  },
  'events.detail.registerHeading': {
    label: 'Events — detail register section heading',
    section: 'events',
    defaultBody: 'Register',
  },
  'events.detail.registerLead': {
    label: 'Events — detail register section intro',
    section: 'events',
    format: 'html',
    defaultBody:
      'Reserve your place or register interest — our team will follow up by email.',
  },
  'events.detail.reserveCta': {
    label: 'Events — detail reserve button (JSON)',
    section: 'events',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify({ label: 'Reserve Your Place', href: '/contact#form' }, null, 2),
  },
  'events.detail.questionsPrefix': {
    label: 'Events — detail questions prefix',
    section: 'events',
    defaultBody: 'Have questions?',
  },
  'events.detail.contactLinkText': {
    label: 'Events — detail contact link text',
    section: 'events',
    defaultBody: 'Contact our team',
  },
  'events.hero.lead': {
    label: 'Events — hero description',
    section: 'events',
    defaultBody:
      'Festivals, workshops, and retreats that bring our mission to life — join gatherings across Ghana and the diaspora.',
  },
  'events.hero.title': {
    label: 'Events — hero title (JSON)',
    section: 'events',
    hint: 'JSON: { "prefix", "accent" }',
    defaultBody: JSON.stringify(EVENTS_HERO_TITLE_DEFAULT, null, 2),
  },
  'events.hero.stats': {
    label: 'Events — hero stats (JSON)',
    section: 'events',
    hint: 'JSON array: [{ "value", "label" }]',
    defaultBody: JSON.stringify(EVENTS_HERO_STATS_DEFAULT, null, 2),
  },
  'events.hero.cta.primary': {
    label: 'Events — hero primary CTA (JSON)',
    section: 'events',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(EVENTS_HERO_CTA_PRIMARY_DEFAULT, null, 2),
  },
  'events.hero.cta.secondary': {
    label: 'Events — hero secondary CTA (JSON)',
    section: 'events',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(EVENTS_HERO_CTA_SECONDARY_DEFAULT, null, 2),
  },
  'events.featured.badge': {
    label: 'Events — featured section badge',
    section: 'events',
    defaultBody: 'Upcoming Events',
  },
  'events.featured.heading': {
    label: 'Events — featured section heading',
    section: 'events',
    defaultBody: "What's Happening Next",
  },
  'events.catalog.heading': {
    label: 'Events — catalog section heading',
    section: 'events',
    defaultBody: 'All Events',
  },
  'events.past.heading': {
    label: 'Events — past events heading',
    section: 'events',
    defaultBody: 'Past Events',
  },
  'events.card.register': {
    label: 'Events — card register CTA',
    section: 'events',
    defaultBody: 'Register Now',
  },
  'events.filter.categories': {
    label: 'Events — filter tabs (JSON)',
    section: 'events',
    hint: 'JSON array of category names. First item should be "All Events".',
    defaultBody: JSON.stringify(EVENTS_FILTER_CATEGORIES_DEFAULT, null, 2),
  },
  'events.highlights.badge': {
    label: 'Events — highlights section badge',
    section: 'events',
    defaultBody: 'Cultural Impact',
  },
  'events.highlights.heading': {
    label: 'Events — highlights section heading',
    section: 'events',
    defaultBody: "Last Year's Highlights",
  },
  'events.highlights.lead': {
    label: 'Events — highlights section intro',
    section: 'events',
    format: 'html',
    defaultBody:
      'Our events are more than just gatherings—they are catalysts for change and connection.',
  },
  'events.highlights.metrics': {
    label: 'Events — highlights metrics (JSON)',
    section: 'events',
    hint: 'JSON array: [{ "label", "value" }]',
    defaultBody: JSON.stringify(EVENTS_HIGHLIGHTS_METRICS_DEFAULT, null, 2),
  },
  'events.highlights.testimonial': {
    label: 'Events — highlights testimonial (JSON)',
    section: 'events',
    hint: 'JSON object: { "quote", "name", "role", "initials" }',
    defaultBody: JSON.stringify(EVENTS_HIGHLIGHTS_TESTIMONIAL_DEFAULT, null, 2),
  },
  'events.newsletter.heading': {
    label: 'Events — newsletter heading',
    section: 'events',
    defaultBody: 'Stay in the Loop',
  },
  'events.newsletter.lead': {
    label: 'Events — newsletter intro',
    section: 'events',
    format: 'html',
    defaultBody:
      "Don't miss out on our upcoming festivals, workshops, and community gatherings.",
  },
  'events.cta.heading': {
    label: 'Events — bottom CTA heading',
    section: 'events',
    defaultBody: 'Join Our Table',
  },
  'events.cta.body': {
    label: 'Events — bottom CTA body',
    section: 'events',
    format: 'html',
    defaultBody:
      "Whether you're attending your first event or becoming a regular participant, there's a seat for you in our growing circle.",
  },
  'support.hero.lead': {
    label: 'Support — hero description',
    section: 'support',
    defaultBody:
      'Your generosity sustains arts education, community programs, and cultural leadership development.',
  },
  'support.hero.title': {
    label: 'Support — hero title (JSON)',
    section: 'support',
    hint: 'JSON: { "prefix", "accent" }',
    defaultBody: JSON.stringify(SUPPORT_HERO_TITLE_DEFAULT, null, 2),
  },
  'support.hero.stats': {
    label: 'Support — hero stats (JSON)',
    section: 'support',
    hint: 'JSON array: [{ "value", "label" }]',
    defaultBody: JSON.stringify(SUPPORT_HERO_STATS_DEFAULT, null, 2),
  },
  'support.hero.cta.primary': {
    label: 'Support — hero primary CTA (JSON)',
    section: 'support',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(SUPPORT_HERO_CTA_PRIMARY_DEFAULT, null, 2),
  },
  'support.hero.cta.secondary': {
    label: 'Support — hero secondary CTA (JSON)',
    section: 'support',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(SUPPORT_HERO_CTA_SECONDARY_DEFAULT, null, 2),
  },
  'support.impact.badge': {
    label: 'Support — impact section badge',
    section: 'support',
    defaultBody: 'Where Your Gift Goes',
  },
  'support.impact.heading': {
    label: 'Support — impact section heading',
    section: 'support',
    defaultBody: 'Your Impact',
  },
  'support.impact.lead': {
    label: 'Support — impact section intro',
    section: 'support',
    defaultBody:
      'Every contribution, no matter the size, helps us create meaningful change in the lives of students, artists, and communities across the continent.',
  },
  'support.beyond.heading': {
    label: 'Support — beyond donations heading',
    section: 'support',
    defaultBody: 'Beyond Financial Support',
  },
  'support.donation.tiers': {
    label: 'Support — donation impact tiers (JSON)',
    section: 'support',
    hint: 'JSON array: [{ "amount", "label", "iconKey" }]',
    defaultBody: JSON.stringify(SUPPORT_DONATION_TIERS_DEFAULT, null, 2),
  },
  'support.other.ways': {
    label: 'Support — other ways to help (JSON)',
    section: 'support',
    hint: 'JSON array: [{ "title", "description", "iconKey", "linkText", "imageUrl?", "href?" }]',
    defaultBody: JSON.stringify(SUPPORT_OTHER_WAYS_DEFAULT, null, 2),
  },
  'support.beyond.lead': {
    label: 'Support — beyond donations intro',
    section: 'support',
    defaultBody:
      'There are many ways to contribute to our mission beyond financial donations. We value every form of support.',
  },
  'support.cta.heading': {
    label: 'Support — bottom CTA heading',
    section: 'support',
    defaultBody: 'Join the Legacy',
  },
  'support.cta.body': {
    label: 'Support — bottom CTA body',
    section: 'support',
    format: 'html',
    defaultBody:
      "Your support doesn't just fund programs—it preserves cultural heritage and creates a future where African culture continues to thrive and inspire.",
  },
  'support.cta.primary': {
    label: 'Support — bottom CTA primary (JSON)',
    section: 'support',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify({ label: 'Donate Now', href: '/support#donate' }, null, 2),
  },
  'support.cta.secondary': {
    label: 'Support — bottom CTA secondary (JSON)',
    section: 'support',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify({ label: 'Partner With Us', href: '/contact#form' }, null, 2),
  },
  'support.transparency.heading': {
    label: 'Support — transparency card heading',
    section: 'support',
    defaultBody: 'Transparency Matters',
  },
  'support.transparency.body': {
    label: 'Support — transparency card intro',
    section: 'support',
    format: 'html',
    defaultBody:
      'We are committed to being open and accountable about how your donations are used to fuel our cultural programs.',
  },
  'support.transparency.allocation': {
    label: 'Support — fund allocation breakdown (JSON)',
    section: 'support',
    hint: 'JSON array: [{ "label", "value" }]',
    defaultBody: JSON.stringify(SUPPORT_TRANSPARENCY_ALLOCATION_DEFAULT, null, 2),
  },
  'support.standards.badge': {
    label: 'Support — standards section badge',
    section: 'support',
    defaultBody: 'Trust & Accountability',
  },
  'support.standards.heading': {
    label: 'Support — standards heading',
    section: 'support',
    defaultBody: 'Our Standards',
  },
  'support.standards.lead': {
    label: 'Support — standards intro',
    section: 'support',
    defaultBody:
      'We maintain high standards of financial reporting and ethical stewardship to ensure your support creates the maximum impact.',
  },
  'support.standards.items': {
    label: 'Support — standards bullet list (JSON)',
    section: 'support',
    hint: 'JSON array of strings, one item per list entry.',
    defaultBody: JSON.stringify(SUPPORT_STANDARDS_ITEMS_DEFAULT, null, 2),
  },
  'support.donate.heading': {
    label: 'Support — donate section heading',
    section: 'support',
    defaultBody: 'Ways to Give',
  },
  'support.donate.lead.ready': {
    label: 'Support — donate intro (Paystack enabled)',
    section: 'support',
    format: 'html',
    defaultBody:
      'Give securely with Paystack — card, mobile money, and bank transfer where available.',
  },
  'support.donate.lead.offline': {
    label: 'Support — donate intro (Paystack not configured)',
    section: 'support',
    format: 'html',
    defaultBody:
      'Add your Paystack keys to enable secure online giving. You can still reach us to donate offline.',
  },
  'support.donate.presets': {
    label: 'Support — Paystack preset amounts (JSON)',
    section: 'support',
    hint: 'JSON array: [{ "amount": number, "label": "short name" }]. Amount is in GHS (or site currency).',
    defaultBody: JSON.stringify(SUPPORT_DONATE_PRESETS_DEFAULT, null, 2),
  },
  'contact.form.heading': {
    label: 'Contact — form heading',
    section: 'contact',
    defaultBody: 'Send Us a Message',
  },
  'contact.form.subjects': {
    label: 'Contact — form subject options (JSON)',
    section: 'contact',
    hint: 'JSON array of strings',
    defaultBody: JSON.stringify(CONTACT_FORM_SUBJECTS_DEFAULT, null, 2),
  },
  'contact.map.heading': {
    label: 'Contact — map heading',
    section: 'contact',
    defaultBody: 'Find Us in Akatakyiwa',
  },
  'contact.map.subtitle': {
    label: 'Contact — map subtitle',
    section: 'contact',
    defaultBody: 'Central Region, Ghana — near heritage sites of the diaspora journey',
  },
  'contact.visit.heading': {
    label: 'Contact — visit card heading',
    section: 'contact',
    defaultBody: 'Planning a Visit?',
  },
  'contact.visit.linkText': {
    label: 'Contact — visit card link',
    section: 'contact',
    defaultBody: 'Learn more about our center →',
  },
  'contact.info.titles': {
    label: 'Contact — info card titles (JSON)',
    section: 'contact',
    hint: 'JSON array of 4 strings: location, email, phone, hours',
    defaultBody: JSON.stringify(CONTACT_INFO_TITLES_DEFAULT, null, 2),
  },
  'contact.cta.heading': {
    label: 'Contact — bottom CTA heading',
    section: 'contact',
    defaultBody: 'Stay Connected',
  },
  'contact.hero.lead': {
    label: 'Contact — hero description',
    section: 'contact',
    defaultBody:
      'We would love to hear from you — partnerships, programs, visits, and press inquiries are welcome.',
  },
  'contact.hero.title': {
    label: 'Contact — hero title (JSON)',
    section: 'contact',
    hint: 'JSON: { "prefix", "accent" }',
    defaultBody: JSON.stringify(CONTACT_HERO_TITLE_DEFAULT, null, 2),
  },
  'contact.hero.stats': {
    label: 'Contact — hero stats (JSON)',
    section: 'contact',
    hint: 'JSON array: [{ "value", "label" }]',
    defaultBody: JSON.stringify(CONTACT_HERO_STATS_DEFAULT, null, 2),
  },
  'contact.hero.cta.primary': {
    label: 'Contact — hero primary CTA (JSON)',
    section: 'contact',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(CONTACT_HERO_CTA_PRIMARY_DEFAULT, null, 2),
  },
  'contact.hero.cta.secondary': {
    label: 'Contact — hero secondary CTA (JSON)',
    section: 'contact',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(CONTACT_HERO_CTA_SECONDARY_DEFAULT, null, 2),
  },
  'contact.visit.blurb': {
    label: 'Contact — planning a visit',
    section: 'contact',
    format: 'html',
    defaultBody:
      'We welcome visitors to our center! For guided tours or partnership meetings, please schedule an appointment via the form or email.',
  },
  'contact.cta.body': {
    label: 'Contact — social CTA body',
    section: 'contact',
    format: 'html',
    defaultBody:
      'Follow us on social media to stay updated on our programs, events, and community stories from across the continent.',
  },
  'videos.hero.lead': {
    label: 'Videos — hero description',
    section: 'videos',
    defaultBody:
      'Stories, performances, and teachings from The Ananse Center community.',
  },
  'videos.hero.title': {
    label: 'Videos — hero title (JSON)',
    section: 'videos',
    hint: 'JSON: { "prefix", "accent" }',
    defaultBody: JSON.stringify(VIDEOS_HERO_TITLE_DEFAULT, null, 2),
  },
  'videos.hero.stats': {
    label: 'Videos — hero stats (JSON)',
    section: 'videos',
    hint: 'JSON array: [{ "value", "label" }]',
    defaultBody: JSON.stringify(VIDEOS_HERO_STATS_DEFAULT, null, 2),
  },
  'videos.hero.cta.primary': {
    label: 'Videos — hero primary CTA (JSON)',
    section: 'videos',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(VIDEOS_HERO_CTA_PRIMARY_DEFAULT, null, 2),
  },
  'videos.hero.cta.secondary': {
    label: 'Videos — hero secondary CTA (JSON)',
    section: 'videos',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(VIDEOS_HERO_CTA_SECONDARY_DEFAULT, null, 2),
  },
  'videos.items': {
    label: 'Videos — embed grid (JSON)',
    section: 'videos',
    hint: 'JSON array: [{ "title", "url" }]. url should be a YouTube embed URL.',
    defaultBody: JSON.stringify(VIDEOS_ITEMS_DEFAULT, null, 2),
  },
  'videos.card.badge': {
    label: 'Videos — card badge label',
    section: 'videos',
    defaultBody: 'Video',
  },
  'videos.cta.heading': {
    label: 'Videos — bottom CTA heading',
    section: 'videos',
    defaultBody: 'Want to See More?',
  },
  'videos.cta.body': {
    label: 'Videos — bottom CTA body',
    section: 'videos',
    format: 'html',
    defaultBody:
      'Join our community and stay updated with our latest events, videos, and stories.',
  },
  'legal.badge': {
    label: 'Legal pages — section badge',
    section: 'legal',
    defaultBody: 'Legal',
  },
  'privacy.heading': {
    label: 'Privacy — page heading',
    section: 'legal',
    defaultBody: 'Privacy Policy',
  },
  'privacy.lead': {
    label: 'Privacy — intro paragraph',
    section: 'legal',
    format: 'html',
    defaultBody:
      'The Ananse Center for Arts and Culture respects your privacy. This policy explains how we handle information you share when you visit our website, contact us, or join our programs.',
  },
  'privacy.body': {
    label: 'Privacy — body paragraph',
    section: 'legal',
    format: 'html',
    defaultBody:
      'We collect information you submit through contact forms, event registration, and newsletter sign-ups solely to respond to inquiries and share program updates. We do not sell personal data. For privacy questions, email us using the address on our Contact page.',
  },
  'terms.heading': {
    label: 'Terms — page heading',
    section: 'legal',
    defaultBody: 'Terms of Service',
  },
  'terms.lead': {
    label: 'Terms — intro paragraph',
    section: 'legal',
    format: 'html',
    defaultBody:
      'By using this website you agree to these terms of use. Program enrollment, donations, and event registration may be subject to additional agreements shared at the time of signup.',
  },
  'terms.body': {
    label: 'Terms — body paragraph',
    section: 'legal',
    format: 'html',
    defaultBody:
      'Content on this site is for informational purposes. Images and stories represent our mission; specific dates, fees, and offerings may change. Please contact us to confirm details before travel or enrollment.',
  },
  'site.maintenance.badge': {
    label: 'Site — maintenance page badge',
    section: 'site',
    defaultBody: 'Under maintenance',
  },
  'site.footer.mission': {
    label: 'Site — footer mission',
    section: 'site',
    defaultBody:
      'Preserving cultural memory and restoring identity through arts education, community programs, and Pan-African leadership development in Ghana and across the diaspora.',
  },
  'site.footer.cta.primary': {
    label: 'Site — footer primary CTA (JSON)',
    section: 'site',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify({ label: 'Support Our Mission', href: '/support' }, null, 2),
  },
  'site.footer.cta.secondary': {
    label: 'Site — footer secondary CTA (JSON)',
    section: 'site',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify({ label: 'Get In Touch', href: '/contact#form' }, null, 2),
  },
  'site.logo': {
    label: 'Site — logo image path',
    section: 'site',
    hint: 'Public path or Media Library URL. Used in navbar and footer.',
    defaultBody: '/ananse-logo.png',
  },
  'site.nav.primary': {
    label: 'Site — primary navigation (JSON)',
    section: 'site',
    hint: 'JSON array: [{ "label", "href" }]',
    defaultBody: JSON.stringify(
      [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Programs', href: '/programs' },
        { label: 'Events', href: '/events' },
        { label: 'Videos', href: '/videos' },
        { label: 'Donate', href: '/support' },
        { label: 'Contact', href: '/contact#form' },
      ],
      null,
      2,
    ),
  },
  'site.footer.quickLinks': {
    label: 'Site — footer quick links (JSON)',
    section: 'site',
    hint: 'JSON array: [{ "label", "href" }]',
    defaultBody: JSON.stringify(
      [
        { label: 'About', href: '/about' },
        { label: 'Programs', href: '/programs' },
        { label: 'Events', href: '/events' },
        { label: 'Videos', href: '/videos' },
        { label: 'Support', href: '/support' },
        { label: 'Contact', href: '/contact#form' },
        { label: 'Trustees', href: '/trustees' },
        { label: 'Transparency', href: '/transparency' },
      ],
      null,
      2,
    ),
  },
  'site.footer.programLinks': {
    label: 'Site — footer program links (JSON)',
    section: 'site',
    hint: 'JSON array: [{ "label", "href" }]',
    defaultBody: JSON.stringify(
      [
        { label: 'Browse All Programs', href: '/programs' },
        { label: 'Traditional Arts & Crafts', href: '/programs' },
        { label: 'Music & Rhythm', href: '/programs' },
        { label: 'Storytelling', href: '/programs' },
        { label: 'Cultural Leadership', href: '/programs' },
      ],
      null,
      2,
    ),
  },
  'support.hero.image': {
    label: 'Support — hero background image path',
    section: 'support',
    hint: 'Public path or Media Library URL.',
    defaultBody: '/images/image (12).jpeg',
  },
  'support.hero.imageAlt': {
    label: 'Support — hero image alt text',
    section: 'support',
    defaultBody: 'Supporting Ananse Center programs and community work',
  },
  'contact.hero.image': {
    label: 'Contact — hero background image path',
    section: 'contact',
    hint: 'Public path or Media Library URL.',
    defaultBody: '/images/image (1).jpeg',
  },
  'contact.hero.imageAlt': {
    label: 'Contact — hero image alt text',
    section: 'contact',
    defaultBody: 'Visit and connect with The Ananse Center',
  },
  'videos.hero.image': {
    label: 'Videos — hero background image path',
    section: 'videos',
    hint: 'Public path or Media Library URL.',
    defaultBody: '/images/image (15).jpeg',
  },
  'videos.hero.imageAlt': {
    label: 'Videos — hero image alt text',
    section: 'videos',
    defaultBody: 'Stories and talks from The Ananse Center',
  },
  'about.story.image': {
    label: 'About — Who We Are side image path',
    section: 'about',
    hint: 'Public path or Media Library URL.',
    defaultBody: '/images/image (14).jpeg',
  },
  'trustees.cta.primary': {
    label: 'Trustees — primary CTA (JSON)',
    section: 'trustees',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify({ label: 'Financial Transparency', href: '/transparency' }, null, 2),
  },
  'trustees.cta.secondary': {
    label: 'Trustees — secondary CTA (JSON)',
    section: 'trustees',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify({ label: 'Support Our Mission', href: '/support' }, null, 2),
  },
  'programs.hero.image': {
    label: 'Programs — hero background image path',
    section: 'programs',
    hint: 'Public path or Media Library URL.',
    defaultBody: '/images/image (8).jpeg',
  },
  'programs.hero.imageAlt': {
    label: 'Programs — hero image alt text',
    section: 'programs',
    defaultBody: 'Ananse Center programs in action',
  },
  'events.hero.image': {
    label: 'Events — hero background image path',
    section: 'events',
    hint: 'Public path or Media Library URL.',
    defaultBody: '/images/image (10).jpeg',
  },
  'events.hero.imageAlt': {
    label: 'Events — hero image alt text',
    section: 'events',
    defaultBody: 'Cultural festivals and gatherings at Ananse Center',
  },
  'site.favicon': {
    label: 'Site — favicon image path',
    section: 'site',
    hint: 'Optional public path or Media Library URL (square image). Leave blank to use the generated fallback.',
    defaultBody: '',
  },
  'site.appleIcon': {
    label: 'Site — Apple touch icon image path',
    section: 'site',
    hint: 'Optional public path or Media Library URL (square image, ideally 180×180). Leave blank to use the generated fallback.',
    defaultBody: '',
  },
  'site.nav.mobile': {
    label: 'Site — mobile bottom nav (JSON)',
    section: 'site',
    hint: 'JSON array: [{ "label", "href", "iconKey" }]. iconKey is a Lucide icon name (Home, Sparkles, CalendarDays, Heart, Mail, ...).',
    defaultBody: JSON.stringify(DEFAULT_MOBILE_NAV, null, 2),
  },
  'site.nav.sheet': {
    label: 'Site — mobile menu sheet links (JSON)',
    section: 'site',
    hint: 'JSON array: [{ "label", "href" }]. Shown in the full mobile navigation sheet.',
    defaultBody: JSON.stringify(DEFAULT_SHEET_NAV, null, 2),
  },
  'site.globalBand.eyebrow': {
    label: 'Site — global audience band eyebrow',
    section: 'site',
    defaultBody: 'Worldwide community',
  },
  'site.globalBand.heading': {
    label: 'Site — global audience band heading',
    section: 'site',
    defaultBody: 'Wherever you are, there is a place for you here',
  },
  'site.globalBand.body': {
    label: 'Site — global audience band body',
    section: 'site',
    defaultBody:
      'From Ghana to the diaspora, join our global community of learners, artists, and supporters.',
  },
  'site.globalBand.cta': {
    label: 'Site — global audience band CTA (JSON)',
    section: 'site',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(GLOBAL_BAND_CTA_DEFAULT, null, 2),
  },
  'videos.cta.primary': {
    label: 'Videos — bottom CTA primary (JSON)',
    section: 'videos',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(VIDEOS_CTA_PRIMARY_DEFAULT, null, 2),
  },
  'videos.cta.secondary': {
    label: 'Videos — bottom CTA secondary (JSON)',
    section: 'videos',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(VIDEOS_CTA_SECONDARY_DEFAULT, null, 2),
  },
  'events.cta.primary': {
    label: 'Events — bottom CTA primary (JSON)',
    section: 'events',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(EVENTS_CTA_PRIMARY_DEFAULT, null, 2),
  },
  'events.cta.secondary': {
    label: 'Events — bottom CTA secondary (JSON)',
    section: 'events',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify(EVENTS_CTA_SECONDARY_DEFAULT, null, 2),
  },
  'events.newsletter.subscribeLabel': {
    label: 'Events — newsletter subscribe button label',
    section: 'events',
    defaultBody: 'Subscribe',
  },
  'events.newsletter.placeholder': {
    label: 'Events — newsletter email placeholder',
    section: 'events',
    defaultBody: 'Enter your email',
  },
  'events.status.openLabel': {
    label: 'Events — registration status: open',
    section: 'events',
    defaultBody: 'Registration Open',
  },
  'events.status.completedLabel': {
    label: 'Events — registration status: completed',
    section: 'events',
    defaultBody: 'Completed',
  },
  'events.status.closedLabel': {
    label: 'Events — registration status: closed',
    section: 'events',
    defaultBody: 'Registration Closed',
  },
  'events.status.waitlistLabel': {
    label: 'Events — registration status: waitlist',
    section: 'events',
    defaultBody: 'Waitlist',
  },
  'home.sections.visible': {
    label: 'Home — section visibility (JSON)',
    section: 'home',
    hint: 'JSON object of section-key → true/false. Missing keys default to visible.',
    defaultBody: JSON.stringify(DEFAULT_HOME_SECTIONS, null, 2),
  },
  'about.sections.visible': {
    label: 'About — section visibility (JSON)',
    section: 'about',
    hint: 'JSON object of section-key → true/false. Missing keys default to visible.',
    defaultBody: JSON.stringify(DEFAULT_ABOUT_SECTIONS, null, 2),
  },
  'programs.sections.visible': {
    label: 'Programs — section visibility (JSON)',
    section: 'programs',
    hint: 'JSON object of section-key → true/false. Missing keys default to visible.',
    defaultBody: JSON.stringify(DEFAULT_PROGRAMS_SECTIONS, null, 2),
  },
  'events.sections.visible': {
    label: 'Events — section visibility (JSON)',
    section: 'events',
    hint: 'JSON object of section-key → true/false. Missing keys default to visible.',
    defaultBody: JSON.stringify(DEFAULT_EVENTS_SECTIONS, null, 2),
  },
  'support.sections.visible': {
    label: 'Support — section visibility (JSON)',
    section: 'support',
    hint: 'JSON object of section-key → true/false. Missing keys default to visible.',
    defaultBody: JSON.stringify(DEFAULT_SUPPORT_SECTIONS, null, 2),
  },
  'support.transparency.image': {
    label: 'Support — transparency card image path',
    section: 'support',
    hint: 'Public path or Media Library URL.',
    defaultBody: '/images/image (12).jpeg',
  },
  'legal.cta.contact': {
    label: 'Legal pages — contact CTA label',
    section: 'legal',
    defaultBody: 'Contact Us',
  },
  'legal.cta.home': {
    label: 'Legal pages — back home CTA label',
    section: 'legal',
    defaultBody: 'Back Home',
  },
  ...buildSeoRegistryKeys(),
  ...STATIC_PAGE_REGISTRY,
} as const satisfies Record<string, ContentRegistryEntry>

export type ContentKey = keyof typeof CONTENT_REGISTRY

export const CONTENT_KEYS = Object.keys(CONTENT_REGISTRY) as ContentKey[]

export function isContentKey(key: string): key is ContentKey {
  return key in CONTENT_REGISTRY
}

export function getRegistryEntry(key: ContentKey): ContentRegistryEntry {
  return CONTENT_REGISTRY[key]
}

export const DEFAULT_HOME_TESTIMONIALS = HOME_TESTIMONIALS_DEFAULT
export const DEFAULT_HOME_PILLARS = HOME_PILLARS_DEFAULT
export const DEFAULT_HOME_SECTORS = HOME_SECTORS_DEFAULT
export const DEFAULT_ABOUT_PHILOSOPHY = ABOUT_PHILOSOPHY_DEFAULT
export const DEFAULT_ABOUT_APPROACH = ABOUT_APPROACH_DEFAULT
export const DEFAULT_ABOUT_IMPACT_METRICS = ABOUT_IMPACT_METRICS_DEFAULT
export const DEFAULT_SUPPORT_DONATION_TIERS = SUPPORT_DONATION_TIERS_DEFAULT
export const DEFAULT_SUPPORT_OTHER_WAYS = SUPPORT_OTHER_WAYS_DEFAULT
export const DEFAULT_HOME_STORY_HIGHLIGHTS = HOME_STORY_HIGHLIGHTS_DEFAULT
export const DEFAULT_SUPPORT_TRANSPARENCY_ALLOCATION = SUPPORT_TRANSPARENCY_ALLOCATION_DEFAULT
export const DEFAULT_SUPPORT_STANDARDS_ITEMS = SUPPORT_STANDARDS_ITEMS_DEFAULT
export const DEFAULT_SUPPORT_DONATE_PRESETS = SUPPORT_DONATE_PRESETS_DEFAULT
export const DEFAULT_EVENTS_FILTER_CATEGORIES = EVENTS_FILTER_CATEGORIES_DEFAULT
export const DEFAULT_EVENTS_HIGHLIGHTS_METRICS = EVENTS_HIGHLIGHTS_METRICS_DEFAULT
export const DEFAULT_EVENTS_HIGHLIGHTS_TESTIMONIAL = EVENTS_HIGHLIGHTS_TESTIMONIAL_DEFAULT
export const DEFAULT_VIDEOS_ITEMS = VIDEOS_ITEMS_DEFAULT
export const DEFAULT_HOME_HERO_TITLE = HOME_HERO_TITLE_DEFAULT
export const DEFAULT_HOME_HERO_STATS = HOME_HERO_STATS_DEFAULT
export const DEFAULT_HOME_HERO_CTA_PRIMARY = HOME_HERO_CTA_PRIMARY_DEFAULT
export const DEFAULT_HOME_HERO_CTA_SECONDARY = HOME_HERO_CTA_SECONDARY_DEFAULT
export const DEFAULT_ABOUT_HERO_TITLE = ABOUT_HERO_TITLE_DEFAULT
export const DEFAULT_ABOUT_HERO_STATS = ABOUT_HERO_STATS_DEFAULT
export const DEFAULT_ABOUT_HERO_CTA_PRIMARY = ABOUT_HERO_CTA_PRIMARY_DEFAULT
export const DEFAULT_ABOUT_HERO_CTA_SECONDARY = ABOUT_HERO_CTA_SECONDARY_DEFAULT
export const DEFAULT_PROGRAMS_HERO_TITLE = PROGRAMS_HERO_TITLE_DEFAULT
export const DEFAULT_PROGRAMS_HERO_STATS = PROGRAMS_HERO_STATS_DEFAULT
export const DEFAULT_PROGRAMS_HERO_CTA_PRIMARY = PROGRAMS_HERO_CTA_PRIMARY_DEFAULT
export const DEFAULT_PROGRAMS_HERO_CTA_SECONDARY = PROGRAMS_HERO_CTA_SECONDARY_DEFAULT
export const DEFAULT_EVENTS_HERO_TITLE = EVENTS_HERO_TITLE_DEFAULT
export const DEFAULT_EVENTS_HERO_STATS = EVENTS_HERO_STATS_DEFAULT
export const DEFAULT_EVENTS_HERO_CTA_PRIMARY = EVENTS_HERO_CTA_PRIMARY_DEFAULT
export const DEFAULT_EVENTS_HERO_CTA_SECONDARY = EVENTS_HERO_CTA_SECONDARY_DEFAULT
export const DEFAULT_SUPPORT_HERO_TITLE = SUPPORT_HERO_TITLE_DEFAULT
export const DEFAULT_SUPPORT_HERO_STATS = SUPPORT_HERO_STATS_DEFAULT
export const DEFAULT_SUPPORT_HERO_CTA_PRIMARY = SUPPORT_HERO_CTA_PRIMARY_DEFAULT
export const DEFAULT_SUPPORT_HERO_CTA_SECONDARY = SUPPORT_HERO_CTA_SECONDARY_DEFAULT
export const DEFAULT_CONTACT_HERO_TITLE = CONTACT_HERO_TITLE_DEFAULT
export const DEFAULT_CONTACT_HERO_STATS = CONTACT_HERO_STATS_DEFAULT
export const DEFAULT_CONTACT_HERO_CTA_PRIMARY = CONTACT_HERO_CTA_PRIMARY_DEFAULT
export const DEFAULT_CONTACT_HERO_CTA_SECONDARY = CONTACT_HERO_CTA_SECONDARY_DEFAULT
export const DEFAULT_VIDEOS_HERO_TITLE = VIDEOS_HERO_TITLE_DEFAULT
export const DEFAULT_VIDEOS_HERO_STATS = VIDEOS_HERO_STATS_DEFAULT
export const DEFAULT_VIDEOS_HERO_CTA_PRIMARY = VIDEOS_HERO_CTA_PRIMARY_DEFAULT
export const DEFAULT_VIDEOS_HERO_CTA_SECONDARY = VIDEOS_HERO_CTA_SECONDARY_DEFAULT
export const DEFAULT_HOME_CTA_BUTTONS = HOME_CTA_BUTTONS_DEFAULT
export const DEFAULT_CONTACT_INFO_TITLES = CONTACT_INFO_TITLES_DEFAULT
export const DEFAULT_CONTACT_FORM_SUBJECTS = CONTACT_FORM_SUBJECTS_DEFAULT
export const DEFAULT_EVENTS_DETAIL_HIGHLIGHTS_FALLBACK = EVENTS_DETAIL_HIGHLIGHTS_FALLBACK_DEFAULT
