import { postEventsHandler } from './handler/post-events-handler'
import PromiseRouter from 'express-promise-router'
import rateLimiter from '../../lib/rate-limiter-middleware'

export default PromiseRouter({ mergeParams: true }).post(
  '/events',
  rateLimiter('api/v1/webhooks/events', { points: 1000, duration: 60 }),
  postEventsHandler
)
