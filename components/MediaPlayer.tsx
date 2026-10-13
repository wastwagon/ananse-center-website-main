import { toEmbedSrc } from '../lib/cms/iframe-embed'

type MediaPlayerProps = {
  url: string
  title: string
  kind: 'audio' | 'video'
}

function isFileMedia(url: string) {
  return (
    /\/api\/media\/file\//.test(url) ||
    /\.(mp3|m4a|wav|ogg|mp4|webm|mov)(\?|$)/i.test(url)
  )
}

/** Play a file, or an allowlisted YouTube or Vimeo address, without an empty player. */
export default function MediaPlayer({ url, title, kind }: MediaPlayerProps) {
  const source = url.trim()
  if (!source) return null
  const embed = kind === 'video' ? toEmbedSrc(source) : null

  if (embed && !isFileMedia(source)) {
    return (
      <div className="cms-embed">
        <iframe
          src={embed}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (kind === 'audio') {
    return (
      <audio controls preload="none" src={source} className="library-detail-audio">
        Your browser does not support audio playback.
      </audio>
    )
  }

  if (isFileMedia(source)) {
    return (
      <video controls preload="metadata" src={source} className="library-detail-video">
        Your browser does not support video playback.
      </video>
    )
  }

  return (
    <a href={source} className="btn-outline" target="_blank" rel="noopener noreferrer">
      Open video
    </a>
  )
}
