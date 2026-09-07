import type { ContentRegistryEntry } from './registry'

export type CmsTrustee = { name: string; role: string; bio: string; initials?: string; photoUrl?: string }
export type CmsFinancialReport = { year: string; title: string; url: string }
export type CmsSpotlight = { name: string; org: string; description: string }
export type CmsCsoEntry = { name: string; focus: string; region: string; website?: string }
export type CmsArchiveItem = {
  title: string
  culture: string
  era: string
  description: string
  rightsNote: string
}
export type CmsFaculty = { name: string; title: string; expertise: string }
export type CmsNewsItem = { title: string; date: string; excerpt: string; href?: string }
export type CmsJourneyStory = { name: string; origin: string; quote: string; mediaUrl?: string }

export const DEFAULT_TRUSTEES: CmsTrustee[] = [
  {
    name: 'Norma Harris, PhD',
    role: 'Board Chair',
    bio: 'Chairs the Trustee Circle, guiding strategic oversight as the Center builds restorative arts programs and a permanent campus in Akatakyiwa.',
    initials: 'NH',
  },
  {
    name: 'Kenyatta Andrews',
    role: 'Treasurer',
    bio: 'Stewards financial accountability and transparent reporting so gifts for youth arts, residencies, and healing retreats are used with care.',
    initials: 'KA',
  },
  {
    name: 'Renee Redding-Jones',
    role: 'Secretary',
    bio: 'Supports governance records and Trustee Circle coordination as Ananse grows partnerships across Ghana and the African diaspora.',
    initials: 'RR',
  },
  {
    name: 'Nefertiti Macaulay',
    role: 'Trustee',
    bio: 'Serves on the Trustee Circle with a focus on community connection, cultural integrity, and inclusive participation in Center programs.',
    initials: 'NM',
  },
  {
    name: 'Nana H. Kojo Herukhuti Sharif Williams, PhD',
    role: 'Founder & CEO',
    bio: 'Founder and Executive Director leading Ananse’s mission to spin social and cultural webs of connection through restorative and creative arts in Akatakyiwa, Ghana.',
    initials: 'SW',
  },
]

export const DEFAULT_FINANCIAL_REPORTS: CmsFinancialReport[] = [
  { year: '2024', title: 'Annual Impact & Financial Summary (PDF)', url: '/contact#form' },
  { year: '2023', title: 'Audited Financial Overview (PDF)', url: '/contact#form' },
]

export const DEFAULT_SPOTLIGHTS: CmsSpotlight[] = [
  {
    name: 'Kente Collective',
    org: 'Local artisan cooperative',
    description: 'Partner weaving studio training youth alongside master craftspeople in Akatakyiwa.',
  },
  {
    name: 'Central Region Youth Forum',
    org: 'Community nonprofit',
    description: 'Co-hosted dialogue series on heritage, entrepreneurship, and civic participation.',
  },
]

export const DEFAULT_CSO_DIRECTORY: CmsCsoEntry[] = [
  {
    name: 'Ananse Center for Arts and Culture',
    focus: 'Arts education, restorative practice, diaspora connection',
    region: 'Akatakyiwa, Central Region',
    website: 'https://www.anansecenter.org',
  },
  {
    name: 'Coastal Heritage Network',
    focus: 'Preservation, research, community archives',
    region: 'Central Region',
  },
]

export const DEFAULT_ARCHIVE_ITEMS: CmsArchiveItem[] = [
  {
    title: 'Adinkra symbol folio',
    culture: 'Akan',
    era: '20th century teaching collection',
    description: 'Digitized reference set for symbolism workshops and school programs.',
    rightsNote: 'Community attribution; educational use with credit to originating stewards.',
  },
  {
    title: 'Sankofa oral history excerpt',
    culture: 'Pan-African diaspora',
    era: 'Contemporary',
    description: 'Recorded narrative on repatriation and healing practices near Cape Coast.',
    rightsNote: 'Participant consent on file; metadata includes interviewer and locale.',
  },
]

export const DEFAULT_FACULTY: CmsFaculty[] = [
  {
    name: 'Nana Yaa Adwoa',
    title: 'Master Storyteller',
    expertise: 'Oral tradition, Ananse narratives, youth mentorship',
  },
  {
    name: 'Kofi Asante',
    title: 'Lead Drumming Faculty',
    expertise: 'Traditional rhythm, ensemble performance, restorative circles',
  },
]

export const DEFAULT_NEWS: CmsNewsItem[] = [
  {
    title: 'Ananse Storytelling Circle Welcomes Elders and Youth',
    date: 'August 2026',
    excerpt:
      'A monthly storytelling circle brings elders and young learners together under the trees at our Akatakyiwa campus.',
  },
  {
    title: 'Kente Weaving Intensive Opens for Youth Apprentices',
    date: 'August 2026',
    excerpt:
      'Master artisans and youth apprentices work side by side in a hands-on intensive rooted in skill, discipline, and cultural pride.',
  },
  {
    title: 'Walking the Sankofa Path: A Diaspora Reflection',
    date: 'August 2026',
    excerpt:
      'A diaspora guest reflects on returning to Ghana as a practice of listening, repair, and belonging—not tourism alone.',
  },
]

export const DEFAULT_JOURNEY_STORIES: CmsJourneyStory[] = [
  {
    name: 'Marcus T.',
    origin: 'Diaspora — United States',
    quote:
      'Standing near the forts, then learning beside elders at Ananse, I began to understand repair as a daily practice—not a single trip.',
  },
  {
    name: 'Abena K.',
    origin: 'Ghana — Central Region',
    quote:
      'We are learning to be cousins again: local youth and returning family weaving the same stories in the same room.',
  },
]

/** CMS keys for roadmap pages — merged into CONTENT_REGISTRY (sync with backend). */
export const STATIC_PAGE_REGISTRY = {
  'home.journey.badge': {
    label: 'Home — Study/Heal/Give badge',
    section: 'home',
    defaultBody: 'Find your path',
  },
  'home.journey.heading': {
    label: 'Home — Study/Heal/Give heading',
    section: 'home',
    defaultBody: 'Study. Heal. Give.',
  },
  'home.journey.lead': {
    label: 'Home — Study/Heal/Give intro',
    section: 'home',
    defaultBody:
      'Whether you seek skills, restorative connection, or a way to support our work—there is a place for you at our table.',
  },
  'home.journey.study.title': {
    label: 'Home — Study card title',
    section: 'home',
    defaultBody: 'Study',
  },
  'home.journey.study.body': {
    label: 'Home — Study card body',
    section: 'home',
    defaultBody: 'Sankofa programs, admissions, faculty, and student resources in Ghana.',
  },
  'home.journey.study.cta': {
    label: 'Home — Study CTA (JSON)',
    section: 'home',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify({ label: 'Explore Programs', href: '/programs' }, null, 2),
  },
  'home.journey.heal.title': {
    label: 'Home — Heal card title',
    section: 'home',
    defaultBody: 'Heal',
  },
  'home.journey.heal.body': {
    label: 'Home — Heal card body',
    section: 'home',
    defaultBody:
      'Restorative arts, repatriation resources, and stories from the Central Region and the diaspora.',
  },
  'home.journey.heal.cta': {
    label: 'Home — Heal CTA (JSON)',
    section: 'home',
    defaultBody: JSON.stringify({ label: 'Plan Your Sankofa Journey', href: '/repatriation' }, null, 2),
  },
  'home.journey.give.title': {
    label: 'Home — Give card title',
    section: 'home',
    defaultBody: 'Give',
  },
  'home.journey.give.body': {
    label: 'Home — Give card body',
    section: 'home',
    defaultBody: 'Donate, partner with us, and review how we steward resources transparently.',
  },
  'home.journey.give.cta': {
    label: 'Home — Give CTA (JSON)',
    section: 'home',
    defaultBody: JSON.stringify({ label: 'Donate Today', href: '/support#donate' }, null, 2),
  },
  'visit.badge': { label: 'Visit — badge', section: 'visit', defaultBody: 'Visit Ghana' },
  'visit.heading': {
    label: 'Visit — heading',
    section: 'visit',
    defaultBody: 'Visit the Central Region',
  },
  'visit.lead': {
    label: 'Visit — intro',
    section: 'visit',
    format: 'html',
    defaultBody:
      'The Ananse Center is rooted in Akatakyiwa, Central Region—near heritage sites of the diaspora journey, including colonial slaving forts and the River of the Last Bath.',
  },
  'visit.body': {
    label: 'Visit — body',
    section: 'visit',
    format: 'html',
    defaultBody:
      'We welcome students, diaspora travelers, researchers, and partners by appointment. Plan adequate time for travel from Accra and respect local customs at sacred sites.\n\nDirections and group visit scheduling are coordinated through our contact team.',
  },
  'visit.directions': {
    label: 'Visit — directions (JSON)',
    section: 'visit',
    hint: 'JSON array: [{ "label", "value" }]',
    defaultBody: JSON.stringify(
      [
        { label: 'Region', value: 'Central Region, Ghana' },
        { label: 'Community', value: 'Akatakyiwa' },
        { label: 'Nearest hub', value: 'Cape Coast / Accra corridor' },
      ],
      null,
      2,
    ),
  },
  'repatriation.badge': { label: 'Repatriation — badge', section: 'repatriation', defaultBody: 'Sankofa Journey' },
  'repatriation.heading': {
    label: 'Repatriation — heading',
    section: 'repatriation',
    defaultBody: 'Healing & Repatriation Resources',
  },
  'repatriation.lead': {
    label: 'Repatriation — intro',
    section: 'repatriation',
    format: 'html',
    defaultBody:
      'We support descendants of the enslaved and Africans colonized in West Africa to heal intergenerational trauma and learn, in community, how to be cousins again.',
  },
  'repatriation.body': {
    label: 'Repatriation — body',
    section: 'repatriation',
    format: 'html',
    defaultBody:
      'Programs combine restorative arts, guided reflection near heritage sites, and long-term relationship-building—not tourism alone. Each journey is paced with pastoral care and cultural protocol.',
  },
  'repatriation.stories': {
    label: 'Repatriation — journey stories (JSON)',
    section: 'repatriation',
    hint: 'JSON array: CmsJourneyStory',
    defaultBody: JSON.stringify(DEFAULT_JOURNEY_STORIES, null, 2),
  },
  'trustees.badge': { label: 'Trustees — badge', section: 'trustees', defaultBody: 'Governance' },
  'trustees.heading': {
    label: 'Trustees — heading',
    section: 'trustees',
    defaultBody: 'Trustee Circle',
  },
  'trustees.lead': {
    label: 'Trustees — intro',
    section: 'trustees',
    format: 'html',
    defaultBody:
      'Our Trustee Circle provides oversight, accountability, and strategic guidance for programs, partnerships, and financial stewardship.',
  },
  'trustees.members': {
    label: 'Trustees — members (JSON)',
    section: 'trustees',
    defaultBody: JSON.stringify(DEFAULT_TRUSTEES, null, 2),
  },
  'transparency.badge': { label: 'Transparency — badge', section: 'transparency', defaultBody: 'Accountability' },
  'transparency.heading': {
    label: 'Transparency — heading',
    section: 'transparency',
    defaultBody: 'Financial Transparency',
  },
  'transparency.lead': {
    label: 'Transparency — intro',
    section: 'transparency',
    format: 'html',
    defaultBody:
      'We publish how resources are allocated and welcome questions from donors and partners. Request full reports anytime.',
  },
  'transparency.body': {
    label: 'Transparency — body',
    section: 'transparency',
    format: 'html',
    defaultBody:
      'Program delivery, community outreach, operations, and reserves are reviewed annually by leadership and the Trustee Circle.',
  },
  'transparency.reports': {
    label: 'Transparency — reports (JSON)',
    section: 'transparency',
    defaultBody: JSON.stringify(DEFAULT_FINANCIAL_REPORTS, null, 2),
  },
  'admissions.badge': { label: 'Admissions — badge', section: 'admissions', defaultBody: 'Enroll' },
  'admissions.heading': {
    label: 'Admissions — heading',
    section: 'admissions',
    defaultBody: 'Admissions & Fees',
  },
  'admissions.lead': {
    label: 'Admissions — intro',
    section: 'admissions',
    format: 'html',
    defaultBody:
      'Apply to Sankofa arts and leadership programs. Fees vary by program length; scholarships may be available for Ghana-based youth.',
  },
  'admissions.body': {
    label: 'Admissions — body',
    section: 'admissions',
    format: 'html',
    defaultBody:
      'Submit the inquiry form with your program of interest. Our team will share schedules, fees in GHS, and LMS access after enrollment.',
  },
  'admissions.fees': {
    label: 'Admissions — fee table (JSON)',
    section: 'admissions',
    defaultBody: JSON.stringify(
      [
        { label: 'Workshop series', value: 'From GH₵350' },
        { label: 'Term program', value: 'From GH₵1,200' },
        { label: 'Diaspora intensive', value: 'Custom quote' },
      ],
      null,
      2,
    ),
  },
  'admissions.faculty': {
    label: 'Admissions — faculty (JSON)',
    section: 'admissions',
    defaultBody: JSON.stringify(DEFAULT_FACULTY, null, 2),
  },
  'community.badge': { label: 'Community — badge', section: 'community', defaultBody: 'Community' },
  'community.heading': {
    label: 'Community — heading',
    section: 'community',
    defaultBody: 'Community Spotlight',
  },
  'community.lead': {
    label: 'Community — intro',
    section: 'community',
    format: 'html',
    defaultBody:
      'We highlight partners, artisans, and nonprofits strengthening culture and entrepreneurship across the Central Region.',
  },
  'community.spotlights': {
    label: 'Community — spotlights (JSON)',
    section: 'community',
    defaultBody: JSON.stringify(DEFAULT_SPOTLIGHTS, null, 2),
  },
  'resources.badge': { label: 'CSO directory — badge', section: 'resources', defaultBody: 'Regional hub' },
  'resources.heading': {
    label: 'CSO directory — heading',
    section: 'resources',
    defaultBody: 'CSO & Partner Directory',
  },
  'resources.lead': {
    label: 'CSO directory — intro',
    section: 'resources',
    format: 'html',
    defaultBody:
      'A growing reference of civil society and development partners in Ghana’s Central Region—for researchers, funders, and collaborators.',
  },
  'resources.entries': {
    label: 'CSO directory — entries (JSON)',
    section: 'resources',
    defaultBody: JSON.stringify(DEFAULT_CSO_DIRECTORY, null, 2),
  },
  'archives.badge': { label: 'Archives — badge', section: 'archives', defaultBody: 'Digital heritage' },
  'archives.heading': {
    label: 'Archives — heading',
    section: 'archives',
    defaultBody: 'Digital Archives',
  },
  'archives.lead': {
    label: 'Archives — intro',
    section: 'archives',
    format: 'html',
    defaultBody:
      'We digitize stories, artifacts, and educational materials with metadata that honors originating cultures and community stewards.',
  },
  'archives.body': {
    label: 'Archives — body',
    section: 'archives',
    format: 'html',
    defaultBody:
      'Metadata records include cultural attribution, rights notes, and locale—alongside institutional cataloguing for global interoperability.',
  },
  'archives.items': {
    label: 'Archives — items (JSON)',
    section: 'archives',
    defaultBody: JSON.stringify(DEFAULT_ARCHIVE_ITEMS, null, 2),
  },
  'news.badge': { label: 'News — badge', section: 'news', defaultBody: 'Updates' },
  'news.heading': { label: 'News — heading', section: 'news', defaultBody: 'News & Updates' },
  'news.lead': {
    label: 'News — intro',
    section: 'news',
    format: 'html',
    defaultBody: 'Announcements, partnerships, and community news from the Center.',
  },
  'news.readMore': {
    label: 'News — read more link label',
    section: 'news',
    defaultBody: 'Read more',
  },
  'news.backLink': {
    label: 'News — detail back link label',
    section: 'news',
    defaultBody: '← News & updates',
  },
  'news.empty': {
    label: 'News — empty state message',
    section: 'news',
    defaultBody: 'No posts published yet. Check back soon.',
  },
  'news.cta.primary': {
    label: 'News — primary CTA (JSON)',
    section: 'news',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify({ label: 'Subscribe', href: '/events#newsletter' }, null, 2),
  },
  'news.cta.secondary': {
    label: 'News — secondary CTA (JSON)',
    section: 'news',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify({ label: 'Community spotlight', href: '/community' }, null, 2),
  },
  'news.items': {
    label: 'News — fallback items (JSON)',
    section: 'news',
    hint: 'Only used if no posts exist in Admin → News. Prefer managing posts under /admin/news.',
    defaultBody: JSON.stringify(DEFAULT_NEWS, null, 2),
  },
  'programs.lms.label': {
    label: 'Programs — LMS portal label',
    section: 'programs',
    defaultBody: 'Student LMS Portal',
  },
  'programs.lms.hint': {
    label: 'Programs — LMS portal hint',
    section: 'programs',
    defaultBody: 'Enrolled students: sign in to access coursework, schedules, and resources.',
  },
  'partnerships.badge': {
    label: 'Partnerships — badge',
    section: 'partnerships',
    defaultBody: 'Collaborate',
  },
  'partnerships.heading': {
    label: 'Partnerships — heading',
    section: 'partnerships',
    defaultBody: 'Partnerships & Corporate Engagement',
  },
  'partnerships.lead': {
    label: 'Partnerships — intro',
    section: 'partnerships',
    format: 'html',
    defaultBody:
      'We co-design programs with schools, NGOs, and corporate partners who share our commitment to restorative arts and youth leadership in Ghana and the diaspora.',
  },
  'partnerships.body': {
    label: 'Partnerships — body',
    section: 'partnerships',
    format: 'html',
    defaultBody:
      'Partnerships may include program sponsorship, in-kind resources, artist residencies, and diaspora engagement campaigns. All collaborations are guided by community ownership and transparent stewardship.',
  },
  'partnerships.tiers': {
    label: 'Partnerships — tiers (JSON)',
    section: 'partnerships',
    hint: 'JSON: [{ "title", "description" }]',
    defaultBody: JSON.stringify(
      [
        {
          title: 'Program sponsor',
          description: 'Fund a cohort workshop or Sankofa mentorship series with named recognition.',
        },
        {
          title: 'Corporate CSR partner',
          description: 'Multi-year support for arts education, archives digitization, or community festivals.',
        },
        {
          title: 'Institutional collaborator',
          description: 'Research, exchange, and co-hosted events with universities and cultural institutions.',
        },
      ],
      null,
      2,
    ),
  },
} as const satisfies Record<string, ContentRegistryEntry>
