import { Queue } from 'bullmq'
import { taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { fetchLocalesWithClips } from '../core/locales'

const datasetReleaseQueue = new Queue('datasetRelease', {
  connection: {
    host: 'redis',
  },
})

const addJob = (queue: Queue) => (locale: string) =>
  TE.tryCatch(
    async () => {
      await queue.add('processLocale', { locale })
    },
    err => Error(String(err)),
  )

const addJobToDatasetReleaseQueue = addJob(datasetReleaseQueue)

export const addJobs = pipe(
  TE.Do,
  TE.bind('allLocales', () => fetchLocalesWithClips),
  TE.tap(({ allLocales }) => TE.of(console.log('Got the following locales: ', allLocales))),
  TE.map(({ allLocales }) => allLocales.map(locale => addJobToDatasetReleaseQueue(locale.name))),
  TE.chain(jobs => TE.sequenceArray(jobs))
)
