// Manual Jest mock for infrastructure/redis.
// Usage: jest.mock('../infrastructure/redis')
//
// All methods are jest.fn() stubs with sensible defaults.
// Tests can override per-method: mockRedis.rpush.mockResolvedValueOnce(...)

export const redisClient = {
  rpush:   jest.fn(async () => 1),
  expire:  jest.fn(async () => 1),
  incr:    jest.fn(async () => 1),
  incrby:  jest.fn(async () => 1),
  get:     jest.fn(async () => null as string | null),
  set:     jest.fn(async () => 'OK'),
  lrange:  jest.fn(async () => [] as string[]),
  sadd:    jest.fn(async () => 1),
  sismember: jest.fn(async () => 0),
  smembers:  jest.fn(async () => [] as string[]),
  del:     jest.fn(async () => 1),
}
