import fs from 'node:fs'
import path from 'node:path'
import { query } from '../infrastructure/database'
import { pipe } from 'fp-ts/lib/function'
import { getQueriesDir } from '../config/config'
import { readerTaskEither as RTE } from 'fp-ts'
import { AppEnv } from '../types'

const MINIMUM_UNIQUE_SPEAKERS = 5

type UniqueSpeakersForLocale = {
  name: string
  count: number
}

const fetchUniqueSpeakersForLocale = (locale: string) =>
  pipe(
    query<UniqueSpeakersForLocale>(
      fs.readFileSync(path.join(getQueriesDir(), 'uniqueSpeakersLocale.sql'), {
        encoding: 'utf-8',
      }),
      [locale],
    ),
  )

export const isMinorityLanguage = (): RTE.ReaderTaskEither<
  AppEnv,
  Error,
  boolean
> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ locale }) => fetchUniqueSpeakersForLocale(locale)),
    RTE.map(res => res.count < MINIMUM_UNIQUE_SPEAKERS),
  )
