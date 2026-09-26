import LocalizedLink from '../../components/LocalizedLink'
import HeroPremium from '../../components/HeroPremium'
import { buildCmsMetadata } from '../../lib/cms/seo'
import { cmsIconForKey } from '../../lib/cms-icons'
import { images } from '../../lib/images'
import { fetchPrograms } from '../../lib/api'
import {
  GET_INVOLVED_PATHS,
  HOME_HERO,
  HOME_INSIGHTS,
  HOME_MIDDAY,
  HOME_PEOPLE,
  HOME_PROGRAMS_INTRO,
  HOME_WELCOME,
  HOME_WHATS_NEW,
  HOME_WHY,
  INSIGHT_TOPICS,
} from '../../lib/leadership/copy'
import { programSummary, selectLeadershipPrograms } from '../../lib/leadership/programs'

export async function generateMetadata() {
  return buildCmsMetadata('home', { ogImage: images.hero.home })
}

export default async function Home() {
  let programs = selectLeadershipPrograms([])
  try {
    programs = selectLeadershipPrograms(await fetchPrograms('catalog'))
  } catch {
    programs = selectLeadershipPrograms([])
  }

  return (
    <div>
      <HeroPremium
        lead={HOME_HERO.lead}
        trustLine={HOME_HERO.trust}
        imageSrc={images.hero.home}
        imageAlt="ANANSE Center for Leadership Development"
        title={{ line1: HOME_HERO.line1, accent: HOME_HERO.accent }}
        stats={HOME_HERO.stats}
        primaryCta={HOME_HERO.primary}
        secondaryCta={HOME_HERO.secondary}
        scrollHref="#welcome"
        scrollLabel="Scroll to welcome"
      />

      <section id="welcome" className="page-section bg-white section-reveal">
        <div className="page-section-container page-section-narrow">
          <span className="section-badge">Welcome to ANANSE</span>
          <h2 className="page-section-heading">{HOME_WELCOME.heading}</h2>
          {HOME_WELCOME.paragraphs.map((paragraph) => (
            <p key={paragraph} className="page-body-text">
              {paragraph}
            </p>
          ))}
          <LocalizedLink href="/about" className="btn-primary page-inline-cta">
            Learn more about ANANSE
          </LocalizedLink>
        </div>
      </section>

      <section id="programs" className="page-section page-section--muted ananse-network-pattern section-reveal">
        <div className="page-section-container">
          <div className="section-header-split">
            <div>
              <span className="section-badge">Programs</span>
              <h2 className="page-section-heading">{HOME_PROGRAMS_INTRO.heading}</h2>
              <p className="page-body-text">{HOME_PROGRAMS_INTRO.lead}</p>
              <p className="page-body-text">{HOME_PROGRAMS_INTRO.body}</p>
            </div>
            <LocalizedLink href="/programs" className="btn-outline page-section-cta-link">
              Explore all programs
            </LocalizedLink>
          </div>
          <div className="grid-cards">
            {programs.map((program) => {
              const Icon = cmsIconForKey(program.iconKey)
              return (
                <article key={program.slug} className="premium-card">
                  <div className="premium-card-header">
                    <div className="premium-card-icon-box">
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                  </div>
                  <h3 className="premium-card-title">{program.title}</h3>
                  <p className="premium-card-description">{programSummary(program.description)}</p>
                  <LocalizedLink href={`/programs/${program.slug}`} className="btn-secondary premium-card-cta">
                    Explore {program.title}
                  </LocalizedLink>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="midday-reflection" className="page-section bg-white section-reveal">
        <div className="page-section-container page-section-narrow">
          <span className="section-badge">Midday Reflection</span>
          <h2 className="page-section-heading">{HOME_MIDDAY.kicker}</h2>
          {HOME_MIDDAY.paragraphs.map((paragraph) => (
            <p key={paragraph} className="page-body-text">
              {paragraph}
            </p>
          ))}
          <div className="insight-card p-0" style={{ marginTop: '1.5rem' }}>
            <div className="insight-card-bar" />
            <div className="insight-card-body p-20">
              <h3 className="premium-card-title">Latest episode</h3>
              <p className="page-body-text">{HOME_MIDDAY.empty}</p>
            </div>
          </div>
          <p className="page-body-text" style={{ marginTop: '1.25rem' }}>
            {HOME_MIDDAY.weekly}
          </p>
          <div className="page-cta-buttons" style={{ marginTop: '1.25rem' }}>
            <LocalizedLink href="/programs/midday-reflection" className="btn-primary">
              Explore Midday Reflection
            </LocalizedLink>
            <LocalizedLink href="/library/midday-reflection" className="btn-outline">
              Episode archive
            </LocalizedLink>
          </div>
        </div>
      </section>

      <section id="what-is-new" className="page-section page-section--muted ananse-network-pattern section-reveal">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">What is new</span>
            <h2 className="page-section-heading">{HOME_WHATS_NEW.heading}</h2>
            <p className="page-body-text">{HOME_WHATS_NEW.lead}</p>
            <p className="page-body-text">{HOME_WHATS_NEW.body}</p>
          </div>
          <div className="grid-cards">
            {HOME_WHATS_NEW.slots.map((slot) => (
              <article key={slot.title} className="premium-card">
                <h3 className="premium-card-title">{slot.title}</h3>
                <p className="premium-card-description">{slot.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="insights" className="page-section bg-white section-reveal">
        <div className="page-section-container">
          <span className="section-badge">Insights</span>
          <h2 className="page-section-heading">{HOME_INSIGHTS.heading}</h2>
          <p className="page-body-text">{HOME_INSIGHTS.kicker}</p>
          {HOME_INSIGHTS.paragraphs.map((paragraph) => (
            <p key={paragraph} className="page-body-text">
              {paragraph}
            </p>
          ))}
          <ul className="about-focus-list">
            {INSIGHT_TOPICS.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
          <LocalizedLink href="/insights" className="btn-primary page-inline-cta">
            Explore ANANSE Insights
          </LocalizedLink>
        </div>
      </section>

      <section id="why-ananse" className="page-section page-section--muted ananse-network-pattern section-reveal">
        <div className="page-section-container page-section-narrow">
          <span className="section-badge">Why the name matters</span>
          <h2 className="page-section-heading">{HOME_WHY.heading}</h2>
          <p className="page-body-text">{HOME_WHY.kicker}</p>
          {HOME_WHY.paragraphs.map((paragraph) => (
            <p key={paragraph} className="page-body-text">
              {paragraph}
            </p>
          ))}
          <LocalizedLink href="/about#the-ananse-story" className="btn-primary page-inline-cta">
            Read the ANANSE story
          </LocalizedLink>
        </div>
      </section>

      <section id="people" className="page-section bg-white section-reveal">
        <div className="page-section-container page-section-narrow">
          <span className="section-badge">People</span>
          <h2 className="page-section-heading">{HOME_PEOPLE.heading}</h2>
          <p className="page-body-text">{HOME_PEOPLE.kicker}</p>
          {HOME_PEOPLE.paragraphs.map((paragraph) => (
            <p key={paragraph} className="page-body-text">
              {paragraph}
            </p>
          ))}
          <LocalizedLink href="/people" className="btn-primary page-inline-cta">
            Meet the ANANSE community
          </LocalizedLink>
        </div>
      </section>

      <section id="get-involved" className="page-section page-section--muted ananse-network-pattern section-reveal">
        <div className="page-section-container">
          <div className="page-section-center-header">
            <span className="section-badge">How to take part</span>
            <h2 className="page-section-heading">Be part of the ANANSE journey.</h2>
            <p className="page-body-text">There are many ways to connect, contribute, and grow with ANANSE.</p>
          </div>
          <div className="grid-cards">
            {GET_INVOLVED_PATHS.map((path) => (
              <article key={path.id} className="premium-card">
                <h3 className="premium-card-title">{path.title}</h3>
                <p className="premium-card-description">{path.body}</p>
                <LocalizedLink href={path.href.startsWith('#') ? `/get-involved${path.href}` : path.href} className="btn-secondary premium-card-cta">
                  {path.cta}
                </LocalizedLink>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
