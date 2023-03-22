import addPendingSentenceHandler from './handler/add-sentence-handler'
import PromiseRouter from 'express-promise-router'
import {
  AddSentenceRequest,
  AddPendingSentenceVoteRequest,
  GetSentencesForReviewRequest,
} from './validation/pending-sentences-requests'
import validate, { validateStrict } from '../../lib/validation'
import getPendingSentenceHandler from './handler/get-sentences-for-review-handler'
import addPendingSentenceVoteHandler from './handler/add-pending-sentence-vote-handler'

export default PromiseRouter({ mergeParams: true })
  .post(
    '/',
    validateStrict({ body: AddSentenceRequest }),
    addPendingSentenceHandler
  )
  .post(
    '/vote',
    validateStrict({ body: AddPendingSentenceVoteRequest }),
    addPendingSentenceVoteHandler
  )
  .get(
    '/review',
    validate({ query: GetSentencesForReviewRequest }),
    getPendingSentenceHandler
  )
