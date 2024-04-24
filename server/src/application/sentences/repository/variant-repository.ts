import { option as O, taskEither as TE } from 'fp-ts'
import { ApplicationError } from '../../types/error'
import { Variant } from '../../../core/types/variant'
import { queryDb } from '../../../infrastructure/db/mysql'
import { pipe } from 'fp-ts/lib/function'
import { createDatabaseError } from '../../helper/error-helper'

export type FindVariantByTag = (
  variantName: string
) => TE.TaskEither<ApplicationError, O.Option<Variant>>

export const findVariantByTagInDb: FindVariantByTag = (variantName: string) =>
  pipe(
    [variantName],
    queryDb(
      ` SELECT v.id, l.name as locale, variant_name as name, variant_token as tag FROM variants v
        INNER JOIN locales l ON (l.id = v.locale_id)
        WHERE variant_token = ?
      `
    ),
    TE.mapLeft((err: Error) =>
      createDatabaseError(
        `Error retrieving variant by name "${variantName}"`,
        err
      )
    ),
    TE.map(([[result]]: Array<Array<Variant>>) => O.fromNullable(result))
  )
