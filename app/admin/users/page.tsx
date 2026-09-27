'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import AdminRowActions from '../../../components/admin/AdminRowActions'
import {
  adminMe,
  createAdminUser,
  deleteAdminUser,
  fetchAdminUsers,
  type AdminUserRow,
} from '../../../lib/admin-api'

const ROLES = [
  { value: 'superadmin', label: 'Super admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'finance', label: 'Finance' },
] as const

function roleLabel(role: string) {
  return ROLES.find((item) => item.value === role)?.label ?? role
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [currentRole, setCurrentRole] = useState<string>('admin')
  const [currentId, setCurrentId] = useState<string>('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<string>('editor')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)

  const canManage = currentRole === 'superadmin'

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [usersRes, meRes] = await Promise.all([fetchAdminUsers(), adminMe()])
      setUsers(usersRes.data)
      setCurrentRole(meRes.user.role)
      setCurrentId(meRes.user.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function onCreate(event: FormEvent) {
    event.preventDefault()
    if (!canManage) return
    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      await createAdminUser({ email, password, name, role })
      setEmail('')
      setName('')
      setPassword('')
      setRole('editor')
      setInviteOpen(false)
      setNotice('Admin user created.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(id: string) {
    if (!canManage || !confirm('Remove this admin user?')) return
    try {
      await deleteAdminUser(id)
      setNotice('User removed.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <AdminShell title="Admin users">
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      <div className="admin-page-tools">
        <p className="admin-help">
          {canManage
            ? 'People who can sign in to this CMS.'
            : 'Only a super admin can invite or remove people. You can view the team.'}
        </p>
        {canManage ? (
          <button type="button" className="admin-btn admin-btn--primary" onClick={() => setInviteOpen(true)}>
            Invite user
          </button>
        ) : null}
      </div>

      {canManage && inviteOpen ? (
        <form className="admin-form admin-card admin-card--spaced" onSubmit={onCreate}>
          <h2 className="admin-card-title">Invite user</h2>
          <div className="admin-field-row">
            <div className="admin-field">
              <label htmlFor="user-email">Email</label>
              <input
                id="user-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="user-name">Name</label>
              <input id="user-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>
          <div className="admin-field-row">
            <div className="admin-field">
              <label htmlFor="user-password">Password</label>
              <input
                id="user-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
              <p className="admin-meta">At least 8 characters.</p>
            </div>
            <div className="admin-field">
              <label htmlFor="user-role">Role</label>
              <select id="user-role" value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="admin-actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving ? 'Creating…' : 'Create user'}
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setInviteOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Loading users…</p>
        ) : users.length === 0 ? (
          <p className="admin-empty">No admin users yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  {canManage ? <th /> : null}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name}</strong>
                      {user.id === currentId ? <span className="admin-badge admin-badge--neutral">You</span> : null}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className="admin-badge admin-badge--neutral">{roleLabel(user.role)}</span>
                    </td>
                    {canManage ? (
                      <td>
                        {user.id !== currentId ? (
                          <AdminRowActions
                            items={[
                              { label: 'Remove', tone: 'danger', onClick: () => void onDelete(user.id) },
                            ]}
                          />
                        ) : null}
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
