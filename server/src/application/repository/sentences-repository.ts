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
}

export type FindSentencesForReview = (
  params: FindSentencesForReviewParams
) => TO.TaskOption<UnvalidatedSentence[]>

const insertSentenceTransaction = async (
  db: Mysql,
  sentence: SentenceSubmission
) => {
  const sentenceId = createSentenceId(sentence.sentence, sentence.locale_id)
  const conn = await mysql2.createConnection(db.getMysqlOptions())
  const variant_id = pipe(
    sentence.variant_id,
    O.getOrElse(() => null)
  )

  try {
    await conn.beginTransaction()
    await conn.query(
      `
        INSERT INTO sentences (id, text, source, locale_id)
        VALUES (?, ?, ?, ?);
      `,
      [sentenceId, sentence.sentence, sentence.source, sentence.locale_id]
    )

    await conn.query(
      `
        INSERT INTO sentence_metadata(sentence_id, client_id, variant_id)
        VALUES (?, ?, ?);
      `,
      [sentenceId, sentence.client_id, variant_id]
    )

    for (const domainId of sentence.domain_ids ?? []) {
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

const insertBulkSentencesTransaction = async (
  db: Mysql,
  sentences: SentenceSubmission[]
) => {
  const sentence_values: any = []
  const sentence_metadata_values: any = []
  const sentence_domain_values: any = []

  sentences.forEach(submission => {
    const sentenceId = createSentenceId(
      submission.sentence,
      submission.locale_id
    )
    sentence_values.push([
      sentenceId,
      submission.sentence,
      submission.source,
      submission.locale_id,
      1,
      1,
    ])
    sentence_metadata_values.push([sentenceId, submission.client_id])
    if (submission.domain_ids?.length > 0)
      sentence_domain_values.push([sentenceId, submission.domain_ids[0]])
  })

  const conn = await mysql2.createConnection(db.getMysqlOptions())

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
          INSERT IGNORE INTO sentence_metadata(sentence_id, client_id)
          VALUES ?
       `,
        [sentences_metadata_batch]
      )

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
  sentenceSubmissions: SentenceSubmission[]
) => TE.TaskEither<Error, void>

const insertBulkSentences =
  (db: Mysql) =>
  (sentenceSubmissions: SentenceSubmission[]): TE.TaskEither<Error, void> => {
    return TE.tryCatch(
      () => insertBulkSentencesTransaction(db, sentenceSubmissions),
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
  }))

const findSentencesForReview =
  (db: Mysql) =>
  (params: {
    localeId: number
    clientId: string
    userClientVariant: O.Option<UserClientVariant>
  }): TO.TaskOption<UnvalidatedSentence[]> => {
    const userVariant: UserClientVariant | null = pipe(
      params.userClientVariant,
      O.match(
        () => null,
        variant => variant
      )
    )

    return pipe(
      TO.tryCatch(() =>
        db.query(
          `
          SELECT
            sentences.id,
            sentences.text,
            sentences.source,
            sentences.locale_id,
            variants.variant_token,
            SUM(sentence_votes.vote) as number_of_approving_votes,
            COUNT(sentence_votes.vote) as number_of_votes
          FROM sentences
          LEFT JOIN sentence_votes ON (sentence_votes.sentence_id=sentences.id)
          LEFT JOIN sentence_metadata ON (sentence_metadata.sentence_id=sentences.id)
          LEFT JOIN variants ON (variants.id=sentence_metadata.variant_id)
          WHERE
            sentences.is_validated = FALSE
            AND sentences.locale_id = ?
            ${
              userVariant?.isPreferredOption
                ? `AND variants.id = ${userVariant.variant.id}`
                : ''
            }
            AND NOT EXISTS (
              SELECT 1 FROM skipped_sentences ss WHERE sentences.id = ss.sentence_id AND ss.client_id = ?
            )
            AND NOT EXISTS (
              SELECT 1 FROM sentence_votes sv WHERE sentences.id = sv.sentence_id AND sv.client_id = ?
            )
          GROUP BY sentences.id
          HAVING
            number_of_votes < 2 OR # not enough votes yet
            number_of_votes = 2 AND number_of_approving_votes = 1 # a tie at one each
          LIMIT 100
        `,
          [params.localeId, params.clientId, params.clientId]
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
  variant: Variant
) => TE.TaskEither<ApplicationError, Sentence[]>
export const findVariantSentences: FindVariantSentences = (
  variant: Variant
): TE.TaskEither<ApplicationError, Sentence[]> =>
  pipe(
    [
      variant.locale,
      variant.id,
      VARIANT_SENTENCE_LIMIT,
      VARIANT_SENTENCE_LIMIT,
    ],
    queryDb(`
        SELECT *
        FROM (
          SELECT s.id, text
          FROM sentences s
          JOIN sentence_metadata sm ON s.id = sm.sentence_id
          WHERE
            is_used
            AND locale_id = (SELECT id FROM locales WHERE name = ?)
            AND clips_count <= 15
            AND sm.variant_id = ?
          ORDER BY clips_count ASC
          LIMIT ?
        ) t
        ORDER BY RAND()
        LIMIT ?
    `),
    TE.mapLeft((err: Error) =>
      createDatabaseError(
        `Error retrieving variant sentences for variant "${variant.name}"`,
        err
      )
    ),
    TE.map(([results]: Array<Sentence[]>) =>
      pipe(
        results,
        A.map(s => ({ ...s, variant: variant }))
      )
    )
  )
export const saveSentenceInDb: SaveSentence = saveSentence(db)
export const insertBulkSentencesIntoDb = insertBulkSentences(db)
export const insertSentenceVoteIntoDb = insertSentenceVote(db)
export const findSentencesForReviewInDb: FindSentencesForReview =
  findSentencesForReview(db)
export const findDomainIdByNameInDb: FindDomainIdByName = findDomainIdByName(db)
