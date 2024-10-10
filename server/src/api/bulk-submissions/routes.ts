import PromiseRouter from 'express-promise-router'
import rateLimiter from '../../lib/rate-limiter-middleware'
import { addBulkSubmissionHandler } from './handler/add-bulk-submission-handler'

export const bulkSubmissionsRouter = PromiseRouter({ mergeParams: true }).post(
  '/',
  rateLimiter('api/v1/:locale/bulk-submissions/', { points: 1, duration: 600 }),
  addBulkSubmissionHandler
)
