import * as path from 'node:path'

import { either as E, task as T, taskEither as TE } from 'fp-ts'
import { Job } from 'bullmq'
import { pipe } from 'fp-ts/lib/function'
import { readerTaskEither as RTE } from 'fp-ts'
import { logger } from '../infrastructure/logger'
import { runFetchAllClipsForLocale } from '../core/clips'
import { isMinorityLanguage } from '../core/ruleOfFive'
import { AppEnv, ProcessLocaleJob } from '../types'
import { runCorporaCreator } from '../infrastructure/corporaCreator'
import {
  generateTarFilename,
  runCompress,
  sanitizeLicenseName,
} from '../core/compress'
import { runMp3DurationReporter } from '../infrastructure/mp3DurationReporter'
import { runStats } from '../core/stats'
import { runReportedSentences } from '../core/reportedSentences'
import { runUpload } from '../core/upload'
import { cleanUp, runCleanUp } from '../core/cleanUp'
import { runCompressAndUploadMetadata } from '../core/metadata'
import { runGenerateDatasheet } from '../core/datasheets'
import { runScanLocaleData } from '../core/localeData'
import { runFilterProblemClips, runPushProblemClips } from '../core/problemClips'
import { flushReleaseLogs } from '../core/releaseLogger'
import { doesFileExistInBucket } from '../infrastructure/storage'
import { redisClient } from '../infrastructure/redis'
import {
  getDatasetBundlerBucketName,
  getEnvironment,
  getTmpDir,
  LOCK_EXTEND_MS,
  LOCK_EXTEND_INTERVAL_MS,
  PROCESSING_STALE_MS,
  RELEASE_LOG_KEY_TTL_SEC,
  redisKeys,
} from '../config'
import { runFetchSentencesForLocale } from '../core/sentences'
import { fetchLocaleMetadata } from '../core/locales'

// Pipeline steps -- no match at the end so processLocale can inspect the Either result.
const processPipeline = pipe(
  RTE.Do,
  RTE.bind('isMinorityLanguage', isMinorityLanguage),
  RTE.bind('prevReleaseName', ({ isMinorityLanguage }) =>
    runFetchAllClipsForLocale(isMinorityLanguage),
  ),
  RTE.bind('rawDurationInMs', runMp3DurationReporter),
  RTE.bind('totalDurationInMs', ({ rawDurationInMs }) =>
    runFilterProblemClips(rawDurationInMs),
  ),
  RTE.chainFirst(runCorporaCreator),
  RTE.chainFirst(runReportedSentences),
  RTE.chainFirst(runFetchSentencesForLocale),
  // Fetch accent + variant metadata (predefined names + code maps) from DB
  // BEFORE scanning locale data so scanClipsTsv can filter user-submitted accents.
  RTE.chainFirstW(() =>
    pipe(
      RTE.ask<AppEnv>(),
      RTE.chainTaskEitherK(env =>
        pipe(
          fetchLocaleMetadata(env.locale),
          TE.map(({ accentPredefinedNames, accentCodeMap, variantCodeMap }) => {
            env.predefinedAccentNames = accentPredefinedNames
            env.accentCodeMap = accentCodeMap
            env.variantCodeMap = variantCodeMap
          }),
        ),
      ),
    ),
  ),
  RTE.chainFirstW(({ totalDurationInMs }) =>
    pipe(
      runScanLocaleData(totalDurationInMs),
      RTE.chainFirstW(localeData =>
        RTE.asks<AppEnv, void>(env => {
          env.localeData = localeData
          if (env.localeData) {
            env.localeData.predefinedAccentNames = env.predefinedAccentNames
            env.localeData.accentCodeMap = env.accentCodeMap
            env.localeData.variantCodeMap = env.variantCodeMap
          }
        }),
      ),
    ),
  ),
  RTE.chainFirst(() => runGenerateDatasheet),
  RTE.bind('compressResult', runCompress),
  // Upload local tarball to GCS -- skip when already streamed during compress
  RTE.bind('uploadPath', ({ compressResult }) =>
    compressResult.streamed
      ? RTE.right<AppEnv, Error, string>(compressResult.uploadPath)
      : runUpload(compressResult.tarballFilepath),
  ),
  RTE.chainFirst(runCompressAndUploadMetadata),
  RTE.bind('stats', ({ compressResult }) => runStats(compressResult)),
  RTE.chainFirstW(({ stats }) =>
    RTE.asks<AppEnv, void>(env => {
      env.clipCount = stats.locales[env.locale]?.clips ?? 0
    }),
  ),
  RTE.chainFirst(({ compressResult }) => runCleanUp(compressResult.tarballFilepath)),
  RTE.chainFirst(runPushProblemClips),
)

/**
 * Derives effective release names, directory paths, and AppEnv from raw job
 * parameters. Pure function (aside from getTmpDir()) --extracted so the
 * naming logic is unit-testable independently of BullMQ and GCS.
 */
export const deriveJobEnv = (
  jobData: ProcessLocaleJob,
  tmpDir: string,
): AppEnv => {
  const { locale, releaseName, previousReleaseName, license, type } = jobData

  // Licensed jobs go into a separate directory suffixed with "-licensed".
  // Each license gets its own subdirectory so concurrent jobs for different
  // licenses on the same locale don't collide on the filesystem.
  const effectiveReleaseName = license
    ? `${releaseName}-licensed`
    : releaseName

  // Both previousReleaseName and deltaReleaseName only apply to full releases.
  // Delta releases are defined purely by their from/until time window --they
  // contain only new clips and do not merge from any prior release.
  const effectivePreviousReleaseName =
    type === 'full' && previousReleaseName
      ? license
        ? `${previousReleaseName}-licensed`
        : previousReleaseName
      : undefined

  // Derived from releaseName by inserting "-delta" before the date portion.
  // e.g. "cv-corpus-24.0-2025-12-05" -> "cv-corpus-24.0-delta-2025-12-05"
  // Licensed variant appends "-licensed" at the end.
  // The delta release must have been run beforehand with that exact name.
  const baseDeltaName = releaseName.replace(/-(\d{4}-\d{2}-\d{2})$/, '-delta-$1')
  const effectiveDeltaReleaseName =
    type === 'full'
      ? license
        ? `${baseDeltaName}-licensed`
        : baseDeltaName
      : undefined

  const releaseDirPath = license
    ? path.join(tmpDir, effectiveReleaseName, sanitizeLicenseName(license))
    : path.join(tmpDir, effectiveReleaseName)

  // Precompute the GCS upload path so it is available for logging even if
  // the job fails before reaching the upload step.
  const tarFilename = generateTarFilename(locale, effectiveReleaseName, license)
  const uploadPath = `${effectiveReleaseName}/${tarFilename}`

  return {
    ...jobData,
    releaseName: effectiveReleaseName,
    previousReleaseName: effectivePreviousReleaseName,
    deltaReleaseName: effectiveDeltaReleaseName,
    license,
    releaseDirPath,
    releaseTarballsDirPath: path.join(releaseDirPath, 'tarballs'),
    clipsDirPath: path.join(releaseDirPath, locale, 'clips'),
    uploadPath,
    problemClips: [],
    clipCount: 0,
    startTimestamp: new Date().toISOString(),
  }
}

export const processLocale = async (job: Job<ProcessLocaleJob>, token?: string) => {
  const env = deriveJobEnv(job.data, getTmpDir())
  const { locale, releaseName, uploadPath } = env

  logger.info('', '-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --')
  logger.info('PROCESSOR', `[${locale}] ${env.type} job | ${env.license ?? 'unlicensed'}${env.force ? ' | FORCE' : ''} | -> ${uploadPath}`)

  // The member key includes the license so that different license jobs for the
  // same locale are tracked independently (e.g. "en|CC-BY 4.0" vs "en").
  const doneMember = env.license ? `${locale}|${env.license}` : locale

  // --force bypasses both the Redis done-SET and GCS existence checks,
  // re-creating the release from scratch and overwriting any existing archive.
  if (!env.force) {
    // Fast-path: Redis done SET (~1 ms). Skips the GCS round-trip entirely.
    const isDoneInRedis =
      (await redisClient.sismember(redisKeys.done(releaseName), doneMember)) > 0

    if (isDoneInRedis) {
      logger.info('PROCESSOR', `[${locale}] Release ${uploadPath} exists already, skipping`)
      env.clipCount = job.data.expectedClipCount ?? 0
      await flushReleaseLogs(env, 'skipped')
      return
    }

    // Authoritative check: GCS file existence. Backfill the done SET so future
    // checks use the fast path.
    const releaseExistsAlready = await pipe(
      doesFileExistInBucket(getDatasetBundlerBucketName())(uploadPath),
      TE.getOrElse(() => T.of(false)),
    )()

    if (releaseExistsAlready) {
      await redisClient.sadd(redisKeys.done(releaseName), doneMember)
      await redisClient.expire(redisKeys.done(releaseName), RELEASE_LOG_KEY_TTL_SEC)
      logger.info('PROCESSOR', `[${locale}] Release ${uploadPath} exists already, skipping`)
      env.clipCount = job.data.expectedClipCount ?? 0
      await flushReleaseLogs(env, 'skipped')
      return
    }
  }

  // Guard against duplicate processing from BullMQ stall re-dispatch.
  // Uses a HASH (locale -> heartbeat timestamp). HSETNX is atomic for the
  // common case (first claim). Stale reclaim has a tiny race window where
  // two pods could both proceed -- acceptable since the only consequence is
  // duplicate work (GCS upload overwrites), not data corruption.
  const processingKey = redisKeys.processing(releaseName)
  const now = Date.now()

  const claimed = await redisClient.hsetnx(processingKey, doneMember, String(now))
  await redisClient.expire(processingKey, RELEASE_LOG_KEY_TTL_SEC)

  if (!claimed) {
    // Entry exists -- check if it's stale (crashed pod) or active.
    const existingTs = await redisClient.hget(processingKey, doneMember)
    const age = now - Number(existingTs)
    if (age < PROCESSING_STALE_MS) {
      logger.info(
        'PROCESSOR',
        `[${locale}] Already being processed by another pod (${Math.round(age / 1000)}s ago), skipping`,
      )
      return
    }
    // Stale -- reclaim. Non-atomic but harmless: worst case is duplicate work.
    logger.warn(
      'PROCESSOR',
      `[${locale}] Stale processing entry (${Math.round(age / 1000)}s old, threshold ${PROCESSING_STALE_MS / 1000}s) -- taking over from crashed pod`,
    )
    await redisClient.hset(processingKey, doneMember, String(now))
  }

  // Timer-based lock extension + processing heartbeat: covers all pipeline
  // steps uniformly (download, merge, compress, upload, CorporaCreator
  // subprocess, etc.) without threading a callback through every function
  // signature. The heartbeat refresh prevents long-running locales from
  // being falsely reclaimed as stale by another pod.
  const lockTimer = token
    ? setInterval(async () => {
        try {
          await job.extendLock(token, LOCK_EXTEND_MS)
          // Refresh processing HASH timestamp so other pods see this job is alive.
          await redisClient.hset(processingKey, doneMember, String(Date.now()))
        } catch (err) {
          // Lock may already be lost (LRU eviction); processing HASH guard
          // handles crash recovery. Log so repeated failures are visible.
          logger.warn('PROCESSOR', `[${locale}] Lock/heartbeat refresh failed: ${String(err)}`)
        }
      }, LOCK_EXTEND_INTERVAL_MS)
    : undefined

  try {
    const result = await processPipeline(env)()
    if (E.isRight(result)) {
      await redisClient.sadd(redisKeys.done(releaseName), doneMember)
      await redisClient.expire(redisKeys.done(releaseName), RELEASE_LOG_KEY_TTL_SEC)
      const hours = (result.right.totalDurationInMs / 3_600_000).toFixed(1)
      logger.info(
        'PROCESSOR',
        `[${locale}] Done: ${env.clipCount.toLocaleString()} clips | ${hours}h recorded`,
      )
    } else {
      const errMsg = String(result.left)
      env.errorMessage = errMsg
      logger.error('PROCESSOR', `[${locale}] Failed: ${errMsg}`)
      // Repeat on stdout -- stderr lines can be lost in GCP log aggregation
      // when multiple writes happen in the same millisecond across fds.
      logger.info('PROCESSOR', `[${locale}] FAILED: ${errMsg}`)

      // Clean up working files on failure to prevent disk exhaustion.
      // Skip in local environment to preserve files for debugging
      // (consistent with the success-path runCleanUp behaviour).
      if (getEnvironment() !== 'local') {
        // Compute the expected tarball path so it is removed even when the
        // failure happened after local compression (e.g. upload/stats step).
        const tarFilename = generateTarFilename(locale, env.releaseName, env.license)
        const expectedTarPath = path.join(env.releaseTarballsDirPath, tarFilename)

        const cleanupResult = await cleanUp(
          locale,
          env.releaseDirPath,
          expectedTarPath,
          env.previousReleaseName,
          env.deltaReleaseName,
          env.license,
        )()
        if (E.isLeft(cleanupResult)) {
          logger.warn('PROCESSOR', `[${locale}] Failure cleanup error (non-fatal): ${String(cleanupResult.left)}`)
        } else {
          logger.info('PROCESSOR', `[${locale}] Failure cleanup completed -- disk space reclaimed`)
        }
      }
    }
    await flushReleaseLogs(env, E.isRight(result) ? 'success' : 'error')
  } finally {
    if (lockTimer) clearInterval(lockTimer)
    // Remove from processing HASH (done or failed -- either way, no longer active).
    await redisClient.hdel(redisKeys.processing(releaseName), doneMember)
  }
}
