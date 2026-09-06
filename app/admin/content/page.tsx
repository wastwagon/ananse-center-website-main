'use client'

import { FormEvent, Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminShell from '../../../components/admin/AdminShell'
import CmsRichTextEditor from '../../../components/admin/CmsRichTextEditor'
import CmsImagePathField from '../../../components/admin/CmsImagePathField'
import CmsJsonEditor from '../../../components/admin/CmsJsonEditor'
import {
  fetchContentBlocks,
  fetchContentRegistry,
  syncContentBlocksFromRegistry,
  updateContentBlock,
  type ContentBlock,
  type ContentRegistryItem,
} from '../../../lib/admin-api'
import { isImagePathContentKey, isJsonContentKey, isRichTextContentKey } from '../../../lib/cms/richtext'

export default function AdminContentPage() {
  return (
    <Suspense fallback={<AdminShell title="Site content"><p style={{ color: '#64748b' }}>Loading…</p></AdminShell>}>
      <AdminContentPageInner />
    </Suspense>
  )
}

function AdminContentPageInner() {
  const searchParams = useSearchParams()
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
  const [sectionFilter, setSectionFilter] = useState('all')
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')

  useEffect(() => {
    const q = searchParams.get('q')
    if (q != null) setQuery(q)
  }, [searchParams])

  const registryKeys = useMemo(() => new Set(registry.map((item) => item.key)), [registry])
  const registryByKey = useMemo(
    () => new Map(registry.map((item) => [item.key, item])),
    [registry],
  )
  const missingKeys = useMemo(
    () => registry.filter((item) => !blocks.some((block) => block.key === item.key)),
    [registry, blocks],
  )
  const sections = useMemo(
    () => ['all', ...Array.from(new Set(blocks.map((b) => b.section))).sort()],
    [blocks],
  )

  const filteredBlocks = useMemo(() => {
    const q = query.trim().toLowerCase()
    return blocks.filter((block) => {
      if (sectionFilter !== 'all' && block.section !== sectionFilter) return false
      if (!q) return true
      return (
        block.key.toLowerCase().includes(q) ||
        block.label.toLowerCase().includes(q) ||
        block.section.toLowerCase().includes(q)
      )
    })
  }, [blocks, sectionFilter, query])

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
      const meta = editingBlock ? registryByKey.get(editingBlock.key) : undefined
      const format =
        meta?.format === 'html' || (editingBlock && isRichTextContentKey(editingBlock.key))
          ? 'html'
          : editingBlock?.format
      await updateContentBlock(editingId, {
        body,
        published,
        ...(format ? { format } : {}),
      })
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
  const useRichText =
    !!editingBlock &&
    (editingMeta?.format === 'html' ||
      editingBlock.format === 'html' ||
      isRichTextContentKey(editingBlock.key))
  const useImageField = !!editingBlock && !useRichText && isImagePathContentKey(editingBlock.key)
  const useJsonEditor =
    !!editingBlock &&
    !useRichText &&
    !useImageField &&
    isJsonContentKey(editingBlock.key, editingMeta?.hint)
  const isJsonHint = !!editingMeta?.hint?.toLowerCase().includes('json')

  return (
    <AdminShell title="Site content">
      <p className="admin-help" style={{ marginBottom: '1rem' }}>
        Manage page copy, CTAs, stats, menus, hero images, and rich text. Contact details and social
        links live under Settings. Use <strong>Sync registry</strong> after deployments to add new
        keys.
      </p>

      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      <div className="admin-actions" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={() => void onSync()}
          disabled={syncing}
        >
          {syncing ? 'Syncing…' : 'Sync registry'}
        </button>
        <select
          className="admin-input"
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          aria-label="Filter by section"
          style={{ minWidth: 160 }}
        >
          {sections.map((section) => (
            <option key={section} value={section}>
              {section === 'all' ? 'All sections' : section}
            </option>
          ))}
        </select>
        <input
          className="admin-input"
          type="search"
          placeholder="Search key or label…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ minWidth: 220, flex: 1 }}
        />
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
            {useRichText ? <> — <strong>Rich text editor</strong></> : null}
            {useImageField ? <> — <strong>Image path + Media picker</strong></> : null}
            {useJsonEditor ? <> — <strong>JSON</strong> (structured editor)</> : null}
          </p>
          <form className="admin-form" onSubmit={onSubmit}>
            <div className="admin-field">
              <label htmlFor="body">Content</label>
              {useImageField ? (
                <CmsImagePathField value={body} onChange={setBody} label="Image path / Media URL" />
              ) : useRichText ? (
                <CmsRichTextEditor value={body} onChange={setBody} />
              ) : useJsonEditor ? (
                <CmsJsonEditor value={body} onChange={setBody} hint={editingMeta?.hint} />
              ) : (
                <textarea
                  id="body"
                  required
                  rows={isJsonHint ? 14 : 10}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  spellCheck={!isJsonHint}
                />
              )}
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
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving || !body.trim()}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
              <a
                className="admin-btn admin-btn--ghost"
                href={previewHrefForKey(editingBlock.key)}
                target="_blank"
                rel="noreferrer"
              >
                Preview page
              </a>
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
                <th>Editor</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredBlocks.map((block) => {
                const meta = registryByKey.get(block.key)
                const editorType =
                  meta?.format === 'html' || block.format === 'html' || isRichTextContentKey(block.key)
                    ? 'Rich text'
                    : isImagePathContentKey(block.key)
                      ? 'Image'
                      : isJsonContentKey(block.key, meta?.hint)
                        ? 'JSON'
                        : 'Text'
                return (
                  <tr key={block.id}>
                    <td>
                      <code>{block.key}</code>
                      {!registryKeys.has(block.key) ? (
                        <span className="admin-badge admin-badge--warn">Unregistered</span>
                      ) : null}
                    </td>
                    <td>{block.label}</td>
                    <td>{block.section}</td>
                    <td>{editorType}</td>
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
                )
              })}
            </tbody>
          </table>
        )}
        {!loading && filteredBlocks.length === 0 ? (
          <p className="admin-help">No content blocks match this filter.</p>
        ) : null}
      </div>
    </AdminShell>
  )
}

function previewHrefForKey(key: string): string {
  const section = key.split('.')[0]
  const map: Record<string, string> = {
    home: '/',
    about: '/about',
    programs: '/programs',
    events: '/events',
    support: '/support',
    contact: '/contact',
    videos: '/videos',
    trustees: '/trustees',
    privacy: '/privacy',
    terms: '/terms',
    visit: '/visit',
    news: '/news',
    site: '/',
  }
  return map[section] || '/'
}
