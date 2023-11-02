import path from 'node:path'

import { taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { LineCounts, countLines } from '../infrastructure/filesystem'
import { CorporaCreaterFiles } from '../infrastructure/corporaCreator'
import { getReleaseBasePath } from '../config/config'

const getAllRelevantFilepaths = (locale: string): string[] =>
  CorporaCreaterFiles.map(entry =>
    path.join(getReleaseBasePath(), locale, entry),
  )

const mapLineCounts = (obj: LineCounts): Record<string, number> =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = key.replace('.tsv', '')
    // Remove the line count for the header
    const newValue = value - 1
    return { ...acc, [newKey]: newValue }
  }, {})

export const runStats = (locale: string) =>
  pipe(
    TE.Do,
    TE.let('filepaths', () => getAllRelevantFilepaths(locale)),
    TE.bind('lineCounts', ({ filepaths }) => countLines(filepaths)),
    TE.let('statsLineCounts', ({ lineCounts }) => mapLineCounts(lineCounts)),
    TE.tap(statsLineCounts => TE.of(console.log(statsLineCounts))),
  )
