import { Worker } from 'bullmq'
import { io as IO } from 'fp-ts'
import { processLocale } from './processor'

export const createWorker: IO.IO<void> = () => {
    const worker = new Worker(
        'datasetRelease',
        processLocale,
        {
            connection: {
                host: 'redis',
            },
        }
    )

    worker.on('completed', (job) => {
        console.log('DONE with', job.data.locale)
    })
}
