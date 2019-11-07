import { getConfig } from '../../config-helper';
import { hash } from '../utility';
import Mysql, { getMySQLInstance } from './db/mysql';
import Schema from './db/schema';
import ClipTable, { DBClipWithVoters } from './db/tables/clip-table';
import VoteTable from './db/tables/vote-table';

// When getting new sentences/clips we need to fetch a larger pool and shuffle it to make it less
// likely that different users requesting at the same time get the same data
const SHUFFLE_SIZE = 500;

const teammate_subquery =
  '(SELECT team_id FROM enroll e LEFT JOIN challenges c ON e.challenge_id = c.id WHERE e.client_id = ? AND c.url_token = ?)';
const self_subcondition = '(visible = 0 AND user_clients.client_id = ?)';
const participantConditions = {
  self: `user_clients.client_id = ?`,
  team: `(visible OR ${self_subcondition}) AND enroll.team_id = ${teammate_subquery}`,
  general: `(
                ${self_subcondition}
                OR (visible = 1)
                OR (visible = 2 AND teams.id = ${teammate_subquery})
              )`,
};

export const getParticipantSubquery = (
  condition: 'self' | 'team' | 'general'
) => {
  return `
  SELECT user_clients.client_id, avatar_url, username,
      challenges.start_date AS start_date,
      TIMESTAMPADD(WEEK, 3, challenges.start_date) AS end_date,
      COALESCE(SUM(achievements.points), 0) AS bonus
  FROM user_clients
  LEFT JOIN enroll ON user_clients.client_id = enroll.client_id
  LEFT JOIN challenges ON enroll.challenge_id = challenges.id
  LEFT JOIN teams ON enroll.team_id = teams.id AND challenges.id = teams.challenge_id
  LEFT JOIN earn ON user_clients.client_id = earn.client_id AND earn.team_id IS NULL
      AND earn.earned_at BETWEEN challenges.start_date AND TIMESTAMPADD(WEEK, 3, challenges.start_date)
  LEFT JOIN achievements ON earn.achievement_id = achievements.id
      AND challenges.id = achievements.challenge_id
  WHERE ${participantConditions[condition]}
  AND challenges.url_token = ?
  GROUP BY user_clients.client_id, avatar_url, username, start_date, end_date
  `;
};

let localeIds: { [name: string]: number };
export async function getLocaleId(locale: string): Promise<number> {
  if (!localeIds) {
    const [rows] = await getMySQLInstance().query(
      'SELECT id, name FROM locales'
    );
    localeIds = rows.reduce(
      (obj: any, { id, name }: any) => ({
        ...obj,
        [name]: id,
      }),
      {}
    );
  }

  return localeIds[locale];
}

export interface Sentence {
  id: string;
  text: string;
}

export default class DB {
  clip: ClipTable;
  mysql: Mysql;
  schema: Schema;
  vote: VoteTable;

  constructor() {
    this.mysql = getMySQLInstance();

    this.clip = new ClipTable(this.mysql);
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

  async getSentenceCountByLocale(locales: string[]): Promise<any> {
    const [rows] = await this.mysql.query(
      `
        SELECT COUNT(*) AS count, locales.name AS locale
        FROM sentences
        LEFT JOIN locales ON sentences.locale_id = locales.id
        WHERE locales.name IN (?) AND sentences.is_used
        GROUP BY locale
      `,
      [locales]
    );
    return rows;
  }

  async getClipCount(): Promise<number> {
    return this.clip.getCount();
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
    locale: string,
    count: number
  ): Promise<Sentence[]> {
    const [rows] = await this.mysql.query(
      `
        SELECT *
        FROM (
          SELECT id, text
          FROM sentences
          WHERE is_used AND locale_id = ? AND NOT EXISTS (
            SELECT *
            FROM clips
            WHERE clips.original_sentence_id = sentences.id AND
                  clips.client_id = ?
          )
          ORDER BY clips_count ASC
          LIMIT ?
        ) t
        ORDER BY RAND()
        LIMIT ?
      `,
      [await getLocaleId(locale), client_id, SHUFFLE_SIZE, count]
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
        SELECT clips.*
        FROM clips
        LEFT JOIN sentences on clips.original_sentence_id = sentences.id
        WHERE is_valid IS NULL AND clips.locale_id = ? AND client_id <> ? AND
              NOT EXISTS(
                SELECT *
                FROM votes
                WHERE votes.clip_id = clips.id AND client_id = ?
              )
        ORDER BY sentences.clips_count ASC, clips.created_at ASC
        LIMIT ?
      ) t
      ORDER BY RAND()
      LIMIT ?
    `,
      [await getLocaleId(locale), client_id, client_id, SHUFFLE_SIZE, count]
    );
    for (const clip of clips) {
      clip.voters = clip.voters ? clip.voters.split(',') : [];
    }
    return clips as DBClipWithVoters[];
  }

  /**
   * Creates user_client if it doesn't exist and checks whether the given
   * auth_token matches it
   */
  async createOrVerifyUserClient(
    id: string,
    auth_token?: string
  ): Promise<boolean> {
    await this.mysql.query(
      `
        INSERT INTO user_clients (client_id, auth_token)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
          auth_token = IF(auth_token IS NULL, VALUES(auth_token), auth_token)
      `,
      [id, auth_token || null]
    );

    return Boolean(
      (await this.mysql.query(
        `
          SELECT 1
          FROM user_clients
          WHERE client_id = ? AND (auth_token = ? OR auth_token IS NULL)
        `,
        [id, auth_token || null]
      ))[0][0]
    );
  }

  async saveVote(id: string, client_id: string, is_valid: string) {
    await this.createOrVerifyUserClient(client_id);
    await this.mysql.query(
      `
      INSERT INTO votes (clip_id, client_id, is_valid) VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE is_valid = VALUES(is_valid)
    `,
      [id, client_id, is_valid ? 1 : 0]
    );

    await this.mysql.query(
      `
        UPDATE clips updated_clips
        SET is_valid = (
          SELECT
            CASE
              WHEN upvotes_count >= 2 AND upvotes_count > downvotes_count
                THEN TRUE
              WHEN downvotes_count >= 2 AND downvotes_count > upvotes_count
                THEN FALSE
              ELSE NULL
              END
          FROM (
                 SELECT
                   clips.id AS id,
                   COALESCE(SUM(votes.is_valid), 0)     AS upvotes_count,
                   COALESCE(SUM(NOT votes.is_valid), 0) AS downvotes_count
                 FROM clips
                 LEFT JOIN votes ON clips.id = votes.clip_id
                 WHERE clips.id = ?
                 GROUP BY clips.id
               ) t
        )
        WHERE updated_clips.id = ?
      `,
      [id, id]
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
  }): Promise<void> {
    try {
      sentenceId = sentenceId || hash(sentence);
      const localeId = await getLocaleId(locale);

      await this.mysql.query(
        `
          INSERT INTO clips (client_id, original_sentence_id, path, sentence, locale_id)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE created_at = NOW()
        `,
        [client_id, sentenceId, path, sentence, localeId]
      );
      await this.mysql.query(
        `
          UPDATE sentences
          SET clips_count = clips_count + 1
          WHERE id = ?
        `,
        [sentenceId]
      );
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
         SELECT locales.name AS locale
         FROM clips
         LEFT JOIN locales ON clips.locale_id = locales.id
         WHERE locales.name IN (?) AND is_valid
         GROUP BY clips.id
        ) AS valid_clips
        GROUP BY locale
      `,
      [locales]
    );
    return rows;
  }

  async getClipsStats(
    locale?: string
  ): Promise<{ date: string; total: number; valid: number }[]> {
    const localeId = locale ? await getLocaleId(locale) : null;

    const intervals = [
      '100 YEAR',
      '1 YEAR',
      '6 MONTH',
      '1 MONTH',
      '1 WEEK',
      '0 HOUR',
    ];
    const ranges = intervals
      .map(interval => 'NOW() - INTERVAL ' + interval)
      .reduce(
        (ranges, interval, i, intervals) =>
          i + 1 === intervals.length
            ? ranges
            : [...ranges, [interval, intervals[i + 1]]],
        []
      );

    const results = await Promise.all(
      ranges.map(([from, to]) =>
        Promise.all([
          this.mysql.query(
            `
              SELECT COUNT(*) AS total, ${to} AS date
              FROM clips
              WHERE created_at BETWEEN ${from} AND ${to} ${
              locale ? 'AND locale_id = ?' : ''
            }
            `,
            [localeId]
          ),
          this.mysql.query(
            `
              SELECT SUM(upvotes_count >= 2 AND upvotes_count > downvotes_count) AS valid
              FROM (
                SELECT
                  SUM(votes.is_valid) AS upvotes_count,
                  SUM(NOT votes.is_valid) AS downvotes_count
                FROM clips
                LEFT JOIN votes ON clips.id = votes.clip_id
                WHERE NOT clips.is_valid IS NULL AND (
                  SELECT created_at
                  FROM votes
                  WHERE votes.clip_id = clips.id
                  ORDER BY created_at DESC
                  LIMIT 1
                ) BETWEEN ${from} AND ${to} ${locale ? 'AND locale_id = ?' : ''}
                GROUP BY clips.id
              ) t;
            `,
            [localeId]
          ),
        ])
      )
    );

    return results.reduce((totals, [[[{ date, total }]], [[{ valid }]]], i) => {
      const last = totals[totals.length - 1];
      return totals.concat({
        date,
        total: (last ? last.total : 0) + (Number(total) || 0),
        valid: (last ? last.valid : 0) + (Number(valid) || 0),
      });
    }, []);
  }

  async getVoicesStats(
    locale?: string
  ): Promise<{ date: string; value: number }[]> {
    const hours = Array.from({ length: 10 }).map((_, i) => i);

    const [rows] = await this.mysql.query(
      `
        SELECT date, COUNT(DISTINCT client_id) AS value
        FROM (
          SELECT (TIMESTAMP(DATE_FORMAT(NOW(), '%Y-%m-%d %H:00')) - INTERVAL hour HOUR) AS date
          FROM (${hours.map(i => `SELECT ${i} AS hour`).join(' UNION ')}) hours
        ) date_alias
        LEFT JOIN user_client_activities ON created_at BETWEEN date AND (date + INTERVAL 1 HOUR) ${
          locale ? 'AND locale_id = ?' : ''
        }
        GROUP BY date
    `,
      [locale ? await getLocaleId(locale) : '']
    );

    return rows;
  }

  async getContributionStats(
    locale?: string,
    client_id?: string
  ): Promise<{ date: string; value: number }[]> {
    const hours = Array.from({ length: 10 }).map((_, i) => i);

    const [rows] = await this.mysql.query(
      `
        SELECT date,
        (
          SELECT COUNT(*)
          FROM clips
          WHERE clips.created_at BETWEEN date AND (date + INTERVAL 1 HOUR)
          ${locale ? 'AND clips.locale_id = :locale_id' : ''}
          ${client_id ? 'AND clips.client_id = :client_id' : ''}
        ) + (
          SELECT COUNT(*)
          FROM votes
          LEFT JOIN clips on clips.id = votes.clip_id
          WHERE votes.created_at BETWEEN date AND (date + INTERVAL 1 HOUR)
          ${locale ? 'AND clips.locale_id = :locale_id' : ''}
          ${client_id ? 'AND votes.client_id = :client_id' : ''}
        ) AS value
        FROM (
          SELECT (TIMESTAMP(DATE_FORMAT(NOW(), '%Y-%m-%d %H:00')) - INTERVAL hour HOUR) AS date
          FROM (${hours.map(i => `SELECT ${i} AS hour`).join(' UNION ')}) hours
        ) date_alias
        ORDER BY date ASC
      `,
      {
        locale_id: locale ? await getLocaleId(locale) : null,
        client_id,
      }
    );

    return rows;
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

  async getUserClient(client_id: string) {
    const [[row]] = await this.mysql.query(
      'SELECT * FROM user_clients WHERE client_id = ?',
      [client_id]
    );
    return row;
  }

  async getDailyClipsCount(locale?: string) {
    return (await this.mysql.query(
      `
        SELECT COUNT(id) AS count
        FROM clips
        WHERE created_at >= CURDATE() AND created_at < CURDATE() + INTERVAL 1 DAY
        ${locale ? 'AND locale_id = ?' : ''}
      `,
      locale ? [await getLocaleId(locale)] : []
    ))[0][0].count;
  }

  async getDailyVotesCount(locale?: string) {
    return (await this.mysql.query(
      `
        SELECT COUNT(votes.id) AS count
        FROM votes
        LEFT JOIN clips on votes.clip_id = clips.id
        WHERE votes.created_at >= CURDATE() AND votes.created_at < CURDATE() + INTERVAL 1 DAY
        ${locale ? 'AND locale_id = ?' : ''}
      `,
      locale ? [await getLocaleId(locale)] : []
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
          [client_id, await getLocaleId(locale), accent]
        )
      )
    );
  }

  async createSkippedSentence(id: string, client_id: string) {
    await this.mysql.query(
      `
        INSERT INTO skipped_sentences (sentence_id, client_id) VALUES (?, ?) 
      `,
      [id, client_id]
    );
  }

  async saveActivity(client_id: string, locale: string) {
    await this.mysql.query(
      `
        INSERT INTO user_client_activities (client_id, locale_id) VALUES (?, ?)
      `,
      [client_id, await getLocaleId(locale)]
    );
  }

  async insertDownloader(locale: string, email: string) {
    await this.mysql.query(
      `
        INSERT IGNORE INTO downloaders (locale_id, email) VALUES (?, ?)
      `,
      [await getLocaleId(locale), email]
    );
  }

  async createReport(
    client_id: string,
    {
      kind,
      id,
      reasons,
    }: { kind: 'clip' | 'sentence'; id: string; reasons: string[] }
  ) {
    const [table, column] =
      kind == 'clip'
        ? ['reported_clips', 'clip_id']
        : ['reported_sentences', 'sentence_id'];
    for (const reason of reasons) {
      await this.mysql.query(
        `INSERT INTO ${table} (client_id, ${column}, reason) VALUES (?, ?, ?)`,
        [client_id, id, reason]
      );
    }
  }

  async getPoints(client_id: string, challenge: string) {
    const [[row]] = await this.mysql.query(
      `
      SELECT (bonus + clip_points + vote_points) AS user
      FROM (
          SELECT bonus, clip_points, COUNT(votes.id) AS vote_points
          FROM (
              SELECT challenger.client_id, start_date, end_date, bonus, COUNT(clips.id) AS clip_points
              FROM (
                ${getParticipantSubquery('self')}
              ) challenger
              LEFT JOIN clips ON challenger.client_id = clips.client_id AND clips.created_at BETWEEN start_date AND end_date
              GROUP BY challenger.client_id, start_date, end_date, bonus
          ) speaker
          LEFT JOIN votes ON speaker.client_id = votes.client_id AND votes.created_at BETWEEN start_date AND end_date
          GROUP BY speaker.client_id, speaker.bonus, speaker.clip_points
      ) voter
      `,
      [client_id, challenge]
    );
    return row;
  }

  async getWeeklyProgress(client_id: string, challenge: string) {
    const [[row]] = await this.mysql.query(
      `
      SELECT speaker.client_id, start_date, end_date, week, teammate_count, clip_count, COUNT(votes.id) AS vote_count
      FROM (
          SELECT user.client_id, start_date, end_date, week, teammate_count, COUNT(clips.id) AS clip_count
          FROM (
              SELECT user_clients.client_id,
                  TIMESTAMPDIFF(WEEK, start_date, NOW()) AS week,
                  TIMESTAMPADD(WEEK, TIMESTAMPDIFF(WEEK, start_date, NOW()), start_date) AS start_date,
                  TIMESTAMPADD(WEEK, TIMESTAMPDIFF(WEEK, start_date, NOW()) + 1, start_date) AS end_date,
                  COUNT(teammate.id) AS teammate_count
              FROM user_clients
              LEFT JOIN enroll ON user_clients.client_id = enroll.client_id
              LEFT JOIN challenges ON enroll.challenge_id = challenges.id
              LEFT JOIN teams ON enroll.team_id = teams.id AND challenges.id = teams.challenge_id
              LEFT JOIN enroll teammate ON enroll.id <> teammate.id AND teams.id = teammate.team_id AND challenges.id = teammate.challenge_id
              WHERE user_clients.client_id = ? AND challenges.url_token = ?
              GROUP BY user_clients.client_id, start_date, end_date, week
          ) user
          LEFT JOIN clips ON user.client_id = clips.client_id AND clips.created_at BETWEEN start_date AND end_date
          GROUP BY user.client_id, start_date, end_date, week, teammate_count
      ) speaker
      LEFT JOIN votes ON speaker.client_id = votes.client_id AND votes.created_at BETWEEN start_date AND end_date
      GROUP BY speaker.client_id, start_date, end_date, teammate_count, clip_count
      `,
      [client_id, challenge]
    );
    return row;
  }
}
