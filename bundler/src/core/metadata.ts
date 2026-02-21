import * as fs from 'node:fs'
import { rm as rmAsync } from 'node:fs/promises'
import * as path from 'node:path'
import { pipeline } from 'node:stream/promises'

import * as tar from 'tar'
import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'

import { AppEnv } from '../types'
import { sanitizeLicenseName } from './compress'
import { streamUploadToBucket } from '../infrastructure/storage'
import { getDatasetBundlerBucketName } from '../config/config'
import { prepareDir } from '../infrastructure/filesystem'
import { logger } from '../infrastructure/logger'

const uploadToDatasetBucket = streamUploadToBucket(getDatasetBundlerBucketName())

export const generateMetadataTarFilename = (
  locale: string,
  releaseName: string,
  license?: string,
): string => {
  if (license) {
    const sanitizedLicense = sanitizeLicenseName(license)
    return `${releaseName}-${locale}-${sanitizedLicense}-metadata.tar.gz`
  }
  return `${releaseName}-${locale}-metadata.tar.gz`
}

/**
 * Returns all regular files at the root of the locale directory.
 * Directories (e.g. clips/) are excluded --only text/metadata files
 * like TSV, CSV, MD, etc. are included.
 */
export const getMetadataFiles = (
  locale: string,
  releaseDirPath: string,
): string[] => {
  const dir = path.join(releaseDirPath, locale)
  try {
    return fs
      .readdirSync(dir, { encoding: 'utf-8' })
      .filter(entry => fs.statSync(path.join(dir, entry)).isFile())
      .map(entry => path.join(locale, entry))
  } catch {
    logger.warn('METADATA', `Directory does not exist or is empty: ${dir}`)
    return []
  }
}

const metadataPipeline = (
  locale: string,
  releaseName: string,
  releaseDirPath: string,
  releaseTarballDir: string,
  license?: string,
): TE.TaskEither<Error, string> => {
  logger.info('METADATA', `[${locale}] Compressing metadata files`)
  return pipe(
    TE.Do,
    TE.let('filename', () =>
      generateMetadataTarFilename(locale, releaseName, license),
    ),
    TE.let('filepath', ({ filename }) =>
      path.join(releaseTarballDir, filename),
    ),
    TE.let('paths', () => getMetadataFiles(locale, releaseDirPath)),
    TE.chainFirst(() => TE.fromIO(prepareDir(releaseTarballDir))),
    TE.chainFirst(({ filepath, paths }) => {
      if (paths.length === 0) {
        return TE.left(
          new Error(
            `No metadata files found for locale ${locale}, skipping metadata tarball.`,
          ),
        )
      }
      return TE.tryCatch(
        async () => {
          const readStream = tar.c(
            { gzip: true, cwd: releaseDirPath, prefix: releaseName },
            paths,
          )
          await pipeline(readStream, fs.createWriteStream(filepath))
        },
        reason => Error(String(reason)),
      )
    }),
    // Upload to ${releaseName}/metadata/
    TE.chainFirst(({ filename, filepath }) => {
      const uploadPath = `${releaseName}/metadata/${filename}`
      return uploadToDatasetBucket(uploadPath)(fs.createReadStream(filepath))
    }),
    // Remove the local metadata tarball --the main tarball is cleaned up
    // separately by runCleanUp, but this file is only needed for upload.
    TE.chainFirst(({ filepath }) =>
      TE.tryCatch(
        () => rmAsync(filepath),
        reason => Error(String(reason)),
      ),
    ),
    TE.map(({ filepath }) => filepath),
  )
}

export const runCompressAndUploadMetadata = (): RTE.ReaderTaskEither<
  AppEnv,
  Error,
  string
> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(
      ({ locale, releaseName, releaseDirPath, releaseTarballsDirPath, license }) =>
        metadataPipeline(
          locale,
          releaseName,
          releaseDirPath,
          releaseTarballsDirPath,
          license,
        ),
    ),
  )
