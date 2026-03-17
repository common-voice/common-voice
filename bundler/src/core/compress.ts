import * as crypto from 'node:crypto'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { Transform, TransformCallback } from 'node:stream'

import * as tar from 'tar'

import { io as IO, readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'

import { CORPORA_CREATOR_SPLIT_FILES } from '../infrastructure/corporaCreator'
import { streamUploadToBucket } from '../infrastructure/storage'
import { getDatasetBundlerBucketName, STREAM_COMPRESS_CLIP_THRESHOLD } from '../config'
import { AppEnv, ReleaseType } from '../types'
import { logger } from '../infrastructure/logger'

export const sanitizeLicenseName = (license: string): string => {
  // Replace spaces and special characters with underscores for safe filenames
  return license.replace(/[\s/\\:*?"<>|]/g, '_')
}

export const generateTarFilename = (
  locale: string,
  releaseName: string,
  license?: string,
): string => {
  if (license) {
    const sanitizedLicense = sanitizeLicenseName(license)
    return `${releaseName}-${locale}-${sanitizedLicense}.tar.gz`
  }
  return `${releaseName}-${locale}.tar.gz`
}

// -- Compression result -------------------------------------------------------

export type CompressResult = {
  tarballFilepath: string // local path (empty string when streamed to GCS)
  uploadPath: string // GCS path
  size: number // bytes
  checksum: string // SHA-256 hex
  streamed: boolean // true = already uploaded to GCS, no local file
}

/**
 * Creates a CompressResult for a tarball that exists on local disk.
 * Size and checksum will be computed from the file by statsPipeline.
 */
export const compressResultFromLocalTar = (
  tarballFilepath: string,
): CompressResult => ({
  tarballFilepath,
  uploadPath: '',
  size: 0,
  checksum: '',
  streamed: false,
})

// -- Gzip level ---------------------------------------------------------------

/**
 * Decides gzip compression level based on clip count, not release type.
 *
 * MP3 audio is already compressed -- higher gzip levels waste CPU for <1% gain:
 *   Level 1: ~15 min for en (2.5M clips), archive ~96.4% of raw
 *   Level 6: ~53 min for en,              archive ~95.8% of raw  (3.5x slower)
 *
 * Small archives (< 10k clips) are fine at level 6 -- the text metadata
 * dominates and compresses well, and the absolute time is negligible.
 * Large archives are dominated by MP3 bytes, so level 1 is the right tradeoff.
 */
const CLIP_COUNT_COMPRESSION_THRESHOLD = 10_000

export const decideCompressionLevel = (clipCount: number): number =>
  clipCount >= CLIP_COUNT_COMPRESSION_THRESHOLD ? 1 : 6

// -- Metrics transform --------------------------------------------------------

/**
 * Pass-through Transform that counts bytes and computes a SHA-256 hash
 * inline as data flows through. Zero-copy -- chunks are forwarded unchanged.
 */
class MetricsTransform extends Transform {
  size = 0
  private readonly hash = crypto.createHash('sha256')

  _transform(chunk: Buffer, _encoding: BufferEncoding, cb: TransformCallback) {
    this.size += chunk.length
    this.hash.update(chunk)
    cb(null, chunk)
  }

  get checksum(): string {
    return this.hash.digest('hex')
  }
}

// -- Paths to include ---------------------------------------------------------

export const pathsFilter =
  (releaseType: ReleaseType) =>
  (filepath: string): boolean => {
    const filename = path.basename(filepath)
    // we never include the generated clips.tsv file
    const clipsTsv = ['clips.tsv']
    const excludeList =
      releaseType === 'full' || releaseType === 'variants'
        ? clipsTsv
        : [...clipsTsv, ...CORPORA_CREATOR_SPLIT_FILES]

    return !excludeList.includes(filename)
  }

const getPathsToAddToTarball =
  (
    locale: string,
    releaseDirPath: string,
    releaseType: ReleaseType,
  ): IO.IO<string[]> =>
  () => {
    const dir = path.join(releaseDirPath, locale)
    let paths: string[] = []
    try {
      paths = fs.readdirSync(dir, {
        encoding: 'utf-8',
        recursive: false,
      })
    } catch (err) {
      logger.warn('COMPRESS', `Directory for tarball does not exist or is empty: ${dir}`)
      return []
    }
    // Paths are relative to releaseDirPath (used as tar cwd).
    // The tar prefix option prepends releaseName, so the archive entry
    // becomes: releaseName/locale/file --flat regardless of whether the
    // working directory includes a license subdirectory like CC1/.
    const filterFilesForRelease = pathsFilter(releaseType)
    return paths
      .filter(filterFilesForRelease)
      .map((pathS: string) => path.join(locale, pathS))
  }

// -- Local compress (small locales) -------------------------------------------

const compressToLocalFile = async (
  outFilepath: string,
  pathsToCompress: string[],
  cwd: string,
  prefix: string,
  gzipLevel: number,
): Promise<{ size: number; checksum: string }> => {
  const metrics = new MetricsTransform()
  const readStream = tar.c(
    { gzip: { level: gzipLevel }, cwd, prefix },
    pathsToCompress,
  )
  await pipeline(readStream, metrics, fs.createWriteStream(outFilepath))
  return { size: metrics.size, checksum: metrics.checksum }
}

// -- GCS streaming compress (large locales) -----------------------------------

const uploadToDatasetBucket = streamUploadToBucket(getDatasetBundlerBucketName())

const compressAndStreamToGCS = async (
  locale: string,
  gcsPath: string,
  pathsToCompress: string[],
  cwd: string,
  prefix: string,
  gzipLevel: number,
): Promise<{ size: number; checksum: string }> => {
  const metrics = new MetricsTransform()
  const readStream = tar.c(
    { gzip: { level: gzipLevel }, cwd, prefix },
    pathsToCompress,
  )

  // Pipe through metrics, then upload the resulting Readable to GCS.
  // We need to pipeline tar -> metrics first, then pass metrics (which is
  // a Readable after the tar stream ends) to the GCS upload.
  const metricsReadable = readStream.pipe(metrics)

  logger.info('COMPRESS', `[${locale}] Streaming tarball to GCS: ${gcsPath}`)
  const uploadResult = await uploadToDatasetBucket(gcsPath)(metricsReadable)()
  if (uploadResult._tag === 'Left') {
    throw uploadResult.left
  }
  return { size: metrics.size, checksum: metrics.checksum }
}

// -- Unified pipeline ---------------------------------------------------------

export const compressPipeline = (
  locale: string,
  releaseName: string,
  releaseDirPath: string,
  releaseTarballDir: string,
  releaseType: ReleaseType,
  license?: string,
  clipCount?: number,
): TE.TaskEither<Error, CompressResult> => {
  const effectiveClipCount = clipCount ?? 0
  const gzipLevel = decideCompressionLevel(effectiveClipCount)
  const useStreaming = effectiveClipCount >= STREAM_COMPRESS_CLIP_THRESHOLD

  const tarballFilename = generateTarFilename(locale, releaseName, license)
  const gcsUploadPath = `${releaseName}/${tarballFilename}`

  logger.info(
    'COMPRESS',
    `[${locale}] Start compress (gzip level ${gzipLevel}, ~${effectiveClipCount.toLocaleString()} clips, ${useStreaming ? 'stream-to-GCS' : 'local file'})`,
  )

  return pipe(
    TE.Do,
    TE.let(
      'paths',
      getPathsToAddToTarball(locale, releaseDirPath, releaseType),
    ),
    TE.chainFirst(({ paths }) => {
      if (!paths || paths.length === 0) {
        return TE.left(
          new Error(
            `No files found to compress for locale ${locale}, skipping tarball creation.`,
          ),
        )
      }
      return TE.right(undefined)
    }),
    TE.chain(({ paths }) =>
      TE.tryCatch(
        async (): Promise<CompressResult> => {
          if (useStreaming) {
            const { size, checksum } = await compressAndStreamToGCS(
              locale,
              gcsUploadPath,
              paths,
              releaseDirPath,
              releaseName,
              gzipLevel,
            )
            const sizeGB = (size / 1_073_741_824).toFixed(1)
            logger.info(
              'COMPRESS',
              `[${locale}] Stream-to-GCS done: ${sizeGB} GB, sha256=${checksum.slice(0, 16)}...`,
            )
            return {
              tarballFilepath: '',
              uploadPath: gcsUploadPath,
              size,
              checksum,
              streamed: true,
            }
          } else {
            const localPath = path.join(releaseTarballDir, tarballFilename)
            fs.mkdirSync(releaseTarballDir, { recursive: true })
            const { size, checksum } = await compressToLocalFile(
              localPath,
              paths,
              releaseDirPath,
              releaseName,
              gzipLevel,
            )
            const sizeMB = (size / 1_048_576).toFixed(0)
            logger.info(
              'COMPRESS',
              `[${locale}] Local compress done: ${sizeMB} MB, sha256=${checksum.slice(0, 16)}...`,
            )
            return {
              tarballFilepath: localPath,
              uploadPath: gcsUploadPath,
              size,
              checksum,
              streamed: false,
            }
          }
        },
        reason => {
          const errMsg = String(reason)
          logger.info(
            'COMPRESS',
            `[${locale}] FAILED: ${useStreaming ? 'stream-to-GCS' : 'local'}: ${errMsg}`,
          )
          return Error(errMsg)
        },
      ),
    ),
  )
}

export const runCompress = (): RTE.ReaderTaskEither<AppEnv, Error, CompressResult> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(
      ({
        locale,
        releaseName,
        releaseDirPath,
        releaseTarballsDirPath,
        type,
        license,
        expectedClipCount,
      }) =>
        compressPipeline(
          locale,
          releaseName,
          releaseDirPath,
          releaseTarballsDirPath,
          type,
          license,
          expectedClipCount,
        ),
    ),
  )
