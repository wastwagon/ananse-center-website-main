import { Redis } from 'ioredis'

let client: Redis | null = null

export function getRedis(): Redis | null {
  const url = process.env.REDIS_URL
  if (!url) return null

  if (!client) {
    client = new Redis(url, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    })
  }

  return client
}

export async function pingRedis(): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false

  try {
    if (redis.status === 'wait') await redis.connect()
    const pong = await redis.ping()
    return pong === 'PONG'
  } catch {
    return false
  }
}
