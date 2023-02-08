import { taskEither as TE } from 'fp-ts'
import { Sentence } from '../../../core/sentence-collector'
import Mysql, { getMySQLInstance } from '../../../lib/model/db/mysql'

const db = getMySQLInstance()

const insertSentence = (db: Mysql) => (sentence: Sentence) => {
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
    String
  )
}

export const insertSentenceIntoDb = insertSentence(db)
