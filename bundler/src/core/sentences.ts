import fs from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { Transform } from 'node:stream'
import path from 'node:path'

import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { streamingQuery } from '../infrastructure/database'
import { getQueriesDir } from '../config/config'
import { stringify } from 'csv-stringify'
import { AppEnv } from '../types'
import { pipe } from 'fp-ts/lib/function'

type ValidatedSentence = {
  sentence_id: string
  sentence: string
  sentence_domain: string
  source: string
  is_used: string
  clips_count: string
}

type UnvalidatedSentence = {
  sentence_id: string
  sentence: string
  sentence_domain: string
  source: string
}

const logError = (err: unknown) => {
  console.log(err)
  return Error(String(err))
}

const replaceWhitespaces = () =>
  new Transform({
    transform(chunk: { sentence: string }, encoding, callback) {
      const updatedClipRow = {
        ...chunk,
        sentence: chunk.sentence.replace(/\s/gi, ' '),
      }

      callback(null, updatedClipRow)
    },
    objectMode: true,
  })

const fetchSentences =
  (validated: boolean) => (releaseDirPath: string) => (locale: string) =>
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
        [locale],
      )

      const writeStream = fs.createWriteStream(
        path.join(releaseDirPath, locale, filename),
      )

      console.log('Start streaming sentences result')

      await pipeline(
        stream,
        replaceWhitespaces(),
        stringify({ header: true, delimiter: '\t' }),
        writeStream,
      )

      console.log(
        `Sentences for ${locale} finished streaming. Closing DB connection.`,
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

export const runFetchSentencesForLocale = (): RTE.ReaderTaskEither<
  AppEnv,
  Error,
  void
> => {
  return pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ locale, releaseDirPath }) =>
      pipe(
        TE.Do,
        TE.chain(() => fetchSentences(true)(releaseDirPath)(locale)),
        TE.chain(() => fetchSentences(false)(releaseDirPath)(locale)),
      ),
    ),
  )
}
