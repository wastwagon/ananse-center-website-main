import type { Metadata } from 'next'
import CmsPageShell from '../components/CmsPageShell'
import { buildPageMetadata } from './page-meta'
import { getCmsTexts, parseCmsJson, splitParagraphs, type ContentKey } from './cms/content'
import type { CmsLabeledValue } from './cms/registry'

type SimplePageConfig = {
  path: string
  metaTitle: string
  metaDescription: string
  badgeKey: ContentKey
  headingKey: ContentKey
  leadKey: ContentKey
  bodyKey?: ContentKey
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

export function buildSimpleCmsPageMetadata(config: SimplePageConfig): Metadata {
  return buildPageMetadata({
    title: config.metaTitle,
    description: config.metaDescription,
    path: config.path,
  })
}

export async function renderSimpleCmsPage(config: SimplePageConfig) {
  const keys = [config.badgeKey, config.headingKey, config.leadKey, ...(config.bodyKey ? [config.bodyKey] : [])] as ContentKey[]
  const cms = await getCmsTexts(keys)
  const paragraphs = config.bodyKey ? splitParagraphs(cms[config.bodyKey]) : []

  return (
    <CmsPageShell
      badge={cms[config.badgeKey]}
      title={cms[config.headingKey]}
      lead={cms[config.leadKey]}
      primaryCta={config.primaryCta}
      secondaryCta={config.secondaryCta}
    >
      <div className="content-prose-body">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 48)} className="page-body-text content-prose-p">
            {p}
          </p>
        ))}
      </div>
    </CmsPageShell>
  )
}

export async function loadLabeledRows(jsonKey: ContentKey, fallback: CmsLabeledValue[]) {
  const cms = await getCmsTexts([jsonKey] as const)
  return parseCmsJson<CmsLabeledValue[]>(cms[jsonKey], fallback)
}
