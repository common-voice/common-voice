import fs from 'node:fs'
import path from 'node:path'
import { streamingQuery } from '../infrastructure/database'
import { Transform } from 'node:stream'
import { ClipRow } from '../types'
import { taskEither as TE } from 'fp-ts'
import { hashClientId } from './clients'

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
  const writeStream = fs.createWriteStream(`clips_${locale}.tsv`, {
    encoding: 'utf-8',
  })
  writeStream.write(printLn(TSV_COLUMNS.join('\t')))
  return writeStream
}

/**
 * Transforms the mysql object stream into a stream of strings.
 *
 * @remarks
 *
 * The streamingQuery's stream should be piped immediately into
 * this transform stream, so it can be piped into other streams
 * that are not in object mode.
 */
const transformClips = (locale: string, isMinorityLanguage: boolean) =>
  new Transform({
    transform(chunk: ClipRow, encoding, callback) {
      const filename = createClipFilename(locale, chunk.id)

      const updatedClipRow = {
        ...chunk,
        sentence: chunk.sentence.replace(/\s/gi, ' '),
        client_id: hashClientId(chunk.client_id),
        path: filename,
        gender: isMinorityLanguage ? '' : chunk.gender,
        age: isMinorityLanguage ? '' : chunk.age
      }
      
      this.push(clipRowToTsvEntry(updatedClipRow), 'utf-8')

      callback()
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
        const stream = streamingQuery(
          fs.readFileSync(
            path.join(__dirname, '..', '..', 'queries', 'bundleLocale.sql'),
            { encoding: 'utf-8' },
          ),
          ['2023-10-20 00:00:00', locale],
        )

        stream
          .pipe(transformClips(locale, isMinorityLanguage))
          .pipe(writeFileStreamToTsv(locale))
          .on('finish', () => resolve())
          .on('error', err => reject(err))
      }),
    (reason: unknown) => Error(String(reason)),
  )
}

export const createClipFilename = (locale: string, clipId: string) =>
  `common_voice_${locale}_${clipId}.mp3`

const clipRowToTsvEntry = (row: ClipRow): string =>
  printLn(TSV_COLUMNS.map(key => row[key]).join('\t'))
