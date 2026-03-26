import * as fs from 'node:fs'
import * as path from 'node:path'
import { PassThrough } from 'node:stream'

import * as tar from 'tar'
import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'

import { AppEnv, ReleaseType } from '../types'
import { sanitizeLicenseName } from './compress'
import { streamUploadToBucket } from '../infrastructure/storage'
import { getDatasetBundlerBucketName, isAllowedInMetadata } from '../config'
import { logger } from '../infrastructure/logger'

const uploadToDatasetBucket = streamUploadToBucket(getDatasetBundlerBucketName())

export const generateMetadataTarFilename = (
  locale: string,
  releaseName: string,
  license?: string,
): string => {
  const version = releaseName.replace(/^cv-corpus-/, '')
  if (license) {
    const sanitizedLicense = sanitizeLicenseName(license)
    return `cv-metadata-${version}-${locale}-${sanitizedLicense}.tar.gz`
  }
  return `cv-metadata-${version}-${locale}.tar.gz`
}

export const getMetadataFiles = (
  locale: string,
  releaseDirPath: string,
  releaseType: ReleaseType = 'full',
): string[] => {
  const dir = path.join(releaseDirPath, locale)
  const isDelta = releaseType === 'delta'
  try {
    return fs
      .readdirSync(dir, { encoding: 'utf-8' })
      .filter(entry => {
        const fullPath = path.join(dir, entry)
        return isAllowedInMetadata(entry, isDelta) && fs.statSync(fullPath).isFile()
      })
      .map(entry => path.join(locale, entry))
  } catch {
    logger.warn('METADATA', `Directory does not exist or is empty: ${dir}`)
    return []
  }
}

export const metadataPipeline = (
  locale: string,
  releaseName: string,
  releaseDirPath: string,
  _releaseTarballDir: string,
  releaseType: ReleaseType = 'full',
  license?: string,
): TE.TaskEither<Error, string> => {
  logger.info('METADATA', `[${locale}] Compressing + streaming metadata`)
  return pipe(
    TE.Do,
    TE.let('filename', () =>
      generateMetadataTarFilename(locale, releaseName, license),
    ),
    TE.let('paths', () => getMetadataFiles(locale, releaseDirPath, releaseType)),
    TE.chainFirst(({ paths }) => {
      if (paths.length === 0) {
        return TE.left(
          new Error(
            `No metadata files found for locale ${locale}, skipping metadata tarball.`,
          ),
        )
      }
      return TE.right(undefined)
    }),
    TE.chainFirst(({ filename, paths }) => {
      const uploadPath = `${releaseName}/metadata/${filename}`
      const tarStream = tar.c(
        { gzip: true, cwd: releaseDirPath, prefix: releaseName },
        paths,
      )
      // Pipe through PassThrough to satisfy Readable type (tar.Pack is not
      // structurally compatible with Node.js Readable).
      const readable = tarStream.pipe(new PassThrough())
      tarStream.on('error', (err) => readable.destroy(err as Error))
      logger.info('METADATA', `[${locale}] Streaming metadata to GCS: ${uploadPath}`)
      return uploadToDatasetBucket(uploadPath)(readable)
    }),
    TE.map(({ filename }) => filename),
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
      ({ locale, releaseName, releaseDirPath, releaseTarballsDirPath, type, license }) =>
        metadataPipeline(
          locale,
          releaseName,
          releaseDirPath,
          releaseTarballsDirPath,
          type,
          license,
        ),
    ),
  )
