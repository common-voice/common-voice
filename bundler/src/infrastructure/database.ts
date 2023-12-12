import * as mysql from 'mysql'
import { taskEither as TE } from 'fp-ts'
import { getDbConfig } from '../config/config'

const DB_CONFIG: mysql.ConnectionConfig = getDbConfig()

export const query = <T>(
  query: string,
  params: Array<any>,
): TE.TaskEither<Error, T> => {
  return TE.tryCatch(
    () =>
      new Promise((resolve, reject) => {
        const conn = mysql.createConnection(DB_CONFIG)

        conn.query(query, params, function (err: unknown, results: T, fields: unknown) {
          if (err) reject(err)
          resolve(results)
        })

        conn.end()
      }),
    err => {
      return err instanceof Error
        ? err
        : new Error(`Error running query:  ${query}`)
    },
  )
}
/**
 * Create a query that returns the results as they come in a stream.
 * Really useful for large queries.
 *
 * @remarks
 * We have to pass the connection so the caller can close the
 * connection once the processing is done.
 */
export const streamingQuery = (query: string, params: Array<any>) => {
  const conn = mysql.createConnection(DB_CONFIG)

  return {
    conn: conn,
    stream: conn.query(query, params).stream({ highWaterMark: 10 }),
  }
}
