import DB from './model/db';
import { User } from './model/db/tables/user-table';
import Users from './model/users';
import { default as Clips, Clip } from './model/clips';
import { CommonVoiceConfig } from '../config-helper';

const MP3_EXT = '.mp3';
const TEXT_EXT = '.txt';
const VOTE_EXT = '.vote';
const JSON_EXT = '.json';

/**
 * The Model loads all clip and user data into memory for quick access.
 */
export default class Model {
  config: CommonVoiceConfig;
  db: DB;
  users: Users;
  clips: Clips;
  loaded: boolean;

  constructor(config: CommonVoiceConfig) {
    this.config = config;
    this.db = new DB(this.config);
    this.users = new Users();
    this.clips = new Clips();
    this.loaded = false;
  }

  private addClip(userid: string, sentenceid: string, path: string) {
    this.users.addClip(userid, path);
    this.clips.addClip(userid, sentenceid, path);
  }

  private addVote(
    userid: string,
    sentenceid: string,
    voterid: string,
    path: string
  ) {
    this.users.addListen(voterid);
    this.clips.addVote(userid, sentenceid, path);
  }

  private addSentence(userid: string, sentenceid: string, path: string) {
    this.clips.addSentence(userid, sentenceid, path);
  }

  addSentenceContent(userid: string, sentenceid: string, text: string) {
    this.clips.addSentenceContent(userid, sentenceid, text);
  }

  private addDemographics(userid: string, path: string) {
    this.users.addDemographics(userid, path);
  }

  private print(...args: any[]) {
    args.unshift('MODEL --');
    console.log.apply(console, args);
  }

  printMetrics() {
    const userMetrics = this.users.getCurrentMetrics();
    let totalUsers = userMetrics.users;
    let listeners = userMetrics.listeners;
    let submitters = userMetrics.submitters;

    const clipMetrics = this.clips.getCurrentMetrics();
    let totalClips = clipMetrics.clips;
    let unverified = clipMetrics.unverified;
    let clipSubmitters = clipMetrics.submitters;
    let votes = clipMetrics.votes;

    this.print(totalUsers, ' total users');
    this.print((listeners / totalUsers).toFixed(2), '% users who listen');
    this.print((submitters / totalUsers).toFixed(2), '% users who submit');
    this.print(totalClips, ' total clips');
    this.print(votes, ' total votes');
    this.print(unverified, ' unverified clips');
    this.print(clipSubmitters, ' users with clips (', submitters, ')');
  }

  /**
   * This function extracts the metadata (userid, file type, etc)
   * from filePath, and updates appropriate sub models.
   */
  processFilePath(filePath: string) {
    const dotIndex = filePath.indexOf('.');

    // Filter out any directories.
    if (dotIndex === -1) {
      return;
    }

    // Glob is a path in the form $userid/$sentenceid.
    const glob = filePath.substr(0, dotIndex);
    const ext = filePath.substr(dotIndex);

    let userid, sentenceid;
    [userid, sentenceid] = glob.split('/');

    switch (ext) {
      case TEXT_EXT:
        this.addSentence(userid, sentenceid, filePath);
        break;

      case MP3_EXT:
        this.addClip(userid, sentenceid, filePath);
        break;

      case VOTE_EXT:
        let voterid;
        [sentenceid, voterid] = sentenceid.split('-by-');
        this.addVote(userid, sentenceid, voterid, filePath);
        break;

      case JSON_EXT:
        if (sentenceid !== 'demographic') {
          console.error('unknown json file found', filePath);
          return;
        }
        this.addDemographics(userid, filePath);
        break;

      default:
        console.error('unrecognized file', filePath, ext, dotIndex);
        break;
    }
  }

  processFilePaths(filePaths: string[]) {
    filePaths.forEach(this.processFilePath.bind(this));
  }

  /**
   * Fetch a random clip but make sure it's not the user's.
   */
  getEllibleClip(userid: string): Clip {
    return this.clips.getEllibleClip(userid);
  }

  /**
   * Signals that all the files have been added.
   */
  setLoaded() {
    this.users.setLoaded();
    this.clips.setLoaded();

    // Print Model status.
    const userMetrics = this.users.getCurrentMetrics();
    let users = userMetrics.users;
    const clipMetrics = this.clips.getCurrentMetrics();
    let clips = clipMetrics.clips;
    let votes = clipMetrics.votes;
    this.print(`${clips} clips, ${users} users, ${votes} votes`);

    this.loaded = true;
  }

  /**
   * Update current user
   */
  async syncUser(uid: string, data: User.UpdatableFields): Promise<void> {
    return this.db.updateUser(uid, data);
  }

  /**
   * Print the current count of users in db.
   */
  async printUserCount(): Promise<void> {
    const count = await this.db.getUserCount();
    this.print('db user count', count);
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
