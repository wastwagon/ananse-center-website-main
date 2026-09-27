import type { ContentRegistryEntry } from './registry.js'

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
    bio: 'Provides board leadership and strategic oversight as ANANSE grows leadership programs and partnerships across Ghana and the diaspora.',
    initials: 'NH',
  },
  {
    name: 'Kenyatta Andrews',
    role: 'Treasurer',
    bio: 'Stewards financial accountability and transparent reporting so gifts for programs, mentorship, and community initiatives are used with care.',
    initials: 'KA',
  },
  {
    name: 'Renee Redding-Jones',
    role: 'Secretary',
    bio: 'Supports governance records and board coordination as ANANSE engages partners across Ghana and the African diaspora.',
    initials: 'RR',
  },
  {
    name: 'Nefertiti Macaulay',
    role: 'Board member',
    bio: 'Contributes to governance with a focus on community connection, integrity, and inclusive participation in Center programs.',
    initials: 'NM',
  },
  {
    name: 'Nana H. Kojo Herukhuti Sharif Williams, PhD',
    role: 'Founder & CEO',
    bio: 'Founder and Executive Director leading ANANSE’s mission to develop character, wisdom, competence, and service in leaders across Ghana and the diaspora.',
    initials: 'SW',
  },
]

export const DEFAULT_FINANCIAL_REPORTS: CmsFinancialReport[] = [
  { year: '2024', title: 'Annual Impact & Financial Summary (PDF)', url: '/get-involved#contact' },
  { year: '2023', title: 'Audited Financial Overview (PDF)', url: '/get-involved#contact' },
]

export const DEFAULT_SPOTLIGHTS: CmsSpotlight[] = [
  {
    name: 'Community partner',
    org: 'Civil society',
    description: 'Collaborates with ANANSE on leadership development and service initiatives in Ghana.',
  },
  {
    name: 'Youth leadership cohort',
    org: 'Community program',
    description: 'Emerging leaders building character, responsibility, and practical skills through mentorship and workshops.',
  },
]

export const DEFAULT_CSO_DIRECTORY: CmsCsoEntry[] = [
  {
    name: 'ANANSE Center for Leadership Development',
    focus: 'Leadership development, education, mentorship',
    region: 'Ghana',
    website: 'https://www.anansecenter.org',
  },
  {
    name: 'Regional partner (placeholder)',
    focus: 'Community development, education',
    region: 'Ghana',
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
    name: 'Faculty name (placeholder)',
    title: 'Program facilitator',
    expertise: 'Leadership development, mentorship, group learning',
  },
  {
    name: 'Faculty name (placeholder)',
    title: 'Program facilitator',
    expertise: 'Character formation, community leadership, practical skills',
  },
]

export const DEFAULT_NEWS: CmsNewsItem[] = [
  {
    title: 'Program updates',
    date: 'TBD',
    excerpt: 'Announcements about ANANSE programs and gatherings will appear here when published.',
  },
  {
    title: 'Leadership conversations',
    date: 'TBD',
    excerpt: 'Highlights from lectures, mentorship, and community learning will be shared when available.',
  },
  {
    title: 'Partner news',
    date: 'TBD',
    excerpt: 'Collaborations and impact stories from Ghana and the diaspora will be posted as they are ready.',
  },
]

export const DEFAULT_JOURNEY_STORIES: CmsJourneyStory[] = [
  {
    name: 'Participant',
    origin: 'Diaspora',
    quote:
      'Learning alongside ANANSE helped me grow in responsibility, listening, and service—not as a one-time visit, but as ongoing relationship.',
  },
  {
    name: 'Participant',
    origin: 'Ghana',
    quote:
      'We are strengthening community by developing leaders who act with character and care for others.',
  },
]

/** CMS keys for roadmap pages — merged into CONTENT_REGISTRY (sync with backend). */
export const STATIC_PAGE_REGISTRY = {
  'home.journey.badge': {
    label: 'Home — Get Involved band badge (legacy key)',
    section: 'home',
    defaultBody: 'How to take part',
  },
  'home.journey.heading': {
    label: 'Home — Get Involved band heading (legacy key)',
    section: 'home',
    defaultBody: 'Learn. Engage. Give.',
  },
  'home.journey.lead': {
    label: 'Home — Get Involved band intro (legacy key)',
    section: 'home',
    defaultBody:
      'Explore programs, join gatherings, and support ANANSE Center for Leadership Development.',
  },
  'home.journey.study.title': {
    label: 'Home — Learn card title (legacy key)',
    section: 'home',
    defaultBody: 'Learn',
  },
  'home.journey.study.body': {
    label: 'Home — Learn card body (legacy key)',
    section: 'home',
    defaultBody: 'Leadership programs, Midday Reflection, and library resources.',
  },
  'home.journey.study.cta': {
    label: 'Home — Learn CTA (JSON, legacy key)',
    section: 'home',
    hint: 'JSON: { "label", "href" }',
    defaultBody: JSON.stringify({ label: 'Explore programs', href: '/programs' }, null, 2),
  },
  'home.journey.heal.title': {
    label: 'Home — Engage card title (legacy key)',
    section: 'home',
    defaultBody: 'Engage',
  },
  'home.journey.heal.body': {
    label: 'Home — Engage card body (legacy key)',
    section: 'home',
    defaultBody:
      'Attend events, meet people in the ANANSE community, and get involved.',
  },
  'home.journey.heal.cta': {
    label: 'Home — Engage CTA (JSON, legacy key)',
    section: 'home',
    defaultBody: JSON.stringify({ label: 'Get involved', href: '/get-involved' }, null, 2),
  },
  'home.journey.give.title': {
    label: 'Home — Give card title (legacy key)',
    section: 'home',
    defaultBody: 'Give',
  },
  'home.journey.give.body': {
    label: 'Home — Give card body (legacy key)',
    section: 'home',
    defaultBody: 'Financial gifts help create opportunities for leadership development and service.',
  },
  'home.journey.give.cta': {
    label: 'Home — Give CTA (JSON, legacy key)',
    section: 'home',
    defaultBody: JSON.stringify({ label: 'Give', href: '/support#donate' }, null, 2),
  },
  'visit.badge': { label: 'Visit — badge', section: 'visit', defaultBody: 'Connect' },
  'visit.heading': {
    label: 'Visit — heading',
    section: 'visit',
    defaultBody: 'Visit & connect in Ghana',
  },
  'visit.lead': {
    label: 'Visit — intro',
    section: 'visit',
    format: 'html',
    defaultBody:
      'ANANSE Center for Leadership Development is based in Ghana. We welcome partners, learners, and guests by appointment—start on our Get Involved page to coordinate time with the team.',
  },
  'visit.body': {
    label: 'Visit — body',
    section: 'visit',
    format: 'html',
    defaultBody:
      'Plan travel to Accra and allow time for local logistics. For meetings, programs, or group visits, contact us through Get Involved so we can respond with schedules and practical guidance.',
  },
  'visit.directions': {
    label: 'Visit — directions (JSON)',
    section: 'visit',
    hint: 'JSON array: [{ "label", "value" }]',
    defaultBody: JSON.stringify(
      [
        { label: 'Country', value: 'Ghana' },
        { label: 'Hub', value: 'Accra' },
        { label: 'Connect', value: 'Get Involved — /get-involved' },
      ],
      null,
      2,
    ),
  },
  'repatriation.badge': { label: 'Repatriation — badge', section: 'repatriation', defaultBody: 'Connection' },
  'repatriation.heading': {
    label: 'Repatriation — heading',
    section: 'repatriation',
    defaultBody: 'Repatriation & healing resources',
  },
  'repatriation.lead': {
    label: 'Repatriation — intro',
    section: 'repatriation',
    format: 'html',
    defaultBody:
      'We support descendants of the enslaved and Africans across the diaspora to heal intergenerational trauma and build lasting relationships in community.',
  },
  'repatriation.body': {
    label: 'Repatriation — body',
    section: 'repatriation',
    format: 'html',
    defaultBody:
      'Resources combine guided reflection, pastoral care, and long-term relationship-building—not tourism alone. Each journey is paced with cultural respect and care for participants.',
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
    defaultBody: 'People & leadership',
  },
  'trustees.lead': {
    label: 'Trustees — intro',
    section: 'trustees',
    format: 'html',
    defaultBody:
      'Our board and leadership community provide oversight, accountability, and strategic guidance for programs, partnerships, and financial stewardship.',
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
      'Program delivery, community outreach, operations, and reserves are reviewed annually by leadership and the board.',
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
      'Apply to ANANSE leadership programs. Fees vary by program length; scholarships may be available for Ghana-based participants.',
  },
  'admissions.body': {
    label: 'Admissions — body',
    section: 'admissions',
    format: 'html',
    defaultBody:
      'Submit the inquiry form with your program of interest. Our team will share schedules, fees in GHS, and learning access after enrollment.',
  },
  'admissions.fees': {
    label: 'Admissions — fee table (JSON)',
    section: 'admissions',
    defaultBody: JSON.stringify(
      [
        { label: 'Workshop series', value: 'From GH₵350' },
        { label: 'Term program', value: 'From GH₵1,200' },
        { label: 'Custom cohort', value: 'Contact for quote' },
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
      'We highlight partners and initiatives strengthening leadership, service, and entrepreneurship across Ghana.',
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
      'A growing reference of civil society and development partners in Ghana—for researchers, funders, and collaborators.',
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
    defaultBody: 'Announcements, partnerships, and community news from ANANSE.',
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
    defaultBody: JSON.stringify({ label: 'Read Insights', href: '/insights' }, null, 2),
  },
  'news.items': {
    label: 'News — fallback items (JSON)',
    section: 'news',
    hint: 'Only used if no Insights exist yet. Prefer managing posts under Admin → Insights.',
    defaultBody: JSON.stringify(DEFAULT_NEWS, null, 2),
  },
  'programs.lms.label': {
    label: 'Programs — LMS portal label',
    section: 'programs',
    defaultBody: 'Learning portal',
  },
  'programs.lms.hint': {
    label: 'Programs — LMS portal hint',
    section: 'programs',
    defaultBody: 'Enrolled participants: sign in when the learning portal is enabled for your cohort.',
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
      'We co-design programs with schools, NGOs, and corporate partners who share our commitment to leadership development and youth service in Ghana and the diaspora.',
  },
  'partnerships.body': {
    label: 'Partnerships — body',
    section: 'partnerships',
    format: 'html',
    defaultBody:
      'Partnerships may include program sponsorship, in-kind resources, mentorship, and diaspora engagement campaigns. All collaborations are guided by community ownership and transparent stewardship.',
  },
  'partnerships.tiers': {
    label: 'Partnerships — tiers (JSON)',
    section: 'partnerships',
    hint: 'JSON: [{ "title", "description" }]',
    defaultBody: JSON.stringify(
      [
        {
          title: 'Program sponsor',
          description: 'Fund a leadership cohort or mentorship series with named recognition.',
        },
        {
          title: 'Corporate CSR partner',
          description: 'Multi-year support for leadership education, library resources, or community initiatives.',
        },
        {
          title: 'Institutional collaborator',
          description: 'Research, exchange, and co-hosted events with universities and development partners.',
        },
      ],
      null,
      2,
    ),
  },
} as const satisfies Record<string, ContentRegistryEntry>
