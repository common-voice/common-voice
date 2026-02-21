import { Queue } from 'bullmq'
import { taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import {
  fetchLocalesWithClips,
  fetchLocalesWithLicensedClips,
} from '../core/locales'
import { DatasheetLocalePayload, ProcessLocaleJob, Settings } from '../types'
import { getRedisUrl, RELEASE_LOG_KEY_TTL_SEC, redisKeys } from '../config/config'
import { logger } from './logger'
import { fetchDatasheetsPayloads } from './datasheetsFetcher'
import { redisClient } from './redis'

const datasetReleaseQueue = new Queue('datasetRelease', {
  connection: {
    host: getRedisUrl(),
  },
})

const addJob = (queue: Queue) => (jobName: string) => (job: ProcessLocaleJob) =>
  TE.tryCatch(
    async () => {
      // Deterministic ID prevents duplicate jobs when the init job is stalled
      // and re-processed: BullMQ ignores queue.add() for a jobId that is
      // already waiting or active.
      // jobName is included so processLocale and generateStatistics for the
      // same locale/release don't collide.
      const jobId = `${jobName}|${job.releaseName}|${job.locale}|${job.license ?? 'unlicensed'}`
      await queue.add(jobName, job, { jobId })
    },
    err => Error(String(err)),
  )

const addProcessLocaleJob = addJob(datasetReleaseQueue)('processLocale')
const addGenerateStatisticsJob =
  addJob(datasetReleaseQueue)('generateStatistics')

const attachDatasheetPayload = (
  job: ProcessLocaleJob,
  payloads: Map<string, DatasheetLocalePayload>,
): ProcessLocaleJob => {
  const payload = payloads.get(job.locale)
  if (payload) return { ...job, datasheetPayload: payload }
  return job
}

export const addJobsToReleaseQueue = (settings: Settings) =>
  pipe(
    TE.Do,
    // Fetch datasheets.json once before dispatching locale jobs.
    // Non-blocking: an empty map means no datasheets will be generated.
    TE.bind('datasheetPayloads', () =>
      fetchDatasheetsPayloads(
        settings.modality ?? 'scripted',
        settings.datasheetsFile,
      ),
    ),
    TE.bind('jobs', ({ datasheetPayloads }) => {
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

            logger.info(
              'QUEUE',
              `${filtered.length} locale-license combinations scheduled (licensed only): ${filtered.map(l => `${l.name} (${l.license})`).join(', ')}`,
            )

            return filtered.map(({ name, license }) =>
              attachDatasheetPayload(
                { locale: name, license, ...settings },
                datasheetPayloads,
              ),
            )
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
              jobs.push(
                attachDatasheetPayload(
                  { locale: locale.name, license: undefined, ...settings },
                  datasheetPayloads,
                ),
              )
            })

            // Add licensed jobs
            const filteredLicensed =
              settings.languages.length > 0
                ? licensedLocales.filter(l =>
                    settings.languages.includes(l.name),
                  )
                : licensedLocales

            filteredLicensed.forEach(({ name, license }) => {
              jobs.push(
                attachDatasheetPayload(
                  { locale: name, license, ...settings },
                  datasheetPayloads,
                ),
              )
            })

            logger.info(
              'QUEUE',
              `${jobs.length} total jobs scheduled (unlicensed + licensed): ${allLocales.length} unlicensed, ${filteredLicensed.length} licensed`,
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
            logger.info(
              'QUEUE',
              `${locales.length} locales scheduled (unlicensed only): ${locales.map(l => l.name).join(', ')}`,
            )

            return locales.map(locale =>
              attachDatasheetPayload(
                { locale: locale.name, license: undefined, ...settings },
                datasheetPayloads,
              ),
            )
          }),
        )
      }
    }),
    // Accumulate locale totals in Redis before jobs are enqueued.
    // Using INCRBY (not SET) so multiple batches for the same release
    // accumulate correctly — `count == total` fires only when ALL batches
    // across ALL runs are done. Lists are never deleted: they grow across
    // batches and are cleaned up by the 7-day TTL.
    TE.chainFirst(({ jobs }) =>
      TE.tryCatch(async () => {
        // Group job count by effective release name (license → "-licensed" suffix).
        const totals = new Map<string, number>()
        for (const job of jobs) {
          const name = job.license
            ? `${settings.releaseName}-licensed`
            : settings.releaseName
          totals.set(name, (totals.get(name) ?? 0) + 1)
        }
        for (const [name, batchCount] of totals) {
          // Accumulate total across batches (atomic INCRBY).
          await redisClient.incrby(redisKeys.localeTotal(name), batchCount)
          await redisClient.expire(redisKeys.localeTotal(name), RELEASE_LOG_KEY_TTL_SEC)
          // Refresh TTLs on accumulator keys if they already exist.
          await redisClient.expire(redisKeys.localeCount(name), RELEASE_LOG_KEY_TTL_SEC)
          await redisClient.expire(redisKeys.problemClips(name), RELEASE_LOG_KEY_TTL_SEC)
          await redisClient.expire(redisKeys.processLog(name), RELEASE_LOG_KEY_TTL_SEC)
          await redisClient.expire(redisKeys.done(name), RELEASE_LOG_KEY_TTL_SEC)
          logger.info(
            'QUEUE',
            `Release "${name}": +${batchCount} locale(s) scheduled`,
          )
        }
      }, err => Error(String(err))),
    ),
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
