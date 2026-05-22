# Coolify deployment — environment variables

Self-hosted stack only (no WordPress or third-party CMS). Set variables on the Coolify application that uses `docker-compose.yml` at the repo root.

**Rebuild `web` after any `NEXT_PUBLIC_*` change** (values are baked into the Next.js build).

Copy-paste production baseline: [`config/coolify-production.env.example`](config/coolify-production.env.example)

Staging / preview: [`config/coolify-staging.env.example`](config/coolify-staging.env.example) (`NEXT_PUBLIC_ROBOTS_NOINDEX=true`).

---

## Production — recommended settings

| Variable | Recommended value | Why |
|----------|-------------------|-----|
| `NODE_ENV` | `production` | Set in compose for API + web |
| `NEXT_PUBLIC_SITE_URL` | `https://www.anansecenter.org` | HTTPS, no trailing slash |
| `NEXT_PUBLIC_API_URL` | Same as site URL* | Browser calls API (or separate API subdomain) |
| `API_INTERNAL_URL` | `http://backend:4000` | Next.js → API inside Docker network |
| `CORS_ORIGIN` | Exact site origin | Must match browser URL (scheme + host) |
| `SKIP_PRISMA_SEED` | `true` | After first successful deploy |
| `ADMIN_ALLOW_SYSTEM_OPS` | unset or `false` | Blocks migrate/seed from admin UI in prod |
| `ADMIN_ROLE` | `superadmin` | First seeded admin |
| `ADMIN_JWT_SECRET` | 48+ random chars | Never reuse dev secret |
| `COOKIE_SECURE` | `true` | Secure admin cookies over HTTPS |
| `TRUST_PROXY` | `true` | Correct client IP behind Coolify proxy |
| `POSTGRES_PASSWORD` | Strong unique | Not `change_me` |
| `PAYSTACK_*` | Live keys (`pk_live_` / `sk_live_`) | Test keys only on staging |

\*If API is on a subdomain, set `NEXT_PUBLIC_API_URL=https://api.anansecenter.org` and add both origins to `CORS_ORIGIN` comma-separated.

### Integrations (optional)

| Variable | Purpose |
|----------|---------|
| `LEGACY_SITE_HOST` | Hostname only → 301 to `NEXT_PUBLIC_SITE_URL` |
| `NEXT_PUBLIC_LEGACY_SITE_HOST` | Same, for build + middleware |
| `NEXT_PUBLIC_LMS_PORTAL_URL` | Your LMS portal link |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-…` analytics |
| `CRM_WEBHOOK_URL` | Outbound webhook (donations, contact, newsletter, registrations, community) |
| `NOTIFY_EMAIL_TO` | Comma-separated staff inboxes (optional) |
| `NOTIFY_FROM_EMAIL` + `SMTP_*` or `RESEND_API_KEY` | Email alerts when `NOTIFY_EMAIL_TO` is set |

### Rate limits (optional)

| Variable | Default | Purpose |
|----------|---------|---------|
| `RATE_LIMIT_MAX` | `60` | General API requests per minute per IP |
| `RATE_LIMIT_AUTH_MAX` | `10` | Admin login attempts per minute |

---

## Development — recommended settings

| Variable | Value |
|----------|--------|
| `SKIP_PRISMA_SEED` | `false` |
| `ADMIN_ALLOW_SYSTEM_OPS` | `true` (optional, for admin System page) |
| `COOKIE_SECURE` | unset (localhost HTTP) |
| `TRUST_PROXY` | unset |
| Paystack | `pk_test_` / `sk_test_` |

---

## Required variables (all environments)

| Variable | Service |
|----------|---------|
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | postgres |
| `NEXT_PUBLIC_SITE_URL` | web + backend |
| `NEXT_PUBLIC_API_URL` | web |
| `API_INTERNAL_URL` | web |
| `CORS_ORIGIN` | backend |
| `PAYSTACK_SECRET_KEY`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | backend / web |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_JWT_SECRET` | backend (first boot) |

---

## Deploy checklist

1. Paste production env from `config/coolify-production.env.example` into Coolify.
2. **Redeploy with rebuild** (both `web` and `backend`).
3. First boot only: `SKIP_PRISMA_SEED=false` → deploy → verify admin login → set `SKIP_PRISMA_SEED=true` → redeploy.
4. Admin → **Settings → Integrations** (LMS, GA, legacy host) or rely on env.
5. Admin → **System** — confirm “Seed on deploy: No” and “System ops: disabled” in production.
6. Smoke-test: `GET /api/v1/health`, `GET /api/health` (web), legacy 301, donate flow, `/admin/login`.
7. Admin → **System** — production checklist green; fix any **Environment warnings**.

---

## Backups & monitoring (recommended)

| Task | Recommendation |
|------|----------------|
| **Postgres** | Schedule volume snapshots or `pg_dump` from the `postgres` container |
| **Media uploads** | Backup Docker volume `media_uploads` (program/event images) |
| **Logs** | Coolify log retention; watch API boot for `[production-env]` warnings |
| **Uptime** | HTTP check `GET /api/v1/health` (API) and `GET /api/health` (web) |
| **Strict deploy** | After env is stable, set `STRICT_PRODUCTION_ENV=true` so bad secrets block boot |

---

## Common mistakes

- `SITE_URL` — use `NEXT_PUBLIC_SITE_URL`
- `API_INTERNAL_URL` must be `http://backend:4000`, not the public URL
- `LEGACY_SITE_HOST` — hostname only, no `https://`
- `CORS_ORIGIN` — no path, exact origin
- Forgetting to **rebuild web** after changing `NEXT_PUBLIC_*`

---

## Security (built into the stack)

- Admin session: httpOnly cookie, `secure` when HTTPS / `COOKIE_SECURE=true`
- API: security headers, rate limiting (general + forms + auth + donations), role-based admin routes
- API boot: production env validation logs warnings; optional `STRICT_PRODUCTION_ENV=true`
- Next.js: security headers + HSTS when site URL is HTTPS (`next.config.mjs`)
- Staging: `NEXT_PUBLIC_ROBOTS_NOINDEX=true` blocks crawlers
- Production: disable `ADMIN_ALLOW_SYSTEM_OPS`; use entrypoint migrations only
