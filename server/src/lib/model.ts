import * as request from 'request-promise-native';
import DB, { Sentence } from './model/db';
import { DBClipWithVoters } from './model/db/tables/clip-table';
import {
  IDEAL_SPLIT,
  randomBucketFromDistribution,
  rowsToDistribution,
  Split,
} from './model/split';
import * as path from 'path';
import * as fs from 'fs';
import { getConfig } from '../config-helper';

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
  async syncUser(uid: string, data: any): Promise<void> {
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
}
