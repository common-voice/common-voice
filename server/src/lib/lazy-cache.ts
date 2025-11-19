import { redis, redlock, useRedis } from './redis'
import * as Sentry from '@sentry/node'
import type { Lock } from 'redlock'

import { TimeUnits } from 'common'

interface PrefetchOptions {
  prefetch?: boolean
  thresholdRatio?: number // Default 0.8 (refresh at 80% of TTL)
  safetyMultiplier?: number // Default 2.0 (use 2x avgFetchTime as safety margin)
  // Use the keepAlive option with care! Only for global caches like leader-board!
  keepAlive?: boolean // Keep refreshing even with no requests (prevents cold start)
  keepAliveMaxFailures?: number // Stop keep-alive after N consecutive failures (default: 3)
}

// Monitor Redis state specifically for lazy-cache
redis.on('ready', () => console.info('[LazyCache-Redis] Ready'))
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

// Track all active keep-alive intervals for cleanup
const activeKeepAliveIntervals = new Map<string, NodeJS.Timeout>()

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

      console.error(
        `[LazyCache] Error reported to Sentry: context=${context}, error=${error.message}, totalErrors=${errorCount}`
      )

      lastErrorReport = now
      errorCount = 0
    } catch (sentryError) {
      console.error('[LazyCache] Failed to report to Sentry:', sentryError)
    }
  } else {
    console.warn(
      `[LazyCache] Error suppressed (rate limited): context=${context}, error=${
        error.message
      }, errorCount=${errorCount}, nextReportIn=${Math.floor(
        (ERROR_REPORT_INTERVAL - (now - lastErrorReport)) / 1000
      ).toFixed(2)}s`
    )
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

export function stopAllKeepAlive(): void {
  console.log(
    `[LazyCache] Stopping ${activeKeepAliveIntervals.size} keep-alive intervals`
  )
  activeKeepAliveIntervals.forEach((interval, key) => {
    clearInterval(interval)
    console.log(`[LazyCache] Stopped keep-alive for ${key}`)
  })
  activeKeepAliveIntervals.clear()
}

// Cleanup on process termination
process.on('SIGTERM', () => {
  console.log('[LazyCache] SIGTERM received, cleaning up keep-alive intervals')
  stopAllKeepAlive()
})

process.on('SIGINT', () => {
  console.log('[LazyCache] SIGINT received, cleaning up keep-alive intervals')
  stopAllKeepAlive()
})

export async function performHealthCheck(): Promise<void> {
  const previousStrategy = cacheStrategy

  try {
    // Add timeout to prevent hanging on queued commands
    const pingPromise = redis.ping()
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Redis health check timeout')), 3000)
    )

    await Promise.race([pingPromise, timeoutPromise])
    consecutiveFailures = 0

    if (previousStrategy === 'memory') {
      console.warn('[LazyCache] Redis recovered, switching to Redis cache')
      cacheStrategy = 'redis'
      Sentry.captureMessage('[LazyCache] Redis cache recovered', {
        level: 'info',
        tags: { context: 'cache-recovery' },
      })
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
      console.warn(
        `[LazyCache] Failure ${consecutiveFailures}, not switching yet`
      )
    }
  }
  lastHealthCheck = Date.now()
}

async function getCacheStrategy(): Promise<'redis' | 'memory'> {
  // Always check health if interval elapsed, regardless of current strategy
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
    reportError(error as Error, 'redis-set-fill-many')
  }
}

// Gets values from a Redis SET (if exists)
export async function redisSetMembers(key: string): Promise<string[]> {
  if ((await getCacheStrategy()) !== 'redis') return []

  try {
    return (await redis.smembers(key)) || []
  } catch (error) {
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
  lockDurationMs: number,
  allowStaleOnLockFailure: boolean,
  prefetchOptions: PrefetchOptions = {}
): Fn<T, S> {
  // Create a memory cache fallback for when Redis fails
  const memoryFallback = memoryCache(cachedFunction, timeMs)
  const lockKey = `${cacheKey}-lock`

  const {
    prefetch: prefetchEnabled = false,
    thresholdRatio = 0.8,
    safetyMultiplier = 2.0,
    keepAlive = false,
    keepAliveMaxFailures = 3,
  } = prefetchOptions

  // Keep-alive mechanism to prevent cold start
  let keepAliveInterval: NodeJS.Timeout | null = null
  let lastArgs: S[] | null = null
  let consecutiveKeepAliveFailures = 0

  // Schedule periodic refresh if keepAlive is enabled
  const scheduleKeepAlive = (
    cacheKeyFull: string,
    args: S[],
    fetchTime: number
  ) => {
    if (!keepAlive || keepAliveInterval) return

    lastArgs = args
    // Calculate refresh interval: refresh at 80% of TTL or TTL - 2*fetchTime, whichever is earlier
    const interval = Math.min(
      timeMs * thresholdRatio,
      Math.max(timeMs - fetchTime * safetyMultiplier, timeMs * 0.5)
    )

    console.info(
      `[LazyCache] KeepAlive scheduled for ${cacheKey}: interval=${interval}ms (${(
        interval / TimeUnits.MINUTE
      ).toFixed(1)}min), maxFailures=${keepAliveMaxFailures}`
    )

    keepAliveInterval = setInterval(() => {
      // Wrap in IIFE to catch all async errors
      ;(async () => {
        try {
          console.debug(
            `[LazyCache] KeepAlive refresh triggered for ${cacheKey}`
          )
          const startTime = Date.now()
          const freshValue = await cachedFunction(...(lastArgs as S[]))
          const newFetchTime = Date.now() - startTime

          await redis.set(
            cacheKeyFull,
            JSON.stringify({
              at: Date.now(),
              value: freshValue,
              fetchTime: newFetchTime,
            }),
            'PX',
            timeMs
          )

          // Reset failure counter on success
          consecutiveKeepAliveFailures = 0

          console.debug(
            `[LazyCache] KeepAlive refresh completed for ${cacheKey}: fetchTime=${newFetchTime}ms`
          )
        } catch (error) {
          consecutiveKeepAliveFailures++
          console.warn(
            `[LazyCache] KeepAlive refresh failed for ${cacheKey} (failure ${consecutiveKeepAliveFailures}/${keepAliveMaxFailures}):`,
            error instanceof Error ? error.message : error
          )

          // Stop keep-alive after max consecutive failures
          if (consecutiveKeepAliveFailures >= keepAliveMaxFailures) {
            console.error(
              `[LazyCache] KeepAlive stopped for ${cacheKey} after ${consecutiveKeepAliveFailures} consecutive failures`
            )
            if (keepAliveInterval) {
              clearInterval(keepAliveInterval)
              activeKeepAliveIntervals.delete(cacheKey)
              keepAliveInterval = null
            }
          }
        }
      })().catch(error => {
        // Catch any errors thrown before the inner try-catch
        consecutiveKeepAliveFailures++
        console.warn(
          `[LazyCache] KeepAlive (outer) failed for ${cacheKey} (failure ${consecutiveKeepAliveFailures}/${keepAliveMaxFailures}):`,
          error instanceof Error ? error.message : error
        )

        // Stop keep-alive after max consecutive failures
        if (consecutiveKeepAliveFailures >= keepAliveMaxFailures) {
          console.error(
            `[LazyCache] KeepAlive stopped for ${cacheKey} after ${consecutiveKeepAliveFailures} consecutive failures`
          )
          if (keepAliveInterval) {
            clearInterval(keepAliveInterval)
            activeKeepAliveIntervals.delete(cacheKey)
            keepAliveInterval = null
          }
        }
      })
    }, interval)

    // Track interval for cleanup
    activeKeepAliveIntervals.set(cacheKey, keepAliveInterval)
  }

  return async (...args): Promise<T> => {
    const key = cacheKey + JSON.stringify(args)
    let lock = null

    try {
      // First: Try to get from cache first
      const result = await redis.get(key)
      if (result) {
        try {
          const cached = JSON.parse(result)

          // Backward compatibility: handle old cache format
          // Old format: just the value OR { value: T }
          // New format: { at: number, value: T, fetchTime?: number }
          let normalizedCache: { at: number; value: T; fetchTime?: number }

          if (cached.at !== undefined && cached.value !== undefined) {
            // New format - use as is
            normalizedCache = cached
          } else if (cached.value !== undefined) {
            // Old format with { value: T } but no 'at' field
            // Treat as expired to force refresh with new format
            normalizedCache = { at: 0, value: cached.value }
          } else {
            // just the raw value
            normalizedCache = { at: 0, value: cached }
          }

          if (!isExpired(normalizedCache.at, timeMs)) {
            // Cache is still fresh - check if we should prefetch
            if (prefetchEnabled) {
              triggerPrefetchIfNeeded(
                key,
                normalizedCache,
                timeMs,
                thresholdRatio,
                safetyMultiplier,
                cachedFunction,
                args
              )
            }
            return normalizedCache.value
          }
        } catch (error) {
          reportError(error as Error, 'cache-parse')
        }
      }

      // Second: quick lock acquisition attempt
      try {
        lock = await redlock.lock(lockKey, lockDurationMs)
      } catch (lockError) {
        // Distinguish between "lock held" vs "Redis down"
        const isRedisDown =
          lockError.message?.includes('exceeded') ||
          lockError.message?.includes('quorum') ||
          lockError.message?.includes('timeout') ||
          lockError.message?.includes('ECONNREFUSED') ||
          lockError.message?.includes('Connection') ||
          consecutiveFailures >= FAILURE_THRESHOLD

        if (isRedisDown) {
          // Redis likely down - fail fast to memory cache
          console.error(
            `[LazyCache] Redis appears down for ${cacheKey}, using memory fallback`
          )
          reportError(lockError as Error, 'cache-lock-redis-down')
          return await memoryFallback(...(args as S[]))
        }

        // Lock held by another instance - use stale data strategy
        return await handleLockFailure(key)
      }

      // We have the lock - double check cache
      try {
        const doubleCheckResult = await redis.get(key)
        if (doubleCheckResult) {
          const cached = JSON.parse(doubleCheckResult)
          const value = cached.value !== undefined ? cached.value : cached
          const at = cached.at || 0

          if (!isExpired(at, timeMs)) {
            return value
          }
        }
      } catch (error) {
        reportError(error as Error, 'cache-double-check')
        // Still continue to compute if double-check fails
      }

      // Compute and cache the result
      return await computeAndCache(key, lock, cachedFunction, args)
    } catch (error) {
      // Release lock if we acquired it but an error occurred
      await releaseLock(lock)
      reportError(error as Error, 'redis-operation')
      return await memoryFallback(...(args as S[]))
    }
  }

  async function handleLockFailure(key: string): Promise<T> {
    console.warn(
      `[LazyCache] Lock acquisition failed for ${cacheKey}. Attempting recovery strategy.`
    )

    if (allowStaleOnLockFailure) {
      // Prefer stale or fresh data before doing anything else
      try {
        const raw = await redis.get(key)
        if (raw) {
          const cached = JSON.parse(raw)

          // Backward compatibility: normalize cache format
          const value = cached.value !== undefined ? cached.value : cached
          const at = cached.at || 0

          // Fresh data happened to appear
          if (!isExpired(at, timeMs)) {
            console.debug(
              `[LazyCache] Fresh data became available for ${cacheKey}`
            )
            return value
          }

          // Return stale if allowed
          if (value) {
            const ageMinutes = ((Date.now() - at) / TimeUnits.MINUTE).toFixed(2)
            console.warn(
              `[LazyCache] Returning STALE data for ${cacheKey} (age: ${ageMinutes} minutes).`
            )
            return value
          }
        }
      } catch (err) {
        reportError(err as Error, 'stale-check-after-lock-failure')
      }

      // No stale or fresh data
      const internal = new Error(
        `No stale or fresh data available for ${cacheKey}; lock acquisition failed.`
      )
      reportError(internal, 'cache-lock-fail-no-stale')

      // User-safe output
      throw new Error(`Temporary data issue. Please try again shortly.`)
    }

    // Fresh data REQUIRED
    console.warn(
      `[LazyCache] Lock held for ${cacheKey}. Fresh data required, checking if another instance already computed it.`
    )

    try {
      const raw = await redis.get(key)
      if (raw) {
        const cached = JSON.parse(raw)
        const value = cached.value !== undefined ? cached.value : cached
        const at = cached.at || 0

        if (!isExpired(at, timeMs)) {
          console.debug(
            `[LazyCache] Fresh data now available for ${cacheKey}. Another instance computed it.`
          )
          return value
        }
      }
    } catch (err) {
      reportError(err as Error, 'fresh-check-after-lock-failure')
    }

    // Fresh required but unavailable
    const internal = new Error(
      `Fresh data required for ${cacheKey}, but lock is held and no new data appeared.`
    )
    console.error(`[LazyCache] ${internal.message}`)
    reportError(internal, 'cache-lock-fail-no-fresh')

    // User-safe message
    throw new Error(
      `The requested data is still being prepared. Please retry a minute later.`
    )
  }

  async function computeAndCache(
    key: string,
    lock: Lock | null,
    cachedFunction: Fn<T, S>,
    args: S[]
  ): Promise<T> {
    try {
      const startTime = Date.now()
      const value = await cachedFunction(...args)
      const fetchTime = Date.now() - startTime

      try {
        await redis.set(
          key,
          JSON.stringify({ at: Date.now(), value, fetchTime }),
          'PX',
          timeMs
        )
        console.debug(
          `[LazyCache] Cached ${cacheKey} with fetchTime=${fetchTime}ms, TTL=${timeMs}ms`
        )

        // Schedule keepAlive if enabled
        scheduleKeepAlive(key, args, fetchTime)
      } catch (setError) {
        reportError(setError as Error, 'cache-set')
      }

      return value
    } finally {
      await releaseLock(lock)
    }
  }

  function triggerPrefetchIfNeeded(
    key: string,
    cached: { at: number; value: T; fetchTime?: number },
    timeMs: number,
    thresholdRatio: number,
    safetyMultiplier: number,
    cachedFunction: Fn<T, S>,
    args: S[]
  ): void {
    const age = Date.now() - cached.at
    const avgFetchTime = cached.fetchTime || 0

    // Calculate refresh threshold adaptively
    let refreshThreshold: number
    if (avgFetchTime > 0) {
      // Use safety margin: TTL - (avgFetchTime * safetyMultiplier)
      // This ensures we start refreshing early enough to complete before expiry
      refreshThreshold = timeMs - avgFetchTime * safetyMultiplier
      // But don't refresh too early (at least 50% of TTL)
      refreshThreshold = Math.max(refreshThreshold, timeMs * 0.5)
    } else {
      // No timing data - use default threshold ratio
      refreshThreshold = timeMs * thresholdRatio
    }

    if (age >= refreshThreshold) {
      console.debug(
        `[LazyCache] Prefetch triggered for ${cacheKey}: age=${age}ms, threshold=${refreshThreshold}ms, avgFetch=${avgFetchTime}ms`
      )

      // Trigger async refresh without blocking current request
      // Wrap in IIFE to catch all async errors
      setImmediate(() => {
        ;(async () => {
          let prefetchLock: Lock | null = null
          try {
            // Try to acquire lock with short timeout (don't wait if another instance is already refreshing)
            const lockTimeout = Math.max(avgFetchTime * safetyMultiplier, 30000)
            prefetchLock = await redlock.lock(
              `${key}-prefetch`,
              Math.ceil(lockTimeout)
            )

            // Double-check if still needed (another instance might have refreshed)
            const current = await redis.get(key)
            if (current) {
              const currentCached = JSON.parse(current)
              const currentAge = Date.now() - currentCached.at
              if (currentAge < refreshThreshold) {
                console.debug(
                  `[LazyCache] Prefetch skipped for ${cacheKey}: already refreshed by another instance`
                )
                return
              }
            }

            // Execute refresh
            const startTime = Date.now()
            const freshValue = await cachedFunction(...args)
            const fetchTime = Date.now() - startTime

            // Update cache with new data and timing
            await redis.set(
              key,
              JSON.stringify({ at: Date.now(), value: freshValue, fetchTime }),
              'PX',
              timeMs
            )

            console.debug(
              `[LazyCache] Prefetch completed for ${cacheKey}: fetchTime=${fetchTime}ms`
            )
          } catch (error) {
            // Log but don't throw - prefetch failures are non-critical
            // User will get stale data until next successful fetch
            console.warn(
              `[LazyCache] Prefetch failed for ${cacheKey}:`,
              error instanceof Error ? error.message : error
            )
          } finally {
            if (prefetchLock) {
              try {
                await prefetchLock.unlock()
              } catch (unlockError) {
                console.warn(
                  `[LazyCache] Prefetch unlock warning for ${cacheKey}:`,
                  unlockError instanceof Error
                    ? unlockError.message
                    : unlockError
                )
              }
            }
          }
        })().catch(error => {
          // Catch any errors thrown before the inner try-catch
          console.warn(
            `[LazyCache] Prefetch (outer) failed for ${cacheKey}:`,
            error instanceof Error ? error.message : error
          )
        })
      })
    }
  }

  async function releaseLock(lock: Lock | null): Promise<void> {
    if (!lock) return

    try {
      await lock.unlock()
    } catch (unlockError: unknown) {
      const msg =
        unlockError instanceof Error ? unlockError.message : String(unlockError)
      if (
        msg.includes('Unable to fully release the lock') ||
        msg.includes('missing value') ||
        msg.includes('does not exist')
      ) {
        console.warn(`[LazyCache] Non-critical unlock issue: ${msg}`)
      } else if (unlockError instanceof Error) {
        reportError(unlockError, 'cache-unlock')
      } else {
        reportError(new Error(String(unlockError)), 'cache-unlock')
      }
    }
  }
}

export default function lazyCache<T, S>(
  cacheKey: string,
  f: Fn<T, S>,
  timeMs: number,
  lockDurationMs = 5 * TimeUnits.MINUTE,
  allowStaleOnLockFailure = false, // Default: DO NOT return stale data
  prefetchOptions: PrefetchOptions = {} // Prefetch configuration
): Fn<T, S> {
  const memCache = memoryCache(f, timeMs)
  const redisCacheImpl = redisCache(
    cacheKey,
    f,
    timeMs,
    lockDurationMs,
    allowStaleOnLockFailure,
    prefetchOptions
  )

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
  stopAllKeepAlive()
}
