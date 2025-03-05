import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/TaskEither'
import * as A from 'fp-ts/Array'
import {
  FetchSentenceIdsThatUserInteractedWith,
  FindVariantSentences,
} from '../../../repository/sentences-repository'
import { GetVariantSentencesToRecord } from './query/get-variant-sentences-to-record-query'
import { ApplicationError } from '../../../types/error'
import { Sentence } from 'common'
import { filterUserInteractedSentences } from '../../../../core/sentences/filters/filterUserInteractedSentences'

export const getVariantSentencesToRecordQueryHandler =
  (fetchInteractedSentenceIds: FetchSentenceIdsThatUserInteractedWith) =>
  (findVariantSentences: FindVariantSentences) =>
  (
    query: GetVariantSentencesToRecord
  ): TE.TaskEither<ApplicationError, Sentence[]> =>
    pipe(
      TE.Do,
      TE.apS('variantSentences', findVariantSentences(query.variant)),
      TE.apS('nonVariantSentences', findVariantSentences(query.variant, false)),
      TE.apS('sentenceIds', fetchInteractedSentenceIds(query.clientId)),
      TE.map(({ variantSentences, nonVariantSentences, sentenceIds }) => {
        const variantSentencesResult = pipe(
          variantSentences,
          filterUserInteractedSentences(sentenceIds)
        )
        const nonVariantSentencesResult = pipe(
          nonVariantSentences,
          filterUserInteractedSentences(sentenceIds)
        )
        return [...variantSentencesResult, ...nonVariantSentencesResult]
      })
    )
