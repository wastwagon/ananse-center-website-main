/**
 * Demo / handover-preview content.
 *
 * Invented so every template, filter, and cross-link can be seen before ANANSE
 * enters real materials. Every invented public string carries the DEMO banner.
 * Slugs are prefixed with `demo-` so editors can find and replace them in CMS.
 *
 * Goal: every Events type, Library shelf/collection, Insights type, and
 * People group has enough sample records to depict the premium layout.
 * Editors replace all demo-* records with real ANANSE content.
 *
 * Skip with SEED_DEMO_PREVIEW=false.
 */
import type { PrismaClient } from '@prisma/client'
import fs from 'node:fs'
import path from 'node:path'
import { getUploadDir } from '../src/lib/media-path.js'

const DEMO = 'Preview sample — for layout only. Replace with real ANANSE materials.'

const SAMPLE_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
const SAMPLE_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4'

function daysFromNow(days: number, hour = 10) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, 0, 0, 0)
  return d
}

async function ensureDemoMedia(prisma: PrismaClient) {
  const dir = getUploadDir()
  let files: string[] = []
  try {
    const all = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    const preferred = all.filter((f) => /^demo-(cover|stock|portrait|partner-logo)-/i.test(f))
    files = (preferred.length > 0 ? preferred : all).slice(0, 64)
  } catch {
    files = []
  }

  const assets: { id: string; filename: string }[] = []
  for (const [index, filename] of files.entries()) {
    const slugName = `demo-media-${index + 1}`
    const existing = await prisma.mediaAsset.findFirst({ where: { filename } })
    if (existing) {
      assets.push({ id: existing.id, filename: existing.filename })
      continue
    }
    const created = await prisma.mediaAsset.create({
      data: {
        filename,
        originalName: `${slugName}${path.extname(filename)}`,
        mimeType: filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
        sizeBytes: 180000,
        width: 1600,
        height: 900,
        altText: `Demo preview image ${index + 1} — replace with approved photograph`,
        title: `Demo preview ${index + 1}`,
      },
    })
    assets.push({ id: created.id, filename: created.filename })
  }
  return assets
}

export async function seedDemoPreviewContent(prisma: PrismaClient) {
  const media = await ensureDemoMedia(prisma)
  const pick = (i: number) => media[i % Math.max(media.length, 1)]?.id ?? null
  const pickMany = (start: number, count: number) =>
    Array.from({ length: count }, (_, i) => pick(start + i)).filter(Boolean) as string[]
  const byFilename = Object.fromEntries(media.map((asset) => [asset.filename, asset.id]))
  const pickFile = (filename: string, fallbackIndex = 0) =>
    byFilename[filename] ?? pick(fallbackIndex)

  const programs = await prisma.program.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
  })
  const bySlug = Object.fromEntries(programs.map((p) => [p.slug, p]))
  const midday = bySlug['midday-reflection']
  const leadership = bySlug['leadership-development']
  const mentorship = bySlug['mentorship']
  const excellence = bySlug['excellence-lectures']
  const sankofa = bySlug['sankofa-adr']
  const publicLectures = bySlug['public-lectures-conversations']
  const marriage = bySlug['marriage-relationships']
  const music = bySlug['music-culture']
  const healthy = bySlug['healthy-living']
  const special = bySlug['special-initiatives']

  type DemoPerson = {
    name: string
    slug: string
    roleTitle: string
    bio: string
    groups: string[]
    featured: boolean
    sortOrder: number
    photoFile: string
    isOrganization?: boolean
    organizationName?: string
    websiteUrl?: string
    logoFile?: string
  }

  const people: DemoPerson[] = [
    {
      name: 'Samuel Koranteng-Pipim',
      slug: 'demo-samuel-koranteng-pipim',
      roleTitle: 'Founding voice · Midday Reflection',
      bio: `${DEMO}

Sample leadership + speakers profile for the Midday Reflection host. Use this card to show how a founding voice appears across People, Library, and Events.

Replace with an agreed biography, portrait, and permission before go-live. Personal contact details are never listed on the public profile.`,
      groups: ['Leadership', 'Speakers & Faculty'],
      featured: true,
      sortOrder: 0,
      photoFile: 'demo-portrait-01.jpg',
    },
    {
      name: 'Dr. Ama Serwaa',
      slug: 'demo-ama-serwaa',
      roleTitle: 'Director of Leadership Programs',
      bio: `${DEMO}

Sample director profile for Leadership Development. Shows how a multi-group profile (Leadership + Speakers & Faculty) reads on the listing and detail pages.

Her sample focus areas: character formation, program design, and mentoring emerging facilitators.`,
      groups: ['Leadership', 'Speakers & Faculty'],
      featured: true,
      sortOrder: 1,
      photoFile: 'demo-portrait-02.jpg',
    },
    {
      name: 'Kwesi Mensah',
      slug: 'demo-kwesi-mensah',
      roleTitle: 'Mentor · Public service',
      bio: `${DEMO}

Sample mentor profile. Mentoring interest on the site is an expression of interest — not a guaranteed match.

Use this card to depict calm, experienced guidance for people serving in public and civic roles.`,
      groups: ['Mentors'],
      featured: true,
      sortOrder: 2,
      photoFile: 'demo-portrait-03.jpg',
    },
    {
      name: 'Nana Akua Boateng',
      slug: 'demo-nana-akua-boateng',
      roleTitle: 'Speaker · Excellence Lectures',
      bio: `${DEMO}

Sample Excellence Lectures speaker. Linked in demo records to Library listen/watch items so related talks can appear on the profile.`,
      groups: ['Speakers & Faculty'],
      featured: false,
      sortOrder: 3,
      photoFile: 'demo-portrait-04.jpg',
    },
    {
      name: 'Yaw Ofori',
      slug: 'demo-yaw-ofori',
      roleTitle: 'Fellow · Leadership Development',
      bio: `${DEMO}

Sample fellow / participant. Publish only when the person has agreed. Shows how emerging leaders appear under Fellows and Participants.`,
      groups: ['Fellows and Participants'],
      featured: false,
      sortOrder: 4,
      photoFile: 'demo-portrait-05.jpg',
    },
    {
      name: 'EAGLES Preview Partner',
      slug: 'demo-eagles-preview-partner',
      roleTitle: 'Institutional partner',
      bio: `${DEMO}

Sample organisation partner with logo and website — not a personal contact directory. Partners appear as institutions that walk with ANANSE’s work.`,
      groups: ['Partners'],
      isOrganization: true,
      organizationName: 'EAGLES Preview Partner',
      websiteUrl: 'https://example.com',
      featured: true,
      sortOrder: 5,
      photoFile: 'demo-partner-logo-01.jpg',
      logoFile: 'demo-partner-logo-01.jpg',
    },
    {
      name: 'Abena Owusu',
      slug: 'demo-abena-owusu',
      roleTitle: 'Mentor · Education',
      bio: `${DEMO}

Sample education mentor who also speaks in faculty settings. Demonstrates Mentors + Speakers & Faculty together on one profile.`,
      groups: ['Mentors', 'Speakers & Faculty'],
      featured: false,
      sortOrder: 6,
      photoFile: 'demo-portrait-07.jpg',
    },
    {
      name: 'Kojo Addae',
      slug: 'demo-kojo-addae',
      roleTitle: 'Facilitator · Sankofa ADR',
      bio: `${DEMO}

Sample facilitator for peacemaking workshops. Use for Sankofa ADR cross-links from Events and Library.`,
      groups: ['Speakers & Faculty'],
      featured: false,
      sortOrder: 7,
      photoFile: 'demo-portrait-08.jpg',
    },
    {
      name: 'Efua Mensima',
      slug: 'demo-efua-mensima',
      roleTitle: 'Fellow · Mentorship cohort',
      bio: `${DEMO}

Sample emerging-leader fellow from a mentorship cohort. Shows a second Fellows and Participants card with a distinct portrait.`,
      groups: ['Fellows and Participants'],
      featured: false,
      sortOrder: 8,
      photoFile: 'demo-portrait-06.jpg',
    },
    {
      name: 'Rev. Kofi Asante',
      slug: 'demo-kofi-asante',
      roleTitle: 'Speaker · Faith & Life',
      bio: `${DEMO}

Sample speaker for public conversations on authentic spirituality — welcoming, not “churchy.” Suitable for Insights Conversations and public lecture links.`,
      groups: ['Speakers & Faculty'],
      featured: false,
      sortOrder: 9,
      photoFile: 'demo-portrait-09.jpg',
    },
    {
      name: 'Adwoa Darko',
      slug: 'demo-adwoa-darko',
      roleTitle: 'Advisor · Healthy Living',
      bio: `${DEMO}

Sample Healthy Living advisor and mentor. Depicts stewardship of body, mind, and service as part of leadership formation.`,
      groups: ['Mentors'],
      featured: false,
      sortOrder: 10,
      photoFile: 'demo-portrait-10.jpg',
    },
    {
      name: 'ANANSE Friends Network',
      slug: 'demo-ananse-friends-network',
      roleTitle: 'Community partner',
      bio: `${DEMO}

Sample community partner organisation for the Partners filter — logo-first, website link, no personal inbox.`,
      groups: ['Partners'],
      isOrganization: true,
      organizationName: 'ANANSE Friends Network',
      websiteUrl: 'https://example.org',
      featured: false,
      sortOrder: 11,
      photoFile: 'demo-partner-logo-02.jpg',
      logoFile: 'demo-partner-logo-02.jpg',
    },
    {
      name: 'Prof. Akosua Mensah',
      slug: 'demo-akosua-mensah',
      roleTitle: 'Board advisor · Character & learning',
      bio: `${DEMO}

Sample board / leadership advisor. Adds a third Leadership profile so the filter feels populated without looking like a staff directory.`,
      groups: ['Leadership', 'Speakers & Faculty'],
      featured: false,
      sortOrder: 12,
      photoFile: 'demo-portrait-07.jpg',
    },
    {
      name: 'Daniel Boateng',
      slug: 'demo-daniel-boateng',
      roleTitle: 'Program lead · Mentorship',
      bio: `${DEMO}

Sample leadership program lead for Mentorship. Shows how operational leadership appears alongside mentors and fellows.`,
      groups: ['Leadership', 'Mentors'],
      featured: false,
      sortOrder: 13,
      photoFile: 'demo-portrait-08.jpg',
    },
    {
      name: 'Akua Frimpong',
      slug: 'demo-akua-frimpong',
      roleTitle: 'Mentor · Marriage & Relationships',
      bio: `${DEMO}

Sample mentor for Marriage & Relationships conversations. Mentoring interest remains an expression of interest only.`,
      groups: ['Mentors'],
      featured: false,
      sortOrder: 14,
      photoFile: 'demo-portrait-04.jpg',
    },
    {
      name: 'Issa Traoré',
      slug: 'demo-issa-traore',
      roleTitle: 'Faculty · Leadership Lectures',
      bio: `${DEMO}

Sample faculty voice for Leadership Lectures — competence, judgment, and service under pressure.`,
      groups: ['Speakers & Faculty'],
      featured: false,
      sortOrder: 15,
      photoFile: 'demo-portrait-09.jpg',
    },
    {
      name: 'Mariam Sulemana',
      slug: 'demo-mariam-sulemana',
      roleTitle: 'Fellow · Special Initiatives',
      bio: `${DEMO}

Sample fellow contributing to a special initiative. Publish only with permission; useful for Fellows and Participants density.`,
      groups: ['Fellows and Participants'],
      featured: false,
      sortOrder: 16,
      photoFile: 'demo-portrait-11.jpg',
    },
    {
      name: 'Kwabena Osei',
      slug: 'demo-kwabena-osei',
      roleTitle: 'Participant · Excellence Lectures series',
      bio: `${DEMO}

Sample participant who returns to public lectures and Midday gatherings. Shows a fourth Fellows and Participants portrait.`,
      groups: ['Fellows and Participants'],
      featured: false,
      sortOrder: 17,
      photoFile: 'demo-portrait-12.jpg',
    },
    {
      name: 'University Learning Circle',
      slug: 'demo-university-learning-circle',
      roleTitle: 'Academic partner',
      bio: `${DEMO}

Sample academic partner organisation. Demonstrates a third Partners card with an institutional logo and outbound website.`,
      groups: ['Partners'],
      isOrganization: true,
      organizationName: 'University Learning Circle',
      websiteUrl: 'https://example.edu',
      featured: false,
      sortOrder: 18,
      photoFile: 'demo-partner-logo-03.jpg',
      logoFile: 'demo-partner-logo-03.jpg',
    },
    {
      name: 'Grace Agyeman',
      slug: 'demo-grace-agyeman',
      roleTitle: 'Speaker · Music & Culture',
      bio: `${DEMO}

Sample Music & Culture speaker / facilitator — heritage, identity, and creative community as part of leadership formation.`,
      groups: ['Speakers & Faculty'],
      featured: false,
      sortOrder: 19,
      photoFile: 'demo-portrait-10.jpg',
    },
  ]

  const profileExtras: Record<string, { expertise: string; cohortLabel?: string }> = {
    'demo-samuel-koranteng-pipim': { expertise: 'Scripture, wisdom, and everyday leadership' },
    'demo-ama-serwaa': { expertise: 'Character formation, program design, mentoring facilitators' },
    'demo-kwesi-mensah': { expertise: 'Public service, mentoring, and practical counsel' },
    'demo-nana-akua-boateng': { expertise: 'Excellence, integrity, and public lectures' },
    'demo-yaw-ofori': {
      expertise: 'Emerging leadership and cohort learning',
      cohortLabel: 'Leadership Development · Preview cohort 2026',
    },
    'demo-eagles-preview-partner': { expertise: 'Institutional partnership' },
    'demo-abena-owusu': { expertise: 'Education, mentoring, and faculty conversations' },
    'demo-kojo-addae': { expertise: 'Peacemaking, dialogue, and Sankofa ADR' },
    'demo-efua-mensima': {
      expertise: 'Mentorship cohort practice',
      cohortLabel: 'Mentorship · Preview cohort 2026',
    },
    'demo-kofi-asante': { expertise: 'Faith, everyday leadership, and public conversation' },
    'demo-adwoa-darko': { expertise: 'Healthy living and stewardship of strength' },
    'demo-ananse-friends-network': { expertise: 'Community partnership' },
    'demo-akosua-mensah': { expertise: 'Character, learning, and board counsel' },
    'demo-daniel-boateng': { expertise: 'Mentorship program design' },
    'demo-akua-frimpong': { expertise: 'Marriage, family, and lasting relationships' },
    'demo-issa-traore': { expertise: 'Leadership lectures and judgment under pressure' },
    'demo-mariam-sulemana': {
      expertise: 'Special initiatives and practical service',
      cohortLabel: 'Special Initiatives · Preview cohort 2026',
    },
    'demo-kwabena-osei': {
      expertise: 'Public lectures and returning participant',
      cohortLabel: 'Excellence Lectures · Preview series 2026',
    },
    'demo-university-learning-circle': { expertise: 'Academic partnership' },
    'demo-grace-agyeman': { expertise: 'Music, culture, and belonging' },
  }

  const personIds: Record<string, string> = {}
  for (const person of people) {
    const isOrg = Boolean(person.isOrganization)
    const photoMediaId = pickFile(person.photoFile, person.sortOrder)
    const logoMediaId = isOrg
      ? pickFile(person.logoFile || person.photoFile, person.sortOrder + 8)
      : null
    const row = await prisma.person.upsert({
      where: { slug: person.slug },
      create: {
        name: person.name,
        slug: person.slug,
        roleTitle: person.roleTitle,
        bio: person.bio,
        groups: [...person.groups],
        isOrganization: isOrg,
        organizationName: person.organizationName || '',
        websiteUrl: person.websiteUrl || '',
        expertise: profileExtras[person.slug]?.expertise || '',
        cohortLabel: profileExtras[person.slug]?.cohortLabel || '',
        photoMediaId,
        logoMediaId,
        featured: person.featured,
        published: true,
        sortOrder: person.sortOrder,
      },
      update: {
        name: person.name,
        roleTitle: person.roleTitle,
        bio: person.bio,
        groups: [...person.groups],
        featured: person.featured,
        published: true,
        sortOrder: person.sortOrder,
        photoMediaId,
        logoMediaId,
        isOrganization: isOrg,
        organizationName: person.organizationName || '',
        websiteUrl: person.websiteUrl || '',
        expertise: profileExtras[person.slug]?.expertise || '',
        cohortLabel: profileExtras[person.slug]?.cohortLabel || '',
      },
    })
    personIds[person.slug] = row.id
  }

  const hostId = personIds['demo-samuel-koranteng-pipim']
  const nanaId = personIds['demo-nana-akua-boateng']
  const amaId = personIds['demo-ama-serwaa']
  const kojoId = personIds['demo-kojo-addae']
  const kofiId = personIds['demo-kofi-asante']
  const kwesiId = personIds['demo-kwesi-mensah']

  const events = [
    {
      title: 'Excellence Lecture: Leading with Character',
      slug: 'demo-excellence-lecture-character',
      description: `${DEMO}\n\nA public lecture exploring how character shapes influence, judgment, and trust. After the date, this same page holds the recording and photographs.`,
      dateLabel: '12 October 2026',
      startsAt: daysFromNow(16, 18),
      endsAt: daysFromNow(16, 20),
      timeLabel: '6:00 PM – 8:00 PM',
      location: 'Accra',
      venue: 'ANANSE Lecture Hall',
      type: 'Lecture',
      deliveryMode: 'in_person',
      programId: excellence?.id,
      featured: true,
      registrationStatus: 'open',
      highlights: ['Keynote conversation', 'Q&A', 'Recommended reading'],
    },
    {
      title: 'Excellence Lecture: The Courage to Serve',
      slug: 'demo-excellence-lecture-courage-serve',
      description: `${DEMO}\n\nA second Excellence Lecture sample — influence as a trust, and service as the measure of leadership.`,
      dateLabel: '9 November 2026',
      startsAt: daysFromNow(44, 18),
      endsAt: daysFromNow(44, 20),
      timeLabel: '6:00 PM – 8:00 PM',
      location: 'Accra',
      venue: 'ANANSE Lecture Hall',
      type: 'Lecture',
      deliveryMode: 'in_person',
      programId: excellence?.id,
      featured: false,
      registrationStatus: 'open',
      highlights: ['Keynote', 'Audience dialogue', 'Closing charge'],
    },
    {
      title: 'Midday Reflection Live Gathering',
      slug: 'demo-midday-live-gathering',
      description: `${DEMO}\n\nA live Midday gathering (Event). Regular weekly episodes live in the Library archive — not duplicated here.`,
      dateLabel: '1 October 2026',
      startsAt: daysFromNow(5, 12),
      endsAt: daysFromNow(5, 13),
      timeLabel: '12:00 PM – 1:00 PM',
      location: 'Online',
      venue: 'Zoom',
      type: 'Special Program',
      deliveryMode: 'online',
      meetingUrl: 'https://example.com/meeting',
      programId: midday?.id,
      featured: true,
      registrationStatus: 'open',
      highlights: ['Scripture', 'Conversation', 'Wisdom nugget'],
    },
    {
      title: 'Mentorship Orientation Conversation',
      slug: 'demo-mentorship-orientation',
      description: `${DEMO}\n\nOrientation for people expressing interest in mentoring. Interest is not a guaranteed match.`,
      dateLabel: '20 October 2026',
      startsAt: daysFromNow(24, 16),
      endsAt: daysFromNow(24, 18),
      timeLabel: '4:00 PM – 6:00 PM',
      location: 'Accra',
      venue: 'EAGLES Center',
      type: 'Mentorship',
      deliveryMode: 'hybrid',
      programId: mentorship?.id,
      featured: false,
      registrationStatus: 'open',
      highlights: ['Expectations', 'Matching journey', 'Questions'],
    },
    {
      title: 'Mentor Circle: Walking with Emerging Leaders',
      slug: 'demo-mentorship-circle-emerging',
      description: `${DEMO}\n\nA closed-circle mentoring gathering for mentors and mentees already in the journey.`,
      dateLabel: '18 November 2026',
      startsAt: daysFromNow(53, 17),
      endsAt: daysFromNow(53, 19),
      timeLabel: '5:00 PM – 7:00 PM',
      location: 'Accra',
      venue: 'EAGLES Center',
      type: 'Mentorship',
      deliveryMode: 'in_person',
      programId: mentorship?.id,
      featured: false,
      registrationStatus: 'open',
      highlights: ['Shared stories', 'Peer counsel', 'Prayer & charge'],
    },
    {
      title: 'Sankofa ADR Peacemaking Workshop',
      slug: 'demo-sankofa-adr-workshop',
      description: `${DEMO}\n\nWorkshop on resolving disputes and peacemaking as done by our African forebears, with contemporary practice.`,
      dateLabel: '8 November 2026',
      startsAt: daysFromNow(43, 9),
      endsAt: daysFromNow(43, 16),
      timeLabel: '9:00 AM – 4:00 PM',
      location: 'Kumasi',
      venue: 'Community Hall',
      type: 'Workshop',
      deliveryMode: 'in_person',
      programId: sankofa?.id,
      featured: false,
      registrationStatus: 'open',
      highlights: ['Case conversation', 'Practice session'],
    },
    {
      title: 'Habits of Excellence Intensive',
      slug: 'demo-workshop-habits-excellence',
      description: `${DEMO}\n\nA practical workshop on forming habits that sustain excellence in work, study, and service.`,
      dateLabel: '22 November 2026',
      startsAt: daysFromNow(57, 9),
      endsAt: daysFromNow(57, 15),
      timeLabel: '9:00 AM – 3:00 PM',
      location: 'Accra',
      venue: 'ANANSE Workshop Room',
      type: 'Workshop',
      deliveryMode: 'in_person',
      programId: excellence?.id ?? leadership?.id,
      featured: false,
      registrationStatus: 'waitlist',
      highlights: ['Practice labs', 'Peer feedback', '30-day plan'],
    },
    {
      title: 'Leadership Development Intensive (Past)',
      slug: 'demo-leadership-intensive-past',
      description: `${DEMO}\n\nPast gathering kept on the same page as the permanent record — with recording and gallery.`,
      dateLabel: '15 August 2026',
      startsAt: daysFromNow(-42, 9),
      endsAt: daysFromNow(-40, 16),
      timeLabel: 'Three-day intensive',
      location: 'Accra',
      venue: 'ANANSE Center',
      type: 'Workshop',
      deliveryMode: 'in_person',
      programId: leadership?.id,
      featured: false,
      registrationStatus: 'completed',
      recordingUrl: SAMPLE_VIDEO,
      highlights: ['Character', 'Competence', 'Service'],
      eventStatus: 'scheduled',
      withGallery: true,
    },
    {
      title: 'Public Conversation: Faith & Everyday Leadership',
      slug: 'demo-faith-everyday-leadership',
      description: `${DEMO}\n\nSample postponed conversation — shows postponed status and closed registration.`,
      dateLabel: '28 September 2026 — postponed',
      startsAt: daysFromNow(2, 17),
      endsAt: daysFromNow(2, 19),
      timeLabel: 'To be rescheduled',
      location: 'Accra',
      venue: 'To be confirmed',
      type: 'Conversation',
      deliveryMode: 'in_person',
      programId: publicLectures?.id ?? leadership?.id,
      featured: false,
      registrationStatus: 'closed',
      eventStatus: 'postponed',
      highlights: ['Dialogue', 'Open questions'],
    },
    {
      title: 'Evening Conversation: Character in Public Life',
      slug: 'demo-conversation-character-public-life',
      description: `${DEMO}\n\nAn open conversation on integrity, influence, and responsibility in public and professional life.`,
      dateLabel: '29 October 2026',
      startsAt: daysFromNow(33, 18),
      endsAt: daysFromNow(33, 20),
      timeLabel: '6:00 PM – 8:00 PM',
      location: 'Accra',
      venue: 'ANANSE Conversation Hall',
      type: 'Conversation',
      deliveryMode: 'in_person',
      programId: publicLectures?.id ?? leadership?.id,
      featured: true,
      registrationStatus: 'open',
      highlights: ['Guided dialogue', 'Audience questions', 'Closing reflection'],
    },
    {
      title: 'Online Conversation: Leading Across Generations',
      slug: 'demo-conversation-across-generations',
      description: `${DEMO}\n\nA live online conversation between emerging and seasoned leaders on learning across generations.`,
      dateLabel: '12 November 2026',
      startsAt: daysFromNow(47, 19),
      endsAt: daysFromNow(47, 20),
      timeLabel: '7:00 PM – 8:00 PM',
      location: 'Online',
      venue: 'Zoom',
      type: 'Conversation',
      deliveryMode: 'online',
      meetingUrl: 'https://example.com/meeting',
      programId: publicLectures?.id ?? mentorship?.id,
      featured: false,
      registrationStatus: 'open',
      highlights: ['Panel voices', 'Live Q&A'],
    },
    {
      title: 'Marriage & Relationships Seminar',
      slug: 'demo-marriage-relationships-seminar',
      description: `${DEMO}\n\nSample seminar under Marriage & Relationships — shows Seminar type and program link.`,
      dateLabel: '5 November 2026',
      startsAt: daysFromNow(40, 10),
      endsAt: daysFromNow(40, 15),
      timeLabel: '10:00 AM – 3:00 PM',
      location: 'Accra',
      venue: 'ANANSE Center',
      type: 'Seminar',
      deliveryMode: 'in_person',
      programId: marriage?.id,
      featured: false,
      registrationStatus: 'open',
      highlights: ['Principles', 'Conversation tables'],
    },
    {
      title: 'Seminar: Wise Decision-Making',
      slug: 'demo-seminar-wise-decisions',
      description: `${DEMO}\n\nA focused seminar on discernment, counsel, and responsible decision-making under pressure.`,
      dateLabel: '26 November 2026',
      startsAt: daysFromNow(61, 10),
      endsAt: daysFromNow(61, 14),
      timeLabel: '10:00 AM – 2:00 PM',
      location: 'Accra',
      venue: 'ANANSE Seminar Room',
      type: 'Seminar',
      deliveryMode: 'hybrid',
      programId: leadership?.id,
      featured: false,
      registrationStatus: 'open',
      highlights: ['Case studies', 'Discernment framework'],
    },
    {
      title: 'ANANSE Leadership Conference 2026',
      slug: 'demo-conference-leadership-2026',
      description: `${DEMO}\n\nA multi-session conference on character, competence, and service — keynotes, panels, and breakout rooms.`,
      dateLabel: '4–5 December 2026',
      startsAt: daysFromNow(69, 9),
      endsAt: daysFromNow(70, 17),
      timeLabel: 'Two-day conference',
      location: 'Accra',
      venue: 'ANANSE Conference Centre',
      type: 'Conference',
      deliveryMode: 'in_person',
      programId: leadership?.id,
      featured: true,
      registrationStatus: 'open',
      highlights: ['Keynotes', 'Breakout tracks', 'Closing banquet'],
    },
    {
      title: 'Conference Track: Mentorship that Forms Character',
      slug: 'demo-conference-mentorship-track',
      description: `${DEMO}\n\nA conference-day track for mentors and program leaders on forming character through mentoring relationships.`,
      dateLabel: '5 December 2026',
      startsAt: daysFromNow(70, 10),
      endsAt: daysFromNow(70, 13),
      timeLabel: '10:00 AM – 1:00 PM',
      location: 'Accra',
      venue: 'ANANSE Conference Centre · Room B',
      type: 'Conference',
      deliveryMode: 'in_person',
      programId: mentorship?.id ?? leadership?.id,
      featured: false,
      registrationStatus: 'open',
      highlights: ['Track sessions', 'Practice circle'],
    },
    {
      title: 'Music & Culture Evening (Cancelled sample)',
      slug: 'demo-music-culture-cancelled',
      description: `${DEMO}\n\nSample cancelled gathering — page remains; registration stays closed.`,
      dateLabel: '10 October 2026 — cancelled',
      startsAt: daysFromNow(14, 19),
      endsAt: daysFromNow(14, 21),
      timeLabel: 'Cancelled',
      location: 'Accra',
      venue: '—',
      type: 'Special Program',
      deliveryMode: 'in_person',
      programId: music?.id ?? special?.id,
      featured: false,
      registrationStatus: 'closed',
      eventStatus: 'cancelled',
      highlights: ['Sample cancelled state'],
    },
    {
      title: 'Healthy Living Day: Body, Mind, and Stewardship',
      slug: 'demo-special-healthy-living-day',
      description: `${DEMO}\n\nA special program day on stewardship of health as part of a life of service.`,
      dateLabel: '15 November 2026',
      startsAt: daysFromNow(50, 9),
      endsAt: daysFromNow(50, 15),
      timeLabel: '9:00 AM – 3:00 PM',
      location: 'Accra',
      venue: 'ANANSE Courtyard',
      type: 'Special Program',
      deliveryMode: 'in_person',
      programId: healthy?.id ?? special?.id,
      featured: false,
      registrationStatus: 'open',
      highlights: ['Talks', 'Movement session', 'Shared meal'],
    },
    {
      title: 'Special Initiative: A Day of Practical Service',
      slug: 'demo-special-initiative-service-day',
      description: `${DEMO}\n\nA special-initiative gathering so this program page shows an upcoming event, not only library records.`,
      dateLabel: '22 November 2026',
      startsAt: daysFromNow(57, 9),
      endsAt: daysFromNow(57, 14),
      timeLabel: '9:00 AM – 2:00 PM',
      location: 'Accra',
      venue: 'ANANSE Courtyard',
      type: 'Special Program',
      deliveryMode: 'in_person',
      programId: special?.id,
      featured: false,
      registrationStatus: 'open',
      highlights: ['Service teams', 'Shared reflection'],
    },
  ] as const

  const eventIds: Record<string, string> = {}
  for (const [index, event] of events.entries()) {
    const galleryIds =
      'withGallery' in event && event.withGallery ? pickMany(index, 4) : []
    const row = await prisma.event.upsert({
      where: { slug: event.slug },
      create: {
        title: event.title,
        slug: event.slug,
        description: event.description,
        dateLabel: event.dateLabel,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        timeLabel: event.timeLabel,
        location: event.location,
        venue: event.venue,
        type: event.type,
        deliveryMode: event.deliveryMode,
        meetingUrl: 'meetingUrl' in event ? event.meetingUrl || '' : '',
        recordingUrl: 'recordingUrl' in event ? event.recordingUrl || '' : '',
        galleryMediaIds: galleryIds,
        eventStatus: 'eventStatus' in event ? event.eventStatus || 'scheduled' : 'scheduled',
        programId: event.programId ?? null,
        capacity: 120,
        registrationStatus: event.registrationStatus,
        featured: event.featured,
        published: true,
        coverMediaId: pick(index),
        highlights: [...event.highlights],
        storyTitle: 'About this gathering',
        storyBody: event.description,
      },
      update: {
        title: event.title,
        description: event.description,
        dateLabel: event.dateLabel,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        timeLabel: event.timeLabel,
        location: event.location,
        venue: event.venue,
        type: event.type,
        deliveryMode: event.deliveryMode,
        meetingUrl: 'meetingUrl' in event ? event.meetingUrl || '' : '',
        recordingUrl: 'recordingUrl' in event ? event.recordingUrl || '' : '',
        galleryMediaIds: galleryIds,
        featured: event.featured,
        published: true,
        registrationStatus: event.registrationStatus,
        eventStatus: 'eventStatus' in event ? event.eventStatus || 'scheduled' : 'scheduled',
        programId: event.programId ?? null,
        coverMediaId: pick(index),
        highlights: [...event.highlights],
        storyBody: event.description,
      },
    })
    eventIds[event.slug] = row.id
  }

  const middayEpisodes = [
    {
      title: 'Wisdom for the Journey',
      slug: 'demo-midday-01-wisdom-for-the-journey',
      episodeNumber: 1,
      scriptureTheme: 'Proverbs 4:7',
      description: `${DEMO}\n\nSample Midday episode — shows scripture, audio, video, transcript, wisdom nugget, further study.`,
      wisdomNugget: 'Wisdom is not merely knowing more. It is discerning what matters.',
      furtherStudy: 'Read Proverbs 4. Reflect on one decision this week that needs wisdom more than speed.',
      transcript: `Welcome to Midday Reflection.\n\n${DEMO}\n\nToday we linger over the call to seek wisdom — not as information alone, but as a way of walking carefully through ordinary life.`,
      featured: true,
      dateLabel: 'September 2026 · Episode 1',
      publishedAt: daysFromNow(-21),
    },
    {
      title: 'Character in Quiet Places',
      slug: 'demo-midday-02-character-in-quiet-places',
      episodeNumber: 2,
      scriptureTheme: 'Psalm 15',
      description: `${DEMO}\n\nWho we are when no one is watching shapes who we become when many are watching.`,
      wisdomNugget: 'Character is formed in quiet places long before it is tested in public ones.',
      furtherStudy: 'Journal one quiet habit that strengthens integrity.',
      transcript: `Midday Reflection · Episode 2\n\n${DEMO}\n\nCharacter grows in the unnoticed practices of honesty, patience, and responsibility.`,
      featured: false,
      dateLabel: 'September 2026 · Episode 2',
      publishedAt: daysFromNow(-14),
    },
    {
      title: 'Serving with Influence',
      slug: 'demo-midday-03-serving-with-influence',
      episodeNumber: 3,
      scriptureTheme: 'Mark 10:42–45',
      description: `${DEMO}\n\nInfluence is a trust. This episode explores leadership as service.`,
      wisdomNugget: 'The measure of influence is the good it creates for others.',
      furtherStudy: 'Name one person you can serve this week without being asked.',
      transcript: `Midday Reflection · Episode 3\n\n${DEMO}\n\nGreatness in the kingdom is tied to service — not status.`,
      featured: true,
      dateLabel: 'September 2026 · Episode 3',
      publishedAt: daysFromNow(-7),
    },
    {
      title: 'Learning for a Lifetime',
      slug: 'demo-midday-04-learning-for-a-lifetime',
      episodeNumber: 4,
      scriptureTheme: 'Proverbs 1:5',
      description: `${DEMO}\n\nSample episode on lifelong learning — fourth card in the Midday archive.`,
      wisdomNugget: 'A wise learner stays teachable long after the certificate is framed.',
      furtherStudy: 'Choose one book or conversation that stretches your thinking this month.',
      transcript: `Midday Reflection · Episode 4\n\n${DEMO}\n\nLifelong learning is a posture of humility.`,
      featured: false,
      dateLabel: 'September 2026 · Episode 4',
      publishedAt: daysFromNow(-3),
    },
    {
      title: 'Courage for Ordinary Days',
      slug: 'demo-midday-05-courage-for-ordinary-days',
      episodeNumber: 5,
      scriptureTheme: 'Joshua 1:9',
      description: `${DEMO}\n\nLatest-style Midday sample for the homepage feature slot.`,
      wisdomNugget: 'Courage is often quiet faithfulness in ordinary responsibilities.',
      furtherStudy: 'Identify one ordinary duty that needs courage this week.',
      transcript: `Midday Reflection · Episode 5\n\n${DEMO}\n\nCourage is not only for crisis — it is for daily faithfulness.`,
      featured: true,
      dateLabel: 'September 2026 · Episode 5',
      publishedAt: daysFromNow(-1),
    },
  ] as const

  for (const ep of middayEpisodes) {
    await prisma.libraryItem.upsert({
      where: { slug: ep.slug },
      create: {
        title: ep.title,
        slug: ep.slug,
        description: ep.description,
        shelf: 'listen',
        collection: 'Midday Reflection',
        body: ep.description,
        transcript: ep.transcript,
        furtherStudy: ep.furtherStudy,
        wisdomNugget: ep.wisdomNugget,
        scriptureTheme: ep.scriptureTheme,
        episodeNumber: ep.episodeNumber,
        dateLabel: ep.dateLabel,
        publishedAt: ep.publishedAt,
        topics: ['Faith & Life', 'Character', 'Personal Growth'],
        programId: midday?.id ?? null,
        personId: hostId,
        coverMediaId: pick(ep.episodeNumber),
        audioUrl: SAMPLE_AUDIO,
        videoUrl: SAMPLE_VIDEO,
        featured: ep.featured,
        published: true,
        sortOrder: ep.episodeNumber,
      },
      update: {
        title: ep.title,
        description: ep.description,
        shelf: 'listen',
        collection: 'Midday Reflection',
        transcript: ep.transcript,
        furtherStudy: ep.furtherStudy,
        wisdomNugget: ep.wisdomNugget,
        scriptureTheme: ep.scriptureTheme,
        episodeNumber: ep.episodeNumber,
        dateLabel: ep.dateLabel,
        publishedAt: ep.publishedAt,
        featured: ep.featured,
        published: true,
        audioUrl: SAMPLE_AUDIO,
        videoUrl: SAMPLE_VIDEO,
        personId: hostId,
        programId: midday?.id ?? null,
        coverMediaId: pick(ep.episodeNumber),
        topics: ['Faith & Life', 'Character', 'Personal Growth'],
      },
    })
  }

  const otherLibrary = [
    {
      title: 'Excellence Lecture Preview: The Cost of Integrity',
      slug: 'demo-listen-excellence-integrity',
      shelf: 'listen',
      collection: 'Excellence Lectures',
      description: `${DEMO}\n\nSample Listen · Excellence Lectures item (audio + speaker link).`,
      topics: ['Excellence', 'Character'],
      programId: excellence?.id,
      personId: nanaId,
      featured: true,
      audio: true,
    },
    {
      title: 'Excellence Lecture Preview: Courage to Serve',
      slug: 'demo-listen-excellence-courage',
      shelf: 'listen',
      collection: 'Excellence Lectures',
      description: `${DEMO}\n\nSecond Excellence Lectures listen sample for collection filters.`,
      topics: ['Excellence', 'Leadership'],
      programId: excellence?.id,
      personId: nanaId,
      featured: false,
      audio: true,
    },
    {
      title: 'Leadership Conversation Preview',
      slug: 'demo-watch-leadership-conversation',
      shelf: 'watch',
      collection: 'Public Lectures & Conversations',
      description: `${DEMO}\n\nSample Watch shelf item.`,
      topics: ['Leadership', 'Society'],
      programId: publicLectures?.id ?? leadership?.id,
      personId: amaId,
      featured: true,
      video: true,
    },
    {
      title: 'Mentorship Session Preview',
      slug: 'demo-watch-mentorship-session',
      shelf: 'watch',
      collection: 'Mentorship Sessions',
      description: `${DEMO}\n\nSample mentorship session recording.`,
      topics: ['Mentorship', 'Personal Growth'],
      programId: mentorship?.id,
      personId: kwesiId,
      featured: false,
      video: true,
    },
    {
      title: 'Sankofa ADR Address Preview',
      slug: 'demo-listen-sankofa-address',
      shelf: 'listen',
      collection: 'Sankofa ADR',
      description: `${DEMO}\n\nSample Sankofa ADR address on Listen.`,
      topics: ['Africa & Development', 'Society'],
      programId: sankofa?.id,
      personId: kojoId,
      featured: false,
      audio: true,
    },
    {
      title: 'Leadership Lecture Preview: Responsibility',
      slug: 'demo-listen-leadership-responsibility',
      shelf: 'listen',
      collection: 'Leadership Lectures',
      description: `${DEMO}\n\nSample Leadership Lectures collection on Listen.`,
      topics: ['Leadership', 'Character'],
      programId: leadership?.id,
      personId: amaId,
      featured: false,
      audio: true,
    },
    {
      title: 'Leadership Lecture Preview: Judgment Under Pressure',
      slug: 'demo-listen-leadership-judgment',
      shelf: 'listen',
      collection: 'Leadership Lectures',
      description: `${DEMO}\n\nSecond Leadership Lectures listen sample.`,
      topics: ['Leadership', 'Personal Growth'],
      programId: leadership?.id,
      personId: amaId,
      featured: false,
      audio: true,
    },
    {
      title: 'Workshop Preview: Habits of Excellence',
      slug: 'demo-watch-workshop-habits',
      shelf: 'watch',
      collection: 'Workshops & Seminars',
      description: `${DEMO}\n\nSample Workshops & Seminars on Watch.`,
      topics: ['Excellence', 'Education'],
      programId: excellence?.id,
      personId: nanaId,
      featured: false,
      video: true,
    },
    {
      title: 'Seminar Preview: Wise Decision-Making',
      slug: 'demo-listen-workshop-wise-decisions',
      shelf: 'listen',
      collection: 'Workshops & Seminars',
      description: `${DEMO}\n\nSample Workshops & Seminars on Listen.`,
      topics: ['Leadership', 'Education'],
      programId: leadership?.id,
      personId: amaId,
      featured: false,
      audio: true,
    },
    {
      title: 'Interview Preview: A Life of Service',
      slug: 'demo-watch-interview-service',
      shelf: 'watch',
      collection: 'Interviews',
      description: `${DEMO}\n\nSample Interviews collection on Watch.`,
      topics: ['Leadership', 'Personal Growth'],
      programId: leadership?.id,
      personId: kofiId,
      featured: false,
      video: true,
    },
    {
      title: 'Healthy Living Conversation Preview',
      slug: 'demo-listen-healthy-living',
      shelf: 'listen',
      collection: 'Interviews & Conversations',
      description: `${DEMO}\n\nSample Interviews & Conversations on Listen, linked to Healthy Living.`,
      topics: ['Healthy Living', 'Personal Growth'],
      programId: healthy?.id,
      personId: personIds['demo-adwoa-darko'],
      featured: false,
      audio: true,
    },
    {
      title: 'Special Program Address Preview',
      slug: 'demo-listen-special-program',
      shelf: 'listen',
      collection: 'Special Programs',
      description: `${DEMO}\n\nSample Special Programs collection (includes addresses).`,
      topics: ['Society', 'Africa & Development'],
      programId: special?.id,
      personId: hostId,
      featured: false,
      audio: true,
    },
    {
      title: 'Watch · Leadership Lecture: Responsibility',
      slug: 'demo-watch-leadership-lecture',
      shelf: 'watch',
      collection: 'Leadership Lectures',
      description: `${DEMO}\n\nSample Watch · Leadership Lectures collection.`,
      topics: ['Leadership', 'Character'],
      programId: leadership?.id,
      personId: amaId,
      featured: false,
      video: true,
    },
    {
      title: 'Watch · Excellence Lecture: Integrity',
      slug: 'demo-watch-excellence-lecture',
      shelf: 'watch',
      collection: 'Excellence Lectures',
      description: `${DEMO}\n\nSample Watch · Excellence Lectures collection.`,
      topics: ['Excellence', 'Character'],
      programId: excellence?.id,
      personId: nanaId,
      featured: true,
      video: true,
    },
    {
      title: 'Conference Highlight: Opening Keynote',
      slug: 'demo-watch-conference-keynote',
      shelf: 'watch',
      collection: 'Conferences & Events',
      description: `${DEMO}\n\nSample Conferences & Events watch item from a multi-day gathering.`,
      topics: ['Leadership', 'Society'],
      programId: leadership?.id,
      personId: amaId,
      featured: true,
      video: true,
    },
    {
      title: 'Conference Highlight: Closing Charge',
      slug: 'demo-watch-conference-closing',
      shelf: 'watch',
      collection: 'Conferences & Events',
      description: `${DEMO}\n\nSecond Conferences & Events sample for filter coverage.`,
      topics: ['Leadership', 'Excellence'],
      programId: leadership?.id,
      personId: hostId,
      featured: false,
      video: true,
    },
    {
      title: 'Special Program Film: A Day of Service',
      slug: 'demo-watch-special-program',
      shelf: 'watch',
      collection: 'Special Programs',
      description: `${DEMO}\n\nSample Special Programs collection on Watch.`,
      topics: ['Society', 'Personal Growth'],
      programId: special?.id,
      personId: hostId,
      featured: false,
      video: true,
    },
    {
      title: 'Recommended Reading Preview: On Character',
      slug: 'demo-read-recommended-character',
      shelf: 'read',
      collection: 'Recommended Reading',
      description: `${DEMO}\n\nSample Recommended Reading (books) — distinct from Insights “recommended articles.”`,
      topics: ['Character', 'Leadership'],
      programId: leadership?.id,
      personId: amaId,
      featured: true,
      body: `${DEMO}\n\nReplace with a short note on a real book ANANSE recommends.`,
    },
    {
      title: 'Publication Preview: Notes on Excellence',
      slug: 'demo-read-publication-excellence',
      shelf: 'read',
      collection: 'Publications',
      description: `${DEMO}\n\nSample Publications collection item for the Read shelf.`,
      topics: ['Excellence', 'Education'],
      programId: excellence?.id,
      personId: nanaId,
      featured: false,
      body: `${DEMO}\n\nReplace with a real ANANSE publication excerpt.`,
    },
    {
      title: 'Study Material Preview: Mentoring Covenant',
      slug: 'demo-read-study-mentoring-covenant',
      shelf: 'read',
      collection: 'Study Materials',
      description: `${DEMO}\n\nSample Study Materials item — a short covenant outline for mentors and mentees.`,
      topics: ['Mentorship', 'Character'],
      programId: mentorship?.id,
      personId: kwesiId,
      featured: false,
      body: `${DEMO}\n\nReplace with real study material.`,
    },
    {
      title: 'Wisdom Nugget: A Quiet Word for the Week',
      slug: 'demo-read-wisdom-nugget-quiet-word',
      shelf: 'read',
      collection: 'Wisdom Nuggets',
      description: `${DEMO}\n\nSample Wisdom Nuggets card — a short saying, a Scripture theme, and a prompt for further study.`,
      topics: ['Personal Growth', 'Faith & Life'],
      programId: midday?.id,
      personId: hostId,
      featured: false,
      wisdomNugget: 'A quiet word, practiced, outlasts a loud opinion.',
      scriptureTheme: 'Proverbs 15:1',
      furtherStudy: 'Keep this sentence somewhere you will see it this week. Notice one conversation it changes.',
      keywords: 'wisdom, proverb, everyday living',
      body: `${DEMO}\n\nReplace with a real ANANSE wisdom nugget. Keep it short enough to remember.`,
    },
    {
      title: 'Conversation Preview: Relationships That Last',
      slug: 'demo-listen-marriage-relationships',
      shelf: 'listen',
      collection: 'Interviews & Conversations',
      description: `${DEMO}\n\nSample Listen item so Marriage & Relationships has a library record beside its seminar.`,
      topics: ['Marriage & Relationships', 'Character'],
      programId: marriage?.id,
      personId: personIds['demo-akua-frimpong'],
      featured: false,
      audio: true,
    },
    {
      title: 'Conversation Preview: Music and Belonging',
      slug: 'demo-listen-music-culture',
      shelf: 'listen',
      collection: 'Interviews & Conversations',
      description: `${DEMO}\n\nSample Listen item so Music & Culture has a library record beside its gathering.`,
      topics: ['Music & Culture', 'Africa & Development'],
      programId: music?.id,
      personId: personIds['demo-grace-agyeman'],
      featured: false,
      audio: true,
    },
  ] as const

  for (const [index, item] of otherLibrary.entries()) {
    await prisma.libraryItem.upsert({
      where: { slug: item.slug },
      create: {
        title: item.title,
        slug: item.slug,
        description: item.description,
        shelf: item.shelf,
        collection: item.collection,
        body: 'body' in item ? item.body || item.description : item.description,
        topics: [...item.topics],
        wisdomNugget: 'wisdomNugget' in item ? item.wisdomNugget : '',
        scriptureTheme: 'scriptureTheme' in item ? item.scriptureTheme : '',
        furtherStudy: 'furtherStudy' in item ? item.furtherStudy : '',
        keywords: 'keywords' in item ? item.keywords : '',
        dateLabel: 'Preview sample',
        publishedAt: daysFromNow(-3 - index),
        programId: item.programId ?? null,
        personId: item.personId ?? null,
        coverMediaId: pick(index + 6),
        audioUrl: 'audio' in item && item.audio ? SAMPLE_AUDIO : '',
        videoUrl: 'video' in item && item.video ? SAMPLE_VIDEO : '',
        featured: item.featured,
        published: true,
        sortOrder: 20 + index,
      },
      update: {
        title: item.title,
        description: item.description,
        shelf: item.shelf,
        collection: item.collection,
        body: 'body' in item ? item.body || item.description : item.description,
        topics: [...item.topics],
        wisdomNugget: 'wisdomNugget' in item ? item.wisdomNugget : '',
        scriptureTheme: 'scriptureTheme' in item ? item.scriptureTheme : '',
        furtherStudy: 'furtherStudy' in item ? item.furtherStudy : '',
        keywords: 'keywords' in item ? item.keywords : '',
        featured: item.featured,
        published: true,
        audioUrl: 'audio' in item && item.audio ? SAMPLE_AUDIO : '',
        videoUrl: 'video' in item && item.video ? SAMPLE_VIDEO : '',
        coverMediaId: pick(index + 6),
        programId: item.programId ?? null,
        personId: item.personId ?? null,
      },
    })
  }

  const albums = [
    {
      title: 'Excellence Lecture Evening',
      slug: 'demo-album-excellence-evening',
      description: `${DEMO}\n\nSample album linked to a past gathering — shows Event → Photos.`,
      dateLabel: 'August 2026',
      place: 'Accra',
      collection: 'Lectures',
      programId: excellence?.id,
      eventId: eventIds['demo-excellence-lecture-character'],
      featured: true,
    },
    {
      title: 'Mentorship Cohort Gathering',
      slug: 'demo-album-mentorship-cohort',
      description: `${DEMO}\n\nSample Mentorship photo collection.`,
      dateLabel: 'July 2026',
      place: 'Accra',
      collection: 'Mentorship',
      programId: mentorship?.id,
      featured: false,
    },
    {
      title: 'Community Engagement Day',
      slug: 'demo-album-community-engagement',
      description: `${DEMO}\n\nSample Community Engagement album.`,
      dateLabel: 'June 2026',
      place: 'Greater Accra',
      collection: 'Community Engagement',
      featured: true,
    },
    {
      title: 'Historical Archive Preview',
      slug: 'demo-album-historical-archive',
      description: `${DEMO}\n\nSample Historical Archive collection for long-term institutional memory.`,
      dateLabel: 'Archive',
      place: 'Ghana',
      collection: 'Historical Archive',
      programId: sankofa?.id,
      featured: false,
    },
    {
      title: 'Leadership Conference Moments',
      slug: 'demo-album-conference-moments',
      description: `${DEMO}\n\nSample Conferences photo collection for gallery filters.`,
      dateLabel: 'December 2026',
      place: 'Accra',
      collection: 'Conferences',
      programId: leadership?.id,
      featured: true,
    },
    {
      title: 'Events Gallery Preview',
      slug: 'demo-album-events-gallery',
      description: `${DEMO}\n\nSample Events collection album.`,
      dateLabel: '2026',
      place: 'Accra',
      collection: 'Events',
      featured: false,
    },
    {
      title: 'People of ANANSE Preview',
      slug: 'demo-album-people',
      description: `${DEMO}\n\nSample People photo collection — portraits and gatherings.`,
      dateLabel: '2026',
      place: 'Ghana',
      collection: 'People',
      featured: false,
    },
    {
      title: 'Special Programs Gallery',
      slug: 'demo-album-special-programs',
      description: `${DEMO}\n\nSample Special Programs photo collection.`,
      dateLabel: '2026',
      place: 'Accra',
      collection: 'Special Programs',
      programId: special?.id,
      featured: false,
    },
    {
      title: 'Midday Reflection Gathering',
      slug: 'demo-album-midday-gathering',
      description: `${DEMO}\n\nSample album so Midday Reflection shows photographs beside its episodes.`,
      dateLabel: 'September 2026',
      place: 'Accra',
      collection: 'Lectures',
      programId: midday?.id,
      featured: false,
    },
    {
      title: 'Public Conversation Evening',
      slug: 'demo-album-public-conversation',
      description: `${DEMO}\n\nSample album for Public Lectures & Conversations.`,
      dateLabel: 'October 2026',
      place: 'Accra',
      collection: 'Lectures',
      programId: publicLectures?.id,
      featured: false,
    },
    {
      title: 'Marriage Seminar Tables',
      slug: 'demo-album-marriage-seminar',
      description: `${DEMO}\n\nSample album for the Marriage & Relationships seminar.`,
      dateLabel: 'November 2026',
      place: 'Accra',
      collection: 'Events',
      programId: marriage?.id,
      featured: false,
    },
    {
      title: 'Music and Culture Evening',
      slug: 'demo-album-music-culture',
      description: `${DEMO}\n\nSample album for Music & Culture. The linked gathering is the cancelled-state example.`,
      dateLabel: 'October 2026',
      place: 'Accra',
      collection: 'Events',
      programId: music?.id,
      featured: false,
    },
    {
      title: 'Healthy Living Day',
      slug: 'demo-album-healthy-living',
      description: `${DEMO}\n\nSample album for Healthy Living Day.`,
      dateLabel: 'November 2026',
      place: 'Accra',
      collection: 'Community Engagement',
      programId: healthy?.id,
      featured: false,
    },
  ] as const

  for (const [index, album] of albums.entries()) {
    const row = await prisma.photoAlbum.upsert({
      where: { slug: album.slug },
      create: {
        title: album.title,
        slug: album.slug,
        description: album.description,
        dateLabel: album.dateLabel,
        place: album.place,
        collection: album.collection,
        programId: album.programId ?? null,
        eventId: 'eventId' in album ? album.eventId || null : null,
        coverMediaId: pick(index + 2),
        featured: album.featured,
        published: true,
        sortOrder: index + 1,
      },
      update: {
        title: album.title,
        description: album.description,
        dateLabel: album.dateLabel,
        place: album.place,
        collection: album.collection,
        featured: album.featured,
        published: true,
        coverMediaId: pick(index + 2),
        programId: album.programId ?? null,
        eventId: 'eventId' in album ? album.eventId || null : null,
      },
    })

    await prisma.photoAlbumImage.deleteMany({ where: { albumId: row.id } })
    const imageCount = Math.min(6, Math.max(media.length, 1))
    for (let i = 0; i < imageCount; i += 1) {
      const mediaId = pick(index * 2 + i)
      if (!mediaId) continue
      await prisma.photoAlbumImage.create({
        data: {
          albumId: row.id,
          mediaId,
          caption: `Preview photograph ${i + 1} — replace with approved image`,
          sortOrder: i,
        },
      })
    }
  }

  const insights = [
    {
      title: 'A Conversation on Trustworthy Leadership',
      slug: 'demo-insight-conversation-trustworthy-leadership',
      excerpt:
        'What makes leadership trustworthy? A conversation-style reflection on character, competence, and the courage to serve.',
      body: `${DEMO}

What makes leadership trustworthy?

Character — the integrity that makes people safe in our presence.
Competence — the skill that makes our responsibility effective.
Courage — the willingness to do what is right when it costs.

This conversation-style insight is a layout sample for the Conversations filter. Replace it with a real ANANSE dialogue transcript or written exchange.`,
      contentType: 'Conversations',
      topics: ['Leadership', 'Character', 'Personal Growth'],
      featured: true,
      sortOrder: 20,
    },
    {
      title: 'Mentors and Mentees: A Shared Table',
      slug: 'demo-insight-conversation-shared-table',
      excerpt:
        'Mentoring is not a transaction. It is a shared table where wisdom, questions, and responsibility meet.',
      body: `${DEMO}

Mentoring is not a transaction. It is a shared table.

At the table: stories, questions, correction, encouragement, and the slow work of becoming people who can be trusted with influence.

Replace this Conversations sample with a real ANANSE mentoring dialogue.`,
      contentType: 'Conversations',
      topics: ['Mentorship', 'Character', 'Education'],
      featured: false,
      sortOrder: 21,
    },
    {
      title: 'Africa, Excellence, and the Long View',
      slug: 'demo-insight-perspective-africa-excellence',
      excerpt:
        'A perspective on cultivating excellence that is rooted in African contexts and open to the world.',
      body: `${DEMO}

Excellence is not imitation. It is faithfulness to a calling with the best of our gifts, culture, and courage.

This Perspectives sample fills the filter for layout review. Replace with a real ANANSE perspective piece.`,
      contentType: 'Perspectives',
      topics: ['Africa & Development', 'Excellence', 'Society'],
      featured: false,
      sortOrder: 22,
    },
    {
      title: 'Special Reflection: When Influence Is a Trust',
      slug: 'demo-insight-special-influence-trust',
      excerpt:
        'Influence is never neutral. A short special reflection on stewardship of platform, voice, and opportunity.',
      body: `${DEMO}

Influence is a trust. Platforms amplify both wisdom and folly. This Special Reflections sample is for layout only — replace with approved ANANSE writing.`,
      contentType: 'Special Reflections',
      topics: ['Leadership', 'Character', 'Society'],
      featured: false,
      sortOrder: 23,
    },
    {
      title: 'Essay: Learning That Forms the Whole Person',
      slug: 'demo-insight-essay-whole-person',
      excerpt:
        'Education that only informs leaves people unfinished. Formation requires character, practice, and service.',
      body: `${DEMO}

Learn. Develop. Serve.

These three movements describe an education of the whole person — mind, character, and responsibility. Replace this Essays sample with real ANANSE writing.`,
      contentType: 'Essays',
      topics: ['Education', 'Character', 'Personal Growth'],
      featured: false,
      sortOrder: 24,
    },
    {
      title: 'Article: Five Marks of Responsible Influence',
      slug: 'demo-insight-article-five-marks',
      excerpt:
        'A practical article outlining five marks of influence that serves — clarity, integrity, competence, humility, and courage.',
      body: `${DEMO}

Five marks of responsible influence:

1. Clarity of purpose
2. Integrity of character
3. Competence in craft
4. Humility in learning
5. Courage in service

Replace this Articles sample with a real ANANSE article.`,
      contentType: 'Articles',
      topics: ['Leadership', 'Excellence', 'Character'],
      featured: false,
      sortOrder: 25,
    },
    {
      title: 'Leadership Reflection: Faith That Stays Quiet',
      slug: 'demo-insight-reflection-quiet-faith',
      excerpt:
        'A short leadership reflection on authentic spirituality — faith practiced in ordinary work, without performance.',
      body: `${DEMO}

Authentic spirituality is recognized by fruit, not by volume.

This Leadership Reflections sample fills that Insights type and the Authentic Spirituality topic. Replace it with approved ANANSE writing.`,
      contentType: 'Leadership Reflections',
      topics: ['Authentic Spirituality', 'Personal Growth'],
      author: 'Rev. Kofi Asante',
      featured: false,
      sortOrder: 26,
    },
    {
      title: 'Faith and the Work of Ordinary Days',
      slug: 'demo-insight-faith-ordinary-work',
      excerpt:
        'A preview essay on faith and life: how belief shows up in meetings, meals, and the duties no one applauds.',
      body: `${DEMO}

Faith and life are one conversation. This Essays sample exists so the Faith & Life topic has a card. Replace it with a real ANANSE reflection.`,
      contentType: 'Essays',
      topics: ['Faith & Life', 'Character'],
      author: 'Samuel Koranteng-Pipim',
      featured: false,
      sortOrder: 27,
    },
    {
      title: 'A Conversation on Marriage and Shared Life',
      slug: 'demo-insight-conversation-shared-life',
      excerpt:
        'A conversation-style preview on marriage and relationships — partnership, patience, and the work of staying.',
      body: `${DEMO}

Marriage and close relationships are a school of character. This Conversations sample fills the Marriage & Relationships topic. Replace it with a real ANANSE dialogue.`,
      contentType: 'Conversations',
      topics: ['Marriage & Relationships', 'Character'],
      author: 'Akua Frimpong',
      featured: false,
      sortOrder: 28,
    },
    {
      title: 'Perspective: Music, Culture, and Belonging',
      slug: 'demo-insight-perspective-music-culture',
      excerpt:
        'A perspective on music and culture as memory, identity, and a way a community learns who it is.',
      body: `${DEMO}

Culture carries memory. Music carries culture into the room. This Perspectives sample fills the Music & Culture topic. Replace it with real ANANSE writing.`,
      contentType: 'Perspectives',
      topics: ['Music & Culture', 'Africa & Development'],
      author: 'Grace Agyeman',
      featured: false,
      sortOrder: 29,
    },
    {
      title: 'Special Reflection: Stewardship of Health',
      slug: 'demo-insight-special-healthy-living',
      excerpt:
        'A short special reflection on healthy living as stewardship — body, rest, and the strength to serve.',
      body: `${DEMO}

Healthy living is part of leadership, not a side interest. This Special Reflections sample fills the Healthy Living topic. Replace it with approved ANANSE writing.`,
      contentType: 'Special Reflections',
      topics: ['Healthy Living', 'Personal Growth'],
      author: 'Adwoa Darko',
      featured: false,
      sortOrder: 30,
    },
    {
      title: 'Perspective: Questions That Deserve a Longer Conversation',
      slug: 'demo-insight-perspective-public-questions',
      excerpt:
        'A preview perspective for Public Lectures & Conversations — why some questions need a room, not a headline.',
      body: `${DEMO}

Some questions deserve more than a quick answer. This Perspectives sample fills Public Lectures & Conversations. Replace it with a real ANANSE piece.`,
      contentType: 'Perspectives',
      topics: ['Society', 'Leadership'],
      author: 'Rev. Kofi Asante',
      featured: false,
      sortOrder: 31,
    },
    {
      title: 'Leadership Reflection: Peacemaking as Memory',
      slug: 'demo-insight-reflection-sankofa-peacemaking',
      excerpt:
        'A preview reflection for Sankofa ADR — looking back to the ways communities made peace, then practicing that wisdom now.',
      body: `${DEMO}

Sankofa ADR looks back in order to move forward. This Leadership Reflections sample fills that program. Replace it with approved ANANSE writing.`,
      contentType: 'Leadership Reflections',
      topics: ['Africa & Development', 'Society'],
      author: 'Issa Traoré',
      featured: false,
      sortOrder: 32,
    },
    {
      title: 'Article: When a Need Does Not Fit a Program',
      slug: 'demo-insight-article-special-initiative',
      excerpt:
        'A preview article for Special Initiatives — identify a need, shape a response, and invite people to serve.',
      body: `${DEMO}

Not every need fits an existing program. This Articles sample shows how a special initiative can still have writing beside it. Replace it with real ANANSE writing.`,
      contentType: 'Articles',
      topics: ['Society', 'Personal Growth'],
      author: 'Mariam Sulemana',
      featured: false,
      sortOrder: 33,
    },
  ] as const

  for (const [index, insight] of insights.entries()) {
    await prisma.newsPost.upsert({
      where: { slug: insight.slug },
      create: {
        title: insight.title,
        slug: insight.slug,
        excerpt: insight.excerpt,
        body: insight.body,
        dateLabel: 'Institutional reflection',
        author: 'author' in insight ? insight.author : 'ANANSE Center',
        category: insight.contentType,
        contentType: insight.contentType,
        topics: [...insight.topics],
        featured: insight.featured,
        showInLibraryRead: true,
        published: true,
        sortOrder: insight.sortOrder,
        coverMediaId: pick(index + 10),
      },
      update: {
        title: insight.title,
        excerpt: insight.excerpt,
        body: insight.body,
        author: 'author' in insight ? insight.author : 'ANANSE Center',
        category: insight.contentType,
        contentType: insight.contentType,
        topics: [...insight.topics],
        featured: insight.featured,
        showInLibraryRead: true,
        published: true,
        sortOrder: insight.sortOrder,
        coverMediaId: pick(index + 10),
      },
    })
  }

  const speakerLinks: { eventSlug: string; personId?: string; role: string }[] = [
    { eventSlug: 'demo-excellence-lecture-character', personId: nanaId, role: 'Speaker' },
    { eventSlug: 'demo-excellence-lecture-courage-serve', personId: nanaId, role: 'Speaker' },
    { eventSlug: 'demo-midday-live-gathering', personId: hostId, role: 'Host' },
    { eventSlug: 'demo-mentorship-orientation', personId: kwesiId, role: 'Mentor' },
    { eventSlug: 'demo-mentorship-circle-emerging', personId: kwesiId, role: 'Mentor' },
    { eventSlug: 'demo-conference-leadership-2026', personId: amaId, role: 'Speaker' },
    { eventSlug: 'demo-leadership-intensive-past', personId: amaId, role: 'Speaker' },
    { eventSlug: 'demo-conversation-character-public-life', personId: hostId, role: 'Speaker' },
    { eventSlug: 'demo-seminar-wise-decisions', personId: amaId, role: 'Speaker' },
    { eventSlug: 'demo-sankofa-adr-workshop', personId: personIds['demo-issa-traore'], role: 'Speaker' },
    { eventSlug: 'demo-marriage-relationships-seminar', personId: personIds['demo-akua-frimpong'], role: 'Speaker' },
    { eventSlug: 'demo-music-culture-cancelled', personId: personIds['demo-grace-agyeman'], role: 'Speaker' },
    { eventSlug: 'demo-special-healthy-living-day', personId: personIds['demo-adwoa-darko'], role: 'Speaker' },
    { eventSlug: 'demo-special-initiative-service-day', personId: personIds['demo-mariam-sulemana'], role: 'Host' },
    {
      eventSlug: 'demo-conversation-across-generations',
      personId: personIds['demo-kofi-asante'],
      role: 'Speaker',
    },
    { eventSlug: 'demo-workshop-habits-excellence', personId: nanaId, role: 'Speaker' },
    { eventSlug: 'demo-faith-everyday-leadership', personId: personIds['demo-kofi-asante'], role: 'Speaker' },
    { eventSlug: 'demo-conference-mentorship-track', personId: kwesiId, role: 'Mentor' },
    { eventSlug: 'demo-leadership-intensive-past', personId: personIds['demo-yaw-ofori'], role: 'Fellow' },
    { eventSlug: 'demo-mentorship-circle-emerging', personId: personIds['demo-efua-mensima'], role: 'Fellow' },
    { eventSlug: 'demo-excellence-lecture-character', personId: personIds['demo-kwabena-osei'], role: 'Participant' },
  ]
  for (const link of speakerLinks) {
    const eventId = eventIds[link.eventSlug]
    if (!eventId || !link.personId) continue
    await prisma.eventSpeaker.upsert({
      where: { eventId_personId: { eventId, personId: link.personId } },
      create: { eventId, personId: link.personId, role: link.role },
      update: { role: link.role },
    })
  }

  const programLinks: { personId?: string; programId?: string }[] = [
    { personId: hostId, programId: midday?.id },
    { personId: amaId, programId: leadership?.id },
    { personId: kwesiId, programId: mentorship?.id },
    { personId: nanaId, programId: excellence?.id },
    { personId: personIds['demo-issa-traore'], programId: sankofa?.id },
    { personId: personIds['demo-akua-frimpong'], programId: marriage?.id },
    { personId: personIds['demo-grace-agyeman'], programId: music?.id },
    { personId: personIds['demo-adwoa-darko'], programId: healthy?.id },
    { personId: personIds['demo-kofi-asante'], programId: publicLectures?.id },
    { personId: personIds['demo-mariam-sulemana'], programId: special?.id },
    { personId: personIds['demo-yaw-ofori'], programId: leadership?.id },
    { personId: personIds['demo-abena-owusu'], programId: mentorship?.id },
    { personId: personIds['demo-kojo-addae'], programId: sankofa?.id },
    { personId: personIds['demo-efua-mensima'], programId: mentorship?.id },
    { personId: personIds['demo-akosua-mensah'], programId: leadership?.id },
    { personId: personIds['demo-daniel-boateng'], programId: mentorship?.id },
    { personId: personIds['demo-kwabena-osei'], programId: excellence?.id },
  ]
  for (const link of programLinks) {
    if (!link.personId || !link.programId) continue
    await prisma.personProgram.upsert({
      where: { personId_programId: { personId: link.personId, programId: link.programId } },
      create: { personId: link.personId, programId: link.programId },
      update: {},
    })
  }

  const insightLinks: { slug: string; programId?: string; authorPersonId?: string }[] = [
    {
      slug: 'demo-insight-conversation-trustworthy-leadership',
      programId: leadership?.id,
      authorPersonId: amaId,
    },
    {
      slug: 'demo-insight-conversation-shared-table',
      programId: mentorship?.id,
      authorPersonId: kwesiId,
    },
    {
      slug: 'demo-insight-perspective-africa-excellence',
      programId: excellence?.id,
      authorPersonId: nanaId,
    },
    {
      slug: 'demo-insight-special-influence-trust',
      programId: leadership?.id,
      authorPersonId: hostId,
    },
    {
      slug: 'demo-insight-essay-whole-person',
      programId: leadership?.id,
      authorPersonId: amaId,
    },
    {
      slug: 'demo-insight-article-five-marks',
      programId: excellence?.id,
      authorPersonId: nanaId,
    },
    {
      slug: 'demo-insight-reflection-quiet-faith',
      programId: midday?.id,
      authorPersonId: personIds['demo-kofi-asante'],
    },
    {
      slug: 'demo-insight-faith-ordinary-work',
      programId: midday?.id,
      authorPersonId: hostId,
    },
    {
      slug: 'demo-insight-conversation-shared-life',
      programId: marriage?.id,
      authorPersonId: personIds['demo-akua-frimpong'],
    },
    {
      slug: 'demo-insight-perspective-music-culture',
      programId: music?.id,
      authorPersonId: personIds['demo-grace-agyeman'],
    },
    {
      slug: 'demo-insight-special-healthy-living',
      programId: healthy?.id,
      authorPersonId: personIds['demo-adwoa-darko'],
    },
    {
      slug: 'demo-insight-perspective-public-questions',
      programId: publicLectures?.id,
      authorPersonId: personIds['demo-kofi-asante'],
    },
    {
      slug: 'demo-insight-reflection-sankofa-peacemaking',
      programId: sankofa?.id,
      authorPersonId: personIds['demo-issa-traore'],
    },
    {
      slug: 'demo-insight-article-special-initiative',
      programId: special?.id,
      authorPersonId: personIds['demo-mariam-sulemana'],
    },
  ]
  for (const link of insightLinks) {
    if (!link.programId && !link.authorPersonId) continue
    await prisma.newsPost.update({
      where: { slug: link.slug },
      data: {
        ...(link.programId ? { programId: link.programId } : {}),
        ...(link.authorPersonId ? { authorPersonId: link.authorPersonId } : {}),
      },
    })
  }

  const libraryEventLinks: { slug: string; eventSlug: string }[] = [
    { slug: 'demo-listen-excellence-integrity', eventSlug: 'demo-excellence-lecture-character' },
    { slug: 'demo-watch-conference-keynote', eventSlug: 'demo-conference-leadership-2026' },
    { slug: 'demo-listen-sankofa-address', eventSlug: 'demo-sankofa-adr-workshop' },
    { slug: 'demo-watch-mentorship-session', eventSlug: 'demo-mentorship-circle-emerging' },
  ]
  for (const link of libraryEventLinks) {
    const eventId = eventIds[link.eventSlug]
    if (!eventId) continue
    await prisma.libraryItem.update({
      where: { slug: link.slug },
      data: { eventId },
    })
  }

  console.log(
    `Demo handover seeded: ${people.length} people, ${events.length} events, ${middayEpisodes.length} Midday episodes, ${otherLibrary.length} other library items, ${insights.length} insights, ${albums.length} albums (${media.length} media files). Replace all demo-* records with real ANANSE data.`,
  )
}

const isDirectRun = process.argv[1]?.includes('seed-demo-preview')
if (isDirectRun) {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  try {
    await seedDemoPreviewContent(prisma)
  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}
