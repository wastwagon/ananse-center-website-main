import LocalizedLink from '../../../components/LocalizedLink'
import HeroSplit from '../../../components/HeroSplit'
import InquiryForm from '../../../components/InquiryForm'
import ShareSite from '../../../components/ShareSite'
import { buildPageMetadata } from '../../../lib/page-meta'
import { images } from '../../../lib/images'
import { GET_INVOLVED_PATHS } from '../../../lib/leadership/copy'

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Get Involved',
    description:
      'Learn, attend, mentor, partner, support, or share with ANANSE Center for Leadership Development.',
    path: '/get-involved',
    ogImage: images.hero.contact,
  })
}

export default function GetInvolvedPage() {
  return (
    <div>
      <HeroSplit
        compact
        imageSrc={images.hero.contact}
        imageAlt="Get involved with ANANSE Center for Leadership Development"
        title={
          <>
            Get <span className="text-accent">involved</span>
          </>
        }
        description="Be part of the ANANSE journey. There are many ways to connect, contribute, and grow with ANANSE."
        primaryCta={{ label: 'Contact', href: '#contact' }}
        secondaryCta={{ label: 'Give', href: '/support#donate' }}
        stats={[]}
      />

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="grid-cards">
            {GET_INVOLVED_PATHS.map((path) => (
              <article key={path.id} id={path.id} className="premium-card">
                <h2 className="premium-card-title">{path.title}</h2>
                <p className="premium-card-description">{path.body}</p>
                <LocalizedLink href={path.href} className="btn-secondary premium-card-cta">
                  {path.cta}
                </LocalizedLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section section-reveal bg-slate-50">
        <div className="page-section-container page-section-narrow">
          <InquiryForm
            id="mentor-form"
            heading="Mentor — expression of interest"
            intro="Tell us briefly what experience you can offer. Sending this form expresses interest. It does not confirm a mentoring match."
            defaultSubject="Mentor — expression of interest"
            subjects={['Mentor — expression of interest']}
            messageLabel="What experience, knowledge, or wisdom can you share?"
            submitLabel="Send expression of interest"
            successNote="Thank you. This is an expression of interest, not a confirmed mentoring match. ANANSE will reply if there is a fitting opportunity."
          />
        </div>
      </section>

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container page-section-narrow">
          <ShareSite />
        </div>
      </section>

      <section id="contact" className="page-section section-reveal bg-slate-50">
        <div className="page-section-container page-section-narrow">
          <InquiryForm
            id="contact-form"
            heading="Contact"
            intro="Write to ANANSE about programs, events, partnership, support, or a general question."
            defaultSubject="General inquiry"
          />
        </div>
      </section>
    </div>
  )
}
