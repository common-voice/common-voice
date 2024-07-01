import path from 'node:path'
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
    err => console.log(err),
    () => constVoid(),
  ),
)

export const generateStatistics = async (job: Job<ProcessLocaleJob>) => {
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

  if (!releaseExistsAlready) {
    console.log(
      `Cannot generate statistics for ${releaseTarballName}, because it does not exist.`,
    )
    Promise.resolve()
  } else {
    await generateStatisticsPipeline(env)()
  }
}
