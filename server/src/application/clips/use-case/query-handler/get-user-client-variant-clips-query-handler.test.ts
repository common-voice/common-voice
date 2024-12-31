import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import { getUserClientVariantClipsQueryHandler } from './get-user-client-variant-clips-query-handler'
import { GetUserClientVariantClipsQuery } from './query/get-user-client-variant-clips-query'
import { FetchUserClientVariants } from '../../../repository/user-client-variants-repository'
import { UserClientVariant } from '../../../../core/variants/user-client-variant'
import {
  FetchClipIdsThatUserInteractedWith,
  FetchVariantClips,
} from '../../../repository/clips-repository'
import { DBClip } from '../../../../lib/model/db/tables/clip-table'

describe('Get user client variants query hanlder', () => {
  const ucvariants: UserClientVariant[] = [
    {
      localeId: 1,
      variant: {
        id: 1,
        locale: 'ca',
        name: 'Central',
        tag: 'ca-central',
      },
      isPreferredOption: false,
    },
    {
      localeId: 2,
      variant: {
        id: 2,
        locale: 'ca',
        name: 'Central',
        tag: 'ca-central',
      },
      isPreferredOption: false,
    },
    {
      localeId: 3,
      variant: {
        id: 3,
        locale: 'ca',
        name: 'Central',
        tag: 'ca-central',
      },
      isPreferredOption: true,
    },
  ]

  const fetchedVariantClips: DBClip[] = [
    {
      id: 1,
      client_id: 'abc123',
      path: 'path',
      sentence: 'sentence',
      original_sentence_id: 'sId1',
    },
    {
      id: 2,
      client_id: 'a',
      path: 'path',
      sentence: 'sentence',
      original_sentence_id: 'sId2',
    },
    {
      id: 3,
      client_id: 'b',
      path: 'path',
      sentence: 'sentence',
      original_sentence_id: 'sId3',
    },
    {
      id: 4,
      client_id: 'c',
      path: 'path',
      sentence: 'sentence',
      original_sentence_id: 'sId4',
    },
    {
      id: 5,
      client_id: 'ab',
      path: 'path',
      sentence: 'sentence',
      original_sentence_id: 'sId5',
    },
  ]

  it('should return correct list of database clips for given client id', async () => {
    const COUNT = 2
    const query: GetUserClientVariantClipsQuery = {
      clientId: 'abc123',
      localeId: 3,
      count: COUNT,
    }

    const fetchedVariantClips: DBClip[] = [
      {
        id: 1,
        client_id: 'abc123',
        path: 'path',
        sentence: 'sentence',
        original_sentence_id: 'sId1',
      },
      {
        id: 2,
        client_id: 'a',
        path: 'path',
        sentence: 'sentence',
        original_sentence_id: 'sId2',
      },
      {
        id: 3,
        client_id: 'b',
        path: 'path',
        sentence: 'sentence',
        original_sentence_id: 'sId3',
      },
      {
        id: 4,
        client_id: 'c',
        path: 'path',
        sentence: 'sentence',
        original_sentence_id: 'sId4',
      },
      {
        id: 5,
        client_id: 'ab',
        path: 'path',
        sentence: 'sentence',
        original_sentence_id: 'sId5',
      },
    ]

    const fetchUserClientVariantsMock: FetchUserClientVariants = jest.fn(() =>
      TE.right(ucvariants)
    )
    const fetchVariantClipsMock: FetchVariantClips = jest.fn(() =>
      TE.right(fetchedVariantClips)
    )
    const fetchClipIdsUserInteractedWith: FetchClipIdsThatUserInteractedWith =
      jest.fn(() => TE.right([2,3]))

    const sut = getUserClientVariantClipsQueryHandler(
      fetchUserClientVariantsMock
    )(fetchVariantClipsMock)(fetchClipIdsUserInteractedWith)(query)

    const result = await sut()
    expect(E.isRight(result)).toBe(true)
    expect(E.getOrElse(() => [])(result)).toHaveLength(COUNT)
  })

  it('should return empty list when there is no preferred variant', async () => {
    const COUNT = 2
    const query: GetUserClientVariantClipsQuery = {
      clientId: 'abc123',
      // localeId 1 does not have a preferred Variant
      localeId: 1,
      count: COUNT,
    }

    const fetchUserClientVariantsMock: FetchUserClientVariants = jest.fn(() =>
      TE.right(ucvariants)
    )
    const fetchVariantClipsMock: FetchVariantClips = jest.fn(() =>
      TE.right(fetchedVariantClips)
    )

    const fetchClipIdsUserInteractedWith: FetchClipIdsThatUserInteractedWith =
      jest.fn(() => TE.right([2]))

    const sut = getUserClientVariantClipsQueryHandler(
      fetchUserClientVariantsMock
    )(fetchVariantClipsMock)(fetchClipIdsUserInteractedWith)(query)

    const result = await sut()
    expect(E.isRight(result)).toBe(true)
    expect(
      E.getOrElseW(() => {
        throw Error('Should not be thrown')
      })(result)
    ).toHaveLength(0)
  })

  it('should return empty list when locale has no variants', async () => {
    const COUNT = 2
    const query: GetUserClientVariantClipsQuery = {
      clientId: 'abc123',
      // localeId does not have a variant at all
      localeId: 1337,
      count: COUNT,
    }

    const fetchUserClientVariantsMock: FetchUserClientVariants = jest.fn(() =>
      TE.right(ucvariants)
    )
    const fetchVariantClipsMock: FetchVariantClips = jest.fn(() =>
      TE.right(fetchedVariantClips)
    )
    const fetchClipIdsUserInteractedWith: FetchClipIdsThatUserInteractedWith =
      jest.fn(() => TE.right([2]))

    const sut = getUserClientVariantClipsQueryHandler(
      fetchUserClientVariantsMock
    )(fetchVariantClipsMock)(fetchClipIdsUserInteractedWith)(query)

    const result = await sut()
    expect(E.isRight(result)).toBe(true)
    expect(
      E.getOrElseW(() => {
        throw Error('Should not be thrown')
      })(result)
    ).toHaveLength(0)
  })
})
