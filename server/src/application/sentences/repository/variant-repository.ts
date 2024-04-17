import { getMySQLInstance } from '../../../lib/model/db/mysql'
import * as O from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'
import { ApplicationError } from '../../types/error'
import { createDatabaseError } from '../../helper/error-helper'
import { Variant } from '../../../core/types/variant'
import lazyCache from '../../../lib/lazy-cache'

const db = getMySQLInstance()

export type FindVariantByTag = (
  variantToken: string
) => TE.TaskEither<ApplicationError, O.Option<Variant>>

const lazyFindVariantByTag = lazyCache(
  'sentence-find-variant-by-id',
  async (variantToken: string): Promise<O.Option<Variant>> => {
    const [[row]] = await db.query(
      `
        SELECT v.id, l.name as locale, variant_name as name, variant_token as tag FROM variants v
        JOIN locales l
        ON v.locale_id = l.id
        WHERE variant_token = ?
      `,
      [variantToken]
    )
    return row ? O.some(row) : O.none
  },
  24 * 60 * 60 * 1000
)

const findVariantByTag = (
  variantToken: string
): TE.TaskEither<ApplicationError, O.Option<Variant>> =>
  TE.tryCatch(
    () => lazyFindVariantByTag(variantToken),
    (err: Error) =>
      createDatabaseError(
        `Error retrieving variant information for token "${variantToken}"`,
        err
      )
  )

export const findVariantByTagInDb: FindVariantByTag = findVariantByTag
