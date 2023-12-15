import fs from 'node:fs'
import path from 'node:path'
import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { streamingQuery } from '../infrastructure/database'
import { getQueriesDir } from '../config/config'
import { Transform } from 'node:stream'
import {
  AppEnv,
  REPORTED_SENTENCES_COLUMNS,
  ReportedSentencesRow,
} from '../types'
import { pipe } from 'fp-ts/lib/function'

const printLn = (text: string) => text + '\n'

const reportedSentencesRowToTsvEntry = (row: ReportedSentencesRow): string =>
  printLn(REPORTED_SENTENCES_COLUMNS.map(key => row[key]).join('\t'))

const transformSentences = () =>
  new Transform({
    transform(chunk: ReportedSentencesRow, encoding, callback) {
      this.push(reportedSentencesRowToTsvEntry(chunk), 'utf-8')

      callback()
    },
    objectMode: true,
  })

const writeFileStreamToTsv = (locale: string, releaseDirPath: string) => {
  const writeStream = fs.createWriteStream(
    path.join(releaseDirPath, locale, 'reported.tsv'),
    {
      encoding: 'utf-8',
    },
  )
  writeStream.write(printLn(REPORTED_SENTENCES_COLUMNS.join('\t')))
  return writeStream
}

const fetchReportedSentencesForLocale =
  (locale: string) =>
  (includeClipsFrom: string) =>
  (includeClipsUntil: string) =>
  (releaseDirPath: string): TE.TaskEither<Error, void> => {
    console.log('Fetching reported sentences for locale', locale)

    return TE.tryCatch(
      () =>
        new Promise<void>((resolve, reject) => {
          const { conn, stream } = streamingQuery(
            fs.readFileSync(
              path.join(getQueriesDir(), 'getReportedSentencesLocale.sql'),
              { encoding: 'utf-8' },
            ),
            [includeClipsFrom, includeClipsUntil, locale],
          )

          stream
            .pipe(transformSentences())
            .pipe(writeFileStreamToTsv(locale, releaseDirPath))
            .on('finish', () => {
              conn.end(err => {
                if (err) reject(err)
                resolve()
              })
            })
            .on('error', (err: unknown) => reject(err))
        }),
      (reason: unknown) => Error(String(reason)),
    )
  }

export const runReportedSentences = (): RTE.ReaderTaskEither<
  AppEnv,
  Error,
  void
> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ locale, from, until, releaseDirPath }) =>
      fetchReportedSentencesForLocale(locale)(from)(until)(releaseDirPath),
    ),
  )
