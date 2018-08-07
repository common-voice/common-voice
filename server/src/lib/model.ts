import * as request from 'request-promise-native';
import { LanguageStats } from '../../../common/language-stats';
const allLocales = require('../../../locales/all.json') as {
  [locale: string]: string;
};
const contributableLocales = require('../../../locales/contributable.json') as string[];
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
          100 * l.approvedStrings / l.totalStrings
        );
        return obj;
      },
      {}
    )
  );
}

function clipCountToHours(count: number) {
  return Math.round(count * AVG_CLIP_SECONDS / 3600);
}

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
      randomBucketFromDistribution(this.clipDistribution)
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
  async syncUser(uid: string, data: any, sourceURL = ''): Promise<void> {
    const user = await this.db.updateUser(uid, data);

    const { BASKET_API_KEY, PROD } = getConfig();
    if (BASKET_API_KEY && user.send_emails && !user.basket_token) {
      const response = await request({
        uri: `https://basket.${
          PROD ? 'mozilla' : 'allizom'
        }.org/news/subscribe/`,
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
      this.db.updateUser(uid, {
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
  }, 1000 * 60 * 60 * 24);

  getLanguageStats = lazyCache(async (): Promise<LanguageStats> => {
    const inProgressLocales = Object.keys(allLocales).filter(
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
        locale: {
          code: locale,
          name: allLocales[locale],
        },
        localizedPercentage: localizedPercentages[locale] || 0,
        sentencesCount: sentenceCounts[locale] || 0,
      })),
      launched: contributableLocales.map(locale => ({
        locale: {
          code: locale,
          name: allLocales[locale],
        },
        hours: clipCountToHours(validClipsCounts[locale] || 0),
        speakers: speakerCounts[locale] || 0,
      })),
    };
  }, 1000 * 60 * 20);
}
