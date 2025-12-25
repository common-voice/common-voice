import { redis, redlock } from './redis'
import { TimeUnits } from 'common'

/*
Redis set based caching class for simple lists of numbers and integers
- More performant/quicker and low memory footprint, so that cache sizes can be bigger
- Adds more functionality and exposes them for applications so that they can have more freedom
- Best use cases:
  - SELECT queries which return id fields only (locale_id, sentence_id, etc)
  - User skips, user reports, locales needing validation, locales having unrecorded sentences, etc

Example usage:

import { LazySetCache } from './redis-cache/lazy-set-cache'
import { TimeUnits } from 'common'

async function getAllClipIdsUserSkipped(user_id: number): Promise<any[]> {
  return await LazySetCache.use(
    `get-all-skipped-clip-ids:${user_id}`,
    async () => {
      return await this.db.getAllClipIdsUserSkipped(user_id)
    },
    TimeUnits.DAY
  )
}

// E.g. can be called just after sentence additions
await LazySetCache.addSingleWithExpiry('get-all-language-ids-with-unvalidated-sentences', newId, TimeUnits.HOUR)

// Generic
await LazySetCache.addManyWithExpiry('keep-alive-xyz', new_list, TimeUnits.HOUR)

*/

function msToSeconds(ms: number): number {
  return Math.floor(ms / 1000)
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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await lock.unlock().catch(() => {})
  }
}

/* LazySetCache as class with exposed methods */
export class LazySetCache {
  // Add one item (number|string) to a Redis SET with TTL (resets TTL)
  static async addSingleWithExpiry(
    key: string,
    value: number | string,
    cacheDurationMs: number
  ): Promise<void> {
    await redis.sadd(key, String(value))
    await redis.expire(key, msToSeconds(cacheDurationMs))
  }

  // Add multiple items (numbers|string) to a Redis SET with TTL (resets TTL)
  static async addManyWithExpiry(
    key: string,
    values: (number | string)[],
    cacheDurationMs: number
  ): Promise<void> {
    if (values.length === 0) return
    await redis.sadd(key, ...values.map(String))
    await redis.expire(key, msToSeconds(cacheDurationMs))
  }

  // Replace Redis SET with new values (deletes old, sets new, sets TTL)
  static async fill(
    key: string,
    values: (number | string)[],
    cacheDurationMs: number
  ): Promise<void> {
    const pipeline = redis.multi()
    pipeline.del(key)
    if (values.length === 0) {
      pipeline.sadd(key, '__EMPTY__')
    } else {
      pipeline.sadd(key, ...values.map(String))
    }
    pipeline.expire(key, msToSeconds(cacheDurationMs))
    await pipeline.exec()
  }

  // Read all members from Redis SET as strings or numbers
  static async getMembers(key: string): Promise<(number | string)[]> {
    const raw = await redis.smembers(key)
    return raw.map(v => {
      const n = Number(v)
      return isNaN(n) ? v : n
    })
  }

  // Function to get random count members from a set
  // `count > 0` returns up to `count` distinct elements
  // `count < 0` returns abs(count) elements allowing duplicates
  // `pop = true` removes elements from the set after retrieval
  static async getRandom(
    key: string,
    count: number,
    pop = false
  ): Promise<(number | string)[]> {
    if (pop) {
      const raw = await redis.spop(key, count)
      if (!raw) return []
      // spop can return a single string or an array depending on count
      const items = Array.isArray(raw) ? raw : [raw]
      return items.map(v => {
        const n = Number(v)
        return isNaN(n) ? v : n
      })
    }
    return await redis.srandmember(key, count)
  }

  // Function to get random count members from a set with filtering
  // Uses a supplied filter function (e.g. includes, !includes, equal, not equal) which returns a boolean
  // `pop = true` removes matching elements from the set after retrieval
  static async getRandomWithFiltering<T extends string | number>(
    key: string,
    count: number,
    filterFn: (item: T) => boolean,
    pop = false
  ): Promise<T[]> {
    const maxTries = 10
    const MAX_RAND = 30
    const results: T[] | Set<T> = pop ? [] : new Set<T>()
    let tries = 0

    while (
      (pop ? (results as T[]).length : (results as Set<T>).size) < count &&
      tries < maxTries
    ) {
      const toFetch = Math.max(count * 2, MAX_RAND)
      const sample = await redis.srandmember(key, toFetch)

      if (!sample || sample.length === 0) break

      if (pop) {
        const toRemove: T[] = []
        for (const raw of sample) {
          const item = isNaN(Number(raw)) ? (raw as T) : (Number(raw) as T)

          if (filterFn(item) && !(results as T[]).includes(item)) {
            toRemove.push(item)
            if ((results as T[]).length + toRemove.length >= count) break
          }
        }

        // Remove the filtered items from the set
        if (toRemove.length > 0) {
          await redis.srem(key, ...toRemove.map(String))
          ;(results as T[]).push(...toRemove)
        }
      } else {
        // Non-pop mode - just collect unique items
        for (const raw of sample) {
          const item = isNaN(Number(raw)) ? (raw as T) : (Number(raw) as T)

          if (filterFn(item)) {
            ;(results as Set<T>).add(item)
            if ((results as Set<T>).size >= count) break
          }
        }
      }

      if ((pop ? (results as T[]).length : (results as Set<T>).size) >= count)
        break
      tries++
    }

    return pop
      ? (results as T[]).slice(0, count)
      : Array.from(results as Set<T>).slice(0, count)
  }

  /*main function as static method*/
  static async use(
    key: string,
    fetchFn: () => Promise<(number | string)[]>,
    cacheDurationMs: number,
    lockDurationMs: number = TimeUnits.MINUTE // TODO: Adjust this after finetuning
  ): Promise<(number | string)[]> {
    const currentCount = await redis.scard(key)
    if (currentCount > 0) {
      const members = await redis.smembers(key)
      return members.map(v => {
        const n = Number(v)
        return isNaN(n) ? v : n
      })
    }
    // Acquire lock, fetch fresh data, fill cache, and return the data
    return await withRedisLock(key, lockDurationMs, async () => {
      const fresh = await fetchFn()
      await LazySetCache.fill(key, fresh, cacheDurationMs)
      return fresh
    })
  }
}
