'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import HeroSplit from '../../../components/HeroSplit'
import FeatureIcon from '../../../components/FeatureIcon'
import { images } from '../../../lib/images'
import type { LucideIcon } from 'lucide-react'
import {
  Palette,
  Music,
  BookOpen,
  Brush,
  Drama,
  Award,
  Wrench,
  Globe,
  Users,
  Sprout,
} from 'lucide-react'


/* ════════════════════════════════════════════
   DATA
════════════════════════════════════════════ */

const programs: {
  id: number
  title: string
  category: string
  description: string
  duration: string
  level: string
  icon: LucideIcon
  features: string[]
}[] = [
  {
    id: 1,
    title: 'Traditional Arts & Crafts',
    category: 'Arts Education',
    description:
      'Master Adinkra, Kente, pottery, and wood carving with master artisans in Accra and Kumasi.',
    duration: '8 weeks',
    level: 'All levels welcome',
    icon: Palette,
    features: ['Hands-on workshops', 'Master artisan guidance', 'Cultural context', 'Materials provided'],
  },
  {
    id: 2,
    title: 'African Music & Rhythm',
    category: 'Cultural Workshops',
    description:
      'Explore drumming, vocal traditions, and instruments through community-centered music education.',
    duration: '12 weeks',
    level: 'Beginner to advanced',
    icon: Music,
    features: ['Drum circles', 'Instrument making', 'Performance opportunities', 'Music theory'],
  },
  {
    id: 3,
    title: 'Storytelling & Oral Traditions',
    category: 'Cultural Workshops',
    description:
      'Learn Ananse tales, griot traditions, and the power of oral history in community settings.',
    duration: '6 weeks',
    level: 'All levels welcome',
    icon: BookOpen,
    features: ['Story circles', 'Performance training', 'Cultural narratives', 'Community sharing'],
  },
  {
    id: 4,
    title: 'Contemporary African Art',
    category: 'Arts Education',
    description:
      'Blend traditional techniques with modern expression in painting, sculpture, and mixed media.',
    duration: '10 weeks',
    level: 'Intermediate to advanced',
    icon: Brush,
    features: ['Studio time', 'Artist mentorship', 'Exhibition opportunities', 'Portfolio development'],
  },
  {
    id: 5,
    title: 'Dance & Movement',
    category: 'Cultural Workshops',
    description:
      'Ceremonial and contemporary African dance — energy, grace, and cultural context for all bodies.',
    duration: '8 weeks',
    level: 'All fitness levels',
    icon: Drama,
    features: ['Daily movement', 'Cultural context', 'Performance preparation', 'Community building'],
  },
  {
    id: 6,
    title: 'Cultural Leadership Training',
    category: 'Community Training',
    description:
      'Become a cultural ambassador and community leader in arts and heritage preservation.',
    duration: '16 weeks',
    level: 'Advanced',
    icon: Award,
    features: ['Leadership workshops', 'Community projects', 'Mentorship program', 'Certification'],
  },
]

const categories = ["All Programs", "Arts Education", "Cultural Workshops", "Community Training"]

const benefits: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: 'Skill Development',
    description:
      'Learn traditional and contemporary techniques from master practitioners with years of experience.',
    icon: Wrench,
  },
  {
    title: 'Cultural Connection',
    description: 'Deepen your understanding and connection to African heritage through immersion and practice.',
    icon: Globe,
  },
  {
    title: 'Community Building',
    description:
      'Join a supportive network of learners, artists, and cultural enthusiasts from diverse backgrounds.',
    icon: Users,
  },
  {
    title: 'Personal Growth',
    description: 'Discover new aspects of yourself through creative expression and ancestral wisdom.',
    icon: Sprout,
  },
]

/* ════════════════════════════════════════════
   PAGE
════════════════════════════════════════════ */

export default function ProgramsPage() {
  const [activeTab, setActiveTab] = useState("All Programs")

  const filteredPrograms = activeTab === "All Programs" 
    ? programs 
    : programs.filter(p => p.category === activeTab)

  return (
    <div>
      <HeroSplit
        compact
        imageSrc={images.hero.programs}
        imageAlt="Ananse Center programs"
        title={
          <>
            Our <span className="text-accent">Transformative Programs</span>
          </>
        }
        description="Hands-on arts, culture, and leadership experiences that connect you to African heritage and community."
        primaryCta={{ label: 'Browse Programs', href: '/programs#catalog' }}
        secondaryCta={{ label: 'Apply Now', href: '/contact#form' }}
        stats={[
          { value: '6+', label: 'Program Tracks' },
          { value: '500+', label: 'Participants' },
          { value: '15+', label: 'Communities' },
          { value: '100%', label: 'Cultural Focus' },
        ]}
      />

      {/* ─── Filter & Catalog ─── */}
      <section id="catalog" className="page-section bg-white py-16">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <h2 className="page-section-heading">Find Your Path</h2>
            <p className="page-body-text">
              Explore our diverse range of programs designed for all ages and experience levels.
            </p>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`filter-btn ${activeTab === cat ? 'filter-btn-active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid-1col grid-md-2col grid-lg-3col">
            {filteredPrograms.map((program) => (
              <article key={program.id} className="premium-card">
                {/* ── Image Slot ── */}
                <div className="premium-card-image-wrapper">
                  <Image
                    src={images.programCatalog[program.id - 1]}
                    alt={program.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* ── Header ── */}
                <div className="premium-card-header">
                  <div className="premium-card-icon-box">
                    <program.icon size={22} strokeWidth={1.75} />
                  </div>
                  <span className="premium-card-featured-label">{program.category}</span>
                </div>

                {/* ── Title ── */}
                <h3 className="premium-card-title">{program.title}</h3>

                {/* ── Metadata Row ── */}
                <div className="flex justify-between items-center py-4 border-b border-gray-100 mb-6" style={{ width: '100%' }}>
                  <div className="flex flex-col">
                     <span className="text-[11px] font-bold text-gray-400 uppercase letter-spacing-wide">Duration</span>
                     <span className="text-[13px] font-semibold text-gray-700">{program.duration}</span>
                  </div>
                  <div className="flex flex-col text-right">
                     <span className="text-[11px] font-bold text-gray-400 uppercase letter-spacing-wide">Level</span>
                     <span className="text-[13px] font-semibold text-gray-700">{program.level}</span>
                  </div>
                </div>

                {/* ── Body ── */}
                <p className="premium-card-description">{program.description}</p>

                {/* ── Features List ── */}
                <div className="flex-column" style={{ gap: '0.75rem', marginBottom: '2.5rem', flex: 1 }}>
                  {program.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#f59e0b', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#1A1A1A' }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* ── Actions ── */}
                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                  <Link href="/contact#form" className="btn-primary premium-card-cta" style={{ flex: 1 }}>
                    Apply Now
                  </Link>
                  <Link href="/contact#form" className="btn-outline-dark" style={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    color: '#1A1A1A',
                    transition: 'all 0.2s'
                  }}>
                    Learn More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Benefits ─── */}
      <section className="page-section bg-slate-50 py-16">
        <div className="page-section-container">
           <div className="page-section-center-header">
             <span className="section-badge">Why Join Us?</span>
             <h2 className="page-section-heading">Program Benefits</h2>
             <p className="page-body-text">
               Our programs are designed to provide more than just skills—they offer transformation, 
               connection, and personal growth.
             </p>
           </div>

           <div className="grid-1col grid-md-2col grid-lg-4col">
              {benefits.map((benefit, idx) => (
                 <article key={benefit.title} className="premium-card">
                    <div className="premium-card-image-wrapper" style={{ height: '180px' }}>
                      <Image 
                        src={`/images/image (${idx + 7}).jpeg`} 
                        alt={benefit.title} 
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                    
                    <div className="premium-card-header">
                      <div className="premium-card-icon-box">
                        <benefit.icon size={22} strokeWidth={1.75} />
                      </div>
                      <span className="premium-card-featured-label">Benefit</span>
                    </div>
                    
                    <h3 className="premium-card-title">{benefit.title}</h3>
                    <p className="premium-card-description">{benefit.description}</p>
                 </article>
              ))}
            </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="page-section bg-white py-16">
        <div className="page-section-container">
           <div className="page-section-center-header">
             <span className="section-badge">Voices of Transformation</span>
             <h2 className="page-section-heading">Student Experiences</h2>
           </div>

           <div className="grid-1col grid-md-3col">
              {[
                {
                  name: "Ama Mensah",
                  role: "Traditional Arts Student",
                  text: "Learning Adinkra symbols wasn't just about art—it was about understanding the wisdom of my ancestors. This program gave me a deeper connection to who I am.",
                  initials: "AM"
                },
                {
                  name: "Kwame Johnson",
                  role: "Music & Rhythm Student",
                  text: "The drumming program changed my life. I found community, purpose, and a way to express emotions I didn't know how to put into words.",
                  initials: "KJ"
                },
                {
                  name: "Evelyn Davis",
                  role: "Storytelling Participant",
                  text: "As someone in the diaspora, this program helped me reconnect with my roots in the most beautiful way. I now carry these stories with pride.",
                  initials: "ED"
                }
              ].map((t) => (
                <div key={t.name} className="testimonial-card">
                   <div className="testimonial-quote-mark">“</div>
                   <p className="testimonial-text">{t.text}</p>
                   <div className="testimonial-footer">
                      <div className="testimonial-avatar">{t.initials}</div>
                      <div>
                        <p className="testimonial-name">{t.name}</p>
                        <p style={{ fontSize: '11px', color: '#1A1A1A', margin: 0 }}>{t.role}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="page-cta-section">
        <div className="page-section-container page-cta-inner">
          <h2 className="page-cta-heading">Ready to Begin Your Journey?</h2>
          <p className="page-cta-body">
            Whether you're looking to learn a new skill, connect with your heritage, 
            or simply explore the richness of African culture, there&apos;s a program waiting for you.
          </p>
          <div className="page-cta-buttons">
             <button className="btn-primary page-cta-btn" onClick={() => setActiveTab("All Programs")}>
               View All Programs
             </button>
             <Link href="/contact#form" className="btn-outline-white page-cta-btn">
               Apply Now
             </Link>
          </div>
        </div>
      </section>
    </div>
  )
}