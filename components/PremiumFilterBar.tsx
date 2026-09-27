'use client'

import LocalizedLink from './LocalizedLink'

export type PremiumFilterOption = {
  value: string
  label: string
  href?: string
}

export type PremiumFilterGroup = {
  label: string
  ariaLabel: string
  value: string
  variant?: 'segment' | 'tabs'
  options: PremiumFilterOption[]
  onChange?: (value: string) => void
}

type FilterRow =
  | { type: 'cluster'; groups: PremiumFilterGroup[] }
  | { type: 'tabs'; group: PremiumFilterGroup }

function groupRows(groups: PremiumFilterGroup[]): FilterRow[] {
  const rows: FilterRow[] = []
  for (const group of groups) {
    const variant = group.variant ?? 'segment'
    if (variant === 'tabs') {
      rows.push({ type: 'tabs', group })
      continue
    }
    const last = rows[rows.length - 1]
    if (last?.type === 'cluster') last.groups.push(group)
    else rows.push({ type: 'cluster', groups: [group] })
  }
  return rows
}

export default function PremiumFilterBar({ groups }: { groups: PremiumFilterGroup[] }) {
  if (groups.length === 0) return null
  const rows = groupRows(groups)
  const simple = groups.length <= 1

  return (
    <div
      className={`premium-filter-bar${simple ? ' premium-filter-bar--simple' : ''}${
        groups.some((group) => group.variant === 'tabs') ? ' premium-filter-bar--with-tabs' : ''
      }`}
    >
      {rows.map((row, index) =>
        row.type === 'cluster' ? (
          <div key={`cluster-${index}`} className="premium-filter-clusters">
            {row.groups.map((group) => (
              <FilterGroup key={group.ariaLabel} group={group} />
            ))}
          </div>
        ) : (
          <FilterGroup key={row.group.ariaLabel} group={row.group} />
        ),
      )}
    </div>
  )
}

function FilterGroup({ group }: { group: PremiumFilterGroup }) {
  const variant = group.variant ?? 'segment'
  return (
    <div className={`premium-filter-group premium-filter-group--${variant}`}>
      <p className="premium-filter-label">{group.label}</p>
      <div className="premium-filter-track" role="tablist" aria-label={group.ariaLabel}>
        {group.options.map((option) => {
          const active = option.value === group.value
          const className = `premium-filter-btn premium-filter-btn--${variant}${active ? ' is-active' : ''}`
          if (option.href) {
            return (
              <LocalizedLink
                key={option.value}
                href={option.href}
                role="tab"
                aria-selected={active}
                className={className}
              >
                {option.label}
              </LocalizedLink>
            )
          }
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={active}
              className={className}
              onClick={() => group.onChange?.(option.value)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
