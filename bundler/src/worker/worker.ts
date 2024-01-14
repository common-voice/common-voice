import { Worker } from 'bullmq'
import { io as IO, taskEither as TE } from 'fp-ts'
import { pipe, constVoid } from 'fp-ts/lib/function'
import { processLocale } from './processor'
import { addProcessLocaleJobs } from '../infrastructure/queue'
import { getRedisUrl } from '../config/config'

export const createWorker: IO.IO<void> = () => {
  const worker = new Worker(
    'datasetRelease',
    async job => {
      switch (job.name) {
        case 'init': {
          console.log('Initializing dataset release...')
          return pipe(
            job.data,
            addProcessLocaleJobs,
            TE.match(
              err => console.log('Error:', err),
              () => constVoid(),
            ),
          )()
        }
        case 'processLocale': {
          return processLocale(job)
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
