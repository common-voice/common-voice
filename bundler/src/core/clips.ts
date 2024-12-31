import fs from 'node:fs'
import { pipeline } from 'node:stream/promises'
import path from 'node:path'
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
import { AppEnv, ClipRow } from '../types'
import { hashClientId } from './clients'
import {
  getClipsBucketName,
  getDatasetBundlerBucketName,
  getQueriesDir,
  getTmpDir,
} from '../config/config'
import { prepareDir, rmFilepath } from '../infrastructure/filesystem'
import { generateTarFilename } from './compress'
import { extractTar } from '../infrastructure/tar'

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
  'accents',
  'variant',
  'locale',
  'segment',
] as const

export type CLIPS_TSV_ROW = {
  [K in (typeof TSV_COLUMNS)[number]]: string
}
export const logError = (err: unknown) => {
  console.log(err)
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
    transform(chunk: ClipRow, encoding, callback) {
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
    transform(chunk: ClipRow, encoding, callback) {
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
) =>
  TE.tryCatch(async () => {
    const { conn, stream } = streamingQuery(
      fs.readFileSync(path.join(getQueriesDir(), 'bundleLocale.sql'), {
        encoding: 'utf-8',
      }),
      [includeClipsFrom, includeClipsUntil, locale],
    )

    const writeStream = fs.createWriteStream(clipsTmpPath)

    console.log('Start streaming query result')

    await pipeline(
      stream,
      stringify({ header: true, delimiter: '\t' }),
      writeStream,
    )

    console.log(
      `Query result for ${locale} finished streaming. Closing DB connection.`,
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

const copyExistingClipsFromPrevRelease = (
  tmpClipsFilepath: string,
  releaseDirPath: string,
  previousReleaseName: string,
) =>
  TE.tryCatch(async () => {
    const clips: ClipRow[] = []
    const parser = parse({
      columns: true,
      delimiter: '\t',
    })

    parser.on('data', (chunk: ClipRow) => {
      clips.push(chunk)
    })

    await pipeline(fs.createReadStream(tmpClipsFilepath), parser)

    console.log(
      `Copying clips from previous release ${previousReleaseName} ...`,
    )

    for (const clip of clips) {
      const filename = createClipFilename(clip.locale, clip.id)
      const prevReleaseClipPath = path.join(
        getPreviousReleaseClipDir(clip.locale, previousReleaseName),
        filename,
      )

      const currentReleaseClipPath = path.join(
        releaseDirPath,
        clip.locale,
        'clips',
        filename,
      )

      const clipExists = fs.existsSync(prevReleaseClipPath)

      if (clipExists) {
        fs.copyFileSync(prevReleaseClipPath, currentReleaseClipPath)
        fs.unlinkSync(prevReleaseClipPath)
      }
    }

    console.log('Finished copying existing clips from previous release')
  }, logError)

const fetchAllClipsForLocale = (
  tmpClipsFilepath: string,
  locale: string,
  releaseDirPath: string,
): TE.TaskEither<Error, void> =>
  TE.tryCatch(async () => {
    console.log('Fetching clips for locale', locale)

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

      if (fileSize <= 256) {
        continue
      }
      
      const buffer = await downloadFileFromBucket(CLIPS_BUCKET)(clip.path)()

      if (E.isRight(buffer)) {
        fs.writeFileSync(clipFilepath, buffer.right)
      } else {
        Promise.reject(buffer.left)
      }
    }

    console.log('Finished downloading clips for locale', locale)
  }, logError)

const createClipsTsv = (
  tmpClipsFilepath: string,
  locale: string,
  isMinorityLanguage: boolean,
  releaseDirPath: string,
): TE.TaskEither<Error, void> => {
  console.log('Creating clips.tsv for', locale)

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

const downloadPreviousRelease = (locale: string, prevReleaseName: string) => {
  const tarFilename = generateTarFilename(locale, prevReleaseName)
  const storagePath = `${prevReleaseName}/${tarFilename}`

  const downloadRelease = TE.tryCatch(async () => {
    console.log('Downloading release', storagePath)
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
) => {
  const filename = generateTarFilename(locale, prevReleaseName)
  const filepath = path.join(getTmpDir(), filename)

  if (!fs.existsSync(filepath)) {
    console.log(filepath, `doesn't exist`)
    return TE.right(constVoid())
  }

  return pipe(
    extractTar(filepath, getTmpDir()),
    TE.chain(() => TE.fromIO(rmFilepath(filepath))),
  )
}

export const fetchAllClipsPipeline = (
  type: string,
  locale: string,
  includeClipsFrom: string,
  includeClipsUntil: string,
  isMinorityLanguage: boolean,
  clipsDirPath: string,
  releaseDirPath: string,
  previousReleaseName?: string,
): TE.TaskEither<Error, void> => {
  return pipe(
    TE.Do,
    TE.let('clipsTmpPath', () => getTmpClipsPath(locale)),
    TE.chainFirst(() =>
      previousReleaseName
        ? downloadPreviousRelease(locale, previousReleaseName)
        : TE.right(constVoid()),
    ),
    TE.chainFirst(() =>
      previousReleaseName
        ? extractClipsFromPreviousRelease(locale, previousReleaseName)
        : TE.right(constVoid()),
    ),
    TE.chainFirst(({ clipsTmpPath }) =>
      streamQueryResultToFile(
        clipsTmpPath,
        includeClipsFrom,
        includeClipsUntil,
        locale,
      ),
    ),
    TE.chainFirst(() => TE.fromIO(prepareDir(clipsDirPath))),
    TE.chainFirst(({ clipsTmpPath }) =>
      previousReleaseName
        ? copyExistingClipsFromPrevRelease(
            clipsTmpPath,
            releaseDirPath,
            previousReleaseName,
          )
        : TE.right(constVoid()),
    ),
    TE.chainFirst(({ clipsTmpPath }) =>
      fetchAllClipsForLocale(clipsTmpPath, locale, releaseDirPath),
    ),
    TE.chainFirst(({ clipsTmpPath }) =>
      createClipsTsv(clipsTmpPath, locale, isMinorityLanguage, releaseDirPath),
    ),
    TE.mapLeft(e => {
      console.log(e)
      return e
    }),
    TE.as(constVoid()),
  )
}

export const runFetchAllClipsForLocale = (
  isMinorityLanguage: boolean,
): RTE.ReaderTaskEither<AppEnv, Error, void> => {
  return pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(
      ({
        type,
        locale,
        from,
        until,
        clipsDirPath,
        releaseDirPath,
        previousReleaseName,
      }) =>
        fetchAllClipsPipeline(
          type,
          locale,
          from,
          until,
          isMinorityLanguage,
          clipsDirPath,
          releaseDirPath,
          previousReleaseName,
        ),
    ),
  )
}
