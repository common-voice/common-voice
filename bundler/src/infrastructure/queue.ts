import { Queue } from 'bullmq'
import { taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { fetchLocalesWithClips } from '../core/locales'

const datasetReleaseQueue = new Queue('datasetRelease', {
  connection: {
    host: 'redis',
  },
})

const addJob = (locale: string) =>
  TE.tryCatch(
    async () => {
      await datasetReleaseQueue.add('processLocale', { locale })
    },
    err => Error(String(err)),
  )

export const addJobs = pipe(
  TE.Do,
  TE.bind('allLocales', () => fetchLocalesWithClips),
  TE.tap(({ allLocales }) => TE.of(console.log('Got the following locales: ', allLocales))),
  TE.map(({ allLocales }) => allLocales.map(locale => addJob(locale.name))),
  TE.chain(jobs => TE.sequenceArray(jobs))
)
