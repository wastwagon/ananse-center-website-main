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
  const mapSubtitleRaw = cms['contact.map.subtitle']?.trim() || ''
  const mapSubtitle =
    !mapSubtitleRaw || /form on get involved/i.test(mapSubtitleRaw) ? 'Ghana' : mapSubtitleRaw
  const mapLinkText = cms['contact.map.linkText'] || 'Open in Google Maps'
  const addressLines = profile.contact.address.split('\n').filter(Boolean)

  return (
    <div className="involve-page">
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
          <div className="involve-intro">
            <article className="involve-intro-card">
              <span className="section-badge">Pathways</span>
              <h2 className="page-section-heading">Find your place</h2>
              <p className="involve-intro-tagline">Connect. Contribute. Grow.</p>
              <p className="page-body-text">
                There are many ways to connect, contribute, and grow with ANANSE. Each path is a
                different kind of contribution.
              </p>
              <p className="page-body-text">
                Learn and attend are open. Mentoring and partnership begin when you write. Each
                card names what the path includes and where to begin.
              </p>
              <p className="page-body-text involve-intro-note">
                Support means financial giving. Mentoring and partnership are expressions of
                interest, not automatic matches.
              </p>
            </article>
            <div className="involve-gateway-grid">
              {pathwayCards.map((path) => (
                <LocalizedLink key={path.id} href={`#${path.id}`} className="involve-gateway-card">
                  <span className="involve-gateway-kicker">Pathway</span>
                  <span className="involve-gateway-title">{path.title}</span>
                  <span className="involve-gateway-body">
                    {'kicker' in path && path.kicker ? path.kicker : path.body}
                  </span>
                </LocalizedLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section section-reveal bg-slate-50">
        <div className="page-section-container">
          <div className="involve-section-intro">
            <span className="section-badge">Ways to take part</span>
            <h2 className="page-section-heading">Six paths</h2>
            <p className="page-body-text">
              Learn, attend, mentor, partner, support, or share. Follow the link on a card when you
              are ready to begin.
            </p>
          </div>
          <div className="involve-path-grid">
            {pathwayCards.map((path) => (
              <article key={path.id} id={path.id} className="involve-path-card">
                <div className="involve-path-card-head">
                  <div>
                    {'kicker' in path && path.kicker ? (
                      <p className="involve-path-kicker">{path.kicker}</p>
                    ) : null}
                    <h3 className="involve-path-title">{path.title}</h3>
                  </div>
                  <LocalizedLink
                    href={path.id === 'share' ? '#share-panel' : path.href}
                    className="involve-path-link"
                  >
                    {path.cta}
                  </LocalizedLink>
                </div>
                <p className="involve-path-body">{path.body}</p>
                {path.points.length > 0 ? (
                  <ul className="involve-path-points">
                    {path.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="involve-section-intro">
            <span className="section-badge">Take part</span>
            <h2 className="page-section-heading">Mentor or share</h2>
            <p className="page-body-text">
              Mentoring begins as an expression of interest. Sharing helps a reflection, lecture, or
              event reach someone else.
            </p>
          </div>
          <div className="involve-action-grid">
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
            <ShareSite id="share-panel" />
          </div>
        </div>
      </section>

      <section id="contact" className="page-section section-reveal bg-slate-50">
        <div className="page-section-container">
          <div className="involve-section-intro">
            <span className="section-badge">Contact</span>
            <h2 className="page-section-heading">Write to ANANSE</h2>
            <p className="page-body-text">
              Write about programs, events, partnership, support, or a general question.
            </p>
          </div>
          <div className="involve-contact-grid">
            <InquiryForm
              id="contact-form"
              heading="Send a message"
              defaultSubject="General inquiry"
            />

            <aside className="involve-contact-aside">
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

              <div className={`involve-map-card${mapEmbedSrc ? ' involve-map-card--embed' : ''}`}>
                {mapEmbedSrc ? (
                  <>
                    <div className="involve-map-caption">
                      <h3 className="involve-path-title">{mapHeading}</h3>
                      {mapSubtitle ? <p className="involve-path-body">{mapSubtitle}</p> : null}
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
                  <>
                    <h3 className="involve-path-title">{mapHeading}</h3>
                    {mapSubtitle ? <p className="involve-path-body">{mapSubtitle}</p> : null}
                    <p className="involve-path-body">
                      A map will appear here when ANANSE publishes a visit location. Use email or
                      phone to reach the Center in the meantime.
                    </p>
                  </>
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

