/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import lazyCache, {
  forceCacheStrategy,
  getCurrentCacheStrategy,
  getErrorStats,
  resetCacheState,
  stopHealthMonitoring,
} from '../lib/lazy-cache'

// Mock Redis with proper event emitter methods
jest.mock('../lib/redis', () => {
  const mockRedis = {
    ping: jest.fn().mockResolvedValue('PONG'),
    get: jest.fn(),
    set: jest.fn(),
    sadd: jest.fn(),
    expire: jest.fn(),
    smembers: jest.fn(),
    disconnect: jest.fn(),
    quit: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(), // Add event emitter methods
    off: jest.fn(),
    once: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn().mockResolvedValue(undefined),
    isOpen: true,
  }

  const mockRedlock = {
    lock: jest.fn().mockResolvedValue({
      unlock: jest.fn().mockResolvedValue(undefined),
    }),
    quit: jest.fn().mockResolvedValue(undefined),
  }

  return {
    redis: mockRedis,
    redlock: mockRedlock,
    useRedis: Promise.resolve(true),
  }
})

jest.mock('@sentry/node', () => ({
  captureException: jest.fn(),
  captureMessage: jest.fn(),
}))

// Add a small delay utility
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const randomString = () => Math.random().toString(36).substring(7)

describe('lazyCache', () => {
  const { redis, redlock } = require('../lib/redis')
  const Sentry = require('@sentry/node')

  beforeEach(async () => {
    // Stop any existing monitoring first
    stopHealthMonitoring()
    resetCacheState()
    jest.clearAllMocks()

    // Reset all Redis mocks
    redis.ping.mockResolvedValue('PONG')
    redis.get.mockResolvedValue(null)
    redis.set.mockResolvedValue('OK')
    redis.sadd.mockResolvedValue(1)
    redis.expire.mockResolvedValue(1)
    redis.smembers.mockResolvedValue([])
    redis.on.mockClear()
    redis.off.mockClear()
    redis.connect.mockResolvedValue(undefined)
    redis.isOpen = true

    redlock.lock.mockResolvedValue({
      unlock: jest.fn().mockResolvedValue(undefined),
    })

    forceCacheStrategy('memory')

    // Small delay to ensure clean state
    await delay(10)
  })

  afterEach(async () => {
    stopHealthMonitoring()
    resetCacheState()
    // Small delay to ensure all async operations complete
    await delay(10)
  })

  test('basic functionality - returns value', async () => {
    const cachedF = lazyCache(randomString(), async () => 23, 1000)
    const result = await cachedF()
    expect(result).toBe(23)
  })

  test('cache works - function called once for same args', async () => {
    const f = jest.fn().mockResolvedValue(23)
    const cachedF = lazyCache(randomString(), f, 1000)

    await cachedF()
    await cachedF() // Same call - should be cached

    expect(f).toHaveBeenCalledTimes(1)
  })

  test('cache calls function again for different args', async () => {
    const f = jest.fn().mockImplementation(async (x: number) => x * 2)
    const cachedF = lazyCache(randomString(), f, 1000)

    await cachedF(2)
    await cachedF(3) // Different param - new call

    expect(f).toHaveBeenCalledTimes(2)
  })
})

describe('lazyCache with Redis', () => {
  const { redis, redlock } = require('../lib/redis')
  const Sentry = require('@sentry/node')

  beforeEach(async () => {
    stopHealthMonitoring()
    resetCacheState()
    jest.clearAllMocks()

    redis.ping.mockResolvedValue('PONG')
    redis.get.mockResolvedValue(null)
    redis.set.mockResolvedValue('OK')
    redis.sadd.mockResolvedValue(1)
    redis.expire.mockResolvedValue(1)
    redis.smembers.mockResolvedValue([])
    redis.on.mockClear()
    redis.off.mockClear()
    redis.connect.mockResolvedValue(undefined)
    redis.isOpen = true

    redlock.lock.mockResolvedValue({
      unlock: jest.fn().mockResolvedValue(undefined),
    })

    forceCacheStrategy('redis')
    await delay(10)
  })

  afterEach(async () => {
    stopHealthMonitoring()
    resetCacheState()
    await delay(10)
  })

  test('works with Redis strategy', async () => {
    const f = jest.fn().mockResolvedValue(23)
    const cachedF = lazyCache(randomString(), f, 1000)
    const result = await cachedF()
    expect(result).toBe(23)
    expect(f).toHaveBeenCalledTimes(1)
  })

  test('Redis cache hit returns cached value', async () => {
    const cachedValue = JSON.stringify({
      at: Date.now(),
      value: 'cached-result',
    })
    redis.get.mockResolvedValue(cachedValue)

    const f = jest.fn().mockResolvedValue('new-result')
    const cachedF = lazyCache(randomString(), f, 1000)

    const result = await cachedF()

    expect(result).toBe('cached-result')
    expect(f).not.toHaveBeenCalled()
  })

  test('Redis cache miss calls function', async () => {
    redis.get.mockResolvedValue(null)

    const f = jest.fn().mockResolvedValue('new-result')
    const cachedF = lazyCache(randomString(), f, 1000)

    const result = await cachedF()

    expect(result).toBe('new-result')
    expect(f).toHaveBeenCalledTimes(1)
  })

  // Account for the [] suffix that gets added for no-argument calls in ioredis
  test('Redis stores value when caching', async () => {
    const f = jest.fn().mockResolvedValue('test-value')
    const key = randomString()
    const cachedF = lazyCache(key, f, 5000)

    await cachedF()

    expect(redis.set).toHaveBeenCalled()

    // The key will have '[]' appended for no-argument calls
    const actualKey = redis.set.mock.calls[0][0]
    expect(actualKey).toContain(key) // Key contains our original key
    expect(typeof redis.set.mock.calls[0][1]).toBe('string') // Value is stringified
  })
})

describe('lazyCache with Memory', () => {
  beforeEach(async () => {
    stopHealthMonitoring()
    resetCacheState()
    jest.clearAllMocks()
    forceCacheStrategy('memory')
    await delay(10)
  })

  afterEach(async () => {
    stopHealthMonitoring()
    resetCacheState()
    await delay(10)
  })

  test('works with Memory strategy', async () => {
    const f = jest.fn().mockResolvedValue(23)
    const cachedF = lazyCache(randomString(), f, 1000)
    await cachedF()
    await cachedF()
    expect(f).toHaveBeenCalledTimes(1)
  })

  test('memory cache returns same value for repeated calls', async () => {
    const f = jest.fn().mockResolvedValue('cached-value')
    const cachedF = lazyCache(randomString(), f, 1000)

    const result1 = await cachedF()
    const result2 = await cachedF()

    expect(result1).toBe('cached-value')
    expect(result2).toBe('cached-value')
    expect(f).toHaveBeenCalledTimes(1)
  })

  test('memory cache respects different arguments', async () => {
    const f = jest.fn().mockImplementation(async (x: number) => x * 2)
    const cachedF = lazyCache(randomString(), f, 1000)

    const result1 = await cachedF(2)
    const result2 = await cachedF(2) // Same arg - cached
    const result3 = await cachedF(3) // Different arg - new call

    expect(result1).toBe(4)
    expect(result2).toBe(4)
    expect(result3).toBe(6)
    expect(f).toHaveBeenCalledTimes(2)
  })
})

// Simplified Sentry error reporting tests
describe('Sentry reporting', () => {
  const { redis } = require('../lib/redis')
  const Sentry = require('@sentry/node')

  beforeEach(async () => {
    stopHealthMonitoring()
    resetCacheState()
    jest.clearAllMocks()
    forceCacheStrategy('redis')
    await delay(10)
  })

  afterEach(async () => {
    stopHealthMonitoring()
    resetCacheState()
    await delay(10)
  })

  test('Sentry captureException is called on Redis errors', async () => {
    // Mock Redis to fail
    redis.smembers.mockRejectedValue(new Error('Redis connection failed'))

    const { redisSetMembers } = require('../lib/lazy-cache')

    // Don't await to avoid test failure from the error
    const promise = redisSetMembers('test-key').catch(() => {}) // Suppress error

    // Wait briefly for the async operation
    await delay(50)

    expect(Sentry.captureException).toHaveBeenCalled()

    // Ensure the promise is settled
    await promise
  })
})

// Simple tests for utilities
describe('Cache utilities', () => {
  beforeEach(async () => {
    stopHealthMonitoring()
    resetCacheState()
    jest.clearAllMocks()
    await delay(10)
  })

  afterEach(async () => {
    stopHealthMonitoring()
    resetCacheState()
    await delay(10)
  })

  test('getErrorStats returns statistics', () => {
    const stats = getErrorStats()
    expect(stats).toHaveProperty('errorCount')
    expect(stats).toHaveProperty('lastErrorReport')
  })

  test('cache strategy can be forced', () => {
    forceCacheStrategy('memory')
    expect(getCurrentCacheStrategy()).toBe('memory')

    forceCacheStrategy('redis')
    expect(getCurrentCacheStrategy()).toBe('redis')
  })

  test('redisSetMembers returns empty array with memory strategy', async () => {
    forceCacheStrategy('memory')
    const { redisSetMembers } = require('../lib/lazy-cache')
    const result = await redisSetMembers('test-key')
    expect(result).toEqual([])
  })
})

// Simplified edge case tests
describe('Edge cases', () => {
  beforeEach(async () => {
    stopHealthMonitoring()
    resetCacheState()
    jest.clearAllMocks()
    await delay(10)
  })

  afterEach(async () => {
    stopHealthMonitoring()
    resetCacheState()
    await delay(10)
  })

  test('function that returns undefined is cached properly', async () => {
    forceCacheStrategy('memory')
    const f = jest.fn().mockResolvedValue(undefined)
    const cachedF = lazyCache(randomString(), f, 1000)

    const result1 = await cachedF()
    const result2 = await cachedF()

    expect(result1).toBeUndefined()
    expect(result2).toBeUndefined()
    expect(f).toHaveBeenCalledTimes(1)
  })
})

// Add a global afterAll to ensure everything is cleaned up
afterAll(async () => {
  stopHealthMonitoring()
  resetCacheState()
  await delay(100) // Longer delay for final cleanup

  // Clean up module cache to prevent cross-test contamination
  jest.resetModules()
})
