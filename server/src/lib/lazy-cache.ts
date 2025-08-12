import { redis, redlock, useRedis } from './redis'
import { TimeUnits } from 'common'

type Fn<T, S> = (...args: S[]) => Promise<T>

//
// Simple redis set manipulation
//

// Adds a value to a Redis SET with expiry
export async function redisSetAddWithExpiry(key: string, value: string, ttlMs: number) {
  await redis.sadd(key, value);
  await redis.expire(key, Math.floor(ttlMs / 1000)); // resets TTL each time
}

// Gets values from a Redis SET (if exists)
export async function redisSetMembers(key: string): Promise<string[]> {
  return (await redis.smembers(key)) || []
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
  return async (...args) => {
    const key = cacheKey + JSON.stringify(args)
    const result = await redis.get(key)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any
    let renewCache = true
    if (result) {
      const cached = JSON.parse(result)
      value = cached.value
      renewCache = isExpired(cached.at, timeMs)
    }

    if (!renewCache) return value

    return new Promise(async resolve => {
      const lock = await redlock.lock(key + '-lock', lockDurationMs)
      const result = await redis.get(key)
      if (result) {
        const cached = JSON.parse(result)
        renewCache = isExpired(cached.at, timeMs)
        resolve(cached.value)
      }

      if (renewCache) {
        value = await cachedFunction(...args)
        await redis.set(key, JSON.stringify({ at: Date.now(), value }))
        resolve(value)
      }

      await lock.unlock()
    })
  }
}

// TODO: The lock duration of 3 minutes is conservative
// After measuring per query performance and adding lock durations to calling functions, drop it to 30 sec
export default function lazyCache<T, S>(
  cacheKey: string,
  f: Fn<T, S>,
  timeMs: number,
  lockDurationMs = 3 * TimeUnits.MINUTE // TODO: drop this to 30 sec after finetuning
): Fn<T, S> {
  const memCache = memoryCache(f, timeMs)
  return async (...args: S[]) =>
    ((await useRedis) ? redisCache(cacheKey, f, timeMs, lockDurationMs) : memCache)(...args)
}
