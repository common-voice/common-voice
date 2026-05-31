import { NextFunction, Request, Response } from 'express'
import {
  RateLimiterRedis,
  IRateLimiterStoreOptions,
  RateLimiterRes,
} from 'rate-limiter-flexible'
import { redis as redisClient } from '../redis-cache'

// Feature flag: log every 429 to the server console
// Set to true to track rate-limited requests for debugging
const ENABLE_RATELIMIT_LOG = false

function createRateLimiter(
  keyPrefix: string,
  rateLimiterOptions?: Partial<IRateLimiterStoreOptions>
) {
  // catch errors from rate limiter if redis isn't available
  try {
    return new RateLimiterRedis({
      keyPrefix,
      storeClient: redisClient,
      points: 1,
      duration: 1,
      ...rateLimiterOptions,
    })
  } catch (e) {
    console.error(e)
    return null
  }
}

function rateLimitResponse(response: Response, msBeforeNext: number) {
  const nextRequestSeconds = Math.round(msBeforeNext / 1000) || 1
  response.set('Retry-After', nextRequestSeconds.toString())
  response.status(429).send('Too Many Requests')
}

function rateLimiterMiddleware(
  keyPrefix: string,
  rateLimiterOptions?: Partial<IRateLimiterStoreOptions>,
  keyFn?: (request: Request) => string
) {
  const rateLimiter = createRateLimiter(keyPrefix, rateLimiterOptions)

  return async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    if (!rateLimiter?.consume) {
      next(new Error('No rate limiter available'))
      return
    }

    try {
      const key = keyFn ? keyFn(request) : request.ip ?? 'unknown'
      await rateLimiter.consume(key)
    } catch (exception) {
      if (exception instanceof Error) {
        // send errors to our error handler
        next(exception)
        return
      }

      const rlRes = exception as RateLimiterRes
      if (ENABLE_RATELIMIT_LOG) {
        console.warn(
          '[ratelimit] 429',
          request.method,
          request.originalUrl,
          JSON.stringify({
            keyPrefix,
            locale: request.params?.locale ?? null,
            authUserId: request.session?.user?.client_id ?? null,
            targetClientId: request.params?.client_id ?? null,
          })
        )
      }
      rateLimitResponse(response, rlRes?.msBeforeNext)
      return
    }

    next()
  }
}

export default rateLimiterMiddleware
