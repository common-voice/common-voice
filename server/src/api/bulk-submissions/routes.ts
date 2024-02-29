import PromiseRouter from 'express-promise-router'
import { addBulkSubmissionHandler } from './handler/add-bulk-submission-handler'

export const bulkSubmissionsRouter = PromiseRouter({ mergeParams: true }).post(
  '/',
  addBulkSubmissionHandler
)
