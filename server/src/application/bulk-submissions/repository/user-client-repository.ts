import { pipe } from 'fp-ts/lib/function'
import { taskEither as TE } from 'fp-ts'
import { queryDb } from '../../../infrastructure/db/mysql'

export const fetchUserClientEmailById = (id: string) =>
  pipe(
    queryDb(`
        SELECT email FROM user_clients WHERE client_id = ?
    `)([id]),
    TE.map(
      ([[result]]: Array<Array<{ email: string }> | Array<any>>) => result.email
    )
  )
