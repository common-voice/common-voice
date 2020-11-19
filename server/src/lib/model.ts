import * as request from 'request-promise-native';
import { LanguageStats, Sentence } from 'common';
import DB from './model/db';
import { DBClipWithVoters } from './model/db/tables/clip-table';
import lazyCache from './lazy-cache';

const locales = require('locales/all.json') as string[];
const contributableLocales = require('locales/contributable.json') as string[];

// based on the latest dataset
const AVG_CLIP_SECONDS = 4.695;
const AVG_CLIP_SECONDS_PER_LOCALE: { [locale: string]: number } = {
  en: 4.875,
  de: 4.88,
  fr: 4.835,
  cy: 4.67,
  br: 2.994,
  cv: 4.868,
  tr: 3.905,
  tt: 3.721,
  ky: 4.651,
  'ga-IE': 3.39,
  kab: 3.311,
  ca: 5.345,
  'zh-TW': 3.213,
  sl: 3.925,
  it: 5.57,
  nl: 3.92,
  cnh: 3.563,
  eo: 5.517,
  et: 6.673,
  fa: 4.051,
  eu: 5.141,
  es: 4.924,
  'zh-CN': 5.608,
  mn: 5.445,
  sah: 5.979,
  dv: 5.464,
  rw: 5.263,
  'sv-SE': 3.137,
  ru: 5.479,
  id: 3.864,
  ar: 3.683,
  ta: 4.171,
  ia: 4.056,
  pt: 4.423,
  lv: 3.391,
  ja: 4.313,
  vot: 2.396,
  ab: 6.645,
  'zh-HK': 4.822,
  'rm-sursilv': 5.501,
  hsb: 6.097,
  ro: 3.959,
  'fy-NL': 5.013,
  cs: 4.014,
  el: 4.153,
  'rm-vallader': 5.631,
  pl: 4.307,
  as: 5.266,
  uk: 4.791,
  mt: 4.72,
  ka: 5.727,
  'pa-IN': 4.778,
  or: 5.105,
  vi: 4.18,
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
    'clips-stats',
    async (locale: string) =>
      (await this.db.getClipsStats(locale)).map(stat => ({
        ...stat,
        total: Math.round(stat.total * getAvgSecondsPerClip(locale)),
        valid: Math.round(stat.valid * getAvgSecondsPerClip(locale)),
      })),
    DAY
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
