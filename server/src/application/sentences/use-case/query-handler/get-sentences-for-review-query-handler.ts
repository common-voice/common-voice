import { pipe } from 'fp-ts/lib/function'
import { option as O, task as T, taskOption as TO } from 'fp-ts'
import * as TE from 'fp-ts/TaskEither'
import { FindSentencesForReview } from '../../../repository/sentences-repository'
import { GetSentencesForReviewQuery } from './query/get-sentences-for-review-query'
import { UnvalidatedSentenceDto } from '../../types/unvalidatedSentenceDto'
import { FetchUserClientVariants } from '../../../repository/user-client-variants-repository'
import { getPreferredVariantFromList } from '../../../../core/variants/user-client-variant'

export const GetSentencesForReviewQueryHandler =
  (fetchUserClientVariants: FetchUserClientVariants) =>
  (findSentencesForReview: FindSentencesForReview) =>
  (query: GetSentencesForReviewQuery): T.Task<UnvalidatedSentenceDto[]> =>
    pipe(
      TO.Do,
      TO.bind('userClientVariant', () =>
        pipe(
          query.clientId,
          fetchUserClientVariants,
          TE.map(getPreferredVariantFromList(query.localeId)),
          TO.fromTaskEither
        )
      ),
      TO.chain(({ userClientVariant }) =>
        findSentencesForReview({
          ...query,
          userClientVariant: userClientVariant,
          reviewSentencesWithoutVariant: false,
        })
      ),
      // Remove sentences without a variant tag for now
      // until we know how to present it properly to the user 
      // TO.chain(sentences => {
      //   return sentences.length > 0
      //     ? TO.of(sentences)
      //     : findSentencesForReview({
      //         ...query,
      //         userClientVariant: O.none,
      //         reviewSentencesWithoutVariant: true,
      //       })
      // }),
      TO.map((sentences): UnvalidatedSentenceDto[] => {
        return sentences.map(sentence => {
          const variantTag = pipe(
            sentence.variantTag,
            O.getOrElse(() => null)
          )
          const variantName = pipe(
            sentence.variantName,
            O.getOrElse(() => null)
          )
          return {
            sentence: sentence.sentence,
            sentenceId: sentence.sentenceId,
            source: sentence.source,
            localeId: sentence.localeId,
            variantTag: variantTag,
            variantName: variantName,
          }
        })
      }),
      TO.getOrElse(() => T.of([] as UnvalidatedSentenceDto[]))
    )
