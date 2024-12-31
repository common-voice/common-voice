import { option as O, taskEither as TE } from 'fp-ts'
import { ApplicationError } from '../types/error'
import { lazyQueryDb, queryDb } from '../../infrastructure/db/mysql'
import { pipe } from 'fp-ts/lib/function'
import { createDatabaseError } from '../helper/error-helper'
import { Locale, TextDirection } from '../../core/types/locale'
import { DAY } from '../../infrastructure/redis/redis'

export type FindLocaleByName = (
  localeName: string
) => TE.TaskEither<ApplicationError, O.Option<Locale>>

export type FindLocaleById = (
  localeId: number
) => TE.TaskEither<ApplicationError, O.Option<Locale>>

type LocaleRow = {
  id: number
  name: string
  targetSentenceCount: number
  isContributable: number
  isTranslated: number
  textDirection: TextDirection
}

export const toLocale = (row: LocaleRow): O.Option<Locale> =>
  pipe(
    row,
    O.fromNullable,
    O.map(result => ({
      ...result,
      isContributable: result.isContributable === 1,
      isTranslated: result.isTranslated === 1,
    }))
  )

export const findLocaleByNameInDb: FindLocaleByName = (localeName: string) =>
  pipe(
    [localeName],
    lazyQueryDb(`find-locale-by-name-${localeName}`)(DAY)(
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
    TE.map(([[result]]: Array<Array<LocaleRow>>) => toLocale(result))
  )

export const findLocaleByIdInDb: FindLocaleById = (localeId: number) =>
  pipe(
    [localeId],
    queryDb(
      ` SELECT
          id,
          name,
          target_sentence_count as targetSentenceCount,
          is_contributable as isContributable,
          is_translated as isTranslated,
          text_direction as textDirection
        FROM locales
        WHERE id = ?
      `
    ),
    TE.mapLeft((err: Error) =>
      createDatabaseError(`Error retrieving locale by id "${localeId}"`, err)
    ),
    TE.map(([[result]]: Array<Array<LocaleRow>>) => toLocale(result))
  )
