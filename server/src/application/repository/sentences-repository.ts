import { option as O, taskEither as TE, taskOption as TO } from 'fp-ts'
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/lib/function'
import { MysqlError } from 'mysql2Types'
import { UnvalidatedSentence } from '../../core/sentences/types'
import { SentencesForReviewRow } from '../../infrastructure/db/types'
import Mysql, { getMySQLInstance } from '../../lib/model/db/mysql'
import { createSentenceId } from '../../lib/utility'
import {
  createDatabaseError,
  createSentenceRepositoryError,
} from '../helper/error-helper'
import { ApplicationError } from '../types/error'
import { SentenceSubmission } from '../types/sentence-submission'
import { UserClientVariant } from '../../core/variants/user-client-variant'
import { queryDb } from '../../infrastructure/db/mysql'
import { Variant } from '../../core/variants/variant'
import { Sentence } from 'common'
import { cleanText } from '../text-cleaner'

const mysql2 = require('mysql2/promise')

const db = getMySQLInstance()

const DUPLICATE_KEY_ERR = 1062
const BATCH_SIZE = 1000
const VARIANT_SENTENCE_LIMIT = 1000

export type SaveSentence = (
  sentenceSubmission: SentenceSubmission
) => TE.TaskEither<ApplicationError, void>

export type FindDomainIdByName = (
  domainName: string
) => TE.TaskEither<ApplicationError, O.Option<number>>

export type FindSentencesForReviewParams = {
  localeId: number
  clientId: string
  userClientVariant: O.Option<UserClientVariant>
  reviewSentencesWithoutVariant: boolean
}

const insertSentenceTransaction = async (
  db: Mysql,
  sentence: SentenceSubmission
) => {
  sentence.sentence = cleanText(sentence.sentence)
  const sentenceId = createSentenceId(sentence.sentence, sentence.locale_id)
  const conn = await mysql2.createConnection(db.getMysqlOptions())
  const variant_id = pipe(
    sentence.variant_id,
    O.getOrElse(() => null)
  )
  const domain_ids = pipe(
    sentence.domain_ids,
    O.getOrElse(() => [] as number[])
  )

  try {
    await conn.beginTransaction()
    await conn.query(
      `
        INSERT INTO sentences (id, text, source, locale_id)
        VALUES (?, ?, ?, ?);
      `,
      [sentenceId, sentence.sentence, cleanText(sentence.source), sentence.locale_id]
    )

    await conn.query(
      `
        INSERT INTO sentence_metadata(sentence_id, client_id, variant_id)
        VALUES (?, ?, ?);
      `,
      [sentenceId, sentence.client_id, variant_id]
    )

    for (const domainId of domain_ids) {
      await conn.query(
        `
          INSERT INTO sentence_domains(sentence_id, domain_id)
          VALUES (?, ?);
        `,
        [sentenceId, domainId]
      )
    }

    await conn.commit()
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    await conn.end()
  }
}

type BulkSentenceOptions = {
  isUsed: boolean
  isValidated: boolean
}

const insertBulkSentencesTransaction = async (
  db: Mysql,
  sentences: SentenceSubmission[],
  options: BulkSentenceOptions = { isUsed: true, isValidated: true }
) => {
  const sentence_values: any = []
  const sentence_metadata_values: any = []
  const sentence_domain_values: [string, number][] = []

  sentences.forEach(submission => {
    submission.sentence = cleanText(submission.sentence)
    const sentenceId = createSentenceId(
      submission.sentence,
      submission.locale_id
    )
    sentence_values.push([
      sentenceId,
      submission.sentence,
      cleanText(submission.source),
      submission.locale_id,
      options.isUsed ? 1 : 0, // is_used = 1
      options.isValidated ? 1 : 0, // is_validated = 1
    ])

    const variant_id = pipe(
      submission.variant_id,
      O.getOrElse(() => null)
    )

    sentence_metadata_values.push([
      sentenceId,
      submission.client_id,
      variant_id,
    ])

    const domain_ids = pipe(
      submission.domain_ids,
      O.getOrElse(() => [] as number[])
    )

    if (domain_ids.length > 0) {
      domain_ids.forEach(id => sentence_domain_values.push([sentenceId, id]))
    }
  })

  const conn = await mysql2.createConnection(db.getMysqlOptions())

  const total = sentence_values.length
  let progress = 0
  let start = 0
  let end = BATCH_SIZE

  let sentences_batch = sentence_values.slice(start, end)
  let sentences_metadata_batch = sentence_metadata_values.slice(start, end)
  let sentences_domain_batch = sentence_domain_values.slice(start, end)

  try {
    await conn.beginTransaction()

    while (sentences_batch.length > 0) {
      await conn.query(
        `
          INSERT INTO sentences (id, text, source, locale_id, is_used, is_validated)
          VALUES ?
          ON DUPLICATE KEY UPDATE source=VALUES(source)
       `,
        [sentences_batch]
      )
      await conn.query(
        `
          INSERT IGNORE INTO sentence_metadata(sentence_id, client_id, variant_id)
          VALUES ?
       `,
        [sentences_metadata_batch]
      )

      progress += sentences_batch.length
      console.log(`Progress: ${progress}/${total}`)

      start += BATCH_SIZE
      end += BATCH_SIZE
      sentences_batch = sentence_values.slice(start, end)
      sentences_metadata_batch = sentence_metadata_values.slice(start, end)
    }
    // Need to run the domains separately since the number of sentences that
    // contain domains is smaller or equal to the number of sentences
    start = 0
    end = BATCH_SIZE
    while (sentences_domain_batch.length > 0) {
      await conn.query(
        `
          INSERT IGNORE INTO sentence_domains(sentence_id, domain_id)
          VALUES ?
       `,
        [sentences_domain_batch]
      )

      start += BATCH_SIZE
      end += BATCH_SIZE
      sentences_domain_batch = sentence_domain_values.slice(start, end)
    }

    await conn.commit()
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    await conn.end()
  }
}

const saveSentence =
  (db: Mysql) =>
  (
    sentenceSubmission: SentenceSubmission
  ): TE.TaskEither<ApplicationError, void> => {
    return TE.tryCatch(
      () => insertSentenceTransaction(db, sentenceSubmission),
      (err: MysqlError) => {
        if (err.errno && err.errno === DUPLICATE_KEY_ERR) {
          return createSentenceRepositoryError(
            `Duplicate entry '${sentenceSubmission.sentence}'`,
            err
          )
        }

        return createSentenceRepositoryError(
          `Error inserting pending sentence '${sentenceSubmission.sentence}'`,
          err
        )
      }
    )
  }

export type InsertBulkSentences = (
  sentenceSubmissions: SentenceSubmission[],
  options?: BulkSentenceOptions
) => TE.TaskEither<Error, void>

const insertBulkSentences =
  (db: Mysql) =>
  (
    sentenceSubmissions: SentenceSubmission[],
    options = { isUsed: true, isValidated: true }
  ): TE.TaskEither<Error, void> => {
    return TE.tryCatch(
      () => insertBulkSentencesTransaction(db, sentenceSubmissions, options),
      (err: Error) => err
    )
  }

const insertSentenceVote =
  (db: Mysql) =>
  (vote: {
    sentenceId: number
    vote: boolean
    clientId: string
  }): TE.TaskEither<ApplicationError, unknown> => {
    return TE.tryCatch(
      () =>
        db.query(
          `INSERT INTO sentence_votes (sentence_id, vote, client_id)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE vote = VALUES(vote)`,
          [vote.sentenceId, vote.vote, vote.clientId]
        ),
      (err: Error) =>
        createSentenceRepositoryError(
          `Error inserting vote for pending_sentence ${vote.sentenceId} with client_id ${vote.clientId}`,
          err
        )
    )
  }

const toUnvalidatedSentence = ([unvalidatedSentenceRows]: [
  [SentencesForReviewRow]
]): UnvalidatedSentence[] =>
  unvalidatedSentenceRows.map(row => ({
    sentence: row.text,
    sentenceId: row.id,
    source: row.source,
    localeId: row.locale_id,
    variantTag: O.fromNullable(row.variant_token),
    variantName: O.fromNullable(row.variant_name),
  }))

export type FindSentencesForReview = (
  params: FindSentencesForReviewParams
) => TO.TaskOption<UnvalidatedSentence[]>

const findSentencesForReview =
  (db: Mysql) =>
  (params: {
    localeId: number
    clientId: string
    userClientVariant: O.Option<UserClientVariant>
    reviewSentencesWithoutVariant: boolean
  }): TO.TaskOption<UnvalidatedSentence[]> => {
    const userVariant: UserClientVariant | null = pipe(
      params.userClientVariant,
      O.match(
        () => null,
        variant => variant
      )
    )
    const variantCondition = params.reviewSentencesWithoutVariant
      ? 'AND variants.id IS NULL'
      : userVariant?.isPreferredOption
      ? `AND variants.id = ${userVariant.variant.id}`
      : ''

    const LIMIT_FROM = 1000 // among a larger set
    const LIMIT_TO = 100 // select a random subset

    return pipe(
      TO.tryCatch(() =>
        db.query(
          `
          SELECT *
          FROM (
            SELECT
              sentences.id,
              sentences.text,
              sentences.source,
              sentences.locale_id,
              variants.variant_token,
              variants.variant_name,
              SUM(sentence_votes.vote) as number_of_approving_votes,
              COUNT(sentence_votes.vote) as number_of_votes
            FROM sentences
            LEFT JOIN sentence_votes ON (sentence_votes.sentence_id=sentences.id)
            LEFT JOIN sentence_metadata ON (sentence_metadata.sentence_id=sentences.id)
            LEFT JOIN variants ON (variants.id=sentence_metadata.variant_id)
            LEFT JOIN taxonomy_entries te ON (te.sentence_id=sentences.id)
            WHERE
              sentences.is_validated = FALSE
              AND sentences.locale_id = ?
              ${variantCondition}
              AND NOT EXISTS (
                SELECT 1 FROM skipped_sentences ss WHERE sentences.id = ss.sentence_id AND ss.client_id = ?
              )
              AND NOT EXISTS (
                SELECT 1 FROM sentence_votes sv WHERE sentences.id = sv.sentence_id AND sv.client_id = ?
              )
              AND te.sentence_id IS NULL
            GROUP BY sentences.id
            HAVING
              number_of_votes < 2 OR # not enough votes yet
              number_of_votes = 2 AND number_of_approving_votes = 1 # a tie at one each
            LIMIT ?
          ) as temp
          ORDER BY RAND()
          LIMIT ?
        `,
          [
            params.localeId,
            params.clientId,
            params.clientId,
            LIMIT_FROM,
            LIMIT_TO,
          ]
        )
      ),
      TO.map(toUnvalidatedSentence)
    )
  }

const findDomainIdByName =
  (db: Mysql) =>
  (domainName: string): TE.TaskEither<ApplicationError, O.Option<number>> =>
    TE.tryCatch(
      async () => {
        const [[row]] = await db.query(
          `
          SELECT id FROM domains WHERE domain = ?
        `,
          [domainName]
        )
        return row ? O.some(row.id) : O.none
      },
      (err: Error) =>
        createSentenceRepositoryError(
          `Error retrieving domain id for domain "${domainName}"`,
          err
        )
    )

export type FetchSentenceIdsThatUserInteractedWith = (
  clientId: string
) => TE.TaskEither<ApplicationError, string[]>
export const fetchSentenceIdsThatUserInteractedWith: FetchSentenceIdsThatUserInteractedWith =
  (clientId: string): TE.TaskEither<ApplicationError, string[]> =>
    pipe(
      [clientId, clientId, clientId, clientId],
      queryDb(`
      SELECT s.id FROM sentences s
      JOIN sentence_metadata sm ON sm.sentence_id = s.id
      WHERE sm.client_id = ?
      UNION
      SELECT sentence_id FROM skipped_sentences
      WHERE client_id = ?
      UNION
      SELECT sentence_id FROM reported_sentences
      WHERE client_id = ?
      UNION
      SELECT original_sentence_id
      FROM clips
      WHERE clips.client_id = ?
    `),
      TE.mapLeft((err: Error) =>
        createDatabaseError(
          `Error retrieving sentences ids for sentences that the user interacted with`,
          err
        )
      ),
      TE.map(([results]: Array<{ id: string }[]>) =>
        pipe(
          results,
          A.map(s => s.id)
        )
      )
    )

export type FindVariantSentences = (
  variant: Variant,
  sentencesWithVariant?: boolean
) => TE.TaskEither<ApplicationError, Sentence[]>
export const findVariantSentences: FindVariantSentences = (
  variant: Variant,
  sentencesWithVariant = true
): TE.TaskEither<ApplicationError, Sentence[]> => {
  const params = sentencesWithVariant
    ? [
        variant.locale,
        variant.id,
        VARIANT_SENTENCE_LIMIT,
        VARIANT_SENTENCE_LIMIT,
      ]
    : [variant.locale, VARIANT_SENTENCE_LIMIT, VARIANT_SENTENCE_LIMIT]
  return pipe(
    params,
    queryDb(`
        SELECT *
        FROM (
          SELECT s.id, text, variant_id, variant_name
          FROM sentences s
          LEFT JOIN sentence_metadata sm ON s.id = sm.sentence_id
          LEFT JOIN variants ON (variants.id=sm.variant_id)
          WHERE
            is_used
            AND s.locale_id = (SELECT id FROM locales WHERE name = ?)
            AND clips_count <= 15
            AND ${
              sentencesWithVariant
                ? 'sm.variant_id = ?'
                : 'sm.variant_id IS NULL'
            }
          ORDER BY clips_count ASC
          LIMIT ?
        ) t
        ORDER BY RAND()
        LIMIT ?
    `),
    TE.mapLeft((err: Error) =>
      createDatabaseError(
        `Error retrieving variant sentences for variant "${variant.name} [${variant.tag}]"`,
        err
      )
    ),
    TE.map(([results]: Array<(Sentence & { variant_id: number })[]>) =>
      pipe(
        results,
        A.map(s => ({
          id: s.id,
          text: s.text,
          variant: Number(s.variant_id) == variant.id ? variant : undefined,
        }))
      )
    )
  )
}
export const saveSentenceInDb: SaveSentence = saveSentence(db)
export const insertBulkSentencesIntoDb: InsertBulkSentences =
  insertBulkSentences(db)
export const insertSentenceVoteIntoDb = insertSentenceVote(db)
export const findSentencesForReviewInDb: FindSentencesForReview =
  findSentencesForReview(db)
export const findDomainIdByNameInDb: FindDomainIdByName = findDomainIdByName(db)
