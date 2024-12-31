import { Queue } from 'bullmq'
import { taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { fetchLocalesWithClips } from '../core/locales'
import { ProcessLocaleJob, Settings } from '../types'
import { getRedisUrl } from '../config/config'

const datasetReleaseQueue = new Queue('datasetRelease', {
  connection: {
    host: getRedisUrl(),
  },
})

const addJob = (queue: Queue) => (jobName: string) => (job: ProcessLocaleJob) =>
  TE.tryCatch(
    async () => {
      await queue.add(jobName, job)
    },
    err => Error(String(err)),
  )

const addProcessLocaleJob = addJob(datasetReleaseQueue)('processLocale')
const addGenerateStatisticsJob =
  addJob(datasetReleaseQueue)('generateStatistics')

export const addJobsToReleaseQueue = (settings: Settings) =>
  pipe(
    TE.Do,
    TE.bind('allLocales', () => {
      if (settings.languages.length > 0) {
        return TE.right(settings.languages.map(l => ({ name: l })))
      } else {
        return fetchLocalesWithClips(settings.from, settings.until)
      }
    }),
    TE.tap(({ allLocales }) =>
      TE.right(
        console.log(
          `${allLocales.length} locales will be processed: `,
          allLocales.map(locale => locale.name).join(', '),
        ),
      ),
    ),
    TE.map(({ allLocales }) =>
      allLocales.map(locale => {
        switch (settings.type) {
          case 'delta':
          case 'full':
            return addProcessLocaleJob({ locale: locale.name, ...settings })
          case 'statistics':
            return addGenerateStatisticsJob({
              locale: locale.name,
              ...settings,
            })
          default:
            throw Error('Unhandled job type')
        }
      }),
    ),
    TE.chain(jobs => TE.sequenceArray(jobs)),
  )
