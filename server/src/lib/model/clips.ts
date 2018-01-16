import * as Random from 'random-js';
import DB from './db';
import { DBClipWithVoters } from './db/tables/clip-table';

const CLIP_CACHE_SIZE = 1000;

/**
 * Model for tracking clip information of all files in storage.
 */
export default class Clips {
  db: DB;
  loaded: boolean;
  randomEngine: Random.MT19937;

  constructor(db: DB) {
    this.db = db;
    this.randomEngine = Random.engines.mt19937();
    this.randomEngine.autoSeed();
    this.loaded = false;
  }

  private clipsWithFewVotes: DBClipWithVoters[] = [];
  private isRefilling = false;
  private async refillClipsWithFewVotes() {
    if (this.isRefilling) return;
    this.isRefilling = true;
    this.clipsWithFewVotes = this.clipsWithFewVotes.concat(
      Random.shuffle(
        this.randomEngine,
        await this.db.findClipsWithFewVotes(CLIP_CACHE_SIZE)
      )
    );
    this.isRefilling = false;
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
}
