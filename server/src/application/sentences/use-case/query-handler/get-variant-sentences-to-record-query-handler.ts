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
      TE.apS(
        'variantSentences',
        pipe(
          findVariantSentences(query.variant),
          TE.chain(variantSentences =>
            A.isEmpty(variantSentences)
              ? findVariantSentences(query.variant, false)
              : TE.right(variantSentences)
          )
        )
      ),
      TE.apS('sentenceIds', fetchInteractedSentenceIds(query.clientId)),
      TE.map(({ variantSentences, sentenceIds }) => {
          console.log(variantSentences)
        return pipe(
          variantSentences,
          filterUserInteractedSentences(sentenceIds)
        )
      })
    )
