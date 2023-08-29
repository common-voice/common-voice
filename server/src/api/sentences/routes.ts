import addSentenceHandler from './handler/add-sentence-handler'
import PromiseRouter from 'express-promise-router'
import rateLimiter from '../../lib/rate-limiter-middleware'
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
    rateLimiter('api/v1/sentences/', { points: 10, duration: 60 }),
    validateStrict({ body: AddSentenceRequest }),
    addSentenceHandler
  )
  .post(
    '/vote',
    rateLimiter('api/v1/sentences/vote', { points: 30, duration: 60 }),
    validateStrict({ body: AddSentenceVoteRequest }),
    addSentenceVoteHandler
  )
  .get(
    '/review',
    validate({ query: GetSentencesForReviewRequest }),
    getSentenceHandler
  )
