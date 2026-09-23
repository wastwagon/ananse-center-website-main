import { safeHttpUrl } from '../lib/public-url'

export type LogoMark = {
  name?: string
  imageUrl?: string
  href?: string
}

export type VisibleLogoMark = {
  name: string
  imageUrl: string
  href?: string
}

export function visibleLogoMarks(items: LogoMark[]): VisibleLogoMark[] {
  return items.flatMap((item) => {
    const name = item.name?.trim()
    const imageUrl = item.imageUrl?.trim()
    if (!name || !imageUrl) return []
    return [{ name, imageUrl, href: item.href }]
  })
}

function LogoList({ marks }: { marks: VisibleLogoMark[] }) {
  return (
    <ul className="logo-strip">
      {marks.map((mark) => {
        const href = safeHttpUrl(mark.href)
        const image = <img src={mark.imageUrl} alt={mark.name} className="logo-strip-image" />
        return (
          <li key={`${mark.name}-${mark.imageUrl}`} className="logo-strip-item">
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {image}
              </a>
            ) : (
              image
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default function LogoStrip({
  heading,
  items,
  embedded = false,
}: {
  heading: string
  items: LogoMark[]
  embedded?: boolean
}) {
  const marks = visibleLogoMarks(items)
  if (marks.length === 0) return null

  if (embedded) {
    return (
      <div className="logo-strip-embedded">
        <h2 className="page-section-heading">{heading}</h2>
        <LogoList marks={marks} />
      </div>
    )
  }

  return (
    <section className="page-section page-section--muted section-reveal">
      <div className="page-section-container">
        <div className="page-section-center-header">
          <h2 className="page-section-heading">{heading}</h2>
        </div>
        <LogoList marks={marks} />
      </div>
    </section>
  )
}
