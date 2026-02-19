import { Queue } from 'bullmq'
import { taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import {
  fetchLocalesWithClips,
  fetchLocalesWithLicensedClips,
} from '../core/locales'
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
    TE.bind('jobs', () => {
      const licenseMode = settings.licenseMode || 'unlicensed'

      if (
        licenseMode !== 'unlicensed' &&
        licenseMode !== 'licensed' &&
        licenseMode !== 'both'
      ) {
        return TE.left(
          Error(
            `Unsupported licenseMode: "${licenseMode}". Must be one of: unlicensed, licensed, both`,
          ),
        )
      }

      if (licenseMode === 'licensed') {
        // Only process locales with licensed clips
        return pipe(
          fetchLocalesWithLicensedClips(settings.from, settings.until),
          TE.map(localesWithLicenses => {
            // Filter by languages if specified
            const filtered =
              settings.languages.length > 0
                ? localesWithLicenses.filter(l =>
                    settings.languages.includes(l.name),
                  )
                : localesWithLicenses

            console.log(
              `${filtered.length} locale-license combinations will be processed (licensed only): `,
              filtered.map(l => `${l.name} (${l.license})`).join(', '),
            )

            return filtered.map(({ name, license }) => ({
              locale: name,
              license,
              ...settings,
            }))
          }),
        )
      } else if (licenseMode === 'both') {
        // Process both unlicensed and licensed for all locales
        return pipe(
          TE.Do,
          TE.bind('allLocales', () => {
            if (settings.languages.length > 0) {
              return TE.right(settings.languages.map(l => ({ name: l })))
            } else {
              return fetchLocalesWithClips(settings.from, settings.until)
            }
          }),
          TE.bind('licensedLocales', () =>
            fetchLocalesWithLicensedClips(settings.from, settings.until),
          ),
          TE.map(({ allLocales, licensedLocales }) => {
            const jobs: ProcessLocaleJob[] = []

            // Add unlicensed jobs for all locales
            allLocales.forEach(locale => {
              jobs.push({
                locale: locale.name,
                license: undefined, // undefined means unlicensed
                ...settings,
              })
            })

            // Add licensed jobs
            const filteredLicensed =
              settings.languages.length > 0
                ? licensedLocales.filter(l =>
                    settings.languages.includes(l.name),
                  )
                : licensedLocales

            filteredLicensed.forEach(({ name, license }) => {
              jobs.push({
                locale: name,
                license,
                ...settings,
              })
            })

            console.log(
              `${jobs.length} total jobs will be processed (unlicensed + licensed): `,
              `${allLocales.length} unlicensed, ${filteredLicensed.length} licensed`,
            )

            return jobs
          }),
        )
      } else {
        // Default: 'unlicensed' - only process unlicensed
        return pipe(
          settings.languages.length > 0
            ? TE.right(settings.languages.map(l => ({ name: l })))
            : fetchLocalesWithClips(settings.from, settings.until),
          TE.map(locales => {
            console.log(
              `${locales.length} locales will be processed (unlicensed only): `,
              locales.map(l => l.name).join(', '),
            )

            return locales.map(locale => ({
              locale: locale.name,
              license: undefined, // undefined means unlicensed
              ...settings,
            }))
          }),
        )
      }
    }),
    TE.map(({ jobs }) =>
      jobs.map(job => {
        switch (settings.type) {
          case 'delta':
          case 'full':
            return addProcessLocaleJob(job)
          case 'statistics':
            return addGenerateStatisticsJob(job)
          default:
            throw Error('Unhandled job type')
        }
      }),
    ),
    TE.chain(jobPromises => TE.sequenceArray(jobPromises)),
  )
