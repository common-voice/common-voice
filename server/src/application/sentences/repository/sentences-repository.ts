import { taskEither as TE, taskOption as TO } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { MysqlError } from 'mysql2Types'
import { Sentence } from '../../../core/sentences/types'
import { SentencesForReviewRow } from '../../../infrastructure/db/types'
import Mysql, { getMySQLInstance } from '../../../lib/model/db/mysql'
import { createSentenceId } from '../../../lib/utility'
import { createPendingSentencesRepositoryError } from '../../helper/error-helper'
import { ApplicationError } from '../../types/error'
import { SentenceSubmission } from '../../types/sentence-submission'

const mysql2 = require('mysql2/promise')

const db = getMySQLInstance()

const DUPLICATE_KEY_ERR = 1062

const insertSentenceTransaction = async (
  db: Mysql,
  sentence: SentenceSubmission
) => {
  const sentenceId = createSentenceId(sentence.sentence, sentence.locale_id)
  console.log(sentenceId)
  const conn = await mysql2.createConnection(db.getMysqlOptions())

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
        INSERT INTO sentence_metadata(sentence_id, client_id)
        VALUES (?, ?);
     `,
      [sentenceId, sentence.client_id]
    )
    await conn.commit()
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    await conn.end()
  }
}

const insertSentence =
  (db: Mysql) =>
  (
    sentenceSubmission: SentenceSubmission
  ): TE.TaskEither<ApplicationError, unknown> => {
    return TE.tryCatch(
      () => insertSentenceTransaction(db, sentenceSubmission),
      (err: MysqlError) => {
        if (err.errno && err.errno === DUPLICATE_KEY_ERR) {
          return createPendingSentencesRepositoryError(
            `Duplicate entry '${sentenceSubmission.sentence}'`,
            err
          )
        }

        return createPendingSentencesRepositoryError(
          `Error inserting pending sentence '${sentenceSubmission.sentence}'`,
          err
        )
      }
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
        createPendingSentencesRepositoryError(
          `Error inserting vote for pending_sentence ${vote.sentenceId} with client_id ${vote.clientId}`,
          err
        )
    )
  }

const mapRowToSentence = ([pendingSentenceRows]: [
  [SentencesForReviewRow]
]): Sentence[] =>
  pendingSentenceRows.map(row => ({
    sentence: row.text,
    source: row.source,
    localeId: row.locale_id,
  }))

const findSentencesForReview =
  (db: Mysql) =>
  (queryParams: {
    localeId: number
    clientId: string
  }): TO.TaskOption<Sentence[]> => {
    return pipe(
      TO.tryCatch(() =>
        db.query(
          `SELECT
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
            AND NOT EXISTS (SELECT *
              FROM sentence_votes
              WHERE sentences.id = sentence_votes.sentence_id AND sentence_votes.client_id = ?)
          GROUP BY sentences.id
          HAVING
            number_of_votes < 2 OR # not enough votes yet
            number_of_votes = 2 AND number_of_approving_votes = 1 # a tie at one each
          ORDER BY number_of_votes DESC
          LIMIT 50`,
          [queryParams.localeId, queryParams.clientId]
        )
      ),
      TO.map(mapRowToSentence)
    )
  }

export const insertSentenceIntoDb = insertSentence(db)
export const insertSentenceVoteIntoDb = insertSentenceVote(db)
export const findSentencesForReviewInDb =
  findSentencesForReview(db)
