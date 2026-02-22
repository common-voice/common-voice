import { Worker } from 'bullmq'
import { io as IO, taskEither as TE } from 'fp-ts'
import { pipe, constVoid } from 'fp-ts/lib/function'
import { processLocale } from './processor'
import { processVariants } from './processVariants'
import { addJobsToReleaseQueue } from '../infrastructure/queue'
import { getRedisUrl } from '../config/config'
import { generateStatistics } from './generateStatistics'
import { logger } from '../infrastructure/logger'

export const createWorker: IO.IO<void> = () => {
  const worker = new Worker(
    'datasetRelease',
    async job => {
      switch (job.name) {
        case 'init': {
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
      // Jobs can run for 24 h+. The default lockDuration of 30 s causes the stalled-job checker to reassign
      // a job to a second pod after any brief Redis connectivity blip, resulting in duplicate processing.
      // 5 minutes gives pods enough time to recover from transient disconnections
      // while still re-queuing jobs within a reasonable window if a pod truly dies.
      lockDuration: 300_000,
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
