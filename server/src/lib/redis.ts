import * as Redis from 'ioredis'
import * as Redlock from 'redlock'
import { getConfig } from '../config-helper'

// <=== Configure for automatic recovery and resilience
export const redis = new Redis(getConfig().REDIS_URL, {
  // Connection settings for resilience
  connectTimeout: 5_000, // Timeout for slow connections (default 10_000)
  commandTimeout: 5_000, // Timeout for commands (default 10_000)
  maxRetriesPerRequest: 3, // Allow retries for temporary issues (default flushes after 20 retries)
  retryDelayOnFailover: 100,
  retryDelayOnTryAgain: 100,
  // Enable queuing for resilience during brief outages
  enableOfflineQueue: true, // Queue commands during short disconnects
  enableReadyCheck: true,
  autoResendUnfulfilledCommands: true, // Resend commands after reconnect

  // Auto-reconnection settings
  // lazyConnect: true, // Connect immediately!
  keepAlive: 30_000, // Standard keepalive
} as Redis.RedisOptions)

// Connection event logging
redis.on('connect', () => console.debug('[Redis] Connecting...'))
redis.on('ready', () => console.info('[Redis] Ready and connected'))
redis.on('error', err => console.error('[Redis] Error:', err.message))
redis.on('close', () => console.warn('[Redis] Connection closed'))
redis.on('reconnecting', delay =>
  console.warn(`[Redis] Reconnecting in ${delay}ms`)
)
redis.on('end', () => console.warn('[Redis] Connection ended'))

export const redlock = new Redlock([redis], {
  retryCount: 2, // Allow some retries for locks
  retryDelay: 100,
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
      '[Redis] Connection failed via useRedis promise:',
      err.message
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
