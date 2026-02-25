import * as fs from 'node:fs'
import * as path from 'node:path'
import { pipe } from 'fp-ts/lib/function'
import { query } from '../infrastructure/database'
import { getQueriesDir } from '../config/config'
import { LocaleWithLicense } from '../types'

export type LocalesWithClips = {
  name: string
}

export const fetchLocalesWithClips = (
  includeClipsFrom: string,
  includeClipsUntil: string,
) =>
  pipe(
    query<[LocalesWithClips]>(
      fs.readFileSync(
        path.join(getQueriesDir(), 'getAllLocalesWithClips.sql'),
        { encoding: 'utf-8' },
      ),
      [includeClipsFrom, includeClipsUntil],
    ),
  )

export const fetchLocalesWithLicensedClips = (
  includeClipsFrom: string,
  includeClipsUntil: string,
) =>
  pipe(
    query<[LocaleWithLicense]>(
      fs.readFileSync(
        path.join(getQueriesDir(), 'getLocalesWithLicensedClips.sql'),
        { encoding: 'utf-8' },
      ),
      [includeClipsFrom, includeClipsUntil],
    ),
  )
