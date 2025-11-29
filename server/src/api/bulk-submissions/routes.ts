import PromiseRouter from 'express-promise-router'
import rateLimiter from '../../lib/middleware/rate-limiter-middleware'
import { RequireFeatureMiddleware } from '../../lib/middleware/requireFeatureMiddleware'
import { addBulkSubmissionHandler } from './handler/add-bulk-submission-handler'

export const bulkSubmissionsRouter = PromiseRouter({ mergeParams: true }).post(
  '/',
  RequireFeatureMiddleware.handle('bulk-upload'),
  rateLimiter('api/v1/:locale/bulk-submissions/', { points: 1, duration: 600 }),
  addBulkSubmissionHandler
)
