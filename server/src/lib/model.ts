import * as request from 'request-promise-native';
import { LanguageStats, Sentence } from 'common';
import DB from './model/db';
import { DBClipWithVoters } from './model/db/tables/clip-table';
import lazyCache from './lazy-cache';

const locales = require('locales/all.json') as string[];
const contributableLocales = require('locales/contributable.json') as string[];

// based on the latest dataset
const AVG_CLIP_SECONDS = 4.888;
const AVG_CLIP_SECONDS_PER_LOCALE: { [locale: string]: number } = {
  en: 5.088,
  fa: 4.047,
  fr: 4.96,
  es: 5.019,
  sl: 3.88,
  kab: 3.324,
  cy: 4.802,
  ca: 5.451,
  de: 5.074,
  tt: 3.738,
  ta: 6.174,
  ru: 5.371,
  nl: 4.244,
  it: 5.34,
  eu: 5.144,
  tr: 3.747,
  ar: 4.167,
  'zh-TW': 3.24,
  br: 3.071,
  pt: 4.28,
  eo: 6.042,
  'zh-CN': 5.359,
  id: 4.133,
  ia: 4.152,
  lv: 3.409,
  ja: 4.611,
  rw: 5.036,
  'sv-SE': 3.883,
  cnh: 3.564,
  et: 6.741,
  ky: 4.546,
  ro: 3.889,
  hsb: 6.101,
  el: 4.129,
  cs: 4.315,
  pl: 4.398,
  'rm-sursilv': 5.503,
  'rm-vallader': 5.791,
  mn: 5.471,
  'zh-HK': 4.241,
  ab: 6.418,
  cv: 4.991,
  uk: 4.918,
  mt: 4.75,
  as: 5.307,
  ka: 5.318,
  'fy-NL': 4.976,
  dv: 5.067,
  'pa-IN': 4.803,
  vi: 3.991,
  or: 5.103,
  'ga-IE': 3.481,
  fi: 4.576,
  hu: 4.851,
  th: 4.47,
  lt: 5.163,
  lg: 5.561,
  hi: 4.526,
  bas: 4.4,
  sk: 3.983,
  kmr: 4.423,
  bg: 5.231,
  kk: 4.995,
  ba: 4.427,
  gl: 4.902,
  ug: 5.954,
  'hy-AM': 6.309,
  be: 5.418,
  ur: 4.151,
  gn: 4.484,
  sr: 2.886,
  uz: 5.437,
  sah: 5.993,
  vot: 2.408,
  az: 6.585,
  ha: 4.349,
};

const getAvgSecondsPerClip = (locale: string) =>
  AVG_CLIP_SECONDS_PER_LOCALE[locale] || AVG_CLIP_SECONDS;

function fetchLocalizedPercentagesByLocale() {
  return request({
    uri: 'https://pontoon.mozilla.org/graphql',
    method: 'POST',
    json: true,
    body: {
      query: `{
            project(slug: "common-voice") {
              localizations {
                totalStrings
                approvedStrings
                locale {
                  code
                }
              }
            }
          }`,
      variables: null,
    },
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
  ): Promise<DBClipWithVoters[]> {
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

      function indexCountByLocale(
        rows: { locale: string; count: number }[]
      ): { [locale: string]: number } {
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
