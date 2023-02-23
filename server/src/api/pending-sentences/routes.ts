import addPendingSentenceHandler from './handler/add-pending-sentence-handler'
import PromiseRouter from 'express-promise-router'
import {
  AddPendingSentenceRequest,
  AddPendingSentenceVoteRequest,
  GetPendingSentencesForReviewRequest,
} from './validation/add-pending-sentence-request'
import validate, { validateStrict } from '../../lib/validation'
import getPendingSentenceHandler from './handler/get-pending-sentence-handler'
import addPendingSentenceVoteHandler from './handler/add-pending-sentence-vote-handler'

export default PromiseRouter({ mergeParams: true })
  .post(
    '/',
    validateStrict({ body: AddPendingSentenceRequest }),
    addPendingSentenceHandler
  )
  .post(
    '/vote',
    validateStrict({ body: AddPendingSentenceVoteRequest }),
    addPendingSentenceVoteHandler
  )
  .get(
    '/review',
    validate({ query: GetPendingSentencesForReviewRequest }),
    getPendingSentenceHandler
  )
