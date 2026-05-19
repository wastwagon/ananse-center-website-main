'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import {
  fetchContentBlocks,
  fetchContentRegistry,
  syncContentBlocksFromRegistry,
  updateContentBlock,
  type ContentBlock,
  type ContentRegistryItem,
} from '../../../lib/admin-api'

export default function AdminContentPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [registry, setRegistry] = useState<ContentRegistryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [body, setBody] = useState('')
  const [published, setPublished] = useState(true)
  const [saving, setSaving] = useState(false)

  const registryKeys = useMemo(() => new Set(registry.map((item) => item.key)), [registry])
  const registryByKey = useMemo(
    () => new Map(registry.map((item) => [item.key, item])),
    [registry],
  )
  const missingKeys = useMemo(
    () => registry.filter((item) => !blocks.some((block) => block.key === item.key)),
    [registry, blocks],
  )

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [blocksRes, registryRes] = await Promise.all([
        fetchContentBlocks(),
        fetchContentRegistry(),
      ])
      setBlocks(blocksRes.data)
      setRegistry(registryRes.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function startEdit(block: ContentBlock) {
    setEditingId(block.id)
    setBody(block.body)
    setPublished(block.published)
  }

  async function onSync() {
    setSyncing(true)
    setError(null)
    setNotice(null)
    try {
      const { created } = await syncContentBlocksFromRegistry()
      setNotice(
        created > 0
          ? `Added ${created} block${created === 1 ? '' : 's'} from the registry.`
          : 'All registry blocks are already in the database.',
      )
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!editingId) return
    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      await updateContentBlock(editingId, { body, published })
      setEditingId(null)
      setNotice('Content saved.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const editingBlock = blocks.find((block) => block.id === editingId) ?? null
  const editingMeta = editingBlock ? registryByKey.get(editingBlock.key) : undefined

  return (
    <AdminShell title="Site content">
      <p className="admin-help" style={{ marginBottom: '1rem' }}>
        Long-form copy is managed through a fixed registry — one block per key, no duplicate
        sections. Contact details and social links live under Settings.
      </p>

      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      <div className="admin-actions" style={{ marginBottom: '1rem' }}>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={() => void onSync()}
          disabled={syncing}
        >
          {syncing ? 'Syncing…' : 'Sync registry'}
        </button>
      </div>

      {missingKeys.length > 0 ? (
        <p className="admin-help admin-help--warn" style={{ marginBottom: '1rem' }}>
          {missingKeys.length} registry block{missingKeys.length === 1 ? '' : 's'} not in the
          database yet. Run sync before editing the public site.
        </p>
      ) : null}

      {editingBlock ? (
        <div className="admin-card admin-card--spaced">
          <h2 className="admin-card-title">{editingBlock.label}</h2>
          <p className="admin-help">
            <code>{editingBlock.key}</code>
            {editingMeta?.hint ? <> — {editingMeta.hint}</> : null}
          </p>
          <form className="admin-form" onSubmit={onSubmit}>
            <div className="admin-field">
              <label htmlFor="body">Content</label>
              <textarea
                id="body"
                required
                rows={10}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
            <label className="admin-toggle-row">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              <span>Published on public site</span>
            </label>
            <div className="admin-actions">
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="admin-card">
        {loading ? (
          <p>Loading content…</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Label</th>
                <th>Section</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {blocks.map((block) => (
                <tr key={block.id}>
                  <td>
                    <code>{block.key}</code>
                    {!registryKeys.has(block.key) ? (
                      <span className="admin-badge admin-badge--warn">Unregistered</span>
                    ) : null}
                  </td>
                  <td>{block.label}</td>
                  <td>{block.section}</td>
                  <td>{block.published ? 'Published' : 'Draft'}</td>
                  <td>
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => startEdit(block)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  )
}
