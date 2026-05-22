/** Per-route rate limit config for @fastify/rate-limit (global plugin must be registered first). */

export function routeRateLimitConfig(envKey: string, fallback: number) {
  const max = Number(process.env[envKey] || fallback)
  return {
    config: {
      rateLimit: {
        max: Number.isFinite(max) && max > 0 ? max : fallback,
        timeWindow: '1 minute' as const,
      },
    },
  }
}

export const formRateLimit = () => routeRateLimitConfig('RATE_LIMIT_FORM_MAX', 8)
export const authRateLimit = () => routeRateLimitConfig('RATE_LIMIT_AUTH_MAX', 10)
export const donationRateLimit = () => routeRateLimitConfig('RATE_LIMIT_DONATION_MAX', 15)
