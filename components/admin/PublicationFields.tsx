'use client'

import { useEffect, useState } from 'react'
import { adminMe } from '../../lib/admin-api'
import { PUBLICATION_STATUSES } from '../../lib/publication'

const PUBLISH_ROLES = new Set(['superadmin', 'admin', 'reviewer'])
const LOCKED = new Set(['published', 'scheduled', 'archived'])

export type PublicationFormValue = {
  publicationStatus: string
  scheduledAtLocal: string
  published: boolean
}

const LABELS: Record<string, string> = {
  draft: 'Draft',
  in_review: 'In review',
  scheduled: 'Scheduled',
  published: 'Published',
  archived: 'Archived',
}

export default function PublicationFields({
  value,
  onChange,
  checklist,
}: {
  value: PublicationFormValue
  onChange: (next: PublicationFormValue) => void
  checklist?: { label: string; ok: boolean }[]
}) {
  const [canPublish, setCanPublish] = useState(true)

  useEffect(() => {
    let active = true
    adminMe()
      .then((res) => {
        if (active) setCanPublish(PUBLISH_ROLES.has(res.user.role))
      })
      .catch(() => {
        if (active) setCanPublish(true)
      })
    return () => {
      active = false
    }
  }, [])

  const locked = !canPublish && LOCKED.has(value.publicationStatus)
  const choices = PUBLICATION_STATUSES.filter((status) => canPublish || !LOCKED.has(status) || status === value.publicationStatus)

  return (
    <>
      <div className="admin-field">
        <label htmlFor="publication-status">Publication status</label>
        <select
          id="publication-status"
          value={value.publicationStatus}
          disabled={locked}
          onChange={(e) => {
            const publicationStatus = e.target.value
            onChange({
              ...value,
              publicationStatus,
              published: publicationStatus === 'published',
            })
          }}
        >
          {choices.map((status) => (
            <option key={status} value={status}>
              {LABELS[status] || status}
            </option>
          ))}
        </select>
      </div>
      {value.publicationStatus === 'scheduled' ? (
        <div className="admin-field">
          <label htmlFor="scheduled-at">Scheduled publish time</label>
          <input
            id="scheduled-at"
            type="datetime-local"
            value={value.scheduledAtLocal}
            onChange={(e) => onChange({ ...value, scheduledAtLocal: e.target.value })}
            required
          />
        </div>
      ) : null}
      <p className="admin-help">
        Draft, in review, scheduled, and archived stay off public listings and search. Scheduled
        items become public at the chosen time. Editors can prepare drafts and send work for review.
        An admin or reviewer publishes, schedules, archives, or takes a page down.
      </p>
      {checklist && checklist.length > 0 ? (
        <ul className="admin-help">
          {checklist.map((item) => (
            <li key={item.label}>
              {item.ok ? 'Ready' : 'Needed'}: {item.label}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  )
}
