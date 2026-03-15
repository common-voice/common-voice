// ---------------------------------------------------------------------------
// Time-unit enums
// ---------------------------------------------------------------------------

/** Duration constants in milliseconds. */
export enum TimeUnitsMs {
  SECOND = 1_000,
  MINUTE = 60_000,
  HOUR = 3_600_000,
  DAY = 86_400_000,
  WEEK = 604_800_000,
}

/** Duration constants in seconds. */
export enum TimeUnitsSec {
  SECOND = 1,
  MINUTE = 60,
  HOUR = 3_600,
  DAY = 86_400,
  WEEK = 604_800,
}

// ---------------------------------------------------------------------------
// BullMQ lock settings
// ---------------------------------------------------------------------------

/** Lock duration for BullMQ worker jobs. Must match LOCK_EXTEND_MS. */
export const BULLMQ_LOCK_DURATION_MS = 600_000 // 10 min

/** Amount to extend the lock by on each renewal. Must equal BULLMQ_LOCK_DURATION_MS. */
export const LOCK_EXTEND_MS = BULLMQ_LOCK_DURATION_MS

/** Interval between lock extension attempts. Must be < BULLMQ_LOCK_DURATION_MS. */
export const LOCK_EXTEND_INTERVAL_MS = 300_000 // 5 min

// ---------------------------------------------------------------------------
// Redlock settings
// ---------------------------------------------------------------------------

export const REDLOCK_RETRY_COUNT = 10 // max attempts before giving up
export const REDLOCK_RETRY_DELAY_MS = 500 // ms between attempts
export const REDLOCK_RETRY_JITTER_MS = 100 // +/- random jitter to spread concurrent retries

// ---------------------------------------------------------------------------
// Audio clip quality thresholds
// ---------------------------------------------------------------------------

export const MIN_AUDIO_SIZE_BYTES = 256 // GCS objects at or below this size are considered corrupt

/** Concurrent GCS clip downloads per pod. Configurable via CLIP_DOWNLOAD_CONCURRENCY env var. */
export const CLIP_DOWNLOAD_CONCURRENCY = Math.max(
  1,
  Math.min(256, parseInt(process.env.CLIP_DOWNLOAD_CONCURRENCY ?? '', 10) || 32),
)
export const MIN_AUDIO_DURATION_MS = 500 // clips below this duration are flagged TOO_SHORT (WARN)
export const CLIP_DURATION_WARN_MS = 17_000 // clips above this duration are flagged LONG (WARN)
export const MAX_AUDIO_DURATION_MS = 30_000 // clips above this duration are excluded (TOO_LONG / EXCLUDED)

// ---------------------------------------------------------------------------
// Release logging
// ---------------------------------------------------------------------------

/** Upload a GCS snapshot of accumulated logs every N completed locales. */
export const RELEASE_LOG_FLUSH_INTERVAL = 10

/**
 * TTL applied to all release-scoped Redis keys.
 * Keeps data accessible for post-release review without permanent accumulation.
 */
export const RELEASE_LOG_KEY_TTL_SEC = TimeUnitsSec.WEEK
