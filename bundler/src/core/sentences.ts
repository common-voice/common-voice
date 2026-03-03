import * as fs from 'node:fs'
import * as path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { Transform } from 'node:stream'

import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { streamingQuery } from '../infrastructure/database'
import { getQueriesDir } from '../config/config'
import { stringify } from 'csv-stringify'
import { AppEnv, ValidatedSentence, UnvalidatedSentence } from '../types'
import { pipe } from 'fp-ts/lib/function'
import { logger } from '../infrastructure/logger'

const logError = (err: unknown) => {
  logger.error('SENTENCES', String(err))
  return Error(String(err))
}

type SentenceRow = ValidatedSentence | UnvalidatedSentence

const replaceWhitespaces = () =>
  new Transform({
    transform(chunk: SentenceRow, _encoding, callback) {
      const updatedRow = {
        ...chunk,
        sentence: chunk.sentence.replace(/\s/gi, ' '),
        source: chunk.source.replace(/\s/gi, ' '),
      }

      callback(null, updatedRow)
    },
    objectMode: true,
  })

const fetchSentences =
  (validated: boolean) =>
  (releaseDirPath: string) =>
  (locale: string, license?: string) =>
    TE.tryCatch(async () => {
      const queryFile = validated
        ? 'getValidatedSentences.sql'
        : 'getUnvalidatedSentences.sql'

      const filename = validated
        ? 'validated_sentences.tsv'
        : 'unvalidated_sentences.tsv'

      const { conn, stream } = streamingQuery(
        fs.readFileSync(path.join(getQueriesDir(), queryFile), {
          encoding: 'utf-8',
        }),
        [locale, license || null, license || null, license || null],
      )

      const writeStream = fs.createWriteStream(
        path.join(releaseDirPath, locale, filename),
      )

      const label = validated ? 'validated' : 'unvalidated'
      logger.info('SENTENCES', `[${locale}] START streaming ${label} sentences`)

      await pipeline(
        stream,
        replaceWhitespaces(),
        stringify({ header: true, delimiter: '\t' }),
        writeStream,
      )

      logger.info('SENTENCES', `[${locale}] FINISH streaming ${label} sentences. Closing DB connection.`)
      const endConnection = () =>
        new Promise<void>((resolve, reject) => {
          conn.end(err => {
            if (err) reject(err)
            resolve()
          })
        })

      await endConnection()
    }, logError)

export const runFetchSentencesForLocale = (): RTE.ReaderTaskEither<
  AppEnv,
  Error,
  void
> => {
  return pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ locale, releaseDirPath, license }) =>
      pipe(
        TE.Do,
        TE.chain(() => fetchSentences(true)(releaseDirPath)(locale, license)),
        TE.chain(() => fetchSentences(false)(releaseDirPath)(locale, license)),
      ),
    ),
  )
}
