import LocalizedLink from '../../../components/LocalizedLink'
import HeroSplit from '../../../components/HeroSplit'
import InquiryForm from '../../../components/InquiryForm'
import ShareSite from '../../../components/ShareSite'
import { buildPageMetadata } from '../../../lib/page-meta'
import { images } from '../../../lib/images'
import { GET_INVOLVED_PATHS } from '../../../lib/leadership/copy'
import { getPublicSiteProfile } from '../../../lib/site-profile'
import { getCmsTexts } from '../../../lib/cms/content'

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Get Involved',
    description:
      'Learn, attend, mentor, partner, support, or share with ANANSE Center for Leadership Development.',
    path: '/get-involved',
    ogImage: images.hero.contact,
  })
}

export default async function GetInvolvedPage() {
  const [profile, cms] = await Promise.all([
    getPublicSiteProfile(),
    getCmsTexts([
      'contact.map.heading',
      'contact.map.subtitle',
      'contact.map.embedUrl',
      'contact.map.linkUrl',
      'contact.map.linkText',
    ] as const),
  ])

  const pathwayCards = GET_INVOLVED_PATHS.filter((path) => path.id !== 'contact')
  const mapEmbedSrc = cms['contact.map.embedUrl']?.trim() || ''
  const mapLinkHref = cms['contact.map.linkUrl']?.trim() || ''
  const mapHeading = cms['contact.map.heading'] || 'Find ANANSE'
  const mapSubtitle = cms['contact.map.subtitle'] || 'Ghana'
  const mapLinkText = cms['contact.map.linkText'] || 'Open in Google Maps'
  const addressLines = profile.contact.address.split('\n').filter(Boolean)

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
          <div className="section-header-split">
            <div>
              <span className="section-badge">Pathways</span>
              <h2 className="page-section-heading">Find your place</h2>
              <p className="page-body-text">
                Each path is a different kind of contribution. Support means financial giving.
                Mentoring and partnership are expressions of interest, not automatic matches.
              </p>
            </div>
          </div>
          <div className="pathway-list">
            {pathwayCards.map((path) => (
              <article key={path.id} id={path.id} className="pathway-row">
                <div>
                  <h2 className="pathway-row-title">{path.title}</h2>
                  {'kicker' in path && path.kicker ? (
                    <p className="pathway-row-kicker">{path.kicker}</p>
                  ) : null}
                  <p className="pathway-row-body">{path.body}</p>
                  {path.points.length > 0 ? (
                    <ul className="pathway-row-points">
                      {path.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <LocalizedLink href={path.href} className="btn-secondary pathway-row-cta">
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
        <div className="page-section-container">
          <div className="two-col-section" style={{ alignItems: 'start' }}>
            <div className="page-section-narrow" style={{ maxWidth: '100%' }}>
              <InquiryForm
                id="contact-form"
                heading="Contact"
                intro="Write to ANANSE about programs, events, partnership, support, or a general question."
                defaultSubject="General inquiry"
              />
            </div>

            <aside className="flex-column" style={{ gap: '1rem' }}>
              <div className="premium-card">
                <h3 className="premium-card-title">Reach ANANSE</h3>
                {addressLines.length ? (
                  <p className="premium-card-description">
                    {addressLines.map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                ) : null}
                <p className="premium-card-description">
                  <a href={`mailto:${profile.contact.email}`} className="content-cta-link">
                    {profile.contact.email}
                  </a>
                </p>
                <p className="premium-card-description">
                  <a href={profile.contact.phoneHref} className="content-cta-link">
                    {profile.contact.phone}
                  </a>
                </p>
                {profile.contact.hours ? (
                  <p className="premium-card-description">{profile.contact.hours}</p>
                ) : null}
              </div>

              <div
                className={`about-visual-card contact-map-card p-0${mapEmbedSrc ? ' contact-map-card--embed' : ''}`}
              >
                {mapEmbedSrc ? (
                  <>
                    <div className="contact-map-caption">
                      <h4 className="contact-visit-title">{mapHeading}</h4>
                      <p className="contact-visit-sub">{mapSubtitle}</p>
                    </div>
                    <iframe
                      className="contact-map-frame"
                      title={mapHeading}
                      src={mapEmbedSrc}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </>
                ) : (
                  <div className="text-center contact-map-overlay" style={{ padding: '1.5rem' }}>
                    <h4 className="contact-visit-title">{mapHeading}</h4>
                    <p className="contact-visit-sub">{mapSubtitle}</p>
                    <p className="page-body-text text-body-sm">
                      A map will appear here when ANANSE publishes a visit location. Use email or
                      phone to reach the Center in the meantime.
                    </p>
                  </div>
                )}
              </div>
              {mapLinkHref ? (
                <a
                  href={mapLinkHref}
                  className="program-card-link visit-card-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {mapLinkText}
                </a>
              ) : null}
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
