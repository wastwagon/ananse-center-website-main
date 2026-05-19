import AdminShell from '../../components/admin/AdminShell'
import AdminDashboardHome from '../../components/admin/AdminDashboardHome'

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard">
      <AdminDashboardHome />
    </AdminShell>
  )
}
