import { Queue } from 'bullmq'
import { taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { fetchLocalesWithClips } from '../core/locales'
import { ProcessLocaleJob, Settings } from '../types'
import { getRedisConfig } from '../config/config'

const datasetReleaseQueue = new Queue('datasetRelease', {
  connection: getRedisConfig(),
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
    TE.bind('allLocales', () =>
      fetchLocalesWithClips(settings.from, settings.until),
    ),
    TE.tap(({ allLocales }) =>
      TE.right(
        console.log(
          'Got the following locales: ',
          allLocales.map(locale => locale.name).join(', '),
        ),
      ),
    ),
    TE.map(({ allLocales }) =>
      allLocales.map(locale =>
        addJobToDatasetReleaseQueue({ locale: locale.name, ...settings }),
      ),
    ),
    TE.chain(jobs => TE.sequenceArray(jobs)),
  )
