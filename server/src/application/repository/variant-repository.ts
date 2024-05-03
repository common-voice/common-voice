import { option as O, taskEither as TE } from 'fp-ts'
import { ApplicationError } from '../types/error'
import { Variant } from '../../core/variants/variant'
import { queryDb } from '../../infrastructure/db/mysql'
import { pipe } from 'fp-ts/lib/function'
import { createDatabaseError } from '../helper/error-helper'

export type FindVariantByTag = (
  variantName: string
) => TE.TaskEither<ApplicationError, O.Option<Variant>>

export type FindVariantsBySentenceIds = (
  sentenceIds: string[]
) => TE.TaskEither<ApplicationError, FindVariantsBySentenceIdsResult>

export type FindVariantsBySentenceIdsResult = {
  [sentenceId: string]: O.Option<Variant>
}

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

export const findVariantsBySentenceIdsInDb: FindVariantsBySentenceIds = (
  sentenceIds: string[]
) =>
  pipe(
    [sentenceIds],
    queryDb(
      ` SELECT sm.sentence_id, v.id, l.name as locale, v.variant_name as name, v.variant_token as tag
        FROM sentence_metadata sm
        LEFT JOIN variants v ON (v.id = sm.variant_id)
        LEFT JOIN locales l ON (l.id = v.locale_id)
        WHERE sentence_id IN (?)
      `
    ),
    TE.mapLeft((err: Error) =>
      createDatabaseError(
        `Error retrieving variants by sentence ids "${sentenceIds}"`,
        err
      )
    ),
    TE.map(
      ([results]: Array<Array<{ sentence_id: string } & Variant>>) => results
    ),
    TE.map(rows =>
      rows.reduce((curr, row) => {
        const { sentence_id, ...variant } = row
        return {
          ...curr,
          [sentence_id]: O.fromPredicate(
            (v: Variant) =>
              v.id !== null &&
              v.name !== null &&
              v.tag !== null &&
              v.locale !== null
          )(variant),
        }
      }, {})
    )
  )
