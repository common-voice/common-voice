import fs from 'node:fs'
import path from 'node:path'
import * as TE from 'fp-ts/TaskEither'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { AppEnv } from '../types'
import { pipe } from 'fp-ts/function'
import { streamDownloadFileFromBucket } from '../infrastructure/storage'
import { pipeline } from 'node:stream/promises'
import { getDatasetBundlerBucketName, getTmpDir } from '../config/config'
import { generateTarFilename } from './compress'
import { logError } from './clips'
import { concatFiles } from '../infrastructure/filesystem'
import { CORPORA_CREATOR_CLIP_SPLIT_FILES } from '../infrastructure/corporaCreator'

const downloadDataset = (locale: string, releaseName: string) =>
  TE.tryCatch(async () => {
    const tarFilename = generateTarFilename(locale, releaseName)
    const storagePath = `${releaseName}/${tarFilename}`
    const filepath = path.join(getTmpDir(), tarFilename)

    console.log('Downloading dataset', storagePath)
    const writeStream = fs.createWriteStream(filepath)

    await pipeline(
      streamDownloadFileFromBucket(getDatasetBundlerBucketName())(storagePath),
      writeStream,
    )

    return filepath
  }, logError)

export const runDownloadDataset = (): RTE.ReaderTaskEither<
  AppEnv,
  Error,
  string
> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ locale, releaseName }) =>
      downloadDataset(locale, releaseName),
    ),
  )

const generateClipsTsv = (locale: string, releaseDir: string) => {
  const clipsTsvPath = path.join(releaseDir, locale, 'clips.tsv')
  const filepaths = CORPORA_CREATOR_CLIP_SPLIT_FILES.map(f => path.join(releaseDir, locale, f))
  return pipe(
    TE.Do,
    TE.chain(() =>
      concatFiles(
        filepaths[0],
        clipsTsvPath,
      ),
    ),
    TE.chain(() =>
      concatFiles(
        filepaths[1],
        clipsTsvPath,
        { skipFirstLine: true },
      ),
    ),
    TE.chain(() =>
      concatFiles(
        filepaths[2],
        clipsTsvPath,
        { skipFirstLine: true },
      ),
    ),
  )
}

export const runGenerateClipsTsv = (): RTE.ReaderTaskEither<AppEnv, Error, void> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ locale, releaseDirPath }) =>
      generateClipsTsv(locale, releaseDirPath),
    ),
  )
