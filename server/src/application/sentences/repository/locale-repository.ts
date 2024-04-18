import * as TE from 'fp-ts/TaskEither'
import { ApplicationError } from '../../types/error'
import { createDatasetError } from '../../helper/error-helper'
import { pipe } from 'fp-ts/lib/function'
import { queryDb } from '../../../infrastructure/db/mysql'

export type Locale = Readonly<{
  id: number
  name: string
}>

export type GetAllLocales = () => TE.TaskEither<ApplicationError, Locale[]>

const getAllLocalesQuery = 'SELECT id, name FROM locales'

export const getAllLocales: GetAllLocales = () => {
  return pipe(
    queryDb(getAllLocalesQuery)([]),
    TE.map(([rows]: Array<Array<Locale>> | Array<any>): Locale[] => {
      return rows.map((row: Locale) => ({ id: row.id, name: row.name }))
    }),
    TE.mapLeft(err => createDatasetError('Error retrieving locales', err))
  )
}
