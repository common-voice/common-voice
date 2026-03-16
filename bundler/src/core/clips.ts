import * as fs from 'node:fs'
import { rm as rmAsync } from 'node:fs/promises'
import * as path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { Transform } from 'node:stream'

import {
  either as E,
  readerTaskEither as RTE,
  taskEither as TE,
} from 'fp-ts'
import { constVoid, pipe } from 'fp-ts/lib/function'
import { stringify } from 'csv-stringify'
import { parse } from 'csv-parse'

import { streamingQuery } from '../infrastructure/database'
import {
  doesFileExistInBucket,
  downloadFileFromBucket,
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
  CLIP_DOWNLOAD_CONCURRENCY,
} from '../config'
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

const filterMissingClips = (
  locale: string,
  releaseDirPath: string,
  problemClips: ProblemClip[],
) => {
  // Build a set of clip paths already tracked by earlier pipeline steps
  // (e.g. fetchAllClipsForLocale) to avoid duplicate problem-clip entries.
  const alreadyTracked = new Set(problemClips.map(pc => pc.path))
  let excluded = 0
  const now = new Date().toISOString()

  return new Transform({
    transform(chunk: ClipRow, _encoding, callback) {
      const filename = createClipFilename(chunk.locale, chunk.id)
      const currentReleaseClipPath = path.join(
        releaseDirPath,
        chunk.locale,
        'clips',
        filename,
      )

      if (fs.existsSync(currentReleaseClipPath)) {
        callback(null, chunk)
      } else {
        excluded++
        if (!alreadyTracked.has(filename)) {
          problemClips.push({
            path: filename,
            locale: chunk.locale,
            reason: ProblemClipReason.FAILED_DOWNLOAD,
            status: 'EXCLUDED',
            timestamp: now,
          })
        }
        callback()
      }
    },
    flush(callback) {
      if (excluded > 0) {
        logger.warn(
          'CLIPS-TSV',
          `[${locale}] MISSING: ${excluded} clips in DB but not on disk (excluded from clips.tsv)`,
        )
      }
      callback()
    },
    objectMode: true,
  })
}

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

    logger.info('QUERY', `[${locale}] START streaming clip metadata`)

    await pipeline(
      stream,
      stringify({ header: true, delimiter: '\t' }),
      writeStream,
    )

    logger.info('QUERY', `[${locale}] FINISH streaming. Closing DB connection.`)
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
    const prevClipsDir = previousReleaseName
      ? getPreviousReleaseClipDir(locale, previousReleaseName)
      : null
    const deltaClipsDir = deltaReleaseName
      ? path.join(getTmpDir(), deltaReleaseName, locale, 'clips')
      : null

    let fromPrev = 0
    let fromDelta = 0
    let missing = 0

    // Stream through the TSV row-by-row -- never buffer the full clip list.
    // Each row is processed and discarded immediately, using O(1) memory.
    const parser = parse({ columns: true, delimiter: '\t' })
    parser.on('data', (clip: ClipRow) => {
      const filename = createClipFilename(clip.locale, clip.id)
      const destPath = path.join(releaseDirPath, clip.locale, 'clips', filename)

      if (fs.existsSync(destPath)) return // already present from a previous run

      // 1. Previous full release (old clips)
      if (prevClipsDir) {
        const src = path.join(prevClipsDir, filename)
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, destPath)
          fs.unlinkSync(src) // free disk space as we go
          fromPrev++
          return
        }
      }

      // 2. Delta release (new clips)
      if (deltaClipsDir) {
        const src = path.join(deltaClipsDir, filename)
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, destPath)
          fromDelta++
          return
        }
      }

      // Not found locally -- fetchAllClipsForLocale will download from GCS.
      missing++
    })
    await pipeline(fs.createReadStream(tmpClipsFilepath), parser)

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
      `[${locale}] ${fromPrev} from prev release, ${fromDelta} from delta, ${missing} not found locally`,
    )
  }, logError)

const fetchAllClipsForLocale = (
  tmpClipsFilepath: string,
  locale: string,
  releaseDirPath: string,
  problemClips: ProblemClip[],
): TE.TaskEither<Error, void> =>
  TE.tryCatch(async () => {
    logger.info('CLIPS-DL', `[${locale}] START loading clips from GCS`)

    // Parse and partition in one pass -- only keep clips that need downloading.
    // Avoids holding two full arrays (2.5M ClipRows x ~250B = ~625MB each).
    const toDownload: ClipRow[] = []
    let cached = 0
    const parser = parse({
      columns: true,
      delimiter: '\t',
    })

    parser.on('data', (chunk: ClipRow) => {
      const clipFilepath = path.join(
        releaseDirPath,
        chunk.locale,
        'clips',
        createClipFilename(chunk.locale, chunk.id),
      )
      if (fs.existsSync(clipFilepath)) {
        cached++
      } else {
        toDownload.push(chunk)
      }
    })

    await pipeline(fs.createReadStream(tmpClipsFilepath), parser)

    const concurrency = CLIP_DOWNLOAD_CONCURRENCY
    logger.info(
      'CLIPS-DL',
      `[${locale}] ${toDownload.length} clips to fetch from GCS (${cached} already cached, concurrency=${concurrency})`,
    )

    if (toDownload.length === 0) return

    const dlStart = Date.now()
    const PROGRESS_MIN = 1000
    const PROGRESS_INTERVAL = 1000
    let completed = 0
    let downloadedOk = 0
    let failedCount = 0
    let tooSmallCount = 0
    let idx = 0

    // Fixed-size worker pool: O(concurrency) in-flight promises, not O(n).
    // Each worker pulls the next clip from the shared index until exhausted.
    // Errors are caught per-clip so one failure doesn't abort the entire locale.
    const processClip = async (clip: ClipRow) => {
      const clipFilename = createClipFilename(clip.locale, clip.id)
      const clipFilepath = path.join(releaseDirPath, clip.locale, 'clips', clipFilename)

      try {
        const buffer = await downloadFileFromBucket(CLIPS_BUCKET)(clip.path)()

        if (E.isRight(buffer)) {
          if (buffer.right.length <= MIN_AUDIO_SIZE_BYTES) {
            tooSmallCount++
            problemClips.push({
              path: clipFilename,
              locale,
              reason: ProblemClipReason.TOO_SMALL,
              status: 'EXCLUDED',
              timestamp: new Date().toISOString(),
              value: buffer.right.length,
            })
          } else {
            await fs.promises.writeFile(clipFilepath, buffer.right)
            downloadedOk++
          }
        } else {
          failedCount++
          problemClips.push({
            path: clipFilename,
            locale,
            reason: ProblemClipReason.FAILED_DOWNLOAD,
            status: 'EXCLUDED',
            timestamp: new Date().toISOString(),
          })
        }
      } catch (err) {
        failedCount++
        problemClips.push({
          path: clipFilename,
          locale,
          reason: ProblemClipReason.FAILED_DOWNLOAD,
          status: 'EXCLUDED',
          timestamp: new Date().toISOString(),
        })
      }

      completed++
      if (toDownload.length >= PROGRESS_MIN && completed % PROGRESS_INTERVAL === 0) {
        const elapsed = Date.now() - dlStart
        const rate = (completed / elapsed * 1000).toFixed(1)
        const remaining = toDownload.length - completed
        const etaSec = Math.round((elapsed / completed) * remaining / 1000)
        logger.info(
          'CLIPS-DL',
          `[${locale}] ${completed}/${toDownload.length} from GCS (${rate} clips/sec, ETA: ${etaSec}s)`,
        )
      }
    }

    const worker = async () => {
      while (true) {
        const i = idx++
        if (i >= toDownload.length) break
        await processClip(toDownload[i])
      }
    }

    await Promise.all(Array.from({ length: concurrency }, () => worker()))

    const elapsed = ((Date.now() - dlStart) / 1000).toFixed(1)
    const rate = (toDownload.length / ((Date.now() - dlStart) / 1000)).toFixed(1)
    const excludedTotal = failedCount + tooSmallCount
    logger.info(
      'CLIPS-DL',
      `[${locale}] FINISH: ${downloadedOk} downloaded, ${excludedTotal} excluded/failed, ${cached} cached (${elapsed}s, ${rate} clips/sec)`,
    )
    if (failedCount > 0) {
      logger.warn(
        'CLIPS-DL',
        `[${locale}] FAILED_DOWNLOAD: ${failedCount} clips not found in GCS (see problem-clips log)`,
      )
    }
    if (tooSmallCount > 0) {
      logger.warn(
        'CLIPS-DL',
        `[${locale}] TOO_SMALL: ${tooSmallCount} clips under ${MIN_AUDIO_SIZE_BYTES}B (see problem-clips log)`,
      )
    }
  }, logError)

const createClipsTsv = (
  tmpClipsFilepath: string,
  locale: string,
  isMinorityLanguage: boolean,
  releaseDirPath: string,
  problemClips: ProblemClip[],
): TE.TaskEither<Error, void> => {
  logger.info('CLIPS-TSV', `[${locale}] Creating clips.tsv`)

  return TE.tryCatch(async () => {
    const readStream = fs.createReadStream(tmpClipsFilepath)
    await pipeline(
      readStream,
      parse({ delimiter: '\t', columns: true }),
      filterMissingClips(locale, releaseDirPath, problemClips),
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
    logger.info('PREV-DL', `[${locale}] Downloading ${storagePath}`)
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
    TE.chainFirst(({ doesPrevReleaseExist }) => {
      if (!doesPrevReleaseExist) {
        logger.info(
          'PREV-DL',
          `[${locale}] ${storagePath} not found in GCS`,
        )
        return TE.right(constVoid())
      }
      return downloadRelease
    }),
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
 * Returns true if the delta was found and extracted, false if it didn't exist.
 * A missing delta is not an error --the caller falls back to individual GCS
 * clip downloads via fetchAllClipsForLocale.
 */
const downloadAndExtractDeltaRelease = (
  locale: string,
  effectiveDeltaReleaseName: string,
  license?: string,
): TE.TaskEither<Error, boolean> => {
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
          'DELTA-DL',
          `[${locale}] ${storagePath} not found`,
        )
        return TE.right(false)
      }
      logger.info('DELTA-DL', `[${locale}] Downloading ${storagePath} ...`)
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
          return true
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
  TE.tryCatch(async () => {
    const clipsTmpPath = getTmpClipsPath(locale)

    // Phase 1: Download prev + delta + DB query in PARALLEL.
    // These are independent I/O operations (GCS downloads + MySQL query).
    const prevTask = previousReleaseName
      ? pipe(
          downloadPreviousRelease(locale, previousReleaseName, license),
          TE.chain(() =>
            extractClipsFromPreviousRelease(locale, previousReleaseName, license),
          ),
        )
      : TE.right(constVoid() as void)

    const deltaTask = deltaReleaseName
      ? downloadAndExtractDeltaRelease(locale, deltaReleaseName, license)
      : TE.right(false)

    const queryTask = streamQueryResultToFile(
      clipsTmpPath,
      includeClipsFrom,
      includeClipsUntil,
      locale,
      license,
    )

    const [prevResult, deltaResult, queryResult] = await Promise.all([
      prevTask(),
      deltaTask(),
      queryTask(),
    ])

    if (E.isLeft(prevResult)) throw prevResult.left
    if (E.isLeft(queryResult)) throw queryResult.left
    // Delta failure is non-fatal -- fall back to GCS individual downloads
    const hasDelta = E.isRight(deltaResult) && deltaResult.right === true

    // Phase 2: Wipe clips dir so only clips from current DB query end up in tarball.
    await rmAsync(clipsDirPath, { recursive: true, force: true })
    fs.mkdirSync(clipsDirPath, { recursive: true })

    // Phase 3: Merge all local clip sources in one pass (prev + delta).
    const mergeResult = await mergeClipsFromLocalSources(
      clipsTmpPath,
      locale,
      releaseDirPath,
      previousReleaseName,
      deltaReleaseName,
    )()
    if (E.isLeft(mergeResult)) throw mergeResult.left

    // Phase 4: GCS fallback -- only when delta is missing.
    // When both prev and delta exist, every valid clip is already local.
    // Anything still missing is a ghost clip (DB record without GCS object).
    if (previousReleaseName && hasDelta) {
      logger.info(
        'CLIPS-DL',
        `[${locale}] Skipping GCS fallback (prev + delta covers all valid clips)`,
      )
    } else {
      const dlResult = await fetchAllClipsForLocale(
        clipsTmpPath,
        locale,
        releaseDirPath,
        problemClips,
      )()
      if (E.isLeft(dlResult)) throw dlResult.left
    }

    // Phase 5: Create clips.tsv (filters to clips that exist on disk).
    // Clips missing from disk are logged to problemClips as FAILED_DOWNLOAD.
    const tsvResult = await createClipsTsv(
      clipsTmpPath,
      locale,
      isMinorityLanguage,
      releaseDirPath,
      problemClips,
    )()
    if (E.isLeft(tsvResult)) throw tsvResult.left
  }, logError)

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
