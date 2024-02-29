import * as request from 'request-promise-native';
import { GenericStatistic, Language, Sentence } from 'common';
import DB from './model/db';
import { DBClip } from './model/db/tables/clip-table';
import lazyCache from './lazy-cache';
import { secondsToHours } from './utils/secondsToHours';

// TODO: Retrieve average clip data from database (datasets/locale_datasets tables)
const AVG_CLIP_SECONDS = 4.694;
const AVG_CLIP_SECONDS_PER_LOCALE: { [locale: string]: number } = {
  en: 5.146,
  eu: 5.19,
  tr: 3.694,
  ar: 4.169,
  'zh-TW': 3.249,
  br: 3.076,
  pt: 4.198,
  eo: 6.068,
  'zh-CN': 5.181,
  id: 4.065,
  ia: 4.178,
  lv: 3.41,
  ja: 4.781,
  rw: 5.008,
  'sv-SE': 3.946,
  cnh: 3.564,
  et: 6.759,
  ky: 4.542,
  ro: 3.961,
  hsb: 6.101,
  el: 4.126,
  cs: 4.332,
  pl: 4.469,
  'rm-sursilv': 5.484,
  'rm-vallader': 5.807,
  mn: 5.475,
  'zh-HK': 4.224,
  ab: 5.125,
  cv: 5.006,
  uk: 4.827,
  mt: 4.737,
  as: 5.307,
  ka: 5.338,
  'fy-NL': 4.977,
  dv: 5.042,
  'pa-IN': 4.826,
  vi: 3.97,
  or: 5.047,
  'ga-IE': 3.527,
  fi: 4.549,
  hu: 4.909,
  th: 4.183,
  lt: 5.156,
  lg: 5.806,
  hi: 4.787,
  bas: 4.429,
  sk: 4.001,
  kmr: 4.423,
  bg: 5.504,
  kk: 5.004,
  ba: 4.426,
  gl: 4.824,
  ug: 6.031,
  'hy-AM': 6.113,
  be: 4.761,
  ur: 4.23,
  gn: 4.38,
  sr: 2.834,
  uz: 4.04,
  mr: 6.149,
  da: 4.323,
  myv: 5.718,
  'nn-NO': 4.512,
  ha: 4.339,
  ckb: 3.791,
  ml: 4.097,
  mdf: 5.285,
  sw: 5.35,
  sat: 4.983,
  tig: 4.112,
  ig: 5.452,
  'nan-tw': 2.679,
  mhr: 4.812,
  bn: 6.222,
  tok: 3.557,
  yue: 4.279,
  sah: 5.996,
  fa: 4.01,
  fr: 4.988,
  es: 5.042,
  sl: 3.851,
  kab: 3.325,
  cy: 4.839,
  ca: 5.592,
  de: 5.14,
  tt: 3.744,
  ta: 6.199,
  ru: 5.172,
  nl: 4.305,
  it: 5.35,
  vot: 2.408,
  az: 5.597,
  mk: 5.028,
};

const getAverageSecondsPerClip = (locale: string) =>
  AVG_CLIP_SECONDS_PER_LOCALE[locale] || AVG_CLIP_SECONDS;

// TODO: Update startup script to save % and retreive from database
function fetchLocalizedPercentagesByLocale(): Promise<any> {
  return request({
    uri: 'https://pontoon.mozilla.org/graphql?query={project(slug:%22common-voice%22){localizations{totalStrings,approvedStrings,locale{code}}}}',
    method: 'GET',
    json: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }).then(({ data }: any) =>
    data.project.localizations.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (obj: { [locale: string]: number }, l: any) => {
        obj[l.locale.code] = Math.round(
          (100 * l.approvedStrings) / l.totalStrings
        );
        return obj;
      },
      {}
    )
  );
}

const MINUTE = 1000 * 60;
const DAY = MINUTE * 60 * 24;

/**
 * The Model loads all clip and user data into memory for quick access.
 */
export default class Model {
  db = new DB();

  /**
   * Fetch a random clip but make sure it's not the user's.
   */
  async findEligibleClips(
    client_id: string,
    locale: string,
    count: number
  ): Promise<DBClip[]> {
    return this.db.findClipsNeedingValidation(
      client_id,
      locale,
      Math.min(count, 50)
    );
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
    );
  }

  /**
   * Ensure the database is properly set up.
   */
  async ensureDatabaseSetup(): Promise<void> {
    await this.db.ensureSetup();
  }

  /**
   * Upgrade to the latest version of the db.
   */
  async performMaintenance(): Promise<void> {
    await this.db.ensureLatest();
  }

  /**
   * Perform any cleanup work to the model before shutting down.
   */
  cleanUp(): void {
    this.db.endConnection();
  }

  async saveClip(clipData: {
    client_id: string;
    localeId: number;
    original_sentence_id: string;
    path: string;
    sentence: string;
    duration: number;
  }) {
    await this.db.saveClip(clipData);
  }

  getLanguages = lazyCache(
    'get-all-languages-with-sentence-count',
    async (): Promise<Language[]> => {
      return await this.db.getLanguages();
    },
    1
  );

  getAllLanguages = lazyCache(
    'get-all-languages-with-metadata',
    async (): Promise<any[]> => {
      const languages = await this.db.getAllLanguages();
      return languages;
    },
    DAY
  );

  getAllDatasets = lazyCache(
    `get-all-datasets-with-release-types`,
    async (releaseType: string): Promise<any[]> => {
      return await this.db.getAllDatasets(releaseType);
    },
    DAY
  );

  getLanguageDatasetStats = lazyCache(
    'get-language-datasets',
    async (languageCode: string) => {
      return await this.db.getLanguageDatasetStats(languageCode);
    },
    DAY
  );

  getAllLanguagesWithDatasets = lazyCache(
    'get-all-languages-datasets',
    async (): Promise<any[]> => {
      return await this.db.getAllLanguagesWithDatasets();
    },
    DAY
  );

  getLocalizedPercentages = lazyCache(
    'get-localized-percentages',
    async (): Promise<any> => fetchLocalizedPercentagesByLocale(),
    DAY
  );

  getLanguageStats = lazyCache(
    'get-all-language-stats',
    async (): Promise<any> => {
      const languages = await this.db.getLanguages();
      const allLanguageIds = languages.map(language => language.id);

      const statsReducer = (langStats: GenericStatistic[]) => {
        return langStats.reduce((obj: any, stat: GenericStatistic) => {
          obj[stat.locale_id] = stat.count;
          return obj;
        }, {});
      };

      const [
        localizedPercentages,
        validClipsCounts,
        speakerCounts,
        allClipsCount,
      ] = await Promise.all([
        this.getLocalizedPercentages(), //translation %, no en
        this.db
          .getValidClipCount(allLanguageIds)
          .then(data => statsReducer(data)),
        this.db
          .getTotalUniqueSpeakerCount(allLanguageIds)
          .then(data => statsReducer(data)),
        this.db
          .getAllClipCount(allLanguageIds)
          .then(data => statsReducer(data)),
      ]);

      // map over every lang in db
      const languageStats = languages.map(lang => {
        const totalSecDur =
          getAverageSecondsPerClip(lang.name) * (allClipsCount[lang.id] || 0);
        const validSecDur =
          getAverageSecondsPerClip(lang.name) *
          (validClipsCounts[lang.id] || 0);

        // default to zero if stats not in db
        const currentLangStat = {
          ...lang,
          localizedPercentage: localizedPercentages[lang.name] || 0,
          recordedHours: secondsToHours(totalSecDur),
          validatedHours: secondsToHours(validSecDur),
          speakersCount: speakerCounts[lang.id] || 0,
          locale: lang.name,
        };
        delete currentLangStat.name;
        return currentLangStat;
      });

      return languageStats;
    },
    DAY / 2
  );

  getClipsStats = lazyCache(
    'overall-clips-stats',
    async (locale: string) =>
      (await this.db.getClipsStats(locale)).map(stat => ({
        ...stat,
        total: Math.round(stat.total * getAverageSecondsPerClip(locale)),
        valid: Math.round(stat.valid * getAverageSecondsPerClip(locale)),
      })),
    DAY / 2
  );

  getVoicesStats = lazyCache(
    'voice-stats',
    (locale: string) => this.db.getVoicesStats(locale),
    20 * MINUTE
  );

  getContributionStats = lazyCache(
    'contribution-stats',
    (locale?: string) => this.db.getContributionStats(locale),
    20 * MINUTE
  );
}
