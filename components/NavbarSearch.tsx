'use client'

import { FormEvent, useEffect, useId, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useI18n } from './I18nProvider'
import { localizedPath } from '../lib/locale-path'
import { searchSite, type SearchResults } from '../lib/api'

type FlatHit = {
  key: string
  group: string
  title: string
  path: string
  snippet: string
}

type NavbarSearchProps = {
  /** Always-visible field (desktop) vs compact icon that expands (mobile). */
  variant?: 'field' | 'icon'
}

const GROUP_ORDER: Array<{ key: keyof SearchResults; label: string }> = [
  { key: 'programs', label: 'Programs' },
  { key: 'events', label: 'Events' },
  { key: 'library', label: 'Library' },
  { key: 'insights', label: 'Insights' },
  { key: 'people', label: 'People' },
  { key: 'photoAlbums', label: 'Photos' },
  { key: 'pages', label: 'Pages' },
]

function flattenResults(results: SearchResults, limit = 8): FlatHit[] {
  const hits: FlatHit[] = []
  for (const group of GROUP_ORDER) {
    const items = results[group.key]
    if (!items?.length) continue
    for (const item of items.slice(0, 3)) {
      hits.push({
        key: `${group.key}:${item.path}`,
        group: group.label,
        title: item.title,
        path: item.path,
        snippet: item.snippet,
      })
      if (hits.length >= limit) return hits
    }
  }
  return hits
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  )
}

export default function NavbarSearch({ variant = 'field' }: NavbarSearchProps) {
  const router = useRouter()
  const { locale, translate } = useI18n()
  const listId = useId()
  const inputId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [expanded, setExpanded] = useState(variant === 'field')
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<FlatHit[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'empty'>('idle')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [panelOpen, setPanelOpen] = useState(false)

  const open = variant === 'field' ? true : expanded

  function resetResults() {
    setQuery('')
    setHits([])
    setStatus('idle')
    setActiveIndex(-1)
    setPanelOpen(false)
  }

  function close() {
    resetResults()
    if (variant === 'icon') {
      setExpanded(false)
    }
  }

  function openSearch() {
    setExpanded(true)
  }

  useEffect(() => {
    if (!open) return
    if (variant === 'icon') {
      inputRef.current?.focus()
    }
  }, [open, variant])

  useEffect(() => {
    function onGlobalKey(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey
      if (mod && event.key.toLowerCase() === 'k') {
        // Desktop field owns ⌘K; icon variant only on mobile (when field is hidden).
        if (variant === 'icon' && window.matchMedia('(min-width: 768px)').matches) {
          return
        }
        if (
          isEditableTarget(event.target) &&
          !(event.target instanceof HTMLInputElement && event.target.id === inputId)
        ) {
          return
        }
        event.preventDefault()
        if (variant === 'icon') setExpanded(true)
        else inputRef.current?.focus()
        setPanelOpen(true)
        return
      }
      if (event.key === 'Escape' && (panelOpen || (variant === 'icon' && expanded))) {
        event.preventDefault()
        if (variant === 'icon') close()
        else {
          resetResults()
          inputRef.current?.blur()
        }
      }
    }
    window.addEventListener('keydown', onGlobalKey)
    return () => window.removeEventListener('keydown', onGlobalKey)
  }, [expanded, panelOpen, variant, inputId])

  useEffect(() => {
    if (!panelOpen && !(variant === 'icon' && expanded)) return
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        if (variant === 'icon') close()
        else setPanelOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [panelOpen, expanded, variant])

  useEffect(() => {
    const trimmed = query.trim()
    if (!open || trimmed.length < 2) {
      setHits([])
      setStatus('idle')
      setActiveIndex(-1)
      return
    }

    let cancelled = false
    setStatus('loading')
    const timer = window.setTimeout(() => {
      void searchSite(trimmed)
        .then((data) => {
          if (cancelled) return
          const next = flattenResults(data)
          setHits(next)
          setStatus(next.length ? 'idle' : 'empty')
          setActiveIndex(next.length ? 0 : -1)
          setPanelOpen(true)
        })
        .catch(() => {
          if (cancelled) return
          setHits([])
          setStatus('error')
          setActiveIndex(-1)
          setPanelOpen(true)
        })
    }, 220)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query, open])

  function goToHit(hit: FlatHit) {
    close()
    if (hit.path.startsWith('http')) {
      window.location.href = hit.path
      return
    }
    router.push(localizedPath(hit.path, locale))
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const trimmed = query.trim()
    if (trimmed.length < 2) return
    if (activeIndex >= 0 && hits[activeIndex]) {
      goToHit(hits[activeIndex])
      return
    }
    const q = trimmed
    close()
    router.push(`${localizedPath('/search', locale)}?q=${encodeURIComponent(q)}`)
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!hits.length) return
      setPanelOpen(true)
      setActiveIndex((index) => (index + 1) % hits.length)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!hits.length) return
      setPanelOpen(true)
      setActiveIndex((index) => (index <= 0 ? hits.length - 1 : index - 1))
      return
    }
  }

  const showPanel = panelOpen && query.trim().length >= 2

  if (variant === 'icon' && !expanded) {
    return (
      <button
        type="button"
        className="navbar-link navbar-search-link tap-target"
        aria-label={translate('nav.search')}
        title={`${translate('nav.search')} (⌘K)`}
        onClick={openSearch}
      >
        <Search size={18} strokeWidth={2} aria-hidden />
      </button>
    )
  }

  return (
    <div
      className={`navbar-search${variant === 'field' ? ' navbar-search--field' : ' navbar-search--icon'}`}
      ref={rootRef}
    >
      <form className="navbar-search-form" role="search" onSubmit={submit}>
        <label htmlFor={inputId} className="sr-only">
          {translate('nav.search')}
        </label>
        <Search size={16} strokeWidth={2} className="navbar-search-form-icon" aria-hidden />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          className="navbar-search-input"
          placeholder="Search programs, events, library…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setPanelOpen(true)
          }}
          onFocus={() => setPanelOpen(true)}
          onKeyDown={onInputKeyDown}
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={showPanel}
        />
        {variant === 'field' ? (
          <kbd className="navbar-search-kbd" aria-hidden>
            ⌘K
          </kbd>
        ) : null}
        {variant === 'icon' || query ? (
          <button
            type="button"
            className="navbar-search-close tap-target"
            aria-label={variant === 'icon' ? 'Close search' : 'Clear search'}
            onClick={() => {
              if (variant === 'icon') close()
              else resetResults()
            }}
          >
            <X size={16} strokeWidth={2} aria-hidden />
          </button>
        ) : null}
      </form>

      {showPanel ? (
        <div className="navbar-search-panel" id={listId} role="listbox" aria-label="Search suggestions">
          {status === 'loading' ? (
            <p className="navbar-search-status">Searching…</p>
          ) : null}
          {status === 'error' ? (
            <p className="navbar-search-status">Search is temporarily unavailable.</p>
          ) : null}
          {status === 'empty' ? (
            <p className="navbar-search-status">No matches yet. Try another word or open full results.</p>
          ) : null}
          {hits.length > 0 ? (
            <ul className="navbar-search-hits">
              {hits.map((hit, index) => (
                <li key={hit.key}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    className={`navbar-search-hit${index === activeIndex ? ' navbar-search-hit--active' : ''}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => goToHit(hit)}
                  >
                    <span className="navbar-search-hit-group">{hit.group}</span>
                    <span className="navbar-search-hit-title">{hit.title}</span>
                    {hit.snippet ? (
                      <span className="navbar-search-hit-snippet">{hit.snippet}</span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <button
            type="button"
            className="navbar-search-all"
            onClick={() => {
              const trimmed = query.trim()
              close()
              router.push(`${localizedPath('/search', locale)}?q=${encodeURIComponent(trimmed)}`)
            }}
          >
            View all results
          </button>
        </div>
      ) : null}
    </div>
  )
}
