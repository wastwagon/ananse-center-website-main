import CmsPageShell from './CmsPageShell'
import { getRequestLocale, localizePageChrome } from '../lib/cms-page-locale'

type LocalizedCmsPageShellProps = {
  /** i18n key prefix, e.g. `page.visit` */
  i18nKey: string
  badge: string
  title: string
  lead?: string
  children: React.ReactNode
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  wide?: boolean
}

export default async function LocalizedCmsPageShell({
  i18nKey,
  badge,
  title,
  lead,
  children,
  primaryCta,
  secondaryCta,
  wide,
}: LocalizedCmsPageShellProps) {
  const locale = await getRequestLocale()
  const chrome = localizePageChrome(locale, i18nKey, { badge, title, lead })

  return (
    <CmsPageShell
      badge={chrome.badge}
      title={chrome.title}
      lead={chrome.lead}
      primaryCta={primaryCta}
      secondaryCta={secondaryCta}
      wide={wide}
    >
      {children}
    </CmsPageShell>
  )
}
