import fs from 'node:fs'
import path from 'node:path'
import { Transform } from 'node:stream'
import { streamingQuery } from '../infrastructure/database'
import { streamDownloadFileFromBucket } from '../infrastructure/storage'
import { ClipRow } from '../types'
import { taskEither as TE } from 'fp-ts'
import { hashClientId } from './clients'
import {
  getClipsBucketName,
  getIncludeClipsFrom,
  getIncludeClipsUntil,
  getReleaseBasePath,
} from '../config/config'

const CLIPS_BUCKET = getClipsBucketName()

const TSV_COLUMNS = [
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

const printLn = (text: string) => text + '\n'

const writeFileStreamToTsv = (locale: string) => {
  const writeStream = fs.createWriteStream(
    path.join(getReleaseBasePath(), locale, 'clips.tsv'),
    {
      encoding: 'utf-8',
    },
  )
  writeStream.write(printLn(TSV_COLUMNS.join('\t')))
  return writeStream
}

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
const downloadClips = () =>
  new Transform({
    transform(chunk: ClipRow, encoding, callback) {
      const newFilepath = createClipFilename(chunk.locale, chunk.id)
      const writeStream = fs.createWriteStream(
        path.join(getReleaseBasePath(), chunk.locale, 'clips', newFilepath),
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

export const fetchAllClipsForLocale = (
  locale: string,
  isMinorityLanguage: boolean,
): TE.TaskEither<Error, void> => {
  console.log('Fetching clips for locale', locale)

  return TE.tryCatch(
    () =>
      new Promise<void>((resolve, reject) => {
        const { conn, stream } = streamingQuery(
          fs.readFileSync(
            path.join(__dirname, '..', '..', 'queries', 'bundleLocale.sql'),
            { encoding: 'utf-8' },
          ),
          [getIncludeClipsFrom(), getIncludeClipsUntil(), locale],
        )
        console.log('Start Stream Processing')
        stream
          .pipe(downloadClips())
          .pipe(transformClips(isMinorityLanguage))
          .pipe(writeFileStreamToTsv(locale))
          .on('finish', () => {
            conn.end()
            resolve()
          })
          .on('error', err => reject(err))
      }),
    (reason: unknown) => Error(String(reason)),
  )
}

export const createClipFilename = (locale: string, clipId: string) =>
  `common_voice_${locale}_${clipId}.mp3`

const clipRowToTsvEntry = (row: ClipRow): string =>
  printLn(TSV_COLUMNS.map(key => row[key]).join('\t'))
