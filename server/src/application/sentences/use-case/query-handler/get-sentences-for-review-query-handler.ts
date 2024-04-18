import { pipe } from 'fp-ts/lib/function'
import { option as O, task as T, taskOption as TO } from 'fp-ts'
import { findSentencesForReviewInDb } from '../../repository/sentences-repository'
import { GetSentencesForReviewQuery } from './query/get-sentences-for-review-query'
import { UnvalidatedSentenceDto } from '../../types/unvalidatedSentenceDto'

export const GetSentencesForReviewQueryHandler = (
  query: GetSentencesForReviewQuery
): T.Task<UnvalidatedSentenceDto[]> => {
  return pipe(
    findSentencesForReviewInDb(query),
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
