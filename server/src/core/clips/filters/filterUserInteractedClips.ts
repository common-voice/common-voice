import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/Array'
import { DBClip } from '../../../lib/model/db/tables/clip-table'

export const filterUserInteractedClips =
  (interactedClipIds: number[]) => (clips: DBClip[]) =>
    pipe(
      clips,
      A.filter(
        clip =>
          !pipe(
            interactedClipIds,
            A.exists(clipId => clipId === clip.id)
          )
      )
    )

export const filterUserOwnClips = (clientId: string) => (clips: DBClip[]) =>
  pipe(
    clips,
    A.filter(clip => clip.client_id !== clientId)
  )
