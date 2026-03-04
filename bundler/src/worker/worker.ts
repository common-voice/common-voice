import { Worker } from 'bullmq'
import { io as IO, taskEither as TE } from 'fp-ts'
import { pipe, constVoid } from 'fp-ts/lib/function'
import { processLocale } from './processor'
import { processVariants } from './processVariants'
import { addJobsToReleaseQueue, cleanStaleJobs } from '../infrastructure/queue'
import { getRedisUrl, redisKeys } from '../config/config'
import { generateStatistics } from './generateStatistics'
import { logger } from '../infrastructure/logger'
import { redisClient } from '../infrastructure/redis'

export const createWorker: IO.IO<void> = () => {
  const worker = new Worker(
    'datasetRelease',
    async job => {
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
          logger.info('', dash)

          // Clear the processing SET(s) from any previous run so re-runs can
          // reprocess locales that were left in-progress when a pod died.
          // processor.ts uses an effective releaseName (e.g. "<release>-licensed"
          // for licensed jobs), so we clear all variants this run might use.
          const processingNames = [s.releaseName]
          if (s.licenseMode === 'licensed' || s.licenseMode === 'both') {
            processingNames.push(`${s.releaseName}-licensed`)
          }
          for (const name of processingNames) {
            const cleared = await redisClient.del(redisKeys.processing(name))
            if (cleared > 0) {
              logger.info(
                'WORKER',
                `Cleared processing guard for "${name}" (previous run cleanup)`,
              )
            }
          }

          // Remove stale completed/failed BullMQ jobs so deterministic IDs
          // don't silently block queue.add() on re-runs.
          await cleanStaleJobs()

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
          return processLocale(job)
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
      // processing SET guard in processor.ts (SADD returns 0 -> instant skip),
      // so re-dispatches are harmless no-ops.
      //
      // lockDuration is kept moderate to reduce "could not renew lock" log spam.
      // removeOnComplete/Fail keeps Redis lean (fewer keys -> less LRU pressure).
      // ---------------------------------------------------------------------------
      lockDuration: 600_000, // 10 min -- reduces log spam from renewal failures
      removeOnComplete: { age: 3_600, count: 1_000 }, // clean up after 1 hour
      removeOnFail: { age: 3_600, count: 1_000 },
    },
  )

  worker.on('completed', job => {
    switch (job.name) {
      case 'init': {
        logger.info('WORKER', 'Initialization completed')
        break
      }
      case 'processLocale': {
        logger.info('WORKER', `[${job.data.locale}] Finished processing locale`)
        break
      }
      case 'processVariants': {
        logger.info('WORKER', `[${job.data.locale}] Finished processing variants`)
        break
      }
    }
  })
}
