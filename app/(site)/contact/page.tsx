import { redirect } from 'next/navigation'

/** Contact lives under Get Involved — keep the old path as a redirect. */
export default function ContactPage() {
  redirect('/get-involved#contact')
}
