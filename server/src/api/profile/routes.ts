import PromiseRouter from 'express-promise-router'
import rateLimiter from '../../lib/middleware/rate-limiter-middleware'
import { validateStrict } from '../../lib/validation'
import { CreateApiCredentialsRequest } from './validation/create-api-credentials-request'
import { createApiCredentialsHandler } from './handler/create-api-credentials-handler'
import { getApiCredentialsHandler } from './handler/get-api-credentials-handler'
import { deleteApiCredentialsHandler } from './handler/delete-api-credentials-handler'
import { RequireUserMiddleware } from '../../lib/middleware/requireUserMiddleware'
import { RequireFeatureMiddleware } from '../../lib/middleware/requireFeatureMiddleware'

// Create middleware instances once to avoid repeated instantiation
const requireUserMiddleware = new RequireUserMiddleware()
const requireFeatureMiddleware =
  RequireFeatureMiddleware.handle('papi-credentials')

export const profilesRouter = PromiseRouter({ mergeParams: true })
  .post(
    '/api-credentials',
    rateLimiter('api/v1/profiles/api-credentials', {
      points: 1,
      duration: 60,
    }),
    validateStrict({ body: CreateApiCredentialsRequest }),
    requireUserMiddleware.handle,
    requireFeatureMiddleware,
    createApiCredentialsHandler
  )
  .get(
    '/api-credentials',
    requireUserMiddleware.handle,
    requireFeatureMiddleware,
    getApiCredentialsHandler
  )
  .delete(
    '/api-credentials/:client_id',
    requireUserMiddleware.handle,
    requireFeatureMiddleware,
    deleteApiCredentialsHandler
  )
