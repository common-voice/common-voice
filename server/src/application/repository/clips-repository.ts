import * as TE from 'fp-ts/TaskEither'
import * as A from 'fp-ts/Array'
import { Variant } from '../../core/variants/variant'
import { ApplicationError } from '../types/error'
import { DBClip } from '../../lib/model/db/tables/clip-table'
import { pipe } from 'fp-ts/lib/function'
import { lazyQueryDb, queryDb } from '../../infrastructure/db/mysql'
import { createDatabaseError } from '../helper/error-helper'
import { TimeUnits } from 'common'

const VARIANT_CLIPS_LIMIT = 10000

export type FetchVariantClips = (
  variant: Variant,
  localeId: number
) => TE.TaskEither<ApplicationError, DBClip[]>
export const fetchVariantClipsFromDB: FetchVariantClips = (
  variant: Variant,
  localeId: number
) =>
  pipe(
    [localeId, variant.id, localeId, variant.id, VARIANT_CLIPS_LIMIT],
    lazyQueryDb(`fetch-variant-clips-${variant.tag}`)(15 * TimeUnits.MINUTE)(
      10 * TimeUnits.MINUTE
    )(
      `
        SELECT c.id, c.client_id, c.path, c.sentence, c.original_sentence_id
        FROM clips c
        WHERE c.is_valid IS NULL
          AND c.locale_id = ?
          AND (
            EXISTS (
              SELECT 1 
              FROM sentence_metadata sm 
              WHERE sm.sentence_id = c.original_sentence_id 
                AND sm.variant_id = ?
            )
            OR EXISTS (
              SELECT 1
              FROM user_client_variants ucv
              WHERE ucv.client_id = c.client_id 
                AND ucv.locale_id = ?
                AND ucv.variant_id = ?
            )
          )
        LIMIT ?
      `
    ),
    TE.mapLeft(err => createDatabaseError('Error fetching variant clips', err)),
    TE.map(([result]: Array<Array<DBClip>>) => result)
  )

export type FetchClipIdsThatUserInteractedWith = (
  clientId: string
) => TE.TaskEither<ApplicationError, number[]>
export const fetchClipsThatUserInteractedWithFromDB: FetchClipIdsThatUserInteractedWith =
  (clientId: string) =>
    pipe(
      [clientId, clientId, clientId],
      queryDb(`
        SELECT clip_id
        FROM votes
        WHERE client_id = ?
        UNION ALL
        SELECT clip_id
        FROM reported_clips reported
        WHERE client_id = ?
        UNION ALL
        SELECT clip_id
        FROM skipped_clips skipped
        WHERE client_id = ?
      `),
      TE.mapLeft(err =>
        createDatabaseError(
          'Error fetching clip ids for user interacted clips',
          err
        )
      ),
      TE.map(([result]: Array<Array<{ clip_id: number }>>) =>
        pipe(
          result,
          A.map(c => c.clip_id)
        )
      )
    )
