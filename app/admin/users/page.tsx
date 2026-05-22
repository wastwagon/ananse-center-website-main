'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import {
  adminMe,
  createAdminUser,
  deleteAdminUser,
  fetchAdminUsers,
  type AdminUserRow,
} from '../../../lib/admin-api'

const ROLES = ['superadmin', 'admin', 'editor', 'finance'] as const

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
      {loading ? <p>Loading users…</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      {!canManage ? (
        <p className="admin-help">
          Only superadmin accounts can create or remove users. You can view the team list below.
        </p>
      ) : (
        <form className="admin-form admin-card admin-card--spaced" onSubmit={onCreate}>
          <h2 className="admin-card-title">Add admin user</h2>
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
            <input
              id="user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          </div>
          <div className="admin-field">
            <label htmlFor="user-role">Role</label>
            <select id="user-role" value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Creating…' : 'Create user'}
          </button>
        </form>
      )}

      <div className="admin-card admin-card--spaced">
        <h2 className="admin-card-title">Team ({users.length})</h2>
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
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  {canManage ? (
                    <td>
                      {user.id !== currentId ? (
                        <button
                          type="button"
                          className="admin-btn admin-btn--ghost admin-btn--sm"
                          onClick={() => void onDelete(user.id)}
                        >
                          Remove
                        </button>
                      ) : (
                        <span className="admin-help">You</span>
                      )}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
