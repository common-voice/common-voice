import { redis, redlock } from './redis'
import { TimeUnits } from 'common'

//
// Redis set based caching module for simple lists of numbers and integers
// - More performant, quicker and low memory footprint, so that cache size can be bigger
// - Adds more functionality and exposes them for application has more freedom
// - Best use cases:
//   - SELECT queries which return id fields only (locale_id, sentence_id, etc)
//   - User skips, user reports, locales needing validation, locales having unrecorded sentences, etc
//

function msToSeconds(ms: number): number {
  return Math.floor(ms / 1000)
}

// Add one item (number|string) to a Redis SET with TTL (resets TTL)
export async function lazySetCacheAddWithExpiry(
  key: string,
  value: number | string,
  cacheDurationMs: number
): Promise<void> {
  await redis.sadd(key, String(value))
  await redis.expire(key, msToSeconds(cacheDurationMs))
}

// Add multiple items (numbers|string) to a Redis SET with TTL (resets TTL)
export async function lazySetCacheAddManyWithExpiry(
  key: string,
  values: (number | string)[],
  cacheDurationMs: number
): Promise<void> {
  if (values.length === 0) return
  await redis.sadd(key, ...values.map(String))
  await redis.expire(key, msToSeconds(cacheDurationMs))
}

// Replace Redis SET with new values (deletes old, sets new, sets TTL)
export async function lazySetCacheFill(
  key: string,
  values: (number | string)[],
  cacheDurationMs: number
): Promise<void> {
  const pipeline = redis.multi()
  pipeline.del(key)
  if (values.length > 0) {
    pipeline.sadd(key, ...values.map(String))
  }
  pipeline.expire(key, msToSeconds(cacheDurationMs))
  await pipeline.exec()
}

// Read all members from Redis SET as strings or numbers
export async function lazySetCacheGetMembers(
  key: string
): Promise<(number | string)[]> {
  const raw = await redis.smembers(key)
  return raw.map(v => {
    const n = Number(v)
    return isNaN(n) ? v : n
  })
}

// Function to get random count members from a set
// `count > 0` returns up to `count` distinct elements
// `count < 0` returns abs(count) elements allowing duplicates
export async function lazySetCacheGetRandom(
  key: string,
  count: number
): Promise<(number | string)[]> {
  return await redis.srandmember(key, count)
}

// Function to get random count members from a set with filtering
// Uses a filter function filterFn (e.g. includes, !includes, equal, not equal) which returns a boolean
export async function lazySetCacheGetRandomWithFiltering<
  T extends string | number
>(key: string, count: number, filterFn: (item: T) => boolean): Promise<T[]> {
  const maxTries = 10
  const MAX_RAND = 30
  const results = new Set<T>()
  let tries = 0

  while (results.size < count && tries < maxTries) {
    const toFetch = Math.max(count * 2, MAX_RAND) // fetch more than needed
    const sample = await redis.srandmember(key, toFetch)
    // no more
    if (!sample || sample.length === 0) break
    // add more until filled
    for (const raw of sample) {
      // Try parsing as number if T might be number
      const item = isNaN(Number(raw)) ? (raw as T) : (Number(raw) as T)

      if (filterFn(item)) {
        results.add(item)
        if (results.size >= count) break
      }
    }
    // more needed
    tries++
  }
  return Array.from(results).slice(0, count)
}

// Locking Wrapper
async function withRedisLock<T>(
  key: string,
  lockDurationMs: number,
  fn: () => Promise<T>
): Promise<T> {
  const lock = await redlock.lock(`${key}:lock`, lockDurationMs)
  try {
    return await fn()
  } finally {
    await lock.unlock().catch(() => {})
  }
}

// Lazy fetch or populate a Redis SET with basic values
export async function lazySetCache(
  key: string,
  fetchFn: () => Promise<(number | string)[]>,
  cacheDurationMs: number,
  lockDurationMs = TimeUnits.MINUTE // TODO: Adjust this after finetuning
): Promise<(number | string)[]> {
  const currentCount = await redis.scard(key)
  if (currentCount > 0) {
    const members = await redis.smembers(key)
    return members.map(v => {
      const n = Number(v)
      return isNaN(n) ? v : n
    })
  }
  await withRedisLock(key, lockDurationMs, async () => {
    const fresh = await fetchFn()
    await lazySetCacheFill(key, fresh, cacheDurationMs)
    return fresh
  })
  return []
}
