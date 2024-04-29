import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import { UserClientVariant } from '../../../../core/variants/user-client-variant'
import { ApplicationError } from '../../../types/error'
import { queryDb } from '../../../../infrastructure/db/mysql'
import { createDatabaseError } from '../../../helper/error-helper'

export type FetchUserClientVariants = (
  clientId: string
) => TE.TaskEither<ApplicationError, UserClientVariant[]>

const toUserClientVariant = (row: any): UserClientVariant => {
  return {
    localeId: row.localeId,
    variant: {
      id: row.variantId,
      locale: row.localeName,
      name: row.variantName,
      tag: row.variantTag,
    },
    isPreferredOption: row.is_preferred_option === 1,
  }
}

export const fetchUserClientVariants: FetchUserClientVariants = (
  clientId: string
) =>
  pipe(
    [clientId],
    queryDb(`
      SELECT
        l.id as localeId,
        l.name as localeName,
        v.id as variantId,
        v.variant_name as variantName,
        v.variant_token as variantTag,
        ucv.is_preferred_option
      FROM user_client_variants ucv
      INNER JOIN locales l ON (l.id = ucv.locale_id)
      INNER JOIN variants v ON (v.id = ucv.variant_id)
      WHERE client_id = ?
    `),
    TE.mapLeft((err: Error) =>
      createDatabaseError(`Error retrieving user client variants`, err)
    ),
    TE.map(([results]: Array<any>) => results.map(toUserClientVariant))
  )
