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

export type FetchVariants = () => TE.TaskEither<ApplicationError, Variant[]>
export const fetchVariantsFromDb: FetchVariants = () =>
  pipe(
    [],
    queryDb(`
      SELECT v.id, l.name as locale, variant_name as name, variant_token as tag FROM variants v
      INNER JOIN locales l ON (l.id = v.locale_id)
    `),
    TE.map(([result]: Array<Variant[]>) => result),
    TE.mapLeft((err: Error) =>
      createDatabaseError('Error fetching variants', err)
    )
  )

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

const findClipVariantBySentenceIdsInDb = (sentenceIds: string[]) =>
  pipe(
    [sentenceIds],
    queryDb(`
      SELECT c.original_sentence_id as sentence_id, v.id, l.name as locale, v.variant_name as name, v.variant_token as tag FROM clips c
      JOIN locales l ON l.id = c.locale_id
      LEFT JOIN user_client_variants ucv ON ucv.client_id = c.client_id AND ucv.locale_id = c.locale_id
      LEFT JOIN variants v ON v.id = ucv.variant_id
      WHERE c.original_sentence_id IN (?)
    `),
    TE.map(
      ([results]: Array<Array<{ sentence_id: string } & Variant>>) => results
    )
  )

const findSentenceVariantBySentenceIdsInDb = (sentenceIds: string[]) =>
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
    TE.map(
      ([results]: Array<Array<{ sentence_id: string } & Variant>>) => results
    )
  )

export const findVariantsBySentenceIdsInDb: FindVariantsBySentenceIds = (
  sentenceIds: string[]
) =>
  pipe(
    TE.Do,
    TE.apS('clipVariants', findClipVariantBySentenceIdsInDb(sentenceIds)),
    TE.apS(
      'sentenceVariants',
      findSentenceVariantBySentenceIdsInDb(sentenceIds)
    ),
    TE.map(({ clipVariants, sentenceVariants }) => [
      ...clipVariants,
      ...sentenceVariants,
    ]),
    TE.mapLeft((err: Error) =>
      createDatabaseError(
        `Error retrieving variants by sentence ids "${sentenceIds}"`,
        err
      )
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
