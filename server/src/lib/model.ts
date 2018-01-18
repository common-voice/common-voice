import DB from './model/db';
import { CommonVoiceConfig } from '../config-helper';
import { DBClipWithVoters } from './model/db/tables/clip-table';
import * as Random from 'random-js';

const CLIP_CACHE_SIZE = 1000;

/**
 * The Model loads all clip and user data into memory for quick access.
 */
export default class Model {
  config: CommonVoiceConfig;
  db: DB;
  randomEngine: Random.MT19937;

  private clipsWithFewVotes: DBClipWithVoters[] = [];
  private isRefillingClipCache = false;

  constructor(config: CommonVoiceConfig) {
    this.config = config;
    this.db = new DB(this.config);
    this.randomEngine = Random.engines.mt19937();
    this.randomEngine.autoSeed();
  }

  private async refillClipsWithFewVotes() {
    if (this.isRefillingClipCache) return;
    this.isRefillingClipCache = true;
    this.clipsWithFewVotes = this.clipsWithFewVotes.concat(
      Random.shuffle(
        this.randomEngine,
        await this.db.findClipsWithFewVotes(CLIP_CACHE_SIZE)
      )
    );
    this.isRefillingClipCache = false;
  }

  /**
   * Fetch a random clip but make sure it's not the user's.
   */
  async getEllibleClip(client_id: string): Promise<DBClipWithVoters> {
    if (this.clipsWithFewVotes.length == 0)
      await this.refillClipsWithFewVotes();

    const i = this.clipsWithFewVotes.findIndex(
      clip => clip.client_id !== client_id && !clip.voters.includes(client_id)
    );
    if (i == -1) return null;

    const clip = this.clipsWithFewVotes[i];
    this.clipsWithFewVotes.splice(i, 1);
    return clip;
  }

  private print(...args: any[]) {
    args.unshift('MODEL --');
    console.log.apply(console, args);
  }

  async printMetrics() {
    const totalUserClients = await this.db.getClientCount();
    const listeners = await this.db.getListenerCount();
    const submitters = await this.db.getSubmitterCount();

    const totalClips = await this.db.getClipCount();
    const unverified = totalClips - (await this.db.getValidatedClipsCount());
    const votes = await this.db.getVoteCount();

    this.print(totalUserClients, ' total user clients');
    this.print((listeners / totalUserClients).toFixed(2), '% users who listen');
    this.print(
      (submitters / totalUserClients).toFixed(2),
      '% users who submit'
    );
    this.print(totalClips, ' total clips');
    this.print(votes, ' total votes');
    this.print(unverified, ' unverified clips');
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
}
