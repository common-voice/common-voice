import { pipe } from 'fp-ts/lib/function'
import { task as T, taskOption as TO } from 'fp-ts'
import { findSentencesForReviewInDb } from '../../repository/sentences-repository'
import { GetSentencesForReviewQuery } from './query/get-sentences-for-review-query'
import { Sentence } from '../../../../core/sentences/types'

export const GetPendingSentenceQueryHandler = (
  query: GetSentencesForReviewQuery
) => {
   return pipe(
    findSentencesForReviewInDb(query),
    TO.getOrElse(() => T.of([] as Sentence[]))
   )
}
