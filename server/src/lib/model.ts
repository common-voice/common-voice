const contributableLocales = require('../../../locales/contributable.json') as string[];
import DB, { Sentence } from './model/db';
import { DBClipWithVoters } from './model/db/tables/clip-table';
import {
  IDEAL_SPLIT,
  randomBucketFromDistribution,
  rowsToDistribution,
  Split,
} from './model/split';

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
    return this.db.findClipsWithFewVotes(client_id, locale, count);
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
    return this.db.findSentencesWithFewClips(client_id, bucket, locale, count);
  }

  /**
   * Update current user
   */
  async syncUser(uid: string, data: any): Promise<void> {
    return this.db.updateUser(uid, data);
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
    const clip = await this.db.saveClip(clipData);
    if (clip) {
      this.clipDistribution[clip.bucket]++;
    }
  }
}
