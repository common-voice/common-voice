import * as request from 'request-promise-native';
import { LanguageStats } from 'common/language-stats';
import DB, { Sentence } from './model/db';
import { DBClipWithVoters } from './model/db/tables/clip-table';
import lazyCache from './lazy-cache';

const locales = require('locales/all.json') as string[];
const contributableLocales = require('locales/contributable.json') as string[];

const AVG_CLIP_SECONDS = 4.7; // I queried 40 recordings from prod and avg'd them

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

function clipCountToHours(count: number) {
  return Math.round((count * AVG_CLIP_SECONDS) / 3600);
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
    return this.db.findClipsWithFewVotes(
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
    return this.db.findSentencesWithFewClips(
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

  async saveClip(clipData: any) {
    await this.db.saveClip(clipData);
  }

  getValidatedHours = lazyCache(
    'validated-hours',
    async () => {
      const english = (await this.db.getValidClipCount(['en']))[0];
      return clipCountToHours(english ? english.count : 0);
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
            (validClipsCounts[locale] || 0) * AVG_CLIP_SECONDS
          ),
          speakers: speakerCounts[locale] || 0,
        })),
      };
    },
    20 * MINUTE
  );

  getClipsStats = lazyCache(
    'clips-stats',
    async (locale: string) =>
      (await this.db.getClipsStats(locale)).map(stat => ({
        ...stat,
        total: Math.round(stat.total * AVG_CLIP_SECONDS),
        valid: Math.round(stat.valid * AVG_CLIP_SECONDS),
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
