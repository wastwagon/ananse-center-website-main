import LocalizedLink from '../../../components/LocalizedLink'
import HeroSplit from '../../../components/HeroSplit'
import { buildCmsMetadata } from '../../../lib/cms/seo'
import { images } from '../../../lib/images'
import {
  ABOUT_JUMPS,
  BELIEF_EMPHASES,
  CORE_VALUES,
  LEARNING_BY_DOING,
  MISSION_DIMENSIONS,
  WHO_WE_SERVE,
} from '../../../lib/leadership/copy'

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
        <div className="page-section-container page-section-narrow">
          <span className="section-badge">Who We Are</span>
          <h2 className="page-section-heading">Leadership beyond position</h2>
          <p className="page-body-text">
            ANANSE exists to cultivate leaders who understand that leadership is not merely about position—it is about character, responsibility, influence, and service.
          </p>
          <p className="page-body-text">
            We seek to develop people who are intellectually equipped, morally grounded, spiritually authentic, practically capable, and committed to making a positive contribution to the world around them.
          </p>
          <p className="page-body-text">
            Our approach recognizes that people learn in different ways and that leadership development must move beyond theory. We therefore combine ideas with experience, learning with practice, and mentorship with opportunity.
          </p>
          <p className="page-body-text">
            We believe that meaningful leadership begins with the development of the whole person. Leadership is not simply about occupying a position or acquiring a set of skills. It is about becoming the kind of person who can be trusted with influence and who uses that influence responsibly in service of others.
          </p>
          <p className="page-body-text">
            Through leadership education, mentoring, intellectual engagement, authentic spirituality, and practical service, ANANSE creates opportunities for people to learn, grow, lead, and serve.
          </p>

          <h3 className="page-subsection-heading">Who we serve</h3>
          <p className="page-body-text">
            ANANSE works with people who are seeking to learn, grow, lead, and serve, including:
          </p>
          <ul className="value-list">
            {WHO_WE_SERVE.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>

          <h3 className="page-subsection-heading">What we believe about leadership</h3>
          <p className="page-body-text">Character before influence.</p>
          <p className="page-body-text">Leadership without character can become an exercise in power. Competence without wisdom can produce unintended consequences. Knowledge without responsibility can fail to serve society.</p>
          <p className="page-body-text">
            For ANANSE, leadership development therefore involves more than preparing people to do leadership. It involves helping them become people who can be trusted with leadership.
          </p>
          <ul className="value-list">
            {BELIEF_EMPHASES.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>

          <h3 className="page-subsection-heading">Our approach</h3>
          <p className="page-body-text">From learning to transformation.</p>
          <p className="page-body-text">ANANSE believes that effective leadership development should move through three interconnected stages:</p>
          <ul className="value-list">
            <li>
              <strong>Learn</strong>
              <span>Acquire knowledge, encounter ideas, ask questions, and develop understanding.</span>
            </li>
            <li>
              <strong>Develop</strong>
              <span>Apply what has been learned, build practical skills, receive mentoring, and develop character.</span>
            </li>
            <li>
              <strong>Serve</strong>
              <span>Use knowledge, skills, relationships, and influence to create meaningful value for others.</span>
            </li>
          </ul>
          <p className="page-body-text">The goal is not simply informed people. It is formed people—people whose knowledge, character, competence, and influence are increasingly aligned.</p>

          <h3 className="page-subsection-heading">Learning by doing</h3>
          <p className="page-body-text">From theory to practice. Leadership cannot be fully learned from books or lectures alone.</p>
          <p className="page-body-text">
            ANANSE therefore places value on hands-on learning, mentoring, practical engagement, and opportunities to apply knowledge to real situations. Our programs are designed to encourage participants to:
          </p>
          <ul className="about-focus-list">
            {LEARNING_BY_DOING.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="page-body-text">
            Where appropriate, ANANSE also supports training, mentorship, and internship opportunities, particularly for students and young professionals.
          </p>
        </div>
      </section>

      <section id="the-ananse-story" className="page-section section-reveal bg-slate-50">
        <div className="page-section-container page-section-narrow">
          <span className="section-badge">The ANANSE Story</span>
          <h2 className="page-section-heading">The wisdom behind the name</h2>
          <p className="page-body-text">
            Ananse is the Ghanaian word for spider and is one of the most recognizable figures in Ghanaian traditional storytelling.
          </p>
          <p className="page-body-text">
            In Ghanaian folk stories, Ananse is often used as a didactic character—a vehicle through which wisdom and life lessons are communicated. The stories explore themes such as wisdom, wit, resourcefulness, practical skills, creativity, ingenuity, and problem-solving.
          </p>
          <p className="page-body-text">
            The spider therefore provides an apt metaphor for the spirit of ANANSE: the ability to think creatively, learn from experience, work with available resources, solve problems, and navigate the complexities of life.
          </p>
          <p className="page-body-text">The name ANANSE also represents:</p>
          <p className="page-body-text">African Network &amp; Advisory for Needed Services &amp; Excellence</p>
          <p className="page-body-text">
            Together, the name and the acronym express our commitment to developing people, sharing knowledge, building practical capacity, and contributing solutions to real needs.
          </p>

          <h3 className="page-subsection-heading">ANANSE &amp; Africa</h3>
          <p className="page-body-text">Rooted in Africa. Open to the world.</p>
          <p className="page-body-text">
            ANANSE carries an African identity and is particularly concerned with the development of people, institutions, and communities across the African continent and diaspora.
          </p>
          <p className="page-body-text">
            Our African focus is not simply geographical. It reflects a conviction that Africa possesses immense human potential, wisdom, creativity, and resources—and that developing this potential requires investment in people.
          </p>
          <p className="page-body-text">
            We seek to contribute by encouraging leadership, education, mentorship, practical skills, innovation, excellence, and responsible service.
          </p>
          <p className="page-body-text">
            At the same time, ANANSE&apos;s conversations and resources are not limited to Africa. The challenges of leadership, character, relationships, culture, spirituality, education, and human development are shared across societies.
          </p>
          <p className="page-body-text">Our roots are African. Our conversations are global.</p>
        </div>
      </section>

      <section id="vision-mission" className="page-section section-reveal bg-white">
        <div className="page-section-container page-section-narrow">
          <span className="section-badge">Vision &amp; Mission</span>
          <h2 className="page-section-heading">Our vision</h2>
          <p className="page-body-text">A generation prepared to lead and serve.</p>
          <p className="page-body-text">
            A generation of principled, competent, spiritually grounded, and transformational leaders who use their influence to serve others and strengthen society.
          </p>
          <p className="page-body-text">
            Our vision extends beyond preparing people for positions of leadership. We seek to prepare people for the responsibilities that accompany influence—in their families, professions, institutions, communities, and society.
          </p>

          <h2 className="page-section-heading">Our mission</h2>
          <p className="page-body-text">Developing people for life, leadership, and service.</p>
          <p className="page-body-text">
            To develop people through leadership education, mentoring, intellectual engagement, authentic spirituality, and practical service, equipping them to lead with character, excellence, and purpose.
          </p>
          <p className="page-body-text">Our mission brings together five dimensions of development:</p>
          <ul className="value-list">
            {MISSION_DIMENSIONS.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="core-values" className="page-section section-reveal bg-slate-50">
        <div className="page-section-container page-section-narrow">
          <span className="section-badge">Core Values</span>
          <h2 className="page-section-heading">What guides our work</h2>
          <p className="page-body-text">The work of ANANSE is grounded in seven core values:</p>
          <ol className="value-list value-list--numbered">
            {CORE_VALUES.map((value) => (
              <li key={value.title}>
                <strong>{value.title}</strong>
                <span>{value.body}</span>
              </li>
            ))}
          </ol>
          <p className="page-body-text">
            These values shape how we think about leadership, how we develop people, and how we serve others.
          </p>
        </div>
      </section>

      <section id="eaglesonline" className="page-section section-reveal bg-white">
        <div className="page-section-container page-section-narrow">
          <span className="section-badge">EAGLESonline</span>
          <h2 className="page-section-heading">Part of a larger leadership development vision</h2>
          <p className="page-body-text">
            ANANSE Center for Leadership Development is a subsidiary of EAGLESonline, an umbrella organization bringing together two centers of leadership development: the EAGLES Center and the ANANSE Center.
          </p>
          <p className="page-body-text">EAGLES stands for: Empowerment &amp; Advisory Group for Leadership, Excellence, &amp; Service.</p>
          <p className="page-body-text">
            Within this broader vision, ANANSE has a particular emphasis on training, mentorship, practical development, and empowering people to become agents of positive social change.
          </p>
          <p className="page-body-text">
            The two centers share a commitment to leadership, excellence, service, and human development while providing distinct avenues through which that vision can be pursued.
          </p>
          <LocalizedLink href="/get-involved" className="btn-primary page-inline-cta">
            Get involved
          </LocalizedLink>
        </div>
      </section>
    </div>
  )
}
