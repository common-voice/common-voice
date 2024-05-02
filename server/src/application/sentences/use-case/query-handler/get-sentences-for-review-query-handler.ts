import { pipe } from 'fp-ts/lib/function'
import { option as O, task as T, taskOption as TO } from 'fp-ts'
import * as TE from 'fp-ts/TaskEither'
import { FindSentencesForReview } from '../../repository/sentences-repository'
import { GetSentencesForReviewQuery } from './query/get-sentences-for-review-query'
import { UnvalidatedSentenceDto } from '../../types/unvalidatedSentenceDto'
import { FetchUserClientVariants } from '../../variants/repository/user-client-variants-repository'

export const GetSentencesForReviewQueryHandler =
  (fetchUserClientVariants: FetchUserClientVariants) =>
  (findSentencesForReview: FindSentencesForReview) =>
  (query: GetSentencesForReviewQuery): T.Task<UnvalidatedSentenceDto[]> => {
    const fetchClientVariantForLocale = pipe(
      query.clientId,
      fetchUserClientVariants,
      TE.map(variants => variants.filter(v => v.localeId === query.localeId)),
      TE.map(([variant]) => variant),
      TE.match(
        () => O.none,
        res => O.fromNullable(res)
      )
    )

    return pipe(
      TO.Do,
      TO.bind('userClientVariant', () => TO.fromTask(fetchClientVariantForLocale)),
      TO.chain(({ userClientVariant }) =>
        findSentencesForReview({
          ...query,
          userClientVariant: userClientVariant,
        })
      ),
      TO.map((sentences): UnvalidatedSentenceDto[] => {
        return sentences.map(sentence => {
          const variantTag = pipe(
            sentence.variantTag,
            O.getOrElse(() => null)
          )
          return {
            sentence: sentence.sentence,
            sentenceId: sentence.sentenceId,
            source: sentence.source,
            localeId: sentence.localeId,
            variantTag: variantTag,
          }
        })
      }),
      TO.getOrElse(() => T.of([] as UnvalidatedSentenceDto[]))
    )
  }
