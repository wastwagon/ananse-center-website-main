export type ProductionEnvIssue = {
  level: 'error' | 'warn'
  message: string
}

const PLACEHOLDER_RE = /change_me|dev_only|example\.com/i

function isProductionRuntime() {
  return process.env.NODE_ENV === 'production'
}

/** Collect misconfiguration warnings for production (no secret values returned). */
export function collectProductionEnvIssues(): ProductionEnvIssue[] {
  if (!isProductionRuntime()) return []

  const issues: ProductionEnvIssue[] = []
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? ''
  const jwt = process.env.ADMIN_JWT_SECRET?.trim() ?? ''
  const cors = process.env.CORS_ORIGIN?.trim() ?? ''
  const paystackSecret = process.env.PAYSTACK_SECRET_KEY?.trim() ?? ''
  const paystackPublic = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim() ?? ''

  if (!siteUrl.startsWith('https://')) {
    issues.push({
      level: 'error',
      message: 'NEXT_PUBLIC_SITE_URL must use HTTPS in production',
    })
  }

  if (!cors) {
    issues.push({ level: 'error', message: 'CORS_ORIGIN is required in production' })
  } else if (siteUrl && !cors.split(',').some((o) => o.trim() === siteUrl)) {
    issues.push({
      level: 'warn',
      message: 'CORS_ORIGIN should include NEXT_PUBLIC_SITE_URL exactly',
    })
  }

  if (jwt.length < 32) {
    issues.push({
      level: 'error',
      message: 'ADMIN_JWT_SECRET must be at least 32 characters',
    })
  } else if (PLACEHOLDER_RE.test(jwt)) {
    issues.push({
      level: 'error',
      message: 'ADMIN_JWT_SECRET looks like a placeholder — rotate before go-live',
    })
  }

  if (process.env.SKIP_PRISMA_SEED !== 'true') {
    issues.push({
      level: 'warn',
      message: 'Set SKIP_PRISMA_SEED=true after the first successful deploy',
    })
  }

  if (process.env.ADMIN_ALLOW_SYSTEM_OPS === 'true') {
    issues.push({
      level: 'warn',
      message: 'ADMIN_ALLOW_SYSTEM_OPS=true — disable in production when not needed',
    })
  }

  if (paystackSecret && paystackSecret.startsWith('sk_test_')) {
    issues.push({
      level: 'warn',
      message: 'PAYSTACK_SECRET_KEY is a test key — use sk_live_ for production donations',
    })
  }

  if (paystackPublic && paystackPublic.startsWith('pk_test_')) {
    issues.push({
      level: 'warn',
      message: 'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is a test key — use pk_live_ in production',
    })
  }

  if (process.env.NEXT_PUBLIC_ROBOTS_NOINDEX === 'true') {
    issues.push({
      level: 'warn',
      message: 'NEXT_PUBLIC_ROBOTS_NOINDEX=true — search engines are blocked',
    })
  }

  return issues
}

type LoggerLike = {
  error: (obj: unknown, msg?: string) => void
  warn: (obj: unknown, msg?: string) => void
}

export function validateProductionEnvOnBoot(logger: LoggerLike) {
  const issues = collectProductionEnvIssues()
  if (issues.length === 0) return

  for (const issue of issues) {
    const log = issue.level === 'error' ? logger.error.bind(logger) : logger.warn.bind(logger)
    log({ tag: 'production-env' }, issue.message)
  }

  const strict = process.env.STRICT_PRODUCTION_ENV === 'true'
  const hasError = issues.some((i) => i.level === 'error')
  if (strict && hasError) {
    logger.error(
      { tag: 'production-env' },
      'STRICT_PRODUCTION_ENV=true — fix errors above and redeploy',
    )
    process.exit(1)
  }
}
