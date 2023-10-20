import { Writable } from 'node:stream'
import mysql from 'mysql2/promise'
import mysql2 from 'mysql2'
import { taskEither as TE } from 'fp-ts'


export const query = <T>(
  query: string,
  params: Array<any>
): TE.TaskEither<Error, T> => {
  return TE.tryCatch(
    async () => {
      const conn = await mysql.createConnection({
        host: 'db',
        user: 'voicecommons',
        password: 'voicecommons',
        database: 'voiceweb'
      })

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
  const conn = mysql2.createConnection({
    host: 'db',
    user: 'voicecommons',
    password: 'voicecommons',
    database: 'voiceweb'
  })

  return conn.query(query, params).stream()
}
