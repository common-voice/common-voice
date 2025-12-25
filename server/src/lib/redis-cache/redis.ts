import * as Redis from 'ioredis'
import * as Redlock from 'redlock'
import { getConfig } from '../../config-helper'

// <=== Configure for automatic recovery and resilience
export const redis = new Redis(getConfig().REDIS_URL, {
  // Connection settings for resilience - use defaults for stability
  connectTimeout: 10_000, // Default 10s - allow time for slow networks
  commandTimeout: 10_000, // Default 10s - GCP Cloud SQL can be slow
  maxRetriesPerRequest: null, // Default null - unlimited retries for transient issues
  retryDelayOnFailover: 100,
  retryDelayOnTryAgain: 100,
  // Enable queuing for resilience during brief outages
  enableOfflineQueue: true, // Queue commands during short disconnects
  enableReadyCheck: true,
  autoResendUnfulfilledCommands: true, // Resend commands after reconnect

  // Auto-reconnection settings
  keepAlive: 30_000, // Standard keepalive
} as Redis.RedisOptions)

// Connection event logging
// redis.on('connect', () => console.debug('[Redis] Connecting...'))
redis.on('ready', () => console.info('[Redis] Ready and connected'))
redis.on('error', err => console.error('[Redis] Error:', err.message))
redis.on('close', () => console.warn('[Redis] Connection closed'))
redis.on('reconnecting', delay =>
  console.warn(`[Redis] Reconnecting in ${delay}ms`)
)
redis.on('end', () => console.warn('[Redis] Connection ended'))

export const redlock = new Redlock([redis], {
  // Retry strategy balanced for cache operations
  // Goal: Stay on Redis as long as possible to avoid memory cache issues
  // But don't exceed frontend timeout limits (~30-60s)
  retryCount: 30, // 30 attempts over 30-45 seconds
  retryDelay: 1000, // 1s base delay between retries
  retryJitter: 500, // Randomize 1-1.5s to reduce contention
  // Drift factor for clock skew across Redis instances
  driftFactor: 0.01,
})

// Never call redis.quit() - let ioredis handle reconnection automatically
export const useRedis = new Promise(resolve => {
  // If already connected, resolve immediately
  if (redis.status === 'ready') {
    // console.debug('[Redis] Already connected')
    resolve(true)
    return
  }

  // Otherwise wait for ready event
  const onReady = () => {
    // console.debug('[Redis] Connected via useRedis promise')
    cleanup()
    resolve(true)
  }

  const onError = (err: Error) => {
    console.error(
      `[Redis] Connection failed via useRedis promise: ${err.message}`
    )
    cleanup()
    resolve(false)
  }

  const cleanup = () => {
    redis.off('ready', onReady)
    redis.off('error', onError)
  }

  redis.once('ready', onReady)
  redis.once('error', onError)
}).then(val => {
  console.info('[Redis] Cache strategy:', val ? 'redis' : 'in-memory')
  return val
})
