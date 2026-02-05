import { postFxaEventsHandler } from './handler/post-fxa-events-handler'
import PromiseRouter from 'express-promise-router'
import rateLimiter from '../../lib/middleware/rate-limiter-middleware'
import { authenticateFxaEvent } from './validation/authenticate-fxa-event'

export default PromiseRouter({ mergeParams: true }).post(
  '/fxa/events',
  rateLimiter('api/v1/webhooks/fxa/events', { points: 1000, duration: 60 }),
  authenticateFxaEvent,
  postFxaEventsHandler
)
