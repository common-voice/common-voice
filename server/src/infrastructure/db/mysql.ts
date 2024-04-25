import { taskEither as TE } from 'fp-ts'
import Mysql, { getMySQLInstance } from '../../lib/model/db/mysql'
import lazyCache from '../../lib/lazy-cache'
import { createMd5Hash } from '../crypto/crypto'

const db: Mysql = getMySQLInstance()
type QueryParams = Array<string | number | boolean>

const lazyQuery =
  (db: Mysql) =>
  (cachePrefix: string) =>
  (expiresMs: number) =>
  (query: string) =>
  (parameters: QueryParams): TE.TaskEither<Error, unknown> => {
    const lazyQuery = lazyCache<unknown, QueryParams>(
      cachePrefix + '-' + createMd5Hash(query),
      async parameters => {
        return db.query(query, parameters)
      },
      expiresMs
    )

    return TE.tryCatch(
      () => lazyQuery(parameters),
      (err: Error) => err
    )
  }

const query =
  (db: Mysql) =>
  (query: string) =>
  (parameters: QueryParams): TE.TaskEither<Error, unknown> => {
    return TE.tryCatch(
      () => db.query(query, parameters),
      (err: Error) => err
    )
  }

export const queryDb = query(db)
export const lazyQueryDb = lazyQuery(db)
