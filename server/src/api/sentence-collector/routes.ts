import addSentenceHandler from './handler/add-sentence-handler'
import getSentenceHandler from './handler/get-sentence-handler'
import PromiseRouter from 'express-promise-router'
import { AddSentenceRequest } from './validation/add-sentence-request'
import { validateStrict } from '../../lib/validation'

export default PromiseRouter({ mergeParams: true })
  .post(
    '/sentences',
    validateStrict({ body: AddSentenceRequest }),
    addSentenceHandler
  )
  .get('/sentences', getSentenceHandler)
