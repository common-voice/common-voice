import * as request from 'request-promise-native';
import { LanguageStats } from 'common/language-stats';
import DB, { Sentence } from './model/db';
import { DBClipWithVoters } from './model/db/tables/clip-table';
import {
  IDEAL_SPLIT,
  randomBucketFromDistribution,
  rowsToDistribution,
  Split,
} from './model/split';
import { getConfig } from '../config-helper';
import lazyCache from './lazy-cache';
import omit = require('lodash.omit');

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

function omitClientId(rows: any[]) {
  return rows.map(row => omit(row, 'client_id'));
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
  clipDistribution: Split = IDEAL_SPLIT;

  constructor() {
    this.cacheClipDistribution().catch((e: any) => {
      console.error(e);
    });
  }

  cacheClipDistribution = async () => {
    this.clipDistribution = rowsToDistribution(
      await this.db.getClipBucketCounts()
    );
    console.log('clip distribution', JSON.stringify(this.clipDistribution));
  };

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
    const bucket = await this.db.getOrSetUserBucket(
      client_id,
      locale,
      randomBucketFromDistribution(IDEAL_SPLIT)
    );
    return this.db.findSentencesWithFewClips(
      client_id,
      bucket,
      locale,
      Math.min(count, 50)
    );
  }

  /**
   * Update current user
   */
  async syncUser(client_id: string, data: any, sourceURL = ''): Promise<void> {
    const user = await this.db.updateUser(client_id, data);

    const { BASKET_API_KEY } = getConfig();
    if (BASKET_API_KEY && user && user.send_emails && !user.basket_token) {
      const response = await request({
        uri: 'https://basket.mozilla.org/news/subscribe/',
        method: 'POST',
        form: {
          'api-key': BASKET_API_KEY,
          newsletters: 'common-voice',
          format: 'H',
          lang: 'en',
          email: user.email,
          source_url: sourceURL,
          sync: 'Y',
        },
      });
      this.db.updateUser(client_id, {
        ...data,
        basket_token: JSON.parse(response).token,
      });
    }
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
    const bucket = await this.db.saveClip(clipData);
    if (bucket) {
      (this.clipDistribution as any)[bucket]++;
    }
  }

  getValidatedHours = lazyCache(async () => {
    const english = (await this.db.getValidClipCount(['en']))[0];
    return clipCountToHours(english ? english.count : 0);
  }, DAY);

  getLanguageStats = lazyCache(async (): Promise<LanguageStats> => {
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
      this.db.getValidClipCount(contributableLocales).then(indexCountByLocale),
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
        seconds: Math.floor((validClipsCounts[locale] || 0) * AVG_CLIP_SECONDS),
        speakers: speakerCounts[locale] || 0,
      })),
    };
  }, 20 * MINUTE);

  getClipsStats = lazyCache(
    async (locale: string) =>
      (await this.db.getClipsStats(locale)).map(stat => ({
        ...stat,
        total: Math.round(stat.total * AVG_CLIP_SECONDS),
        valid: Math.round(stat.valid * AVG_CLIP_SECONDS),
      })),
    DAY
  );

  getVoicesStats = lazyCache(
    (locale: string) => this.db.getVoicesStats(locale),
    20 * MINUTE
  );

  getContributionStats = lazyCache(
    (locale?: string) => this.db.getContributionStats(locale),
    20 * MINUTE
  );

  getFullClipLeaderboard = lazyCache(async (locale?: string) => {
    return (await this.db.getClipLeaderboard(locale)).map((row, i) => ({
      position: i,
      ...row,
    }));
  }, 60 * MINUTE);

  getFullVoteLeaderboard = lazyCache(async (locale?: string) => {
    return (await this.db.getVoteLeaderboard(locale)).map((row, i) => ({
      position: i,
      ...row,
    }));
  }, 60 * MINUTE);

  getLeaderboard = async ({
    type,
    client_id,
    cursor,
    locale,
  }: {
    type: 'clip' | 'vote';
    client_id: string;
    cursor?: [number, number];
    locale: string;
  }) => {
    const leaderboard = await (type == 'clip'
      ? this.getFullClipLeaderboard
      : this.getFullVoteLeaderboard)(locale);
    if (cursor) {
      return omitClientId(leaderboard.slice(cursor[0], cursor[1]));
    }

    const userIndex = leaderboard.findIndex(row => row.client_id == client_id);
    const userRegion =
      userIndex == -1 ? [] : leaderboard.slice(userIndex - 1, userIndex + 2);
    const partialBoard = [
      ...leaderboard.slice(0, 2 + Math.max(0, 3 - userRegion.length)),
      ...userRegion,
    ];
    return omitClientId(
      partialBoard.filter(
        ({ position }, i) =>
          i == partialBoard.findIndex(row => row.position == position)
      )
    );
  };
}
