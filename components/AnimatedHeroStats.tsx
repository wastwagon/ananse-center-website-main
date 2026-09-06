'use client'

import { useEffect, useRef, useState } from 'react'
import type { CmsHeroStat } from '../lib/cms/registry'

function parseStatValue(value: string): { prefix: string; number: number; suffix: string } | null {
  const match = value.trim().match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  const number = Number(match[2])
  if (Number.isNaN(number)) return null
  return { prefix: match[1], number, suffix: match[3] }
}

function AnimatedValue({ value }: { value: string }) {
  const parsed = parseStatValue(value)
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (!parsed) {
      setDisplay(value)
      return
    }

    const node = ref.current
    if (!node) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setDisplay(value)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        const duration = 1100
        const start = performance.now()

        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration)
          const eased = 1 - (1 - progress) ** 3
          const current = Math.round(parsed.number * eased)
          setDisplay(`${parsed.prefix}${current}${parsed.suffix}`)
          if (progress < 1) requestAnimationFrame(tick)
          else setDisplay(value)
        }

        requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [parsed, value])

  return (
    <span ref={ref} className="hero-premium-stat-value">
      {display}
    </span>
  )
}

export default function AnimatedHeroStats({ stats }: { stats: readonly CmsHeroStat[] }) {
  return (
    <div className="hero-premium-stats" role="list">
      {stats.map((stat) => (
        <div key={stat.label} className="hero-premium-stat" role="listitem">
          <AnimatedValue value={stat.value} />
          <span className="hero-premium-stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
