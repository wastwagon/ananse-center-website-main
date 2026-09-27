'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'

export type AdminRowAction = {
  label: string
  onClick?: () => void
  href?: string
  external?: boolean
  tone?: 'default' | 'danger'
}

export default function AdminRowActions({ items }: { items: AdminRowAction[] }) {
  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (items.length === 0) return null

  return (
    <div className="admin-row-actions" ref={rootRef}>
      <button
        type="button"
        className="admin-btn admin-btn--ghost admin-btn--sm"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => {
          if (!open && rootRef.current) {
            const rect = rootRef.current.getBoundingClientRect()
            setDropUp(window.innerHeight - rect.bottom < 180)
          }
          setOpen((value) => !value)
        }}
      >
        Actions
      </button>
      {open ? (
        <div className={`admin-row-menu${dropUp ? ' is-up' : ''}`} id={menuId} role="menu">
          {items.map((item) => {
            const className = `admin-row-menu-item${item.tone === 'danger' ? ' is-danger' : ''}`
            if (item.href && item.external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={className}
                  role="menuitem"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              )
            }
            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={className}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              )
            }
            return (
              <button
                key={item.label}
                type="button"
                className={className}
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  item.onClick?.()
                }}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
