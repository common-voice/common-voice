import Redlock from 'redlock'

import { redisClient } from './redis'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const redlock = new Redlock([redisClient as any], {
  retryCount: 10, // up to 10 attempts before giving up
  retryDelay: 500, // ms between attempts
  retryJitter: 100, // ±100 ms random jitter to spread concurrent retries
})
