'use client'

import { useEffect } from 'react'

export default function SectionRevealInit() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-reveal--visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -4% 0px', threshold: 0.01 },
    )

    const attach = (el: HTMLElement) => {
      if (el.classList.contains('section-reveal--visible')) return
      if (reduced) {
        el.classList.add('section-reveal--visible')
        return
      }
      observer.observe(el)
    }

    const scan = () => {
      document.querySelectorAll<HTMLElement>('.section-reveal').forEach(attach)
    }

    scan()
    const mutations = new MutationObserver(scan)
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
  }, [])

  return null
}
