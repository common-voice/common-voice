import { spawn } from 'node:child_process'
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
import { pipe } from 'fp-ts/lib/function'
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
import { generateTarFilename } from './compress'
import { streamExtractTar } from '../infrastructure/tar'
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
      for (;;) {
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

// -- Streamed download + extract ----------------------------------------------

/**
 * Streams a release tarball from GCS directly through `tar -xzf -` into the
 * working directory. The .tar.gz file never lands on disk.
 *
 * --strip-components=1 removes the leading release-name directory from each
 * entry (e.g. cv-corpus-24.0/ps/clips/... -> ps/clips/...) so clips land in
 * the correct working path regardless of which release the tarball came from.
 *
 * Returns true if the tarball was found and extracted, false if it did not
 * exist in GCS.
 */
const streamDownloadAndExtractRelease = (
  locale: string,
  releaseName: string,
  releaseDirPath: string,
  label: string,
  license?: string,
): TE.TaskEither<Error, boolean> => {
  const tarFilename = generateTarFilename(locale, releaseName, license)
  const storagePath = `${releaseName}/${tarFilename}`

  return pipe(
    doesFileExistInBucket(getDatasetBundlerBucketName())(storagePath),
    TE.chain(exists => {
      if (!exists) {
        logger.info(label, `[${locale}] ${storagePath} not found in GCS`)
        return TE.right(false)
      }
      logger.info(
        label,
        `[${locale}] Stream-extracting ${storagePath} -> ${releaseDirPath}`,
      )
      return pipe(
        streamExtractTar(
          streamDownloadFileFromBucket(getDatasetBundlerBucketName())(
            storagePath,
          ),
          releaseDirPath,
          1,
          ['*/clips/*'], // Only extract audio -- skip TSVs/text (can be 500+ MB)
        ),
        TE.map(() => {
          logger.info(label, `[${locale}] Stream-extract complete`)
          return true
        }),
      )
    }),
  )
}

// -- prune (GDPR and other deletions) -------------------------------------

/**
 * Shell script that finds and deletes clips on disk that are not referenced
 * by the current DB query. Handles (GDPR-)deleted clips that still exist in
 * previous/delta release tarballs.
 *
 * Uses `sort` + `comm` for O(1) Node.js memory regardless of clip count.
 *
 * Arguments: $1 = clips directory, $2 = DB query TSV path, $3 = locale.
 * Outputs: the number of orphan clips deleted (integer on stdout).
 */
const PRUNE_SCRIPT = `set -euo pipefail
CLIPS_DIR="$1"
TSV_FILE="$2"
LOCALE="$3"

VALID=$(mktemp)
ONDISK=$(mktemp)
ORPHANS=$(mktemp)
trap 'rm -f "$VALID" "$ONDISK" "$ORPHANS"' EXIT

# Build sorted list of valid clip filenames from the DB query TSV.
# Column 1 = clip ID; locale is constant for the entire file.
tail -n+2 "$TSV_FILE" \\
  | awk -F'\\t' -v loc="$LOCALE" '{print "common_voice_" loc "_" $1 ".mp3"}' \\
  | LC_ALL=C sort > "$VALID"

# Build sorted list of clip filenames currently on disk.
ls -1U "$CLIPS_DIR" 2>/dev/null | LC_ALL=C sort > "$ONDISK"

# Orphans = on disk but not in DB (e.g. GDPR-deleted clips).
comm -23 "$ONDISK" "$VALID" > "$ORPHANS"

COUNT=$(wc -l < "$ORPHANS" | tr -d ' ')
echo "$COUNT"

if [ "$COUNT" -gt 0 ]; then
  (cd "$CLIPS_DIR" && xargs rm -f < "$ORPHANS")
fi
`

/**
 * Removes clips from the working directory that are not referenced by the
 * current DB query TSV. Returns the number of orphan clips deleted.
 */
export const pruneOrphanClips = (
  tmpClipsFilepath: string,
  locale: string,
  clipsDirPath: string,
): TE.TaskEither<Error, number> =>
  TE.tryCatch(async () => {
    if (!fs.existsSync(clipsDirPath)) return 0

    const count = await new Promise<number>((resolve, reject) => {
      const proc = spawn('bash', [
        '-c',
        PRUNE_SCRIPT,
        '--',
        clipsDirPath,
        tmpClipsFilepath,
        locale,
      ])

      let stdout = ''
      proc.stdout.on('data', (data: Buffer) => {
        stdout += String(data)
      })

      const stderrChunks: string[] = []
      proc.stderr.on('data', (data: Buffer) =>
        stderrChunks.push(String(data)),
      )

      proc.on('close', code => {
        if (code !== 0) {
          reject(
            new Error(
              `prune script exited with code ${code}: ${stderrChunks.join('')}`,
            ),
          )
        } else {
          resolve(parseInt(stdout.trim(), 10) || 0)
        }
      })
      proc.on('error', reason => reject(reason))
    })

    return count
  }, logError)

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

    // Phase 1: Wipe clips dir -- clean slate before extraction.
    await rmAsync(clipsDirPath, { recursive: true, force: true })
    fs.mkdirSync(clipsDirPath, { recursive: true })

    // Phase 2: Stream-extract prev + delta directly into the working directory
    // AND run the DB query, all in PARALLEL.
    //
    // Tars are streamed through `tar -xzf -` -- the .tar.gz files never land
    // on disk. --strip-components=1 remaps the old release prefix to the
    // current working path. Prev and delta contain non-overlapping clips
    // (prev = up to last release date, delta = since then) so parallel
    // extraction into the same directory is safe.
    const prevTask = previousReleaseName
      ? streamDownloadAndExtractRelease(
          locale,
          previousReleaseName,
          releaseDirPath,
          'PREV-STREAM',
          license,
        )
      : TE.right(false as boolean)

    const deltaTask = deltaReleaseName
      ? streamDownloadAndExtractRelease(
          locale,
          deltaReleaseName,
          releaseDirPath,
          'DELTA-STREAM',
          license,
        )
      : TE.right(false as boolean)

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
    // Delta extraction failure is fatal: since prev and delta extract directly
    // into the working directory, a mid-stream failure leaves truncated MP3s
    // that downstream steps would treat as valid cached clips. The job will
    // retry from scratch (Phase 1 wipes the clips dir).
    // Note: delta tar NOT FOUND in GCS returns Right(false), which is fine --
    // only extraction errors produce Left.
    if (E.isLeft(deltaResult)) throw deltaResult.left
    const hasDelta = deltaResult.right === true
    const hasPrev = E.isRight(prevResult) && prevResult.right === true

    // Phase 3: GDPR prune -- delete clips on disk that are not in the current
    // DB query (e.g. clips deleted after the previous release was built).
    // Uses shell sort+comm for O(1) Node.js memory.
    if (hasPrev || hasDelta) {
      const pruneResult = await pruneOrphanClips(
        clipsTmpPath,
        locale,
        clipsDirPath,
      )()
      if (E.isLeft(pruneResult)) throw pruneResult.left
      if (pruneResult.right > 0) {
        logger.info(
          'CLIPS-PRUNE',
          `[${locale}] Removed ${pruneResult.right} orphan clips (GDPR / no longer in DB)`,
        )
      }
    }

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
