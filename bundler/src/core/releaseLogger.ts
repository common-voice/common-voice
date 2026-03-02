import { uploadToBucket } from '../infrastructure/storage'
import { redisClient } from '../infrastructure/redis'
import {
  getDatasetBundlerBucketName,
  RELEASE_LOG_FLUSH_INTERVAL,
  RELEASE_LOG_KEY_TTL_SEC,
  TimeUnitsMs,
  redisKeys,
} from '../config/config'
import { logger } from '../infrastructure/logger'
import { AppEnv } from '../types'
import { formatCompact, formatDuration, formatEta, renderBar } from './utils'

const BUCKET = getDatasetBundlerBucketName()
const uploadToDatasetBucket = uploadToBucket(BUCKET)

const PROCESS_LOG_HEADER =
  'locale\trelease_type\tfinal_path\tstart_timestamp\tfinish_timestamp\tduration_sec\tduration\tnum_clips\tspeed\tstatus\tproblem_clips'

const PROBLEM_CLIPS_HEADER = 'path\tlocale\treason\tstatus\ttimestamp'

/** Width of the ASCII progress bar (in characters). */
const BAR_WIDTH = 100

// ---------------------------------------------------------------------------
// buildProcessLogRow (exported for unit-testing)
// ---------------------------------------------------------------------------

/** Builds a single TSV row for the process log. Accepts explicit timestamps for testability. */
export const buildProcessLogRow = (
  env: AppEnv,
  finishTimestamp: string,
  status: 'success' | 'error' | 'skipped',
): string => {
  const durationMs =
    new Date(finishTimestamp).getTime() - new Date(env.startTimestamp).getTime()
  const durationSec = (durationMs / TimeUnitsMs.SECOND).toFixed(2)
  const duration = formatDuration(durationMs)
  const speed =
    durationMs === 0
      ? '0.00'
      : (env.clipCount / (durationMs / TimeUnitsMs.SECOND)).toFixed(2)
  return [
    env.locale,
    env.type,
    env.uploadPath,
    env.startTimestamp,
    finishTimestamp,
    durationSec,
    duration,
    env.clipCount,
    speed,
    status,
    env.problemClips.length,
  ].join('\t')
}

// ---------------------------------------------------------------------------
// shouldPrintProgress (exported for unit-testing)
// ---------------------------------------------------------------------------

/**
 * Determines whether to emit a progress line for this job completion.
 * Ensures large datasets always show progress while small ones are throttled.
 */
export const shouldPrintProgress = (
  jobsDone: number,
  jobsTotal: number,
  clipCount: number,
  clipsTotal: number,
): boolean => {
  // Always print at GCS flush boundaries and on completion.
  if (jobsDone % RELEASE_LOG_FLUSH_INTERVAL === 0) return true
  if (jobsTotal > 0 && jobsDone === jobsTotal) return true
  // Always print for the first 20 jobs (large locales, infrequent).
  if (jobsDone <= 20) return true
  // If we have no clip totals, fall back to every 10th job.
  if (clipsTotal <= 0) return jobsDone % 10 === 0
  // Significant job: contributed >= 0.5% of total clips.
  if (clipCount / clipsTotal >= 0.005) return true
  // Medium job (>= 0.1%): every 5th.
  if (clipCount / clipsTotal >= 0.001) return jobsDone % 5 === 0
  // Tiny job: every 10th.
  return jobsDone % 10 === 0
}

// ---------------------------------------------------------------------------
// flushReleaseLogs
// ---------------------------------------------------------------------------

/**
 * Called at the end of every locale job (success, error, or skipped).
 *
 * 1. Pushes a process-log row to the Redis list `scripted:log:process:<releaseName>`.
 * 2. Increments job and clip counters.
 * 3. Emits a two-line progress summary (throttled for small locales).
 * 4. Every `RELEASE_LOG_FLUSH_INTERVAL` completions, and when count reaches the
 *    total stored by the init job, uploads snapshots of both lists to GCS:
 *      `<releaseName>/logs/problem-clips.tsv`
 *      `<releaseName>/logs/process-log.tsv`
 *
 * Because Redis INCR is atomic, exactly one pod triggers each flush --
 * no distributed lock needed.
 *
 * Errors are swallowed and logged -- log failures must never fail a locale job.
 */
export const flushReleaseLogs = async (
  env: AppEnv,
  status: 'success' | 'error' | 'skipped',
): Promise<void> => {
  const { locale, releaseName } = env

  try {
    const finishTimestamp = new Date().toISOString()

    // 1. Push process-log row (all types, all statuses).
    const logKey = redisKeys.processLog(releaseName)
    const logRow = buildProcessLogRow(env, finishTimestamp, status)
    await redisClient.rpush(logKey, logRow)
    await redisClient.expire(logKey, RELEASE_LOG_KEY_TTL_SEC)

    // 2. Increment job counter and clip counter.
    const countKey = redisKeys.localeCount(releaseName)
    const clipsCountKey = redisKeys.clipsCount(releaseName)
    const [count] = await Promise.all([
      redisClient.incr(countKey),
      redisClient.incrby(clipsCountKey, env.clipCount),
      redisClient.expire(countKey, RELEASE_LOG_KEY_TTL_SEC),
      redisClient.expire(clipsCountKey, RELEASE_LOG_KEY_TTL_SEC),
    ])

    // 3. Read totals for progress display.
    const [totalStr, clipsTotalStr, clipsDoneStr, timeStartStr] =
      await Promise.all([
        redisClient.get(redisKeys.localeTotal(releaseName)),
        redisClient.get(redisKeys.clipsTotal(releaseName)),
        redisClient.get(redisKeys.clipsCount(releaseName)),
        redisClient.get(redisKeys.timeStart(releaseName)),
      ])

    const total = parseInt(totalStr ?? '0')
    const clipsTotal = parseInt(clipsTotalStr ?? '0')
    const clipsDone = parseInt(clipsDoneStr ?? '0')

    // 4. Emit progress lines (throttled for small locales).
    if (shouldPrintProgress(count, total, env.clipCount, clipsTotal)) {
      const statusTag = status === 'success' ? 'ok' : status === 'error' ? 'er' : 'sk'
      const pct = clipsTotal > 0
        ? clipsDone / clipsTotal
        : total > 0
          ? count / total
          : 0
      const bar = renderBar(pct, BAR_WIDTH)
      const pctStr = `${Math.min(100, Math.round(pct * 100)).toString().padStart(3)}%`

      const elapsedMs = timeStartStr
        ? new Date(finishTimestamp).getTime() - new Date(timeStartStr).getTime()
        : 0
      const rate = elapsedMs > 0 ? clipsDone / (elapsedMs / TimeUnitsMs.SECOND) : 0
      const remaining = clipsTotal - clipsDone
      const etaMs = rate > 0 ? (remaining / rate) * TimeUnitsMs.SECOND : 0

      logger.info(
        '',
        `${pctStr} ${bar}`,
      )
      logger.info(
        '',
        `[${locale}:${statusTag}] ${count}/${total > 0 ? total : '?'} jobs | ${formatCompact(clipsDone)}/${formatCompact(clipsTotal)} clips | ${Math.round(rate)}c/s | elapsed ${formatEta(elapsedMs)} | ETA ${formatEta(etaMs)}`,
      )
    }

    // 5. Determine whether to flush to GCS.
    const shouldFlush =
      count % RELEASE_LOG_FLUSH_INTERVAL === 0 ||
      (total > 0 && count === total)
    if (!shouldFlush) return

    // 6. Flush problem-clips snapshot to GCS (only when the list is non-empty).
    const pcRows = await redisClient.lrange(redisKeys.problemClips(releaseName), 0, -1)
    if (pcRows.length > 0) {
      const pcTsv = [PROBLEM_CLIPS_HEADER, ...pcRows].join('\n') + '\n'
      await uploadToDatasetBucket(
        `${releaseName}/logs/problem-clips.tsv`,
      )(Buffer.from(pcTsv, 'utf-8'))()
      logger.info(
        'RELEASE-LOGGER',
        `[${releaseName}] Flushed ${pcRows.length} problem-clip row(s) to GCS`,
      )
    }

    // 7. Flush process-log snapshot to GCS.
    const logRows = await redisClient.lrange(logKey, 0, -1)
    const logTsv = [PROCESS_LOG_HEADER, ...logRows].join('\n') + '\n'
    await uploadToDatasetBucket(
      `${releaseName}/logs/process-log.tsv`,
    )(Buffer.from(logTsv, 'utf-8'))()
    logger.info(
      'RELEASE-LOGGER',
      `[${releaseName}] Flushed ${logRows.length} process-log row(s) to GCS`,
    )
  } catch (err) {
    logger.error(
      'RELEASE-LOGGER',
      `[${locale}] Failed to flush release logs: ${String(err)}`,
    )
  }
}
