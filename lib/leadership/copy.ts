export const SITE_PUBLIC_NAME = 'ANANSE Center for Leadership Development'

export const HOME_HERO = {
  line1: 'Developing people. Transforming lives.',
  accent: 'Strengthening communities.',
  lead:
    'ANANSE Center for Leadership Development exists to help people develop the character, wisdom, competence, and purpose needed to lead well and make a meaningful difference in their families, professions, communities, and society.',
  trust: 'Leadership. Character. Excellence. Service.',
  primary: { label: 'Explore ANANSE', href: '/about' },
  secondary: { label: 'Explore our programs', href: '/programs' },
  stats: [
    { value: 'Character', label: 'Integrity, responsibility, courage' },
    { value: 'Wisdom', label: 'Judgment for what matters' },
    { value: 'Competence', label: 'Knowledge, skill, excellence' },
    { value: 'Service', label: 'Influence used for others' },
  ],
}

export const HOME_WELCOME = {
  heading: 'Leadership is more than position.',
  paragraphs: [
    'Leadership is character in action. It is responsibility, influence, wisdom, and service.',
    'At ANANSE, we believe that developing effective leaders requires more than teaching skills. It requires developing the whole person—strengthening character, deepening understanding, nurturing authentic spirituality, encouraging excellence, and equipping people to respond creatively to the challenges around them.',
    "We bring people together through education, mentorship, lectures, conversations, publications, and practical initiatives designed to add value to people's lives.",
  ],
}

export const HOME_PROGRAMS_INTRO = {
  heading: 'Our programs',
  lead: 'Developing people for life, leadership, and service.',
  body: 'ANANSE brings together a range of programs designed to develop people intellectually, personally, professionally, relationally, and spiritually.',
}

export const HOME_MIDDAY = {
  heading: 'Midday Reflection',
  kicker: 'Discovering wisdom for everyday living.',
  paragraphs: [
    'A weekly conversation about Scripture, wisdom, character, relationships, leadership, faith, and everyday life.',
    'Midday Reflection invites us to slow down, think deeply, and discover wisdom for the journey of life.',
    "An invitation to linger over God's Word until its wisdom becomes part of our lives.",
  ],
  empty:
    'A new episode will appear here when it is published. The archive of episodes will be kept in the Library.',
  weekly:
    'A new Midday Reflection is added regularly. Follow the series and join the conversation as we continue discovering wisdom for everyday living.',
}

export const HOME_WHATS_NEW = {
  heading: 'Latest from ANANSE',
  lead: 'Ideas. Conversations. Opportunities.',
  body: 'Stay connected with what is happening across the ANANSE community. Items appear here when they are published.',
  slots: [
    { title: 'Latest audio', body: 'A reflection, lecture, conversation, or special program will be listed when it is ready to hear.' },
    { title: 'Latest video', body: 'A lecture, interview, event, or program will be listed when it is ready to watch.' },
    { title: 'Latest insight', body: 'An article, reflection, or Wisdom Nugget will be listed when it is ready to read.' },
    { title: 'Upcoming event', body: 'A lecture, seminar, conversation, or special program will be listed when it is scheduled.' },
  ],
}

export {
  INSIGHT_TOPICS,
  PEOPLE_GROUPS,
  LIBRARY_SHELVES,
  PHOTO_COLLECTIONS,
  INSIGHT_CONTENT_TYPES,
} from './taxonomy'

/** Photo Gallery shelf for the Library opening page (albums live separately). */
export const LIBRARY_PHOTO_SHELF = {
  title: 'Photo Gallery',
  items: [
    'Events',
    'Lectures',
    'Conferences',
    'Mentorship',
    'People',
    'Community Engagement',
    'Special Programs',
    'Historical Archive',
  ],
} as const


export const HOME_INSIGHTS = {
  heading: 'ANANSE Insights',
  kicker: 'Ideas for living, leading, and serving.',
  paragraphs: [
    'ANANSE Insights is a space for thoughtful ideas, reflections, perspectives, and conversations on the questions that shape our lives, our leadership, our communities, and our world.',
    'Here, we explore issues that matter—not simply to inform, but to encourage thoughtful reflection, meaningful dialogue, personal growth, and responsible action.',
    'Our aim is simple: to think deeply, to learn continually, to live wisely, to lead responsibly, and to serve meaningfully.',
  ],
  closing: 'Think. Reflect. Learn. Engage.',
}

export const LIBRARY_MASTER = {
  kicker: 'Ideas. Conversations. Wisdom.',
  lead:
    'The ANANSE Library is a growing collection of lectures, reflections, conversations, writings, videos, photographs, and other resources designed to inform, challenge, inspire, and equip.',
  body: 'Here you can listen, watch, read, explore, and discover ideas from across the ANANSE community. Whether you are looking for wisdom on leadership, a reflection for everyday living, a lecture on excellence, a conversation about relationships, an exploration of music and culture, or resources for personal growth, the ANANSE Library provides a place to begin.',
  closing: 'Explore. Learn. Reflect. Grow.',
}

export const HOME_WHY = {
  heading: 'Why ANANSE?',
  kicker: 'Wisdom. Resourcefulness. Practical solutions.',
  paragraphs: [
    'Ananse, the Ghanaian word for spider, is a familiar figure in Ghanaian folk stories. Ananse stories have traditionally been used to teach wisdom, practical skills, wit, resourcefulness, and creative problem-solving.',
    'The name ANANSE also represents: African Network & Advisory for Needed Services & Excellence.',
    'The name captures the spirit of what we seek to do: develop people, share wisdom, build practical capacity, and help address real challenges with creativity and purpose.',
    'ANANSE Center for Leadership Development is a subsidiary of EAGLESonline, an umbrella organization bringing together two centers of leadership development—the EAGLES Center and the ANANSE Center.',
    'EAGLES stands for: Empowerment & Advisory Group for Leadership, Excellence, & Service.',
  ],
}

export const HOME_PEOPLE = {
  heading: 'People',
  kicker: 'Leadership is about people.',
  paragraphs: [
    'ANANSE is a community of leaders, mentors, educators, professionals, speakers, partners, and emerging leaders committed to learning, growth, leadership, and service.',
    'Meet the people who contribute to the ANANSE journey and help make its work possible.',
  ],
}

export const GET_INVOLVED_PATHS = [
  {
    id: 'learn',
    title: 'Learn',
    body: 'Explore our lectures, reflections, writings, and educational resources.',
    href: '/programs',
    cta: 'Explore programs',
  },
  {
    id: 'attend',
    title: 'Attend',
    body: 'Join an upcoming program, lecture, seminar, or conversation.',
    href: '/events',
    cta: 'See events',
  },
  {
    id: 'mentor',
    title: 'Mentor',
    body: 'Share your experience, knowledge, and wisdom with emerging leaders. This is an expression of interest, not a guaranteed match.',
    href: '#mentor-form',
    cta: 'Offer to mentor',
  },
  {
    id: 'partner',
    title: 'Partner',
    body: 'Work with ANANSE to develop people and strengthen communities.',
    href: '#contact',
    cta: 'Write about a partnership',
  },
  {
    id: 'support',
    title: 'Support',
    body: 'Help create new opportunities for leadership development, learning, and service. Support is financial giving. It is separate from offering time, skill, resources, or opportunities.',
    href: '/support#donate',
    cta: 'Give',
  },
  {
    id: 'share',
    title: 'Share',
    body: 'Help others discover resources that can add value to their lives.',
    href: '#share',
    cta: 'Share ANANSE',
  },
] as const

export const ABOUT_JUMPS = [
  { id: 'who-we-are', label: 'Who We Are' },
  { id: 'the-ananse-story', label: 'The ANANSE Story' },
  { id: 'vision-mission', label: 'Vision & Mission' },
  { id: 'core-values', label: 'Core Values' },
  { id: 'eaglesonline', label: 'EAGLESonline' },
] as const

export const CORE_VALUES = [
  { title: 'Character', body: 'We value integrity, honesty, responsibility, and moral courage.' },
  { title: 'Excellence', body: 'We pursue quality, discipline, continuous improvement, and responsible stewardship of ability.' },
  { title: 'Wisdom', body: 'We value thoughtful reflection, sound judgment, experience, and the ability to discern what truly matters.' },
  { title: 'Authentic Spirituality', body: 'We value genuine inner transformation and a life grounded in authentic spiritual convictions.' },
  { title: 'Mentorship', body: 'We believe wisdom grows when generations learn from one another.' },
  { title: 'Service', body: 'We believe influence carries responsibility and that leadership should add value to the lives of others.' },
  { title: 'Lifelong Learning', body: 'We remain learners—curious, teachable, reflective, and willing to grow.' },
] as const

export const BELIEF_EMPHASES = [
  { title: 'Character', body: 'Integrity, responsibility, courage, humility, and trustworthiness.' },
  { title: 'Competence', body: 'Knowledge, skills, judgment, creativity, and the ability to perform with excellence.' },
  { title: 'Wisdom', body: 'The capacity to understand situations, discern what matters, and make responsible decisions.' },
  { title: 'Purpose', body: 'Knowing why we lead and understanding the responsibilities that accompany influence.' },
  { title: 'Service', body: 'Using leadership not merely for personal advancement, but to add value to the lives of others.' },
] as const

export const MISSION_DIMENSIONS = [
  { title: 'Leadership education', body: 'Providing knowledge, frameworks, and practical tools for effective leadership.' },
  { title: 'Mentoring', body: 'Connecting emerging leaders with people whose experience and wisdom can help guide their development.' },
  { title: 'Intellectual engagement', body: 'Encouraging thoughtful inquiry, critical thinking, conversation, and lifelong learning.' },
  { title: 'Authentic spirituality', body: 'Recognizing the importance of genuine inner transformation, values, meaning, and a life grounded in authentic spiritual convictions.' },
  { title: 'Practical service', body: 'Turning knowledge and influence into meaningful contribution and service to others.' },
] as const

export const WHO_WE_SERVE = [
  { title: 'Students', body: 'Helping students develop character, practical skills, leadership capacity, and a vision for purposeful living.' },
  { title: 'Young professionals', body: 'Providing opportunities for continued development, mentorship, professional growth, and meaningful contribution.' },
  { title: 'Emerging leaders', body: 'Equipping those preparing to assume greater responsibility and influence.' },
  { title: 'Institutions and organizations', body: 'Supporting organizations that seek to strengthen leadership, develop people, and build healthier institutional cultures.' },
  { title: 'Communities', body: 'Engaging with communities through educational, developmental, and practical initiatives.' },
] as const

export const LEARNING_BY_DOING = [
  'Think critically',
  'Solve problems creatively',
  'Develop practical skills',
  'Learn from experience',
  'Work collaboratively',
  'Receive and give mentorship',
  'Take responsibility',
  'Serve others',
  'Pursue excellence',
] as const

export const EVENTS_HERO = {
  title: { prefix: 'Events & ', accent: 'Gatherings' },
  lead: 'Lectures, seminars, conferences, workshops, mentorship gatherings, public conversations, and special programs. Each gathering keeps its page after the date, including registration while it is open.',
  primary: { label: 'See programs', href: '/programs' },
  secondary: { label: 'Get involved', href: '/get-involved' },
}

export const EVENTS_EMPTY =
  'No gatherings are listed yet. When ANANSE schedules a lecture, seminar, or conversation, it will appear here. Registration stays on the event page while it is open, and the page remains as a record after the date.'

export const INSIGHTS_EMPTY =
  'No insights are published yet. When ANANSE publishes an article, reflection, or essay, it will appear here. Topics are filters on this page, not separate menu items.'

export const PEOPLE_EMPTY =
  'No community profiles are published yet. People are listed only with permission. When a profile is ready, it will appear under the groups below.'

export const LIBRARY_EMPTY =
  'Nothing is in the Library yet. When lectures, episodes, readings, or other resources are published, they will appear on the shelves below.'

export const PHOTO_ALBUMS_EMPTY =
  'No photo albums are published yet. When galleries are ready, they will appear here by collection.'

export const SUPPORT_HERO = {
  title: { prefix: 'Support ', accent: 'the work' },
  lead: 'Help create new opportunities for leadership development, learning, and service. Support on this page is financial giving. Time, skill, resources, and opportunities are offered through Get Involved.',
  primary: { label: 'Give', href: '/support#donate' },
  secondary: { label: 'Other ways to take part', href: '/get-involved' },
}

export const SUPPORT_GIVING_NOTE =
  'Gifts are made through Paystack. Offering time, skill, resources, or opportunities is separate from giving and is handled under Get Involved.'

export const CONTACT_SUBJECTS = [
  'General inquiry',
  'Programs',
  'Attend an event',
  'Mentor — expression of interest',
  'Partnership',
  'Support / giving',
  'Share',
] as const
