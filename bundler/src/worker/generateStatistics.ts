import * as path from 'node:path'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { Job } from 'bullmq'
import { AppEnv, ProcessLocaleJob } from '../types'
import { getDatasetBundlerBucketName, getTmpDir } from '../config/config'
import { generateTarFilename } from '../core/compress'
import { constVoid, pipe } from 'fp-ts/lib/function'
import { doesFileExistInBucket } from '../infrastructure/storage'
import { runMp3DurationReporter } from '../infrastructure/mp3DurationReporter'
import { runStats } from '../core/stats'
import { runDownloadDataset, runGenerateClipsTsv } from '../core/dataset'
import { extractTar } from '../infrastructure/tar'
import { runCleanUp } from '../core/cleanUp'
import { logger } from '../infrastructure/logger'

const generateStatisticsPipeline = pipe(
  RTE.Do,
  RTE.bind('tarFilepath', runDownloadDataset),
  RTE.bind('extract', ({ tarFilepath }) =>
    RTE.fromTaskEither(extractTar(tarFilepath, getTmpDir())),
  ),
  RTE.bind('generateClipsTsv', runGenerateClipsTsv),
  RTE.bind('totalDurationInMs', runMp3DurationReporter),
  RTE.bind('stats', ({ totalDurationInMs, tarFilepath }) =>
    runStats(totalDurationInMs, tarFilepath),
  ),
  RTE.chainFirst(({ tarFilepath }) => runCleanUp(tarFilepath)),
  RTE.match(
    err => logger.error('STATS', String(err)),
    () => constVoid(),
  ),
)

export const generateStatistics = async (job: Job<ProcessLocaleJob>) => {
  const { locale, releaseName, license } = job.data

  const releaseDirPath = path.join(getTmpDir(), releaseName)

  const env: AppEnv = {
    ...job.data,
    license,
    releaseDirPath,
    releaseTarballsDirPath: path.join(releaseDirPath, 'tarballs'),
    clipsDirPath: path.join(releaseDirPath, locale, 'clips'),
  }

  const releaseTarballName = generateTarFilename(locale, releaseName, license)

  const releaseExistsAlready = await pipe(
    doesFileExistInBucket(getDatasetBundlerBucketName())(
      `${releaseName}/${releaseTarballName}`,
    ),
    TE.getOrElse(() => T.of(false)),
  )()

  if (!releaseExistsAlready) {
    logger.warn(
      'STATS',
      `Cannot generate statistics for ${releaseTarballName}: tarball does not exist`,
    )
    return
  } else {
    await generateStatisticsPipeline(env)()
  }
}
