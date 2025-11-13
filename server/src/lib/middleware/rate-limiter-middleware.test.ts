import { NextFunction, Request, Response } from 'express';

const mockRedisClient = {
  on: jest.fn(),
};
jest.mock('./redis', () => ({
  redis: mockRedisClient,
}));

const mockRateLimiterConsume = jest.fn(() => Promise.resolve());
const mockRateLimiterRedis = jest.fn(function () {
  return {
    consume: mockRateLimiterConsume,
  };
});
jest.mock('rate-limiter-flexible', () => ({
  RateLimiterRedis: mockRateLimiterRedis,
}));

import rateLimiter from './rate-limiter-middleware';

const mockRequest = { ip: '123.123.123' } as Partial<Request>;

const mockResponseSet = jest.fn();
const mockResponseStatusSend = jest.fn();
const mockResponseStatus = jest.fn().mockImplementation(() => ({
  send: mockResponseStatusSend,
}));
const mockResponse = {
  set: mockResponseSet,
  status: mockResponseStatus,
} as Partial<Response>;

const mockNextFunction = jest.fn();

describe('rateLimitedMiddleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls RateLimiterRedis correctly', () => {
    rateLimiter('fake-key', { points: 100, duration: 60 });

    expect(mockRateLimiterRedis).toBeCalledTimes(1);
    expect(mockRateLimiterRedis).toHaveBeenCalledWith({
      duration: 60,
      keyPrefix: 'fake-key',
      points: 100,
      storeClient: mockRedisClient,
    });
  });

  it('calls an error if no rate limiter', async () => {
    // no rate limiter created
    mockRateLimiterRedis.mockImplementationOnce(() => {
      return { consume: null };
    });

    const limiter = rateLimiter('fake-key', {
      points: 100,
      duration: 60,
    });

    await limiter(
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction as NextFunction
    );

    expect(mockNextFunction).toBeCalledTimes(1);
    expect(mockNextFunction.mock.calls[0][0].message).toBe(
      'No rate limiter available'
    );

    expect(mockResponseStatus).not.toBeCalled();
  });

  it('if rate limit not hit continue as expected', async () => {
    const limiter = rateLimiter('fake-key', {
      points: 100,
      duration: 60,
    });

    await limiter(
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction as NextFunction
    );

    expect(mockNextFunction).toBeCalledTimes(1);
    expect(mockNextFunction).toBeCalledWith();

    expect(mockResponseStatus).not.toBeCalled();
  });

  it('returns a rate-limit response if rate limit hit', async () => {
    mockRateLimiterConsume.mockImplementation(() => {
      return Promise.reject({ msBeforeNext: 12345678 });
    });

    const limiter = rateLimiter('fake-key', {
      points: 100,
      duration: 60,
    });

    await limiter(
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction as NextFunction
    );

    expect(mockResponseSet).toBeCalledWith('Retry-After', '12346');
    expect(mockResponseStatus).toBeCalledWith(429);
    expect(mockResponseStatusSend).toBeCalledWith('Too Many Requests');

    expect(mockNextFunction).not.toBeCalled();
  });

  it('handles errors from rateLimiter.consume', async () => {
    const mockError = new Error('Something went wrong...');
    mockRateLimiterConsume.mockImplementation(() => {
      return Promise.reject(mockError);
    });

    const limiter = rateLimiter('fake-key', {
      points: 100,
      duration: 60,
    });

    await limiter(
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction as NextFunction
    );

    expect(mockNextFunction).toBeCalledTimes(1);
    expect(mockNextFunction).toBeCalledWith(mockError);

    expect(mockResponseStatus).not.toBeCalled();
  });
});
