import { getConfig } from '../../config-helper'
import Mysql, { getMySQLInstance } from './db/mysql'
import Schema from './db/schema'
import ClipTable, { DBClip } from './db/tables/clip-table'
import VoteTable from './db/tables/vote-table'
import {
  ChallengeToken,
  Sentence,
  TaxonomyToken,
  taxonomies,
  Language,
  Datasets,
  VariantData,
  AccentData,
  LanguageData,
} from 'common'
import lazyCache, {
  redisSetAddManyWithExpiry,
  redisSetMembers,
} from '../redis-cache'
import { option as O, task as T, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { DatasetStatistics } from '../../core/datasets/types/dataset'
import {
  FindVariantsBySentenceIdsResult,
  findVariantsBySentenceIdsInDb,
} from '../../application/repository/variant-repository'
import { TimeUnits } from 'common'

// Flag to disable taxonomy prioritization
const DISABLE_TAXONOMY_PRIORITY = true

// When getting new sentences/clips we need to fetch a larger pool and shuffle it to make it less
// likely that different users requesting at the same time get the same data
const SHUFFLE_SIZE = 500

// We select this much extra because some might be removed later
// And we increased cache duration to cover multiple postings
const EXTRA_COUNT = 5
const EXTRA_COUNT_MULTIPLIER = 10

// Ref JIRA ticket OI-1300 - we want to exclude languages with fewer than 500k active global speakers
// from the single sentence record limit, because they are unlikely to amass enough unique speakers
// to benefit from single sentence constraints
// const SINGLE_SENTENCE_LIMIT = ['en', 'de', 'fr', 'kab', 'rw', 'es'] // these values are from 5 years ago
// Changed the logic to include multiple levels of recording per sentence limits
const MAX_CLIP_PER_SENTENCE = 15
const LIMITED_CLIPS_PER_SENTENCE: { [locale: string]: number } = {
  de: 1,
  fr: 1,
  rw: 1,
  en: 2,
  es: 2,
  kab: 2,
}

const teammate_subquery =
  '(SELECT team_id FROM enroll e LEFT JOIN challenges c ON e.challenge_id = c.id WHERE e.client_id = ? AND c.url_token = ?)'
const self_subcondition = '(visible = 0 AND user_clients.client_id = ?)'
const participantConditions = {
  self: `user_clients.client_id = ?`,
  team: `(visible OR ${self_subcondition}) AND enroll.team_id = ${teammate_subquery}`,
  general: `(
                ${self_subcondition}
                OR (visible = 1)
                OR (visible = 2 AND teams.id = ${teammate_subquery})
              )`,
}

const redisKeyPerUserSentenceIdSet = (client_id: string) => {
  return `sentences:to-speak-by-${client_id}`
}

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
  `
}

let termIds: { [name: string]: number }

const getLanguageMap = lazyCache(
  `get-language-id-map`,
  async () => {
    const [rows] = await getMySQLInstance().query(
      'SELECT id, name FROM locales'
    )
    //{en: 1, fr:2, ...}
    return rows.reduce(
      (obj: any, { id, name }: any) => ({
        ...obj,
        [name]: id,
      }),
      {}
    )
  },
  TimeUnits.DAY,
  3 * TimeUnits.MINUTE
)

export async function getLocaleId(locale: string): Promise<number> {
  if (locale === 'overall') return null

  const languageIds = await getLanguageMap()

  if (!languageIds) {
    return null
  }

  return languageIds[locale]
}

export function getLocaleIdF(locale: string): TE.TaskEither<Error, number> {
  const languageIds = TE.tryCatch(
    () => getLanguageMap(),
    (err: Error) => err
  )

  return pipe(
    languageIds,
    TE.chain(languageIds =>
      typeof languageIds[locale] === 'number'
        ? TE.right(languageIds[locale])
        : TE.left(Error(`Locale ${locale} does not exist`))
    )
  )
}

export async function getTermIds(term_names: string[]): Promise<number[]> {
  if (!termIds) {
    const [rows] = await getMySQLInstance().query(
      `SELECT id, term_sentence_source FROM taxonomy_terms`
    )
    termIds = rows.reduce(
      (obj: any, { id, term_sentence_source }: any) => ({
        ...obj,
        [term_sentence_source]: id,
      }),
      {}
    )
  }

  return term_names.map(name => termIds[name])
}

export default class DB {
  clip: ClipTable
  mysql: Mysql
  schema: Schema
  vote: VoteTable

  constructor() {
    this.mysql = getMySQLInstance()

    this.clip = new ClipTable(this.mysql)
    this.vote = new VoteTable(this.mysql)

    this.schema = new Schema(this.mysql)
  }

  /**
   * Normalize email address as input.
   */
  private formatEmail(email?: string): string {
    if (!email) {
      return ''
    }
    return email.toLowerCase()
  }

  /**
   * Check whether target segment is live for this language
   */
  private getPrioritySegments(locale: string): string[] {
    return Object.keys(taxonomies)
      .filter((taxonomyToken: TaxonomyToken) => {
        return taxonomies[taxonomyToken].locales.includes(locale)
      })
      .map((taxonomyToken: TaxonomyToken) => taxonomies[taxonomyToken].source)
  }

  /**
   * Ensure the database is setup.
   */
  async ensureSetup(): Promise<void> {
    return this.schema.ensure()
  }

  /**
   * I hope you know what you're doing.
   */
  async drop(): Promise<void> {
    if (!getConfig().PROD) {
      await this.schema.dropDatabase()
    }
  }

  /**
   * Get random selection from array
   */
  private getRandomSelection<T>(array: T[], count: number): T[] {
    const shuffled = [...array]

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled.slice(0, count)
  }

  /**
   * Shuffle entire array (for when we need all elements randomized)
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  async getSentenceCountByLocale(): Promise<
    {
      locale_id: number
      count: number
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
    )
    return rows
  }

  /**
   * Get valid clips per language (not random anymore, we randomize in code per user)
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
        SELECT
          c.id as id,
          c.path as path,
          s.has_valid_clip as has_valid_clip,
          c.client_id as client_id,
          s.text as sentence,
          c.original_sentence_id as original_sentence_id
        FROM clips c
        INNER JOIN sentences s ON s.id = c.original_sentence_id
        WHERE c.locale_id = ?
          AND c.is_valid IS NULL
        LIMIT ?
      `,
      [languageId, limit]
    )

    return rows
  }

  async getClipCount(): Promise<number> {
    return this.clip.getCount()
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
    )[0]
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
    )[0]
  }

  /**
   * Make sure we have a fully updated schema.
   */
  async ensureLatest(): Promise<void> {
    await this.schema.upgrade()
  }

  /**
   * End connection to the database.
   */
  endConnection(): void {
    this.mysql.endConnection()
  }

  async findSentencesNeedingClips(
    client_id: string,
    locale: string,
    count: number
  ): Promise<Sentence[]> {
    let taxonomySentences: Sentence[] = []
    let regularSentences: Sentence[] = []
    const locale_id = await getLocaleId(locale)

    const sentenceLimit =
      LIMITED_CLIPS_PER_SENTENCE[locale] || MAX_CLIP_PER_SENTENCE
    const countWithExtras = count + EXTRA_COUNT_MULTIPLIER * EXTRA_COUNT

    // Make sure to exclude recently recorded sentences by the user (from Redis cache)
    // to overcome race condition caused by INSERT being slower than SELECT
    const redisSet = await redisSetMembers(
      redisKeyPerUserSentenceIdSet(client_id)
    )

    if (!DISABLE_TAXONOMY_PRIORITY) {
      const prioritySegments = this.getPrioritySegments(locale)
      // If there are any, get some taxonomy ones first (priority)
      if (prioritySegments.length) {
        taxonomySentences = await this.findSentencesMatchingTaxonomy(
          client_id,
          locale_id,
          countWithExtras,
          prioritySegments
        )
      }
      // still prevent race condition
      taxonomySentences = taxonomySentences.filter(
        (s: Sentence) => !redisSet.includes(s.id)
      )
    }

    // If not enough collected (or none) from taxonomy, fill with regular ones
    if (taxonomySentences.length < count) {
      // This now gets 500 (SHUFFLE_SIZE) sentences
      // We might like to CACHE these for a while
      regularSentences = await this.findSentencesWithFewClips(
        client_id,
        locale_id,
        SHUFFLE_SIZE,
        sentenceLimit
      )
      const nonTaxonomyCount = count - taxonomySentences.length // must be positive, this much we need more
      regularSentences = this.getRandomSelection(
        regularSentences.filter((s: Sentence) => !redisSet.includes(s.id)), // filter out redis ones
        nonTaxonomyCount // get a random subset, only what we need
      )
    }

    const totalSentences = (
      taxonomySentences.concat(regularSentences) || []
    ).slice(0, count) // make sure to only return the requested amount

    // These sentences have been given to this user - ADD to Redis for 1 hour to prevent re-selection
    // We now use redisSetAddManyWithExpiry instead of redisSetFillManyWithExpiry to accumulate
    // previously recorded sentences, not replace them
    // Beware, each time new sentences are added, the expiry is set to 1 hour from that moment
    // We dropped the duration, because now we do prevent corrupt data
    await redisSetAddManyWithExpiry(
      redisKeyPerUserSentenceIdSet(client_id),
      totalSentences.map(s => s.id),
      TimeUnits.HOUR
    )
    return this.appendMetadataToSentence(totalSentences)
  }

  private appendMetadataToSentence = async (sentences: Sentence[]) => {
    if (sentences.length === 0) return []

    const sentenceIds = sentences.map(c => c.id)

    const sentenceVariants = await pipe(
      sentenceIds,
      findVariantsBySentenceIdsInDb,
      TE.getOrElse(() => T.of({} as FindVariantsBySentenceIdsResult))
    )()

    for (const sentence of sentences) {
      const sentenceId = sentence.id
      const variant = sentenceVariants[sentenceId] || O.none
      sentence.variant = pipe(
        variant,
        O.getOrElse(() => null)
      )
    }

    return sentences
  }

  // Note: no RAND() here anymore — deterministic slice for performance, randomization done in app
  async findSentencesWithFewClips(
    client_id: string,
    locale_id: number,
    limit: number,
    sentenceLimit: number
  ): Promise<Sentence[]> {
    const [rows] = await this.mysql.query(
      `
      SELECT s.id, s.text
      FROM sentences AS s
      WHERE s.is_used
        AND s.locale_id = ?
        AND (s.has_valid_clip = 0 OR s.clips_count < ${sentenceLimit})
        AND NOT EXISTS (
          SELECT 1 FROM taxonomy_entries te WHERE te.sentence_id = s.id
        )
        AND NOT EXISTS (
          SELECT 1 FROM clips c
          WHERE c.original_sentence_id = s.id AND c.client_id = ?
        )
        AND NOT EXISTS (
          SELECT 1 FROM skipped_sentences ss
          WHERE ss.sentence_id = s.id AND ss.client_id = ?
        )
        AND NOT EXISTS (
          SELECT 1 FROM reported_sentences rs
          WHERE rs.sentence_id = s.id AND rs.client_id = ?
        )
      ORDER BY s.clips_count ASC, s.id ASC
      LIMIT ?
    `,
      [locale_id, client_id, client_id, client_id, limit]
    )
    return (rows || []).map(({ id, text }: Sentence) => ({
      id,
      text,
    }))
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
    )

    return (rows || []).map(
      ({ id, text, term_name, term_sentence_source }: any) => ({
        id,
        text,
        taxonomy: { name: term_name, source: term_sentence_source },
      })
    )
  }

  async findClipsNeedingValidation(
    client_id: string,
    locale: string,
    count: number
  ): Promise<DBClip[]> {
    let taxonomySentences: DBClip[] = []
    const locale_id = await getLocaleId(locale)

    const sentenceLimit =
      LIMITED_CLIPS_PER_SENTENCE[locale] || MAX_CLIP_PER_SENTENCE
    const prioritySegments = this.getPrioritySegments(locale)

    if (prioritySegments.length) {
      taxonomySentences = await this.findClipsMatchingTaxonomy(
        client_id,
        locale_id,
        count,
        prioritySegments
      )
    }
    const regularSentences =
      taxonomySentences.length >= count
        ? []
        : await this.findClipsWithFewVotes(
            client_id,
            locale_id,
            count - taxonomySentences.length,
            sentenceLimit
          )

    return taxonomySentences.concat(regularSentences)
  }

  /*
    Our issue here lies in the inefficiency of the business logic and diversity of languages.
    TODO: Handle this with AdaptiveLazyCache with random selection / reservation logic
  */
  async findClipsWithFewVotes(
    client_id: string,
    locale_id: number,
    count: number,
    sentenceLimit: number
  ): Promise<DBClip[]> {
    // get cached clips for given language
    /*
    In the previous implementation where RAND() was in the SQL:
    Real world measures over 7 days (for 10k records, 1 min cache dur, 3 min lock dur - which was causing trouble):
    - Avg. query time: 2.98 secs - Worst case: 2 min 56 secs (a later measure was 4.3 min)
    - Avg rows scanned: 434,741 - Avg rows returned: 9,243
    => Worst case is caused by large number of records which are not used at all (happens in prominent languages)...
    Most of the time use of RAND() in SQL result in too many row scans, thus IO delays - if the LIMIT is large.
    Thus, in this implementation we moved randomization to code.
    */
    const cachedClips: DBClip[] = await lazyCache(
      `new-clips-per-language-${locale_id}`,
      async () => {
        // The returned values are now NOT RANDOMIZED
        // We prefer newer recordings, they will have less validated ones
        return await this.getClipsToBeValidated(locale_id, 20_000) // Increase count from 10k
      },
      10 * TimeUnits.MINUTE, // Increase cache duration considerably from 1 min
      5 * TimeUnits.MINUTE, // Now we have much much better fetch time as we removed RAND(), measured <1 sec, but let's cover concurrency
      false // no stale data
      // No prefetching, to retire old caches without contributors
    )()

    //filter out users own clips
    const otherUserClips: DBClip[] = cachedClips.filter(
      (row: DBClip) => row.client_id != client_id
    )

    // potentially cache-able (does not cause much load as of today)
    // get users previously interacted clip ids
    const [submittedUserClipIds] = await this.mysql.query(
      `
      SELECT clip_id FROM votes WHERE client_id = ?
      UNION ALL
      SELECT clip_id FROM reported_clips reported WHERE client_id = ?
      UNION ALL
      SELECT clip_id FROM skipped_clips skipped WHERE client_id = ?
      `,
      [client_id, client_id, client_id]
    )

    //remove dups and store as a flat set
    const skipClipIds: Set<number> = new Set(
      submittedUserClipIds.map((row: { clip_id: number }) => row.clip_id)
    )

    //get clips that a user hasn't already seen
    const eligibleClips = new Set(
      otherUserClips.filter((clip: DBClip) => {
        //only return clips that have not seen and not been validated before
        return !skipClipIds.has(clip.id) && clip.has_valid_clip === 0
      })
    )

    // Return random selection from eligible clips
    if (eligibleClips.size > 0 && eligibleClips.size <= count) {
      // less than requested, so shuffle and return
      return this.shuffleArray(Array.from(eligibleClips))
    } else if (eligibleClips.size > count) {
      // more than requested, so return requested count from randomized array
      return this.getRandomSelection(Array.from(eligibleClips), count)
    }

    // zero case - try to re-select
    const [clips] = await this.mysql.query(
      `
      SELECT *
      FROM (
        SELECT clips.*
        FROM clips
        LEFT JOIN sentences on clips.original_sentence_id = sentences.id
        WHERE is_valid IS NULL
          AND clips.locale_id = ?
          AND client_id <> ?
          AND (sentences.has_valid_clip = 0 OR sentences.clips_count < ${sentenceLimit})
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
    )

    return clips as DBClip[]
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
    )
    for (const clip of clips) {
      clip.taxonomy = {
        name: clip.term_name,
        source: clip.term_sentence_source,
      }
    }

    return clips as DBClip[]
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
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    const authRegex = /^\w{40}$/

    if (!guidRegex.test(id) || (auth_token && !authRegex.test(auth_token))) {
      return false
    }

    await this.mysql.query(
      `
        INSERT INTO user_clients (client_id, auth_token, username)
        VALUES (?, ?, '')
        ON DUPLICATE KEY UPDATE
          auth_token = IF(auth_token IS NULL, VALUES(auth_token), auth_token)
      `,
      [id, auth_token || null]
    )

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
    )
  }

  async saveVote(id: string, client_id: string, is_valid: string) {
    await this.createOrVerifyUserClient(client_id)
    await this.mysql.query(
      `
      INSERT INTO votes (clip_id, client_id, is_valid) VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE is_valid = VALUES(is_valid)
    `,
      [id, client_id, is_valid ? 1 : 0]
    )

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
    )

    await this.mysql.query(
      `UPDATE sentences
        SET has_valid_clip = EXISTS (SELECT * FROM clips WHERE original_sentence_id = ? AND is_valid = 1 LIMIT 1)
          WHERE id = ?`,
      [id, id]
    )
  }

  async saveClip({
    client_id,
    localeId,
    original_sentence_id,
    path,
    sentence,
    duration,
  }: {
    client_id: string
    localeId: number
    original_sentence_id: string
    path: string
    sentence: string
    duration: number
  }): Promise<void> {
    // Do the insert/updates
    try {
      const [{ insertId }] = await this.mysql.query(
        `
          INSERT INTO clips (client_id, original_sentence_id, path, sentence, locale_id, duration)
          VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE created_at = NOW()
        `,
        [client_id, original_sentence_id, path, sentence, localeId, duration]
      )
      await this.mysql.query(
        `
          UPDATE sentences
          SET
            clips_count = clips_count + 1,
            has_valid_clip = EXISTS (SELECT * FROM clips WHERE original_sentence_id = ? AND is_valid = 1 LIMIT 1)
          WHERE id = ?
        `,
        [original_sentence_id, original_sentence_id]
      )
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
      )
    } catch (e) {
      console.error('error saving clip', e)
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
    )
    return rows
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
    )
    return rows
  }

  async getInvalidClipCount(
    localeIds: number[]
  ): Promise<{ locale_id: number; count: number }[]> {
    const [rows] = await this.mysql.query(
      `
        SELECT locale_id, COUNT(*) AS count
        FROM clips
        WHERE locale_id IN (?) AND is_valid IS FALSE
        GROUP BY locale_id
      `,
      [localeIds]
    )
    return rows
  }

  async getClipsStats(
    locale?: string
  ): Promise<{ date: string; total: number; valid: number }[]> {
    const localeId = locale ? await getLocaleId(locale) : null

    const intervals = [
      '100 YEAR',
      '12 MONTH',
      '9 MONTH',
      '6 MONTH',
      '3 MONTH',
      '0 HOUR',
    ]
    const ranges = intervals
      .map(interval => 'NOW() - INTERVAL ' + interval)
      .reduce(
        (ranges, interval, i, intervals) =>
          i + 1 === intervals.length
            ? ranges
            : [...ranges, [interval, intervals[i + 1]]],
        []
      )

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
    )

    return results.reduce((totals, [[[{ date, total }]], [[{ valid }]]], i) => {
      const last = totals[totals.length - 1]
      return totals.concat({
        date,
        total: (last ? last.total : 0) + (Number(total) || 0),
        valid: (last ? last.valid : 0) + (Number(valid) || 0),
      })
    }, [])
  }

  async getVoicesStats(
    locale?: string
  ): Promise<{ date: string; value: number }[]> {
    // It's necesary to manually create an array of all of the hours, because otherwise
    // if a time interval has no contributions, that hour will just get dropped entirely
    const hours = Array.from({ length: 10 }).map((_, i) => i)

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
    )

    return rows
  }

  async getContributionStats(
    locale?: string,
    client_id?: string
  ): Promise<{ date: string; value: number }[]> {
    // It's necesary to manually create an array of all of the hours, because otherwise
    // if a time interval has no contributions, that hour will just get dropped entirely
    const hours = Array.from({ length: 10 }).map((_, i) => i)

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
    )

    return rows
  }

  async empty() {
    const [tables] = await this.mysql.rootExec('SHOW TABLES')
    const tableNames = tables
      .map((table: any) => Object.values(table)[0])
      .filter((tableName: string) => tableName !== 'migrations')
    await this.mysql.rootExec('SET FOREIGN_KEY_CHECKS = 0')
    for (const tableName of tableNames) {
      await this.mysql.rootExec('TRUNCATE TABLE ' + tableName)
    }
    await this.mysql.rootExec('SET FOREIGN_KEY_CHECKS = 1')
  }

  async findClip(id: string) {
    return (
      await this.mysql.query('SELECT * FROM clips WHERE id = ? LIMIT 1', [id])
    )[0][0]
  }

  async findSentence(id: string) {
    return (
      await this.mysql.query(
        'SELECT locale_id, text FROM sentences WHERE id = ? LIMIT 1',
        [id]
      )
    )[0][0]
  }

  async getAverageSecondsPerClip(
    localeId: number
  ): Promise<{ avg_seconds_per_clip: number }> {
    const [[row]] = await this.mysql.query(
      `
        SELECT AVG(duration)/1000 as avg_seconds_per_clip
        FROM clips
        WHERE duration > 0
        AND locale_id = ?
      `,
      [localeId]
    )

    return {
      avg_seconds_per_clip: Number(row.avg_seconds_per_clip),
    }
  }

  async getLanguageSentenceCounts(
    localeId: number
  ): Promise<{ locale_id: number; count: number }> {
    const [[row]] = await this.mysql.query(
      `
        SELECT COUNT(*) as total_sentence_count
        FROM sentences
        WHERE is_used = TRUE
        AND locale_id = ?
      `,
      [localeId]
    )

    return {
      locale_id: localeId,
      count: row.total_sentence_count,
    }
  }

  async getLanguages(): Promise<Language[]> {
    const [rows] = await this.mysql.query(
      `
      SELECT
        l.id,
        l.name,
        l.target_sentence_count as target_sentence_count,
        COALESCE(s.total_sentence_count, 0) as total_sentence_count,
        l.is_contributable
      FROM locales l
      LEFT JOIN (
        SELECT locale_id, COUNT(*) as total_sentence_count
        FROM sentences
        WHERE is_validated = TRUE
        GROUP BY locale_id
      ) s ON l.id = s.locale_id
      `
    )

    const lastFetched = new Date()

    return rows.map(
      (row: {
        id: number
        name: string
        is_contributable: boolean
        target_sentence_count: number
        total_sentence_count: number
      }) => ({
        id: row.id,
        name: row.name,
        is_contributable: row.is_contributable,
        sentencesCount: {
          targetSentenceCount: row.target_sentence_count,
          currentCount: row.total_sentence_count,
        },
        lastFetched,
      })
    )
  }

  async getAllLanguages(): Promise<Language[]> {
    const [rows] = await this.mysql.query(
      `
        SELECT *
        FROM locales l
        WHERE name <> 'unknown'
      `
    )
    return rows
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
    )
    return rows
  }

  async getLanguageDatasetStats(
    languageCode: string
  ): Promise<Omit<DatasetStatistics, 'splits'>[]> {
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
    )
    return rows
  }

  async getAllLanguagesWithDatasets(): Promise<Language[]> {
    const [rows] = await this.mysql.query(
      `SELECT DISTINCT l.name, l.id
        FROM locale_datasets ld
        JOIN locales l ON l.id = ld.locale_id
    `
    )
    return rows
  }

  async getRequestedLanguages(): Promise<string[]> {
    const [rows] = await this.mysql.query(
      'SELECT language FROM requested_languages'
    )
    return rows.map((row: any) => row.language)
  }

  async findRequestedLanguageId(language: string): Promise<number | null> {
    const [[row]] = await this.mysql.query(
      'SELECT * FROM requested_languages WHERE LOWER(language) = LOWER(?) LIMIT 1',
      [language]
    )
    return row ? row.id : null
  }

  async createLanguageRequest(language: string, client_id: string) {
    language = language.trim()
    let requestedLanguageId = await this.findRequestedLanguageId(language)
    if (!requestedLanguageId) {
      await this.mysql.query(
        'INSERT INTO requested_languages (language) VALUES (?)',
        [language]
      )
      requestedLanguageId = await this.findRequestedLanguageId(language)
    }
    await this.mysql.query(
      `
        INSERT INTO language_requests (requested_languages_id, client_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE client_id = client_id
      `,
      [requestedLanguageId, client_id]
    )
  }

  async getUserClient(client_id: string) {
    const [[row]] = await this.mysql.query(
      'SELECT * FROM user_clients WHERE client_id = ?',
      [client_id]
    )
    return row
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
    )[0][0].count
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
    )[0][0].count
  }

  //
  // Support for Language Record Arrays
  //

  async getCombinedLanguageData(): Promise<LanguageData[]> {
    // LookUp Maps
    const variantMap = new Map<number, VariantData[]>()
    const accentMap = new Map<number, AccentData[]>()
    // Variants
    const [variant_rows] = await this.mysql.query(
      `
        SELECT
          id,
          variant_token AS code,
          variant_name  AS name,
          type,
          locale_id
        FROM variants
      `
    )
    if (variant_rows && Array.isArray(variant_rows)) {
      for (const variant of variant_rows as VariantData[]) {
        const localeId = variant.locale_id
        if (!variantMap.has(localeId)) {
          variantMap.set(localeId, [])
        }
        variantMap.get(localeId).push(variant)
      }
    }
    // Predefined Accents
    const [accent_rows] = await this.mysql.query(
      `
        SELECT
          id,
          accent_token AS code,
          accent_name  AS name,
          locale_id
        FROM accents
        WHERE NOT user_submitted
          AND accent_token != 'unspecified'
      `
    )
    if (accent_rows && Array.isArray(accent_rows)) {
      for (const accent of accent_rows as AccentData[]) {
        const localeId = accent.locale_id // or whatever foreign key you use
        if (!accentMap.has(localeId)) {
          accentMap.set(localeId, [])
        }
        accentMap.get(localeId).push(accent)
      }
    }

    // Language records
    const language_rows = await this.getAllLanguages()
    const language_data: LanguageData[] =
      !language_rows || language_rows.length === 0
        ? []
        : language_rows.map(language => ({
            id: language.id,
            code: language.name,
            target_sentence_count: language.target_sentence_count,
            english_name: language.english_name ?? undefined,
            native_name: language.native_name,
            is_contributable: Number(language.is_contributable),
            is_translated: Number(language.is_translated),
            text_direction: language.text_direction,
            variants: variantMap.get(language.id) || [],
            predefined_accents: accentMap.get(language.id) || [],
          }))

    return language_data
  }

  // Regular/existing

  async getVariants(locale?: string) {
    const [variants] = await this.mysql.query(
      `
      SELECT name as lang, variant_token AS tag, v.id AS variant_id, variant_name FROM variants v
      LEFT JOIN locales ON v.locale_id = locales.id
       ${locale ? 'WHERE locale_id = ?' : ''}
      `,
      locale ? [await getLocaleId(locale)] : []
    )

    if (!variants) return

    const mappedVariants = variants.reduce((acc: any, curr: any) => {
      if (!acc[curr.lang]) {
        acc[curr.lang] = []
      }

      const variant = {
        id: curr.variant_id,
        tag: curr.tag,
        name: curr.variant_name,
      }

      acc[curr.lang].push(variant)
      return acc
    }, {})

    return mappedVariants
  }

  async getAccents(client_id: string, locale?: string) {
    const [accents] = await this.mysql.query(
      `
      SELECT name as lang, accent_token AS token, a.id AS accent_id, accent_name, a.user_submitted FROM accents a
      LEFT JOIN locales ON a.locale_id = locales.id
      WHERE (NOT user_submitted OR client_id = ?)
      `,
      [client_id]
    )

    const mappedAccents = accents.reduce((acc: any, curr: any) => {
      if (!acc[curr.lang]) {
        acc[curr.lang] = { userGenerated: {}, preset: {}, default: {} }
      }

      const accent = {
        id: curr.accent_id,
        token: curr.token,
        name: curr.accent_name,
      }

      if (curr.accent_name === '') {
        // Each language has a default accent placeholder for unspecified accents
        acc[curr.lang].default = accent
      } else if (curr.user_submitted) {
        // Note: currently the query only shows the user values that they created
        acc[curr.lang].userGenerated[curr.accent_id] = accent
      } else {
        acc[curr.lang].preset[curr.accent_id] = accent
      }

      return acc
    }, {})

    return mappedAccents
  }

  async createSkippedSentence(id: string, client_id: string) {
    // Sometimes stale sentences are being skipped which is unhandled w/o a trycatch
    try {
      await this.mysql.query(
        `
        INSERT INTO skipped_sentences (sentence_id, client_id) VALUES (?, ?)
      `,
        [id, client_id]
      )
    } catch (error) {
      console.error(`Unable to skip sentence (error message: ${error.message})`)
    }
  }

  async createSkippedClip(id: string, client_id: string) {
    try {
      // UPDATE clip_id = clip_id is intentionally a no-op (required by MySQL syntax)
      // This prevents errors on retry while maintaining UNIQUE KEY (client_id, clip_id)
      await this.mysql.query(
        `
          INSERT INTO skipped_clips (clip_id, client_id) VALUES (?, ?)
          ON DUPLICATE KEY UPDATE clip_id = clip_id
        `,
        [id, client_id]
      )
    } catch (error) {
      console.error(`Unable to skip clip (error message: ${error.message})`)
    }
  }

  async saveActivity(client_id: string, locale: string) {
    try {
      await this.mysql.query(
        `
        INSERT INTO user_client_activities (client_id, locale_id) VALUES (?, ?)
      `,
        [client_id, await getLocaleId(locale)]
      )
    } catch (error) {
      console.error(`Unable to save activity (error message: ${error.message})`)
    }
  }

  async insertDownloader(locale: string, email: string, dataset: string) {
    try {
      await this.mysql.query(
        `
        INSERT INTO downloaders (locale_id, email, dataset_id) VALUES (?, ?, (SELECT id FROM datasets WHERE release_dir = ? LIMIT 1)) ON DUPLICATE KEY UPDATE created_at = NOW()
      `,
        [await getLocaleId(locale), email, dataset]
      )
    } catch (error) {
      console.error(
        `Unable to insert downloader (error message: ${error.message})`
      )
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
    )
    return row
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
    )
    return row
  }

  async hasChallengeEnded(challenge: ChallengeToken) {
    let challengeEnded = true
    const [[row]] = await this.mysql.query(
      `SELECT TIMESTAMPADD(MINUTE, -TIMESTAMPDIFF(MINUTE, UTC_TIMESTAMP(), NOW()), start_date) AS start_date_utc
      FROM challenges
      WHERE url_token = ?;
      `,
      [challenge]
    )
    if (row) {
      // row.start_date_utc is utc time (timezone offset is 0);
      const startDateUtc = new Date(`${row.start_date_utc}Z`)
      challengeEnded = Date.now() > startDateUtc.valueOf() + 3 * TimeUnits.WEEK
    }
    return challengeEnded
  }

  async deleteClip(id: string) {
    await this.mysql.query(`DELETE FROM clip_demographics WHERE clip_id = ?`, [
      id,
    ])
    await this.mysql.query(`DELETE FROM votes WHERE clip_id = ?;`, [id])
    await this.mysql.query(`DELETE FROM clips WHERE id = ? LIMIT 1;`, [id])
    console.log(`Deleted clip and votes for clip ID ${id}`)
  }

  async markInvalid(id: string) {
    await this.mysql.query(
      `UPDATE clips SET is_valid = 0 WHERE id = ? LIMIT 1;`,
      [id]
    )
  }

  async clipExists(client_id: string, sentence_id: string) {
    const [[row]] = await this.mysql.query(
      `
      SELECT id FROM clips WHERE client_id = ? AND original_sentence_id = ?
    `,
      [client_id, sentence_id]
    )

    return !!row
  }
}
