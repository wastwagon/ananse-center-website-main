import { redirect } from 'next/navigation'

/** Insights reshapes News — keep the old path as a redirect. */
export default function NewsPage() {
  redirect('/insights')
}
