import 'dotenv/config'
import { program } from 'commander'
import { Queue } from 'bullmq'
import Redis from 'ioredis'
import { getRedisUrl } from '../config'

const QUEUE_NAME = 'datasetRelease'
const REDIS_PREFIX = 'scripted'

const resetBullmq = async (args: { languages?: string[] }) => {
  const host = getRedisUrl()
  const redis = new Redis({ host, lazyConnect: true })
  const queue = new Queue(QUEUE_NAME, { connection: { host } })

  try {
    const locales = args.languages ?? []
    const isSelective = locales.length > 0

    if (isSelective) {
      console.log(`Selective reset for locale(s): ${locales.join(', ')}`)
    } else {
      console.log('Full reset -- removing ALL BullMQ jobs and scripted:* Redis keys')
    }

    console.log()

    // -----------------------------------------------------------------------
    // 1. BullMQ jobs
    // -----------------------------------------------------------------------

    if (isSelective) {
      // Remove jobs whose locale (3rd segment of deterministic ID) matches
      const localeSet = new Set(locales)
      const states = ['completed', 'failed', 'wait', 'delayed', 'active'] as const
      let removed = 0
      for (const state of states) {
        const jobs = await queue.getJobs([state])
        for (const job of jobs) {
          if (!job.id) continue
          const parts = job.id.split('|')
          if (parts.length >= 3 && localeSet.has(parts[2])) {
            try {
              const result = await queue.remove(job.id)
              if (result === 1) removed++
            } catch {
              // Active/locked job -- cannot remove, report below
            }
          }
        }
      }
      console.log(`BullMQ: removed ${removed} job(s) for locale(s): ${locales.join(', ')}`)
    } else {
      // Full obliterate
      await queue.obliterate({ force: true })
      console.log('BullMQ: obliterated all jobs in queue')
    }

    // -----------------------------------------------------------------------
    // 2. Redis keys
    // -----------------------------------------------------------------------

    if (isSelective) {
      // Scan for all scripted:* keys and selectively clean locale entries
      const keys = await scanKeys(redis, `${REDIS_PREFIX}:*`)
      let cleaned = 0

      for (const key of keys) {
        const type = await redis.type(key)

        if (type === 'set') {
          // done SET: members are "locale" or "locale|license"
          const members = await redis.smembers(key)
          const toRemove = members.filter(m => locales.includes(m.split('|')[0]))
          if (toRemove.length > 0) {
            await redis.srem(key, ...toRemove)
            console.log(`  DEL members from ${key}: ${toRemove.join(', ')}`)
            cleaned += toRemove.length
          }
        } else if (type === 'hash') {
          // processing HASH: fields are "locale" or "locale|license"
          const fields = await redis.hkeys(key)
          const toRemove = fields.filter(f => locales.includes(f.split('|')[0]))
          if (toRemove.length > 0) {
            await redis.hdel(key, ...toRemove)
            console.log(`  DEL fields from ${key}: ${toRemove.join(', ')}`)
            cleaned += toRemove.length
          }
        } else if (type === 'list') {
          // Log lists (process log, problem clips): TSV rows with locale as first field.
          // Selective removal from lists is expensive -- skip for now, these expire via TTL.
          // Just report existence.
          const len = await redis.llen(key)
          if (len > 0) {
            console.log(`  SKIP ${key} (list, ${len} entries -- will expire via TTL)`)
          }
        }
        // Scalar keys (counters, timestamps) are release-scoped, not locale-scoped.
        // They are not selectively removable -- TTL handles cleanup.
      }
      console.log(`Redis: cleaned ${cleaned} locale entries from sets/hashes`)
    } else {
      // Full: delete every scripted:* key
      const keys = await scanKeys(redis, `${REDIS_PREFIX}:*`)

      // Also clean BullMQ's internal keys for the queue
      const bullKeys = await scanKeys(redis, `bull:${QUEUE_NAME}:*`)
      const allKeys = [...keys, ...bullKeys]

      if (allKeys.length > 0) {
        // Delete in batches to avoid blocking Redis
        const BATCH = 100
        for (let i = 0; i < allKeys.length; i += BATCH) {
          const batch = allKeys.slice(i, i + BATCH)
          await redis.del(...batch)
        }
      }

      console.log(`Redis: deleted ${keys.length} scripted:* key(s)`)
      if (bullKeys.length > 0) {
        console.log(`Redis: deleted ${bullKeys.length} bull:${QUEUE_NAME}:* key(s)`)
      }
    }

    // -----------------------------------------------------------------------
    // 3. Summary
    // -----------------------------------------------------------------------

    console.log()
    const counts = await queue.getJobCounts()
    console.log('Queue state after reset:', counts)
    console.log('Done.')
  } finally {
    await queue.close()
    await redis.quit()
  }

  process.exit(0)
}

/** SCAN for keys matching a pattern without blocking Redis. */
const scanKeys = async (redis: Redis, pattern: string): Promise<string[]> => {
  const keys: string[] = []
  let cursor = '0'
  do {
    const [next, batch] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 200)
    cursor = next
    keys.push(...batch)
  } while (cursor !== '0')
  return keys
}

program
  .name('reset-bullmq')
  .description(
    'Reset BullMQ queue and Redis state for the bundler.\n' +
      'Without -l: full reset (obliterate all jobs + delete all scripted:* keys).\n' +
      'With -l: selective reset (remove only jobs and Redis entries for specified locales).',
  )
  .option(
    '-l, --languages <locale...>',
    'Optional list of locales to reset. Only jobs and Redis entries for these locales are removed.',
  )
  .action(resetBullmq)

program.parse()
