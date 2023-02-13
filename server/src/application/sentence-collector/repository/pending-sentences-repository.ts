import { taskEither as TE } from 'fp-ts'
import { MysqlError } from 'mysql2Types'
import { PendingSentenceSubmission } from '../../../core/sentence-collector'
import Mysql, { getMySQLInstance } from '../../../lib/model/db/mysql'
import { createPendingSentencesRepositoryError } from '../../helper/error-helper'
import { ApplicationError } from '../../types/error'

const db = getMySQLInstance()

const DUPLICATE_KEY_ERR = 1062;

const insertSentence = (db: Mysql) => (sentenceSubmission: PendingSentenceSubmission): TE.TaskEither<ApplicationError, unknown> => {
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
            return createPendingSentencesRepositoryError(`Duplicate entry '${sentenceSubmission.sentence}'`, err)
        }

        return createPendingSentencesRepositoryError('Error inserting sc-sentence', err)
    }
  )
}

export const insertSentenceIntoDb = insertSentence(db)
