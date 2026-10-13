import { Node, mergeAttributes } from '@tiptap/core'

const ALLOWED_HOSTS = [
  'www.youtube.com',
  'youtube.com',
  'youtu.be',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
  'vimeo.com',
  'open.spotify.com',
  'w.soundcloud.com',
]

export function toEmbedSrc(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  let url: URL
  try {
    url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)
  } catch {
    return null
  }
  const host = url.hostname.replace(/^www\./, '')
  if (host === 'youtu.be') {
    const id = url.pathname.replace(/^\//, '').split('/')[0]
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const id = url.searchParams.get('v') || url.pathname.split('/embed/')[1]?.split('/')[0]
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  if (host === 'vimeo.com') {
    const id = url.pathname.split('/').filter(Boolean)[0]
    return id ? `https://player.vimeo.com/video/${id}` : null
  }
  if (ALLOWED_HOSTS.some((allowed) => url.hostname === allowed || url.hostname.endsWith(`.${allowed}`))) {
    return url.toString()
  }
  return null
}

export const IframeEmbed = Node.create({
  name: 'iframeEmbed',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      title: { default: 'Embedded media' },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-embed-iframe]',
        getAttrs: (el) => {
          if (!(el instanceof HTMLElement)) return false
          const iframe = el.querySelector('iframe')
          const src = iframe?.getAttribute('src')
          if (!src || !toEmbedSrc(src)) return false
          return { src: toEmbedSrc(src), title: iframe?.getAttribute('title') || 'Embedded media' }
        },
      },
      {
        tag: 'iframe[src]',
        getAttrs: (el) => {
          if (!(el instanceof HTMLElement)) return false
          const src = toEmbedSrc(el.getAttribute('src') || '')
          if (!src) return false
          return { src, title: el.getAttribute('title') || 'Embedded media' }
        },
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    const src = toEmbedSrc(String(HTMLAttributes.src || ''))
    if (!src) return ['div', { class: 'cms-embed cms-embed--invalid' }, 'Invalid embed']
    return [
      'div',
      mergeAttributes({ class: 'cms-embed', 'data-embed-iframe': 'true' }),
      [
        'iframe',
        {
          src,
          title: HTMLAttributes.title || 'Embedded media',
          loading: 'lazy',
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          allowfullscreen: 'true',
          referrerpolicy: 'strict-origin-when-cross-origin',
          frameborder: '0',
        },
      ],
    ]
  },
})
