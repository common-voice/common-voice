import * as TE from 'fp-ts/TaskEither'
import * as A from 'fp-ts/Array'
import { Variant } from '../../core/variants/variant'
import { ApplicationError } from '../types/error'
import { DBClip } from '../../lib/model/db/tables/clip-table'
import { pipe } from 'fp-ts/lib/function'
import { lazyQueryDb, queryDb } from '../../infrastructure/db/mysql'
import { MINUTE } from '../../infrastructure/redis/redis'
import { createDatabaseError } from '../helper/error-helper'

const VARIANT_CLIPS_LIMIT = 10000

export type FetchVariantClips = (
  variant: Variant
) => TE.TaskEither<ApplicationError, DBClip[]>
export const fetchVariantClipsFromDB: FetchVariantClips = (variant: Variant) =>
  pipe(
    [variant.id, variant.id, VARIANT_CLIPS_LIMIT],
    lazyQueryDb(`fetch-variant-clips-${variant.name}`)(MINUTE)(
      `
        SELECT c.id, c.client_id, c.path, c.sentence, c.original_sentence_id
        FROM clips c
        LEFT JOIN sentence_metadata sm
        ON sm.sentence_id = c.original_sentence_id
        LEFT JOIN (
          SELECT
            ucv.client_id,
            ucv.locale_id,
            ucv.variant_id,
            v.variant_name as variant
          FROM user_client_variants ucv
          JOIN variants v ON v.id = ucv.variant_id
        ) client_variant ON client_variant.client_id = c.client_id AND c.locale_id = client_variant.locale_id
        WHERE
          sm.variant_id = ?
          OR client_variant.variant_id = ?
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
