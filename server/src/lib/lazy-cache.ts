import { redis, redlock, useRedis } from './redis'
import { TimeUnits } from 'common'

type Fn<T, S> = (...args: S[]) => Promise<T>

//
// Cache strategy management and HealthCheck
//

let cacheStrategy: 'redis' | 'memory' = 'memory'
let lastHealthCheck = 0
const HEALTH_CHECK_INTERVAL = 30 * TimeUnits.SECOND // 30 seconds if Redis has been in use
const RETRY_INTERVAL = 5 * TimeUnits.SECOND // 5 seconds when Redis was previously down

// Initialize cache strategy once at module load and start health monitoring
useRedis.then(hasRedis => {
  cacheStrategy = hasRedis ? 'redis' : 'memory'
  console.log('Initial cache strategy:', cacheStrategy)

  // Start background health monitoring if Redis is initially available
  if (hasRedis) {
    startHealthMonitoring()
  }
})

// Background health monitoring
function startHealthMonitoring() {
  // Check every 30 seconds if healthy, every 5 seconds if trying to recover
  setInterval(async () => {
    const checkInterval =
      cacheStrategy === 'redis' ? HEALTH_CHECK_INTERVAL : RETRY_INTERVAL
    const now = Date.now()

    if (now - lastHealthCheck >= checkInterval) {
      await performHealthCheck()
    }
  }, RETRY_INTERVAL) // Check every 5 seconds minimum
}

async function performHealthCheck(): Promise<void> {
  const previousStrategy = cacheStrategy
  try {
    await redis.ping()
    cacheStrategy = 'redis'
    if (previousStrategy === 'memory') {
      console.log('Redis recovered, switching to Redis cache')
    }
  } catch (error) {
    cacheStrategy = 'memory'
    if (previousStrategy === 'redis') {
      console.log('Redis health check failed, switching to memory cache')
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
    console.error('Redis set add failed:', error)
    cacheStrategy = 'memory'
  }
}

// Gets values from a Redis SET (if exists)
export async function redisSetMembers(key: string): Promise<string[]> {
  if ((await getCacheStrategy()) !== 'redis') return []

  try {
    return (await redis.smembers(key)) || []
  } catch (error) {
    console.error('Redis set members failed:', error)
    cacheStrategy = 'memory'
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
          console.error('Failed to parse cached value:', error)
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
            console.error('Redis double-check failed:', error)
          }
        } catch (lockError) {
          console.error(
            'Failed to acquire lock, executing without cache protection:',
            lockError
          )
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
              console.error('Failed to set cache:', setError)
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
              console.error('Failed to unlock:', unlockError)
              cacheStrategy = 'memory'
            }
          }
        }
      })
    } catch (error) {
      console.error('Redis operation failed, using memory fallback:', error)
      cacheStrategy = 'memory'
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
