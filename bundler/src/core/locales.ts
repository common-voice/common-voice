import fs from 'node:fs'
import path from 'node:path'
import { pipe } from 'fp-ts/lib/function'
import { query } from '../infrastructure/database'
import { getIncludeClipsFrom, getIncludeClipsUntil } from '../config/config'

export type LocalesWithClips = {
  name: string
}

export const fetchLocalesWithClips = pipe(
  query<[LocalesWithClips]>(
    fs.readFileSync(
      path.join(__dirname, '..', '..', 'queries', 'getAllLocalesWithClips.sql'),
      { encoding: 'utf-8' },
    ),
    [getIncludeClipsFrom(), getIncludeClipsUntil()],
  ),
)
