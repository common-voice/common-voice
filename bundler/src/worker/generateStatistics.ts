import * as path from 'node:path'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { Job } from 'bullmq'
import { AppEnv, ProcessLocaleJob } from '../types'
import { getDatasetBundlerBucketName, getTmpDir } from '../config'
import { compressResultFromLocalTar, generateTarFilename } from '../core/compress'
import { constVoid, pipe } from 'fp-ts/lib/function'
import { doesFileExistInBucket } from '../infrastructure/storage'
import { runMp3DurationReporter } from '../infrastructure/mp3DurationReporter'
import { runStats } from '../core/stats'
import { runScanLocaleData } from '../core/localeData'
import { fetchLocaleMetadata } from '../core/locales'
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
  // Fetch predefined accent/variant metadata before scanning so accents are filtered
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
  RTE.bind('stats', ({ tarFilepath }) =>
    runStats(compressResultFromLocalTar(tarFilepath)),
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

  const releaseTarballName = generateTarFilename(locale, releaseName, license)
  const uploadPath = `${releaseName}/${releaseTarballName}`

  const env: AppEnv = {
    ...job.data,
    license,
    releaseDirPath,
    releaseTarballsDirPath: path.join(releaseDirPath, 'tarballs'),
    clipsDirPath: path.join(releaseDirPath, locale, 'clips'),
    uploadPath,
    problemClips: [],
    clipCount: 0,
    startTimestamp: new Date().toISOString(),
  }

  const releaseExistsAlready = await pipe(
    doesFileExistInBucket(getDatasetBundlerBucketName())(uploadPath),
    TE.getOrElse(() => T.of(false)),
  )()

  if (!releaseExistsAlready) {
    logger.warn(
      'STATS',
      `Cannot generate statistics for ${uploadPath}: tarball does not exist`,
    )
    return
  }

  if (job.data.force) {
    logger.info('STATS', `[${locale}] --force: re-generating statistics for ${uploadPath}`)
  }

  await generateStatisticsPipeline(env)()
}
