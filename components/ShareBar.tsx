'use client'

import { useEffect, useState } from 'react'

type ShareBarProps = {
  title: string
  path: string
}

export default function ShareBar({ title, path }: ShareBarProps) {
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState(path)

  useEffect(() => {
    setUrl(`${window.location.origin}${path}`)
  }, [path])

  const encoded = encodeURIComponent(url)
  const text = encodeURIComponent(title)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="share-bar">
      <p className="share-bar-label">Share</p>
      <div className="share-bar-actions">
        <a
          className="btn-outline"
          href={`https://wa.me/?text=${text}%20${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
        <a
          className="btn-outline"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
        <a
          className="btn-outline"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <button type="button" className="btn-outline" onClick={copyLink}>
          {copied ? 'Link copied' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}
