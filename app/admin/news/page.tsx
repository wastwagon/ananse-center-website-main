import { redirect } from 'next/navigation'

/** Insights replaced News for public publishing. Keep the old admin path as a redirect. */
export default function AdminNewsRedirectPage() {
  redirect('/admin/insights')
}
