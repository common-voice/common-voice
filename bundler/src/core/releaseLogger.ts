import { uploadToBucket } from '../infrastructure/storage'
import { redisClient } from '../infrastructure/redis'
import {
  getDatasetBundlerBucketName,
  RELEASE_LOG_FLUSH_INTERVAL,
  RELEASE_LOG_FLUSH_MAX_AGE_MS,
  RELEASE_LOG_KEY_TTL_SEC,
  TimeUnitsMs,
  redisKeys,
} from '../config'
import { drainQueue } from '../infrastructure/queue'
import { logger } from '../infrastructure/logger'
import { AppEnv } from '../types'
import { formatCompact, formatDuration, formatEta, renderBar } from './utils'
import { PROBLEM_CLIPS_HEADER } from './problemClips'

const BUCKET = getDatasetBundlerBucketName()
const uploadToDatasetBucket = uploadToBucket(BUCKET)

const PROCESS_LOG_HEADER =
  'locale\trelease_type\tfinal_path\tstart_timestamp\tfinish_timestamp\tduration_sec\tduration\tnum_clips\tspeed\tstatus\tproblem_clips\terror_message'


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
  // Sanitize error message for TSV (replace tabs/newlines to keep single-row)
  const errorMsg = (env.errorMessage ?? '').replace(/[\t\r\n]/g, ' ').slice(0, 500)
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
    errorMsg,
  ].join('\t')
}

// ---------------------------------------------------------------------------
// flushReleaseLogs
// ---------------------------------------------------------------------------

/**
 * Called at the end of every locale job (success, error, or skipped).
 *
 * 1. Pushes a process-log row to the Redis list `scripted:log:process:<releaseName>`.
 * 2. Increments job and clip counters.
 * 3. Emits a two-line progress summary for every completed job.
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

    // 4. Emit progress lines (every job).
    {
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
    //    Flush on: every N jobs, final job, OR if >10 min since last flush
    //    (large locales like en/ca can take 1h+, don't wait for count threshold).
    const isFinal = total > 0 && count === total
    const isCountTrigger = count % RELEASE_LOG_FLUSH_INTERVAL === 0
    let isTimeTrigger = false
    if (!isFinal && !isCountTrigger) {
      const lastFlushStr = await redisClient.get(redisKeys.lastFlush(releaseName))
      const lastFlushMs = lastFlushStr ? new Date(lastFlushStr).getTime() : 0
      isTimeTrigger = Date.now() - lastFlushMs > RELEASE_LOG_FLUSH_MAX_AGE_MS
    }
    if (!isFinal && !isCountTrigger && !isTimeTrigger) return

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

    // Record flush timestamp AFTER successful uploads so that a failed
    // upload doesn't suppress the time-based retry trigger.
    await redisClient.set(redisKeys.lastFlush(releaseName), new Date().toISOString())
    await redisClient.expire(redisKeys.lastFlush(releaseName), RELEASE_LOG_KEY_TTL_SEC)

    // 8. Print FINISHED summary when all jobs are done.
    if (total > 0 && count === total) {
      const elapsedMs = timeStartStr
        ? new Date(finishTimestamp).getTime() - new Date(timeStartStr).getTime()
        : 0

      // Count statuses from process-log rows (status is column index 9)
      let okCount = 0
      let errCount = 0
      let skipCount = 0
      for (const row of logRows) {
        const cols = row.split('\t')
        const st = cols[9]
        if (st === 'success') okCount++
        else if (st === 'error') errCount++
        else if (st === 'skipped') skipCount++
      }

      logger.info('', '== == == == == == == == == == == == == == == == == == ==')
      logger.info(
        'FINISHED',
        `${releaseName} | ${total} locale(s) | ${formatCompact(clipsDone)} clips`,
      )
      logger.info(
        'FINISHED',
        `processed: ${okCount} | skipped: ${skipCount} | errors: ${errCount} | duration: ${formatEta(elapsedMs)}`,
      )
      logger.info('', '== == == == == == == == == == == == == == == == == == ==')

      // 9. End-of-run cleanup: delete all release-scoped Redis keys and drain
      //    BullMQ queue. Logs and stats are already persisted in GCS -- Redis
      //    data is no longer needed. TTL acts as safety net if this fails.
      await cleanupRedisKeys(releaseName)
      await drainQueue()
    }
  } catch (err) {
    logger.error(
      'RELEASE-LOGGER',
      `[${locale}] Failed to flush release logs: ${String(err)}`,
    )
  }
}

// ---------------------------------------------------------------------------
// Release name helpers
// ---------------------------------------------------------------------------

/**
 * Strips `-licensed` / `-variants` suffixes from an effective release name
 * to recover the base name. Safe to call on a base name (no-op).
 */
const toBaseReleaseName = (name: string): string =>
  name.replace(/-(licensed|variants)$/, '')

/**
 * Returns all effective release name variants (base, -licensed, -variants)
 * from any input (base or already-suffixed). Deduplicates so the base name
 * is never listed twice.
 */
const allReleaseNameVariants = (name: string): string[] => {
  const base = toBaseReleaseName(name)
  return [base, `${base}-licensed`, `${base}-variants`]
}

// ---------------------------------------------------------------------------
// Force-flush logs to GCS (standalone, called before --force obliteration)
// ---------------------------------------------------------------------------

/**
 * Flushes any accumulated problem-clips and process-log rows from Redis to GCS
 * for the given release name (and its licensed/variants sub-releases).
 * Called before --force obliterates the queue so partial-run logs are preserved.
 * Errors are swallowed -- best-effort, must not block the new run.
 */
export const forceFlushLogs = async (releaseName: string): Promise<void> => {
  const names = allReleaseNameVariants(releaseName)

  for (const name of names) {
    try {
      const pcRows = await redisClient.lrange(redisKeys.problemClips(name), 0, -1)
      if (pcRows.length > 0) {
        const pcTsv = [PROBLEM_CLIPS_HEADER, ...pcRows].join('\n') + '\n'
        await uploadToDatasetBucket(
          `${name}/logs/problem-clips.tsv`,
        )(Buffer.from(pcTsv, 'utf-8'))()
        logger.info(
          'RELEASE-LOGGER',
          `[${name}] Force-flushed ${pcRows.length} problem-clip row(s) to GCS`,
        )
      }

      const logRows = await redisClient.lrange(redisKeys.processLog(name), 0, -1)
      if (logRows.length > 0) {
        const logTsv = [PROCESS_LOG_HEADER, ...logRows].join('\n') + '\n'
        await uploadToDatasetBucket(
          `${name}/logs/process-log.tsv`,
        )(Buffer.from(logTsv, 'utf-8'))()
        logger.info(
          'RELEASE-LOGGER',
          `[${name}] Force-flushed ${logRows.length} process-log row(s) to GCS`,
        )
      }
    } catch (err) {
      logger.warn(
        'RELEASE-LOGGER',
        `[${name}] Failed to force-flush logs (proceeding anyway): ${String(err)}`,
      )
    }
  }
}

// ---------------------------------------------------------------------------
// End-of-run Redis cleanup
// ---------------------------------------------------------------------------

/**
 * Deletes all release-scoped Redis keys for the given release name.
 * Called once after a successful full run (all jobs completed).
 * Also cleans up keys for licensed/variant sub-releases that share
 * the same base release name.
 */
const cleanupRedisKeys = async (releaseName: string): Promise<void> => {
  const names = allReleaseNameVariants(releaseName)

  let deleted = 0
  for (const name of names) {
    const keys = [
      redisKeys.problemClips(name),
      redisKeys.processLog(name),
      redisKeys.localeCount(name),
      redisKeys.localeTotal(name),
      redisKeys.clipsCount(name),
      redisKeys.clipsTotal(name),
      redisKeys.timeStart(name),
      redisKeys.done(name),
      redisKeys.processing(name),
      redisKeys.lastFlush(name),
    ]
    const result = await redisClient.del(...keys)
    deleted += result
  }

  if (deleted > 0) {
    logger.info('RELEASE-LOGGER', `Cleaned up ${deleted} Redis key(s) (end-of-run)`)
  }
}
