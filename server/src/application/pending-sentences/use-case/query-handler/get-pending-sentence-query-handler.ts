import { pipe } from 'fp-ts/lib/function'
import { task as T, taskOption as TO } from 'fp-ts'
import { findPendingSentencesForReviewInDb } from '../../repository/pending-sentences-repository'
import { GetPendingSentencesQuery } from './query/get-pending-sentences-query'
import { PendingSentence } from '../../../../core/pending-sentences/types'

export const GetPendingSentenceQueryHandler = (
  query: GetPendingSentencesQuery
) => {
   return pipe(
    findPendingSentencesForReviewInDb(query),
    TO.getOrElse(() => T.of([] as PendingSentence[]))
   )
}
