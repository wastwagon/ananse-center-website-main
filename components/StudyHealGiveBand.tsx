import { getCmsTexts, parseCmsJson, type CmsHeroCta } from '../lib/cms/content'
import LocalizedLink from './LocalizedLink'

const KEYS = [
  'home.journey.badge',
  'home.journey.heading',
  'home.journey.lead',
  'home.journey.study.title',
  'home.journey.study.body',
  'home.journey.study.cta',
  'home.journey.heal.title',
  'home.journey.heal.body',
  'home.journey.heal.cta',
  'home.journey.give.title',
  'home.journey.give.body',
  'home.journey.give.cta',
] as const

export default async function StudyHealGiveBand() {
  const cms = await getCmsTexts(KEYS)
  const studyCta = parseCmsJson<CmsHeroCta>(cms['home.journey.study.cta'], {
    label: 'Explore Programs',
    href: '/programs',
  })
  const healCta = parseCmsJson<CmsHeroCta>(cms['home.journey.heal.cta'], {
    label: 'Plan Your Sankofa Journey',
    href: '/repatriation',
  })
  const giveCta = parseCmsJson<CmsHeroCta>(cms['home.journey.give.cta'], {
    label: 'Donate Today',
    href: '/support#donate',
  })

  const cards = [
    {
      title: cms['home.journey.study.title'],
      body: cms['home.journey.study.body'],
      cta: studyCta,
      variant: 'study' as const,
    },
    {
      title: cms['home.journey.heal.title'],
      body: cms['home.journey.heal.body'],
      cta: healCta,
      variant: 'heal' as const,
    },
    {
      title: cms['home.journey.give.title'],
      body: cms['home.journey.give.body'],
      cta: giveCta,
      variant: 'give' as const,
    },
  ]

  return (
    <section className="study-heal-give section-reveal" aria-labelledby="journey-heading">
      <div className="page-section-container">
        <div className="page-section-center-header">
          <span className="section-badge">{cms['home.journey.badge']}</span>
          <h2 id="journey-heading" className="page-section-heading">
            {cms['home.journey.heading']}
          </h2>
          <p className="page-body-text">{cms['home.journey.lead']}</p>
        </div>
        <div className="study-heal-give-grid">
          {cards.map((card) => (
            <article key={card.variant} className={`study-heal-give-card study-heal-give-card--${card.variant}`}>
              <h3 className="study-heal-give-card-title">{card.title}</h3>
              <p className="page-body-text text-body-md">{card.body}</p>
              <LocalizedLink href={card.cta.href} className="btn-primary study-heal-give-card-cta">
                {card.cta.label}
              </LocalizedLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
