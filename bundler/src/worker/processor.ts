import path from 'node:path'

import { Job } from 'bullmq'
import { readerTaskEither as RTE, task as T, taskEither as TE } from 'fp-ts'
import { constVoid, pipe } from 'fp-ts/lib/function'

import { runFetchAllClipsForLocale } from '../core/clips'
import { isMinorityLanguage } from '../core/ruleOfFive'
import { AppEnv, ProcessLocaleJob } from '../types'
import { runCorporaCreator } from '../infrastructure/corporaCreator'
import { generateTarFilename, runCompress } from '../core/compress'
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
  const { locale, releaseName } = job.data

  const releaseDirPath = path.join(getTmpDir(), releaseName)

  const env: AppEnv = {
    ...job.data,
    releaseDirPath,
    releaseTarballsDirPath: path.join(releaseDirPath, 'tarballs'),
    clipsDirPath: path.join(releaseDirPath, locale, 'clips'),
  }
  const releaseTarballName = generateTarFilename(locale, releaseName)

  const releaseExistsAlready = await pipe(
    doesFileExistInBucket(getDatasetBundlerBucketName())(
      `${releaseName}/${releaseTarballName}`,
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
