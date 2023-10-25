import mysql from 'mysql2/promise'
import mysql2, { ConnectionOptions } from 'mysql2'
import { taskEither as TE } from 'fp-ts'
import { getDbConfig } from '../config/config'

const DB_CONFIG: ConnectionOptions = getDbConfig()

export const query = <T>(
  query: string,
  params: Array<any>
): TE.TaskEither<Error, T> => {
  return TE.tryCatch(
    async () => {
      const conn = await mysql.createConnection(DB_CONFIG)

      const [rows, _] = await conn.query(query, params)

      await conn.end()

      return rows as T
    },
    (err) => {
      return err instanceof Error
        ? err
        : new Error(`Error running query:  ${query}`)
    }
  )
}

export const streamingQuery = (query: string, params: Array<any>) => {
  const conn = mysql2.createConnection(DB_CONFIG)
  return conn.query(query, params).stream().on('finish', () => conn.end())
}
