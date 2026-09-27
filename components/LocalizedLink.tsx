'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { useI18n } from './I18nProvider'
import { localizedPath } from '../lib/locale-path'

type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string
}

/** Internal route link with `/fr` prefix when locale is French. */
export default function LocalizedLink({ href, ...props }: LocalizedLinkProps) {
  const { locale } = useI18n()
  const hashIndex = href.indexOf('#')
  const path = hashIndex >= 0 ? href.slice(0, hashIndex) : href
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : ''
  // Same-page anchors (#contact) must stay as hash-only — do not promote to "/#…"
  const localized = path ? localizedPath(path, locale) + hash : hash || '/'

  return <Link href={localized} {...props} />
}
