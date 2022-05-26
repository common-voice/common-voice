import { NextFunction, Request, Response } from 'express';
import {
  RateLimiterRedis,
  IRateLimiterStoreOptions,
} from 'rate-limiter-flexible';
import { redis as redisClient } from './redis';

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
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}

function rateLimitResponse(response: Response, msBeforeNext: number) {
  const nextRequestSeconds = Math.round(msBeforeNext / 1000) || 1;
  response.set('Retry-After', nextRequestSeconds.toString());
  response.status(429).send('Too Many Requests');
}

function rateLimiterMiddleware(
  keyPrefix: string,
  rateLimiterOptions?: Partial<IRateLimiterStoreOptions>
) {
  const rateLimiter = createRateLimiter(keyPrefix, rateLimiterOptions);

  return async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    if (!rateLimiter?.consume) {
      next(new Error('No rate limiter available'));
      return;
    }

    try {
      const key = request.ip;
      await rateLimiter.consume(key);
    } catch (exception) {
      if (exception instanceof Error) {
        // send errors to our error handler
        next(exception);
        return;
      }

      rateLimitResponse(response, exception?.msBeforeNext);
      return;
    }

    next();
  };
}

export default rateLimiterMiddleware;
