import * as Random from 'random-js';
import DB from './db';
import { DBClipWithVoters } from './db/tables/clip-table';

const CLIP_CACHE_SIZE = 1000;

export class Clip {
  clipid: string;
  userid: string;
  sentenceid: string;
  votes: string[];
  sentencePath: string;
  sentenceText: string;
  clipPath: string;

  constructor(clipid: string, userid: string, sentenceid: string) {
    this.clipid = clipid;
    this.userid = userid;
    this.sentenceid = sentenceid;
    this.votes = [];
  }

  /**
   * Do we have all the necessary information?
   *   Note: we do not need sentenceText, since isComplete is just
   *   to tell us if the clip can be verified or not yet.
   */
  isComplete(): boolean {
    return !!this.userid && !!this.sentencePath && !!this.clipPath;
  }

  /**
   * Do we have enough votes to make a decision.
   */
  isUnverified() {
    return !this.isComplete() || this.votes.length < 3;
  }

  isVerified() {
    if (this.isUnverified()) {
      return false;
    }

    // TODO: implement 2/3 verification check.
    // For now, we do not load the .vote file content, so we don't know
    // if a clip was rejected or verified, just if it has enough votes.
    return false;
  }

  isRejected() {
    if (this.isUnverified()) {
      return false;
    }

    return !this.isVerified();
  }
}

interface ClipList {
  [key: string]: Clip;
}

interface ClipMetrics {
  clips: number;
  votes: number;
  unverified: number;
  verified: number;
  rejected: number;
  submitters: number;
  sentences: number;
}

/**
 * Model for tracking clip information of all files in storage.
 */
export default class Clips {
  db: DB;
  allClips: ClipList;
  unverifiedClips: string[];
  verifiedClips: string[];
  metrics: ClipMetrics;
  loaded: boolean;
  randomEngine: Random.MT19937;
  isMigrated: boolean;

  constructor(db: DB) {
    this.allClips = {};
    this.db = db;
    this.unverifiedClips = [];
    this.verifiedClips = [];
    this.randomEngine = Random.engines.mt19937();
    this.randomEngine.autoSeed();
    this.loaded = false;
    this.isMigrated = false;
  }

  private getClip(userid: string, sentenceid: string): Clip {
    const clipid = `${userid}/${sentenceid}`;
    let clip = this.allClips[clipid];
    if (!clip) {
      clip = new Clip(clipid, userid, sentenceid);
      this.allClips[clipid] = clip;
    }
    return clip;
  }

  /**
   * Checks to see if clip is ready to be verified, or is already verified.
   */
  private processClip(clip: Clip) {
    if (!clip.isComplete()) {
      return;
    }

    const { clipid } = clip;
    if (clip.isUnverified()) {
      if (this.unverifiedClips.indexOf(clipid) === -1) {
        this.unverifiedClips.push(clipid);
      }
    } else {
      // When a clip is verified, move it to the deactive list.
      const i = this.unverifiedClips.indexOf(clipid);
      if (i !== -1) {
        this.unverifiedClips.splice(i, 1);
      }

      if (this.verifiedClips.indexOf(clipid) === -1) {
        this.verifiedClips.push(clipid);
      }
    }
  }

  addClip(userid: string, sentenceid: string, path: string): void {
    let clip = this.getClip(userid, sentenceid);
    clip.clipPath = path;
    this.processClip(clip);
  }

  addVote(userid: string, sentenceid: string, path: string): void {
    let clip = this.getClip(userid, sentenceid);
    clip.votes.push(path);
    this.processClip(clip);
  }

  addSentence(userid: string, sentenceid: string, path: string): void {
    let clip = this.getClip(userid, sentenceid);
    clip.sentencePath = path;
    this.processClip(clip);
  }

  addSentenceContent(userid: string, sentenceid: string, text: string) {
    let clip = this.getClip(userid, sentenceid);
    clip.sentenceText = text;
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
  async getEllibleClip(client_id: string): Promise<DBClipWithVoters | Clip> {
    if (this.isMigrated) {
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
    if (this.unverifiedClips.length === 0) {
      return null;
    }

    let distribution = Random.integer(0, this.unverifiedClips.length - 1);
    let clipid, clip;
    do {
      clipid = this.unverifiedClips[distribution(this.randomEngine)];
      clip = this.allClips[clipid];
    } while (clip.userid === client_id);
    return clip;
  }

  setLoaded() {
    this.metrics = {
      clips: 0,
      votes: 0,
      unverified: 0,
      verified: 0,
      rejected: 0,
      submitters: 0,
      sentences: 0,
    };

    const userCache: any = {};

    Object.keys(this.allClips).forEach((clipid: string) => {
      const clip: Clip = this.allClips[clipid];
      ++this.metrics.clips;
      this.metrics.votes += clip.votes.length;

      if (clip.isUnverified()) {
        ++this.metrics.unverified;
      } else if (clip.isVerified()) {
        ++this.metrics.verified;
      } else if (clip.isRejected()) {
        ++this.metrics.rejected;
      } else {
        console.error('clip in unknown state', clipid);
      }

      if (!userCache[clip.userid]) {
        ++this.metrics.submitters;
        userCache[clip.userid] = true;
      }
    });

    this.loaded = true;
  }

  getCurrentMetrics(): ClipMetrics | null {
    if (!this.loaded) {
      console.error('cannot get clip metrics before loading');
      return null;
    }

    return this.metrics;
  }
}
