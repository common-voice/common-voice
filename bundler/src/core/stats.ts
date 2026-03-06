import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'

import { calculateChecksum, getFileSize } from '../infrastructure/filesystem'
import { AppEnv } from '../types'
import { uploadToBucket } from '../infrastructure/storage'
import { getDatasetBundlerBucketName } from '../config/config'
import type { Buckets, LocaleReleaseData } from './localeData'
import { logger } from '../infrastructure/logger'

// -- Output types (shape of the uploaded stats JSON) -------------------------

type Stats = {
  locales: Record<string, Locale>
  totalDuration: number
  totalValidDurationSecs: number
  totalHrs: number
  totalValidHrs: number
}

type Splits = {
  accent: Record<string, number>
  age: Record<string, number>
  gender: Record<string, number>
  sentence_domain: Record<string, number>
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

// -- Build Locale from LocaleReleaseData + tar metadata ----------------------

export const buildLocale = (
  data: LocaleReleaseData,
  checksum: string,
  fileSize: number,
): Locale => ({
  buckets: data.buckets,
  duration: data.totalDurationMs,
  reportedSentences: data.reportedSentences,
  validatedSentences: data.validatedSentences,
  unvalidatedSentences: data.unvalidatedSentences,
  clips: data.clips,
  splits: {
    accent: data.accentCounts,
    age: data.ageCounts,
    gender: data.genderCounts,
    sentence_domain: data.domainCounts,
  },
  users: data.speakers,
  size: fileSize,
  checksum,
  avgDurationSecs: data.avgDurationSecs,
  validDurationSecs: data.validDurationSecs,
  totalHrs: data.totalHrs,
  validHrs: data.validHrs,
})

// -- Pipeline ----------------------------------------------------------------

const uploadToDatasetBucket = uploadToBucket(getDatasetBundlerBucketName())

export const statsPipeline = (
  locale: string,
  data: LocaleReleaseData,
  tarFilepath: string,
  releaseName: string,
  license?: string,
) =>
  pipe(
    TE.Do,
    TE.bind('checksum', () => calculateChecksum(tarFilepath)),
    TE.let('fileSize', getFileSize(tarFilepath)),
    TE.map(({ checksum, fileSize }) => {
      const localeStats = buildLocale(data, checksum, fileSize)
      const stats: Stats = {
        locales: { [locale]: localeStats },
        totalDuration: data.totalDurationMs,
        totalValidDurationSecs: data.validDurationSecs,
        totalHrs: data.totalHrs,
        totalValidHrs: data.validHrs,
      }
      return stats
    }),
    TE.chainFirst(stats => {
      // cv-dataset only consumes unlicensed stats. Skip upload for licensed
      // runs to prevent getLocaleFromFilename() collision in createStats.js
      // (both stats_en.json and stats_en_cc-by-4-0.json would resolve to "en").
      if (license) return TE.right<Error, void>(undefined)
      const statsFilename = `stats_${locale}.json`
      return uploadToDatasetBucket(`${releaseName}/stats/${statsFilename}`)(
        Buffer.from(JSON.stringify(stats)),
      )
    }),
  )

export const runStats = (
  tarFilepath: string,
): RTE.ReaderTaskEither<AppEnv, Error, Stats> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ locale, releaseName, license, localeData }) => {
      if (!localeData) {
        return TE.left(
          new Error(`[${locale}] No locale data available for stats`),
        )
      }
      logger.info('STATS', `[${locale}] Building stats from locale data`)
      return statsPipeline(locale, localeData, tarFilepath, releaseName, license)
    }),
  )
