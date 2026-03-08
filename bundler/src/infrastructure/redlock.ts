import Redlock from 'redlock'

import {
  REDLOCK_RETRY_COUNT,
  REDLOCK_RETRY_DELAY_MS,
  REDLOCK_RETRY_JITTER_MS,
} from '../config'
import { redisClient } from './redis'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const redlock = new Redlock([redisClient as any], {
  retryCount: REDLOCK_RETRY_COUNT,
  retryDelay: REDLOCK_RETRY_DELAY_MS,
  retryJitter: REDLOCK_RETRY_JITTER_MS,
})
