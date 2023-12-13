import fs from 'node:fs'
import path from 'node:path'
import { Transform } from 'node:stream'

import tar from 'tar'
import { readerTaskEither as RTE, task as T, taskEither as TE } from 'fp-ts'
import { constVoid, pipe } from 'fp-ts/lib/function'
import { stringify } from 'csv-stringify'

import { streamingQuery } from '../infrastructure/database'
import {
  doesFileExistInBucket,
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
import { prepareDir } from '../infrastructure/filesystem'
import { generateTarFilename } from './compress'

const CLIPS_BUCKET = getClipsBucketName()

export const TSV_COLUMNS = [
  'client_id',
  'path',
  'sentence',
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

      this.push(clipRowToTsvEntry(updatedClipRow), 'utf-8')

      callback()
    },
    objectMode: true,
  })

/**
 * Downloads the clips as they come in and saves them in clips
 * directory: `releaseName/locale/clips/`. Passes the unaltered result
 * from the previous stream to the next.
 *
 * @remarks
 *
 * The stream is in object mode.
 */
const downloadClips = (releaseDirPath: string) => {
  return new Transform({
    transform(chunk: ClipRow, encoding, callback) {
      const clipFilename = createClipFilename(chunk.locale, chunk.id)
      const writeStream = fs.createWriteStream(
        path.join(releaseDirPath, chunk.locale, 'clips', clipFilename),
      )
      process.stdout.write(`Downloading ${clipFilename}\r`)
      streamDownloadFileFromBucket(CLIPS_BUCKET)(chunk.path)
        .pipe(writeStream)
        .on('finish', () => {
          this.push(chunk, encoding)
          callback()
        })
    },
    objectMode: true,
  })
}

const checkClipForExistence = (releaseDirPath: string) => {
  return new Transform({
    transform(chunk: ClipRow, encoding, callback) {
      const clipFilename = createClipFilename(chunk.locale, chunk.id)
      if (
        fs.existsSync(
          path.join(releaseDirPath, chunk.locale, 'clips', clipFilename),
        )
      ) {
        callback()
      } else {
        pipe(
          doesFileExistInBucket(CLIPS_BUCKET)(chunk.path),
          TE.getOrElse(() => T.of(false)),
        )().then(doesExist => {
          if (doesExist) {
            this.push(chunk, encoding)
          } else {
            console.log(`Skipping file ${chunk.path}`)
          }
          callback()
        })
      }
    },
    objectMode: true,
  })
}

const getPreviousReleaseClipDir = (locale: string, prevReleaseName: string) =>
  path.join(getTmpDir(), prevReleaseName, locale, 'clips')

const copyExistingClips = (releaseDirPath: string, prevReleaseName?: string) =>
  new Transform({
    transform(chunk: ClipRow, encoding, callback) {
      if (!prevReleaseName) {
        this.push(chunk, encoding)
        callback()
      } else {
        const filename = createClipFilename(chunk.locale, chunk.id)
        const prevReleaseClipPath = path.join(
          getPreviousReleaseClipDir(chunk.locale, prevReleaseName),
          filename,
        )
        const currentReleaseClipPath = path.join(
          releaseDirPath,
          chunk.locale,
          'clips',
          filename,
        )
        const clipExists = fs.existsSync(prevReleaseClipPath)

        if (clipExists) {
          process.stdout.write(`Copying file ${filename}\r`)
          fs.copyFileSync(prevReleaseClipPath, currentReleaseClipPath)
          fs.unlinkSync(prevReleaseClipPath)
          callback()
        } else {
          this.push(chunk, encoding)
          callback()
        }
      }
    },
    objectMode: true,
  })

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
        this.push(chunk, encoding)
      }

      callback()
    },
    objectMode: true,
  })

const parseClipTsv = () => {
  let headers: string[] = []
  return new Transform({
    transform(chunk, encoding, callback) {
      if (headers.length === 0) {
        headers = String(chunk).trim().split('\t')
      } else {
        const row = String(chunk).trim().split('\t')
        const obj: Record<string, string> = {}
        headers.forEach((item, index) => (obj[item] = row[index]))

        this.push(obj)
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
) =>
  TE.tryCatch(
    () =>
      new Promise<void>((resolve, reject) => {
        const { conn, stream } = streamingQuery(
          fs.readFileSync(path.join(getQueriesDir(), 'bundleLocale.sql'), {
            encoding: 'utf-8',
          }),
          [includeClipsFrom, includeClipsUntil, locale],
        )

        const writeStream = fs.createWriteStream(clipsTmpPath)

        console.log('Start streaming query result')
        stream
          .pipe(stringify({ header: true, delimiter: '\t' }))
          .pipe(writeStream)
          .on('finish', () => {
            console.log(
              `Query result for ${locale} finished streaming. Closing connection.`,
            )
            conn.end()
            resolve()
          })
          .on('error', (err: unknown) => reject(err))
      }),
    (reason: unknown) => Error(String(reason)),
  )

const copyExistingClipsFromPrevRelease = (
  tmpClipsFilepath: string,
  locale: string,
  releaseDirPath: string,
  previousReleaseName?: string,
): TE.TaskEither<Error, void> => {
  console.log(
    'Start copying existing clips from previous release for locale',
    locale,
  )

  return TE.tryCatch(
    () =>
      new Promise<void>((resolve, reject) => {
        const readStream = fs.createReadStream(tmpClipsFilepath)

        readStream
          .pipe(parseClipTsv())
          .pipe(copyExistingClips(releaseDirPath, previousReleaseName))
          .on('finish', () => {
            console.log('Finished copying existing clips from previous release')
            resolve()
          })
          .on('error', (err: unknown) => reject(err))
      }),
    (reason: unknown) => Error(String(reason)),
  )
}

const fetchAllClipsForLocale = (
  tmpClipsFilepath: string,
  locale: string,
  releaseDirPath: string,
): TE.TaskEither<Error, void> => {
  console.log('Fetching clips for locale', locale)

  return TE.tryCatch(
    () =>
      new Promise<void>((resolve, reject) => {
        const readStream = fs.createReadStream(tmpClipsFilepath)

        readStream
          .pipe(parseClipTsv())
          .pipe(checkClipForExistence(releaseDirPath))
          .pipe(downloadClips(releaseDirPath))
          .on('finish', () => {
            console.log('Finished downloading clips for locale', locale)
            resolve()
          })
          .on('error', (err: unknown) => reject(err))
      }),
    (reason: unknown) => Error(String(reason)),
  )
}

const createClipsTsv = (
  tmpClipsFilepath: string,
  locale: string,
  isMinorityLanguage: boolean,
  releaseDirPath: string,
): TE.TaskEither<Error, void> => {
  console.log('Creating clips.tsv for', locale)

  return TE.tryCatch(
    () =>
      new Promise<void>((resolve, reject) => {
        const readStream = fs.createReadStream(tmpClipsFilepath)

        readStream
          .pipe(parseClipTsv())
          .pipe(filterMissingClips(releaseDirPath))
          .pipe(transformClips(isMinorityLanguage))
          .pipe(writeFileStreamToTsv(locale, releaseDirPath))
          .on('finish', () => {
            resolve()
          })
          .on('error', (err: unknown) => reject(err))
      }),
    (reason: unknown) => Error(String(reason)),
  )
}

const downloadPreviousRelease = (locale: string, prevReleaseName?: string) => {
  if (!prevReleaseName) return TE.right(constVoid())

  const tarFilename = generateTarFilename(locale, prevReleaseName)
  const storagePath = `${prevReleaseName}/${tarFilename}`

  const downloadRelease = TE.tryCatch(
    () => {
      console.log('Downloading release', storagePath)
      const writeStream = fs.createWriteStream(
        path.join(getTmpDir(), tarFilename),
      )
      return new Promise<void>((resolve, reject) => {
        streamDownloadFileFromBucket(getDatasetBundlerBucketName())(storagePath)
          .pipe(writeStream)
          .on('finish', () => resolve())
          .on('error', (err: unknown) => reject(err))
      })
    },
    (reason: unknown) => Error(String(reason)),
  )

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
  prevReleaseName?: string,
) => {
  if (!prevReleaseName) return TE.right(constVoid())

  const filename = generateTarFilename(locale, prevReleaseName)
  const filepath = path.join(getTmpDir(), filename)

  if (!fs.existsSync(filepath)) {
    console.log(filepath, `doesn't exist`)
    return TE.right(constVoid())
  }

  console.log('Extracting', filepath)

  return TE.tryCatch(
    () =>
      tar.x(
        {
          cwd: getTmpDir(),
          f: filepath,
        },
        [`${prevReleaseName}/${locale}/clips`],
      ),
    (err: unknown) => {
      console.log(err)
      return Error(String(err))
    },
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
    TE.chainFirst(() => downloadPreviousRelease(locale, previousReleaseName)),
    TE.chainFirst(() =>
      extractClipsFromPreviousRelease(locale, previousReleaseName),
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
      copyExistingClipsFromPrevRelease(
        clipsTmpPath,
        locale,
        releaseDirPath,
        previousReleaseName,
      ),
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
