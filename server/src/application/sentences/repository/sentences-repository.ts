import { taskEither as TE, taskOption as TO } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { MysqlError } from 'mysql2Types'
import { PendingSentence } from '../../../core/pending-sentences/types'
import { PendingSentencesForReviewRow } from '../../../infrastructure/db/types'
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

const insertPendingSentenceVote =
  (db: Mysql) =>
  (vote: {
    pendingSentenceId: number
    isValid: boolean
    clientId: string
  }): TE.TaskEither<ApplicationError, unknown> => {
    return TE.tryCatch(
      () =>
        db.query(
          `INSERT INTO pending_sentences_votes (pending_sentence_id, is_valid, client_id)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE is_valid = VALUES(is_valid)`,
          [vote.pendingSentenceId, vote.isValid, vote.clientId]
        ),
      (err: Error) =>
        createPendingSentencesRepositoryError(
          `Error inserting vote for pending_sentence ${vote.pendingSentenceId} with client_id ${vote.clientId}`,
          err
        )
    )
  }

const mapRowToPendingSentence = ([pendingSentenceRows]: [
  [PendingSentencesForReviewRow]
]): PendingSentence[] =>
  pendingSentenceRows.map(row => ({
    sentence: row.sentence,
    source: row.source,
    localeId: row.locale_id,
  }))

const findPendingSentencesForReview =
  (db: Mysql) =>
  (queryParams: {
    localeId: number
    clientId: string
  }): TO.TaskOption<PendingSentence[]> => {
    return pipe(
      TO.tryCatch(() =>
        db.query(
          `SELECT
            pending_sentences.id,
            pending_sentences.sentence,
            pending_sentences.source,
            pending_sentences.locale_id,
            SUM(pending_sentences_votes.is_valid) as number_of_approving_votes,
            COUNT(pending_sentences_votes.is_valid) as number_of_votes
          FROM pending_sentences
          LEFT JOIN pending_sentences_votes ON (pending_sentences_votes.pending_sentence_id=pending_sentences.id)
          WHERE pending_sentences.locale_id = ?
            AND NOT EXISTS (SELECT *
              FROM pending_sentences_votes
              WHERE pending_sentences.id = pending_sentences_votes.pending_sentence_id AND pending_sentences_votes.client_id = ?)
          GROUP BY pending_sentences.id
          HAVING
            number_of_votes < 2 OR # not enough votes yet
            number_of_votes = 2 AND number_of_approving_votes = 1 # a tie at one each
          ORDER BY number_of_votes DESC
          LIMIT 50`,
          [queryParams.localeId, queryParams.clientId]
        )
      ),
      TO.map(mapRowToPendingSentence)
    )
  }

export const insertSentenceIntoDb = insertSentence(db)
export const insertPendingSentenceVoteIntoDb = insertPendingSentenceVote(db)
export const findPendingSentencesForReviewInDb =
  findPendingSentencesForReview(db)
