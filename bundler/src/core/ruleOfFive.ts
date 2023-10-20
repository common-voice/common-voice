import fs from 'node:fs'
import path from 'node:path'
import { taskEither as TE } from 'fp-ts'
import { query } from '../infrastructure/database'
import { pipe } from 'fp-ts/lib/function'

type UniqueSpeakersForLocale = {
  name: string
  count: number
}

export const isMinorityLanguage = (
  locale: string
): TE.TaskEither<Error, boolean> =>
  pipe(
    query<UniqueSpeakersForLocale>(
      fs.readFileSync(
        path.join(__dirname, '..', '..', 'queries', 'uniqueSpeakersLocale.sql'),
        { encoding: 'utf-8' }
      ),
      [locale]
    ),
    TE.map((res) => res.count < 5)
  )
