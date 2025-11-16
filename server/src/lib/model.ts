import * as request from 'request-promise-native'
import { GenericStatistic, LanguageData, Sentence, TimeUnits } from 'common'
import DB, { getLocaleId } from './model/db'
import { DBClip } from './model/db/tables/clip-table'
import lazyCache from './lazy-cache'
import { secondsToHours } from './utils/secondsToHours'
import { fetchUserClientVariants } from '../application/repository/user-client-variants-repository'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as Id from 'fp-ts/Identity'
import { isVariantPreferredOption } from '../core/variants/user-client-variant'
import { getUserClientVariantClipsQueryHandler } from '../application/clips/use-case/query-handler/get-user-client-variant-clips-query-handler'
import {
  fetchClipsThatUserInteractedWithFromDB,
  fetchVariantClipsFromDB,
} from '../application/repository/clips-repository'

const AVG_CLIP_SECONDS = 4.694

type PontoonLocale = {
  locale: {
    code: string
    name: string
  }
  total_strings: number
  approved_strings: number
  pretranslated_strings: number
  strings_with_warnings: number
  strings_with_errors: number
  missing_strings: number
  unreviewed_strings: number
  complete: boolean
}

async function fetchLocalizedPercentagesByLocale(): Promise<any> {
  try {
    const projectData = await request({
      uri: 'https://pontoon.mozilla.org/api/v2/projects/common-voice/',
      method: 'GET',
      json: true,
    })

    const localeData: PontoonLocale[] = projectData.localizations

    return localeData.reduce(
      (obj: { [locale: string]: number }, localization: PontoonLocale) => {
        obj[localization.locale.code] = Math.round(
          (100 * localization.approved_strings) / localization.total_strings
        )
        return obj
      },
      {}
    )
  } catch (error) {
    console.error(
      'Error fetching from Pontoon for localized percentages:',
      error
    )
    return {}
  }
}

/**
 * The Model loads all clip and user data into memory for quick access.
 */
export default class Model {
  db = new DB()

  /**
   * Fetch a random clip but make sure it's not the user's.
   */
  async findEligibleClips(
    client_id: string,
    locale: string,
    count: number,
    ignoreClientVariant: boolean
  ): Promise<DBClip[]> {
    const localeId = await getLocaleId(locale)

    const clientPrefersVariant =
      !ignoreClientVariant &&
      (await pipe(
        client_id,
        fetchUserClientVariants,
        TE.map(ucvs => isVariantPreferredOption(localeId)(ucvs)),
        TE.match(
          () => false,
          res => res
        )
      )())

    if (clientPrefersVariant) {
      const getUserClientVariantClips = pipe(
        getUserClientVariantClipsQueryHandler,
        Id.ap(fetchUserClientVariants),
        Id.ap(fetchVariantClipsFromDB),
        Id.ap(fetchClipsThatUserInteractedWithFromDB)
      )
      const getUserVariantClips = pipe(
        { clientId: client_id, localeId, count },
        getUserClientVariantClips,
        TE.getOrElse(err => {
          console.log(err)
          return T.of([] as DBClip[])
        })
      )
      return getUserVariantClips()
    } else {
      return this.db.findClipsNeedingValidation(
        client_id,
        locale,
        Math.min(count, 50)
      )
    }
  }

  async findEligibleSentences(
    client_id: string,
    locale: string,
    count: number
  ): Promise<Sentence[]> {
    return this.db.findSentencesNeedingClips(
      client_id,
      locale,
      Math.min(count, 50)
    )
  }

  /**
   * Ensure the database is properly set up.
   */
  async ensureDatabaseSetup(): Promise<void> {
    await this.db.ensureSetup()
  }

  /**
   * Upgrade to the latest version of the db.
   */
  async performMaintenance(): Promise<void> {
    await this.db.ensureLatest()
  }

  /**
   * Perform any cleanup work to the model before shutting down.
   */
  cleanUp(): void {
    this.db.endConnection()
  }

  async saveClip(clipData: {
    client_id: string
    localeId: number
    original_sentence_id: string
    path: string
    sentence: string
    duration: number
  }) {
    await this.db.saveClip(clipData)
  }

  getCombinedLanguageData = lazyCache(
    'get-combined-language-data',
    async (): Promise<LanguageData[]> => {
      return await this.db.getCombinedLanguageData()
    },
    6 * TimeUnits.HOUR,
    3 * TimeUnits.MINUTE
  )

  getAllLanguages = lazyCache(
    'get-all-languages-with-metadata',
    async (): Promise<any[]> => {
      const languages = await this.db.getAllLanguages()
      return languages
    },
    TimeUnits.DAY,
    3 * TimeUnits.MINUTE
  )

  getAllDatasets = lazyCache(
    `get-all-datasets-with-release-types`,
    async (releaseType: string): Promise<any[]> => {
      return await this.db.getAllDatasets(releaseType)
    },
    TimeUnits.DAY,
    3 * TimeUnits.MINUTE
  )

  getLanguageDatasetStats = lazyCache(
    'get-language-datasets',
    async (languageCode: string) => {
      return await this.db.getLanguageDatasetStats(languageCode)
    },
    TimeUnits.DAY,
    3 * TimeUnits.MINUTE
  )

  getAllLanguagesWithDatasets = lazyCache(
    'get-all-languages-datasets',
    async (): Promise<any[]> => {
      return await this.db.getAllLanguagesWithDatasets()
    },
    TimeUnits.DAY,
    3 * TimeUnits.MINUTE
  )

  getLocalizedPercentages = lazyCache(
    'get-localized-percentages',
    async (): Promise<any> => fetchLocalizedPercentagesByLocale(),
    TimeUnits.DAY,
    3 * TimeUnits.MINUTE
  )

  getAverageSecondsPerClip = lazyCache(
    'get-average-seconds-per-clip',
    async (locale_id: number): Promise<number> => {
      const { avg_seconds_per_clip } = await this.db.getAverageSecondsPerClip(
        locale_id
      )
      return avg_seconds_per_clip || AVG_CLIP_SECONDS
    },
    12 * TimeUnits.HOUR,
    30 * TimeUnits.MINUTE,
    true // allow stale data
  )

  getLanguageStats = lazyCache(
    'get-all-language-stats',
    async (): Promise<any> => {
      const languages = await this.db.getAllLanguages()
      const allLanguageIds = languages.map(language => language.id)
      const allAverageDurations = await Promise.all(
        languages.map(async lang => {
          const avg_seconds = await this.getAverageSecondsPerClip(lang.id)
          return { ...lang, avg_seconds }
        })
      )

      const statsReducer = (langStats: GenericStatistic[]) => {
        return langStats.reduce((obj: any, stat: GenericStatistic) => {
          obj[stat.locale_id] = stat.count
          return obj
        }, {})
      }

      const languageSentenceCounts = await Promise.all(
        allLanguageIds.map(async id => {
          return await this.db.getLanguageSentenceCounts(id)
        })
      )
      const languageSentenceCountsMap = statsReducer(languageSentenceCounts)

      const [
        localizedPercentages,
        validClipsCounts,
        invalidClipsCounts,
        speakerCounts,
        allClipsCount,
      ] = await Promise.all([
        this.getLocalizedPercentages(), //translation %, no en
        this.db
          .getValidClipCount(allLanguageIds)
          .then(data => statsReducer(data)),
        this.db
          .getInvalidClipCount(allLanguageIds)
          .then(data => statsReducer(data)),
        this.db
          .getTotalUniqueSpeakerCount(allLanguageIds)
          .then(data => statsReducer(data)),
        this.db
          .getAllClipCount(allLanguageIds)
          .then(data => statsReducer(data)),
      ])

      const lastFetched = new Date().toISOString()

      // map over every lang in db
      const languageStats = languages.map(lang => {
        const totalSecDur =
          allAverageDurations.find(d => d.name === lang.name).avg_seconds *
          (allClipsCount[lang.id] || 0)
        const validSecDur =
          allAverageDurations.find(d => d.name === lang.name).avg_seconds *
          (validClipsCounts[lang.id] || 0)
        const invalidSecDur =
          allAverageDurations.find(d => d.name === lang.name).avg_seconds *
          (invalidClipsCounts[lang.id] || 0)

        // default to zero if stats not in db
        const currentLangStat = {
          ...lang,
          localizedPercentage: localizedPercentages[lang.name] || 0,
          recordedHours: secondsToHours(totalSecDur),
          validatedHours: secondsToHours(validSecDur),
          invalidatedHours: secondsToHours(invalidSecDur),
          speakersCount: speakerCounts[lang.id] || 0,
          sentencesCount: {
            targetSentenceCount: lang.target_sentence_count,
            currentCount: languageSentenceCountsMap[lang.id],
          },
          locale: lang.name,
          lastFetched,
        }
        delete currentLangStat.name
        delete currentLangStat.is_translated
        delete currentLangStat.text_direction
        delete currentLangStat.native_name
        delete currentLangStat.target_sentence_count
        return currentLangStat
      })

      return languageStats
    },
    12 * TimeUnits.HOUR,
    30 * TimeUnits.MINUTE
  )

  getClipsStats = lazyCache(
    'overall-clips-stats',
    async (locale: string) => {
      const clipStats = await this.db.getClipsStats(locale)
      const allLanguages = await this.getAllLanguages()
      const localeId = allLanguages.find(l => l.name === locale).id
      return clipStats.map(async stat => ({
        ...stat,
        total: Math.round(
          stat.total * (await this.getAverageSecondsPerClip(localeId))
        ),
        valid: Math.round(
          stat.valid * (await this.getAverageSecondsPerClip(localeId))
        ),
      }))
    },
    12 * TimeUnits.HOUR,
    30 * TimeUnits.MINUTE
  )

  getVoicesStats = lazyCache(
    'voice-stats',
    (locale: string) => this.db.getVoicesStats(locale),
    20 * TimeUnits.MINUTE,
    5 * TimeUnits.MINUTE
  )

  getContributionStats = lazyCache(
    'contribution-stats',
    (locale?: string) => this.db.getContributionStats(locale),
    20 * TimeUnits.MINUTE,
    5 * TimeUnits.MINUTE
  )
}
