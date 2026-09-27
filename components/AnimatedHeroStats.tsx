'use client'

import type { CmsHeroStat } from '../lib/cms/registry'

/**
 * Compact pillar strip for word-based hero values.
 * Avoids the glass tile grid that clipped long labels at desktop widths.
 */
export default function AnimatedHeroStats({ stats }: { stats: readonly CmsHeroStat[] }) {
  if (!stats.length) return null

  return (
    <ul className="hero-premium-pillars">
      {stats.map((stat) => (
        <li key={`${stat.value}-${stat.label}`} className="hero-premium-pillar">
          <span className="hero-premium-pillar-value">{stat.value}</span>
          <span className="hero-premium-pillar-label">{stat.label}</span>
        </li>
      ))}
    </ul>
  )
}
