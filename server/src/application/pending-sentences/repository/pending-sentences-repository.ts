import { number, taskEither as TE, taskOption as TO } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { MysqlError } from 'mysql2Types'
import { PendingSentence } from '../../../core/pending-sentences/types'
import { PendingSentencesForReviewRow } from '../../../infrastructure/db/types'
import Mysql, { getMySQLInstance } from '../../../lib/model/db/mysql'
import { createPendingSentencesRepositoryError } from '../../helper/error-helper'
import { ApplicationError } from '../../types/error'
import { PendingSentenceSubmission } from '../../types/pending-sentence-submission'

const db = getMySQLInstance()

const DUPLICATE_KEY_ERR = 1062

const insertSentence =
  (db: Mysql) =>
  (
    sentenceSubmission: PendingSentenceSubmission
  ): TE.TaskEither<ApplicationError, unknown> => {
    return TE.tryCatch(
      () =>
        db.query(
          `
            INSERT INTO pending_sentences (sentence, source, locale_id, client_id)
            VALUES (?, ?, ?, ?);
        `,
          [
            sentenceSubmission.sentence,
            sentenceSubmission.source,
            sentenceSubmission.locale_id,
            sentenceSubmission.client_id,
          ]
        ),
      (err: MysqlError) => {
        if (err.errno && err.errno === DUPLICATE_KEY_ERR) {
          return createPendingSentencesRepositoryError(
            `Duplicate entry '${sentenceSubmission.sentence}'`,
            err
          )
        }

        return createPendingSentencesRepositoryError(
          'Error inserting sc-sentence',
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
    client_id: string
  }): TE.TaskEither<ApplicationError, unknown> => {
    return TE.tryCatch(
      () =>
        db.query(
          `INSERT INTO pending_sentences_vote (pending_sentence_id, is_valid, client_id)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE is_valid = VALUES(is_valid)`,
          [vote.pendingSentenceId, vote.isValid, vote.client_id]
        ),
      (err: Error) =>
        createPendingSentencesRepositoryError(
          `Error inserting vote for pending_sentence ${vote.pendingSentenceId} with client_id ${vote.client_id}`,
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
export const findPendingSentencesForReviewInDb = findPendingSentencesForReview(db)
