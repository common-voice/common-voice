import addSentenceHandler from './handler/add-sentence-handler'
import PromiseRouter from 'express-promise-router'
import {
  AddSentenceRequest,
  AddSentenceVoteRequest,
  GetSentencesForReviewRequest,
} from './validation/pending-sentences-requests'
import validate, { validateStrict } from '../../lib/validation'
import getSentenceHandler from './handler/get-sentences-for-review-handler'
import addSentenceVoteHandler from './handler/add-sentence-vote-handler'

export default PromiseRouter({ mergeParams: true })
  .post(
    '/',
    validateStrict({ body: AddSentenceRequest }),
    addSentenceHandler
  )
  .post(
    '/vote',
    validateStrict({ body: AddSentenceVoteRequest }),
    addSentenceVoteHandler
  )
  .get(
    '/review',
    validate({ query: GetSentencesForReviewRequest }),
    getSentenceHandler
  )
