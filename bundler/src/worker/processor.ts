import * as path from 'node:path'

import { Job } from 'bullmq'
import { readerTaskEither as RTE, task as T, taskEither as TE } from 'fp-ts'
import { constVoid, pipe } from 'fp-ts/lib/function'

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
    err => console.log(err),
    () => constVoid(),
  ),
)

export const processLocale = async (job: Job<ProcessLocaleJob>) => {
  const { locale, releaseName, previousReleaseName, license } = job.data

  // Licensed jobs go into a separate directory suffixed with "-licensed".
  // Each license gets its own subdirectory so concurrent jobs for different
  // licenses on the same locale don't collide on the filesystem.
  const effectiveReleaseName = license ? `${releaseName}-licensed` : releaseName
  const effectivePreviousReleaseName = previousReleaseName
    ? license
      ? `${previousReleaseName}-licensed`
      : previousReleaseName
    : undefined

  const releaseDirPath = license
    ? path.join(getTmpDir(), effectiveReleaseName, sanitizeLicenseName(license))
    : path.join(getTmpDir(), effectiveReleaseName)

  const env: AppEnv = {
    ...job.data,
    releaseName: effectiveReleaseName,
    previousReleaseName: effectivePreviousReleaseName,
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
    console.log(`Release ${releaseTarballName} exists already.`)
    Promise.resolve()
  } else {
    await processPipeline(env)()
  }
}
