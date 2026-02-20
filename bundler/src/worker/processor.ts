import * as path from 'node:path'

import { Job } from 'bullmq'
import { readerTaskEither as RTE, task as T, taskEither as TE } from 'fp-ts'
import { constVoid, pipe } from 'fp-ts/lib/function'
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
import { runCleanUp } from '../core/cleanUp'
import { doesFileExistInBucket } from '../infrastructure/storage'
import { getDatasetBundlerBucketName, getTmpDir } from '../config/config'
import { runFetchSentencesForLocale } from '../core/sentences'

const processPipeline = pipe(
  RTE.Do,
  RTE.bind('isMinorityLanguage', isMinorityLanguage),
  RTE.bind('prevReleaseName', ({ isMinorityLanguage }) =>
    runFetchAllClipsForLocale(isMinorityLanguage),
  ),
  RTE.bind('totalDurationInMs', runMp3DurationReporter),
  RTE.chainFirst(runCorporaCreator),
  RTE.chainFirst(runReportedSentences),
  RTE.chainFirst(runFetchSentencesForLocale),
  RTE.bind('tarFilepath', runCompress),
  RTE.bind('uploadPath', ({ tarFilepath }) => runUpload(tarFilepath)),
  RTE.bind('stats', ({ totalDurationInMs, tarFilepath }) =>
    runStats(totalDurationInMs, tarFilepath),
  ),
  RTE.chainFirst(({ tarFilepath }) => runCleanUp(tarFilepath)),
  RTE.match(
    err => logger.error('PROCESSOR', String(err)),
    () => constVoid(),
  ),
)

export const processLocale = async (job: Job<ProcessLocaleJob>) => {
  const { locale, releaseName, previousReleaseName, license } = job.data

  // Licensed jobs go into a separate directory suffixed with "-licensed".
  // Each license gets its own subdirectory so concurrent jobs for different
  // licenses on the same locale don't collide on the filesystem.
  const effectiveReleaseName = license ? `${releaseName}-licensed` : releaseName

  // Both previousReleaseName and deltaReleaseName only apply to full releases.
  // Delta releases are defined purely by their from/until time window — they
  // contain only new clips and do not merge from any prior release.
  // If no tarball exists in GCS for a given locale (e.g. brand-new locale,
  // or delta not run yet), the per-locale GCS exists-check inside each
  // download function handles the no-op gracefully.
  const effectivePreviousReleaseName =
    job.data.type === 'full' && previousReleaseName
      ? license
        ? `${previousReleaseName}-licensed`
        : previousReleaseName
      : undefined

  // Derived from releaseName using the fixed convention "${releaseName}-delta"
  // (or "-delta-licensed" for licensed jobs). The delta release must have been
  // run beforehand with that exact name. If the delta tarball is absent for a
  // locale the pipeline falls back to individual GCS clip downloads.
  const effectiveDeltaReleaseName =
    job.data.type === 'full'
      ? license
        ? `${releaseName}-delta-licensed`
        : `${releaseName}-delta`
      : undefined

  const releaseDirPath = license
    ? path.join(getTmpDir(), effectiveReleaseName, sanitizeLicenseName(license))
    : path.join(getTmpDir(), effectiveReleaseName)

  const env: AppEnv = {
    ...job.data,
    releaseName: effectiveReleaseName,
    previousReleaseName: effectivePreviousReleaseName,
    deltaReleaseName: effectiveDeltaReleaseName,
    license,
    releaseDirPath,
    releaseTarballsDirPath: path.join(releaseDirPath, 'tarballs'),
    clipsDirPath: path.join(releaseDirPath, locale, 'clips'),
  }
  const releaseTarballName = generateTarFilename(
    locale,
    effectiveReleaseName,
    license,
  )

  const releaseExistsAlready = await pipe(
    doesFileExistInBucket(getDatasetBundlerBucketName())(
      `${effectiveReleaseName}/${releaseTarballName}`,
    ),
    TE.getOrElse(() => T.of(false)),
  )()

  if (releaseExistsAlready) {
    logger.info('PROCESSOR', `[${locale}] Release ${releaseTarballName} exists already, skipping`)
    return
  } else {
    await processPipeline(env)()
  }
}
