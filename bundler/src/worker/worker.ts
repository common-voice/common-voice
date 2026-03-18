import { Worker } from 'bullmq'
import { io as IO, taskEither as TE } from 'fp-ts'
import { pipe, constVoid } from 'fp-ts/lib/function'
import { processLocale } from './processor'
import { processVariants } from './processVariants'
import { addJobsToReleaseQueue, cleanStaleJobs, removeJobsForLocales } from '../infrastructure/queue'
import { BULLMQ_LOCK_DURATION_MS, getRedisUrl, redisKeys } from '../config'
import { generateStatistics } from './generateStatistics'
import { forceFlushLogs } from '../core/releaseLogger'
import { logger } from '../infrastructure/logger'
import { redisClient } from '../infrastructure/redis'
import { cleanCacheDir } from '../infrastructure/cleanCacheDir'

export const createWorker: IO.IO<void> = () => {
  const worker = new Worker(
    'datasetRelease',
    async (job, token) => {
      switch (job.name) {
        case 'init': {
          const s = job.data
          const dash = '-'.repeat(72)
          const locales = s.languages?.length > 0 ? s.languages.join(', ') : 'all'
          logger.info('', dash)
          logger.info('', `  RELEASE: ${s.releaseName}`)
          logger.info('', `  TYPE: ${s.type} | FROM: ${s.from} | UNTIL: ${s.until}`)
          logger.info('', `  LOCALES: ${locales} | LICENSE: ${s.licenseMode ?? 'unlicensed'}`)
          if (s.previousReleaseName) {
            logger.info('', `  PREV: ${s.previousReleaseName}`)
          }
          if (s.force && s.languages?.length > 0) {
            logger.info('', `  MODE: --force selective (reset + re-process locales: ${s.languages.join(', ')})`)
          } else if (s.force) {
            logger.info('', '  MODE: --force full (obliterate queue, re-process and overwrite all)')
          }
          logger.info('', dash)

          // Effective release names for Redis keys. processor.ts uses
          // suffixed names for licensed/variant jobs.
          const releaseNames = [s.releaseName]
          if (s.licenseMode === 'licensed' || s.licenseMode === 'both') {
            releaseNames.push(`${s.releaseName}-licensed`)
          }
          if (s.type === 'variants') {
            releaseNames.push(`${s.releaseName}-variants`)
          }

          const isSelectiveForce = s.force && s.languages?.length > 0

          if (s.force && !isSelectiveForce) {
            // -- Full force: obliterate everything and start fresh --

            // Flush partial-run logs to GCS before destroying them.
            await forceFlushLogs(s.releaseName)

            // Clear all Redis state (done + processing) for the release.
            for (const name of releaseNames) {
              const doneCleared = await redisClient.del(redisKeys.done(name))
              const procCleared = await redisClient.del(redisKeys.processing(name))
              if (doneCleared > 0 || procCleared > 0) {
                logger.info('WORKER', `Cleared done + processing for "${name}" (--force)`)
              }
            }

            // Obliterate entire queue (active + waiting + everything).
            await cleanStaleJobs(true)

            // Wipe local cache dir to reclaim disk space from prior runs.
            // Job failures do not clean up working files, so stale data can
            // accumulate and exhaust the PVC on subsequent --force runs.
            cleanCacheDir()
          } else if (isSelectiveForce) {
            // -- Selective force (-l + --force): only reset targeted locales --
            logger.info('WORKER', `Selective --force for locales: ${s.languages.join(', ')}`)

            const targetSet = new Set(s.languages as string[])

            for (const name of releaseNames) {
              // done SET: members are "locale" or "locale|license".
              // Remove all members whose locale prefix matches a target.
              const doneMembers = await redisClient.smembers(redisKeys.done(name))
              const toRemove = doneMembers.filter(m => targetSet.has(m.split('|')[0]))
              if (toRemove.length > 0) {
                await redisClient.srem(redisKeys.done(name), ...toRemove)
                logger.info('WORKER', `Removed ${toRemove.length} done member(s) from "${name}"`)
              }

              // processing HASH: fields are "locale" or "locale|license".
              const procFields = await redisClient.hkeys(redisKeys.processing(name))
              const procToRemove = procFields.filter(f => targetSet.has(f.split('|')[0]))
              if (procToRemove.length > 0) {
                await redisClient.hdel(redisKeys.processing(name), ...procToRemove)
                logger.info('WORKER', `Removed ${procToRemove.length} processing entry/entries from "${name}"`)
              }
            }

            // Remove BullMQ jobs for targeted locales only.
            await removeJobsForLocales(s.releaseName, s.languages)
          } else {
            // -- Normal (no force): clear processing HASH for crash recovery,
            //    clean completed/failed jobs for deterministic ID reuse --
            for (const name of releaseNames) {
              const cleared = await redisClient.del(redisKeys.processing(name))
              if (cleared > 0) {
                logger.info(
                  'WORKER',
                  `Cleared processing guard for "${name}" (previous run cleanup)`,
                )
              }
            }
            await cleanStaleJobs()
          }

          logger.info('WORKER', 'Initializing jobs...')
          return pipe(
            job.data,
            addJobsToReleaseQueue,
            TE.match(
              err => logger.error('WORKER', `Init error: ${String(err)}`),
              () => constVoid(),
            ),
          )()
        }
        case 'processLocale': {
          return processLocale(job, token)
        }
        case 'generateStatistics': {
          return generateStatistics(job)
        }
        case 'processVariants': {
          return processVariants(job)
        }
      }
    },
    {
      connection: {
        host: getRedisUrl(),
      },
      // ---------------------------------------------------------------------------
      // Lock & stall settings.
      //
      // Redis uses allkeys-lru eviction, which can evict BullMQ lock keys and
      // trigger false stall re-dispatches. Correctness is handled by the
      // processing HASH guard in processor.ts (stale entries are reclaimed),
      // so re-dispatches are either harmless skips or crash recovery.
      //
      // lockDuration is kept moderate to reduce "could not renew lock" log spam.
      // removeOnComplete/Fail keeps Redis lean (fewer keys -> less LRU pressure).
      // ---------------------------------------------------------------------------
      lockDuration: BULLMQ_LOCK_DURATION_MS,
      removeOnComplete: { age: 3_600, count: 1_000 }, // clean up after 1 hour
      removeOnFail: { age: 3_600, count: 1_000 },
    },
  )

  worker.on('error', err => {
    // BullMQ emits lock-renewal failures as Error objects when Redis LRU
    // evicts lock keys.  These are harmless (processing HASH guard handles
    // correctness) -- log a short warning instead of a full stack trace.
    const msg = String(err?.message ?? err)
    if (msg.includes('could not renew lock')) {
      logger.warn('WORKER', `Lock renewal failed - still computing: ${msg}`)
      return
    }
    logger.error('WORKER', `Unexpected error: ${err?.stack ?? msg}`)
  })

  worker.on('completed', job => {
    switch (job.name) {
      case 'init': {
        logger.info('WORKER', 'Initialization completed')
        break
      }
      case 'processVariants': {
        logger.info('WORKER', `[${job.data.locale}] Finished processing variants`)
        break
      }
    }
  })
}
