import type { ReactNode } from 'react'
import type { CmsHeroTitle, CmsHomeHeroTitle } from './registry'

export function renderSplitHeroTitle(title: CmsHeroTitle): ReactNode {
  return (
    <>
      {title.prefix}
      <span className="text-accent">{title.accent}</span>
    </>
  )
}

export function renderHomeHeroTitle(title: CmsHomeHeroTitle): ReactNode {
  return (
    <>
      {title.line1}
      <span className="hero-premium-title-accent">{title.accent}</span>
    </>
  )
}
