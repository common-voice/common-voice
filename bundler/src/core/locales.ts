import fs from 'node:fs'
import path from 'node:path'
import { pipe } from 'fp-ts/lib/function'
import { query } from '../infrastructure/database'
import { getIncludeClipsFrom, getIncludeClipsUntil, getQueriesDir } from '../config/config'

export type LocalesWithClips = {
  name: string
}

export const fetchLocalesWithClips = pipe(
  query<[LocalesWithClips]>(
    fs.readFileSync(
      path.join(getQueriesDir(), 'getAllLocalesWithClips.sql'),
      { encoding: 'utf-8' },
    ),
    [getIncludeClipsFrom(), getIncludeClipsUntil()],
  ),
)
