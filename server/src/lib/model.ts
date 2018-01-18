import DB from './model/db';
import { CommonVoiceConfig } from '../config-helper';
import { DBClipWithVoters } from './model/db/tables/clip-table';
import * as Random from 'random-js';

type FetchFunction<T> = (count: number) => T[] | Promise<T[]>;

class Cache<T> {
  private items: T[] = [];
  private size: number;
  private fetchMore: FetchFunction<T>;
  private isRefilling = false;
  private randomEngine = Random.engines.mt19937().autoSeed();

  constructor(fetchMore: FetchFunction<T>, size = 1000) {
    this.fetchMore = fetchMore;
    this.size = size;
  }

  async getAll(): Promise<T[]> {
    if (this.items.length == 0) await this.refill();
    return this.items;
  }

  async getSome(count: number): Promise<T[]> {
    return (await this.getAll()).splice(0, count);
  }

  take(index: number): T {
    return this.items.splice(index, 1)[0];
  }

  private async refill() {
    if (this.isRefilling) return;
    this.isRefilling = true;
    this.items = this.items.concat(
      Random.shuffle(this.randomEngine, await this.fetchMore(this.size))
    );
    this.isRefilling = false;
  }
}

/**
 * The Model loads all clip and user data into memory for quick access.
 */
export default class Model {
  config: CommonVoiceConfig;
  db: DB;
  clipCache = new Cache(count => this.db.findClipsWithFewVotes(count));
  sentenceCache = new Cache(count => this.db.getSentencesWithFewClips(count));

  constructor(config: CommonVoiceConfig) {
    this.config = config;
    this.db = new DB(this.config);
  }

  /**
   * Fetch a random clip but make sure it's not the user's.
   */
  async getEllibleClip(client_id: string): Promise<DBClipWithVoters> {
    const clips = await this.clipCache.getAll();
    const i = clips.findIndex(
      clip => clip.client_id !== client_id && !clip.voters.includes(client_id)
    );
    if (i == -1) return null;

    return this.clipCache.take(i);
  }

  async getRandomSentences(count: number) {
    return this.sentenceCache.getSome(count);
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
