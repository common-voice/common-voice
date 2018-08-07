import { pick } from 'lodash';
import { getConfig } from '../../config-helper';
import { hash } from '../utility';
import Mysql from './db/mysql';
import Schema from './db/schema';
import { UserTable } from './db/tables/user-table';
import UserClientTable from './db/tables/user-client-table';
import ClipTable, { DBClip, DBClipWithVoters } from './db/tables/clip-table';
import VoteTable from './db/tables/vote-table';

// When getting new sentences/clips we need to fetch a larger pool and shuffle it to make it less
// likely that different users requesting at the same time get the same data
const SHUFFLE_SIZE = 1000;

export interface Sentence {
  id: string;
  text: string;
}

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
   */
  private formatEmail(email?: string): string {
    if (!email) {
      return '';
    }
    return email.toLowerCase();
  }

  private localeIds: { [name: string]: number };
  private async getLocaleId(locale: string): Promise<number> {
    if (!this.localeIds) {
      const [rows] = await this.mysql.query('SELECT id, name FROM locales');
      this.localeIds = rows.reduce(
        (obj: any, { id, name }: any) => ({
          ...obj,
          [name]: id,
        }),
        {}
      );
    }

    return this.localeIds[locale];
  }

  /**
   * Insert or update user client row.
   */
  async updateUser(client_id: string, fields: any): Promise<any> {
    let { age, accents, email, gender } = fields;
    email = this.formatEmail(email);
    await Promise.all([
      email &&
        this.user.update({
          email,
          ...pick(fields, 'send_emails', 'has_downloaded', 'basket_token'),
        }),
      this.userClient.update({ client_id, email, age, gender }),
    ]);
    accents && (await this.saveAccents(client_id, accents));
    return this.getUser(email);
  }

  async getOrSetUserBucket(client_id: string, locale: string, bucket: string) {
    const localeId = await this.getLocaleId(locale);

    let userBucket = await this.getUserBucket(client_id, localeId);
    if (userBucket) return userBucket;

    try {
      await this.mysql.query(
        `
          INSERT INTO user_client_locale_buckets (client_id, locale_id, bucket) VALUES (?, ?, ?)
        `,
        [client_id, localeId, bucket]
      );
      userBucket = await this.getUserBucket(client_id, localeId);
      if (!userBucket) {
        console.error('Error: No bucket found after insert');
        return bucket;
      }
      return userBucket;
    } catch (error) {
      console.error('Error setting user bucket', error);
      return bucket;
    }
  }

  async getUserBucket(
    client_id: string,
    localeId: number
  ): Promise<string | null> {
    const [[row]] = await this.mysql.query(
      'SELECT bucket FROM user_client_locale_buckets WHERE client_id = ? AND locale_id = ?',
      [client_id, localeId]
    );
    return row ? row.bucket : null;
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

  async getSentenceCountByLocale(locales: string[]): Promise<any> {
    const [rows] = await this.mysql.query(
      `
        SELECT COUNT(*) AS count, locales.name AS locale
        FROM sentences
        LEFT JOIN locales ON sentences.locale_id = locales.id
        WHERE locales.name IN (?) AND sentences.is_used
      `,
      [locales]
    );
    return rows;
  }

  async getTotalSentencesCount(locales?: string[]): Promise<number> {
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

  async getSpeakerCount(
    locales: string[]
  ): Promise<{ locale: string; count: number }[]> {
    return (await this.mysql.query(
      `
        SELECT locales.name AS locale, COUNT(DISTINCT clips.client_id) AS count
        FROM clips
        LEFT JOIN locales ON clips.locale_id = locales.id
        WHERE locales.name IN (?)
        GROUP BY locale
      `,
      [locales]
    ))[0];
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
    client_id: string,
    bucket: string,
    locale: string,
    count: number
  ): Promise<Sentence[]> {
    const [rows] = await this.mysql.query(
      `
        SELECT *
        FROM (
          SELECT id, text
          FROM sentences
          WHERE is_used AND bucket = ? AND locale_id = ? AND NOT EXISTS(
            SELECT *
            FROM clips
            WHERE clips.original_sentence_id = sentences.id AND clips.client_id = ?
          )
          ORDER BY clips_count ASC
          LIMIT ?
        ) t
        ORDER BY RAND()
        LIMIT ?
      `,
      [bucket, await this.getLocaleId(locale), client_id, SHUFFLE_SIZE, count]
    );
    return (rows || []).map(({ id, text }: any) => ({ id, text }));
  }

  async findClipsWithFewVotes(
    client_id: string,
    locale: string,
    count: number
  ): Promise<DBClipWithVoters[]> {
    const [clips] = await this.mysql.query(
      `
      SELECT *
      FROM (
        SELECT *
        FROM clips
        WHERE needs_votes AND locale_id = ? AND client_id <> ? AND NOT EXISTS(
          SELECT *
          FROM votes
          WHERE votes.clip_id = clips.id AND client_id = ?
        )
        LIMIT ?
      ) t
      ORDER BY RAND()
      LIMIT ?
    `,
      [
        await this.getLocaleId(locale),
        client_id,
        client_id,
        SHUFFLE_SIZE,
        count,
      ]
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
    const [[row]] = await this.mysql.query(
      `
       SELECT
         COALESCE(SUM(votes.is_valid), 0)     AS upvotes_count,
         COALESCE(SUM(NOT votes.is_valid), 0) AS downvotes_count
       FROM clips
         LEFT JOIN votes ON clips.id = votes.clip_id
       WHERE clips.id = ?
       GROUP BY clips.id
       HAVING upvotes_count < 2 AND downvotes_count < 2 OR upvotes_count = downvotes_count
      `,
      [id]
    );

    if (!row)
      await this.mysql.query(
        `
        UPDATE clips
        SET needs_votes = FALSE
        WHERE id = ?
      `,
        [id]
      );
  }

  async saveClip({
    client_id,
    locale,
    original_sentence_id,
    path,
    sentence,
    sentenceId,
  }: {
    client_id: string;
    locale: string;
    original_sentence_id: string;
    path: string;
    sentence: string;
    sentenceId: string;
  }): Promise<string> {
    try {
      sentenceId = sentenceId || hash(sentence);
      const [localeId] = await Promise.all([
        this.getLocaleId(locale),
        this.saveUserClient(client_id),
      ]);
      const bucket = await this.getOrSetUserBucket(client_id, locale, 'train');

      await this.mysql.query(
        `
          INSERT INTO clips (client_id, original_sentence_id, path, sentence, locale_id, bucket)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        [client_id, sentenceId, path, sentence, localeId, bucket]
      );
      await this.mysql.query(
        `
          UPDATE sentences
          SET clips_count = clips_count + 1
          WHERE id = ?
        `,
        [sentenceId]
      );
      return bucket;
    } catch (e) {
      console.error('error saving clip', e);
    }
  }

  async getValidClipCount(
    locales: string[]
  ): Promise<{ locale: string; count: number }[]> {
    const [rows] = await this.mysql.query(
      `
        SELECT locale, COUNT(*) AS count
        FROM (
         SELECT locales.name AS locale,
                SUM(votes.is_valid) AS upvotes_count,
                SUM(NOT votes.is_valid) AS downvotes_count
         FROM clips
         LEFT JOIN votes ON clips.id = votes.clip_id
         LEFT JOIN locales ON clips.locale_id = locales.id
         WHERE locales.name IN (?)
         GROUP BY clips.id
         HAVING upvotes_count >= 2 AND upvotes_count > downvotes_count
        ) AS valid_clips
        GROUP BY locale
      `,
      [locales]
    );
    return rows;
  }

  async insertSentence(id: string, sentence: string, bucket = 'train') {
    await this.mysql.query(
      'INSERT INTO sentences (id, text, bucket) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id = id',
      [id, sentence, bucket]
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
      'SELECT bucket, COUNT(bucket) AS count FROM clips WHERE bucket IS NOT NULL GROUP BY bucket'
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

  async getDailyClipsCount() {
    return (await this.mysql.query(
      `
        SELECT COUNT(id) AS count
        FROM clips
        WHERE created_at >= CURDATE() AND created_at < CURDATE() + INTERVAL 1 DAY
      `
    ))[0][0].count;
  }

  async getDailyVotesCount() {
    return (await this.mysql.query(
      `
        SELECT COUNT(id) AS count
        FROM votes
        WHERE created_at >= CURDATE() AND created_at < CURDATE() + INTERVAL 1 DAY
      `
    ))[0][0].count;
  }

  async saveAccents(client_id: string, accents: { [locale: string]: string }) {
    await Promise.all(
      Object.entries(accents).map(async ([locale, accent]) =>
        this.mysql.query(
          `
        INSERT INTO user_client_accents (client_id, locale_id, accent) VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE accent = VALUES(accent)
      `,
          [client_id, await this.getLocaleId(locale), accent]
        )
      )
    );
  }

  async fillCacheColumns() {
    await Promise.all([
      this.mysql.query(
        `
          UPDATE clips
          SET needs_votes = id IN (
            SELECT t.id
            FROM (
              SELECT
                clips.id,
                COALESCE(SUM(votes.is_valid), 0)     AS upvotes_count,
                COALESCE(SUM(NOT votes.is_valid), 0) AS downvotes_count
              FROM clips
                LEFT JOIN votes ON clips.id = votes.clip_id
              GROUP BY clips.id
              HAVING upvotes_count < 2 AND downvotes_count < 2 OR upvotes_count = downvotes_count
            ) t
          )
        `
      ),
      this.mysql.query(
        `
          UPDATE sentences SET clips_count = (
            SELECT COUNT(clips.id)
            FROM clips
            WHERE original_sentence_id = sentences.id
          )
        `
      ),
    ]);
  }

  async createSkippedSentence(id: string, client_id: string) {
    await this.mysql.query(
      `
        INSERT INTO skipped_sentences (sentence_id, client_id) VALUES (?, ?) 
      `,
      [id, client_id]
    );
  }

  async getUser(email: string) {
    return (await this.mysql.query(
      `
        SELECT * FROM users WHERE email = ?
      `,
      [email]
    ))[0][0];
  }
}
