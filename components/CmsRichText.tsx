import { cmsBodyToSafeHtml } from '../lib/cms/richtext'

type CmsRichTextProps = {
  body: string
  className?: string
}

/** Renders CMS plain text or rich HTML safely. */
export default function CmsRichText({ body, className = 'cms-richtext' }: CmsRichTextProps) {
  const html = cmsBodyToSafeHtml(body)
  if (!html) return null
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
