import { pick } from 'lodash';
import { CommonVoiceConfig } from '../../config-helper';
import Mysql from './db/mysql';
import Schema from './db/schema';
import Table from './db/table';
import { UserTable } from './db/tables/user-table';
import UserClientTable from './db/tables/user-client-table';
import ClipTable, { DBClipWithVoters } from './db/tables/clip-table';
import VoteTable from './db/tables/vote-table';

export default class DB {
  clip: ClipTable;
  config: CommonVoiceConfig;
  mysql: Mysql;
  schema: Schema;
  user: UserTable;
  userClient: UserClientTable;
  vote: VoteTable;

  constructor(config: CommonVoiceConfig) {
    this.config = config;
    this.mysql = new Mysql(this.config);

    this.clip = new ClipTable(this.mysql);
    this.user = new UserTable(this.mysql);
    this.userClient = new UserClientTable(this.mysql);
    this.vote = new VoteTable(this.mysql);

    this.schema = new Schema(this.mysql, config);
  }

  /**
   * Normalize email address as input.
   * TODO: add validation here.
   */
  private formatEmail(email?: string): string {
    if (!email) {
      return '';
    }

    return email.toLowerCase();
  }

  /**
   * Insert or update user client row.
   */
  async updateUser(client_id: string, fields: any): Promise<void> {
    let { age, accent, email, gender } = fields;
    email = this.formatEmail(email);
    await Promise.all([
      email &&
        this.user.update({
          email,
          ...pick(fields, 'send_emails', 'has_downloaded'),
        }),
      this.userClient.update({ client_id, email, age, accent, gender }),
    ]);
  }

  /**
   * Ensure the database is setup.
   */
  async ensureSetup(): Promise<void> {
    return this.schema.ensure();
  }

  /**
   * I hope you know what you're doing.
   */
  async drop(): Promise<void> {
    if (!this.config.PROD) {
      await this.schema.dropDatabase();
    }
  }

  /**
   * Print the current count of clients in db.
   */
  async getClientCount(): Promise<number> {
    return this.userClient.getCount();
  }

  async getClipCount(): Promise<number> {
    return this.clip.getCount();
  }

  async getVoteCount(): Promise<number> {
    return this.vote.getCount();
  }

  async getListenerCount(): Promise<number> {
    return (await this.mysql.exec(
      `
        SELECT COUNT(DISTINCT user_clients.client_id) AS count
        FROM user_clients
        INNER JOIN votes ON user_clients.client_id = votes.client_id
      `
    ))[0][0].count;
  }

  async getSubmitterCount(): Promise<number> {
    return (await this.mysql.exec(
      `
        SELECT DISTINCT COUNT(DISTINCT user_clients.client_id) AS count
        FROM user_clients
        INNER JOIN clips ON user_clients.client_id = clips.client_id
      `
    ))[0][0].count;
  }

  /**
   * Make sure we have a fully updated schema.
   */
  async ensureLatest(): Promise<void> {
    await this.schema.upgrade();
  }

  /**
   * End connection to the database.
   */
  endConnection(): void {
    this.mysql.endConnection();
  }

  async findClipsWithFewVotes(limit: number): Promise<DBClipWithVoters[]> {
    const [clips] = await this.mysql.exec(
      `
      SELECT clips.*, group_concat(votes.client_id) AS voters
      FROM clips
        LEFT JOIN votes ON clips.id = votes.clip_id
      GROUP BY clips.id
      ORDER BY COUNT(votes.id)
      LIMIT ?
    `,
      [limit]
    );
    for (const clip of clips) {
      clip.voters = clip.voters ? clip.voters.split(',') : [];
    }
    return clips as DBClipWithVoters[];
  }

  async saveVote(glob: string, client_id: string, vote: string) {
    const [
      [row],
    ] = await this.mysql.exec('SELECT id FROM clips WHERE path = ? LIMIT 1', [
      glob,
    ]);
    if (!row) {
      console.error('No clip found for vote', { glob, client_id, vote });
      return;
    }
    await this.mysql.exec(
      `
      INSERT INTO votes (clip_id, client_id, is_valid) VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE is_valid = VALUES(is_valid)
    `,
      [row.id, client_id, vote == 'true' ? 1 : 0]
    );
  }

  async saveClip(
    client_id: string,
    original_sentence_id: string,
    path: string,
    sentence: string
  ) {
    try {
      await this.mysql.exec(
        'INSERT INTO user_clients (client_id) VALUES (?) ON DUPLICATE KEY UPDATE client_id = client_id',
        [client_id]
      );
      await this.mysql.exec(
        'INSERT INTO clips (client_id, original_sentence_id, path, sentence) VALUES (?, ?, ?, ?) ' +
          'ON DUPLICATE KEY UPDATE id = id',
        [client_id, original_sentence_id, path, sentence]
      );
    } catch (e) {
      console.error('No sentence found with id', original_sentence_id, e);
    }
  }

  async getValidatedClipsCount() {
    const [[{ count }]] = await this.mysql.exec(
      `
        SELECT COUNT(*) AS count
        FROM (
            SELECT clips.*
            FROM clips
            LEFT JOIN votes ON clips.id = votes.clip_id AND votes.is_valid
            GROUP BY clips.id
            HAVING COUNT(votes.id) >= 3
        ) AS valid_clips
      `
    );
    return count || 0;
  }

  async insertSentence(id: string, sentence: string) {
    await this.mysql.exec('INSERT INTO sentences (id, text) VALUES (?, ?)', [
      id,
      sentence,
    ]);
  }

  async empty() {
    const [tables] = await this.mysql.rootExec('SHOW TABLES');
    const tableNames = tables
      .map((table: any) => Object.values(table)[0])
      .filter((tableName: string) => tableName !== 'migrations');
    await this.mysql.rootExec('SET FOREIGN_KEY_CHECKS = 0');
    for (const tableName of tableNames) {
      await this.mysql.rootExec('TRUNCATE TABLE ' + tableName);
    }
    await this.mysql.rootExec('SET FOREIGN_KEY_CHECKS = 1');
  }
}
