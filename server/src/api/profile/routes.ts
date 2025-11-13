import PromiseRouter from 'express-promise-router'
import rateLimiter from '../../lib/middleware/rate-limiter-middleware'
import { validateStrict } from '../../lib/validation'
import { CreateApiCredentialsRequest } from './validation/create-api-credentials-request'
import { createApiCredentialsHandler } from './handler/create-api-credentials-handler'
import { getApiCredentialsHandler } from './handler/get-api-credentials-handler'
import { deleteApiCredentialsHandler } from './handler/delete-api-credentials-handler'
import { RequireUserMiddleware } from '../../lib/middleware/requireUserMiddleware'
import { RequireFeatureMiddleware } from '../../lib/middleware/requireFeatureMiddleware'

export const profilesRouter = PromiseRouter({ mergeParams: true })
  .post(
    '/api-credentials',
    rateLimiter('api/v1/profiles/api-credentials', {
      points: 1,
      duration: 60,
    }),
    validateStrict({ body: CreateApiCredentialsRequest }),
    new RequireUserMiddleware().handle,
    RequireFeatureMiddleware.handle('papi-credentials'),
    createApiCredentialsHandler
  )
  .get(
    '/api-credentials',
    new RequireUserMiddleware().handle,
    RequireFeatureMiddleware.handle('papi-credentials'),
    getApiCredentialsHandler
  )
  .delete(
    '/api-credentials/:client_id',
    new RequireUserMiddleware().handle,
    RequireFeatureMiddleware.handle('papi-credentials'),
    deleteApiCredentialsHandler
  )
