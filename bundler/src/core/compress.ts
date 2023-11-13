import crypto from 'node:crypto'
import fs from 'node:fs'
import tar from 'tar'
import { io as IO, taskEither as TE } from 'fp-ts'
import { constVoid, pipe } from 'fp-ts/lib/function'
import path from 'node:path'
import { calculateChecksum, prepareDir } from '../infrastructure/filesystem'
import {
  getDatasetBundlerBucketName,
  getReleaseBasePath,
  getReleaseName,
  getReleaseTarballsDirPath,
} from '../config/config'
import {
  getMetadataFromFile,
  streamUploadToBucket,
} from '../infrastructure/storage'
import * as RTE from 'fp-ts/readerTaskEither'
import { ProcessLocaleJob } from '../types'

const generateTarFilename = (locale: string) =>
  `${getReleaseName()}-${locale}.tar.gz`

const createTarballWriteStream = (outFilepath: string) => {
  return fs.createWriteStream(outFilepath)
}

const tarPromise = (outFilepath: string, pathsToCompress: string[]) =>
  new Promise<void>((resolve, reject) => {
    tar
      .c({ gzip: true }, pathsToCompress)
      .pipe(createTarballWriteStream(outFilepath))
      .on('finish', () => {
        resolve()
      })
      .on('error', () => reject())
  })

const compress =
  (pathsToCompress: string[]) =>
  (outFilepath: string): TE.TaskEither<Error, void> =>
    TE.tryCatch(
      () => tarPromise(outFilepath, pathsToCompress),
      reason => Error(String(reason)),
    )

const getPathsToAddToTarball =
  (locale: string): IO.IO<string[]> =>
  () => {
    const dir = path.join(getReleaseBasePath(), locale)
    const paths = fs.readdirSync(dir, {
      encoding: 'utf-8',
      recursive: false,
    })
    // we don't want to include the generated clips.tsv
    return paths
      .filter((path: string) => !path.endsWith('clips.tsv'))
      .map((pathS: string) => path.join(getReleaseName(), locale, pathS))
  }

export const runCompress = (locale: string): TE.TaskEither<Error, string> => {
  console.log('Start compress step')
  return pipe(
    TE.Do,
    TE.let('tarballDirPath', getReleaseTarballsDirPath),
    TE.let('tarballFilename', () => generateTarFilename(locale)),
    TE.let('tarballFilepath', ({ tarballDirPath, tarballFilename }) =>
      path.join(tarballDirPath, tarballFilename),
    ),
    TE.let('paths', getPathsToAddToTarball(locale)),
    TE.chainFirst(({ tarballDirPath }) =>
      TE.fromIO(prepareDir(tarballDirPath)),
    ),
    TE.chainFirst(({ tarballFilepath, paths }) =>
      compress(paths)(tarballFilepath),
    ),
    TE.map(({ tarballFilepath }) => tarballFilepath),
  )
}

export const runCompressE = (): RTE.ReaderTaskEither<
  ProcessLocaleJob,
  Error,
  string
> =>
  pipe(
    RTE.ask<ProcessLocaleJob>(),
    RTE.chainTaskEitherK(({ locale }) => runCompress(locale)),
  )
