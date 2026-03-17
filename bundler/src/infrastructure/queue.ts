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
import { getRedisUrl, RELEASE_LOG_KEY_TTL_SEC, redisKeys } from '../config'
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

/** Returns the -l languages array for DB filtering, or undefined when all locales are requested. */
const getLangs = (settings: Settings): string[] | undefined =>
  settings.languages.length > 0 ? settings.languages : undefined

/** For delta: only previous-release locales. For full/stats: all locales in window. */
const getLocales = (settings: Settings) => {
  const langs = getLangs(settings)
  return settings.type === 'delta'
    ? fetchDeltaLocales(settings.from, settings.until, langs)
    : fetchLocalesWithClips(settings.from, settings.until, langs)
}

const getLicensedLocales = (settings: Settings) => {
  const langs = getLangs(settings)
  return settings.type === 'delta'
    ? fetchDeltaLicensedLocales(settings.from, settings.until, langs)
    : fetchLocalesWithLicensedClips(settings.from, settings.until, langs)
}

/**
 * Remove stale BullMQ jobs before a new run.
 *
 * - Normal init: cleans completed/failed only (grace = 0). Without this,
 *   deterministic job IDs cause queue.add() to silently no-op.
 * - --force init: obliterates the entire queue (active + waiting + delayed +
 *   completed + failed) so a fresh run can fully replace a bad/in-progress one.
 *   Pauses the queue during obliteration and resumes after.
 */
export const cleanStaleJobs = async (force?: boolean): Promise<void> => {
  if (force) {
    await datasetReleaseQueue.obliterate({ force: true })
    await datasetReleaseQueue.resume()
    logger.info('QUEUE', 'Obliterated all jobs in queue (--force)')
    return
  }
  const completed = await datasetReleaseQueue.clean(0, 0, 'completed')
  const failed = await datasetReleaseQueue.clean(0, 0, 'failed')
  if (completed.length > 0 || failed.length > 0) {
    logger.info(
      'QUEUE',
      `Cleaned ${completed.length} completed + ${failed.length} failed jobs from previous run`,
    )
  }
}

/**
 * Remove ALL BullMQ jobs (completed, failed, delayed, waiting) from the queue.
 * Called at the end of a successful run -- no jobs should be pending at that point.
 */
export const drainQueue = async (): Promise<void> => {
  const completed = await datasetReleaseQueue.clean(0, 0, 'completed')
  const failed = await datasetReleaseQueue.clean(0, 0, 'failed')
  const delayed = await datasetReleaseQueue.clean(0, 0, 'delayed')
  const waiting = await datasetReleaseQueue.clean(0, 0, 'wait')
  const total = completed.length + failed.length + delayed.length + waiting.length
  if (total > 0) {
    logger.info('QUEUE', `Drained ${total} BullMQ jobs (end-of-run cleanup)`)
  }
}

/**
 * Remove BullMQ jobs for specific locales from all queue states.
 * Used by --force -l to surgically remove only targeted locale jobs without
 * affecting the rest of a running release.
 *
 * Scans completed, failed, waiting, and delayed jobs. Active jobs cannot
 * be removed via queue.remove() (returns 0 if locked), but the processor's
 * --force flag bypasses the done-SET and GCS checks, and the init handler
 * already cleared their processing HASH entries, so they will be superseded
 * by the new jobs once the active ones finish or stall.
 */
export const removeJobsForLocales = async (
  releaseName: string,
  locales: string[],
): Promise<void> => {
  const localeSet = new Set(locales)

  // Job ID format: "{jobName}|{releaseName}|{locale}|{license}"
  // Match both releaseName (2nd segment) and locale (3rd segment) so jobs
  // from a different release sharing the same queue are never removed.
  const isTargeted = (jobId: string | undefined): boolean => {
    if (!jobId) return false
    const parts = jobId.split('|')
    return parts.length >= 3 && parts[1] === releaseName && localeSet.has(parts[2])
  }

  // Gather job IDs from all removable states
  const states = ['completed', 'failed', 'wait', 'delayed'] as const
  let removed = 0
  for (const state of states) {
    const jobs = await datasetReleaseQueue.getJobs([state])
    for (const job of jobs) {
      if (isTargeted(job.id)) {
        try {
          const result = await datasetReleaseQueue.remove(job.id!)
          if (result === 1) removed++
        } catch {
          // Job locked or already gone -- fine
        }
      }
    }
  }

  if (removed > 0) {
    logger.info('QUEUE', `Removed ${removed} BullMQ job(s) for locales: ${locales.join(', ')}`)
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
          fetchLocalesWithVariantClips(settings.from, settings.until, getLangs(settings)),
          TE.map(groups => {
            const summary = groups
              .map(g => `${g.locale} (${g.variants.length} variants, ~${g.totalClipCount} clips)`)
              .join(', ')
            logger.info(
              'QUEUE',
              `${groups.length} locale(s) with variants: ${summary}`,
            )

            return groups.map(
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
    // Pre-filter: exclude jobs whose locale is already in the Redis done SET.
    // This avoids dispatching hundreds of no-op jobs on re-runs and keeps
    // localeTotal / clipsTotal / timeStart accurate for progress & ETA.
    // Skipped entirely when --force is set (all jobs are scheduled).
    TE.bind('pendingJobs', ({ jobs }) =>
      TE.tryCatch(async () => {
        if (settings.force) {
          logger.info('QUEUE', `--force: scheduling all ${jobs.length} locale(s), no pre-filter`)
          return jobs
        }

        const nameForJob = (job: ProcessLocaleJob): string =>
          settings.type === 'variants'
            ? `${settings.releaseName}-variants`
            : job.license
              ? `${settings.releaseName}-licensed`
              : settings.releaseName

        // Fetch done SETs once per effective release name
        const doneCache = new Map<string, Set<string>>()
        const uniqueNames = new Set(jobs.map(nameForJob))
        for (const name of uniqueNames) {
          const members = await redisClient.smembers(redisKeys.done(name))
          doneCache.set(name, new Set(members))
        }

        const pending: ProcessLocaleJob[] = []
        const skipped: string[] = []
        for (const job of jobs) {
          const name = nameForJob(job)
          const member = job.license ? `${job.locale}|${job.license}` : job.locale
          if (doneCache.get(name)?.has(member)) {
            skipped.push(member)
          } else {
            pending.push(job)
          }
        }

        if (skipped.length > 0) {
          logger.info(
            'QUEUE',
            `Pre-filter: ${skipped.length} already-done locale(s) excluded -- ${skipped.join(', ')}`,
          )
        }
        logger.info(
          'QUEUE',
          `Scheduling ${pending.length} of ${jobs.length} locale(s)`,
        )

        return pending
      }, err => Error(String(err))),
    ),
    // Set locale/clip totals and timeStart in Redis for pending jobs only.
    // Uses SET (not INCRBY) so re-runs reflect only the remaining work,
    // giving correct progress percentages and ETAs.
    TE.chainFirst(({ pendingJobs }) =>
      TE.tryCatch(async () => {
        // Group job count and clip count by effective release name
        // (license -> "-licensed" suffix, variants -> "-variants" suffix).
        const totals = new Map<string, number>()
        const clipTotals = new Map<string, number>()
        for (const job of pendingJobs) {
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
          // Reset totals to pending-only counts (SET, not INCRBY).
          await redisClient.set(redisKeys.localeTotal(name), batchCount)
          await redisClient.expire(redisKeys.localeTotal(name), RELEASE_LOG_KEY_TTL_SEC)
          // Always SET clipsTotal (even to 0) so stale values from prior runs
          // don't persist and mislead progress calculations.
          await redisClient.set(redisKeys.clipsTotal(name), batchClips)
          await redisClient.expire(redisKeys.clipsTotal(name), RELEASE_LOG_KEY_TTL_SEC)
          // Reset counters so progress starts from 0 for this run.
          await redisClient.set(redisKeys.localeCount(name), 0)
          await redisClient.expire(redisKeys.localeCount(name), RELEASE_LOG_KEY_TTL_SEC)
          await redisClient.set(redisKeys.clipsCount(name), 0)
          await redisClient.expire(redisKeys.clipsCount(name), RELEASE_LOG_KEY_TTL_SEC)
          // Reset start time so ETA reflects this run, not a stale previous one.
          await redisClient.set(redisKeys.timeStart(name), new Date().toISOString())
          await redisClient.expire(redisKeys.timeStart(name), RELEASE_LOG_KEY_TTL_SEC)
          // Refresh TTLs on log keys.
          await redisClient.expire(redisKeys.problemClips(name), RELEASE_LOG_KEY_TTL_SEC)
          await redisClient.expire(redisKeys.processLog(name), RELEASE_LOG_KEY_TTL_SEC)
          await redisClient.expire(redisKeys.done(name), RELEASE_LOG_KEY_TTL_SEC)
          logger.info(
            'QUEUE',
            `Release "${name}": ${batchCount} locale(s) to process` +
              (batchClips > 0 ? ` (~${batchClips.toLocaleString()} clips)` : ''),
          )
        }
        // Track how many release name groups are active (e.g. base + licensed = 2).
        // End-of-run cleanup only fires when the last group finishes.
        await redisClient.set(redisKeys.pendingGroups(settings.releaseName), totals.size)
        await redisClient.expire(redisKeys.pendingGroups(settings.releaseName), RELEASE_LOG_KEY_TTL_SEC)
      }, err => Error(String(err))),
    ),
    TE.map(({ pendingJobs }) =>
      pendingJobs.map(job => {
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
