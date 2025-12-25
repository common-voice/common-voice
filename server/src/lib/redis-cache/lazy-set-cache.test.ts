/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import { LazySetCache } from './lazy-set-cache'
import { TimeUnits } from 'common'

// Mock Redis
jest.mock('./redis', () => {
  const mockRedis = {
    sadd: jest.fn().mockResolvedValue(1),
    expire: jest.fn().mockResolvedValue(1),
    smembers: jest.fn().mockResolvedValue([]),
    scard: jest.fn().mockResolvedValue(0),
    srandmember: jest.fn().mockResolvedValue([]),
    spop: jest.fn().mockResolvedValue([]),
    srem: jest.fn().mockResolvedValue(1),
    del: jest.fn().mockResolvedValue(1),
    multi: jest.fn(() => ({
      del: jest.fn().mockReturnThis(),
      sadd: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    })),
  }

  const mockRedlock = {
    lock: jest.fn().mockResolvedValue({
      unlock: jest.fn().mockResolvedValue(undefined),
    }),
  }

  return {
    redis: mockRedis,
    redlock: mockRedlock,
  }
})

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('LazySetCache', () => {
  const { redis, redlock } = require('./redis')

  beforeEach(() => {
    jest.clearAllMocks()

    // Reset default mock implementations
    redis.sadd.mockResolvedValue(1)
    redis.expire.mockResolvedValue(1)
    redis.smembers.mockResolvedValue([])
    redis.scard.mockResolvedValue(0)
    redis.srandmember.mockResolvedValue([])
    redis.spop.mockResolvedValue([])
    redis.srem.mockResolvedValue(1)
    redis.del.mockResolvedValue(1)

    const mockPipeline = {
      del: jest.fn().mockReturnThis(),
      sadd: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }
    redis.multi.mockReturnValue(mockPipeline)

    redlock.lock.mockResolvedValue({
      unlock: jest.fn().mockResolvedValue(undefined),
    })
  })

  describe('addSingleWithExpiry', () => {
    test('adds single number to Redis set with TTL', async () => {
      await LazySetCache.addSingleWithExpiry('test-key', 123, 5000)

      expect(redis.sadd).toHaveBeenCalledWith('test-key', '123')
      expect(redis.expire).toHaveBeenCalledWith('test-key', 5)
    })

    test('adds single string to Redis set with TTL', async () => {
      await LazySetCache.addSingleWithExpiry('test-key', 'value', 10000)

      expect(redis.sadd).toHaveBeenCalledWith('test-key', 'value')
      expect(redis.expire).toHaveBeenCalledWith('test-key', 10)
    })

    test('converts milliseconds to seconds for TTL', async () => {
      await LazySetCache.addSingleWithExpiry('test-key', 1, TimeUnits.HOUR)

      expect(redis.expire).toHaveBeenCalledWith('test-key', 3600)
    })
  })

  describe('addManyWithExpiry', () => {
    test('adds multiple numbers to Redis set with TTL', async () => {
      await LazySetCache.addManyWithExpiry('test-key', [1, 2, 3], 5000)

      expect(redis.sadd).toHaveBeenCalledWith('test-key', '1', '2', '3')
      expect(redis.expire).toHaveBeenCalledWith('test-key', 5)
    })

    test('adds multiple strings to Redis set with TTL', async () => {
      await LazySetCache.addManyWithExpiry('test-key', ['a', 'b', 'c'], 5000)

      expect(redis.sadd).toHaveBeenCalledWith('test-key', 'a', 'b', 'c')
      expect(redis.expire).toHaveBeenCalledWith('test-key', 5)
    })

    test('handles mixed types (numbers and strings)', async () => {
      await LazySetCache.addManyWithExpiry('test-key', [1, 'a', 2, 'b'], 5000)

      expect(redis.sadd).toHaveBeenCalledWith('test-key', '1', 'a', '2', 'b')
      expect(redis.expire).toHaveBeenCalledWith('test-key', 5)
    })

    test('does nothing when array is empty', async () => {
      await LazySetCache.addManyWithExpiry('test-key', [], 5000)

      expect(redis.sadd).not.toHaveBeenCalled()
      expect(redis.expire).not.toHaveBeenCalled()
    })
  })

  describe('fill', () => {
    test('replaces set with new values', async () => {
      const mockPipeline = {
        del: jest.fn().mockReturnThis(),
        sadd: jest.fn().mockReturnThis(),
        expire: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      }
      redis.multi.mockReturnValue(mockPipeline)

      await LazySetCache.fill('test-key', [1, 2, 3], 5000)

      expect(mockPipeline.del).toHaveBeenCalledWith('test-key')
      expect(mockPipeline.sadd).toHaveBeenCalledWith('test-key', '1', '2', '3')
      expect(mockPipeline.expire).toHaveBeenCalledWith('test-key', 5)
      expect(mockPipeline.exec).toHaveBeenCalled()
    })

    test('handles empty array by storing placeholder', async () => {
      const mockPipeline = {
        del: jest.fn().mockReturnThis(),
        sadd: jest.fn().mockReturnThis(),
        expire: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      }
      redis.multi.mockReturnValue(mockPipeline)

      await LazySetCache.fill('test-key', [], 5000)

      expect(mockPipeline.del).toHaveBeenCalledWith('test-key')
      expect(mockPipeline.sadd).toHaveBeenCalledWith('test-key', '__EMPTY__')
      expect(mockPipeline.expire).toHaveBeenCalledWith('test-key', 5)
    })
  })

  describe('getMembers', () => {
    test('returns numbers when members are numeric strings', async () => {
      redis.smembers.mockResolvedValue(['1', '2', '3'])

      const result = await LazySetCache.getMembers('test-key')

      expect(result).toEqual([1, 2, 3])
      expect(redis.smembers).toHaveBeenCalledWith('test-key')
    })

    test('returns strings when members are non-numeric', async () => {
      redis.smembers.mockResolvedValue(['a', 'b', 'c'])

      const result = await LazySetCache.getMembers('test-key')

      expect(result).toEqual(['a', 'b', 'c'])
    })

    test('handles mixed numeric and non-numeric strings', async () => {
      redis.smembers.mockResolvedValue(['1', 'a', '2', 'b'])

      const result = await LazySetCache.getMembers('test-key')

      expect(result).toEqual([1, 'a', 2, 'b'])
    })

    test('returns empty array when set is empty', async () => {
      redis.smembers.mockResolvedValue([])

      const result = await LazySetCache.getMembers('test-key')

      expect(result).toEqual([])
    })
  })

  describe('getRandom', () => {
    test('returns random members from set', async () => {
      redis.srandmember.mockResolvedValue(['1', '2', '3'])

      const result = await LazySetCache.getRandom('test-key', 3)

      expect(result).toEqual(['1', '2', '3'])
      expect(redis.srandmember).toHaveBeenCalledWith('test-key', 3)
    })

    test('handles negative count for duplicates', async () => {
      redis.srandmember.mockResolvedValue(['1', '1', '2'])

      const result = await LazySetCache.getRandom('test-key', -3)

      expect(result).toEqual(['1', '1', '2'])
      expect(redis.srandmember).toHaveBeenCalledWith('test-key', -3)
    })

    test('pops random numbers when pop=true', async () => {
      redis.spop.mockResolvedValue(['1', '2', '3'])

      const result = await LazySetCache.getRandom('test-key', 3, true)

      expect(result).toEqual([1, 2, 3])
      expect(redis.spop).toHaveBeenCalledWith('test-key', 3)
      expect(redis.srandmember).not.toHaveBeenCalled()
    })

    test('pops random strings when pop=true', async () => {
      redis.spop.mockResolvedValue(['a', 'b', 'c'])

      const result = await LazySetCache.getRandom('test-key', 3, true)

      expect(result).toEqual(['a', 'b', 'c'])
    })

    test('handles mixed numeric and non-numeric values with pop=true', async () => {
      redis.spop.mockResolvedValue(['1', 'a', '2', 'b'])

      const result = await LazySetCache.getRandom('test-key', 4, true)

      expect(result).toEqual([1, 'a', 2, 'b'])
    })

    test('returns empty array when set is empty with pop=true', async () => {
      redis.spop.mockResolvedValue(null)

      const result = await LazySetCache.getRandom('test-key', 5, true)

      expect(result).toEqual([])
    })

    test('handles single value response with pop=true', async () => {
      redis.spop.mockResolvedValue('42')

      const result = await LazySetCache.getRandom('test-key', 1, true)

      expect(result).toEqual([42])
    })
  })

  describe('getRandomWithFiltering', () => {
    test('filters results by provided function', async () => {
      redis.srandmember
        .mockResolvedValueOnce(['1', '2', '3', '4', '5'])
        .mockResolvedValue([])

      const filterFn = (item: number) => item > 2

      const result = await LazySetCache.getRandomWithFiltering(
        'test-key',
        2,
        filterFn
      )

      expect(result.length).toBeLessThanOrEqual(2)
      expect(result.every(item => item > 2)).toBe(true)
    })

    test('retries if not enough items match filter', async () => {
      redis.srandmember
        .mockResolvedValueOnce(['1', '2'])
        .mockResolvedValueOnce(['3', '4', '5'])
        .mockResolvedValue([])

      const filterFn = (item: number) => item > 2

      const result = await LazySetCache.getRandomWithFiltering(
        'test-key',
        2,
        filterFn
      )

      expect(result.length).toBeLessThanOrEqual(2)
      expect(redis.srandmember).toHaveBeenCalledTimes(2)
    })

    test('stops after max tries', async () => {
      redis.srandmember.mockResolvedValue(['1', '2'])

      const filterFn = (item: number) => item > 10 // Never matches

      const result = await LazySetCache.getRandomWithFiltering(
        'test-key',
        5,
        filterFn
      )

      expect(result).toEqual([])
      expect(redis.srandmember).toHaveBeenCalledTimes(10) // maxTries
    })

    test('handles string filtering', async () => {
      redis.srandmember
        .mockResolvedValueOnce(['apple', 'banana', 'cherry', 'date'])
        .mockResolvedValue([])

      const filterFn = (item: string) =>
        item.startsWith('a') || item.startsWith('c')

      const result = await LazySetCache.getRandomWithFiltering(
        'test-key',
        2,
        filterFn
      )

      expect(result.length).toBeLessThanOrEqual(2)
      expect(
        result.every(item => item.startsWith('a') || item.startsWith('c'))
      ).toBe(true)
    })

    test('returns unique results', async () => {
      redis.srandmember
        .mockResolvedValueOnce(['3', '3', '4', '5'])
        .mockResolvedValue([])

      const filterFn = (item: number) => item > 2

      const result = await LazySetCache.getRandomWithFiltering(
        'test-key',
        3,
        filterFn
      )

      const uniqueSet = new Set(result)
      expect(uniqueSet.size).toBe(result.length) // All items are unique
    })

    test('removes and returns filtered items with pop=true', async () => {
      redis.srandmember
        .mockResolvedValueOnce(['1', '2', '3', '4', '5'])
        .mockResolvedValue([])

      const filterFn = (item: number) => item > 2

      const result = await LazySetCache.getRandomWithFiltering(
        'test-key',
        2,
        filterFn,
        true
      )

      expect(result.length).toBeLessThanOrEqual(2)
      expect(result.every(item => item > 2)).toBe(true)
      expect(redis.srem).toHaveBeenCalled()
    })

    test('removes items from Redis set with pop=true', async () => {
      redis.srandmember
        .mockResolvedValueOnce(['1', '2', '3', '4', '5'])
        .mockResolvedValue([])

      const filterFn = (item: number) => item > 2

      await LazySetCache.getRandomWithFiltering('test-key', 2, filterFn, true)

      const callArgs = redis.srem.mock.calls[0]
      expect(callArgs[0]).toBe('test-key')
      expect(callArgs.length).toBeGreaterThan(1)
    })

    test('retries if not enough items match filter with pop=true', async () => {
      redis.srandmember
        .mockResolvedValueOnce(['1', '2'])
        .mockResolvedValueOnce(['3', '4', '5'])
        .mockResolvedValue([])

      const filterFn = (item: number) => item > 2

      const result = await LazySetCache.getRandomWithFiltering(
        'test-key',
        3,
        filterFn,
        true
      )

      expect(result.length).toBeLessThanOrEqual(3)
      expect(redis.srandmember).toHaveBeenCalledTimes(2)
      expect(redis.srem).toHaveBeenCalled()
    })

    test('does not remove anything when pop=false', async () => {
      redis.srandmember
        .mockResolvedValueOnce(['1', '2', '3', '4', '5'])
        .mockResolvedValue([])

      const filterFn = (item: number) => item > 2

      await LazySetCache.getRandomWithFiltering('test-key', 2, filterFn, false)

      expect(redis.srem).not.toHaveBeenCalled()
    })

    test('returns unique results without duplicates with pop=true', async () => {
      redis.srandmember
        .mockResolvedValueOnce(['3', '4', '5', '6', '7'])
        .mockResolvedValue([])

      const filterFn = (item: number) => item > 2

      const result = await LazySetCache.getRandomWithFiltering(
        'test-key',
        3,
        filterFn,
        true
      )

      const uniqueSet = new Set(result)
      expect(uniqueSet.size).toBe(result.length)
      expect(result.length).toBe(3)
    })

    test('does not remove already returned items with pop=true', async () => {
      redis.srandmember
        .mockResolvedValueOnce(['3', '4', '5'])
        .mockResolvedValueOnce(['4', '5', '6']) // 4 and 5 already popped
        .mockResolvedValue([])

      const filterFn = (item: number) => item > 2

      await LazySetCache.getRandomWithFiltering('test-key', 5, filterFn, true)

      // Check that srem was called with unique items
      const allRemoved: number[] = []
      redis.srem.mock.calls.forEach((call: any) => {
        const items = call.slice(1).map((s: string) => Number(s))
        allRemoved.push(...items)
      })

      const uniqueRemoved = new Set(allRemoved)
      expect(uniqueRemoved.size).toBe(allRemoved.length)
    })

    test('handles empty results from srandmember with pop=true', async () => {
      redis.srandmember.mockResolvedValue([])

      const filterFn = (item: number) => item > 2

      const result = await LazySetCache.getRandomWithFiltering(
        'test-key',
        5,
        filterFn,
        true
      )

      expect(result).toEqual([])
      expect(redis.srem).not.toHaveBeenCalled()
    })
  })

  describe('use', () => {
    test('returns cached data if available', async () => {
      redis.scard.mockResolvedValue(3)
      redis.smembers.mockResolvedValue(['1', '2', '3'])

      const fetchFn = jest.fn().mockResolvedValue([4, 5, 6])

      const result = await LazySetCache.use('test-key', fetchFn, 5000)

      expect(result).toEqual([1, 2, 3])
      expect(fetchFn).not.toHaveBeenCalled()
      expect(redlock.lock).not.toHaveBeenCalled()
    })

    test('fetches fresh data when cache is empty', async () => {
      redis.scard.mockResolvedValue(0)
      const mockPipeline = {
        del: jest.fn().mockReturnThis(),
        sadd: jest.fn().mockReturnThis(),
        expire: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      }
      redis.multi.mockReturnValue(mockPipeline)

      const fetchFn = jest.fn().mockResolvedValue([1, 2, 3])

      const result = await LazySetCache.use('test-key', fetchFn, 5000)

      expect(result).toEqual([1, 2, 3])
      expect(fetchFn).toHaveBeenCalledTimes(1)
      expect(redlock.lock).toHaveBeenCalled()
    })

    test('acquires lock before fetching fresh data', async () => {
      redis.scard.mockResolvedValue(0)
      const mockPipeline = {
        del: jest.fn().mockReturnThis(),
        sadd: jest.fn().mockReturnThis(),
        expire: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      }
      redis.multi.mockReturnValue(mockPipeline)

      const mockUnlock = jest.fn().mockResolvedValue(undefined)
      redlock.lock.mockResolvedValue({ unlock: mockUnlock })

      const fetchFn = jest.fn().mockResolvedValue([1, 2, 3])

      await LazySetCache.use('test-key', fetchFn, 5000, 10000)

      expect(redlock.lock).toHaveBeenCalledWith('test-key:lock', 10000)
      expect(mockUnlock).toHaveBeenCalled()
    })

    test('fills cache with fresh data', async () => {
      redis.scard.mockResolvedValue(0)
      const mockPipeline = {
        del: jest.fn().mockReturnThis(),
        sadd: jest.fn().mockReturnThis(),
        expire: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      }
      redis.multi.mockReturnValue(mockPipeline)

      const fetchFn = jest.fn().mockResolvedValue([10, 20, 30])

      await LazySetCache.use('test-key', fetchFn, 5000)

      expect(mockPipeline.del).toHaveBeenCalledWith('test-key')
      expect(mockPipeline.sadd).toHaveBeenCalledWith(
        'test-key',
        '10',
        '20',
        '30'
      )
      expect(mockPipeline.expire).toHaveBeenCalledWith('test-key', 5)
    })

    test('handles empty result from fetch function', async () => {
      redis.scard.mockResolvedValue(0)
      const mockPipeline = {
        del: jest.fn().mockReturnThis(),
        sadd: jest.fn().mockReturnThis(),
        expire: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      }
      redis.multi.mockReturnValue(mockPipeline)

      const fetchFn = jest.fn().mockResolvedValue([])

      const result = await LazySetCache.use('test-key', fetchFn, 5000)

      expect(result).toEqual([])
      expect(mockPipeline.sadd).toHaveBeenCalledWith('test-key', '__EMPTY__')
    })

    test('uses default lock duration', async () => {
      redis.scard.mockResolvedValue(0)
      const mockPipeline = {
        del: jest.fn().mockReturnThis(),
        sadd: jest.fn().mockReturnThis(),
        expire: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      }
      redis.multi.mockReturnValue(mockPipeline)

      const fetchFn = jest.fn().mockResolvedValue([1])

      await LazySetCache.use('test-key', fetchFn, 5000)

      expect(redlock.lock).toHaveBeenCalledWith(
        'test-key:lock',
        TimeUnits.MINUTE
      )
    })

    test('releases lock even if fetch fails', async () => {
      redis.scard.mockResolvedValue(0)
      const mockUnlock = jest.fn().mockResolvedValue(undefined)
      redlock.lock.mockResolvedValue({ unlock: mockUnlock })

      const fetchFn = jest.fn().mockRejectedValue(new Error('Fetch failed'))

      await expect(LazySetCache.use('test-key', fetchFn, 5000)).rejects.toThrow(
        'Fetch failed'
      )

      expect(mockUnlock).toHaveBeenCalled()
    })
  })

  describe('Integration scenarios', () => {
    test('complete workflow: add, get, and random selection', async () => {
      // Step 1: Add values
      await LazySetCache.addManyWithExpiry('user-ids', [1, 2, 3, 4, 5], 5000)

      // Step 2: Get all members
      redis.smembers.mockResolvedValue(['1', '2', '3', '4', '5'])
      const allMembers = await LazySetCache.getMembers('user-ids')
      expect(allMembers).toEqual([1, 2, 3, 4, 5])

      // Step 3: Get random subset
      redis.srandmember.mockResolvedValue(['2', '4'])
      const randomSubset = await LazySetCache.getRandom('user-ids', 2)
      expect(randomSubset).toEqual(['2', '4'])
    })

    test('cache miss and refresh workflow', async () => {
      const mockPipeline = {
        del: jest.fn().mockReturnThis(),
        sadd: jest.fn().mockReturnThis(),
        expire: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      }
      redis.multi.mockReturnValue(mockPipeline)

      // First call - cache miss
      redis.scard.mockResolvedValueOnce(0)
      const fetchFn = jest.fn().mockResolvedValue([100, 200, 300])

      const result1 = await LazySetCache.use('data-key', fetchFn, 10000)

      expect(result1).toEqual([100, 200, 300])
      expect(fetchFn).toHaveBeenCalledTimes(1)

      // Second call - cache hit
      redis.scard.mockResolvedValueOnce(3)
      redis.smembers.mockResolvedValue(['100', '200', '300'])

      const result2 = await LazySetCache.use('data-key', fetchFn, 10000)

      expect(result2).toEqual([100, 200, 300])
      expect(fetchFn).toHaveBeenCalledTimes(1) // Still just once
    })
  })
})
