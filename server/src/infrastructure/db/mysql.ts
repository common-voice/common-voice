import { taskEither as TE } from 'fp-ts'
import Mysql, { getMySQLInstance } from '../../lib/model/db/mysql'

const db: Mysql = getMySQLInstance()

const query =
  (db: Mysql) =>
  (query: string) =>
  (parameters: Array<string | number | boolean>): TE.TaskEither<Error, unknown> => {
    return TE.tryCatch(
      () => db.query(query, parameters),
      (err: Error) => err
    )
  }

export const queryDb = query(db)
