// Function type for cached functions
export type Fn<T, S> = (...args: S[]) => Promise<T>

// Prefetch configuration
export interface PrefetchOptions {
  prefetch?: boolean
  prefetchBefore?: number // How long before expiry to trigger prefetch (in ms)
  // Example: For 1hr TTL with 25min prefetch → prefetchBefore: 25 * TimeUnits.MINUTE
}

// Prefetch registry entry
export interface PrefetchEntry {
  key: string
  cachedFunction: Fn<unknown, unknown>
  args: unknown[]
  timeMs: number // TTL
  lockDurationMs: number
  prefetchBefore: number // Trigger prefetch this many ms before expiry
}

// Cache strategy types
export type CacheStrategy = 'redis' | 'memory'

// Memory cache entry
export interface MemoryCacheEntry<T> {
  at?: number
  promise?: Promise<T>
  value?: T
}

// Custom error class for when data is being refreshed by another instance
export class DataRefreshInProgressError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DataRefreshInProgressError'
  }
}
