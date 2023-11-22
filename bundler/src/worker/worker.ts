import { Worker } from 'bullmq'
import { io as IO, taskEither as TE } from 'fp-ts'
import { pipe, constVoid } from 'fp-ts/lib/function'
import { processLocale } from './processor'
import { addProcessLocaleJobs } from '../infrastructure/queue'

export const createWorker: IO.IO<void> = () => {
  const worker = new Worker(
    'datasetRelease',
    async job => {
      switch (job.name) {
        case 'init': {
          return pipe(
            job.data,
            addProcessLocaleJobs,
            TE.match(
              () => constVoid(),
              err => console.log(err),
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
        host: 'redis',
      },
    },
  )

  worker.on('completed', job => {
    console.log('DONE with', job.name)
  })
}
