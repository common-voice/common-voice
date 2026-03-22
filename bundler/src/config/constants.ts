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

/**
 * If a locale has been in the processing HASH longer than this, assume the
 * pod that claimed it has crashed and allow another pod to take over.
 * Set to 2x lock duration to give a healthy pod time to renew its lock.
 */
export const PROCESSING_STALE_MS = 2 * BULLMQ_LOCK_DURATION_MS // 20 min

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

/**
 * Concurrent GCS clip downloads per pod. Configurable via CLIP_DOWNLOAD_CONCURRENCY env var.
 * Capped at 128: each in-flight download holds a full clip buffer in memory (~30-200 KB avg).
 * 64 x 200 KB = ~13 MB peak buffer overhead -- safe on a 4 Gi pod.
 */
export const CLIP_DOWNLOAD_CONCURRENCY = Math.max(
  1,
  Math.min(128, parseInt(process.env.CLIP_DOWNLOAD_CONCURRENCY ?? '', 10) || 64),
)
export const MIN_AUDIO_DURATION_MS = 500 // clips below this duration are flagged TOO_SHORT (WARN)
export const CLIP_DURATION_WARN_MS = 17_000 // clips above this duration are flagged LONG (WARN)
export const MAX_AUDIO_DURATION_MS = 30_000 // clips above this duration are excluded (TOO_LONG / EXCLUDED)

// ---------------------------------------------------------------------------
// Tarball file allowlists
// ---------------------------------------------------------------------------

/**
 * Files allowed in metadata tarballs (TSVs + datasheet, no audio).
 * Anything not in this set is silently skipped -- prevents intermediate
 * files (clips.tsv, temp files) from leaking into shipped archives.
 */
export const METADATA_ALLOWED_FILES = new Set([
  // DataSheet
  'README.md',
  // mp3-duration-reporter output (clip durations)
  'clip_durations.tsv',
  // CorporaCreator output files - main buckets
  'validated.tsv',
  'invalidated.tsv',
  'other.tsv',
  // CorporaCreator output files - training splits
  'train.tsv',
  'dev.tsv',
  'test.tsv',
  // Reported
  'reported.tsv',
  // Text Corpus
  'validated_sentences.tsv',
  'unvalidated_sentences.tsv',
])

/**
 * Files allowed in main release tarballs (metadata + clips/ directory).
 * The clips/ directory is handled separately (it's a directory, not a file).
 */
export const RELEASE_ALLOWED_FILES = new Set([
  ...METADATA_ALLOWED_FILES,
  'clips',  // directory -- included by tar traversal
])

/**
 * Returns true if a filename (not path) is allowed in the release tarball.
 * For delta releases, CC split files (dev/test/train) are also excluded.
 */
export const isAllowedInRelease = (filename: string, isDelta: boolean): boolean => {
  if (!RELEASE_ALLOWED_FILES.has(filename)) return false
  if (isDelta && (filename === 'dev.tsv' || filename === 'test.tsv' || filename === 'train.tsv')) return false
  return true
}

/**
 * Returns true if a filename (not path) is allowed in the metadata tarball.
 * For delta releases, CC split files (dev/test/train) are also excluded.
 */
export const isAllowedInMetadata = (filename: string, isDelta: boolean): boolean => {
  if (!METADATA_ALLOWED_FILES.has(filename)) return false
  if (isDelta && (filename === 'dev.tsv' || filename === 'test.tsv' || filename === 'train.tsv')) return false
  return true
}

// ---------------------------------------------------------------------------
// Release logging
// ---------------------------------------------------------------------------

/** Upload a GCS snapshot of accumulated logs every N completed locales. */
export const RELEASE_LOG_FLUSH_INTERVAL = 10

/** Max time between GCS log flushes (ms). Ensures logs are uploaded even when
 *  large locales take a long time to process, regardless of job count. */
export const RELEASE_LOG_FLUSH_MAX_AGE_MS = 10 * 60 * 1000

/**
 * TTL applied to all release-scoped Redis keys.
 * Acts as a safety net -- keys are explicitly cleaned up after a successful
 * run, but the TTL ensures they expire even if cleanup fails or the process
 * crashes. With parallel clip downloads a full run completes in hours,
 * so 24 h gives ample headroom for restarts while keeping Redis lean.
 */
export const RELEASE_LOG_KEY_TTL_SEC = TimeUnitsSec.DAY
