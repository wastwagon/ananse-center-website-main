import LocalizedLink from '../../../components/LocalizedLink'
import HeroSplit from '../../../components/HeroSplit'
import { buildCmsMetadata } from '../../../lib/cms/seo'
import { images } from '../../../lib/images'
import {
  BELIEF_EMPHASES,
  CORE_VALUES,
  LEARNING_BY_DOING,
  MISSION_DIMENSIONS,
  WHO_WE_SERVE,
} from '../../../lib/leadership/copy'

/** Jump targets for About — kept local so Continuity stays one stop. */
const ABOUT_JUMPS = [
  { id: 'who-we-are', label: 'Who We Are' },
  { id: 'who-we-serve', label: 'Who We Serve' },
  { id: 'the-ananse-story', label: 'The ANANSE Story' },
  { id: 'continuity', label: 'Roots & Continuity' },
  { id: 'vision-mission', label: 'Vision & Mission' },
  { id: 'core-values', label: 'Core Values' },
] as const

const APPROACH_STEPS = [
  {
    title: 'Learn',
    body: 'Acquire knowledge, encounter ideas, ask questions, and develop understanding.',
  },
  {
    title: 'Develop',
    body: 'Apply what has been learned, build practical skills, receive mentoring, and develop character.',
  },
  {
    title: 'Serve',
    body: 'Use knowledge, skills, relationships, and influence to create meaningful value for others.',
  },
] as const

export async function generateMetadata() {
  return buildCmsMetadata('about', { ogImage: images.hero.about })
}

export default function AboutPage() {
  return (
    <div className="about-page">
      <HeroSplit
        compact
        imageSrc={images.hero.about}
        imageAlt="ANANSE Center for Leadership Development"
        title={
          <>
            About <span className="text-accent">ANANSE</span>
          </>
        }
        description="Developing people. Transforming lives. Strengthening communities. ANANSE Center for Leadership Development is committed to developing people who lead with character, wisdom, competence, excellence, and purpose."
        primaryCta={{ label: 'Explore programs', href: '/programs' }}
        secondaryCta={{ label: 'Get involved', href: '/get-involved' }}
        stats={[]}
      />

      <nav className="about-jump-nav" aria-label="About sections">
        <div className="page-section-container about-jump-nav-inner">
          {ABOUT_JUMPS.map((jump) => (
            <a key={jump.id} href={`#${jump.id}`} className="about-jump-link">
              {jump.label}
            </a>
          ))}
        </div>
      </nav>

      <section id="who-we-are" className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="about-section-intro">
            <span className="section-badge">Who We Are</span>
            <h2 className="page-section-heading">Leadership beyond position</h2>
            <p className="page-body-text">
              ANANSE exists to cultivate leaders who understand that leadership is not merely about
              position—it is about character, responsibility, influence, and service.
            </p>
            <p className="page-body-text">
              We combine ideas with experience, learning with practice, and mentorship with
              opportunity, so people become intellectually equipped, morally grounded, spiritually
              authentic, and practically capable.
            </p>
          </div>

          <div className="about-panel">
            <h3 className="about-panel-title">What we believe about leadership</h3>
            <p className="about-panel-lead">
              Character before influence. Leadership without character can become an exercise in
              power. Competence without wisdom can produce unintended consequences. Knowledge
              without responsibility can fail to serve society. For ANANSE,
              leadership development means helping people become trusted with influence—not only
              prepared to hold a title.
            </p>
            <div className="about-card-grid about-card-grid--5">
              {BELIEF_EMPHASES.map((item) => (
                <article key={item.title} className="about-card">
                  <h4 className="about-card-title">{item.title}</h4>
                  <p className="about-card-body">{item.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="about-panel about-panel--muted">
            <h3 className="about-panel-title">Our approach</h3>
            <p className="about-panel-lead">
              Effective leadership development moves through three connected stages. The goal is not
              simply informed people. It is formed people—whose knowledge, character, competence, and
              influence are increasingly aligned.
            </p>
            <div className="about-card-grid about-card-grid--3">
              {APPROACH_STEPS.map((step, index) => (
                <article key={step.title} className="about-card about-card--step">
                  <span className="about-card-step">{String(index + 1).padStart(2, '0')}</span>
                  <h4 className="about-card-title">{step.title}</h4>
                  <p className="about-card-body">{step.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="about-panel">
            <h3 className="about-panel-title">Learning by doing</h3>
            <p className="about-panel-lead">
              Leadership cannot be fully learned from books or lectures alone. ANANSE places value on
              hands-on learning, mentoring, and applying knowledge to real situations.
            </p>
            <ul className="about-chip-list">
              {LEARNING_BY_DOING.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="who-we-serve" className="page-section section-reveal bg-slate-50">
        <div className="page-section-container">
          <div className="about-section-intro">
            <span className="section-badge">Who We Serve</span>
            <h2 className="page-section-heading">People seeking to learn, grow, lead, and serve</h2>
            <p className="page-body-text">
              ANANSE works with people who are seeking to learn, grow, lead, and serve.
            </p>
          </div>
          <div className="about-card-grid about-card-grid--audience">
            {WHO_WE_SERVE.map((item) => (
              <article key={item.title} className="about-card about-card--lift">
                <h3 className="about-card-title">{item.title}</h3>
                <p className="about-card-body">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="the-ananse-story" className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="about-section-intro">
            <span className="section-badge">The ANANSE Story</span>
            <h2 className="page-section-heading">The wisdom behind the name</h2>
          </div>
          <article className="about-story-card">
            <p className="about-story-text">
              Ananse is the Ghanaian word for spider and is one of the most recognizable figures in
              Ghanaian traditional storytelling.
            </p>
            <p className="about-story-text">
              In Ghanaian folk stories, Ananse is often used as a didactic character—a vehicle through
              which wisdom and life lessons are communicated. The stories explore themes such as
              wisdom, wit, resourcefulness, practical skills, creativity, ingenuity, and
              problem-solving.
            </p>
            <p className="about-story-text">
              The spider therefore provides an apt metaphor for the spirit of ANANSE: the ability to
              think creatively, learn from experience, work with available resources, solve problems,
              and navigate the complexities of life.
            </p>
            <p className="about-story-text about-story-text--emphasis">
              The institutional name also carries a secondary expansion used in some ANANSE materials:
              African Network &amp; Advisory for Needed Services &amp; Excellence. The public identity
              remains <strong>ANANSE Center for Leadership Development</strong>—rooted in African
              heritage and practical wisdom for leadership development.
            </p>
          </article>
        </div>
      </section>

      <section id="continuity" className="page-section section-reveal bg-slate-50">
        <div className="page-section-container">
          <div className="about-section-intro">
            <span className="section-badge">Roots &amp; Continuity</span>
            <h2 className="page-section-heading">Rooted in Africa. Connected through EAGLESonline.</h2>
          </div>
          <div className="about-card-grid about-card-grid--2">
            <article id="ananse-africa" className="about-feature-card">
              <p className="about-feature-kicker">Africa</p>
              <h3 className="about-feature-title">ANANSE &amp; Africa</h3>
              <p className="about-feature-body">
                ANANSE carries an African identity and is particularly concerned with the development of
                people, institutions, and communities across the African continent and diaspora.
              </p>
              <p className="about-feature-body">
                Our African focus is not simply geographical. It reflects a conviction that Africa
                possesses immense human potential, wisdom, creativity, and resources—and that developing
                this potential requires investment in people.
              </p>
              <p className="about-feature-body">
                We seek to contribute by encouraging leadership, education, mentorship, practical skills,
                innovation, excellence, and responsible service. At the same time, ANANSE&apos;s
                conversations and resources are not limited to Africa—the challenges of leadership,
                character, and human development are shared across societies.
              </p>
              <p className="about-feature-closing">Our roots are African. Our conversations are global.</p>
            </article>

            <article id="eaglesonline" className="about-feature-card">
              <p className="about-feature-kicker">Parent network</p>
              <h3 className="about-feature-title">EAGLESonline</h3>
              <p className="about-feature-body">
                ANANSE Center for Leadership Development is a subsidiary of EAGLESonline, an umbrella
                organization bringing together two centers of leadership development: the EAGLES Center
                and the ANANSE Center.
              </p>
              <p className="about-feature-body">
                EAGLES stands for: Empowerment &amp; Advisory Group for Leadership, Excellence, &amp;
                Service.
              </p>
              <p className="about-feature-body">
                Within this broader vision, ANANSE has a particular emphasis on training, mentorship,
                practical development, and empowering people to become agents of positive social change.
                The two centers share a commitment to leadership, excellence, service, and human
                development while providing distinct avenues through which that vision can be pursued.
              </p>
              <LocalizedLink href="/get-involved" className="btn-primary about-feature-cta">
                Get involved
              </LocalizedLink>
            </article>
          </div>
        </div>
      </section>

      <section id="vision-mission" className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="about-section-intro">
            <span className="section-badge">Vision &amp; Mission</span>
            <h2 className="page-section-heading">Where we are going — and why we exist</h2>
          </div>
          <div className="about-card-grid about-card-grid--2">
            <article className="about-statement-card">
              <p className="about-statement-label">Vision</p>
              <p className="about-statement-text">
                A generation of principled, competent, spiritually grounded leaders who use their
                influence to serve others and strengthen society—in families, professions, institutions,
                and communities.
              </p>
            </article>
            <article className="about-statement-card about-statement-card--accent">
              <p className="about-statement-label">Mission</p>
              <p className="about-statement-text">
                Developing people for life, leadership, and service through leadership education,
                mentoring, intellectual engagement, authentic spirituality, and practical service.
              </p>
            </article>
          </div>
          <div className="about-card-grid about-card-grid--mission about-card-grid--follow">
            {MISSION_DIMENSIONS.map((item) => (
              <article key={item.title} className="about-card about-card--lift">
                <h3 className="about-card-title">{item.title}</h3>
                <p className="about-card-body">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="core-values" className="page-section section-reveal bg-slate-50">
        <div className="page-section-container">
          <div className="about-section-intro">
            <span className="section-badge">Core Values</span>
            <h2 className="page-section-heading">What guides our work</h2>
            <p className="page-body-text">
              The work of ANANSE is grounded in seven core values. They remain a list—not an acronym.
            </p>
          </div>
          <div className="about-card-grid about-card-grid--values">
            {CORE_VALUES.map((value, index) => (
              <article key={value.title} className="about-value-card">
                <span className="about-value-index">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="about-value-title">{value.title}</h3>
                <p className="about-value-body">{value.body}</p>
              </article>
            ))}
          </div>
          <p className="about-closing-note">
            These values shape how we think about leadership, how we develop people, and how we serve
            others.
          </p>
        </div>
      </section>

      <section id="join" className="page-section section-reveal bg-white">
        <div className="page-section-container page-section-narrow">
          <span className="section-badge">Join the journey</span>
          <h2 className="page-section-heading">There is a place for you at ANANSE.</h2>
          <p className="page-body-text">
            Whether you are a student seeking direction, a young professional looking for mentorship,
            an experienced leader with wisdom to share, an organization seeking development
            opportunities, or simply someone who wants to keep learning, there are many ways to
            connect with ANANSE.
          </p>
          <p className="page-body-text">Explore. Learn. Grow. Lead. Serve.</p>
          <div className="page-cta-buttons">
            <LocalizedLink href="/programs" className="btn-primary">
              Explore our programs
            </LocalizedLink>
            <LocalizedLink href="/library" className="btn-outline">
              Visit the Library
            </LocalizedLink>
            <LocalizedLink href="/get-involved" className="btn-outline">
              Get involved
            </LocalizedLink>
          </div>
        </div>
      </section>
    </div>
  )
}
