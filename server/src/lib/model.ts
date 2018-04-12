import DB from './model/db';
import { DBClipWithVoters } from './model/db/tables/clip-table';
import Cache from './cache';
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
  clipCache = new Cache(count => this.db.findClipsWithFewVotes(count));
  sentencesCaches: { [bucket: string]: Cache<string> } = Object.keys(
    IDEAL_SPLIT
  ).reduce(
    (obj, bucket) => ({
      ...obj,
      [bucket]: new Cache(count =>
        this.db.findSentencesWithFewClips(bucket, count)
      ),
    }),
    {}
  );
  clipDistribution: Split = {
    train: 0,
    dev: 0,
    test: 0,
  };

  constructor() {
    this.cacheClipDistribution().catch((e: any) => {
      console.error(e);
    });
  }

  cacheClipDistribution = async () => {
    this.clipDistribution = rowsToDistribution(
      await this.db.getClipBucketCounts()
    );
  };

  /**
   * Fetch a random clip but make sure it's not the user's.
   */
  async findEligibleClips(
    client_id: string,
    count: number
  ): Promise<DBClipWithVoters[]> {
    return this.clipCache.takeWhere(
      clip => clip.client_id !== client_id && !clip.voters.includes(client_id),
      count
    );
  }

  async findEligibleSentences(
    client_id: string,
    count: number
  ): Promise<string[]> {
    const user = await this.db.getUserClient(client_id);
    return this.sentencesCaches[user ? user.bucket : 'train'].take(count);
  }

  /**
   * Update current user
   */
  async syncUser(uid: string, data: any): Promise<void> {
    return this.db.updateUser(
      uid,
      data,
      randomBucketFromDistribution(this.clipDistribution)
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
    const clip = await this.db.saveClip(clipData);
    if (clip) {
      this.clipDistribution[clip.bucket]++;
    }
  }
}
