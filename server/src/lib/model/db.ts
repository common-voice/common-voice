import { pick } from 'lodash';
import { getConfig } from '../../config-helper';
import { hash } from '../utility';
import Mysql from './db/mysql';
import Schema from './db/schema';
import { UserTable } from './db/tables/user-table';
import UserClientTable from './db/tables/user-client-table';
import ClipTable, { DBClip, DBClipWithVoters } from './db/tables/clip-table';
import VoteTable from './db/tables/vote-table';

export default class DB {
  clip: ClipTable;
  mysql: Mysql;
  schema: Schema;
  user: UserTable;
  userClient: UserClientTable;
  vote: VoteTable;

  constructor() {
    this.mysql = new Mysql();

    this.clip = new ClipTable(this.mysql);
    this.user = new UserTable(this.mysql);
    this.userClient = new UserClientTable(this.mysql);
    this.vote = new VoteTable(this.mysql);

    this.schema = new Schema(this.mysql);
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
  async updateUser(
    client_id: string,
    fields: any,
    bucket = 'train'
  ): Promise<void> {
    let { age, accent, email, gender } = fields;
    email = this.formatEmail(email);
    await this.mysql.query(
      `
        INSERT INTO user_clients (client_id, bucket) VALUES (?, ?)
        ON DUPLICATE KEY UPDATE client_id = client_id
      `,
      [client_id, bucket]
    );
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
    if (!getConfig().PROD) {
      await this.schema.dropDatabase();
    }
  }

  async getUserCount(): Promise<number> {
    return this.user.getCount();
  }

  async getDownloadingUserCount(): Promise<number> {
    const [[{ count }]] = await this.mysql.query(
      `SELECT COUNT(*) AS count FROM users WHERE has_downloaded`
    );
    return count;
  }

  async getEmailsCount(): Promise<number> {
    const [[{ count }]] = await this.mysql.query(
      `SELECT COUNT(email) AS count FROM users WHERE email IS NOT NULL AND TRIM(email) <> ''`
    );
    return count;
  }

  async getUserClientCount(): Promise<number> {
    return this.userClient.getCount();
  }

  async getSentencesCount(): Promise<number> {
    const [[{ count }]] = await this.mysql.query(
      `SELECT COUNT(*) AS count FROM sentences`
    );
    return count;
  }

  async getSentencesWithNoClipsCount(): Promise<number> {
    const [[{ count }]] = await this.mysql.query(
      `
        SELECT COUNT(*) AS count
        FROM (
          SELECT sentences.*
          FROM sentences
            LEFT JOIN clips ON sentences.id = clips.original_sentence_id
          WHERE sentences.is_used
          GROUP BY sentences.id
          HAVING COUNT(clips.id) = 0
        ) t
      `
    );
    return count;
  }

  async getClipCount(): Promise<number> {
    return this.clip.getCount();
  }

  async getVoteCount(): Promise<number> {
    return this.vote.getCount();
  }

  async getListenerCount(): Promise<number> {
    return (await this.mysql.query(
      `
        SELECT COUNT(DISTINCT user_clients.client_id) AS count
        FROM user_clients
        INNER JOIN votes ON user_clients.client_id = votes.client_id
      `
    ))[0][0].count;
  }

  async getSubmitterCount(): Promise<number> {
    return (await this.mysql.query(
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

  async findSentencesWithFewClips(
    bucket: string,
    count: number
  ): Promise<string[]> {
    return (await this.mysql.query(
      `
        SELECT text
        FROM sentences
        LEFT JOIN clips ON sentences.id = clips.original_sentence_id
        WHERE sentences.is_used AND sentences.bucket = ? AND sentences.locale_id = 1 
        GROUP BY sentences.id
        ORDER BY COUNT(clips.id) ASC
        LIMIT ?
      `,
      [bucket, count]
    ))[0].map((row: any) => row.text);
  }

  async findClipsWithFewVotes(limit: number): Promise<DBClipWithVoters[]> {
    const [clips] = await this.mysql.query(
      `
      SELECT clips.*,
        GROUP_CONCAT(votes.client_id) AS voters,
        COALESCE(SUM(votes.is_valid), 0) AS upvotes_count,
        COALESCE(SUM(NOT votes.is_valid), 0) AS downvotes_count
      FROM clips
      LEFT JOIN votes ON clips.id = votes.clip_id
      GROUP BY clips.id
      HAVING upvotes_count < 2 AND downvotes_count < 2 OR upvotes_count = downvotes_count
      ORDER BY upvotes_count DESC, downvotes_count DESC
      LIMIT ?
    `,
      [limit]
    );
    for (const clip of clips) {
      clip.voters = clip.voters ? clip.voters.split(',') : [];
    }
    return clips as DBClipWithVoters[];
  }

  async saveUserClient(id: string) {
    await this.mysql.query(
      'INSERT INTO user_clients (client_id) VALUES (?) ON DUPLICATE KEY UPDATE client_id = client_id',
      [id]
    );
  }

  async saveVote(id: string, client_id: string, is_valid: string) {
    await this.saveUserClient(client_id);
    await this.mysql.query(
      `
      INSERT INTO votes (clip_id, client_id, is_valid) VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE is_valid = VALUES(is_valid)
    `,
      [id, client_id, is_valid ? 1 : 0]
    );
  }

  async saveClip({
    client_id,
    original_sentence_id,
    path,
    sentence,
  }: {
    client_id: string;
    original_sentence_id: string;
    path: string;
    sentence: string;
  }): Promise<DBClip> {
    const sentenceId = hash(sentence);
    await Promise.all([
      this.saveUserClient(client_id),
      this.insertSentence(sentenceId, sentence),
    ]);
    await this.mysql.query(
      `
        INSERT INTO clips (client_id, original_sentence_id, path, sentence, bucket)
          (SELECT ?, ?, ?, ?, bucket FROM user_clients WHERE client_id = ? LIMIT 1)
          ON DUPLICATE KEY UPDATE id = id
      `,
      [client_id, sentenceId, path, sentence, client_id]
    );
    const [[row]] = await this.mysql.query(
      'SELECT * FROM clips WHERE id = LAST_INSERT_ID()'
    );
    return row;
  }

  async getValidatedClipsCount() {
    const [[{ count }]] = await this.mysql.query(
      `
        SELECT COUNT(*) AS count
        FROM (
         SELECT clips.*, SUM(votes.is_valid) AS upvotes_count, SUM(NOT votes.is_valid) AS downvotes_count
         FROM clips
         LEFT JOIN votes ON clips.id = votes.clip_id
         GROUP BY clips.id
         HAVING upvotes_count >= 2 AND upvotes_count > downvotes_count
        ) AS valid_clips
      `
    );
    return count || 0;
  }

  async insertSentence(id: string, sentence: string) {
    await this.mysql.query(
      'INSERT INTO sentences (id, text) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = id',
      [id, sentence]
    );
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

  async findClip(id: string) {
    return (await this.mysql.query('SELECT * FROM clips WHERE id = ? LIMIT 1', [
      id,
    ]))[0][0];
  }

  async getRequestedLanguages(): Promise<string[]> {
    const [rows] = await this.mysql.query(
      'SELECT language FROM requested_languages'
    );
    return rows.map((row: any) => row.language);
  }

  async findRequestedLanguageId(language: string): Promise<number | null> {
    const [[row]] = await this.mysql.query(
      'SELECT * FROM requested_languages WHERE LOWER(language) = LOWER(?) LIMIT 1',
      [language]
    );
    return row ? row.id : null;
  }

  async createLanguageRequest(language: string, client_id: string) {
    language = language.trim();
    let requestedLanguageId = await this.findRequestedLanguageId(language);
    if (!requestedLanguageId) {
      await this.mysql.query(
        'INSERT INTO requested_languages (language) VALUES (?)',
        [language]
      );
      requestedLanguageId = await this.findRequestedLanguageId(language);
    }
    await this.mysql.query(
      `
        INSERT INTO language_requests (requested_languages_id, client_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE client_id = client_id
      `,
      [requestedLanguageId, client_id]
    );
  }

  async getClipBucketCounts() {
    const [rows] = await this.mysql.query(
      'SELECT bucket, COUNT(bucket) AS count FROM clips GROUP BY bucket'
    );
    return rows;
  }

  async getUserClient(client_id: string) {
    const [[row]] = await this.mysql.query(
      'SELECT * FROM user_clients WHERE client_id = ?',
      [client_id]
    );
    return row;
  }

  async migrateUserClientBuckets() {
    await this.mysql.query(
      `
        INSERT IGNORE INTO user_client_locale_buckets (client_id, locale_id, bucket)
          SELECT client_id, 1, bucket FROM user_clients
      `
    );
  }
}
