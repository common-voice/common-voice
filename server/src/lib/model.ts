import DB from './model/db';
import { default as Clips } from './model/clips';
import { CommonVoiceConfig } from '../config-helper';
import { DBClipWithVoters } from './model/db/tables/clip-table';

/**
 * The Model loads all clip and user data into memory for quick access.
 */
export default class Model {
  config: CommonVoiceConfig;
  db: DB;
  clips: Clips;

  constructor(config: CommonVoiceConfig) {
    this.config = config;
    this.db = new DB(this.config);
    this.clips = new Clips(this.db);
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
    this.print((submitters / totalUserClients).toFixed(2), '% users who submit');
    this.print(totalClips, ' total clips');
    this.print(votes, ' total votes');
    this.print(unverified, ' unverified clips');
  }

  /**
   * Fetch a random clip but make sure it's not the user's.
   */
  getEllibleClip(client_id: string): Promise<DBClipWithVoters> {
    return this.clips.getEllibleClip(client_id);
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
