import * as request from 'request-promise-native';
import { LanguageStats, Sentence } from 'common';
import DB from './model/db';
import { DBClip } from './model/db/tables/clip-table';
import lazyCache from './lazy-cache';

const locales = require('locales/all.json') as string[];
const contributableLocales = require('locales/contributable.json') as string[];

// based on the latest dataset
const AVG_CLIP_SECONDS = 4.896;
const AVG_CLIP_SECONDS_PER_LOCALE: { [locale: string]: number } = {
  en: 5.142,
  fa: 4.019,
  fr: 4.983,
  es: 5.036,
  sl: 3.868,
  kab: 3.325,
  cy: 4.828,
  ca: 5.432,
  de: 5.125,
  tt: 3.739,
  ta: 6.218,
  ru: 5.232,
  nl: 4.291,
  it: 5.349,
  eu: 5.187,
  tr: 3.706,
  ar: 4.17,
  'zh-TW': 3.241,
  br: 3.075,
  pt: 4.226,
  eo: 5.371,
  'zh-CN': 5.238,
  id: 4.066,
  ia: 4.176,
  lv: 3.409,
  ja: 4.765,
  rw: 5.008,
  'sv-SE': 3.936,
  cnh: 3.564,
  et: 6.74,
  ky: 4.544,
  ro: 3.957,
  hsb: 6.101,
  el: 4.124,
  cs: 4.319,
  pl: 4.457,
  'rm-sursilv': 5.507,
  'rm-vallader': 5.791,
  mn: 5.468,
  'zh-HK': 4.236,
  ab: 5.127,
  cv: 4.985,
  uk: 4.853,
  mt: 4.736,
  as: 5.304,
  ka: 5.362,
  'fy-NL': 4.977,
  dv: 5.042,
  'pa-IN': 4.802,
  vi: 3.968,
  or: 5.053,
  'ga-IE': 3.527,
  fi: 4.549,
  hu: 4.9,
  th: 4.264,
  lt: 5.156,
  lg: 5.806,
  hi: 4.749,
  bas: 4.403,
  sk: 4,
  kmr: 4.422,
  bg: 5.499,
  kk: 5.022,
  ba: 4.425,
  gl: 4.808,
  ug: 6.032,
  'hy-AM': 6.138,
  be: 4.8,
  ur: 4.19,
  gn: 4.422,
  sr: 2.829,
  uz: 4.022,
  mr: 5.76,
  da: 4.355,
  myv: 5.718,
  'nn-NO': 4.739,
  ha: 4.336,
  ckb: 3.833,
  ml: 4.082,
  mdf: 5.289,
  sw: 5.3,
  sat: 5.087,
  sah: 5.993,
  vot: 2.408,
  az: 5.362,
  mk: 4.973,
  ig: 6.494,
};

const getAvgSecondsPerClip = (locale: string) =>
  AVG_CLIP_SECONDS_PER_LOCALE[locale] || AVG_CLIP_SECONDS;

function fetchLocalizedPercentagesByLocale() {
  return request({
    uri: 'https://pontoon.mozilla.org/graphql?query={project(slug:%22common-voice%22){localizations{totalStrings,approvedStrings,locale{code}}}}',
    method: 'GET',
    json: true,
  }).then(({ data }: any) =>
    data.project.localizations.reduce(
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
  }) {
    await this.db.saveClip(clipData);
  }

  getValidatedHours = lazyCache(
    'validated-hours',
    async () => {
      const english = (await this.db.getValidClipCount(['en']))[0];
      return Math.round(
        ((english ? english.count : 0) * getAvgSecondsPerClip('en')) / 3600
      );
    },
    DAY
  );

  getLanguageStats = lazyCache(
    'language-stats',
    async (): Promise<LanguageStats> => {
      const inProgressLocales = locales.filter(
        locale => !contributableLocales.includes(locale)
      );

      function indexCountByLocale(rows: { locale: string; count: number }[]): {
        [locale: string]: number;
      } {
        return rows.reduce(
          (obj: { [locale: string]: number }, { count, locale }: any) => {
            obj[locale] = count;
            return obj;
          },
          {}
        );
      }

      const [
        localizedPercentages,
        sentenceCounts,
        validClipsCounts,
        speakerCounts,
      ] = await Promise.all([
        fetchLocalizedPercentagesByLocale(),
        this.db
          .getSentenceCountByLocale(inProgressLocales)
          .then(indexCountByLocale),
        this.db
          .getValidClipCount(contributableLocales)
          .then(indexCountByLocale),
        this.db.getSpeakerCount(contributableLocales).then(indexCountByLocale),
      ]);

      return {
        inProgress: inProgressLocales.map(locale => ({
          locale,
          localizedPercentage: localizedPercentages[locale] || 0,
          sentencesCount: sentenceCounts[locale] || 0,
        })),
        launched: contributableLocales.map(locale => ({
          locale,
          seconds: Math.floor(
            (validClipsCounts[locale] || 0) * getAvgSecondsPerClip(locale)
          ),
          speakers: speakerCounts[locale] || 0,
        })),
      };
    },
    DAY
  );

  getClipsStats = lazyCache(
    'overall-clips-stats',
    async (locale: string) =>
      (await this.db.getClipsStats(locale)).map(stat => ({
        ...stat,
        total: Math.round(stat.total * getAvgSecondsPerClip(locale)),
        valid: Math.round(stat.valid * getAvgSecondsPerClip(locale)),
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
