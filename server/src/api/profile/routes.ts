import PromiseRouter from 'express-promise-router'
import rateLimiter from '../../lib/middleware/rate-limiter-middleware'
import { validateStrict } from '../../lib/validation'
import { CreateApiCredentialsRequest } from './validation/create-api-credentials-request'
import { createApiCredentialsHandler } from './handler/create-api-credentials-handler'
import { getApiCredentialsHandler } from './handler/get-api-credentials-handler'
import { deleteApiCredentialsHandler } from './handler/delete-api-credentials-handler'

export const profilesRouter = PromiseRouter({ mergeParams: true })
  .post(
    '/api-credentials',
    rateLimiter('api/v1/profiles/api-credentials', {
      points: 10,
      duration: 60,
    }),
    validateStrict({ body: CreateApiCredentialsRequest }),
    createApiCredentialsHandler
  )
  .get('/api-credentials', getApiCredentialsHandler)
  .delete('/api-credentials/:client_id', deleteApiCredentialsHandler)
