# Redis Cache Module

Centralized Redis caching infrastructure for Common Voice with automatic failover, health monitoring, and resilience features.

## Overview

This module provides:

- Single Redis connection shared across the application
- Automatic failover to in-memory cache when Redis is unavailable
- Proactive data prefetching to prevent cache stampede
- Distributed locking with Redlock
- Set-based caching for ID lists
- Health monitoring and circuit breaker pattern

## Tests

### Unit Tests

- **lazy-cache.test.ts** Tests all lazy-cache functionality including memory/Redis strategies, stale data handling, and locking
- **lazy-set-cache.test.ts** Tests LazySetCache operations including random selection, filtering, and pop behavior

### Integration/Simulation Tests

- **simulation.test.ts** Real-world scenario simulations including:
  - Thundering herd prevention (distributed locking)
  - Redis failure and recovery
  - LazySetCache workflows
  - Lock contention handling
  - Performance under load
  - Edge cases (empty sets, null values)

Run tests:

```bash
cd server
yarn test redis-cache
yarn test simulation.test
```

---

## Redis Connection Analysis

**Single Redis Connection:** The application uses ONE shared Redis connection instance exported from `redis.ts`. This connection is imported and reused throughout the codebase.

**Additional Redis Connections (via Bull queues):**

- `infrastructure/queues/queues.ts` - Bull job queue system (separate connection pool)
- `lib/queues/imageQueue.ts` - Image processing queue (separate connection)

The Bull queue connections are separate and managed by the Bull library. The main caching system uses a single shared connection to avoid connection pool exhaustion.

## Files

```txt
redis-cache/
├── redis.ts              - Single Redis client instance + Redlock
├── lazy-cache.ts         - Core caching with TTL and prefetch
├── lazy-set-cache.ts     - Set-based caching for ID lists
├── types.ts              - TypeScript type definitions
├── constants.ts          - Timing intervals and thresholds
├── config.ts             - Runtime configuration
└── index.ts              - Public exports
```

## Features

### 1. Lazy Cache (lazy-cache.ts)

TTL-based caching with automatic refresh and fallback strategies.

**Key Features:**

- TTL-based expiration
- Optional proactive prefetch before expiration
- Distributed locking to prevent thundering herd
- Automatic fallback to stale data when Redis fails
- Health monitoring with automatic recovery

**Basic Usage:**

```typescript
import lazyCache from './lib/redis-cache'
import { TimeUnits } from 'common'

// Simple caching
const getExpensiveData = lazyCache(
  'cache-key',
  async () => {
    // Expensive database query or API call
    return await database.query('SELECT ...')
  },
  TimeUnits.HOUR // Cache for 1 hour
)

// Call it like a regular function
const data = await getExpensiveData()
```

**With Parameters:**

```typescript
const getUserData = lazyCache(
  'user-data',
  async (userId: number) => {
    return await database.getUserById(userId)
  },
  TimeUnits.HOUR
)

// Each unique parameter combination is cached separately
const user1 = await getUserData(123)
const user2 = await getUserData(456)
```

**Stale Data Fallback:**

```typescript
const getLeaderboard = lazyCache(
  'global-leaderboard',
  async () => {
    return await database.getLeaderboard() // Takes 15-20 minutes
  },
  TimeUnits.HOUR,
  TimeUnits.MINUTE, // Lock timeout
  true // allowStale - serve old data if Redis fails
)
```

**Proactive Prefetch:**

```typescript
const getStatistics = lazyCache(
  'daily-stats',
  async () => {
    return await database.getDailyStats()
  },
  TimeUnits.HOUR,
  TimeUnits.MINUTE,
  true,
  {
    prefetch: true, // Enable background refresh
    prefetchBefore: 15 * TimeUnits.MINUTE, // Refresh 15min before expiry
  }
)
```

### 2. Lazy Set Cache (lazy-set-cache.ts)

Optimized caching for lists of IDs or simple values using Redis SETs.

**Key Features:**

- Low memory footprint
- Automatic number/string type parsing
- Random sampling with optional filtering
- Pop operations (retrieve and remove)

**Basic Usage:**

```typescript
import { LazySetCache } from './lib/redis-cache'
import { TimeUnits } from 'common'

// Cache a list of IDs
const result = await LazySetCache.use(
  'unvalidated-sentence-ids',
  async () => {
    // Fetch IDs from database
    return await db.query('SELECT id FROM sentences WHERE is_validated = 0')
  },
  TimeUnits.DAY
)
```

**Add single item to the Cache:**

```typescript
// Add single item
await LazySetCache.addSingleWithExpiry('user-skips', clipId, TimeUnits.HOUR)

// Add multiple items
await LazySetCache.addManyWithExpiry(
  'reported-sentences',
  [101, 102, 103],
  TimeUnits.DAY
)
```

**Get Random Items:**

```typescript
// Get 10 random IDs (without removing)
const randomIds = await LazySetCache.getRandom('sentence-pool', 10)

// Get and remove 10 random IDs
const assignedIds = await LazySetCache.getRandom('sentence-pool', 10, true)
```

**Filtered Random Selection:**

```typescript
// Get random items that match a filter
const validIds = await LazySetCache.getRandomWithFiltering(
  'all-sentences',
  5,
  (id: number) => id > 1000 // Only IDs greater than 1000
)

// Get and remove filtered items
const assignedSentences = await LazySetCache.getRandomWithFiltering(
  'sentence-pool',
  10,
  (id: number) => !excludedIds.includes(id),
  true // pop = true (remove from set)
)
```

**Replace Entire Set:**

```typescript
// Replace all values in the set
await LazySetCache.fill('active-users', [1, 2, 3, 4, 5], TimeUnits.HOUR)
```

### 3. Health Monitoring

Automatic health checks every 5 seconds with circuit breaker pattern.

**How it Works:**

- Pings Redis every 5 seconds
- After 5 consecutive failures, switches to in-memory cache
- Automatically recovers when Redis becomes available
- Serves stale data during outages (if allowStale is enabled)

**Monitor Status:**

```typescript
import { getCurrentCacheStrategy, getErrorStats } from './lib/redis-cache'

// Check current strategy
const strategy = getCurrentCacheStrategy() // 'redis' or 'memory'

// Get error statistics
const stats = getErrorStats()
console.log(stats.errorCount)
console.log(stats.lastErrorReport)
```

### 4. Distributed Locking

Prevents multiple pods from computing the same expensive operation simultaneously.

**Automatic Locking:**

```typescript
// Locking is automatic in lazyCache
const getData = lazyCache(
  'expensive-query',
  async () => {
    // Only ONE pod will execute this at a time
    return await database.expensiveQuery()
  },
  TimeUnits.HOUR,
  TimeUnits.MINUTE // Lock duration
)
```

**Manual Locking:**

```typescript
import { redlock } from './lib/redis-cache'

const lock = await redlock.lock('my-resource-lock', 5000)
try {
  // Do work while holding lock
  await doExclusiveWork()
} finally {
  await lock.unlock()
}
```

## Configuration

See redis.ts and constants.ts for current default timing values:

## Common Patterns

### Leaderboard Caching

```typescript
const getGlobalLeaderboard = lazyCache(
  'global-clip-leaderboard',
  async () => {
    // Expensive multi-join query
    return await db.getLeaderboardData()
  },
  TimeUnits.HOUR,
  TimeUnits.MINUTE,
  true, // Allow stale - better to show old data than overload DB
  {
    prefetch: true,
    prefetchBefore: 15 * TimeUnits.MINUTE,
  }
)
```

### User Activity Tracking

```typescript
// Track which clips a user has skipped
await LazySetCache.addSingleWithExpiry(
  `user-skips:${userId}`,
  clipId,
  TimeUnits.DAY
)

// Check if user already skipped a clip
const skippedClips = await LazySetCache.getMembers(`user-skips:${userId}`)
if (skippedClips.includes(clipId)) {
  // User already skipped this clip
}
```

### Random Assignment

```typescript
// Assign 10 random sentences to a user
const assignedSentences = await LazySetCache.getRandomWithFiltering(
  'available-sentences',
  10,
  (sentenceId: number) => !alreadySeenIds.includes(sentenceId),
  true // Remove from pool after assignment
)
```

## Error Handling

**Redis Connection Failure:**

- Automatically switches to in-memory cache
- Logs errors (rate-limited to prevent spam)
- Reports to Sentry for monitoring
- Continues serving stale data if allowStale is enabled

**Lock Acquisition Failure:**

- If another pod holds the lock, waits for fresh data
- If allowStale is enabled, serves stale data immediately
- Otherwise, throws DataRefreshInProgressError

**Network Issues:**

- Commands are queued during brief disconnects
- Automatic reconnection with exponential backoff
- Health checks detect and recover from failures

## Testing

Comprehensive test coverage in:

- `lazy-cache.test.ts` - 15 tests for core caching
- `lazy-set-cache.test.ts` - 41 tests for set operations

Run tests:

```bash
cd server
yarn test redis-cache
```

## Performance Considerations

**Memory Cache:**

- Used as fallback when Redis is unavailable
- No cross-pod sharing
- Limited by pod memory
- Cleared on pod restart

**Redis Cache:**

- Shared across all pods
- Persistent across restarts
- Network overhead for each operation
- Connection pooling handled by ioredis

**Set Cache vs Lazy Cache:**

- Use LazySetCache for ID lists (more efficient)
- Use lazyCache for complex objects
- LazySetCache has lower memory footprint
- LazySetCache supports efficient random sampling

## Notes

- Import from `./lib/redis-cache` instead of `./lib/lazy-cache`
- Redis client is singleton - do not create new instances
- Use LazySetCache for ID lists instead of caching full arrays

## Troubleshooting

**Cache not working:**

- Check Redis connection: `getCurrentCacheStrategy()`
- Review error logs: `getErrorStats()`
- Verify REDIS_URL is configured correctly

**Stale data being served:**

- This is expected when `allowStale: true` and Redis is down
- Check health status and Redis connectivity
- Review error logs for Redis failures

**Lock timeouts:**

- Increase lock duration for slow queries
- Check for competing pods executing same cache key
- Review Redlock retry configuration

**High memory usage:**

- Memory cache grows unbounded during Redis outages
- Review cached object sizes
- Consider using LazySetCache for large ID lists
- Increase Redis availability
