import { redis, redlock, useRedis } from './redis'
import * as Sentry from '@sentry/node'
import type { Lock } from 'redlock'

import { TimeUnits } from 'common'
import { getConfig } from '../config-helper'

interface PrefetchOptions {
  prefetch?: boolean
  thresholdRatio?: number // Default 0.8 (refresh at 80% of TTL)
  safetyMultiplier?: number // Default 2.0 (use 2x avgFetchTime as safety margin)
}

// Logging control
const isDebugEnabled = ['local', 'sandbox'].includes(getConfig().ENVIRONMENT)

// Cold-start detection: track first N minutes after startup
const startupTime = Date.now()
const COLD_START_PERIOD = 2 * TimeUnits.MINUTE // First 2 minutes are "cold start"
function isColdStart(): boolean {
  return Date.now() - startupTime < COLD_START_PERIOD
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

// Track which error contexts we've already reported during cold-start
const coldStartErrorsReported = new Set<string>()

const HEALTH_CHECK_INTERVAL = 5 * TimeUnits.SECOND // 5 seconds always
const ERROR_REPORT_INTERVAL = 60 * TimeUnits.SECOND // Report errors once per minute

let consecutiveFailures = 0
const FAILURE_THRESHOLD = 5 // Require 5 consecutive failures before switching

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
  } = prefetchOptions

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
            `[LazyCache] Redis appears down for ${cacheKey}, using memory fallback`
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

      // Distinguish between timeout waiting for data vs actual Redis failures
      // If we timed out waiting, DO NOT fall back to memory (would run duplicate query)
      if (
        error instanceof Error &&
        error.message.includes('Timeout waiting for')
      ) {
        console.error(
          `[LazyCache] ${error.message} - NOT running duplicate query`
        )
        // Return empty result or throw to caller - do NOT run query again
        throw new Error(
          `The leaderboard is being refreshed. Please try again in a moment.`
        )
      }

      reportError(error as Error, 'redis-operation')
      return await memoryFallback(...(args as S[]))
    }
  }

  async function handleLockFailure(key: string): Promise<T> {
    // During cold-start or high concurrency, lock contention is expected
    if (isDebugEnabled) {
      console.debug(
        `[LazyCache] Lock held for ${cacheKey}, using recovery strategy`
      )
    }

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
            return value
          }

          // Return stale if allowed
          if (value) {
            if (isDebugEnabled || !isColdStart()) {
              const ageMinutes = ((Date.now() - at) / TimeUnits.MINUTE).toFixed(
                2
              )
              console.warn(
                `[LazyCache] Returning stale data for ${cacheKey} (age: ${ageMinutes}m)`
              )
            }
            return value
          }
        }
      } catch (err) {
        reportError(err as Error, 'stale-check-after-lock-failure')
      }

      // No stale or fresh data - wait for it to appear since another instance is computing
      if (isDebugEnabled) {
        console.debug(
          `[LazyCache] No data available for ${cacheKey}, waiting for refresh to complete`
        )
      }
      return await waitForFreshData(key)
    }

    // Fresh data REQUIRED - wait for it to appear
    if (isDebugEnabled) {
      console.debug(
        `[LazyCache] Fresh data required for ${cacheKey}, waiting for refresh`
      )
    }
    return await waitForFreshData(key)
  }

  async function waitForFreshData(key: string): Promise<T> {
    // Another pod/request holds the lock and is computing the data
    // Poll Redis until data appears or we timeout
    const maxWaitTime = Math.min(lockDurationMs, 60000) // Wait up to lock duration or 60s
    const pollInterval = 500 // Check every 500ms
    const maxAttempts = Math.floor(maxWaitTime / pollInterval)

    if (isDebugEnabled) {
      console.debug(
        `[LazyCache] Waiting for fresh data for ${cacheKey} (max ${(
          maxWaitTime / 1000
        ).toFixed(0)}s)`
      )
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const raw = await redis.get(key)
        if (raw) {
          const cached = JSON.parse(raw)
          const value = cached.value !== undefined ? cached.value : cached
          const at = cached.at || 0

          if (!isExpired(at, timeMs)) {
            if (isDebugEnabled) {
              console.debug(
                `[LazyCache] Fresh data appeared for ${cacheKey} after ${(
                  (attempt * pollInterval) /
                  1000
                ).toFixed(1)}s`
              )
            }
            return value
          }
        }
      } catch (err) {
        reportError(err as Error, 'wait-for-fresh-poll')
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval))
    }

    // Timeout - data didn't appear, throw error to trigger memory fallback
    const error = new Error(
      `Timeout waiting for ${cacheKey} after ${(maxWaitTime / 1000).toFixed(
        0
      )}s - falling back to direct query`
    )
    console.warn(`[LazyCache] ${error.message}`)
    reportError(error, 'wait-for-fresh-timeout')

    // Throw error - will be caught by outer catch and fall back to memory
    throw error
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
        if (isDebugEnabled) {
          console.debug(
            `[LazyCache] Cached ${cacheKey} with fetchTime=${fetchTime}ms, TTL=${Math.floor(
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
      if (isDebugEnabled) {
        console.debug(
          `[LazyCache] Prefetch triggered for ${cacheKey}: age=${age}ms, threshold=${refreshThreshold}ms`
        )
      }

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
          } catch (error) {
            // Log but don't throw - prefetch failures are non-critical
            if (isDebugEnabled) {
              console.warn(
                `[LazyCache] Prefetch failed for ${cacheKey}:`,
                error instanceof Error ? error.message : error
              )
            }
          } finally {
            if (prefetchLock) {
              try {
                await prefetchLock.unlock()
              } catch (unlockError) {
                // Silently ignore prefetch unlock errors in production
                if (isDebugEnabled) {
                  console.warn(
                    `[LazyCache] Prefetch unlock warning for ${cacheKey}:`,
                    unlockError instanceof Error
                      ? unlockError.message
                      : unlockError
                  )
                }
              }
            }
          }
        })().catch(error => {
          // Catch any errors thrown before the inner try-catch
          if (isDebugEnabled) {
            console.warn(
              `[LazyCache] Prefetch error for ${cacheKey}:`,
              error instanceof Error ? error.message : error
            )
          }
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
}
