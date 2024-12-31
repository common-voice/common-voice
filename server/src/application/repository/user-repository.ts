import { pipe } from 'fp-ts/lib/function'
import { taskEither as TE } from 'fp-ts'
import { queryDb } from '../../infrastructure/db/mysql'

export type FetchUserClientIdByEmail = (email: string) => TE.TaskEither<Error, any>

export const fetchUserClientIdByEmail: FetchUserClientIdByEmail = (email: string) =>
  pipe(
    queryDb(`
        SELECT client_id FROM user_clients WHERE email = ?
    `)([email]),
    TE.map(
      ([[result]]: Array<Array<{ client_id: string }> | Array<any>>) =>
        result.client_id
    )
  )
