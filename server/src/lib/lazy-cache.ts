import { redis, redlock, useRedis } from './redis'
import * as Sentry from '@sentry/node'

import { TimeUnits } from 'common'

type Fn<T, S> = (...args: S[]) => Promise<T>

interface LazyCachePrefetchOptions {
  preemptiveRefresh?: boolean
  preemptiveThreshold?: number
  enableTimingMetrics?: boolean
  timingWindowHours?: number
}

//
// Cache strategy management and HealthCheck
//

let cacheStrategy: 'redis' | 'memory' = 'memory'
let lastHealthCheck = 0
let lastErrorReport = 0
let errorCount = 0 // Track error count for rate limiting
let healthCheckInterval: NodeJS.Timeout | null = null
let memoryCacheCleanupInterval: NodeJS.Timeout | null = null

const HEALTH_CHECK_INTERVAL = 30 * TimeUnits.SECOND // 30 seconds if Redis has been in use
const RETRY_INTERVAL = 5 * TimeUnits.SECOND // 5 seconds when Redis was previously down
const ERROR_REPORT_INTERVAL = 60 * TimeUnits.SECOND // Report errors once per minute
const MEMORY_CACHE_GRACE_PERIOD = 5 * TimeUnits.MINUTE // Keep memory cache for 5 minutes after Redis recovery

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memoryCaches: { [key: string]: any } = {}
let memoryCacheUsed = false
let memoryCacheCleanupScheduled = false

// Initialize cache strategy once at module load and start health monitoring
useRedis.then(hasRedis => {
  cacheStrategy = hasRedis ? 'redis' : 'memory'
  console.log('Initial cache strategy:', cacheStrategy)

  // Start background health monitoring if Redis is initially available
  if (hasRedis) {
    startHealthMonitoring()
  }
})

function reportError(error: Error, context: string): void {
  const now = Date.now()
  errorCount++

  // Only report first error each minute, or if we haven't reported in a while
  if (now - lastErrorReport >= ERROR_REPORT_INTERVAL || errorCount === 1) {
    try {
      // Capture the exception with full context - this will group properly by error type
      Sentry.captureException(error, {
        tags: {
          context,
          cache_strategy: cacheStrategy,
          module: 'lazy-cache',
        },
        extra: {
          errorCount,
          cacheStrategy,
          lastErrorReport: new Date(lastErrorReport).toISOString(),
          timeSinceLastReport: now - lastErrorReport,
        },
      })

      // ALSO capture a message with static fingerprint for proper grouping
      Sentry.captureMessage(
        `Redis cache error occurred`, // Static message for grouping
        {
          level: 'warning',
          tags: {
            context,
            cache_strategy: cacheStrategy,
            error_type: error.name,
            module: 'lazy-cache',
          },
          extra: {
            errorMessage: error.message, // Dynamic details in extra
            errorStack: error.stack,
            errorCount,
            cacheStrategy,
            healthCheckStatus: `Last health check: ${new Date(
              lastHealthCheck
            ).toISOString()}`,
          },
          // Use fingerprint for better grouping control
          fingerprint: ['redis-cache-error', context],
        }
      )

      console.log('Redis cache error reported to Sentry:', {
        context,
        error: error.message,
        errorCount,
        cacheStrategy,
      })
    } catch (sentryError) {
      // Fallback if Sentry fails
      console.error('Failed to report to Sentry:', sentryError)
      console.error('Original error:', error)
    }

    lastErrorReport = now
    errorCount = 0 // Reset counter after reporting
  } else {
    // Log suppressed errors for debugging / implements Sentry rate-limiting
    console.log('Redis cache error suppressed (rate limited):', {
      context,
      error: error.message,
      errorCount,
      timeUntilNextReport: ERROR_REPORT_INTERVAL - (now - lastErrorReport),
    })
  }
}

// Start memory cache cleanup monitoring
function startMemoryCacheCleanupMonitoring(): void {
  if (memoryCacheCleanupInterval) {
    clearInterval(memoryCacheCleanupInterval)
  }

  memoryCacheCleanupInterval = setInterval(() => {
    if (memoryCacheCleanupScheduled) {
      console.log('Clearing memory caches after grace period')
      for (const key in memoryCaches) {
        delete memoryCaches[key]
      }
      memoryCacheUsed = false
      memoryCacheCleanupScheduled = false
      console.log('Memory caches cleared after Redis recovery grace period')
    }
  }, 30 * TimeUnits.SECOND) // Check every 30 seconds
}

// Background health monitoring
function startHealthMonitoring() {
  // Clear existing interval if any
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval)
  }

  // Check every 30 seconds if healthy, every 5 seconds if trying to recover
  healthCheckInterval = setInterval(async () => {
    const checkInterval =
      cacheStrategy === 'redis' ? HEALTH_CHECK_INTERVAL : RETRY_INTERVAL
    const now = Date.now()

    if (now - lastHealthCheck >= checkInterval) {
      await performHealthCheck()
    }
  }, RETRY_INTERVAL) // Check every 5 seconds minimum
}

export function stopHealthMonitoring(): void {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval)
    healthCheckInterval = null
  }
  if (memoryCacheCleanupInterval) {
    clearInterval(memoryCacheCleanupInterval)
    memoryCacheCleanupInterval = null
  }
}

export async function performHealthCheck(): Promise<void> {
  const previousStrategy = cacheStrategy
  try {
    await redis.ping()
    cacheStrategy = 'redis'
    if (previousStrategy === 'memory') {
      console.log('Redis recovered, switching to Redis cache')

      // Schedule memory cache cleanup after grace period instead of immediate cleanup
      if (memoryCacheUsed && !memoryCacheCleanupScheduled) {
        memoryCacheCleanupScheduled = true
        console.log(
          `Memory cache cleanup scheduled in ${
            MEMORY_CACHE_GRACE_PERIOD / 1000
          } seconds`
        )

        // Start cleanup monitoring if not already running
        if (!memoryCacheCleanupInterval) {
          startMemoryCacheCleanupMonitoring()
        }

        // Set timeout for actual cleanup
        setTimeout(() => {
          memoryCacheCleanupScheduled = false
        }, MEMORY_CACHE_GRACE_PERIOD)
      }

      // Report recovery to Sentry - this SHOULD happen very infrequently
      Sentry.captureMessage('Redis cache recovered', {
        level: 'info',
        tags: { context: 'cache-recovery' },
      })
    }
  } catch (error) {
    cacheStrategy = 'memory'

    // If Redis fails during grace period, cancel scheduled cleanup
    if (memoryCacheCleanupScheduled) {
      memoryCacheCleanupScheduled = false
      console.log('Redis failed during grace period - keeping memory cache')
    }

    if (previousStrategy === 'redis') {
      console.log('Redis health check failed, switching to memory cache')
      // Use rate-limited error reporting
      reportError(error as Error, 'health-check-failure')
    }
  }
  lastHealthCheck = Date.now()
}

async function getCacheStrategy(): Promise<'redis' | 'memory'> {
  // If we're in memory mode and it's time to check for recovery, do a health check
  const now = Date.now()
  const checkInterval =
    cacheStrategy === 'redis' ? HEALTH_CHECK_INTERVAL : RETRY_INTERVAL

  if (now - lastHealthCheck > checkInterval) {
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
  value: string,
  ttlMs: number
) {
  if ((await getCacheStrategy()) !== 'redis') return

  try {
    await redis.sadd(key, value)
    await redis.expire(key, Math.floor(ttlMs / 1000))
  } catch (error) {
    // Use rate-limited error reporting
    reportError(error as Error, 'redis-set-add')
    cacheStrategy = 'memory'
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
    cacheStrategy = 'memory'
    return []
  }
}

//
// lazyCache implementation - upgraded with prefetch support
//

async function updateTimingMetrics(
  timingKey: string,
  fetchTime: number,
  windowHours: number
): Promise<void> {
  const now = Date.now()
  const windowMs = windowHours * TimeUnits.HOUR

  try {
    const existingData = await redis.get(timingKey)
    const timingData = existingData
      ? JSON.parse(existingData)
      : {
          max: 0,
          count: 0,
          sum: 0,
          recent: [],
        }

    timingData.max = Math.max(timingData.max, fetchTime)
    timingData.count += 1
    timingData.sum += fetchTime

    timingData.recent = [
      ...timingData.recent,
      { timestamp: now, duration: fetchTime },
    ]
      .filter(entry => now - entry.timestamp <= windowMs)
      .slice(-100)

    await redis.set(timingKey, JSON.stringify(timingData), 'PX', windowMs)
  } catch (error) {
    console.error('Failed to update timing metrics:', error)
  }
}

async function getTimingMetrics(
  timingKey: string
): Promise<[number | null, number | null]> {
  try {
    const timingData = await redis.get(timingKey)
    if (!timingData) return [null, null]

    const parsed = JSON.parse(timingData)
    const max = parsed.max || null
    const avg = parsed && parsed.count > 0 ? parsed.sum / parsed.count : null

    return [max, avg]
  } catch (error) {
    console.error('Failed to get timing metrics:', error)
    return [null, null]
  }
}

function isExpired(at: number, timeMs: number) {
  return Date.now() - at > timeMs
}

function memoryCache<T, S>(
  cachedFunction: Fn<T, S>,
  timeMs: number,
  cacheKey: string
): Fn<T, S> {
  if (!memoryCaches[cacheKey]) {
    memoryCaches[cacheKey] = {}
  }

  const caches = memoryCaches[cacheKey]

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
      const hasOldCache = cached && cached.value
      if (hasOldCache) {
        resolve(cached.value)
      } else {
        cachedFunction(...args)
          .then(value => {
            Object.assign(cached, {
              at: Date.now(),
              value,
              promise: null,
            })
            resolve(value)
          })
          .catch(error => {
            // Make sure to clear the promise on error too
            cached.promise = null
            throw error
          })
      }
    }))
  }
}

function redisCache<T, S>(
  cacheKey: string,
  cachedFunction: Fn<T, S>,
  timeMs: number,
  lockDurationMs: number,
  options: LazyCachePrefetchOptions = {}
): Fn<T, S> {
  let memoryFallback: Fn<T, S> | null = null

  const {
    preemptiveRefresh = false,
    preemptiveThreshold = 0.8,
    enableTimingMetrics = true,
    timingWindowHours = 24,
  } = options

  return async (...args) => {
    const key = cacheKey + JSON.stringify(args)
    const timingKey = `timing:${key}`

    // Try to get from cache first
    try {
      if (preemptiveRefresh && enableTimingMetrics) {
        const refreshLock = await redlock.lock(key + '-refresh-lock', 5000)
        if (refreshLock) {
          try {
            const result = await redis.get(key)
            if (result) {
              const cached = JSON.parse(result)
              const age = Date.now() - cached.at
              const [maxFetchTime, _] = await getTimingMetrics(timingKey)
              let refreshTime
              let useTimingBased = false
              if (maxFetchTime) {
                refreshTime = timeMs - maxFetchTime * 1.5
                useTimingBased = true
                console.log(
                  `Timing-based preemptive check: ${maxFetchTime}ms max fetch, refresh at ${refreshTime}ms before expiry`
                )
              } else {
                refreshTime = timeMs * preemptiveThreshold
                console.log(
                  `Percentage-based preemptive check: refresh at ${
                    preemptiveThreshold * 100
                  }% of TTL`
                )
              }

              if (age > refreshTime && refreshTime > 0) {
                console.log(
                  `Preemptive refresh triggered for ${key} (age: ${age}ms, threshold: ${refreshTime}ms)`
                )

                const prefetchLockDuration =
                  useTimingBased && maxFetchTime
                    ? Math.ceil(maxFetchTime * 2)
                    : 30000

                setImmediate(async () => {
                  let prefetchLock = null
                  try {
                    prefetchLock = await redlock.lock(
                      key + '-prefetch-lock',
                      prefetchLockDuration
                    )

                    const refreshStartTime = Date.now()
                    const freshData = await cachedFunction(...args)
                    const refreshTimeTaken = Date.now() - refreshStartTime

                    await redis.set(
                      key,
                      JSON.stringify({ at: Date.now(), value: freshData }),
                      'PX',
                      timeMs
                    )

                    await updateTimingMetrics(
                      timingKey,
                      refreshTimeTaken,
                      timingWindowHours
                    )

                    console.log(
                      `Preemptive refresh completed for ${key} in ${refreshTimeTaken}ms`
                    )
                  } catch (error) {
                    console.error(
                      `Preemptive refresh failed for ${key}:`,
                      error
                    )
                  } finally {
                    if (prefetchLock) {
                      try {
                        await prefetchLock.unlock()
                      } catch (unlockError) {
                        console.error(
                          'Failed to release pre-fetch lock:',
                          unlockError
                        )
                      }
                    }
                  }
                })
              }
            }
          } finally {
            await refreshLock.unlock()
          }
        }
      }

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
          const fetchStartTime = Date.now()
          console.log(`LazyCache - Starting data fetch for ${key}...`)

          value = await cachedFunction(...args)

          const fetchTime = Date.now() - fetchStartTime
          console.log(
            `LazyCache - Data fetch completed for ${key} in ${fetchTime}ms`
          )

          if (enableTimingMetrics) {
            await updateTimingMetrics(timingKey, fetchTime, timingWindowHours)
            const [maxFetchTime, avgFetchTime] = await getTimingMetrics(
              timingKey
            )
            console.log(
              `LazyCache - Timing metrics for ${key}: current=${fetchTime}ms, max=${maxFetchTime}ms, avg=${
                avgFetchTime ? Math.round(avgFetchTime) : 'N/A'
              }ms`
            )

            if (fetchTime > lockDurationMs * 0.8) {
              const suggestedLock = Math.ceil(fetchTime * 1.5)
              console.log(
                `LazyCache - Suggested lock timeout: ${suggestedLock}ms (current: ${lockDurationMs}ms)`
              )
            }
          }

          // Try to cache the result if we have a lock
          if (lock) {
            try {
              await redis.set(
                key,
                JSON.stringify({ at: Date.now(), value }),
                'PX',
                timeMs
              )
            } catch (setError) {
              // Use rate-limited error reporting
              reportError(setError as Error, 'cache-set')
              cacheStrategy = 'memory'
            }
          }

          resolve(value)
        } finally {
          // Always try to release lock if we acquired it
          if (lock) {
            try {
              await lock.unlock()
            } catch (unlockError) {
              // Use rate-limited error reporting
              reportError(unlockError as Error, 'cache-unlock')
              cacheStrategy = 'memory'
            }
          }
        }
      })
    } catch (error) {
      // Use rate-limited error reporting
      reportError(error as Error, 'redis-operation')
      cacheStrategy = 'memory'

      // Only create memory fallback when Redis actually fails
      if (!memoryFallback) {
        memoryFallback = memoryCache(cachedFunction, timeMs, cacheKey)
        memoryCacheUsed = true
      }
      return await memoryFallback(...args)
    }
  }
}

export default function lazyCache<T, S>(
  cacheKey: string,
  f: Fn<T, S>,
  timeMs: number,
  lockDurationMs = 5 * TimeUnits.MINUTE,
  options: LazyCachePrefetchOptions = {} // For prefetch for long fetch functions - default empty == no-prefetch
): Fn<T, S> {
  const memCache = memoryCache(f, timeMs, cacheKey)
  const redisCacheImpl = redisCache(
    cacheKey,
    f,
    timeMs,
    lockDurationMs,
    options
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

  for (const key in memoryCaches) {
    delete memoryCaches[key]
  }
  memoryCacheUsed = false
  memoryCacheCleanupScheduled = false
}
