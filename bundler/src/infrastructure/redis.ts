import Redis from 'ioredis'

import { getRedisUrl } from '../config/config'

// lazyConnect: true so the client does not attempt a connection at import time.
// The first command transparently triggers the connection.
// This keeps unit tests (which mock this module) from hanging.
export const redisClient = new Redis({
  host: getRedisUrl(),
  lazyConnect: true,
})
