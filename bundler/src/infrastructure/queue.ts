import { Queue } from 'bullmq'
import { taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import {
  fetchLocalesWithClips,
  fetchLocalesWithLicensedClips,
  fetchLocalesWithVariantClips,
  fetchDeltaLocales,
  fetchDeltaLicensedLocales,
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
const addProcessVariantsJob = addJob(datasetReleaseQueue)('processVariants')

const attachDatasheetPayload = (
  job: ProcessLocaleJob,
  payloads: Map<string, DatasheetLocalePayload>,
): ProcessLocaleJob => {
  const payload = payloads.get(job.locale)
  if (payload) return { ...job, datasheetPayload: payload }
  return job
}

/** For delta: only previous-release locales. For full/stats: all locales in window. */
const getLocales = (settings: Settings) =>
  settings.type === 'delta'
    ? fetchDeltaLocales(settings.from, settings.until)
    : fetchLocalesWithClips(settings.from, settings.until)

const getLicensedLocales = (settings: Settings) =>
  settings.type === 'delta'
    ? fetchDeltaLicensedLocales(settings.from, settings.until)
    : fetchLocalesWithLicensedClips(settings.from, settings.until)

/**
 * Remove stale completed/failed BullMQ jobs from previous runs.
 * Without this, deterministic job IDs cause queue.add() to silently no-op
 * when a previous run's completed jobs still exist in Redis.
 * Also drains accumulated garbage from old code that lacked removeOnComplete.
 */
export const cleanStaleJobs = async (): Promise<void> => {
  const completed = await datasetReleaseQueue.clean(0, 0, 'completed')
  const failed = await datasetReleaseQueue.clean(0, 0, 'failed')
  if (completed.length > 0 || failed.length > 0) {
    logger.info(
      'QUEUE',
      `Cleaned ${completed.length} completed + ${failed.length} failed stale jobs`,
    )
  }
}

export const addJobsToReleaseQueue = (settings: Settings) =>
  pipe(
    TE.Do,
    // Fetch datasheets.json before dispatching locale jobs.
    // Default file name is derived from the release name when not provided.
    // Non-blocking: an empty map means no datasheets will be generated.
    TE.bind('datasheetPayloads', () =>
      fetchDatasheetsPayloads(
        settings.modality ?? 'scripted',
        settings.datasheetsFile ?? `${settings.releaseName}.json`,
      ),
    ),
    TE.bind('jobs', ({ datasheetPayloads }) => {
      // Variant releases have their own dispatch path -- one job per locale
      // carrying all variants for that locale. No license mode branching.
      if (settings.type === 'variants') {
        return pipe(
          fetchLocalesWithVariantClips(settings.from, settings.until),
          TE.map(groups => {
            const filtered =
              settings.languages.length > 0
                ? groups.filter(g => settings.languages.includes(g.locale))
                : groups

            const summary = filtered
              .map(g => `${g.locale} (${g.variants.length} variants, ~${g.totalClipCount} clips)`)
              .join(', ')
            logger.info(
              'QUEUE',
              `${filtered.length} locale(s) with variants: ${summary}`,
            )

            return filtered.map(
              (group): ProcessLocaleJob => ({
                ...settings,
                locale: group.locale,
                expectedClipCount: group.totalClipCount,
                variants: group.variants,
              }),
            )
          }),
        )
      }

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
          getLicensedLocales(settings),
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

            return filtered.map(({ name, license, clip_count }) =>
              attachDatasheetPayload(
                { locale: name, license, expectedClipCount: clip_count, ...settings },
                datasheetPayloads,
              ),
            )
          }),
        )
      } else if (licenseMode === 'both') {
        // Process both unlicensed and licensed for all locales
        return pipe(
          TE.Do,
          TE.bind('allLocales', () =>
            pipe(
              getLocales(settings),
              TE.map(locales => {
                if (settings.languages.length === 0) return locales
                if (settings.type === 'delta') {
                  // Delta: only keep requested locales that exist in previous release
                  return locales.filter(l => settings.languages.includes(l.name))
                }
                // Full/stats: include all requested locales (even those with 0 clips)
                const countMap = new Map(locales.map(l => [l.name, l.clip_count]))
                return settings.languages.map(l => ({
                  name: l,
                  clip_count: countMap.get(l) ?? 0,
                }))
              }),
            ),
          ),
          TE.bind('licensedLocales', () =>
            getLicensedLocales(settings),
          ),
          TE.map(({ allLocales, licensedLocales }) => {
            const jobs: ProcessLocaleJob[] = []

            // Add unlicensed jobs for all locales
            allLocales.forEach(locale => {
              jobs.push(
                attachDatasheetPayload(
                  { locale: locale.name, license: undefined, expectedClipCount: locale.clip_count, ...settings },
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

            filteredLicensed.forEach(({ name, license, clip_count }) => {
              jobs.push(
                attachDatasheetPayload(
                  { locale: name, license, expectedClipCount: clip_count, ...settings },
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
          getLocales(settings),
          TE.map(allLocales => {
            const locales =
              settings.languages.length > 0
                ? settings.type === 'delta'
                  // Delta: only keep requested locales that exist in previous release
                  ? allLocales.filter(l => settings.languages.includes(l.name))
                  : (() => {
                      // Full/stats: include all requested locales (even those with 0 clips)
                      const countMap = new Map(allLocales.map(l => [l.name, l.clip_count]))
                      return settings.languages.map(l => ({
                        name: l,
                        clip_count: countMap.get(l) ?? 0,
                      }))
                    })()
                : allLocales

            logger.info(
              'QUEUE',
              `${locales.length} locales scheduled (unlicensed only): ${locales.map(l => l.name).join(', ')}`,
            )

            return locales.map(locale =>
              attachDatasheetPayload(
                { locale: locale.name, license: undefined, expectedClipCount: locale.clip_count, ...settings },
                datasheetPayloads,
              ),
            )
          }),
        )
      }
    }),
    // Accumulate locale totals in Redis before jobs are enqueued.
    // Using INCRBY (not SET) so multiple batches for the same release
    // accumulate correctly -- `count == total` fires only when ALL batches
    // across ALL runs are done. Lists are never deleted: they grow across
    // batches and are cleaned up by the 7-day TTL.
    TE.chainFirst(({ jobs }) =>
      TE.tryCatch(async () => {
        // Group job count and clip count by effective release name
        // (license -> "-licensed" suffix, variants -> "-variants" suffix).
        const totals = new Map<string, number>()
        const clipTotals = new Map<string, number>()
        for (const job of jobs) {
          const name = settings.type === 'variants'
            ? `${settings.releaseName}-variants`
            : job.license
              ? `${settings.releaseName}-licensed`
              : settings.releaseName
          // For variants, each locale job produces N variant tarballs.
          // localeTotal = total variant tarball count, not locale job count.
          if (settings.type === 'variants' && job.variants) {
            totals.set(name, (totals.get(name) ?? 0) + job.variants.length)
            const variantClips = job.variants.reduce((sum, v) => sum + v.clipCount, 0)
            clipTotals.set(name, (clipTotals.get(name) ?? 0) + variantClips)
          } else {
            totals.set(name, (totals.get(name) ?? 0) + 1)
            clipTotals.set(
              name,
              (clipTotals.get(name) ?? 0) + (job.expectedClipCount ?? 0),
            )
          }
        }
        for (const [name, batchCount] of totals) {
          const batchClips = clipTotals.get(name) ?? 0
          // Accumulate totals across batches (atomic INCRBY).
          await redisClient.incrby(redisKeys.localeTotal(name), batchCount)
          await redisClient.expire(redisKeys.localeTotal(name), RELEASE_LOG_KEY_TTL_SEC)
          // Accumulate expected clip count for progress tracking.
          if (batchClips > 0) {
            await redisClient.incrby(redisKeys.clipsTotal(name), batchClips)
            await redisClient.expire(redisKeys.clipsTotal(name), RELEASE_LOG_KEY_TTL_SEC)
          }
          // Record release start time (NX: only the first batch wins).
          await redisClient.setnx(redisKeys.timeStart(name), new Date().toISOString())
          await redisClient.expire(redisKeys.timeStart(name), RELEASE_LOG_KEY_TTL_SEC)
          // Refresh TTLs on accumulator keys if they already exist.
          await redisClient.expire(redisKeys.localeCount(name), RELEASE_LOG_KEY_TTL_SEC)
          await redisClient.expire(redisKeys.clipsCount(name), RELEASE_LOG_KEY_TTL_SEC)
          await redisClient.expire(redisKeys.problemClips(name), RELEASE_LOG_KEY_TTL_SEC)
          await redisClient.expire(redisKeys.processLog(name), RELEASE_LOG_KEY_TTL_SEC)
          await redisClient.expire(redisKeys.done(name), RELEASE_LOG_KEY_TTL_SEC)
          logger.info(
            'QUEUE',
            `Release "${name}": +${batchCount} locale(s) scheduled` +
              (batchClips > 0 ? ` (~${batchClips.toLocaleString()} clips)` : ''),
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
          case 'variants':
            return addProcessVariantsJob(job)
          default:
            throw Error('Unhandled job type')
        }
      }),
    ),
    TE.chain(jobPromises => TE.sequenceArray(jobPromises)),
  )
