import fs from 'node:fs'
import path from 'node:path'

import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { parse } from 'csv-parse'
import {
  LineCounts,
  calculateChecksum,
  countLines,
  getFileSize,
} from '../infrastructure/filesystem'
import {
  CORPORA_CREATOR_FILES,
  isCorporaCreatorFile,
} from '../infrastructure/corporaCreator'
import { CLIPS_TSV_ROW } from './clips'
import { AppEnv } from '../types'
import { uploadToBucket } from '../infrastructure/storage'
import { getDatasetBundlerBucketName } from '../config/config'

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
  male_masculine: number
  female_feminine: number
  transgender: number
  'non-binary': number
  do_not_wish_to_say: number
}

type SentenceDomain = {
  '': number
  agriculture_food: number
  automotive_transport: number
  finance: number
  service_retail: number
  general: number
  healthcare: number
  history_law_government: number
  language_fundamentals: number
  media_entertainment: number
  nature_environment: number
  news_current_affairs: number
  technology_robotics: number
}

type Splits = {
  accent: Accent
  age: Age
  gender: Gender
  sentence_domain: SentenceDomain
}

type Locale = {
  buckets: Buckets
  duration: number
  reportedSentences: number
  validatedSentences: number
  unvalidatedSentences: number
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
      test: 0,
      train: 0,
      validated: 0,
    },
    duration: 0,
    reportedSentences: 0,
    validatedSentences: 0,
    unvalidatedSentences: 0,
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
        male_masculine: 0,
        female_feminine: 0,
        transgender: 0,
        'non-binary': 0,
        do_not_wish_to_say: 0,
      },
      sentence_domain: {
        '': 0,
        agriculture_food: 0,
        automotive_transport: 0,
        finance: 0,
        service_retail: 0,
        general: 0,
        healthcare: 0,
        history_law_government: 0,
        language_fundamentals: 0,
        media_entertainment: 0,
        nature_environment: 0,
        news_current_affairs: 0,
        technology_robotics: 0,
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

const getAllRelevantFilepaths = (
  locale: string,
  releaseDirPath: string,
): string[] => {
  const ccFiles = CORPORA_CREATOR_FILES.map(entry =>
    path.join(releaseDirPath, locale, entry),
  )
  const sentenceFiles = [
    'reported.tsv',
    'validated_sentences.tsv',
    'unvalidated_sentences.tsv',
  ].map(filename => path.join(releaseDirPath, locale, filename))

  return [...ccFiles, ...sentenceFiles]
}

const mapLineCountsToStats = (
  obj: LineCounts,
): {
  buckets: Buckets
  reportedSentences: number
  validatedSentences: number
  unvalidatedSentences: number
} => {
  const buckets = Object.entries(obj).reduce((acc, [key, value]) => {
    if (!isCorporaCreatorFile(key)) return acc

    const newKey = key.replace('.tsv', '')
    // Remove the line count for the header
    const newValue = value - 1
    return { ...acc, [newKey]: newValue }
  }, {} as Buckets)

  const reportedSentences = Number(obj['reported.tsv']) - 1
  const validatedSentences = Number(obj['validated_sentences.tsv']) - 1
  const unvalidatedSentences = Number(obj['unvalidated_sentences.tsv']) - 1

  return {
    buckets,
    reportedSentences,
    validatedSentences,
    unvalidatedSentences,
  }
}

const mergeStats = (
  locale: string,
  stats: Stats,
  statCounts: Pick<
    Locale,
    | 'buckets'
    | 'reportedSentences'
    | 'validatedSentences'
    | 'unvalidatedSentences'
  >,
  checksum: string,
  size: number,
) => {
  stats.locales[locale].buckets = statCounts.buckets
  stats.locales[locale].reportedSentences = statCounts.reportedSentences
  stats.locales[locale].validatedSentences = statCounts.validatedSentences
  stats.locales[locale].unvalidatedSentences = statCounts.unvalidatedSentences
  stats.locales[locale].checksum = checksum
  stats.locales[locale].size = size
  return stats
}

const extractSentenceDomains = (str: string): Array<keyof SentenceDomain> =>
  str.split(',') as Array<keyof SentenceDomain>

const extractStatsFromClipsFile = (locale: string, releaseDirPath: string) =>
  TE.tryCatch(
    () =>
      new Promise<Stats>(resolve => {
        const fileStream = fs.createReadStream(
          path.join(releaseDirPath, locale, 'clips.tsv'),
        )

        const parser = parse({ delimiter: '\t', columns: true, quote: false })
        const stats = {
          locales: {},
        } as Stats
        const clientSet = new Set()
        const initialLocale = createEmptyLocale()

        fileStream
          .pipe(parser)
          .on('data', (data: CLIPS_TSV_ROW) => {
            const sentenceDomains = extractSentenceDomains(data.sentence_domain)
            clientSet.add(data.client_id)
            initialLocale.clips++
            initialLocale.splits.age[data.age as keyof Age]++
            initialLocale.splits.gender[data.gender as keyof Gender]++

            sentenceDomains.forEach(
              domain => initialLocale.splits.sentence_domain[domain]++,
            )
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
const calculateDurations =
  (locale: string) =>
  (totalDurationInMs: number) =>
  (stats: Stats): Stats => {
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

export const statsPipeline = (
  locale: string,
  totalDurationInMs: number,
  tarFilepath: string,
  releaseDirPath: string,
  releaseName: string,
) =>
  pipe(
    TE.Do,
    TE.let('filepaths', () => getAllRelevantFilepaths(locale, releaseDirPath)),
    TE.bind('lineCounts', ({ filepaths }) => countLines(filepaths)),
    TE.let('statCounts', ({ lineCounts }) => mapLineCountsToStats(lineCounts)),
    TE.bind('stats', () => extractStatsFromClipsFile(locale, releaseDirPath)),
    TE.bind('checksum', () => calculateChecksum(tarFilepath)),
    TE.let('fileSize', getFileSize(tarFilepath)),
    TE.map(({ stats, statCounts, checksum, fileSize }) =>
      mergeStats(locale, stats, statCounts, checksum, fileSize),
    ),
    TE.map(calculateDurations(locale)(totalDurationInMs)),
    TE.bindTo('stats'),
    TE.chainFirst(({ stats }) =>
      uploadToBucket(getDatasetBundlerBucketName())(
        `${releaseName}/stats/stats_${locale}.json`,
      )(Buffer.from(JSON.stringify(stats))),
    ),
    TE.map(({ stats }) => stats),
  )

export const runStats = (
  totalDurationInMs: number,
  tarFilepath: string,
): RTE.ReaderTaskEither<AppEnv, Error, Stats> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ locale, releaseDirPath, releaseName }) =>
      statsPipeline(
        locale,
        totalDurationInMs,
        tarFilepath,
        releaseDirPath,
        releaseName,
      ),
    ),
  )
