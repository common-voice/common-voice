import { Queue } from 'bullmq'
import { taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { fetchLocalesWithClips } from '../core/locales'
import { ProcessLocaleJob } from '../types'

export type Settings = {
  type: 'full' | 'delta'
  from: string
  until: string
  releaseName: string
}

const datasetReleaseQueue = new Queue('datasetRelease', {
  connection: {
    host: 'redis',
  },
})

const addJob = (queue: Queue) => (job: ProcessLocaleJob) =>
  TE.tryCatch(
    async () => {
      await queue.add('processLocale', job)
    },
    err => Error(String(err)),
  )

const addJobToDatasetReleaseQueue = addJob(datasetReleaseQueue)

export const addProcessLocaleJobs = (settings: Settings) =>
  pipe(
    TE.Do,
    TE.bind('allLocales', () => fetchLocalesWithClips),
    TE.tap(({ allLocales }) =>
      TE.of(console.log('Got the following locales: ', allLocales)),
    ),
    TE.map(({ allLocales }) =>
      allLocales.map(locale =>
        addJobToDatasetReleaseQueue({ locale: locale.name, ...settings }),
      ),
    ),
    TE.chain(jobs => TE.sequenceArray(jobs)),
  )
