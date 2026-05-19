import Link from 'next/link'
import Image from 'next/image'
import HeroSplit from '../../../components/HeroSplit'
import { cardImageSizes, images } from '../../../lib/images'
import type { LucideIcon } from 'lucide-react'
import { Globe, History, Palette, BookOpen, Sparkles, Globe2 } from 'lucide-react'

const philosophies: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: 'Ubuntu Philosophy',
    description:
      'I am because we are. We believe in the interconnectedness of all people and the importance of community in personal and cultural development.',
    icon: Globe,
  },
  {
    title: 'Sankofa Principle',
    description:
      'Go back and fetch it. We honor the wisdom of our ancestors while moving forward, understanding that the past holds keys to our future.',
    icon: History,
  },
  {
    title: 'Restorative Arts',
    description:
      'Art as healing. We use creative expression as a tool for personal healing, community restoration, and cultural reclamation.',
    icon: Palette,
  },
  {
    title: 'Intergenerational Wisdom',
    description:
      'Knowledge flows through generations. We create spaces where elders and youth learn from each other in both directions.',
    icon: BookOpen,
  },
  {
    title: 'Cultural Innovation',
    description:
      'Tradition meets tomorrow. We believe cultural practices should evolve and adapt while maintaining their essential spirit.',
    icon: Sparkles,
  },
  {
    title: 'Global Localism',
    description:
      'Rooted locally, connected globally. We celebrate local traditions while recognizing our place in a global community.',
    icon: Globe2,
  },
]

const approaches = [
  {
    num: "1",
    color: "#fff7ed",
    text: "#b45309",
    title: "Community-Led",
    desc: "Our programs are developed in partnership with the communities we serve, ensuring cultural authenticity and community ownership."
  },
  {
    num: "2",
    color: "#f0fdf4",
    text: "#15803d",
    title: "Holistic Development",
    desc: "We address the whole person—mind, body, and spirit—through integrated programs that combine arts, education, and wellness."
  },
  {
    num: "3",
    color: "#f8fafc",
    text: "#334155",
    title: "Intergenerational Connection",
    desc: "We create opportunities for knowledge exchange between generations, strengthening cultural continuity and mutual understanding."
  },
  {
    num: "4",
    color: "#eff6ff",
    text: "#1d4ed8",
    title: "Accessibility & Inclusion",
    desc: "We remove barriers to participation and create welcoming spaces for people of all backgrounds, abilities, and experiences."
  }
]

/* ════════════════════════════════════════════
   PAGE
════════════════════════════════════════════ */

export default function About() {
  return (
    <div>
      <HeroSplit
        compact
        imageSrc={images.hero.about}
        imageAlt="Our story at The Ananse Center"
        title={
          <>
            Our Story & <span className="text-accent">Mission</span>
          </>
        }
        description="Rooted in tradition and reaching toward the future — a beacon for cultural preservation, healing, and Pan-African leadership in Ghana."
        primaryCta={{ label: 'Explore Programs', href: '/programs' }}
        secondaryCta={{ label: 'Visit Us', href: '/contact#form' }}
        stats={[
          { value: '2015', label: 'Year Founded' },
          { value: '500+', label: 'Alumni & Participants' },
          { value: '25+', label: 'Partner Organizations' },
          { value: '6', label: 'Mission Pillars' },
        ]}
      />

      {/* ─── Mission & Vision ─── */}
      <section className="page-section bg-white">
        <div className="page-section-container">
          <div className="two-col-section gap-xl">
            {/* Mission */}
            <div>
              <h2 className="page-section-heading">Our Mission</h2>
              <div className="page-body-stack">
                <p className="page-body-text" style={{ fontSize: '16px' }}>
                  We exist to preserve, celebrate, and revitalize African cultural 
                  heritage through transformative arts education and community engagement. 
                  Our mission is to create spaces where identity is affirmed, stories 
                  are honored, and connections are forged across generations and continents.
                </p>
                <p className="page-body-text" style={{ fontSize: '16px' }}>
                  In a world where cultural erosion threatens the wisdom of our ancestors, 
                  we stand as guardians of tradition while embracing innovation. We believe 
                  that cultural knowledge is not static—it&apos;s a living, breathing force that 
                  must be nurtured, shared, and evolved.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div>
              <h2 className="page-section-heading">Our Vision</h2>
              <div className="page-body-stack">
                <p className="page-body-text" style={{ fontSize: '16px' }}>
                  We envision a world where African cultural heritage is not just preserved 
                  but actively celebrated and integrated into contemporary life. Where every 
                  individual, regardless of where they live, can access the richness of 
                  African traditions and find their place within this vibrant tapestry.
                </p>
                <p className="page-body-text" style={{ fontSize: '16px' }}>
                  Our vision extends beyond cultural preservation to cultural innovation—where 
                  ancient wisdom informs modern creativity, and traditional practices inspire 
                  contemporary solutions to global challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Philosophy ─── */}
      <section className="page-section bg-slate-50">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">Core Beliefs</span>
            <h2 className="page-section-heading">Our Cultural Philosophy</h2>
            <p className="page-body-text">
              Understanding the principles that guide our work and shape our community.
            </p>
          </div>

          <div className="grid-cards">
            {philosophies.map((item, idx) => (
              <article key={item.title} className="premium-card">
                {/* ── Image Slot ── */}
                <div className="premium-card-image-wrapper" style={{ height: '180px' }}>
                  <Image 
                    src={`/images/image (${idx + 7}).jpeg`} 
                    alt={item.title} 
                    fill
                    className="object-cover"
                    sizes={cardImageSizes}
                  />
                </div>

                {/* ── Header ── */}
                <div className="premium-card-header">
                  <div className="premium-card-icon-box">
                    <item.icon size={22} strokeWidth={1.75} />
                  </div>
                  <span className="premium-card-featured-label">Philosophy</span>
                </div>

                {/* ── Title ── */}
                <h3 className="premium-card-title">{item.title}</h3>

                {/* ── Body ── */}
                <p className="premium-card-description">{item.description}</p>

                {/* ── CTA ── */}
                <Link href="/programs" className="btn-primary premium-card-cta">
                  Explore Programs
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Our Approach ─── */}
      <section className="page-section bg-white">
        <div className="page-section-container">
          <div className="two-col-section">
            <div className="max-w-md">
              <span className="section-badge">Methodology</span>
              <h2 className="page-section-heading">Our Approach</h2>
              <p className="page-body-text" style={{ marginBottom: '2.5rem' }}>
                How we bring our mission to life through intentional, community-centered practices.
              </p>
              
              <div className="flex-column" style={{ gap: '2rem' }}>
                {approaches.map((app) => (
                  <div key={app.title} style={{ display: 'flex', gap: '1.25rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: app.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontWeight: 700,
                      color: app.text,
                      fontSize: '14px'
                    }}>
                      {app.num}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', marginBottom: '4px' }}>
                        {app.title}
                      </h4>
                      <p className="page-body-text" style={{ fontSize: '14px', color: '#1A1A1A' }}>{app.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <article className="premium-card">
               <div className="premium-card-header">
                  <span className="premium-card-featured-label">Cultural Impact</span>
               </div>
               
               <h3 className="premium-card-title" style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
                 Measuring Our Impact
               </h3>
               
               <div className="flex-column" style={{ gap: '1rem', marginTop: '1rem' }}>
                  {[
                    { label: "Students Served", value: "500+", color: "#d97706" },
                    { label: "Programs Active", value: "15+",  color: "#15803d" },
                    { label: "Community Partners", value: "25+", color: "#0f172a" },
                    { label: "Countries Connected", value: "15+", color: "#2563eb" },
                  ].map((row) => (
                    <div key={row.label} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      <span style={{ fontSize: '14px', color: '#1A1A1A' }}>{row.label}</span>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>{row.value}</span>
                    </div>
                  ))}
               </div>
               
               <Link href="/support" className="btn-primary premium-card-cta" style={{ marginTop: '2.5rem' }}>
                 Join Our Mission
               </Link>
            </article>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="page-cta-section">
        <div className="page-section-container page-cta-inner">
          <h2 className="page-cta-heading">Building a Legacy Together</h2>
          <p className="page-cta-body">
            Our story is still being written, and it&apos;s a story that belongs to all of us. 
            Every person who walks through our doors, every program we offer, every connection 
            we make adds a new chapter to this ongoing narrative of cultural preservation and 
            community empowerment.
          </p>
          <div className="page-cta-buttons">
            <Link href="/contact#form" className="btn-primary page-cta-btn">
              Get Involved
            </Link>
            <Link href="/support" className="btn-outline-white page-cta-btn">
              Support Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}