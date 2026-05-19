import Image from 'next/image'
import Link from 'next/link'
import {
  Sprout,
  Users,
  Globe,
  Heart,
  Scale,
  Building2,
  UserCircle,
  Bird,
  BookOpen,
  Music,
  Salad,
  Sun,
  GraduationCap,
  Palette,
  Drum,
  BookMarked,
  Network,
  type LucideIcon,
} from 'lucide-react'
import HeroPremium from '../../components/HeroPremium'
import FeatureIcon from '../../components/FeatureIcon'
import EventTypeIcon from '../../components/EventTypeIcon'
import { cardImageSizes, images } from '../../lib/images'
import { getFeaturedEventsForHome } from '../../lib/featured-events'
import { getContentValue } from '../../lib/site-content'

const strategicGoals: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Sprout,
    title: 'Value-Based Leadership',
    description:
      'Developing youth entrepreneurs and innovators grounded in African values and community responsibility.',
  },
  {
    icon: Users,
    title: 'Service to Community',
    description:
      'Reorienting young people toward service, self-sufficiency, and the spirit of Ubuntu.',
  },
  {
    icon: Globe,
    title: 'Pan-Africanism',
    description:
      'Aligning leadership with AU Agenda 2063 — building dignity and unity across the continent.',
  },
  {
    icon: Heart,
    title: 'Holistic Health & Wellness',
    description:
      'NEWSTART-informed programs for mind, body, and spirit — rooted in cultural wisdom.',
  },
  {
    icon: Scale,
    title: 'Peace & Conflict Resolution',
    description:
      'Blending traditional African adjudication with modern methods for lasting community peace.',
  },
  {
    icon: Building2,
    title: 'Organizational Excellence',
    description:
      'A credible, well-resourced center led by professionals committed to the mission.',
  },
]

const programs: { icon: LucideIcon; title: string; description: string; href: string }[] = [
  {
    icon: UserCircle,
    title: 'Sankofa Mentorship',
    description: 'Emerging leaders paired with mentors for culturally grounded leadership.',
    href: '/programs',
  },
  {
    icon: Bird,
    title: 'Sankofa Mediation',
    description: 'Conflict resolution blending tradition and modern practice.',
    href: '/programs',
  },
  {
    icon: BookOpen,
    title: 'Sankofa Resources',
    description: 'African-centered education, research, and learning archives.',
    href: '/programs',
  },
  {
    icon: Music,
    title: 'Sankofa Music',
    description: 'Community building through music, rhythm, and shared celebration.',
    href: '/programs',
  },
  {
    icon: Salad,
    title: 'Sankofa Kitchen & Health',
    description: 'Nutrition and wellness workshops grounded in NEWSTART principles.',
    href: '/programs',
  },
  {
    icon: Sun,
    title: 'Sankofa Sabbath & Volunteering',
    description: 'Rest, renewal, and service-learning for purposeful living.',
    href: '/programs',
  },
]

const impactStories = [
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

const sectors: { icon: LucideIcon; name: string }[] = [
  { icon: GraduationCap, name: 'Education & Leadership' },
  { icon: Heart, name: 'Healthcare & Wellness' },
  { icon: Scale, name: 'Legal & Mediation' },
  { icon: Palette, name: 'Arts, Culture & Music' },
  { icon: Sprout, name: 'Agriculture & Food' },
  { icon: Network, name: 'Community & Service' },
]

export default async function Home() {
  const [heroLead, featuredEvents] = await Promise.all([
    getContentValue(
      'home.hero.lead',
      'Preserving heritage, restoring identity, and developing the next generation of Pan-African leaders through Sankofa arts and culture programs in Ghana and across the diaspora.',
    ),
    getFeaturedEventsForHome(),
  ])

  return (
    <div>
      <HeroPremium lead={heroLead} />

      <section id="our-story" className="page-section bg-white">
        <div className="page-section-container">
          <div className="two-col-section">
            <div>
              <span className="section-badge">Our Story</span>
              <h2 className="page-section-heading">The Ananse Story</h2>
              <div className="page-body-stack">
                <p className="page-body-text">
                  In Akan tradition, Ananse the spider weaves webs that connect generations — stories
                  that heal, teach, and unite.
                </p>
                <p className="page-body-text">
                  Our center is a gathering place where ancestral wisdom meets contemporary
                  creativity: for students finding pathways to heritage, for the diaspora returning
                  home, and for communities celebrating who we are.
                </p>
              </div>
              <Link href="/about" className="btn-primary page-inline-cta">
                Read Our Mission
              </Link>
            </div>
            <div className="about-visual-card">
              <div className="about-visual-grid">
                {[
                  { icon: Network, label: 'Cultural Weaving', sub: 'Connecting generations' },
                  { icon: Sprout, label: 'Identity Restored', sub: 'Roots rediscovered' },
                  { icon: Users, label: 'Community Built', sub: 'Ubuntu in practice' },
                  { icon: Globe, label: 'Africa-Wide Reach', sub: '15+ communities' },
                ].map((item) => (
                  <div key={item.label} className="about-mini-card">
                    <FeatureIcon icon={item.icon} variant="gold" />
                    <p className="about-mini-label">{item.label}</p>
                    <p className="about-mini-sub">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section page-section--muted">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">Strategic Goals</span>
            <h2 className="page-section-heading">Six Pillars of Transformation</h2>
            <p className="page-body-text">
              Interconnected commitments that guide every program, partnership, and community
              initiative we undertake.
            </p>
          </div>
          <div className="grid-cards">
            {strategicGoals.map((goal, idx) => (
              <article key={goal.title} className="premium-card">
                <div className="premium-card-image-wrapper">
                  <Image
                    src={images.goals[idx]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes={cardImageSizes}
                  />
                </div>
                <div className="premium-card-header">
                  <div className="premium-card-icon-box">
                    <goal.icon size={22} strokeWidth={1.75} />
                  </div>
                </div>
                <h3 className="premium-card-title">{goal.title}</h3>
                <p className="premium-card-description">{goal.description}</p>
                <Link href="/about" className="btn-secondary premium-card-cta">
                  Our approach
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section bg-white">
        <div className="page-section-container">
          <div className="section-header-split">
            <div>
              <span className="section-badge">Sankofa Programs</span>
              <h2 className="page-section-heading">Programs That Transform</h2>
              <p className="page-body-text">
                Six flagship initiatives developing whole persons — spiritually, academically, and
                as community leaders.
              </p>
            </div>
            <Link href="/programs" className="btn-outline page-section-cta-link">
              View all programs →
            </Link>
          </div>
          <div className="grid-cards">
            {programs.map((prog, idx) => (
              <article key={prog.title} className="premium-card">
                <div className="premium-card-image-wrapper">
                  <Image
                    src={images.programs[idx]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes={cardImageSizes}
                  />
                </div>
                <div className="premium-card-header">
                  <div className="premium-card-icon-box">
                    <prog.icon size={22} strokeWidth={1.75} />
                  </div>
                  <span className="premium-card-featured-label">Sankofa</span>
                </div>
                <h3 className="premium-card-title">{prog.title}</h3>
                <p className="premium-card-description">{prog.description}</p>
                <Link href={prog.href} className="btn-primary premium-card-cta">
                  Program details
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section page-section--muted">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">Gatherings</span>
            <h2 className="page-section-heading">Upcoming Events</h2>
            <p className="page-body-text">
              Festivals, workshops, and retreats that bring our mission to life across Ghana.
            </p>
          </div>
          <div className="grid-cards">
            {featuredEvents.map((event) => (
              <article key={event.slug} className="premium-card">
                <div className="premium-card-image-wrapper">
                  <Image src={event.image} alt={event.title} fill className="object-cover" sizes={cardImageSizes} />
                </div>
                <div className="premium-card-header">
                  <EventTypeIcon type={event.type} />
                  <span className="premium-card-featured-label">{event.type}</span>
                </div>
                <h3 className="premium-card-title">{event.title}</h3>
                <div className="premium-card-meta">
                  <span className="premium-card-date">{event.date}</span>
                  <span className="text-slate-300">·</span>
                  <span className="premium-card-location">{event.location}</span>
                </div>
                <p className="premium-card-description">{event.description}</p>
                <Link href={`/events/${event.slug}`} className="btn-primary premium-card-cta">
                  Event details
                </Link>
              </article>
            ))}
          </div>
          <p className="text-center" style={{ marginTop: '2.5rem' }}>
            <Link href="/events" className="btn-outline">
              View full calendar
            </Link>
          </p>
        </div>
      </section>

      <section className="page-section bg-white">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">Impact</span>
            <h2 className="page-section-heading">Stories From Our Community</h2>
            <p className="page-body-text">
              Voices from participants, alumni, and partners — the human face of our work.
            </p>
          </div>
          <div className="grid-cards">
            {impactStories.map((story) => (
              <div key={story.name} className="testimonial-card">
                <span className="insight-card-tag">{story.tag}</span>
                <div className="testimonial-quote-mark">&ldquo;</div>
                <p className="testimonial-text">{story.quote}</p>
                <div className="testimonial-footer">
                  <div className="testimonial-avatar" aria-hidden>
                    {story.name.charAt(0)}
                  </div>
                  <p className="testimonial-name">{story.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section page-section--muted">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">Sectors We Serve</span>
            <h2 className="page-section-heading">Where We Work</h2>
            <p className="page-body-text">
              Bridging disciplines with one mission: dignity, development, and cultural excellence.
            </p>
          </div>
          <div className="grid-sectors sectors-grid">
            {sectors.map((ind) => (
              <div key={ind.name} className="sector-card">
                <FeatureIcon icon={ind.icon} variant="gold" size={22} />
                <p className="sector-name">{ind.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-cta-section">
        <div className="page-section-container page-cta-inner">
          <h2 className="page-cta-heading">Begin Your Journey With Us</h2>
          <p className="page-cta-body">
            Whether you seek programs, partnership, or a way to give back — there is a place for you
            at our table.
          </p>
          <div className="page-cta-buttons">
            <Link href="/programs" className="btn-primary page-cta-btn">
              Explore Programs
            </Link>
            <Link href="/contact#form" className="btn-outline-white page-cta-btn">
              Get in Touch
            </Link>
            <Link href="/support" className="btn-outline-white page-cta-btn">
              Donate Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
