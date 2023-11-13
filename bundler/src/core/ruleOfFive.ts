import fs from 'node:fs'
import path from 'node:path'
import { taskEither as TE } from 'fp-ts'
import { query } from '../infrastructure/database'
import { pipe } from 'fp-ts/lib/function'
import { getQueriesDir } from '../config/config'
import * as RTE from 'fp-ts/readerTaskEither'
import { ProcessLocaleJob } from '../types'

const MINIMUM_UNIQUE_SPEAKERS = 5

type UniqueSpeakersForLocale = {
  name: string
  count: number
}

export const isMinorityLanguage = (locale: string): TE.TaskEither<Error, boolean> =>
  pipe(
    query<UniqueSpeakersForLocale>(
      fs.readFileSync(path.join(getQueriesDir(), 'uniqueSpeakersLocale.sql'), {
        encoding: 'utf-8',
      }),
      [locale],
    ),
    TE.map(res => res.count < MINIMUM_UNIQUE_SPEAKERS),
  )

export const isMinorityLanguageE = (): RTE.ReaderTaskEither<
  ProcessLocaleJob,
  Error,
  boolean
> =>
  pipe(
    RTE.ask<ProcessLocaleJob>(),
    RTE.chainTaskEitherK(({ locale }) => isMinorityLanguage(locale)),
  )
