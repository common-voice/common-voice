import { getConfig } from '../../config-helper';
import Mysql, { getMySQLInstance } from './db/mysql';
import Schema from './db/schema';
import ClipTable, { DBClip } from './db/tables/clip-table';
import VoteTable from './db/tables/vote-table';
import {
  ChallengeToken,
  Sentence,
  TaxonomyToken,
  taxonomies,
  Language,
  Datasets,
} from 'common';
import lazyCache from '../lazy-cache';
const MINUTE = 1000 * 60;
const DAY = MINUTE * 60 * 24;

// When getting new sentences/clips we need to fetch a larger pool and shuffle it to make it less
// likely that different users requesting at the same time get the same data
const SHUFFLE_SIZE = 500;

const THREE_WEEKS = 3 * 7 * 24 * 60 * 60 * 1000;

// Ref JIRA ticket OI-1300 - we want to exclude languages with fewer than 500k active global speakers
// from the single sentence record limit, because they are unlikely to amass enough unique speakers
// to benefit from single sentence constraints
const SINGLE_SENTENCE_LIMIT = ['en', 'de', 'fr', 'kab', 'rw', 'ca', 'es'];

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

let termIds: { [name: string]: number };

const getLanguageMap = lazyCache(
  `get-language-id-map`,
  async () => {
    const [rows] = await getMySQLInstance().query(
      'SELECT id, name FROM locales'
    );
    //{en: 1, fr:2, ...}
    return rows.reduce(
      (obj: any, { id, name }: any) => ({
        ...obj,
        [name]: id,
      }),
      {}
    );
  },
  DAY
);

export async function getLocaleId(locale: string): Promise<number> {
  if (locale === 'overall') return null;

  const languageIds = await getLanguageMap();

  if (!languageIds) {
    return null;
  }

  return languageIds[locale];
}

export async function getTermIds(term_names: string[]): Promise<number[]> {
  if (!termIds) {
    const [rows] = await getMySQLInstance().query(
      `SELECT id, term_sentence_source FROM taxonomy_terms`
    );
    termIds = rows.reduce(
      (obj: any, { id, term_sentence_source }: any) => ({
        ...obj,
        [term_sentence_source]: id,
      }),
      {}
    );
  }

  return term_names.map(name => termIds[name]);
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
   * Check whether target segment is live for this language
   */
  private getPrioritySegments(locale: string): string[] {
    return Object.keys(taxonomies)
      .filter((taxonomyToken: TaxonomyToken) => {
        return taxonomies[taxonomyToken].locales.includes(locale);
      })
      .map((taxonomyToken: TaxonomyToken) => taxonomies[taxonomyToken].source);
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

  async getSentenceCountByLocale(): Promise<
    {
      locale_id: number;
      count: number;
    }[]
  > {
    const [rows] = await this.mysql.query(
      `
      SELECT
        COUNT(*) AS count,
        locale_id
      FROM
        sentences
      WHERE
        sentences.is_used = 1
      GROUP BY
        locale_id;
      `
    );
    return rows;
  }

  /**
   * Get valid and random clips per language
   * @param languageId
   * @param limit
   * @returns
   */
  async getClipsToBeValidated(
    languageId: number,
    limit: number
  ): Promise<DBClip[]> {
    const [rows] = await this.mysql.query(
      `
        SELECT c.id as id, 
        c.path as path, 
        s.has_valid_clip as has_valid_clip,
        c.client_id as client_id, 
        s.text as sentence,
        c.original_sentence_id as original_sentence_id
        FROM clips c
        LEFT JOIN sentences s ON s.id = c.original_sentence_id and c.locale_id = ?
        WHERE c.is_valid IS NULL AND s.clips_count <= 15
        ORDER BY rand()
        limit ?
      `,
      [languageId, limit]
    );

    return rows;
  }

  async getClipCount(): Promise<number> {
    return this.clip.getCount();
  }

  async getSpeakerCount(
    localeIds: number[]
  ): Promise<{ locale_id: number; count: number }[]> {
    return (
      await this.mysql.query(
        `
        SELECT clips.locale_id, COUNT(DISTINCT clips.client_id) AS count
        FROM clips
        WHERE clips.locale_id IN (?)
        GROUP BY clips.locale_id
      `,
        [localeIds]
      )
    )[0];
  }

  async getTotalUniqueSpeakerCount(
    localeIds: number[]
  ): Promise<{ locale_id: number; count: number }[]> {
    return (
      await this.mysql.query(
        `
        SELECT temp.locale_id, COUNT(1) AS count
        FROM (select c.locale_id, count(1) from clips c
        WHERE c.locale_id IN (?)
        GROUP BY c.client_id, c.locale_id) temp
        GROUP BY temp.locale_id
      `,
        [localeIds]
      )
    )[0];
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

  async findSentencesNeedingClips(
    client_id: string,
    locale: string,
    count: number
  ): Promise<Sentence[]> {
    let taxonomySentences: Sentence[] = [];
    const locale_id = await getLocaleId(locale);
    const exemptFromSSRL = !SINGLE_SENTENCE_LIMIT.includes(locale);

    const prioritySegments = this.getPrioritySegments(locale);

    if (prioritySegments.length) {
      taxonomySentences = await this.findSentencesMatchingTaxonomy(
        client_id,
        locale_id,
        count,
        prioritySegments
      );
    }

    const regularSentences =
      taxonomySentences.length >= count
        ? []
        : await this.findSentencesWithFewClips(
            client_id,
            locale_id,
            count - taxonomySentences.length,
            exemptFromSSRL
          );
    return taxonomySentences.concat(regularSentences);
  }

  async findSentencesWithFewClips(
    client_id: string,
    locale_id: number,
    count: number,
    exemptFromSSRL?: boolean
  ): Promise<Sentence[]> {
    const [rows] = await this.mysql.query(
      `
        SELECT *
        FROM (
          SELECT id, text
          FROM sentences
          WHERE is_used AND locale_id = ? AND NOT EXISTS (
            SELECT original_sentence_id
            FROM clips
            WHERE clips.original_sentence_id = sentences.id AND
              clips.client_id = ?
            UNION ALL
            SELECT sentence_id
            FROM skipped_sentences skipped
            WHERE skipped.sentence_id = sentences.id AND
              skipped.client_id = ?
            UNION ALL
            SELECT sentence_id
            FROM reported_sentences reported
            WHERE reported.sentence_id = sentences.id AND
              reported.client_id = ?
          )
          ${exemptFromSSRL ? '' : 'AND (clips_count = 0 OR has_valid_clip = 0)'}
          ORDER BY clips_count ASC
          LIMIT ?
        ) t
        ORDER BY RAND()
        LIMIT ?
      `,
      [locale_id, client_id, client_id, client_id, SHUFFLE_SIZE, count]
    );
    return (rows || []).map(({ id, text }: any) => ({ id, text }));
  }

  async findSentencesMatchingTaxonomy(
    client_id: string,
    locale_id: number,
    count: number,
    segments: string[]
  ): Promise<Sentence[]> {
    const [rows] = await this.mysql.query(
      `
        SELECT *
        FROM (
          SELECT sentence_id AS id, text, term_name, term_sentence_source
          FROM taxonomy_entries entries
          LEFT JOIN taxonomy_terms terms ON terms.id = entries.term_id
          LEFT JOIN sentences ON entries.sentence_id = sentences.id
          WHERE term_id IN (?)
          AND is_used AND sentences.locale_id = ? AND NOT EXISTS (
            SELECT original_sentence_id
            FROM clips
            WHERE clips.original_sentence_id = sentences.id AND
              clips.client_id = ?
            UNION ALL
            SELECT sentence_id
            FROM skipped_sentences skipped
            WHERE skipped.sentence_id = sentences.id AND
              skipped.client_id = ?
            UNION ALL
            SELECT sentence_id
            FROM reported_sentences reported
            WHERE reported.sentence_id = sentences.id AND
              reported.client_id = ?
          )
          LIMIT ?
        ) t
        ORDER BY RAND()
        LIMIT ?
      `,
      [
        await getTermIds(segments),
        locale_id,
        client_id,
        client_id,
        client_id,
        SHUFFLE_SIZE,
        count,
      ]
    );

    return (rows || []).map(
      ({ id, text, term_name, term_sentence_source }: any) => ({
        id,
        text,
        taxonomy: { name: term_name, source: term_sentence_source },
      })
    );
  }

  async findClipsNeedingValidation(
    client_id: string,
    locale: string,
    count: number
  ): Promise<DBClip[]> {
    let taxonomySentences: DBClip[] = [];
    const locale_id = await getLocaleId(locale);
    const exemptFromSSRL = !SINGLE_SENTENCE_LIMIT.includes(locale);

    const prioritySegments = this.getPrioritySegments(locale);

    if (prioritySegments.length) {
      taxonomySentences = await this.findClipsMatchingTaxonomy(
        client_id,
        locale_id,
        count,
        prioritySegments
      );
    }

    const regularSentences =
      taxonomySentences.length >= count
        ? []
        : await this.findClipsWithFewVotes(
            client_id,
            locale_id,
            count - taxonomySentences.length,
            exemptFromSSRL
          );

    return taxonomySentences.concat(regularSentences);
  }

  async findClipsWithFewVotes(
    client_id: string,
    locale_id: number,
    count: number,
    exemptFromSSRL?: boolean
  ): Promise<DBClip[]> {
    // get cached clips for given language
    const cachedClips: DBClip[] = await lazyCache(
      `new-clips-per-language-${locale_id}`,
      async () => {
        return await this.getClipsToBeValidated(locale_id, 10000);
      },
      MINUTE
    )();

    //filter out users own clips
    const validUserClips: DBClip[] = cachedClips.filter(
      (row: DBClip) => row.client_id != client_id
    );

    // potentially cache-able
    // get users previously interacted clip ids
    const [submittedUserClipIds] = await this.mysql.query(
      `
      SELECT clip_id
        FROM votes
        WHERE client_id = ?
        UNION ALL
        SELECT clip_id
        FROM reported_clips reported
        WHERE client_id = ?
        UNION ALL
        SELECT clip_id
        FROM skipped_clips skipped
        WHERE client_id = ?
      `,
      [client_id, client_id, client_id]
    );

    //remove dups and store as a flat set
    const skipClipIds: Set<number> = new Set(
      submittedUserClipIds.map((row: { clip_id: number }) => row.clip_id)
    );

    //get clips that a user hasnt already seen
    const validClips = new Set(
      validUserClips.filter((clip: DBClip) => {
        if (exemptFromSSRL) return !skipClipIds.has(clip.id);
        //only return clips that have not been valiadated before
        return !skipClipIds.has(clip.id) && clip.has_valid_clip === 0;
      })
    );

    if (validClips.size > count) return Array.from(validClips);

    const [clips] = await this.mysql.query(
      `
      SELECT *
      FROM (
        SELECT clips.*
        FROM clips
        LEFT JOIN sentences on clips.original_sentence_id = sentences.id
        WHERE is_valid IS NULL AND clips.locale_id = ? AND client_id <> ?
        AND NOT EXISTS(
          SELECT clip_id
          FROM votes
          WHERE votes.clip_id = clips.id AND client_id = ?
          UNION ALL
          SELECT clip_id
          FROM reported_clips reported
          WHERE reported.clip_id = clips.id AND client_id = ?
          UNION ALL
          SELECT clip_id
          FROM skipped_clips skipped
          WHERE skipped.clip_id = clips.id AND client_id = ?
        )
        AND sentences.clips_count <= 15
        ${exemptFromSSRL ? '' : 'AND sentences.has_valid_clip = 0'}
        ORDER BY sentences.clips_count ASC, clips.created_at ASC
        LIMIT ?
      ) t
      ORDER BY RAND()
      LIMIT ?`,
      [
        locale_id,
        client_id,
        client_id,
        client_id,
        client_id,
        SHUFFLE_SIZE,
        count,
      ]
    );

    return clips as DBClip[];
  }

  async findClipsMatchingTaxonomy(
    client_id: string,
    locale_id: number,
    count: number,
    segments: string[]
  ): Promise<DBClip[]> {
    const [clips] = await this.mysql.query(
      `
      SELECT *
      FROM (
        SELECT * FROM clips INNER JOIN (
          SELECT sentence_id, term_name, term_sentence_source
          FROM taxonomy_entries entries
          LEFT JOIN taxonomy_terms terms ON entries.term_id = terms.id
          LEFT JOIN sentences ON entries.sentence_id = sentences.id
          WHERE locale_id = ?
          AND sentence_id NOT IN (
            SELECT original_sentence_id FROM (
              SELECT original_sentence_id, count(votes.id) as vote_count
              FROM clips
              LEFT JOIN votes ON votes.clip_id = clips.id
              LEFT JOIN taxonomy_entries entries
                ON clips.original_sentence_id = entries.sentence_id
              WHERE clips.locale_id = ?
              AND votes.client_id = ?
              AND entries.term_id IN (?)
              GROUP BY original_sentence_id
              HAVING vote_count >= 2
            ) vote_counts
          )
          AND entries.term_id IN (?)
        ) term_sentences
          ON clips.original_sentence_id = term_sentences.sentence_id
        AND is_valid IS NULL
        AND clips.client_id <> ?
        AND NOT EXISTS(
          SELECT clip_id
          FROM votes
          WHERE votes.clip_id = clips.id AND client_id = ?
          UNION ALL
          SELECT clip_id
          FROM reported_clips reported
          WHERE reported.clip_id = clips.id AND client_id = ?
          UNION ALL
          SELECT clip_id
          FROM skipped_clips skipped
          WHERE skipped.clip_id = clips.id AND client_id = ?
        )
        GROUP BY original_sentence_id
        LIMIT ?
      ) t
      ORDER BY RAND()
      LIMIT ?`,
      [
        locale_id,
        locale_id,
        client_id,
        await getTermIds(segments),
        await getTermIds(segments),
        client_id,
        client_id,
        client_id,
        client_id,
        SHUFFLE_SIZE,
        count,
      ]
    );
    for (const clip of clips) {
      clip.taxonomy = {
        name: clip.term_name,
        source: clip.term_sentence_source,
      };
    }

    return clips as DBClip[];
  }

  /**
   * Creates user_client if it doesn't exist and checks whether the given
   * auth_token matches it
   */
  async createOrVerifyUserClient(
    id: string,
    auth_token?: string
  ): Promise<boolean> {
    const guidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    const authRegex = /^\w{40}$/;

    if (!guidRegex.test(id) || (auth_token && !authRegex.test(auth_token))) {
      return false;
    }

    await this.mysql.query(
      `
        INSERT INTO user_clients (client_id, auth_token, username)
        VALUES (?, ?, '')
        ON DUPLICATE KEY UPDATE
          auth_token = IF(auth_token IS NULL, VALUES(auth_token), auth_token)
      `,
      [id, auth_token || null]
    );

    return Boolean(
      (
        await this.mysql.query(
          `
          SELECT 1
          FROM user_clients
          WHERE client_id = ? AND (auth_token = ? OR auth_token IS NULL)
        `,
          [id, auth_token || null]
        )
      )[0][0]
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
        /** Update the following:
         *
         *  updated_clips.is_valid:
         *    TRUE if it's been decided that it's a good clip.
         *    FALSE if it's been decided that it's a bad clip.
         *    NULL if it hasn't received enough votes yet.
         *
         *  updated_clips.validated_at:
         *    The last time is_valid changed, or NULL if is_valid is NULL.
         */
        UPDATE clips updated_clips
        /* This join allows us to determine a clip's is_valid status once, then
           use it to set multiple column values later. */
        INNER JOIN (
          SELECT
            id,
            CASE
              WHEN counts.upvotes >= 2 AND counts.upvotes > counts.downvotes
                THEN TRUE
              WHEN counts.downvotes >= 2 AND counts.downvotes > counts.upvotes
                THEN FALSE
              ELSE NULL
            END as is_valid
          FROM (
            SELECT
              clips.id AS id,
              COALESCE(SUM(votes.is_valid), 0)     AS upvotes,
              COALESCE(SUM(NOT votes.is_valid), 0) AS downvotes
            FROM clips
            LEFT JOIN votes ON clips.id = votes.clip_id
            WHERE clips.id = ${id}
            GROUP BY clips.id
          ) counts
        ) t ON updated_clips.id = t.id
        /* updated_clips.validated_at will only update when is_valid changes.
           The comparison is messy since we can't use <> directly on NULL. */
        SET updated_clips.validated_at = IF(
              IFNULL(t.is_valid, 2) <> IFNULL(updated_clips.is_valid, 2),  -- Cast NULL to 2 for the comparison.
              IF(ISNULL(t.is_valid), NULL, NOW()),  -- If is_valid has changed, update validated_at…
              updated_clips.validated_at            -- …otherwise, leave it the same.
            ),
            updated_clips.is_valid = t.is_valid
        WHERE updated_clips.id = ${id}
      `
    );

    await this.mysql.query(
      `UPDATE sentences
        SET has_valid_clip = EXISTS (SELECT * FROM clips WHERE original_sentence_id = ? AND is_valid = 1 LIMIT 1)
          WHERE id = ?`,
      [id, id]
    );
  }

  async saveClip({
    client_id,
    localeId,
    original_sentence_id,
    path,
    sentence,
  }: {
    client_id: string;
    localeId: number;
    original_sentence_id: string;
    path: string;
    sentence: string;
  }): Promise<void> {
    try {
      const [{ insertId }] = await this.mysql.query(
        `
          INSERT INTO clips (client_id, original_sentence_id, path, sentence, locale_id)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE created_at = NOW()
        `,
        [client_id, original_sentence_id, path, sentence, localeId]
      );
      await this.mysql.query(
        `
          UPDATE sentences
          SET
            clips_count = clips_count + 1,
            has_valid_clip = EXISTS (SELECT * FROM clips WHERE original_sentence_id = ? AND is_valid = 1 LIMIT 1)
          WHERE id = ?
        `,
        [original_sentence_id, original_sentence_id]
      );
      await this.mysql.query(
        `
          INSERT INTO clip_demographics (clip_id, demographic_id) (
            SELECT ?, id
            FROM demographics
            WHERE client_id = ?
            ORDER BY updated_at DESC
            LIMIT 1
          ) ON DUPLICATE KEY UPDATE clip_id = clip_id
        `,
        [insertId, client_id]
      );
    } catch (e) {
      console.error('error saving clip', e);
    }
  }
  async getAllClipCount(
    localeIds: number[]
  ): Promise<{ locale_id: number; count: number }[]> {
    const [rows] = await this.mysql.query(
      `
        SELECT locale_id, COUNT(*) AS count
        FROM clips
        WHERE locale_id IN (?)
        GROUP BY locale_id
      `,
      [localeIds]
    );
    return rows;
  }

  async getValidClipCount(
    localeIds: number[]
  ): Promise<{ locale_id: number; count: number }[]> {
    const [rows] = await this.mysql.query(
      `
        SELECT locale_id, COUNT(*) AS count
        FROM clips
        WHERE locale_id IN (?) AND is_valid
        GROUP BY locale_id
      `,
      [localeIds]
    );
    return rows;
  }

  async getClipsStats(
    locale?: string
  ): Promise<{ date: string; total: number; valid: number }[]> {
    const localeId = locale ? await getLocaleId(locale) : null;

    const intervals = [
      '100 YEAR',
      '12 MONTH',
      '9 MONTH',
      '6 MONTH',
      '3 MONTH',
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
              SELECT COUNT(*) as valid
              FROM clips
              WHERE clips.is_valid AND (
                SELECT created_at
                FROM votes
                WHERE votes.clip_id = clips.id
                ORDER BY created_at DESC
                LIMIT 1
              ) BETWEEN ${from} AND ${to} ${locale ? 'AND locale_id = ?' : ''}
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
    // It's necesary to manually create an array of all of the hours, because otherwise
    // if a time interval has no contributions, that hour will just get dropped entirely
    const hours = Array.from({ length: 10 }).map((_, i) => i);

    const [rows] = await this.mysql.query(
      `
        SELECT date, COUNT(DISTINCT activity.client_id) AS value
        FROM (
          SELECT (TIMESTAMP(DATE_FORMAT(NOW(), '%Y-%m-%d %H:00')) - INTERVAL hour HOUR) AS date
          FROM (${hours.map(i => `SELECT ${i} AS hour`).join(' UNION ')}) hours
        ) date_alias
        LEFT JOIN (
          SELECT created_at, client_id FROM user_client_activities
          WHERE created_at > (TIMESTAMP(DATE_FORMAT(NOW(), '%Y-%m-%d %H:00')) - INTERVAL 9 hour)
          ${locale ? 'AND locale_id = ?' : ''}
        ) activity ON created_at BETWEEN date AND (date + INTERVAL 1 HOUR)
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
    // It's necesary to manually create an array of all of the hours, because otherwise
    // if a time interval has no contributions, that hour will just get dropped entirely
    const hours = Array.from({ length: 10 }).map((_, i) => i);

    const [rows] = await this.mysql.query(
      `SELECT date, count(activity.created_at) AS value
          FROM (
            SELECT (TIMESTAMP(DATE_FORMAT(NOW(), '%Y-%m-%d %H:00')) - INTERVAL hour HOUR) AS date
            FROM (${hours
              .map(i => `SELECT ${i} AS hour`)
              .join(' UNION ')}) hours
          ) date_alias
          LEFT JOIN (
            SELECT created_at
            FROM clips
            WHERE clips.created_at > (TIMESTAMP(DATE_FORMAT(NOW(), '%Y-%m-%d %H:00')) - INTERVAL 9 hour)
            ${locale ? 'AND clips.locale_id = :locale_id' : ''}
            ${client_id ? 'AND clips.client_id = :client_id' : ''}

            UNION

            SELECT votes.created_at
            FROM votes
            LEFT JOIN clips ON votes.clip_id = clips.id
            WHERE votes.created_at > (TIMESTAMP(DATE_FORMAT(NOW(), '%Y-%m-%d %H:00')) - INTERVAL 9 hour)
            ${locale ? 'AND clips.locale_id = :locale_id' : ''}
            ${client_id ? 'AND votes.client_id = :client_id' : ''}
          ) activity ON created_at BETWEEN date AND (date + INTERVAL 1 HOUR)
          GROUP BY date
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
    return (
      await this.mysql.query('SELECT * FROM clips WHERE id = ? LIMIT 1', [id])
    )[0][0];
  }

  async findSentence(id: string) {
    return (
      await this.mysql.query(
        'SELECT locale_id, text FROM sentences WHERE id = ? LIMIT 1',
        [id]
      )
    )[0][0];
  }

  async getLanguages(): Promise<Language[]> {
    const [rows] = await this.mysql.query(
      `SELECT 
      l.id, 
      l.name, 
      l.target_sentence_count as target_sentence_count, 
      count(1) as total_sentence_count,
      l.is_contributable
        FROM locales l
        LEFT JOIN sentences s ON s.locale_id = l.id
        GROUP BY l.id`
    );
    return rows.map(
      (row: {
        id: number;
        name: string;
        is_contributable: boolean;
        target_sentence_count: number;
        total_sentence_count: number;
      }) => ({
        id: row.id,
        name: row.name,
        is_contributable: row.is_contributable,
        sentencesCount: {
          targetSentenceCount: row.target_sentence_count,
          currentCount: row.total_sentence_count,
        },
      })
    );
  }

  async getAllLanguages(): Promise<Language[]> {
    const [rows] = await this.mysql.query(
      `SELECT *
        FROM locales l
    `
    );
    return rows;
  }

  /**
   * Get all datasets. Filterable by type (singleword, delta, complete)
   *
   * @param {string} releaseType
   * @return {*}  {Promise<Language[]>}
   * @memberof DB
   */
  async getAllDatasets(releaseType: string): Promise<Datasets[]> {
    const [rows] = await this.mysql.query(
      `SELECT 
      l.id,
      l.name,
      l.release_dir,
      l.multilingual,
      l.bundle_date,
      l.release_date,
      l.total_clips_duration,
      l.valid_clips_duration,
      l.release_type,
      ld.checksum,
      ld.size,
      l.download_path,
      temp.languages_count
        FROM datasets l
        JOIN locale_datasets ld on l.id = ld.dataset_id
        JOIN (
          SELECT count(1) as languages_count, dataset_id
          FROM locale_datasets xld
          GROUP BY xld.dataset_id
        ) temp ON temp.dataset_id = l.id
        WHERE is_deprecated = false
        ${releaseType ? ` AND release_type = ?` : ''}
        GROUP BY l.id
        ORDER BY l.release_date DESC
    `,
      [releaseType]
    );
    return rows;
  }

  async getLanguageDatasetStats(languageCode: string): Promise<Language[]> {
    const [rows] = await this.mysql.query(
      `SELECT
      ld.id,
      ld.dataset_id,
      ld.locale_id,
      ld.total_clips_duration,
      ld.valid_clips_duration,
      ld.average_clips_duration,
      ld.total_users,
      ld.size,
      ld.checksum,
      d.release_date,
      d.name,
      d.release_dir,
      d.download_path
    FROM
      locale_datasets ld
    JOIN datasets d ON
      d.id = ld.dataset_id
    WHERE
      ld.locale_id = ?
      AND d.release_type in ("complete", "delta")
      AND d.is_deprecated = false
    ORDER BY
      d.release_date DESC
    `,
      [await getLocaleId(languageCode)]
    );
    return rows;
  }

  async getAllLanguagesWithDatasets(): Promise<Language[]> {
    const [rows] = await this.mysql.query(
      `SELECT DISTINCT l.name, l.id
        FROM locale_datasets ld
        JOIN locales l ON l.id = ld.locale_id 
    `
    );
    return rows;
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
    return (
      await this.mysql.query(
        `
        SELECT COUNT(id) AS count
        FROM clips
        WHERE created_at >= CURDATE() AND created_at < CURDATE() + INTERVAL 1 DAY
        ${locale ? 'AND locale_id = ?' : ''}
      `,
        locale ? [await getLocaleId(locale)] : []
      )
    )[0][0].count;
  }

  async getDailyVotesCount(locale?: string) {
    return (
      await this.mysql.query(
        `
        SELECT COUNT(votes.id) AS count
        FROM votes
        LEFT JOIN clips on votes.clip_id = clips.id
        WHERE votes.created_at >= CURDATE() AND votes.created_at < CURDATE() + INTERVAL 1 DAY
        ${locale ? 'AND locale_id = ?' : ''}
      `,
        locale ? [await getLocaleId(locale)] : []
      )
    )[0][0].count;
  }

  async getVariants(client_id: string, locale?: string) {
    const [variants] = await this.mysql.query(
      `
      SELECT name as lang, variant_token AS token, v.id AS variant_id, variant_name FROM variants v
      LEFT JOIN locales ON v.locale_id = locales.id
       ${locale ? 'WHERE locale_id = ?' : ''}
      `,
      locale ? [await getLocaleId(locale)] : []
    );

    if (!variants) return;

    const mappedVariants = variants.reduce((acc: any, curr: any) => {
      if (!acc[curr.lang]) {
        acc[curr.lang] = [];
      }

      const variant = {
        id: curr.variant_id,
        token: curr.token,
        name: curr.variant_name,
      };

      acc[curr.lang].push(variant);
      return acc;
    }, {});

    return mappedVariants;
  }

  async getAccents(client_id: string, locale?: string) {
    const [accents] = await this.mysql.query(
      `
      SELECT name as lang, accent_token AS token, a.id AS accent_id, accent_name, a.user_submitted FROM accents a
      LEFT JOIN locales ON a.locale_id = locales.id
      WHERE (NOT user_submitted OR client_id = ?)
      `,
      [client_id]
    );

    const mappedAccents = accents.reduce((acc: any, curr: any) => {
      if (!acc[curr.lang]) {
        acc[curr.lang] = { userGenerated: {}, preset: {}, default: {} };
      }

      const accent = {
        id: curr.accent_id,
        token: curr.token,
        name: curr.accent_name,
      };

      if (curr.accent_name === '') {
        // Each language has a default accent placeholder for unspecified accents
        acc[curr.lang].default = accent;
      } else if (curr.user_submitted) {
        // Note: currently the query only shows the user values that they created
        acc[curr.lang].userGenerated[curr.accent_id] = accent;
      } else {
        acc[curr.lang].preset[curr.accent_id] = accent;
      }

      return acc;
    }, {});

    return mappedAccents;
  }

  async createSkippedSentence(id: string, client_id: string) {
    // Sometimes stale sentences are being skipped which is unhandled w/o a trycatch
    try {
      await this.mysql.query(
        `
        INSERT INTO skipped_sentences (sentence_id, client_id) VALUES (?, ?)
      `,
        [id, client_id]
      );
    } catch (error) {
      console.error(
        `Unable to skip sentence (error message: ${error.message})`
      );
    }
  }

  async createSkippedClip(id: string, client_id: string) {
    try {
      await this.mysql.query(
        `
          INSERT INTO skipped_clips (clip_id, client_id) VALUES (?, ?)
        `,
        [id, client_id]
      );
    } catch (error) {
      console.error(`Unable to skip clip (error message: ${error.message})`);
    }
  }

  async saveActivity(client_id: string, locale: string) {
    try {
      await this.mysql.query(
        `
        INSERT INTO user_client_activities (client_id, locale_id) VALUES (?, ?)
      `,
        [client_id, await getLocaleId(locale)]
      );
    } catch (error) {
      console.error(
        `Unable to save activity (error message: ${error.message})`
      );
    }
  }

  async insertDownloader(locale: string, email: string, dataset: string) {
    try {
      await this.mysql.query(
        `
        INSERT INTO downloaders (locale_id, email, dataset_id) VALUES (?, ?, (SELECT id FROM datasets WHERE release_dir = ? LIMIT 1)) ON DUPLICATE KEY UPDATE created_at = NOW()
      `,
        [await getLocaleId(locale), email, dataset]
      );
    } catch (error) {
      console.error(
        `Unable to insert downloader (error message: ${error.message})`
      );
    }
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
              LEFT JOIN enroll teammate ON teams.id = teammate.team_id
                  AND challenges.id = teammate.challenge_id
                  AND teammate.enrolled_at BETWEEN start_date AND TIMESTAMPADD(WEEK, 2, start_date)
                  AND teammate.invited_by IS NOT NULL
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

  async hasChallengeEnded(challenge: ChallengeToken) {
    let challengeEnded = true;
    const [[row]] = await this.mysql.query(
      `SELECT TIMESTAMPADD(MINUTE, -TIMESTAMPDIFF(MINUTE, UTC_TIMESTAMP(), NOW()), start_date) AS start_date_utc
      FROM challenges
      WHERE url_token = ?;
      `,
      [challenge]
    );
    if (row) {
      // row.start_date_utc is utc time (timezone offset is 0);
      const startDateUtc = new Date(`${row.start_date_utc}Z`);
      challengeEnded = Date.now() > startDateUtc.valueOf() + THREE_WEEKS;
    }
    return challengeEnded;
  }

  async deleteClip(id: string) {
    await this.mysql.query(`DELETE FROM clip_demographics WHERE clip_id = ?`, [
      id,
    ]);
    await this.mysql.query(`DELETE FROM votes WHERE clip_id = ?;`, [id]);
    await this.mysql.query(`DELETE FROM clips WHERE id = ? LIMIT 1;`, [id]);
    console.log(`Deleted clip and votes for clip ID ${id}`);
  }

  async markInvalid(id: string) {
    await this.mysql.query(
      `UPDATE clips SET is_valid = 0 WHERE id = ? LIMIT 1;`,
      [id]
    );
  }

  async clipExists(client_id: string, sentence_id: string) {
    const [[row]] = await this.mysql.query(
      `
      SELECT id FROM clips WHERE client_id = ? AND original_sentence_id = ?
    `,
      [client_id, sentence_id]
    );

    return !!row;
  }
}
