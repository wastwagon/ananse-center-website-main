'use client'

import { useState } from 'react'
import CmsImagePathField from './CmsImagePathField'

type CmsJsonEditorProps = {
  value: string
  onChange: (next: string) => void
  hint?: string
}

type FieldKind = 'text' | 'number' | 'boolean' | 'image' | 'textarea'

const IMAGE_KEYS = new Set([
  'imageUrl',
  'photoUrl',
  'coverImage',
  'image',
  'src',
  'url',
  'ogImage',
])

function fieldKind(key: string, sample: unknown): FieldKind {
  if (IMAGE_KEYS.has(key) || /photo|image|cover|logo/i.test(key)) return 'image'
  if (typeof sample === 'boolean') return 'boolean'
  if (typeof sample === 'number') return 'number'
  if (typeof sample === 'string' && sample.length > 120) return 'textarea'
  if (/quote|bio|description|body|lead/i.test(key)) return 'textarea'
  return 'text'
}

type ParseResult = { ok: true; data: unknown } | { ok: false; error: string }

function safeParse(value: string): ParseResult {
  try {
    return { ok: true, data: JSON.parse(value || 'null') }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Invalid JSON' }
  }
}

function stringify(data: unknown): string {
  return JSON.stringify(data, null, 2)
}

function emptyItemFromKeys(keys: string[]): Record<string, unknown> {
  const item: Record<string, unknown> = {}
  for (const key of keys) {
    if (IMAGE_KEYS.has(key)) item[key] = ''
    else if (/amount|capacity|sortOrder|value/.test(key) && key !== 'value') item[key] = 0
    else item[key] = ''
  }
  return item
}

export default function CmsJsonEditor({ value, onChange, hint }: CmsJsonEditorProps) {
  const [rawMode, setRawMode] = useState(false)
  const parsed: ParseResult = safeParse(value)

  if (rawMode || !parsed.ok) {
    const parseError = 'error' in parsed ? parsed.error : ''
    return (
      <div className="cms-json-editor">
        <div className="admin-actions" style={{ marginBottom: '0.5rem' }}>
          {parsed.ok ? (
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => setRawMode(false)}
            >
              Structured editor
            </button>
          ) : (
            <p className="admin-error" style={{ margin: 0 }}>
              Fix JSON to use the structured editor: {parseError}
            </p>
          )}
        </div>
        {hint ? <p className="admin-help">{hint}</p> : null}
        <textarea
          id="body"
          required
          rows={16}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="admin-input"
          style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
        />
      </div>
    )
  }

  const data = parsed.data

  return (
    <div className="cms-json-editor">
      <div className="admin-actions" style={{ marginBottom: '0.75rem' }}>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setRawMode(true)}>
          Edit as raw JSON
        </button>
      </div>
      {hint ? <p className="admin-help">{hint}</p> : null}

      {Array.isArray(data) ? (
        <ArrayEditor
          items={data}
          onChange={(items) => onChange(stringify(items))}
        />
      ) : data && typeof data === 'object' ? (
        <ObjectEditor
          value={data as Record<string, unknown>}
          onChange={(next) => onChange(stringify(next))}
        />
      ) : (
        <p className="admin-help">Unsupported JSON root. Switch to raw JSON.</p>
      )}
    </div>
  )
}

function ObjectEditor({
  value,
  onChange,
}: {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
}) {
  const entries = Object.entries(value)
  const allBoolean = entries.length > 0 && entries.every(([, v]) => typeof v === 'boolean')

  if (allBoolean) {
    return (
      <div className="admin-form" style={{ gap: '0.5rem' }}>
        {entries.map(([key, checked]) => (
          <label key={key} className="admin-toggle-row">
            <input
              type="checkbox"
              checked={Boolean(checked)}
              onChange={(e) => onChange({ ...value, [key]: e.target.checked })}
            />
            <span>Show section: <code>{key}</code></span>
          </label>
        ))}
      </div>
    )
  }

  return (
    <div className="admin-form">
      {entries.map(([key, fieldValue]) => (
        <FieldRow
          key={key}
          fieldKey={key}
          value={fieldValue}
          onChange={(next) => onChange({ ...value, [key]: next })}
        />
      ))}
    </div>
  )
}

function ArrayEditor({
  items,
  onChange,
}: {
  items: unknown[]
  onChange: (items: unknown[]) => void
}) {
  if (items.every((item) => typeof item === 'string')) {
    const strings = items as string[]
    return (
      <div className="admin-form">
        {strings.map((item, index) => (
          <div key={index} className="admin-field">
            <label>Item {index + 1}</label>
            <div className="admin-actions" style={{ alignItems: 'stretch' }}>
              <input
                className="admin-input"
                value={item}
                onChange={(e) => {
                  const next = [...strings]
                  next[index] = e.target.value
                  onChange(next)
                }}
              />
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => onChange(strings.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={() => onChange([...strings, ''])}
        >
          Add item
        </button>
      </div>
    )
  }

  if (items.every((item) => item && typeof item === 'object' && !Array.isArray(item))) {
    const objects = items as Record<string, unknown>[]
    const keys = Array.from(
      new Set(objects.flatMap((item) => Object.keys(item))),
    )

    return (
      <div className="admin-form" style={{ gap: '1rem' }}>
        {objects.map((item, index) => (
          <div key={index} className="admin-card" style={{ padding: '1rem' }}>
            <div className="admin-actions" style={{ marginBottom: '0.75rem', justifyContent: 'space-between' }}>
              <strong>Item {index + 1}</strong>
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => onChange(objects.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
            {keys.map((key) => (
              <FieldRow
                key={key}
                fieldKey={key}
                value={item[key] ?? ''}
                onChange={(next) => {
                  const copy = objects.map((row) => ({ ...row }))
                  copy[index] = { ...copy[index], [key]: next }
                  onChange(copy)
                }}
              />
            ))}
          </div>
        ))}
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={() =>
            onChange([...objects, emptyItemFromKeys(keys.length ? keys : ['label', 'href'])])
          }
        >
          Add item
        </button>
      </div>
    )
  }

  return <p className="admin-help">Mixed array types — use raw JSON.</p>
}

function FieldRow({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string
  value: unknown
  onChange: (next: unknown) => void
}) {
  const kind = fieldKind(fieldKey, value)

  if (kind === 'boolean') {
    return (
      <label className="admin-toggle-row">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{fieldKey}</span>
      </label>
    )
  }

  if (kind === 'image') {
    return (
      <div className="admin-field">
        <label>{fieldKey}</label>
        <CmsImagePathField
          value={typeof value === 'string' ? value : ''}
          onChange={(next) => onChange(next)}
          label={fieldKey}
        />
      </div>
    )
  }

  if (kind === 'number') {
    return (
      <div className="admin-field">
        <label htmlFor={`json-${fieldKey}`}>{fieldKey}</label>
        <input
          id={`json-${fieldKey}`}
          className="admin-input"
          type="number"
          value={typeof value === 'number' ? value : Number(value) || 0}
          onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        />
      </div>
    )
  }

  if (kind === 'textarea') {
    return (
      <div className="admin-field">
        <label htmlFor={`json-${fieldKey}`}>{fieldKey}</label>
        <textarea
          id={`json-${fieldKey}`}
          className="admin-input"
          rows={4}
          value={typeof value === 'string' ? value : String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  }

  return (
    <div className="admin-field">
      <label htmlFor={`json-${fieldKey}`}>{fieldKey}</label>
      <input
        id={`json-${fieldKey}`}
        className="admin-input"
        value={typeof value === 'string' ? value : String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
