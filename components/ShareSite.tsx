'use client'

import { useState } from 'react'

export default function ShareSite({ id = 'share' }: { id?: string }) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    const url = window.location.origin
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div id={id} className="premium-card">
      <h2 className="premium-card-title">Share</h2>
      <p className="page-body-text">
        Help others discover resources that can add value to their lives. Share the ANANSE website with someone who would benefit from it.
      </p>
      <button type="button" className="btn-outline" onClick={copyLink}>
        {copied ? 'Link copied' : 'Copy website link'}
      </button>
    </div>
  )
}
