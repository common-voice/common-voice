import { flow, pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/Array'
import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/Option'

import { GetUserClientVariantClipsQuery } from './query/get-user-client-variant-clips-query'
import { FetchUserClientVariants } from '../../../repository/user-client-variants-repository'
import { getPreferredVariantFromList } from '../../../../core/variants/user-client-variant'
import {
  FetchClipIdsThatUserInteractedWith,
  FetchVariantClips,
} from '../../../repository/clips-repository'
import { DBClip } from '../../../../lib/model/db/tables/clip-table'
import {
  filterUserInteractedClips,
  filterUserOwnClips,
} from '../../../../core/clips/filters/filterUserInteractedClips'

const userClipsFilter = (interactedClipIds: number[]) => (clientId: string) =>
  flow(
    filterUserInteractedClips(interactedClipIds),
    filterUserOwnClips(clientId)
  )

export const getUserClientVariantClipsQueryHandler =
  (fetchUserClientVariants: FetchUserClientVariants) =>
  (fetchVariantClips: FetchVariantClips) =>
  (fetchClipIdsThatUserInteractedWith: FetchClipIdsThatUserInteractedWith) =>
  (query: GetUserClientVariantClipsQuery) =>
    pipe(
      query.clientId,
      fetchUserClientVariants,
      TE.map(getPreferredVariantFromList(query.localeId)),
      TE.chain(preferredVariant =>
        pipe(
          preferredVariant,
          O.map(pVariant => pVariant.variant),
          O.match(
            () => TE.right([] as DBClip[]),
            variant => fetchVariantClips(variant)
          )
        )
      ),
      TE.bindTo('variantClips'),
      TE.bind('userInteractedClipIds', () =>
        fetchClipIdsThatUserInteractedWith(query.clientId)
      ),
      TE.map(({ variantClips, userInteractedClipIds }) =>
        pipe(
          variantClips,
          userClipsFilter(userInteractedClipIds)(query.clientId),
          A.takeLeft(query.count)
        )
      )
    )
