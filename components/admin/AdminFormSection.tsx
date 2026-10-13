import type { ReactNode } from 'react'

export default function AdminFormSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <fieldset className="admin-form-section">
      <legend className="admin-form-section-title">{title}</legend>
      <div className="admin-form-section-body">{children}</div>
    </fieldset>
  )
}
