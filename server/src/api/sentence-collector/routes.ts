import addSentenceHandler from './handler/add-pending-sentence-handler'
import PromiseRouter from 'express-promise-router'
import { AddPendingSentenceRequest } from './validation/add-pending-sentence-request'
import { validateStrict } from '../../lib/validation'

export default PromiseRouter({ mergeParams: true })
  .post(
    '/sentences',
    validateStrict({ body: AddPendingSentenceRequest }),
    addSentenceHandler
  )
