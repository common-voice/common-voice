import { option as O, taskEither as TE } from 'fp-ts'
import { ApplicationError } from '../../types/error'
import { queryDb } from '../../../infrastructure/db/mysql'
import { pipe } from 'fp-ts/lib/function'
import { createDatabaseError } from '../../helper/error-helper'
import { Locale, TextDirection } from '../../../core/types/locale'

export type FindLocaleByName = (
  localeName: string
) => TE.TaskEither<ApplicationError, O.Option<Locale>>

type LocaleRow = {
  id: number
  name: string
  targetSentenceCount: number
  isContributable: number
  isTranslated: number
  textDirection: TextDirection
}

export const findLocaleByNameInDb: FindLocaleByName = (localeName: string) =>
  pipe(
    [localeName],
    queryDb(
      ` SELECT 
          id,
          name,
          target_sentence_count as targetSentenceCount,
          is_contributable as isContributable,
          is_translated as isTranslated,
          text_direction as textDirection
        FROM locales
        WHERE name = ?
      `
    ),
    TE.mapLeft((err: Error) =>
      createDatabaseError(
        `Error retrieving locale by name "${localeName}"`,
        err
      )
    ),
    TE.map(([[result]]: Array<Array<LocaleRow>>) => {
      return pipe(
        result,
        O.fromNullable,
        O.map(result => ({
          ...result,
          isContributable: result.isContributable === 1,
          isTranslated: result.isTranslated === 1,
        }))
      )
    })
  )
