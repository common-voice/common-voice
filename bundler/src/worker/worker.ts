import { Worker } from 'bullmq'
import { io as IO, taskEither as TE } from 'fp-ts'
import { pipe, constVoid } from 'fp-ts/lib/function'
import { processLocale } from './processor'
import { addJobsToReleaseQueue } from '../infrastructure/queue'
import { getRedisUrl } from '../config/config'
import { generateStatistics } from './generateStatistics'

export const createWorker: IO.IO<void> = () => {
  const worker = new Worker(
    'datasetRelease',
    async job => {
      switch (job.name) {
        case 'init': {
          console.log('Initializing jobs...')
          return pipe(
            job.data,
            addJobsToReleaseQueue,
            TE.match(
              err => console.log('Error:', err),
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
      }
    },
    {
      connection: {
        host: getRedisUrl(),
      },
    },
  )

  worker.on('completed', job => {
    switch (job.name) {
      case 'init': {
        console.log('Initialization completed')
        break
      }
      case 'processLocale': {
        console.log(`Finished processing locale - ${job.data.locale}`)
        break
      }
    }
  })
}
