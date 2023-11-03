import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import util from 'node:util'

import { taskEither as TE, array as A, record as R } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { parse } from 'csv-parse'
import { LineCounts, countLines } from '../infrastructure/filesystem'
import { CorporaCreaterFiles } from '../infrastructure/corporaCreator'
import { getReleaseBasePath } from '../config/config'
import { CLIPS_TSV_ROW } from './clips'

type Stats = {
  locales: Locales
  totalDuration: number
  totalValidDurationSecs: number
  totalHrs: number
  totalValidHrs: number
}

type Locales = Record<string, Locale>

type Buckets = {
  dev: number
  invalidated: number
  other: number
  reported: number
  test: number
  train: number
  validated: number
}

type Accent = Record<string, number>

type Age = {
  '': number
  twenties: number
  thirties: number
  teens: number
  fourties: number
  fifties: number
  sixties: number
  seventies: number
  eighties: number
  nineties: number
}

type Gender = {
  '': number
  male: number
  female: number
  other: number
}

type Splits = {
  accent: Accent
  age: Age
  gender: Gender
}

type Locale = {
  buckets: Buckets
  duration: number
  reportedSentences: number
  clips: number
  splits: Splits
  users: number
  size: number
  checksum: string
  avgDurationSecs: number
  validDurationSecs: number
  totalHrs: number
  validHrs: number
}

const createEmptyLocale = (): Locale => {
  return {
    buckets: {
      dev: 0,
      invalidated: 0,
      other: 0,
      reported: 0,
      test: 0,
      train: 0,
      validated: 0,
    },
    duration: 0,
    reportedSentences: 0,
    clips: 0,
    splits: {
      accent: {},
      age: {
        '': 0,
        twenties: 0,
        thirties: 0,
        teens: 0,
        fourties: 0,
        fifties: 0,
        sixties: 0,
        seventies: 0,
        eighties: 0,
        nineties: 0,
      },
      gender: {
        '': 0,
        male: 0,
        female: 0,
        other: 0,
      },
    },
    users: 0,
    size: 0,
    checksum: '',
    avgDurationSecs: 0,
    validDurationSecs: 0,
    totalHrs: 0,
    validHrs: 0,
  }
}

const getAllRelevantFilepaths = (locale: string): string[] =>
  CorporaCreaterFiles.map(entry =>
    path.join(getReleaseBasePath(), locale, entry),
  )

const mapLineCountsToBuckets = (obj: LineCounts): Buckets =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = key.replace('.tsv', '')
    // Remove the line count for the header
    const newValue = value - 1
    return { ...acc, [newKey]: newValue }
  }, {} as Buckets)

const mergeBucketsIntoStats = (
  locale: string,
  stats: Stats,
  buckets: Buckets,
) => {
  stats.locales[locale].buckets = buckets
  return stats
}
const extractStatsFromClipsFile = (locale: string) =>
  TE.tryCatch(
    () =>
      new Promise<Stats>(resolve => {
        const fileStream = fs.createReadStream(
          path.join(getReleaseBasePath(), locale, 'clips.tsv'),
        )

        const parser = parse({ delimiter: '\t', columns: true })
        const stats = {
          locales: {},
        } as Stats
        const clientSet = new Set()
        const initialLocale = createEmptyLocale()

        fileStream
          .pipe(parser)
          .on('data', (data: CLIPS_TSV_ROW) => {
            clientSet.add(data.client_id)
            initialLocale.clips++
            initialLocale.splits.age[data.age as keyof Age]++
            initialLocale.splits.gender[data.gender as keyof Gender]++
          })
          .on('finish', () => {
            stats.locales[locale] = initialLocale
            stats.locales[locale].users = clientSet.size
            resolve(stats)
          })
      }),
    reason => Error(String(reason)),
  )
  
const unitToHours = (
  duration: number,
  unit: 'ms' | 's' | 'min',
  sigDig: number,
) => {
  let perHr = 1
  const sigDigMultiplier = 10 ** sigDig

  switch (unit) {
    case 'ms':
      perHr = 60 * 60 * 1000
      break
    case 's':
      perHr = 60 * 60
      break
    case 'min':
      perHr = 60
      break
    default:
      perHr = 1
      break
  }

  return Math.floor((duration / perHr) * sigDigMultiplier) / sigDigMultiplier
}
const calculateDurations = (
  locale: string,
  totalDurationInMs: number,
  stats: Stats,
) => {
  const localeStats = stats.locales[locale]
  const validClips = localeStats.buckets.validated

  localeStats.duration = totalDurationInMs
  localeStats.avgDurationSecs =
    Math.round(localeStats.duration / localeStats.clips) / 1000
  localeStats.validDurationSecs =
    Math.round((localeStats.duration / localeStats.clips) * validClips) / 1000

  localeStats.totalHrs = unitToHours(localeStats.duration, 'ms', 2)
  localeStats.validHrs = unitToHours(localeStats.validDurationSecs, 's', 2)

  stats.locales[locale] = localeStats

  return stats
}

export const runStats = (locale: string, totalDurationInMs: number) =>
  pipe(
    TE.Do,
    TE.let('filepaths', () => getAllRelevantFilepaths(locale)),
    TE.bind('lineCounts', ({ filepaths }) => countLines(filepaths)),
    TE.let('buckets', ({ lineCounts }) => mapLineCountsToBuckets(lineCounts)),
    TE.bind('stats', () => extractStatsFromClipsFile(locale)),
    TE.map(({ stats, buckets }) =>
      mergeBucketsIntoStats(locale, stats, buckets),
    ),
    TE.map(stats => calculateDurations(locale, totalDurationInMs, stats)),
    TE.tap(stats => TE.of(console.log(util.inspect(stats, { depth: 5 })))),
  )
