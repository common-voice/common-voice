import { taskEither as TE } from 'fp-ts'
import { MysqlError } from 'mysql2Types'
import { Sentence } from '../../../core/sentence-collector'
import Mysql, { getMySQLInstance } from '../../../lib/model/db/mysql'
import { createScSentenceRepositoryError } from '../../helper/error-helper'
import { ApplicationError } from '../../types/error'

const db = getMySQLInstance()

const DUPLICATE_KEY_ERR = 1062;

const insertSentence = (db: Mysql) => (sentence: Sentence): TE.TaskEither<ApplicationError, unknown> => {
  return TE.tryCatch(
    () =>
      db.query(
        `
            INSERT INTO sc_sentences (sentence, source, locale_id, client_id)
            VALUES (?, ?, ?, ?);
        `,
        [
          sentence.sentence,
          sentence.source,
          sentence.locale_id,
          sentence.client_id,
        ]
      ),
      (err: MysqlError) => {
        if (err.errno && err.errno === DUPLICATE_KEY_ERR) {
            return createScSentenceRepositoryError(`Duplicate entry '${sentence.sentence}'`, err)
        }

        return createScSentenceRepositoryError('Error inserting sc-sentence', err)
    }
  )
}

export const insertSentenceIntoDb = insertSentence(db)
