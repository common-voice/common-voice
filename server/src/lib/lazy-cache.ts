import { redis, redlock, useRedis } from './redis'
import * as Sentry from '@sentry/node'

import { TimeUnits } from 'common'

// Monitor Redis state specifically for lazy-cache
redis.on('connect', () => console.debug('[LazyCache-Redis] Connecting...'))
redis.on('ready', () => console.debug('[LazyCache-Redis] Ready'))
redis.on('error', err => console.error('[LazyCache-Redis] Error:', err.message))
redis.on('close', () => console.warn('[LazyCache-Redis] Connection closed'))
redis.on('reconnecting', delay =>
  console.warn(`[LazyCache-Redis] Reconnecting in ${delay}ms`)
)

type Fn<T, S> = (...args: S[]) => Promise<T>

//
// Cache strategy management and HealthCheck
//

let cacheStrategy: 'redis' | 'memory' = 'memory'
let lastHealthCheck = 0
let lastErrorReport = 0
let errorCount = 0 // Track error count for rate limiting
let healthCheckInterval: NodeJS.Timeout | null = null

const HEALTH_CHECK_INTERVAL = 5 * TimeUnits.SECOND // 5 seconds always
const ERROR_REPORT_INTERVAL = 60 * TimeUnits.SECOND // Report errors once per minute

let consecutiveFailures = 0
const FAILURE_THRESHOLD = 2 // Require 2 consecutive failures before switching

// Initialize cache strategy once at module load and start health monitoring
useRedis.then(hasRedis => {
  cacheStrategy = hasRedis ? 'redis' : 'memory'
  console.log('[LazyCache] Initial cache strategy:', cacheStrategy)

  // Always start health monitoring to detect when Redis becomes available
  startHealthMonitoring()
})

function reportError(error: Error, context: string): void {
  const now = Date.now()
  errorCount++

  // Only report first error each minute
  if (now - lastErrorReport >= ERROR_REPORT_INTERVAL) {
    try {
      Sentry.captureException(error, {
        tags: { context },
        fingerprint: ['lazy-cache', context],
      })

      console.error(`[LazyCache] Error reported to Sentry:`, {
        context,
        error: error.message,
        totalErrors: errorCount,
      })

      lastErrorReport = now
      errorCount = 0
    } catch (sentryError) {
      console.error('[LazyCache] Failed to report to Sentry:', sentryError)
    }
  } else {
    console.warn(`[LazyCache] Error suppressed (rate limited):`, {
      context,
      error: error.message,
      errorCount,
      nextReportIn: ERROR_REPORT_INTERVAL - (now - lastErrorReport),
    })
  }
}

// Background health monitoring
function startHealthMonitoring() {
  // Clear existing interval if any
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval)
  }
  // Check every 5 seconds if healthy
  healthCheckInterval = setInterval(async () => {
    await performHealthCheck()
  }, HEALTH_CHECK_INTERVAL) // Always check every 5 seconds
}

export function stopHealthMonitoring(): void {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval)
    healthCheckInterval = null
  }
}

export async function performHealthCheck(): Promise<void> {
  const previousStrategy = cacheStrategy
  console.debug(
    `[LazyCache] Health check starting. Previous: ${previousStrategy}, Consecutive failures: ${consecutiveFailures}`
  )

  try {
    // Add timeout to prevent hanging on queued commands
    const pingPromise = redis.ping()
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Redis health check timeout')), 3000)
    )

    await Promise.race([pingPromise, timeoutPromise])
    console.debug(`[LazyCache] Redis ping successful`)
    consecutiveFailures = 0

    if (previousStrategy === 'memory') {
      console.log('[LazyCache] Redis recovered, switching to Redis cache')
      cacheStrategy = 'redis'
      Sentry.captureMessage('[LazyCache] Redis cache recovered', {
        level: 'info',
        tags: { context: 'cache-recovery' },
      })
    } else {
      console.debug('[LazyCache] Redis healthy, staying in Redis mode')
    }
  } catch (error) {
    console.warn(`[LazyCache] Redis ping failed: ${error.message}`)
    consecutiveFailures++

    if (
      previousStrategy === 'redis' &&
      consecutiveFailures >= FAILURE_THRESHOLD
    ) {
      console.warn(
        `[LazyCache] Switching to memory after ${consecutiveFailures} failures`
      )
      cacheStrategy = 'memory'
      reportError(error as Error, 'health-check-failure')
    } else {
      console.debug(
        `[LazyCache] Failure ${consecutiveFailures}, not switching yet`
      )
    }
  }
  lastHealthCheck = Date.now()
  console.debug(
    `[LazyCache] Health check completed. Strategy: ${cacheStrategy}`
  )
}

async function getCacheStrategy(): Promise<'redis' | 'memory'> {
  // <=== CHANGED: Always check health if interval elapsed, regardless of current strategy
  const now = Date.now()

  if (now - lastHealthCheck > HEALTH_CHECK_INTERVAL) {
    await performHealthCheck()
  }

  return cacheStrategy
}

//
// Simple redis set manipulation
//

// Adds a value to a Redis SET with expiry
export async function redisSetAddWithExpiry(
  key: string,
  value: string | number,
  ttlMs: number
) {
  if ((await getCacheStrategy()) !== 'redis') return

  try {
    await redis.sadd(key, value)
    await redis.expire(key, Math.floor(ttlMs / 1000))
  } catch (error) {
    // Use rate-limited error reporting
    reportError(error as Error, 'redis-set-add')
  }
}

export async function redisSetAddManyWithExpiry(
  key: string,
  values: (number | string)[],
  ttlMs: number
) {
  if (values.length === 0 || (await getCacheStrategy()) !== 'redis') return

  try {
    await redis.sadd(key, ...values.map(String))
    await redis.expire(key, Math.floor(ttlMs / 1000))
  } catch (error) {
    // Use rate-limited error reporting
    reportError(error as Error, 'redis-set-add-many')
  }
}

// Replace Redis SET with new values (deletes old, sets new, sets TTL)
export async function redisSetFillManyWithExpiry(
  key: string,
  values: (number | string)[],
  ttlMs: number
): Promise<void> {
  if (values.length === 0 || (await getCacheStrategy()) !== 'redis') return

  try {
    await redis.del(key)
    await redisSetAddManyWithExpiry(key, values, ttlMs)
  } catch (error) {
    // Use rate-limited error reporting
    reportError(error as Error, 'redis-set-fill-many')
  }
}

// Gets values from a Redis SET (if exists)
export async function redisSetMembers(key: string): Promise<string[]> {
  if ((await getCacheStrategy()) !== 'redis') return []

  try {
    return (await redis.smembers(key)) || []
  } catch (error) {
    // Use rate-limited error reporting
    reportError(error as Error, 'redis-set-members')
    return []
  }
}

//
// lazyCache implementation
//

function isExpired(at: number, timeMs: number) {
  return Date.now() - at > timeMs
}

function memoryCache<T, S>(cachedFunction: Fn<T, S>, timeMs: number): Fn<T, S> {
  const caches: {
    [key: string]: { at?: number; promise?: Promise<T>; value?: T }
  } = {}
  return async (...args) => {
    const key = JSON.stringify(args)

    let cached = caches[key]
    if (cached) {
      const { at, promise, value } = cached
      if (!isExpired(at, timeMs)) {
        return value
      }

      if (promise) return value || promise
    } else {
      caches[key] = cached = {}
    }

    return (cached.promise = new Promise(async resolve => {
      const hasOldCache = cached && cached.value
      if (hasOldCache) resolve(cached.value)
      Object.assign(cached, {
        at: Date.now(),
        value: await cachedFunction(...args),
        promise: null,
      })
      if (!hasOldCache) resolve(cached.value)
    }))
  }
}

function redisCache<T, S>(
  cacheKey: string,
  cachedFunction: Fn<T, S>,
  timeMs: number,
  lockDurationMs: number
): Fn<T, S> {
  // Create a memory cache fallback for when Redis fails
  const memoryFallback = memoryCache(cachedFunction, timeMs)

  return async (...args) => {
    const key = cacheKey + JSON.stringify(args)

    try {
      // Try to get from cache first
      const result = await redis.get(key)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value: any
      let renewCache = true

      if (result) {
        try {
          const cached = JSON.parse(result)
          value = cached.value
          renewCache = isExpired(cached.at, timeMs)
        } catch (error) {
          // Use rate-limited error reporting
          reportError(error as Error, 'cache-parse')
          renewCache = true
        }
      }

      if (!renewCache) return value

      // Cache miss or expired - need to fetch new data
      return new Promise(async resolve => {
        let lock = null

        // Try to acquire lock for cache stampede protection
        try {
          lock = await redlock.lock(key + '-lock', lockDurationMs)

          // Double-check cache after acquiring lock
          try {
            const doubleCheckResult = await redis.get(key)
            if (doubleCheckResult) {
              const cached = JSON.parse(doubleCheckResult)
              if (!isExpired(cached.at, timeMs)) {
                resolve(cached.value)
                return
              }
            }
          } catch (error) {
            // Continue to function execution if double-check fails
            // Use rate-limited error reporting
            reportError(error as Error, 'cache-double-check')
          }
        } catch (lockError) {
          // Use rate-limited error reporting
          reportError(lockError as Error, 'cache-lock-acquisition')
          // Continue without lock
        }

        try {
          // Execute the original function
          value = await cachedFunction(...args)

          // Try to cache the result if we have a lock
          if (lock) {
            try {
              await redis.set(key, JSON.stringify({ at: Date.now(), value }))
            } catch (setError) {
              // Use rate-limited error reporting
              reportError(setError as Error, 'cache-set')
            }
          }

          resolve(value)
        } finally {
          // Always try to release lock if we acquired it
          if (lock) {
            try {
              await lock.unlock()
            } catch (unlockError: any) {
              // Redlock unlock can fail harmlessly if TTL expired or lock already released
              const msg = unlockError?.message || ''
              if (
                msg.includes('Unable to fully release the lock') ||
                msg.includes('missing value') ||
                msg.includes('does not exist')
              ) {
                // Just warn locally, do NOT switch to memory cache or report to Sentry
                console.warn(`[LazyCache] Non-critical unlock issue: ${msg}`)
              } else {
                // Unexpected or real Redis failure
                reportError(unlockError as Error, 'cache-unlock')
              }
            }
          }
        }
      })
    } catch (error) {
      // Use rate-limited error reporting
      reportError(error as Error, 'redis-operation')
      // Use memory cache fallback when Redis fails
      return await memoryFallback(...args)
    }
  }
}

export default function lazyCache<T, S>(
  cacheKey: string,
  f: Fn<T, S>,
  timeMs: number,
  lockDurationMs = 5 * TimeUnits.MINUTE
): Fn<T, S> {
  const memCache = memoryCache(f, timeMs)
  const redisCacheImpl = redisCache(cacheKey, f, timeMs, lockDurationMs)

  return async (...args: S[]) => {
    const strategy = await getCacheStrategy()
    return strategy === 'redis' ? redisCacheImpl(...args) : memCache(...args)
  }
}

//
// Support/Testing functions
//

// Export for testing and monitoring
export function getCurrentCacheStrategy(): 'redis' | 'memory' {
  return cacheStrategy
}

export function forceCacheStrategy(strategy: 'redis' | 'memory'): void {
  cacheStrategy = strategy
  lastHealthCheck = Date.now()

  // Start background monitoring if switching to Redis
  if (strategy === 'redis') {
    startHealthMonitoring()
  }
}

export function getErrorStats(): {
  errorCount: number
  lastErrorReport: number
} {
  return { errorCount, lastErrorReport }
}

export function resetCacheState(): void {
  cacheStrategy = 'memory'
  lastHealthCheck = 0
  lastErrorReport = 0
  errorCount = 0
  stopHealthMonitoring()
}
