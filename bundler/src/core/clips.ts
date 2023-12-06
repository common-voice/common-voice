import fs from 'node:fs'
import path from 'node:path'
import { Transform } from 'node:stream'
import { streamingQuery } from '../infrastructure/database'
import {
  doesFileExistInBucket,
  streamDownloadFileFromBucket,
} from '../infrastructure/storage'
import { AppEnv, ClipRow } from '../types'
import { task as T, taskEither as TE } from 'fp-ts'
import { hashClientId } from './clients'
import { getClipsBucketName, getQueriesDir } from '../config/config'
import { pipe } from 'fp-ts/lib/function'
import { prepareDir } from '../infrastructure/filesystem'
import { readerTaskEither as RTE } from 'fp-ts'

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
const downloadClips = (releaseDirPath: string) =>
  new Transform({
    transform(chunk: ClipRow, encoding, callback) {
      const newFilepath = createClipFilename(chunk.locale, chunk.id)
      const writeStream = fs.createWriteStream(
        path.join(releaseDirPath, chunk.locale, 'clips', newFilepath),
      )

      streamDownloadFileFromBucket(CLIPS_BUCKET)(chunk.path)
        .pipe(writeStream)
        .on('finish', () => {
          this.push(chunk, encoding)
          callback()
        })
    },
    objectMode: true,
  })

const checkClipForExistence = () =>
  new Transform({
    transform(chunk: ClipRow, encoding, callback) {
      pipe(
        doesFileExistInBucket(CLIPS_BUCKET)(chunk.path),
        TE.getOrElse(() => T.of(false)),
      )().then(doesExist => {
        if (doesExist) {
          this.push(chunk, encoding)
          callback()
        } else {
          console.log(`Skipping file ${chunk.path}`)
          callback()
        }
      })
    },
    objectMode: true,
  })

const fetchAllClipsForLocale = (
  locale: string,
  includeClipsFrom: string,
  includeClipsUntil: string,
  isMinorityLanguage: boolean,
  releaseDirPath: string,
): TE.TaskEither<Error, void> => {
  console.log('Fetching clips for locale', locale)

  return TE.tryCatch(
    () =>
      new Promise<void>((resolve, reject) => {
        const { conn, stream } = streamingQuery(
          fs.readFileSync(path.join(getQueriesDir(), 'bundleLocale.sql'), {
            encoding: 'utf-8',
          }),
          [includeClipsFrom, includeClipsUntil, locale],
        )
        console.log('Start Stream Processing')

        const existingClipsStream = stream
          .pipe(checkClipForExistence())
          .on('finish', () => {
            conn.end()
          })
          .on('error', err => reject(err))

        existingClipsStream  
          .pipe(downloadClips(releaseDirPath))
          .pipe(transformClips(isMinorityLanguage))
          .pipe(writeFileStreamToTsv(locale, releaseDirPath))
          .on('finish', () => {
            resolve()
          })
          .on('error', err => reject(err))
      }),
    (reason: unknown) => Error(String(reason)),
  )
}

export const fetchAllClipsPipeline = (
  locale: string,
  includeClipsFrom: string,
  includeClipsUntil: string,
  isMinorityLanguage: boolean,
  clipsDirPath: string,
  releaseDirPath: string,
): TE.TaskEither<Error, void> => {
  return pipe(
    TE.Do,
    TE.chainFirst(() => TE.fromIO(prepareDir(clipsDirPath))),
    TE.chain(() =>
      fetchAllClipsForLocale(
        locale,
        includeClipsFrom,
        includeClipsUntil,
        isMinorityLanguage,
        releaseDirPath,
      ),
    ),
  )
}

export const runFetchAllClipsForLocale = (
  isMinorityLanguage: boolean,
): RTE.ReaderTaskEither<AppEnv, Error, void> => {
  return pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(
      ({ locale, from, until, clipsDirPath, releaseDirPath }) =>
        fetchAllClipsPipeline(
          locale,
          from,
          until,
          isMinorityLanguage,
          clipsDirPath,
          releaseDirPath,
        ),
    ),
  )
}
