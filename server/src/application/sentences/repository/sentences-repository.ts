import { option as O, taskEither as TE, taskOption as TO } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { MysqlError } from 'mysql2Types'
import { UnvalidatedSentence } from '../../../core/sentences/types'
import { SentencesForReviewRow } from '../../../infrastructure/db/types'
import Mysql, { getMySQLInstance } from '../../../lib/model/db/mysql'
import { createSentenceId } from '../../../lib/utility'
import { createSentenceRepositoryError } from '../../helper/error-helper'
import { ApplicationError } from '../../types/error'
import { SentenceSubmission } from '../../types/sentence-submission'

const mysql2 = require('mysql2/promise')

const db = getMySQLInstance()

const DUPLICATE_KEY_ERR = 1062
const BATCH_SIZE = 1000

export type SaveSentence = (
  sentenceSubmission: SentenceSubmission
) => TE.TaskEither<ApplicationError, void>

export type FindDomainIdByName = (
  domainName: string
) => TE.TaskEither<ApplicationError, O.Option<number>>

const insertSentenceTransaction = async (
  db: Mysql,
  sentence: SentenceSubmission
) => {
  const sentenceId = createSentenceId(sentence.sentence, sentence.locale_id)
  const conn = await mysql2.createConnection(db.getMysqlOptions())
  const variant_id = pipe(
    sentence.variant,
    O.map(variant => variant.id),
    O.getOrElse(() => null)
  )
  console.log('variantid', sentence.variant)

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
  })

  const conn = await mysql2.createConnection(db.getMysqlOptions())

  let start = 0
  let end = BATCH_SIZE

  let sentences_batch = sentence_values.slice(start, end)
  let sentences_metadata_batch = sentence_metadata_values.slice(start, end)

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
  }))

const findSentencesForReview =
  (db: Mysql) =>
    (queryParams: {
      localeId: number
      clientId: string
    }): TO.TaskOption<UnvalidatedSentence[]> => {
      return pipe(
        TO.tryCatch(() =>
          db.query(
            `
          SELECT
            sentences.id,
            sentences.text,
            sentences.source,
            sentences.locale_id,
            SUM(sentence_votes.vote) as number_of_approving_votes,
            COUNT(sentence_votes.vote) as number_of_votes
          FROM sentences
          LEFT JOIN sentence_votes ON (sentence_votes.sentence_id=sentences.id)
          WHERE
            sentences.is_validated = FALSE
            AND sentences.locale_id = ?
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
            [queryParams.localeId, queryParams.clientId, queryParams.clientId]
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

export const saveSentenceInDb: SaveSentence = saveSentence(db)
export const insertBulkSentencesIntoDb = insertBulkSentences(db)
export const insertSentenceVoteIntoDb = insertSentenceVote(db)
export const findSentencesForReviewInDb = findSentencesForReview(db)
export const findDomainIdByNameInDb: FindDomainIdByName = findDomainIdByName(db)
