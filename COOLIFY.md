# Coolify deployment — environment variables

Set these on the **same Coolify application** that uses `docker-compose.yml` at the repo root. Rebuild **web** after changing any `NEXT_PUBLIC_*` value (they are baked into the Next.js client bundle at build time).

## Required (production)

| Variable | Service | Purpose |
|----------|---------|---------|
| `POSTGRES_USER` | postgres | Database user |
| `POSTGRES_PASSWORD` | postgres | Database password |
| `POSTGRES_DB` | postgres | Database name |
| `NEXT_PUBLIC_SITE_URL` | web + backend | Canonical public site URL (HTTPS, no trailing slash) |
| `NEXT_PUBLIC_API_URL` | web | Browser-facing API base URL |
| `API_INTERNAL_URL` | web | SSR/middleware → API (`http://backend:4000` in compose) |
| `CORS_ORIGIN` | backend | Allowed origin(s), usually same as `NEXT_PUBLIC_SITE_URL` |
| `PAYSTACK_SECRET_KEY` | backend | Paystack secret (live in production) |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | web + backend | Paystack public key |
| `ADMIN_EMAIL` | backend | First admin user (seed) |
| `ADMIN_PASSWORD` | backend | First admin password (seed) |
| `ADMIN_JWT_SECRET` | backend | JWT signing secret (32+ random chars) |

## Recommended (roadmap / SEO / redirects)

| Variable | Service | Purpose |
|----------|---------|---------|
| `LEGACY_SITE_HOST` | web (+ backend optional) | Hostname that 301-redirects to `NEXT_PUBLIC_SITE_URL` |
| `NEXT_PUBLIC_LEGACY_SITE_HOST` | web (build + runtime) | Same as above for client/middleware fallback |
| `NEXT_PUBLIC_LMS_PORTAL_URL` | web + backend | External LMS link on program pages |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | web + backend | Google Analytics `G-…` ID |
| `SKIP_PRISMA_SEED` | backend | `true` after first successful deploy (migrations still run) |
| `ADMIN_ALLOW_SYSTEM_OPS` | backend | `false` in production (blocks migrate/seed from admin UI) |

## Optional

| Variable | Default | Purpose |
|----------|---------|---------|
| `FRONTEND_PORT` | `3035` | Host port mapped to web container |
| `BACKEND_PORT` | `4035` | Host port mapped to API container |
| `PAYSTACK_CURRENCY` | `GHS` | Donation currency |
| `ADMIN_NAME` | Site Administrator | Seed admin display name |
| `ADMIN_ROLE` | `admin` | Seed role: `superadmin`, `admin`, `editor`, `finance` |
| `CRM_WEBHOOK_URL` | — | Optional Zapier/HubSpot webhook for donations & contact |
| `SKIP_PRISMA_SEED` | `false` | Skip background seed on API boot |

## Deploy checklist

1. Set all variables in Coolify → **Environment** (development and production stacks).
2. **Redeploy** with rebuild so `web` picks up `NEXT_PUBLIC_*` build args.
3. API entrypoint runs `prisma migrate deploy` automatically; on boot it also **syncs missing CMS keys** from the registry.
4. First deploy: leave `SKIP_PRISMA_SEED=false` once, then set `SKIP_PRISMA_SEED=true`.
5. Confirm health: `GET /api/v1/health` on the API URL.
6. Smoke-test: legacy host 301, `/search`, event registration, admin **Settings → Integrations**, admin **Inbox**.

## Name alignment (common mistakes)

- Use `NEXT_PUBLIC_SITE_URL`, not `SITE_URL`.
- Use `API_INTERNAL_URL=http://backend:4000` inside Docker, not the public API URL.
- `LEGACY_SITE_HOST` is hostname only (no `https://`), e.g. `anansecenter.oceancyber.site`.
- `CORS_ORIGIN` must match the browser origin exactly (scheme + host, no path).
