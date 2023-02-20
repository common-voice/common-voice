import addPendingSentenceHandler from './handler/add-pending-sentence-handler'
import PromiseRouter from 'express-promise-router'
import { AddPendingSentenceRequest } from './validation/add-pending-sentence-request'
import { validateStrict } from '../../lib/validation'
import getPendingSentenceHandler from './handler/get-pending-sentence-handler'

export default PromiseRouter({ mergeParams: true })
  .post(
    '/sentences',
    validateStrict({ body: AddPendingSentenceRequest }),
    addPendingSentenceHandler
  )
  .get('/sentences', getPendingSentenceHandler)
