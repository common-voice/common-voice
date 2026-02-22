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
import { formatDuration } from './utils'

const BUCKET = getDatasetBundlerBucketName()
const uploadToDatasetBucket = uploadToBucket(BUCKET)

const PROCESS_LOG_HEADER =
  'locale\trelease_type\tfinal_path\tstart_timestamp\tfinish_timestamp\tduration_sec\tduration\tnum_clips\tspeed\tstatus\tproblem_clips'

const PROBLEM_CLIPS_HEADER = 'path\tlocale\treason\tstatus\ttimestamp'

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
// flushReleaseLogs
// ---------------------------------------------------------------------------

/**
 * Called at the end of every locale job (success, error, or skipped).
 *
 * 1. Pushes a process-log row to the Redis list `scripted:log:process:<releaseName>`.
 * 2. Increments `scripted:jobs:count:<releaseName>`.
 * 3. Every `RELEASE_LOG_FLUSH_INTERVAL` completions, and when count reaches the
 *    total stored by the init job, uploads snapshots of both lists to GCS:
 *      `<releaseName>/logs/problem-clips.tsv`
 *      `<releaseName>/logs/process-log.tsv`
 *
 * Because Redis INCR is atomic, exactly one pod triggers each flush —
 * no distributed lock needed.
 *
 * Errors are swallowed and logged — log failures must never fail a locale job.
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

    // 2. Increment locale counter.
    const countKey = redisKeys.localeCount(releaseName)
    const count = await redisClient.incr(countKey)
    await redisClient.expire(countKey, RELEASE_LOG_KEY_TTL_SEC)

    // 3. Determine whether to flush to GCS.
    const totalStr = await redisClient.get(redisKeys.localeTotal(releaseName))
    const total = parseInt(totalStr ?? '0')

    logger.info(
      'RELEASE-LOGGER',
      `[${locale}] Locale ${count}/${total > 0 ? total : '?'} completed (${status})`,
    )

    const shouldFlush =
      count % RELEASE_LOG_FLUSH_INTERVAL === 0 ||
      (total > 0 && count === total)
    if (!shouldFlush) return

    // 4. Flush problem-clips snapshot to GCS (only when the list is non-empty).
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

    // 5. Flush process-log snapshot to GCS.
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
