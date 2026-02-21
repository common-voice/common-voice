import * as fs from 'node:fs'
import { rm as rmAsync } from 'node:fs/promises'
import * as path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { Transform } from 'node:stream'

import {
  either as E,
  readerTaskEither as RTE,
  task as T,
  taskEither as TE,
} from 'fp-ts'
import { constVoid, pipe } from 'fp-ts/lib/function'
import { stringify } from 'csv-stringify'
import { parse } from 'csv-parse'

import { streamingQuery } from '../infrastructure/database'
import {
  doesFileExistInBucket,
  downloadFileFromBucket,
  getMetadataFromFile,
  streamDownloadFileFromBucket,
} from '../infrastructure/storage'
import { AppEnv, ClipRow, ProblemClip, ProblemClipReason } from '../types'
import { hashClientId } from './clients'
import {
  getClipsBucketName,
  getDatasetBundlerBucketName,
  getQueriesDir,
  getTmpDir,
  MIN_AUDIO_SIZE_BYTES,
} from '../config/config'
import { prepareDir, rmFilepath } from '../infrastructure/filesystem'
import { generateTarFilename } from './compress'
import { extractTar } from '../infrastructure/tar'
import { logger } from '../infrastructure/logger'

const CLIPS_BUCKET = getClipsBucketName()

export const TSV_COLUMNS = [
  'client_id',
  'path',
  'sentence_id',
  'sentence',
  'sentence_domain',
  'up_votes',
  'down_votes',
  'age',
  'gender',
  'accents',
  'variant',
  'locale',
  'segment',
] as const

export type CLIPS_TSV_ROW = {
  [K in (typeof TSV_COLUMNS)[number]]: string
}
export const logError = (err: unknown) => {
  logger.error('ERROR', String(err))
  return Error(String(err))
}
const getTmpClipsPath = (locale: string) =>
  path.join(getTmpDir(), `${locale}_clips.tsv`)

const createClipFilename = (locale: string, clipId: string) =>
  `common_voice_${locale}_${clipId}.mp3`

const printLn = (text: string) => text + '\n'

const writeFileStreamToTsv = (locale: string, releaseDirPath: string) => {
  const writeStream = fs.createWriteStream(
    path.join(releaseDirPath, locale, 'clips.tsv'),
    {
      encoding: 'utf-8',
    },
  )
  writeStream.write(printLn(TSV_COLUMNS.join('\t')))
  return writeStream
}

const clipRowToTsvEntry = (row: ClipRow): string =>
  printLn(TSV_COLUMNS.map(key => row[key]).join('\t'))

/**
 * Transforms the mysql object stream into a stream of strings.
 *
 * @remarks
 *
 * This transform stream can be piped into other streams
 * that are not in object mode.
 */
const transformClips = (isMinorityLanguage: boolean) =>
  new Transform({
    transform(chunk: ClipRow, _encoding, callback) {
      const filename = createClipFilename(chunk.locale, chunk.id)

      const updatedClipRow = {
        ...chunk,
        sentence: chunk.sentence.replace(/\s/gi, ' '),
        client_id: hashClientId(chunk.client_id),
        path: filename,
        gender: isMinorityLanguage ? '' : chunk.gender,
        age: isMinorityLanguage ? '' : chunk.age,
      }

      callback(null, clipRowToTsvEntry(updatedClipRow))
    },
    objectMode: true,
  })

const getPreviousReleaseClipDir = (locale: string, prevReleaseName: string) =>
  path.join(getTmpDir(), prevReleaseName, locale, 'clips')

const filterMissingClips = (releaseDirPath: string) =>
  new Transform({
    transform(chunk: ClipRow, _encoding, callback) {
      const filename = createClipFilename(chunk.locale, chunk.id)
      const currentReleaseClipPath = path.join(
        releaseDirPath,
        chunk.locale,
        'clips',
        filename,
      )
      const clipExists = fs.existsSync(currentReleaseClipPath)

      if (clipExists) {
        callback(null, chunk)
      } else {
        callback()
      }
    },
    objectMode: true,
  })

const streamQueryResultToFile = (
  clipsTmpPath: string,
  includeClipsFrom: string,
  includeClipsUntil: string,
  locale: string,
  license?: string,
) =>
  TE.tryCatch(async () => {
    const { conn, stream } = streamingQuery(
      fs.readFileSync(path.join(getQueriesDir(), 'bundleLocale.sql'), {
        encoding: 'utf-8',
      }),
      [
        includeClipsFrom,
        includeClipsUntil,
        locale,
        license || null,
        license || null,
        license || null,
      ],
    )

    const writeStream = fs.createWriteStream(clipsTmpPath)

    logger.info('QUERY', `[${locale}] Start streaming clip metadata`)

    await pipeline(
      stream,
      stringify({ header: true, delimiter: '\t' }),
      writeStream,
    )

    logger.info(
      'QUERY',
      `[${locale}] Finished streaming. Closing DB connection.`,
    )
    const endConnection = () =>
      new Promise<void>((resolve, reject) => {
        conn.end(err => {
          if (err) reject(err)
          resolve()
        })
      })

    await endConnection()
  }, logError)

/**
 * Copy clips from all available local sources into the working clips
 * directory in a single pass over the DB metadata TSV.
 *
 * Source priority:
 *   1. Previous full-release directory (old clips already on disk)
 *   2. Delta-release directory (new clips from a pre-built delta tarball)
 *
 * - Clips found in neither source are left absent
 * - `fetchAllClipsForLocale` will then download them individually from GCS as a fallback.
 * - Clips already present in the working directory (from a previous partial run) are skipped.
 * - Files moved from the previous-release directory are unlinked immediately to
 *   free disk space as the loop progresses.
 */
const mergeClipsFromLocalSources = (
  tmpClipsFilepath: string,
  locale: string,
  releaseDirPath: string,
  previousReleaseName?: string,
  deltaReleaseName?: string,
) =>
  TE.tryCatch(async () => {
    const clips: ClipRow[] = []
    const parser = parse({ columns: true, delimiter: '\t' })
    parser.on('data', (chunk: ClipRow) => clips.push(chunk))
    await pipeline(fs.createReadStream(tmpClipsFilepath), parser)

    const prevClipsDir = previousReleaseName
      ? getPreviousReleaseClipDir(locale, previousReleaseName)
      : null
    const deltaClipsDir = deltaReleaseName
      ? path.join(getTmpDir(), deltaReleaseName, locale, 'clips')
      : null

    let fromPrev = 0
    let fromDelta = 0
    let missing = 0

    for (const clip of clips) {
      const filename = createClipFilename(clip.locale, clip.id)
      const destPath = path.join(releaseDirPath, clip.locale, 'clips', filename)

      if (fs.existsSync(destPath)) continue // already present from a previous run

      // 1. Previous full release (old clips)
      if (prevClipsDir) {
        const src = path.join(prevClipsDir, filename)
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, destPath)
          fs.unlinkSync(src) // free disk space as we go
          fromPrev++
          continue
        }
      }

      // 2. Delta release (new clips)
      if (deltaClipsDir) {
        const src = path.join(deltaClipsDir, filename)
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, destPath)
          fromDelta++
          continue
        }
      }

      // Not found locally --fetchAllClipsForLocale will download from GCS.
      missing++
    }

    // Remove the consumed delta locale directory to free disk space.
    // Only the locale subdir is deleted (not the entire deltaReleaseName dir)
    // so concurrent jobs for other locales are not affected if worker
    // concurrency is ever increased above 1.
    if (deltaClipsDir && fs.existsSync(deltaClipsDir)) {
      await rmAsync(path.join(getTmpDir(), deltaReleaseName!, locale), {
        recursive: true,
        force: true,
      })
    }

    logger.info(
      'CLIPS-MERGE',
      `[${locale}] ${fromPrev} from prev release, ${fromDelta} from delta, ${missing} pending GCS fallback`,
    )
  }, logError)

const fetchAllClipsForLocale = (
  tmpClipsFilepath: string,
  locale: string,
  releaseDirPath: string,
  problemClips: ProblemClip[],
): TE.TaskEither<Error, void> =>
  TE.tryCatch(async () => {
    logger.info('CLIPS-DOWNLOAD', `[${locale}] Fetching missing clips from GCS`)

    const clips: ClipRow[] = []
    const parser = parse({
      columns: true,
      delimiter: '\t',
    })

    parser.on('data', (chunk: ClipRow) => {
      clips.push(chunk)
    })

    await pipeline(fs.createReadStream(tmpClipsFilepath), parser)

    for (const clip of clips) {
      const clipFilename = createClipFilename(clip.locale, clip.id)
      const clipFilepath = path.join(
        releaseDirPath,
        clip.locale,
        'clips',
        clipFilename,
      )

      if (fs.existsSync(clipFilepath)) {
        continue
      }

      const fileSize = await pipe(
        getMetadataFromFile(CLIPS_BUCKET)(clip.path),
        TE.map(metadata => Number(metadata.size)),
        TE.getOrElse(() => T.of(0)),
      )()

      if (fileSize <= MIN_AUDIO_SIZE_BYTES) {
        problemClips.push({
          path: clipFilename,
          locale,
          reason: ProblemClipReason.TOO_SMALL,
          status: 'EXCLUDED',
          timestamp: new Date().toISOString(),
        })
        continue
      }

      const buffer = await downloadFileFromBucket(CLIPS_BUCKET)(clip.path)()

      if (E.isRight(buffer)) {
        fs.writeFileSync(clipFilepath, buffer.right)
      } else {
        logger.warn(
          'CLIPS-DOWNLOAD',
          `[${locale}] Failed to download ${clipFilename}: ${buffer.left.message}`,
        )
        problemClips.push({
          path: clipFilename,
          locale,
          reason: ProblemClipReason.FAILED_DOWNLOAD,
          status: 'EXCLUDED',
          timestamp: new Date().toISOString(),
        })
      }
    }

    logger.info(
      'CLIPS-DOWNLOAD',
      `[${locale}] Finished downloading clips from GCS`,
    )
  }, logError)

const createClipsTsv = (
  tmpClipsFilepath: string,
  locale: string,
  isMinorityLanguage: boolean,
  releaseDirPath: string,
): TE.TaskEither<Error, void> => {
  logger.info('CLIPS-TSV', `[${locale}] Creating clips.tsv`)

  return TE.tryCatch(async () => {
    const readStream = fs.createReadStream(tmpClipsFilepath)
    await pipeline(
      readStream,
      parse({ delimiter: '\t', columns: true }),
      filterMissingClips(releaseDirPath),
      transformClips(isMinorityLanguage),
      writeFileStreamToTsv(locale, releaseDirPath),
    )
  }, logError)
}

const downloadPreviousRelease = (
  locale: string,
  prevReleaseName: string,
  license?: string,
) => {
  const tarFilename = generateTarFilename(locale, prevReleaseName, license)
  const storagePath = `${prevReleaseName}/${tarFilename}`

  const downloadRelease = TE.tryCatch(async () => {
    logger.info('PREV-DOWNLOAD', `Downloading prev release ${storagePath}`)
    const writeStream = fs.createWriteStream(
      path.join(getTmpDir(), tarFilename),
    )
    await pipeline(
      streamDownloadFileFromBucket(getDatasetBundlerBucketName())(storagePath),
      writeStream,
    )
  }, logError)

  return pipe(
    TE.Do,
    TE.bind('doesPrevReleaseExist', () =>
      doesFileExistInBucket(getDatasetBundlerBucketName())(storagePath),
    ),
    TE.chainFirst(({ doesPrevReleaseExist }) =>
      doesPrevReleaseExist ? downloadRelease : TE.right(constVoid()),
    ),
    TE.as(constVoid()),
  )
}

const extractClipsFromPreviousRelease = (
  locale: string,
  prevReleaseName: string,
  license?: string,
) => {
  const filename = generateTarFilename(locale, prevReleaseName, license)
  const filepath = path.join(getTmpDir(), filename)

  if (!fs.existsSync(filepath)) {
    logger.debug(
      'PREV-EXTRACT',
      `${filepath} doesn't exist, skipping extraction`,
    )
    return TE.right(constVoid())
  }

  return pipe(
    extractTar(filepath, getTmpDir()),
    TE.chain(() => TE.fromIO(rmFilepath(filepath))),
  )
}

/**
 * Downloads a delta tarball from GCS and extracts it into the tmp directory.
 * A no-op (not an error) if the tarball does not exist --the caller falls back
 * to individual GCS clip downloads via fetchAllClipsForLocale.
 */
const downloadAndExtractDeltaRelease = (
  locale: string,
  effectiveDeltaReleaseName: string,
  license?: string,
): TE.TaskEither<Error, void> => {
  const tarFilename = generateTarFilename(
    locale,
    effectiveDeltaReleaseName,
    license,
  )
  const storagePath = `${effectiveDeltaReleaseName}/${tarFilename}`
  const localTarPath = path.join(getTmpDir(), tarFilename)

  return pipe(
    doesFileExistInBucket(getDatasetBundlerBucketName())(storagePath),
    TE.chain(exists => {
      if (!exists) {
        logger.info(
          'DELTA-DOWNLOAD',
          `${storagePath} not found --GCS fallback applies`,
        )
        return TE.right(constVoid())
      }
      logger.info('DELTA-DOWNLOAD', `Downloading ${storagePath} ...`)
      return pipe(
        TE.tryCatch(async () => {
          const writeStream = fs.createWriteStream(localTarPath)
          await pipeline(
            streamDownloadFileFromBucket(getDatasetBundlerBucketName())(
              storagePath,
            ),
            writeStream,
          )
        }, logError),
        TE.chain(() => extractTar(localTarPath, getTmpDir())),
        TE.chain(() => TE.fromIO(rmFilepath(localTarPath))),
        TE.map(() => {
          logger.info('DELTA-EXTRACT', `[${locale}] Delta tarball extracted`)
        }),
      )
    }),
  )
}

export const fetchAllClipsPipeline = (
  locale: string,
  includeClipsFrom: string,
  includeClipsUntil: string,
  isMinorityLanguage: boolean,
  clipsDirPath: string,
  releaseDirPath: string,
  problemClips: ProblemClip[],
  license?: string,
  previousReleaseName?: string,
  deltaReleaseName?: string,
): TE.TaskEither<Error, void> =>
  pipe(
    TE.Do,
    TE.let('clipsTmpPath', () => getTmpClipsPath(locale)),
    // 1. Download + extract the previous full release (old clips).
    TE.chainFirst(() =>
      previousReleaseName
        ? downloadPreviousRelease(locale, previousReleaseName, license)
        : TE.right(constVoid()),
    ),
    TE.chainFirst(() =>
      previousReleaseName
        ? extractClipsFromPreviousRelease(locale, previousReleaseName, license)
        : TE.right(constVoid()),
    ),
    // 2. Download + extract the delta tarball (new clips), if available.
    //    A missing delta tarball is silently skipped; step 4b covers the gap.
    TE.chainFirst(() =>
      deltaReleaseName
        ? downloadAndExtractDeltaRelease(locale, deltaReleaseName, license)
        : TE.right(constVoid()),
    ),
    // 3. Stream DB query → tmp TSV (metadata for all clips in this release).
    TE.chainFirst(({ clipsTmpPath }) =>
      streamQueryResultToFile(
        clipsTmpPath,
        includeClipsFrom,
        includeClipsUntil,
        locale,
        license,
      ),
    ),
    TE.chainFirst(() => TE.fromIO(prepareDir(clipsDirPath))),
    // 4a. Merge all local clip sources into the working directory in one pass:
    //     previous full release (old clips) + delta tarball (new clips).
    //     Files are moved/copied in DB-TSV order so only relevant clips are
    //     included. The prev-release dir is cleaned up incrementally; the
    //     delta dir is removed in bulk at the end.
    TE.chainFirst(({ clipsTmpPath }) =>
      mergeClipsFromLocalSources(
        clipsTmpPath,
        locale,
        releaseDirPath,
        previousReleaseName,
        deltaReleaseName,
      ),
    ),
    // 4b. Download any clip still absent from disk --those not found in either
    //     local source --individually from GCS (~15 clips/sec).
    //     fetchAllClipsForLocale skips files that already exist, so this is a
    //     true fallback and a no-op for clips covered by the delta path.
    TE.chainFirst(({ clipsTmpPath }) =>
      fetchAllClipsForLocale(clipsTmpPath, locale, releaseDirPath, problemClips),
    ),
    TE.chainFirst(({ clipsTmpPath }) =>
      createClipsTsv(clipsTmpPath, locale, isMinorityLanguage, releaseDirPath),
    ),
    TE.mapLeft(e => {
      logger.error('CLIPS', String(e))
      return e
    }),
    TE.as(constVoid()),
  )

export const runFetchAllClipsForLocale = (
  isMinorityLanguage: boolean,
): RTE.ReaderTaskEither<AppEnv, Error, void> => {
  return pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(
      ({
        locale,
        from,
        until,
        clipsDirPath,
        releaseDirPath,
        previousReleaseName,
        deltaReleaseName,
        license,
        problemClips,
      }) =>
        fetchAllClipsPipeline(
          locale,
          from,
          until,
          isMinorityLanguage,
          clipsDirPath,
          releaseDirPath,
          problemClips,
          license,
          previousReleaseName,
          deltaReleaseName,
        ),
    ),
  )
}
