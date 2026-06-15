import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

type Duration = `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`

let redis: Redis | null = null

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  if (!redis) {
    redis = new Redis({ url, token })
  }
  return redis
}

const limiters = new Map<string, Ratelimit>()

function getLimiter(requests: number, window: Duration): Ratelimit | null {
  const r = getRedis()
  if (!r) return null
  const key = `${requests}:${window}`
  if (!limiters.has(key)) {
    limiters.set(
      key,
      new Ratelimit({
        redis: r,
        limiter: Ratelimit.slidingWindow(requests, window),
        prefix: 'autoapply:rl',
      }),
    )
  }
  return limiters.get(key)!
}

export function getIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown'
}

export async function checkRateLimit(
  identifier: string,
  requests: number,
  window: Duration,
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const limiter = getLimiter(requests, window)
  if (!limiter) return { success: true, remaining: requests, reset: 0 }

  try {
    const result = await limiter.limit(identifier)
    return { success: result.success, remaining: result.remaining, reset: result.reset }
  } catch {
    return { success: true, remaining: requests, reset: 0 }
  }
}

export function tooManyRequestsResponse(reset: number): NextResponse {
  const retryAfterSeconds = Math.max(0, Math.ceil((reset - Date.now()) / 1000))
  const minutes = Math.ceil(retryAfterSeconds / 60) || 1
  return NextResponse.json(
    { error: `Too many attempts. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.` },
    {
      status: 429,
      headers: { 'Retry-After': String(retryAfterSeconds) },
    },
  )
}
