/**
 * Canonical CMS content keys for the public site (seed + pages).
 * Keep in sync with backend/src/cms/registry.ts when adding keys.
 * Long-form copy only; contact/social live on SiteSettings (no duplicate blocks).
 */
export type ContentRegistryEntry = {
  label: string
  section: string
  defaultBody: string
  format?: 'plain' | 'markdown'
  hint?: string
}

export type CmsTestimonial = {
  tag: string
  quote: string
  name: string
}

export type CmsPillar = {
  title: string
  description: string
  iconKey: string
}

export type CmsSector = {
  name: string
  iconKey: string
}

export type CmsPhilosophyCard = {
  title: string
  description: string
  iconKey: string
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
}

export type CmsSupportWay = {
  title: string
  description: string
  iconKey: string
  linkText: string
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

const HOME_HERO_CTA_PRIMARY_DEFAULT: CmsHeroCta = { label: 'Explore programs', href: '/programs' }
const HOME_HERO_CTA_SECONDARY_DEFAULT: CmsHeroCta = { label: 'Support our mission', href: '/support' }

const ABOUT_HERO_TITLE_DEFAULT: CmsHeroTitle = { prefix: 'Our Story & ', accent: 'Mission' }
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
  { value: '2025', label: 'Season' },
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
  { value: 'Mon–Sat', label: 'Office Hours' },
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
    'The Ananse festivals are a homecoming. Hearing the stories of my elders connected me to my roots in a way nothing else could.',
  name: 'Sarah Johnson',
  role: '2023 Participant',
  initials: 'SJ',
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

const HOME_TESTIMONIALS_DEFAULT: CmsTestimonial[] = [
  {
    tag: 'Mentorship',
    quote:
      "Through Sankofa, I found a connection to my heritage I did not know was missing — it is learning that lives in your bones.",
    name: 'Program alumni',
  },
  {
    tag: 'Arts',
    quote:
      'The arts programs gave me language to express identity. My work now carries the story of where I come from.',
    name: 'Arts education participant',
  },
  {
    tag: 'Community',
    quote:
      'This center became my second home — family, purpose, and a community that uplifts our shared heritage.',
    name: 'Community volunteer',
  },
]

export const CONTENT_REGISTRY = {
  'home.hero.lead': {
    label: 'Home — hero lead',
    section: 'home',
    defaultBody:
      'Preserving heritage, restoring identity, and developing the next generation of Pan-African leaders through Sankofa arts and culture programs in Ghana and across the diaspora.',
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
    hint: 'Separate paragraphs with a blank line.',
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
    hint: 'JSON array: [{ "tag", "quote", "name" }]',
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
    defaultBody:
      'Whether you seek programs, partnership, or a way to give back — there is a place for you at our table.',
  },
  'about.mission': {
    label: 'About — mission summary',
    section: 'about',
    defaultBody:
      'We weave wisdom into solutions by connecting cultural knowledge with practical programs that empower youth and communities.',
  },
  'about.mission.continuation': {
    label: 'About — mission (continued)',
    section: 'about',
    defaultBody:
      "In a world where cultural erosion threatens the wisdom of our ancestors, we stand as guardians of tradition while embracing innovation. We believe that cultural knowledge is not static—it's a living, breathing force that must be nurtured, shared, and evolved.",
  },
  'about.hero.lead': {
    label: 'About — hero description',
    section: 'about',
    defaultBody:
      'Rooted in tradition and reaching toward the future — a beacon for cultural preservation, healing, and Pan-African leadership in Ghana.',
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
    hint: 'Separate paragraphs with a blank line.',
    defaultBody:
      'We envision a world where African cultural heritage is not just preserved but actively celebrated and integrated into contemporary life. Where every individual, regardless of where they live, can access the richness of African traditions and find their place within this vibrant tapestry.\n\nOur vision extends beyond cultural preservation to cultural innovation—where ancient wisdom informs modern creativity, and traditional practices inspire contemporary solutions to global challenges.',
  },
  'about.philosophy.lead': {
    label: 'About — philosophy section intro',
    section: 'about',
    defaultBody:
      'Understanding the principles that guide our work and shape our community.',
  },
  'about.approach.lead': {
    label: 'About — approach section intro',
    section: 'about',
    defaultBody:
      'How we bring our mission to life through intentional, community-centered practices.',
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
    defaultBody: 'Building a Legacy Together',
  },
  'about.cta.body': {
    label: 'About — bottom CTA body',
    section: 'about',
    hint: 'Separate paragraphs with a blank line if needed.',
    defaultBody:
      "Our story is still being written, and it's a story that belongs to all of us. Every person who walks through our doors, every program we offer, every connection we make adds a new chapter to this ongoing narrative of cultural preservation and community empowerment.",
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
  'programs.catalog.lead': {
    label: 'Programs — catalog intro',
    section: 'programs',
    defaultBody:
      'Explore our diverse range of programs designed for all ages and experience levels.',
  },
  'programs.benefits.lead': {
    label: 'Programs — benefits intro',
    section: 'programs',
    defaultBody:
      'Our programs are designed to provide more than just skills—they offer transformation, connection, and personal growth.',
  },
  'programs.benefits': {
    label: 'Programs — benefit cards (JSON)',
    section: 'programs',
    hint: 'JSON array: [{ "title", "description", "iconKey" }]. iconKey: Wrench, Globe, Users, Sprout, etc.',
    defaultBody: JSON.stringify(
      [
        {
          title: 'Skill Development',
          description:
            'Learn traditional and contemporary techniques from master practitioners with years of experience.',
          iconKey: 'Wrench',
        },
        {
          title: 'Cultural Connection',
          description:
            'Deepen your understanding and connection to African heritage through immersion and practice.',
          iconKey: 'Globe',
        },
        {
          title: 'Community Building',
          description:
            'Join a supportive network of learners, artists, and cultural enthusiasts from diverse backgrounds.',
          iconKey: 'Users',
        },
        {
          title: 'Personal Growth',
          description:
            'Discover new aspects of yourself through creative expression and ancestral wisdom.',
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
    hint: 'JSON array: [{ "name", "role", "text", "initials" }]',
    defaultBody: JSON.stringify(
      [
        {
          name: 'Ama Mensah',
          role: 'Traditional Arts Student',
          text: "Learning Adinkra symbols wasn't just about art—it was about understanding the wisdom of my ancestors. This program gave me a deeper connection to who I am.",
          initials: 'AM',
        },
        {
          name: 'Kwame Johnson',
          role: 'Music & Rhythm Student',
          text: 'The drumming program changed my life. I found community, purpose, and a way to express emotions I did not know how to put into words.',
          initials: 'KJ',
        },
        {
          name: 'Evelyn Davis',
          role: 'Storytelling Participant',
          text: 'As someone in the diaspora, this program helped me reconnect with my roots in the most beautiful way. I now carry these stories with pride.',
          initials: 'ED',
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
    defaultBody:
      "Whether you're looking to learn a new skill, connect with your heritage, or simply explore the richness of African culture, there's a program waiting for you.",
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
    defaultBody: 'Upcoming Soon',
  },
  'events.featured.heading': {
    label: 'Events — featured section heading',
    section: 'events',
    defaultBody: 'Featured Highlights',
  },
  'events.catalog.heading': {
    label: 'Events — catalog section heading',
    section: 'events',
    defaultBody: 'All Gatherings',
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
  'support.impact.lead': {
    label: 'Support — impact section intro',
    section: 'support',
    defaultBody:
      'Every contribution, no matter the size, helps us create meaningful change in the lives of students, artists, and communities across the continent.',
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
    hint: 'JSON array: [{ "title", "description", "iconKey", "linkText" }]',
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
    defaultBody:
      "Your support doesn't just fund programs—it preserves cultural heritage and creates a future where African culture continues to thrive and inspire.",
  },
  'support.transparency.heading': {
    label: 'Support — transparency card heading',
    section: 'support',
    defaultBody: 'Transparency Matters',
  },
  'support.transparency.body': {
    label: 'Support — transparency card intro',
    section: 'support',
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
    defaultBody:
      'Give securely with Paystack — card, mobile money, and bank transfer where available.',
  },
  'support.donate.lead.offline': {
    label: 'Support — donate intro (Paystack not configured)',
    section: 'support',
    defaultBody:
      'Add your Paystack keys to enable secure online giving. You can still reach us to donate offline.',
  },
  'support.donate.presets': {
    label: 'Support — Paystack preset amounts (JSON)',
    section: 'support',
    hint: 'JSON array: [{ "amount": number, "label": "short name" }]. Amount is in GHS (or site currency).',
    defaultBody: JSON.stringify(SUPPORT_DONATE_PRESETS_DEFAULT, null, 2),
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
    defaultBody:
      'We welcome visitors to our center! For guided tours or partnership meetings, please schedule an appointment via the form or email.',
  },
  'contact.cta.body': {
    label: 'Contact — social CTA body',
    section: 'contact',
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
  'videos.cta.heading': {
    label: 'Videos — bottom CTA heading',
    section: 'videos',
    defaultBody: 'Want to See More?',
  },
  'videos.cta.body': {
    label: 'Videos — bottom CTA body',
    section: 'videos',
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
    defaultBody:
      'The Ananse Center for Arts and Culture respects your privacy. This page will be updated with our full policy before public launch. For questions, contact us directly.',
  },
  'privacy.body': {
    label: 'Privacy — body paragraph',
    section: 'legal',
    defaultBody:
      'We collect information you submit through contact forms and newsletter sign-ups solely to respond to inquiries and share program updates. We do not sell personal data.',
  },
  'terms.heading': {
    label: 'Terms — page heading',
    section: 'legal',
    defaultBody: 'Terms of Service',
  },
  'terms.lead': {
    label: 'Terms — intro paragraph',
    section: 'legal',
    defaultBody:
      'By using this website you agree to these terms. Full legal text will be published before launch. Program participation is subject to separate registration agreements.',
  },
  'terms.body': {
    label: 'Terms — body paragraph',
    section: 'legal',
    defaultBody:
      'Content on this site is for informational purposes. Images and stories represent our mission; specific dates and offerings may change.',
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
