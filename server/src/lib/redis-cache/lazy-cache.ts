import { redis, redlock, useRedis } from './redis'
import * as Sentry from '@sentry/node'
import type { Lock } from 'redlock'
import { TimeUnits } from 'common'

import type {
  Fn,
  PrefetchOptions,
  PrefetchEntry,
  CacheStrategy,
  MemoryCacheEntry,
} from './types'
import {
  HEALTH_CHECK_INTERVAL,
  ERROR_REPORT_INTERVAL,
  PREFETCH_CHECK_INTERVAL,
  FAILURE_THRESHOLD,
} from './constants'
import { isDebugEnabled, isColdStart } from './config'
import { DataRefreshInProgressError } from './types'

export { DataRefreshInProgressError } from './types'

// Monitor Redis state specifically for lazy-cache
redis.on('ready', () => console.info('[LazyCache-Redis] Ready'))
redis.on('error', err => console.error('[LazyCache-Redis] Error:', err.message))
redis.on('close', () => console.warn('[LazyCache-Redis] Connection closed'))
redis.on('reconnecting', delay =>
  console.warn(`[LazyCache-Redis] Reconnecting in ${delay}ms`)
)

//
// Cache strategy management and HealthCheck
//

let cacheStrategy: CacheStrategy = 'memory'
let lastHealthCheck = 0
let lastErrorReport = 0
let errorCount = 0 // Track error count for rate limiting
let healthCheckInterval: NodeJS.Timeout | null = null

// Track which error contexts we've already reported during cold-start
const coldStartErrorsReported = new Set<string>()

// Proactive prefetch registry: track caches that need background prefetch checks
const prefetchRegistry = new Map<string, PrefetchEntry>()
let prefetchCheckInterval: NodeJS.Timeout | null = null

let consecutiveFailures = 0

// Initialize cache strategy once at module load and start health monitoring
// Skip if running in Bull worker process (sandboxed processor)
useRedis.then(hasRedis => {
  cacheStrategy = hasRedis ? 'redis' : 'memory'
  console.log('[LazyCache] Initial cache strategy:', cacheStrategy)

  // Always start health monitoring to detect when Redis becomes available
  startHealthMonitoring()

  // Only start proactive prefetch in main server process, not in Bull workers
  // Bull workers are sandboxed child processes that shouldn't run background timers
  const isBullWorker =
    process.argv.includes('--color') || process.send !== undefined
  if (!isBullWorker) {
    startPrefetchMonitoring()
  } else {
    console.log(
      '[LazyCache] Running in worker process - skipping prefetch monitoring'
    )
  }
})

function reportError(error: Error, context: string): void {
  const now = Date.now()
  errorCount++

  // During cold-start, suppress expected lock contention errors entirely
  if (isColdStart()) {
    if (
      context === 'cache-lock-fail-no-stale' ||
      context === 'redis-operation'
    ) {
      // Only log the first occurrence of each type during cold-start
      if (!coldStartErrorsReported.has(context)) {
        console.warn(
          `[LazyCache] Cold-start: ${context} (subsequent similar errors suppressed during startup)`
        )
        coldStartErrorsReported.add(context)
      }
      return
    }
  }

  // Only report first error each minute
  if (now - lastErrorReport >= ERROR_REPORT_INTERVAL) {
    try {
      Sentry.captureException(error, {
        tags: { context },
        fingerprint: ['lazy-cache', context],
      })

      console.error(
        `[LazyCache] Error: ${context} - ${error.message} (${errorCount} occurrences)`
      )

      lastErrorReport = now
      errorCount = 0
    } catch (sentryError) {
      console.error('[LazyCache] Failed to report to Sentry:', sentryError)
    }
  }
  // Silently increment counter for rate-limited errors (no console spam)
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

// Proactive prefetch monitoring - runs independently of user requests
// This ensures caches are refreshed even during low-traffic periods
function startPrefetchMonitoring() {
  if (prefetchCheckInterval) {
    clearInterval(prefetchCheckInterval)
  }

  console.log(
    `[LazyCache] Starting proactive prefetch monitoring (checking every ${
      PREFETCH_CHECK_INTERVAL / TimeUnits.MINUTE
    } minutes)`
  )

  // Check every 5 minutes if any registered prefetch caches need refreshing
  prefetchCheckInterval = setInterval(async () => {
    // Skip if Redis is down or no caches registered
    if (cacheStrategy !== 'redis' || prefetchRegistry.size === 0) {
      return
    }

    console.log(
      `[LazyCache] Proactive prefetch check running (${prefetchRegistry.size} registered caches)`
    )

    for (const [, entry] of prefetchRegistry.entries()) {
      try {
        await checkAndTriggerPrefetch(entry)
      } catch (error) {
        // Log but don't fail - prefetch is non-critical
        // If Redis is down, this will fail gracefully
        console.warn(
          `[LazyCache] Proactive prefetch check failed for ${entry.key}:`,
          error instanceof Error ? error.message : error
        )
      }
    }
  }, PREFETCH_CHECK_INTERVAL)
}

export function stopPrefetchMonitoring(): void {
  if (prefetchCheckInterval) {
    clearInterval(prefetchCheckInterval)
    prefetchCheckInterval = null
  }
}

// Check if a specific cache entry needs prefetching (proactive background check)
// This is called periodically by the background timer
async function checkAndTriggerPrefetch(entry: PrefetchEntry): Promise<void> {
  const { key, cachedFunction, args, timeMs, lockDurationMs, prefetchBefore } =
    entry

  try {
    // Get current cache value from Redis
    const raw = await redis.get(key)
    if (!raw) {
      // No cache exists yet - skip prefetch, wait for first real request to populate it
      return
    }

    const cached = JSON.parse(raw)
    // Expect simple format: { at: number, value: unknown }
    // Old formats will naturally expire and be replaced
    if (!cached.at || cached.value === undefined) {
      return // Invalid or old format - skip
    }

    // Skip if cache already expired - next real request will handle it
    if (isExpired(cached.at, timeMs)) {
      return
    }

    // Simple fixed-time logic: Prefetch when age >= (TTL - prefetchBefore)
    // Example: TTL=60min, prefetchBefore=25min → prefetch at 35min age
    const age = Date.now() - cached.at
    const refreshThreshold = timeMs - prefetchBefore

    if (age < refreshThreshold) {
      // Not yet time to prefetch
      return
    }

    // Time to prefetch!
    const cacheKey = key.replace(/\{.*$/, '') // Extract base key name for logging
    console.log(
      `[LazyCache] Proactive prefetch triggered for ${cacheKey}: age=${(
        age / TimeUnits.MINUTE
      ).toFixed(1)}min, threshold=${(
        refreshThreshold / TimeUnits.MINUTE
      ).toFixed(1)}min`
    )

    // Trigger async refresh in background (non-blocking)
    setImmediate(() => {
      ;(async () => {
        let prefetchLock: Lock | null = null
        try {
          // Try to acquire lock - if another instance is already prefetching, we skip
          // Lock duration should cover the expected query time plus safety margin
          prefetchLock = await redlock.lock(`${key}-prefetch`, lockDurationMs)

          // Double-check if still needed (another instance might have just refreshed)
          const current = await redis.get(key)
          if (current) {
            const currentCached = JSON.parse(current)
            const currentAge = Date.now() - currentCached.at
            if (currentAge < refreshThreshold) {
              console.log(
                `[LazyCache] Prefetch skipped for ${cacheKey}: already refreshed by another instance`
              )
              return
            }
          }

          // Execute the actual refresh (this is the expensive DB query)
          const startTime = Date.now()
          const freshValue = await cachedFunction(
            ...(args as Parameters<typeof cachedFunction>)
          )
          const fetchTime = Date.now() - startTime

          // Store refreshed value in Redis with FULL TTL from NOW
          // This keeps the cache perpetually fresh - it never expires as long as prefetch works
          // Example: If prefetched at T+35min, new expiry is T+35min+60min = T+95min
          await redis.set(
            key,
            JSON.stringify({
              at: Date.now(),
              value: freshValue,
            }),
            'PX',
            timeMs
          )

          console.log(
            `[LazyCache] Proactive prefetch completed for ${cacheKey}: fetchTime=${(
              fetchTime / 1000
            ).toFixed(1)}s`
          )
        } catch (error) {
          // Prefetch failures are non-critical - next request will handle it
          // This handles: lock conflicts, Redis down, query timeouts, etc.
          console.warn(
            `[LazyCache] Proactive prefetch failed for ${cacheKey}:`,
            error instanceof Error ? error.message : error
          )
        } finally {
          // Always release lock if we acquired it
          if (prefetchLock) {
            try {
              await prefetchLock.unlock()
            } catch {
              // Ignore unlock errors - lock will auto-expire
            }
          }
        }
      })().catch(error => {
        // Catch any errors from the outer async IIFE
        console.warn(
          `[LazyCache] Proactive prefetch error for ${cacheKey}:`,
          error instanceof Error ? error.message : error
        )
      })
    })
  } catch (error) {
    // Errors here are likely Redis connection issues - log and continue
    // The health check will handle Redis failover to memory cache if needed
    console.warn(
      `[LazyCache] Error checking prefetch for ${key}:`,
      error instanceof Error ? error.message : error
    )
  }
}

export async function performHealthCheck(): Promise<void> {
  const previousStrategy = cacheStrategy

  try {
    // Simple ping with built-in commandTimeout (10s configured in redis.ts)
    // No need for manual timeout - ioredis handles it
    await redis.ping()
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
    consecutiveFailures++

    if (
      previousStrategy === 'redis' &&
      consecutiveFailures >= FAILURE_THRESHOLD
    ) {
      console.error(
        `[LazyCache] CRITICAL: Switching to memory after ${consecutiveFailures} failures (${
          consecutiveFailures * (HEALTH_CHECK_INTERVAL / 1000)
        }s) - serving stale data to prevent DB overload`
      )
      cacheStrategy = 'memory'
      reportError(error as Error, 'health-check-failure')
    } else if (previousStrategy === 'redis') {
      // Only log failures when still on Redis (trying to avoid memory fallback)
      console.warn(
        `[LazyCache] Redis ping failed (${consecutiveFailures}/${FAILURE_THRESHOLD}): ${error.message}`
      )
    }
    // When already on memory, silently wait for Redis to recover (no spam)
  }
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

function memoryCache<T, S>(
  cachedFunction: Fn<T, S>,
  timeMs: number,
  options?: { allowStale?: boolean }
): Fn<T, S> {
  const caches: {
    [key: string]: MemoryCacheEntry<T>
  } = {}
  return async (...args) => {
    const key = JSON.stringify(args)

    let cached = caches[key]
    if (cached) {
      const { at, promise, value } = cached
      if (!isExpired(at, timeMs)) {
        return value
      }

      // If Redis is down and we have stale data, prefer serving stale over hitting DB
      // This prevents thundering herd when Redis fails and all pods lose shared cache
      if (
        options?.allowStale &&
        cacheStrategy === 'memory' &&
        value !== undefined
      ) {
        const ageMinutes = at
          ? ((Date.now() - at) / TimeUnits.MINUTE).toFixed(1)
          : 'unknown'
        console.warn(
          `[LazyCache-Memory] Serving stale data due to Redis outage (age: ${ageMinutes}m) - preventing DB overload`
        )
        return value
      }

      if (promise) return value || promise
    } else {
      caches[key] = cached = {}
    }

    return (cached.promise = new Promise(resolve => {
      ;(async () => {
        const hasOldCache = cached && cached.value
        if (hasOldCache) resolve(cached.value)
        Object.assign(cached, {
          at: Date.now(),
          value: await cachedFunction(...args),
          promise: null,
        })
        if (!hasOldCache) resolve(cached.value)
      })()
    }))
  }
}

function redisCache<T, S>(
  cacheKey: string,
  cachedFunction: Fn<T, S>,
  timeMs: number,
  lockDurationMs: number,
  allowStale: boolean,
  prefetchOptions: PrefetchOptions = {}
): Fn<T, S> {
  // Create a memory cache fallback for when Redis fails
  // Pass through allowStale to prevent DB overload
  const memoryFallback = memoryCache(cachedFunction, timeMs, {
    allowStale,
  })

  const {
    prefetch: prefetchEnabled = false,
    // Default: trigger when 1.1× lock duration remains before expiry
    // This scales with lock time and works for any TTL
    // Example: TTL=10min, lock=5min → prefetchBefore=5.5min → trigger at age 4.5min
    // Example: TTL=60min, lock=30min → prefetchBefore=33min → trigger at age 27min
    prefetchBefore = lockDurationMs * 1.1,
  } = prefetchOptions

  return async (...args): Promise<T> => {
    const key = cacheKey + JSON.stringify(args)
    const lockKey = `${key}-lock`
    let lock = null

    try {
      // First: Try to get from cache first
      const result = await redis.get(key)
      if (result) {
        try {
          const cached = JSON.parse(result)
          // Expect simple format: { at: number, value: T }
          // Old formats will naturally expire and be replaced
          if (
            cached.at &&
            cached.value !== undefined &&
            !isExpired(cached.at, timeMs)
          ) {
            // Cache is still fresh - register for proactive prefetch if enabled
            if (prefetchEnabled) {
              // Register once per unique cache key for background monitoring
              if (!prefetchRegistry.has(key)) {
                prefetchRegistry.set(key, {
                  key,
                  cachedFunction,
                  args,
                  timeMs,
                  lockDurationMs,
                  prefetchBefore,
                })
                if (isDebugEnabled) {
                  console.debug(
                    `[LazyCache] Registered ${key} for proactive prefetch (TTL=${
                      timeMs / TimeUnits.MINUTE
                    }min, prefetchBefore=${
                      prefetchBefore / TimeUnits.MINUTE
                    }min)`
                  )
                }
              }
            }
            return cached.value
          }
        } catch (error) {
          reportError(error as Error, 'cache-parse')
        }
      }

      // Second: quick lock acquisition attempt
      try {
        lock = await redlock.lock(lockKey, lockDurationMs)
      } catch (lockError) {
        // Be more conservative about detecting "Redis down"
        // Only fall back to memory if Redis is TRULY unreachable
        // If lock is just held by another pod, use stale data instead

        const errorMsg = lockError.message || ''

        // Very specific conditions for "Redis actually down"
        const isRedisDown =
          errorMsg.includes('ECONNREFUSED') ||
          errorMsg.includes('ENOTFOUND') ||
          errorMsg.includes('ETIMEDOUT') ||
          (errorMsg.includes('Connection') && errorMsg.includes('closed')) ||
          consecutiveFailures >= FAILURE_THRESHOLD

        if (isRedisDown) {
          // Redis is truly down - use memory fallback as last resort
          console.error(
            `[LazyCache] Redis appears down for ${key}, using memory fallback`
          )
          reportError(lockError as Error, 'cache-lock-redis-down')
          return await memoryFallback(...(args as S[]))
        }

        // Lock is held by another instance OR Redis is just slow
        // Use stale data strategy - DO NOT run query
        return await handleLockFailure(key)
      }

      // We have the lock - double check cache
      try {
        const doubleCheckResult = await redis.get(key)
        if (doubleCheckResult) {
          const cached = JSON.parse(doubleCheckResult)
          // Simple format check: { at: number, value: T }
          if (
            cached.at &&
            cached.value !== undefined &&
            !isExpired(cached.at, timeMs)
          ) {
            return cached.value
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

      // Distinguish between timeout waiting for data vs actual Redis failures
      // If we timed out waiting, DO NOT fall back to memory (would run duplicate query)
      if (error instanceof DataRefreshInProgressError) {
        // Another pod is still computing - propagate to caller without running duplicate query
        throw error
      }

      reportError(error as Error, 'redis-operation')
      return await memoryFallback(...(args as S[]))
    }
  }

  async function handleLockFailure(key: string): Promise<T> {
    // During cold-start or high concurrency, lock contention is expected
    if (isDebugEnabled) {
      console.debug(`[LazyCache] Lock held for ${key}, using recovery strategy`)
    }

    if (allowStale) {
      // Prefer stale or fresh data before doing anything else
      try {
        const raw = await redis.get(key)
        if (raw) {
          const cached = JSON.parse(raw)
          // Simple format: { at: number, value: T }
          if (cached.at && cached.value !== undefined) {
            // Fresh data happened to appear
            if (!isExpired(cached.at, timeMs)) {
              return cached.value
            }

            // Return stale if allowed
            if (isDebugEnabled || !isColdStart()) {
              const ageMinutes = (
                (Date.now() - cached.at) /
                TimeUnits.MINUTE
              ).toFixed(2)
              console.warn(
                `[LazyCache] Returning stale data for ${key} (age: ${ageMinutes}m)`
              )
            }
            return cached.value
          }
        }
      } catch (err) {
        reportError(err as Error, 'stale-check-after-lock-failure')
      }

      // No stale or fresh data - wait for it to appear since another instance is computing
      if (isDebugEnabled) {
        console.debug(
          `[LazyCache] No data available for ${key}, waiting for refresh to complete`
        )
      }
      return await waitForFreshData(key)
    }

    // Fresh data REQUIRED - wait for it to appear
    if (isDebugEnabled) {
      console.debug(
        `[LazyCache] Fresh data required for ${key}, waiting for refresh`
      )
    }
    return await waitForFreshData(key)
  }

  async function waitForFreshData(key: string): Promise<T> {
    // Another pod/request holds the lock and is computing the data
    // Poll Redis until data appears or we timeout
    // Wait up to 90% of lock duration or 20min, whichever is less (allows time for long queries like vote leaderboard ~14-15min)
    const maxWaitTime = Math.min(lockDurationMs * 0.9, 20 * TimeUnits.MINUTE)
    const pollInterval = 1000 // Check every 1s (reduced frequency for long waits)
    const maxAttempts = Math.floor(maxWaitTime / pollInterval)

    if (isDebugEnabled) {
      console.debug(
        `[LazyCache] Waiting for fresh data for ${key} (max ${(
          maxWaitTime / 1000
        ).toFixed(0)}s)`
      )
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const raw = await redis.get(key)
        if (raw) {
          const cached = JSON.parse(raw)
          // Simple format: { at: number, value: T }
          if (
            cached.at &&
            cached.value !== undefined &&
            !isExpired(cached.at, timeMs)
          ) {
            if (isDebugEnabled) {
              console.debug(
                `[LazyCache] Fresh data appeared for ${key} after ${(
                  (attempt * pollInterval) /
                  1000
                ).toFixed(1)}s`
              )
            }
            return cached.value
          }
        }
      } catch (err) {
        reportError(err as Error, 'wait-for-fresh-poll')
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval))
    }

    // Timeout - data didn't appear within wait period
    const timeoutSeconds = (maxWaitTime / 1000).toFixed(0)
    console.warn(
      `[LazyCache] Timeout waiting for ${key} after ${timeoutSeconds}s (another pod still computing)`
    )
    reportError(
      new Error(`Timeout waiting for ${key} after ${timeoutSeconds}s`),
      'wait-for-fresh-timeout'
    )

    // Throw special error that won't trigger memory fallback
    throw new DataRefreshInProgressError(
      `Data is being refreshed by another server. Please try again in a moment.`
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

      // Store in cache with simple format
      try {
        await redis.set(
          key,
          JSON.stringify({ at: Date.now(), value }),
          'PX',
          timeMs
        )
        if (isDebugEnabled) {
          console.debug(
            `[LazyCache] Cached ${key} fetchTime=${fetchTime}ms, TTL=${Math.floor(
              timeMs / 1000
            )}s`
          )
        }
      } catch (setError) {
        reportError(setError as Error, 'cache-set')
      }

      return value
    } finally {
      await releaseLock(lock)
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
  allowStale = false, // Serve stale data when lock held by another pod OR when Redis is down
  prefetchOptions: PrefetchOptions = {} // Prefetch configuration
): Fn<T, S> {
  const memCache = memoryCache(f, timeMs, { allowStale })
  const redisCacheImpl = redisCache(
    cacheKey,
    f,
    timeMs,
    lockDurationMs,
    allowStale,
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
export function getCurrentCacheStrategy(): CacheStrategy {
  return cacheStrategy
}

export function forceCacheStrategy(strategy: CacheStrategy): void {
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
  stopPrefetchMonitoring()
  prefetchRegistry.clear()
}
